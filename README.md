# M3G Farms portfolio

A responsive company portfolio based on the 12-page M3G Farms company profile. Built with React 19, TypeScript, Vinext (Next.js App Router conventions), Vite, and a Cloudflare Worker. It includes light/dark themes, mobile navigation, accessible forage tabs, a visible registration number, partnership links, a downloadable company profile, and a server-side contact form.

## Run locally

Requires Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by the development server (normally http://localhost:5173).

```sh
npm run build
npm start
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test tests/contact.test.ts
```

## Email setup (Resend)

The recipient is fixed server-side to **m3gfarmslimited77@gmail.com**. Visitors cannot override it. The visitor's validated email becomes reply_to; sending always uses your verified domain.

1. Create a Resend API key with sending access and verify a sending domain in Resend.
2. Set these runtime values using the Sites environment-variable settings before deploying:
   - RESEND_API_KEY: your secret API key.
   - CONTACT_FROM_EMAIL: M3G Farms <enquiries@YOUR-VERIFIED-DOMAIN>.
3. For local development, put these values in an ignored `.dev.vars` file. Quote values containing spaces.
4. Redeploy after setting hosted values, then send one controlled test enquiry and confirm its arrival in the admin inbox.

No real email was sent during development. Automated tests use a simulated provider. Missing configuration returns HTTP 503 with a direct-email fallback; provider failure returns HTTP 502. A 200 response means Resend accepted the message, not guaranteed inbox delivery. API documentation: https://resend.com/docs/api-reference/emails/send-email

The form validates on the client and server, requires consent, checks same-origin requests, enforces a 16 KB body limit, uses a honeypot and minimum interaction time, and provides a basic per-IP rate limit (five attempts per ten minutes per Worker isolate). For a high-traffic public launch, add a platform-wide rate-limit/WAF rule; isolate memory is not a global abuse-prevention store. The application does not persist enquiries; submitted information is sent to Resend and the company mailbox. Manage retention in those services.

## Source map

- app/page.tsx: page composition and interactive controls.
- app/globals.css: design tokens, responsive layout, focus states, dark theme, reduced motion.
- lib/content.ts: businesses, forage varieties, and leadership data.
- lib/contact.ts: independently testable server-side validation and Resend integration.
- worker/index.ts: /api/contact endpoint and framework request handler.
- public/images: locally served Nigerian agricultural photography.
- public/m3g-company-profile.pdf: the supplied source profile, available to visitors.
- tests/contact.test.ts: validation, abuse controls, success/failure, and email-routing tests.
- .openai/hosting.json: persisted Sites project identity.

## Board portraits still needed

The source PDF contains initials, not portraits. The four named board members are represented with initials until authentic photographs are supplied. Do not use stock people or generated faces as their identities. Add approved portraits in public/images/board and set the photo property for each leader in lib/content.ts to the public image path; BoardProfile renders it automatically. Provide one named image per person:

- Amb. Dr. Alhaji Goni Dunoma — Chairman / CEO
- Mallam Abba Ali — Vice Chairman / Director
- Modu Sanda Abba — Director / Assistant Secretary
- Arch. Mukhtar Idrisa Kadi — Director / Secretary

## Content and assets

Company claims and corporate information are from the supplied profile, not independently verified. Juncao production figures are explicitly indicative; no unit is added because the source chart supplies none. The profile uses both 'M3G Farms Limited' and 'M3G Farm Limited'; the public brand is M3G Farms and corporate details use the latter name as recorded in the profile.

Photography is illustrative Nigerian context, not a representation of M3G-owned properties or staff. No stock people are used. See PHOTO-CREDITS.md. The sprout brand mark is a new simplified web mark; the original logo is available in the downloadable company PDF.

The site has no fabricated testimonials, client statistics, social handles, or leadership biographies. Theme preference is stored only in the visitor's local browser. The original source document is public to anyone who can access the deployed site's audience, so review the corporate shareholder information before changing site access to public.
