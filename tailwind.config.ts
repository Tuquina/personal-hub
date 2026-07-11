import type { Config } from "tailwindcss";

/*
 * Tokens de diseño — ver DESIGN.md para el detalle y las reglas de uso.
 * Los colores referencian las CSS variables de app/globals.css con soporte
 * de <alpha-value>, así una sola definición habilita text-muted,
 * border-muted/[.14], bg-accent/[.04], etc.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        faint: "rgb(var(--faint) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        bright: "rgb(var(--bright) / <alpha-value>)",
      },
      // Bordes = color muted a distintas opacidades. Escala semántica.
      // DEFAULT (.18) también sirve de color base para cualquier border-width
      // sin color explícito; `line` es el alias direccionable de esa opacidad.
      borderColor: {
        DEFAULT: "rgb(var(--muted) / 0.18)",
        soft: "rgb(var(--muted) / 0.14)",
        line: "rgb(var(--muted) / 0.18)",
        strong: "rgb(var(--muted) / 0.25)",
        bold: "rgb(var(--muted) / 0.30)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      // Escala tipográfica semántica (medios píxeles redondeados). Convive con
      // los tokens default de Tailwind (xs/sm/base/lg/xl/2xl/7xl) ya en uso.
      fontSize: {
        label: "11px",
        meta: "12px",
        code: "13px",
        body: "15px",
        "body-lg": "16px",
        lead: "19px",
        sublead: "21px",
        h5: "22px",
        h4: "28px",
        h3: "30px",
        stat: "36px",
        h2: "52px",
        h1: "60px",
        hero: "124px",
      },
      // Glows de acento (antes rgba(122,162,255,...) hardcodeados por todos lados).
      boxShadow: {
        glow: "0 0 14px rgb(var(--accent) / 0.25)",
        "glow-dot": "0 0 10px rgb(var(--accent) / 0.8)",
        "glow-bar": "0 0 14px rgb(var(--accent) / 0.4)",
        "glow-bar-lg": "0 0 18px rgb(var(--accent) / 0.35)",
        "glow-progress": "0 0 10px rgb(var(--accent) / 0.5)",
        "glow-btn": "0 0 24px rgb(var(--accent) / 0.5)",
        "glow-card": "0 0 40px rgb(var(--accent) / 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
