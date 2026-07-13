"use client";

// Destino del link de recuperación (via /auth/callback). Con la sesión de
// recovery ya activa, deja elegir una contraseña nueva y entra al dashboard.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "checking" | "ready" | "no-session" | "saving";

export default function AdminResetPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth
      .getUser()
      .then(({ data }) => setStatus(data.user ? "ready" : "no-session"))
      .catch(() => setStatus("no-session"));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("saving");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        setStatus("ready");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo conectar. Probá de nuevo.");
      setStatus("ready");
    }
  }

  return (
    <>
      <Nav />
      <div className="animate-fade-up min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-[400px] border border-strong rounded-[10px] px-10 py-11 bg-accent/[.02]">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-4">SET PASSWORD</div>

          {status === "no-session" ? (
            <div className="text-body text-secondary leading-[1.6]">
              Este link es para setear tu contraseña, pero no hay una sesión de recuperación activa. Volvé a{" "}
              <a href="/admin" className="text-accent">/admin</a> y pedí el link de nuevo.
            </div>
          ) : status === "checking" ? (
            <div className="font-mono text-meta text-faint">verificando…</div>
          ) : (
            <form className="flex flex-col gap-3.5" onSubmit={onSave}>
              <div className="text-body text-muted mb-1 leading-[1.5]">Elegí una contraseña nueva.</div>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="nueva contraseña (mín. 8)"
                className="bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={status === "saving"}
                className="mt-1 bg-accent border-none rounded-lg py-3.5 text-ink font-sans font-bold text-sm cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn disabled:opacity-60 disabled:cursor-default"
              >
                {status === "saving" ? "Guardando…" : "Guardar y entrar →"}
              </button>
              {error && <div className="font-mono text-meta text-accent">{error}</div>}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
