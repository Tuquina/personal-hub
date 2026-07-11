import type { Metadata } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GrainOverlay } from "@/components/grain-overlay";

// Fuentes self-hosted por next/font (sin layout shift, sin <link> a Google).
// Se exponen como CSS variables que Tailwind consume en fontFamily.
const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fernando Nahuel Tuquina",
  description: "Portfolio, notas, training log y lecturas de Fernando Tuquina — software engineer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans min-h-screen relative">
        <GrainOverlay />
        <div className="relative z-[2]">{children}</div>
      </body>
    </html>
  );
}
