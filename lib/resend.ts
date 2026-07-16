import { Resend } from "resend";

/**
 * Remitente por defecto: el sandbox de Resend, que no requiere dominio
 * verificado pero solo entrega a la casilla dueña de la cuenta de Resend.
 * El día que se verifique un dominio propio (RESEND_FROM_EMAIL en env),
 * empieza a entregar a cualquier destinatario sin tocar código.
 */
export const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Fernando Tuquina <onboarding@resend.dev>";

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
