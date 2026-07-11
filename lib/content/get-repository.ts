import type { ContentRepository } from "./content-repository";
import { PlaceholderContentRepository } from "./placeholder-repository";

/**
 * Composition root. Este es el UNICO lugar que decide que adapter se usa.
 *
 * Cuando Supabase este listo:
 *   import { SupabaseContentRepository } from "./supabase-repository";
 *   export function getRepository(): ContentRepository {
 *     return new SupabaseContentRepository();
 *   }
 */
export function getRepository(): ContentRepository {
  return new PlaceholderContentRepository();
}
