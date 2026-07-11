"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock } from "@/components/clock";

const LINKS = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  { href: "/work", label: "work" },
  { href: "/notes", label: "notes" },
  { href: "/training", label: "training" },
  { href: "/reading", label: "reading" },
  { href: "/uses", label: "uses" },
  { href: "/contact", label: "contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex justify-between items-center px-14 py-[22px] border-b border-soft sticky top-0 bg-ink/85 backdrop-blur-md z-10">
      <Link href="/" className="flex items-baseline gap-3.5">
        <span className="font-bold text-base tracking-[-.01em] text-primary">
          ft<span className="text-accent">.</span>
        </span>
        <Clock className="font-mono text-label text-faint" />
      </Link>
      <div className="flex gap-7 font-mono text-xs">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-250 ${
                active ? "text-primary" : "text-muted hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { icon: "+", label: "log a run" },
  { icon: "+", label: "write a note" },
  { icon: "✎", label: "update now" },
];

/** The three pill buttons under the hero — all deep-link into the admin panel. */
export function QuickActions() {
  return (
    <div className="flex gap-3 px-14 pb-9 items-center animate-fade-up" style={{ animationDelay: ".65s" }}>
      <span className="font-mono text-label tracking-[.12em] text-faint mr-2">MY DESK →</span>
      {QUICK_ACTIONS.map((a) => (
        <Link
          key={a.label}
          href="/admin"
          className="flex items-center gap-2 font-mono text-xs text-bright border border-strong rounded-full px-4 py-2 transition-all duration-250 hover-glow"
        >
          <span className="text-accent">{a.icon}</span> {a.label}
        </Link>
      ))}
    </div>
  );
}
