export type MailEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
};
const recipient = "m3gfarmslimited77@gmail.com";
const interests = new Set([
  "Forage & grass production",
  "Livestock farming",
  "Agro processing",
  "Agribusiness development",
  "Charcoal & biomass",
  "Partnership opportunities",
  "General enquiry",
]);
const buckets = new Map<string, { count: number; until: number }>();
const reply = (status: number, body: Record<string, unknown>) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
const validEmail = (value: string) =>
  value.length <= 254 &&
  /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(value);

export async function handleContact(
  request: Request,
  env: MailEnvironment,
  send: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST")
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const origin = request.headers.get("Origin");
  if (!origin || origin !== new URL(request.url).origin)
    return reply(403, {
      error: "Please send your enquiry from the M3G Farms website.",
    });
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    return reply(415, { error: "Please submit the enquiry form." });
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    "local";
  const now = Date.now();
  for (const [key, value] of buckets)
    if (value.until < now) buckets.delete(key);
  const bucket = buckets.get(ip);
  if (bucket && bucket.count >= 5)
    return reply(429, {
      error: "Too many enquiries. Please wait a few minutes and try again.",
    });
  if (buckets.size > 10000)
    return reply(429, {
      error: "The enquiry service is busy. Please try again shortly.",
    });
  buckets.set(ip, {
    count: (bucket?.count ?? 0) + 1,
    until: bucket?.until ?? now + 600000,
  });
  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, { error: "Your enquiry is empty." });
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 16000) {
        await reader.cancel();
        return reply(413, { error: "Your enquiry is too long." });
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const c of chunks) {
      bytes.set(c, offset);
      offset += c.length;
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error();
    data = parsed;
  } catch {
    return reply(400, { error: "Please check your enquiry and try again." });
  }
  if (data.website)
    return reply(400, {
      error: "We couldn’t validate this enquiry. Please email us directly.",
    });
  const text = (key: string) =>
    typeof data[key] === "string" ? (data[key] as string).trim() : "";
  const name = text("name"),
    email = text("email"),
    company = text("company"),
    interest = text("interest"),
    message = text("message");
  if (
    name.length < 2 ||
    name.length > 100 ||
    /[\r\n]/.test(name) ||
    !validEmail(email) ||
    company.length > 150 ||
    !interests.has(interest) ||
    message.length < 10 ||
    message.length > 5000 ||
    data.consent !== "on"
  )
    return reply(400, {
      error:
        "Please provide a valid name, email, area of interest, message (10–5,000 characters), and consent.",
    });
  if (
    typeof data.startedAt !== "number" ||
    !Number.isFinite(data.startedAt) ||
    now - data.startedAt < 1500 ||
    data.startedAt > now
  )
    return reply(400, {
      error: "Please take a moment to review your enquiry, then try again.",
    });
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL)
    return reply(503, {
      error:
        "Our enquiry service is being connected. Please email m3gfarmslimited77@gmail.com directly.",
    });
  try {
    const result = await send("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [recipient],
        reply_to: email,
        subject: `M3G Farms enquiry: ${interest}`,
        text: `New website enquiry\n\nName: ${name}\nEmail: ${email}\nOrganisation: ${company || "Not supplied"}\nInterest: ${interest}\n\n${message}\n\nConsent: Visitor agreed to use of their details to respond to this enquiry.`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!result.ok)
      return reply(502, {
        error:
          "We couldn’t deliver your enquiry just now. Please try again later or email us directly.",
      });
    const body = (await result.json()) as { id?: string };
    if (!body.id)
      return reply(502, {
        error: "Delivery could not be confirmed. Please email us directly.",
      });
    return reply(200, { ok: true });
  } catch {
    return reply(502, {
      error:
        "The email service is unavailable. Please try again later or email us directly.",
    });
  }
}
