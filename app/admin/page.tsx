"use client";

// Login real con Supabase Auth (magic link). El acceso de escritura queda
// igualmente atado por RLS al email de Fernando, y /admin/dashboard lo protege
// el middleware. Ver docs/supabase-schema.sql.

import { useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const emailRedirectTo = `${window.location.origin}/auth/callback?next=/admin/dashboard`;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
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

          {status === "sent" ? (
            <div className="flex flex-col gap-3">
              <div className="text-body text-secondary leading-[1.6]">
                Te mandé un magic link a <span className="text-primary">{email}</span>. Abrilo en este dispositivo
                para entrar.
              </div>
              <button
                onClick={() => setStatus("idle")}
                className="self-start font-mono text-meta text-faint hover:text-primary transition-colors duration-250"
              >
                ← usar otro email
              </button>
            </div>
          ) : (
            <form className="flex flex-col gap-3.5" onSubmit={onSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fernandotuquina@gmail.com"
                className="bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-2 bg-accent border-none rounded-lg py-3.5 text-ink font-sans font-bold text-sm cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn disabled:opacity-60 disabled:cursor-default"
              >
                {status === "sending" ? "Enviando…" : "Send magic link →"}
              </button>
              {status === "error" && (
                <div className="font-mono text-meta text-accent">{message || "Algo falló. Probá de nuevo."}</div>
              )}
            </form>
          )}

          <div className="mt-6 font-mono text-label text-faint text-center">SUPABASE AUTH · MAGIC LINK</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
