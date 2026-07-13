/**
 * Único email con acceso al admin. La escritura ya está atada a este mail por
 * RLS en Supabase; acá se agrega el candado a nivel app (middleware + guard del
 * dashboard + server actions) para que ni siquiera la UN del panel sea accesible
 * para otro usuario.
 */
export const OWNER_EMAIL = "fernandotuquina@gmail.com";
