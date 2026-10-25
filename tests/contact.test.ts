import test from "node:test";
import assert from "node:assert/strict";
import { handleContact } from "../lib/contact.ts";
let address = 0;
function request(
  overrides: Record<string, unknown> = {},
  origin = "https://m3g.example",
) {
  return new Request("https://m3g.example/api/contact", {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      "CF-Connecting-IP": `test-${address++}`,
    },
    body: JSON.stringify({
      name: "Test Visitor",
      email: "visitor@example.com",
      company: "Test Organisation",
      interest: "General enquiry",
      message: "We would like to discuss a forage partnership.",
      consent: "on",
      website: "",
      startedAt: Date.now() - 5000,
      ...overrides,
    }),
  });
}
test("rejects foreign origins", async () => {
  assert.equal(
    (await handleContact(request({}, "https://elsewhere.example"), {})).status,
    403,
  );
});
test("validates email and consent", async () => {
  for (const data of [
    { email: "invalid" },
    { consent: "" },
    { interest: "invalid" },
    { message: "short" },
    { name: "x" },
  ])
    assert.equal((await handleContact(request(data), {})).status, 400);
});
test("honeypot and timing reject automated enquiries", async () => {
  assert.equal(
    (await handleContact(request({ website: "spam" }), {})).status,
    400,
  );
  assert.equal(
    (await handleContact(request({ startedAt: Date.now() + 10000 }), {}))
      .status,
    400,
  );
});
test("missing credentials never claim delivery", async () => {
  assert.equal((await handleContact(request(), {})).status, 503);
});
test("sends only to fixed admin with visitor reply-to", async () => {
  let sent = false;
  const mocked = (async (url: unknown, init: RequestInit) => {
    assert.equal(url, "https://api.resend.com/emails");
    const body = JSON.parse(init.body as string);
    assert.deepEqual(body.to, ["m3gfarmslimited77@gmail.com"]);
    assert.equal(body.reply_to, "visitor@example.com");
    assert.ok(body.text.includes("Test Visitor"));
    sent = true;
    return Response.json({ id: "mock-email-id" });
  }) as typeof fetch;
  const result = await handleContact(
    request(),
    {
      RESEND_API_KEY: "test-key",
      CONTACT_FROM_EMAIL: "M3G <contact@example.com>",
    },
    mocked,
  );
  assert.equal(result.status, 200);
  assert.equal(sent, true);
});
test("provider failure is surfaced truthfully", async () => {
  const result = await handleContact(
    request(),
    { RESEND_API_KEY: "test-key", CONTACT_FROM_EMAIL: "contact@example.com" },
    (async () =>
      Response.json({ error: "failed" }, { status: 500 })) as typeof fetch,
  );
  assert.equal(result.status, 502);
});
test("oversized requests are rejected", async () => {
  assert.equal(
    (await handleContact(request({ message: "x".repeat(17000) }), {})).status,
    413,
  );
});
test("limits repeat submissions", async () => {
  let result: Response;
  for (let i = 0; i < 6; i++) {
    const r = request();
    r.headers.set("CF-Connecting-IP", "rate-limit-test");
    result = await handleContact(r, {});
  }
  assert.equal(result!.status, 429);
});
