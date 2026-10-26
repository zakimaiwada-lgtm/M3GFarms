import { handleContact, type MailEnvironment } from "../../../lib/contact";

export function POST(request: Request): Promise<Response> {
  const environment: MailEnvironment = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
  };
  return handleContact(request, environment);
}
