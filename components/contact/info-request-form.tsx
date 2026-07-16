"use client";

import { useState, useTransition } from "react";
import { sendInfoRequest } from "@/app/contact/actions";

type Status = "idle" | "sent" | "error";

export function InfoRequestForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await sendInfoRequest(email);
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
        setError(res.error ?? "Algo falló. Probá de nuevo.");
      }
    });
  }

  if (status === "sent") {
    return (
      <div className="px-14 py-9 border-t border-line">
        <div className="text-body text-secondary leading-[1.6]">
          Listo — te mandé un mail a <span className="text-primary">{email}</span> con mi info. Gracias por el
          interés.
        </div>
      </div>
    );
  }

  return (
    <div className="px-14 py-9 border-t border-line">
      <div className="font-mono text-label tracking-[.14em] text-faint mb-3">¿QUERÉS SABER MÁS DE MÍ?</div>
      <div className="text-h5 font-semibold tracking-[-.015em] mb-5 max-w-[520px]">
        Te mando mi info por mail — CV, links y una carta de presentación corta.
      </div>
      <form onSubmit={onSubmit} className="flex gap-3 max-w-[480px] flex-wrap">
        <input
          type="email"
          required
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 min-w-[220px] bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary font-mono text-code transition-colors duration-250 outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="bg-accent border-none rounded-lg px-6 py-3 text-ink font-bold text-code cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn disabled:opacity-60 disabled:cursor-default"
        >
          {pending ? "Enviando…" : "Mandámela →"}
        </button>
      </form>
      {status === "error" && <div className="mt-3 font-mono text-meta text-accent">{error}</div>}
    </div>
  );
}
