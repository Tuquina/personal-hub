"use client";

import { useEffect, useState } from "react";

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function format(d: Date) {
  return `${DAYS[d.getDay()].slice(0, 3)} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

/** Client-only clock. Renders nothing on the server to avoid hydration mismatch. */
export function Clock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span className={className}>&nbsp;</span>;
  return <span className={className}>{format(now)}</span>;
}

export function greetingFor(d: Date) {
  const h = d.getHours();
  return h < 12 ? "good morning" : h < 19 ? "good afternoon" : "good evening";
}

export function Greeting({ className }: { className?: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const update = () => setText(`${greetingFor(new Date())}, it's ${format(new Date())} in buenos aires`);
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return <span className={className}>{text ? `— ${text}` : "\u00a0"}</span>;
}
