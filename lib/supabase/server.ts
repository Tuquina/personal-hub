import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/** ¿Están configuradas las env vars de Supabase? Si no, se usa el placeholder. */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente Supabase server-side ligado a las cookies del request. Respeta la
 * sesión del usuario logueado (Fernando) tanto para lectura como para escritura;
 * sin sesión, cae en anon y las RLS de lectura pública siguen funcionando.
 *
 * En Server Components, `set` sobre las cookies es read-only y tira: lo
 * envolvemos en try/catch (el refresco de sesión ahí no es crítico; el
 * middleware es quien mantiene la cookie fresca).
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component: cookies read-only. Ignorar.
          }
        },
      },
    },
  );
}
