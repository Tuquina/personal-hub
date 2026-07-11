# Fernando Tuquina — Hub

Sitio personal all-in-one: portfolio, notas técnicas, training log y lecturas.
Next.js (App Router) + Tailwind, implementado a partir del handoff de
Claude Design (`Fernando Tuquina - Hub.dc.html`).

## Estado actual

✅ Frontend público completo (home, about, work, notes, training, reading, uses, contact)
✅ Arquitectura de puertos y adaptadores (`lib/content/`) — el front no conoce Supabase, solo `ContentRepository`
✅ UI del panel de admin (login + dashboard con tabs)
⚠️ **Contenido placeholder** — todo lo que ves (la tesis, los libros, las corridas) es el ejemplo que generó Claude Design, no datos reales
⚠️ **Admin sin autenticación real todavía** — el login solo navega, no valida nada. No usar en producción así.

## Correr en local

```bash
npm install
npm run dev
```

Abrí http://localhost:3000

## Próximos pasos

1. **Supabase**: correr `docs/supabase-schema.sql` en el SQL editor de un proyecto nuevo de Supabase.
2. **Adapter real**: escribir `lib/content/supabase-repository.ts` implementando `ContentRepository`
   (mismo contrato que `PlaceholderContentRepository`), y cambiar la única línea en
   `lib/content/get-repository.ts`.
3. **Auth real**: proteger `/admin/dashboard` con Supabase Auth (magic link) vía middleware de Next.js,
   reemplazando el login placeholder.
4. **Cargar contenido real**: reemplazar los arrays de `lib/content/placeholder-repository.ts`
   o cargarlos directo en Supabase una vez migrado el adapter.
5. **Bot de Telegram**: webhook serverless (`app/api/telegram-webhook/route.ts`) usando el mismo
   `ContentRepository` para leer/escribir, con Gemini o Groq (ver `.env.example`) para interpretar mensajes.
6. **Deploy**: conectar este repo a Vercel (Import Git Repository), configurar las env vars de
   `.env.example` en el dashboard de Vercel.

## Arquitectura

```
app/                    rutas (App Router) — una por sección
components/             nav, ticker, footer, overlays compartidos
lib/content/
  types.ts              modelos de dominio
  content-repository.ts el puerto — la única interface que el resto de la app conoce
  placeholder-repository.ts  adapter actual (datos de ejemplo)
  get-repository.ts     composition root — acá se cambia de adapter
docs/supabase-schema.sql  schema + RLS listo para correr en Supabase
```
