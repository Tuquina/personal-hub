# Fernando Tuquina — Hub personal all-in-one
### Brief de proyecto para Claude Code

---

## 1. Qué es esto

Sitio personal all-in-one de Fernando Tuquina: portfolio técnico, blog/notas, tracker de entrenamiento (maratón), log de lectura y contacto — con un panel de administrador para cargar contenido, pensado para actualizarse varias veces por semana.

**Repo:** https://github.com/Tuquina/personal-hub
**Local:** `G:\Documentos Fernando\Claude Code\personal-hub`
**Deploy objetivo:** Vercel (conectado al repo de GitHub para deploy automático en cada push)

---

## 2. Requisitos originales

1. **Deploy** en Vercel o un servidor gratuito con límites generosos.
2. **Base de datos** gratuita (Supabase u otra) con interfaces bien armadas en la app para poder cambiar de proveedor de datos fácilmente — patrón de puertos y adaptadores (ports & adapters), el mismo que Fernando usa profesionalmente en Java/Spring en Ueno.
3. **Acceso de administrador** — poder entrar a editar el contenido del sitio.
4. **Bot de Telegram** (WhatsApp quedó descartado por fricción de setup — requiere verificación de negocio de Meta) que permita cargar y consultar información del sitio usando una IA gratuita.
5. **Diseño:** futurista, elegante, muy refinado, oscuro, con animaciones sutiles y transiciones suaves — nivel de un estudio de diseño senior de UX/UI, no una plantilla genérica. Consistente en todas las pantallas, incluyendo el admin.

## 3. Diseño de referencia — Claude Design

El diseño se armó en Claude Design y se exportó como handoff bundle:

- **Proyecto:** https://claude.ai/design/p/081880eb-a326-4559-9ecc-2e55c9f04dfe
- **Archivo primario:** `Fernando Tuquina - Hub.dc.html`
- **Archivo secundario:** `Home Explorations.dc.html` — exploraciones descartadas, no es la dirección final, se puede ignorar.

El handoff bundle (HTML/CSS/JS del prototipo) ya se leyó completo y se tradujo a Next.js — ver sección 4. Si hace falta revisar el prototipo original de nuevo, pedirle a Fernando el zip (`Hub_personal_all-in-one-handoff.zip`).

### Design tokens extraídos

```
Fondo:      #06080f  (negro con matiz azul-noche)
Texto:      #e8ecf4  (primario) · #a8b3c7 (secundario) · #8b94a7 (muted) · #5c6577 (faint)
Acento:     #7aa2ff  (único, usado con moderación)
Bordes:     rgba(139,148,167,.14 / .18 / .25)

Tipografía:
  Archivo          — sans, pesos 400–800, itálica 400 (texto general y títulos)
  Instrument Serif — itálica, para los momentos editoriales/de voz
  JetBrains Mono   — labels, metadatos, números, UI técnica

Animaciones (todas CSS puro, sin librerías):
  rise    — nombre del hero apareciendo letra por letra
  words   — saludo rotando entre 3 idiomas (cíclico, sin JS)
  tick    — ticker infinito de status
  grow    — barras de gráfico creciendo (scaleY)
  pulse   — punto "open to roles" pulsando
  fadeUp  — transición de entrada de cada página
  blink   — cursor parpadeante junto al saludo
```

> **Design system implementado.** Estos tokens ya viven en el código como CSS
> variables + utilidades de Tailwind. La **fuente de verdad operativa** es
> [`DESIGN.md`](DESIGN.md) (paleta, bordes, escala tipográfica, glows, fuentes).
> **Regla:** en los componentes se usan tokens/clases, **nunca `#hex` ni
> `rgba()` literales**; las fuentes se cargan con `next/font`, no por `<link>`.

## 4. Estado actual del código

Implementado y verificado (`npm install && npx tsc --noEmit && npx next build` corren sin errores):

- **Next.js 14 (App Router) + Tailwind**, TypeScript estricto.
- **Design system tokenizado** (Fase A hecha): tokens en `app/globals.css` + `tailwind.config.ts`, fuentes con `next/font`, sin literales hex/rgba en los componentes. Ver [`DESIGN.md`](DESIGN.md).
- **Rutas reales** (no SPA por estado): `/`, `/about`, `/work`, `/notes`, `/training`, `/reading`, `/uses`, `/contact`, `/admin`, `/admin/dashboard`.
- **Componentes compartidos:** `components/nav.tsx` (con estado activo por ruta + quick actions), `components/ticker.tsx`, `components/footer.tsx`, `components/clock.tsx` (reloj/saludo client-side), `components/grain-overlay.tsx`.
- **Capa de dominio en `lib/content/`:**
  - `types.ts` — modelos: `Project`, `Note`, `TrainingLog`, `TrainingStats`, `Book`, `UsesItem`, `NowStatus`.
  - `content-repository.ts` — **el puerto**. Única interface que el resto de la app conoce.
  - `placeholder-repository.ts` — adapter actual, con el contenido de ejemplo que generó Claude Design (⚠️ confirmado que NO es real, es placeholder).
  - `get-repository.ts` — composition root. Acá se cambia de adapter con una sola línea.
- **Admin:** UI completa del login y del dashboard (tabs: now / projects / notes / training / reading / uses), pero **sin autenticación real todavía** — el login solo navega, no valida nada (marcado con `⚠️ TODO` en el código).
- **`docs/supabase-schema.sql`** — schema completo con RLS ya escrito (lectura pública, escritura solo para el uid de Fernando), listo para correr en Supabase.

## 5. Arquitectura — puertos y adaptadores

```
ContentRepository (puerto)
       ↑ implementa
PlaceholderContentRepository (adapter actual, en memoria)
       ↓ reemplazar por
SupabaseContentRepository (adapter real, TODO)
```

Ni las páginas ni el futuro bot de Telegram importan Supabase directo — solo conocen `ContentRepository`. El día que se migre de proveedor de datos, se escribe un adapter nuevo implementando la misma interface y se cambia una línea en `get-repository.ts`.

## 6. Roadmap pendiente

1. **`SupabaseContentRepository`** — implementar el puerto contra Supabase (correr primero `docs/supabase-schema.sql` en un proyecto nuevo de Supabase).
2. **Auth real** — proteger `/admin/dashboard` con Supabase Auth (magic link) vía middleware de Next.js, reemplazando el login placeholder.
3. **Cargar contenido real** — reemplazar los arrays de `placeholder-repository.ts` con los datos reales de Fernando (vía Supabase directo o desde el admin panel una vez conectado).
4. **Bot de Telegram** — `app/api/telegram-webhook/route.ts`. Flujo: Telegram → webhook serverless en Vercel → valida `chat_id` contra `TELEGRAM_ADMIN_CHAT_ID` → interpreta el mensaje con una IA gratuita → llama a `ContentRepository` para leer/escribir → responde por Telegram. Variables ya están en `.env.example`.
5. **Deploy** — conectar el repo de GitHub a Vercel (Import Git Repository) y cargar las env vars de `.env.example` en el dashboard.

## 7. Notas técnicas

- **IA gratuita para el bot:** Google Gemini API (Gemini Flash, ~1500 req/día, sin tarjeta) o Groq (más rápido, también sin tarjeta) — ambas más que suficientes para el volumen de un bot personal de uso ocasional. Los límites de free tier cambian seguido, conviene chequear el dashboard del proveedor antes de asumir un número fijo.
- **Telegram, no WhatsApp:** la API de Telegram no tiene fricción de setup (solo @BotFather); WhatsApp Business API requiere verificación de negocio de Meta.
- **Seguridad:** nunca pegar tokens (GitHub, Supabase service role, API keys) directo en un chat — usar variables de entorno locales o el dashboard de Vercel/Supabase para cargarlos.
- **El login de `/admin` NO es funcional todavía** — no deployar a producción sin resolver el punto 2 del roadmap primero.