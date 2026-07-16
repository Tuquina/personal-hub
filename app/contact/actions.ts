"use server";

import { getResend, isResendConfigured, RESEND_FROM_EMAIL } from "@/lib/resend";
import { buildInfoRequestEmail } from "@/lib/email-templates/info-request";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendInfoRequest(email: string) {
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Ingresá un email válido." };
  }
  if (!isResendConfigured()) {
    return { ok: false, error: "El envío de mails no está configurado todavía." };
  }

  const { subject, html, text } = buildInfoRequestEmail();
  const { error } = await getResend().emails.send({
    from: RESEND_FROM_EMAIL,
    to: email,
    replyTo: "fernandotuquina@gmail.com",
    subject,
    html,
    text,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
