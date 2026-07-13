/**
 * Único email con acceso al admin. La escritura ya está atada a este mail por
 * RLS en Supabase; acá se agrega el candado a nivel app (middleware + guard del
 * dashboard + server actions) para que ni siquiera la UI del panel sea accesible
 * para otro usuario.
 */
export const OWNER_EMAIL = "fernandotuquina@gmail.com";

/** Normaliza antes de comparar: navegadores/teclados a veces autocapitalizan
 * el email o dejan espacios al autocompletar. */
export function isOwnerEmail(email: string | null | undefined): boolean {
  return (email ?? "").trim().toLowerCase() === OWNER_EMAIL;
}
