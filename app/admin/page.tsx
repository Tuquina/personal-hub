"use client";

// ⚠️ TODO: esto es solo la UI. Login funciona con Supabase Auth (magic link)
// en fase 2 -- ver docs/supabase-schema.sql. Por ahora el boton solo navega,
// no autentica a nadie. No dejar este archivo asi en produccion.

import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function AdminLoginPage() {
  const router = useRouter();

  return (
    <>
      <Nav />
      <div className="animate-fade-up min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-[400px] border border-strong rounded-[10px] px-10 py-11 bg-accent/[.02] transition-shadow duration-300 hover:shadow-glow-card">
          <div className="flex items-center gap-2.5 mb-7">
            <span className="w-[7px] h-[7px] rounded-full bg-accent animate-pulse-soft" />
            <span className="font-mono text-label tracking-[.14em] text-faint">RESTRICTED — MY DESK</span>
          </div>
          <div className="text-h3 font-bold tracking-[-.02em] mb-1.5">
            Hola de nuevo<span className="text-accent">.</span>
          </div>
          <div className="font-serif italic text-body text-muted mb-8">the only user this page was made for</div>
          <form
            className="flex flex-col gap-3.5"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/admin/dashboard");
            }}
          >
            <input
              type="email"
              placeholder="fernandotuquina@gmail.com"
              className="bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
            />
            <input
              type="password"
              placeholder="••••••••••••"
              className="bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="mt-2 bg-accent border-none rounded-lg py-3.5 text-ink font-sans font-bold text-sm cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn"
            >
              Enter →
            </button>
          </form>
          <div className="mt-6 font-mono text-label text-faint text-center">
            SUPABASE AUTH · MAGIC LINK AVAILABLE
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
