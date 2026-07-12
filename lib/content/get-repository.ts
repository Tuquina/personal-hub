import type { ContentRepository } from "./content-repository";
import { PlaceholderContentRepository } from "./placeholder-repository";
import { SupabaseContentRepository } from "./supabase-repository";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Composition root. Este es el UNICO lugar que decide que adapter se usa.
 *
 * Si estan las env vars de Supabase (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY) se
 * usa el adapter real, ligado a la sesion del request. Si no, cae en el
 * placeholder en memoria -- asi el build y el dev corren sin credenciales.
 */
export function getRepository(): ContentRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseContentRepository(createSupabaseServerClient());
  }
  return new PlaceholderContentRepository();
}
