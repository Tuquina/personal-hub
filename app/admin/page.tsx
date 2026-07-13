"use client";

// Login del admin: email + contraseña (Supabase Auth). El acceso queda
// restringido a OWNER_EMAIL por el middleware y el guard del dashboard, y la
// escritura por RLS. "Setear contraseña" manda un link de recuperación (una
// sola vez) para elegir tu contraseña.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { OWNER_EMAIL } from "@/lib/owner";

type Status = "idle" | "loading" | "reset-sent";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  async function onReset() {
    setError("");
    if (email !== OWNER_EMAIL) {
      setError("Este panel es solo para el dueño del sitio.");
      return;
    }
    setStatus("loading");
    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }
    setStatus("reset-sent");
  }

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

          {status === "reset-sent" ? (
            <div className="flex flex-col gap-3">
              <div className="text-body text-secondary leading-[1.6]">
                Te mandé un link a <span className="text-primary">{email}</span> para setear tu contraseña. Abrilo,
                elegí una, y después entrás con email + contraseña.
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="self-start font-mono text-meta text-faint hover:text-primary transition-colors duration-250"
              >
                ← volver
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-3.5" onSubmit={onLogin}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fernandotuquina@gmail.com"
                className="bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 bg-accent border-none rounded-lg py-3.5 text-ink font-sans font-bold text-sm cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn disabled:opacity-60 disabled:cursor-default"
              >
                {status === "loading" ? "Entrando…" : "Entrar →"}
              </button>
              {error && <div className="font-mono text-meta text-accent">{error}</div>}
              <button
                type="button"
                onClick={onReset}
                className="self-center mt-1 font-mono text-meta text-faint hover:text-primary transition-colors duration-250"
              >
                primera vez / olvidé mi contraseña
              </button>
            </form>
          )}

          <div className="mt-6 font-mono text-label text-faint text-center">SUPABASE AUTH · EMAIL + PASSWORD</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
