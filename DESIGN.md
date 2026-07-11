# Design System — Hub personal Fernando Tuquina

Fuente de verdad del diseño. Traducción del handoff de **Claude Design**
(proyecto: https://claude.ai/design/p/081880eb-a326-4559-9ecc-2e55c9f04dfe) a
tokens de Tailwind + CSS variables.

> **Regla de oro:** en los componentes se usan **tokens/clases**, nunca
> `#hex` ni `rgba()` literales. Si un valor no existe como token, se agrega
> acá y en la config — no se hardcodea en el JSX.

Los tokens viven en dos archivos:
- [`app/globals.css`](app/globals.css) — CSS variables (`:root`), estilos base y animaciones.
- [`tailwind.config.ts`](tailwind.config.ts) — mapea las variables a utilidades de Tailwind.

---

## Paleta

Definida como **canales RGB** (`--muted: 139 148 167`) para que Tailwind pueda
aplicar opacidad: `text-muted`, `border-muted/[.14]`, `bg-accent/[.04]`, etc.

| Token | Clase | Valor | Uso |
|---|---|---|---|
| `--ink` | `bg-ink` / `text-ink` | `#06080f` | Fondo. Negro con matiz azul-noche. |
| `--primary` | `text-primary` | `#e8ecf4` | Texto primario. |
| `--secondary` | `text-secondary` | `#a8b3c7` | Texto secundario, links en reposo. |
| `--muted` | `text-muted` | `#8b94a7` | Texto atenuado, metadatos. |
| `--faint` | `text-faint` | `#5c6577` | Labels, texto más tenue. |
| `--accent` | `text-accent` / `bg-accent` | `#7aa2ff` | **Único acento. Usar con moderación.** |
| `--bright` | `text-bright` | `#c3ccdc` | Entre secondary y primary (pills, hovers). |

## Bordes

Todos son el color `muted` a distintas opacidades. Escala semántica:

| Clase | Opacidad | Uso |
|---|---|---|
| `border-soft` | `.14` | Divisores internos (grillas, filas). El más común. |
| `border-line` | `.18` | Bordes de sección (top/bottom de bloques). |
| `border-strong` | `.25` | Inputs, botones ghost, pills, tarjetas. |
| `border-bold` | `.30` | Badges (ej. tipo de sesión de training). |

`border` sin color explícito usa `.18` por defecto (borderColor.DEFAULT).
Para opacidades puntuales fuera de escala: `border-accent/[.35]`, `border-muted/20`.

## Tipografía

Tres familias, cargadas con `next/font` y expuestas como CSS variables:

| Familia | Clase | Cuándo |
|---|---|---|
| **Archivo** (400–800, itálica 400) | `font-sans` | Texto general y títulos. Default del `<body>`. |
| **Instrument Serif** (400, itálica) | `font-serif` | Momentos editoriales / de voz (frases, acentos). |
| **JetBrains Mono** (400–500) | `font-mono` | Labels, metadatos, números, UI técnica. |

### Escala tipográfica

Nombres semánticos (medios píxeles redondeados). Convive con los tokens default
de Tailwind (`text-xs/sm/base/lg/xl/2xl/7xl`) que siguen en uso.

| Clase | px | Rol |
|---|---|---|
| `text-label` | 11 | Eyebrows, labels mono, badges chicos. |
| `text-meta` | 12 | Metadatos mono, UI secundaria. |
| `text-code` | 13 | Inputs mono, UI técnica. |
| `text-body` | 15 | Cuerpo de texto. |
| `text-body-lg` | 16 | Cuerpo destacado. |
| `text-lead` | 19 | Bajada del hero. |
| `text-sublead` | 21 | Acento serif inline. |
| `text-h5` | 22 | Títulos de nota. |
| `text-h4` | 28 | Subtítulos de sección / títulos de tab. |
| `text-h3` | 30 | Títulos de tarjeta. |
| `text-stat` | 36 | Números de stats. |
| `text-h2` | 52 | Encabezado about. |
| `text-h1` | 60 | Encabezados de página grandes / quotes. |
| `text-hero` | 124 | Nombre del hero. |

## Sombras / glows

Glows de acento tokenizados (antes `rgba(122,162,255,...)` disperso):

| Clase | Uso |
|---|---|
| `shadow-glow` | Hover genérico (pills, `.hover-glow`). |
| `shadow-glow-dot` | Punto "open to roles" pulsando. |
| `shadow-glow-bar` | Barra activa del mini-gráfico (home). |
| `shadow-glow-bar-lg` | Barra activa del gráfico grande (training). |
| `shadow-glow-progress` | Barra de progreso de lectura. |
| `shadow-glow-btn` | Hover de botón primario. |
| `shadow-glow-card` | Hover de la tarjeta de login del admin. |

## Animaciones

Todas CSS puro (sin librerías), en [`app/globals.css`](app/globals.css):

| Animación | Clase | Qué hace |
|---|---|---|
| `rise` | `animate-rise` | Nombre del hero apareciendo letra por letra. |
| `words` | `animate-words` | Saludo rotando entre 3 idiomas (cíclico). |
| `tick` | `animate-tick` | Ticker infinito de status. |
| `grow` | `animate-grow` | Barras de gráfico creciendo (scaleY). |
| `pulse` | `animate-pulse-soft` | Punto "open to roles" pulsando. |
| `fadeUp` | `animate-fade-up` | Entrada de cada página. |
| `blink` | `animate-blink` | Cursor parpadeante junto al saludo. |

Utilidades de efecto (no keyframe): `.grain-bg` (ruido), `.hover-row`,
`.hover-row-tight`, `.hover-glow`.

---

## Cómo extender

1. ¿Color nuevo? Agregar la variable en `:root` (canales RGB) y el mapeo en
   `tailwind.config.ts → colors`.
2. ¿Borde/sombra/tamaño nuevo? Agregarlo a `borderColor` / `boxShadow` /
   `fontSize` en la config con nombre semántico, y documentarlo acá.
3. Nunca escribir `#hex` ni `rgba()` en un componente. Nunca reintroducir
   fuentes por `<link>` (usar `next/font`).
