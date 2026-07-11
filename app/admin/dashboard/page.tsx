"use client";

// ⚠️ TODO fase 2: cada boton (Publish, Log it, + New project, etc.) todavia
// no llama a Supabase. Cuando este el SupabaseContentRepository, estos
// handlers deben llamar a repo.createX(...) / repo.updateX(...) y esta
// ruta debe protegerse con middleware que valide la sesion de Supabase Auth.

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "now" | "projects" | "notes" | "training" | "reading" | "uses";

const TABS: { id: Tab; label: string }[] = [
  { id: "now", label: "✎ now / this week" },
  { id: "projects", label: "▤ projects" },
  { id: "notes", label: "✍ notes" },
  { id: "training", label: "⚡ training" },
  { id: "reading", label: "❥ reading" },
  { id: "uses", label: "⚙ uses" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-label tracking-[.12em] text-faint">{children}</span>;
}

const inputClass =
  "bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary text-body transition-colors duration-250 outline-none focus:border-accent";

const primaryBtn =
  "bg-accent border-none rounded-lg px-6 py-3 text-ink font-bold text-code cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn";

const ghostBtn =
  "bg-transparent border border-strong rounded-lg px-6 py-3 text-muted text-code cursor-pointer transition-all duration-250 hover:border-muted hover:text-primary";

const pillBtn = (active: boolean) =>
  `border rounded-full px-5 py-[9px] font-mono text-xs cursor-pointer transition-all duration-250 ${
    active
      ? "bg-accent/[.12] border-accent text-primary"
      : "bg-transparent border-strong text-muted hover:border-muted hover:text-primary"
  }`;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("now");

  return (
    <div className="animate-fade-up grid grid-cols-[230px_1fr] min-h-[80vh]">
      {/* sidebar */}
      <div className="border-r border-soft py-8 flex flex-col">
        <div className="px-7 pb-6 border-b border-soft">
          <div className="font-mono text-label tracking-[.14em] text-faint mb-2">MY DESK</div>
          <div className="text-body font-semibold">
            hola, fernando <span className="font-serif italic text-muted font-normal">— ship something</span>
          </div>
        </div>
        <div className="flex flex-col px-3 py-4 font-mono text-meta gap-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-left rounded-lg px-4 py-[11px] transition-all duration-250 hover:text-primary ${
                tab === t.id ? "bg-accent/[.12] text-primary" : "text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-auto mx-7 text-left bg-transparent border-none border-t border-soft py-4 text-faint font-mono text-xs cursor-pointer transition-colors duration-250 hover:text-primary"
        >
          ← log out
        </button>
      </div>

      {/* content */}
      <div className="px-12 py-10">
        {tab === "now" && <NowTab />}
        {tab === "projects" && <ProjectsTab />}
        {tab === "notes" && <NotesTab />}
        {tab === "training" && <TrainingTab />}
        {tab === "reading" && <ReadingTab />}
        {tab === "uses" && <UsesTab />}
      </div>
    </div>
  );
}

function TabHeader({ title, right }: { title: string; right: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline mb-7">
      <div className="text-h4 font-bold tracking-[-.02em]">{title}</div>
      {right}
    </div>
  );
}

function NowTab() {
  return (
    <div className="animate-fade-up">
      <TabHeader
        title="This week's status"
        right={<span className="font-mono text-label text-faint">LAST SAVED WED 23:47</span>}
      />
      <div className="flex flex-col gap-4 max-w-[680px]">
        <label className="flex flex-col gap-2">
          <FieldLabel>HEADLINE</FieldLabel>
          <input
            type="text"
            defaultValue="Deep in my thesis, slowly building a marathon base, and finishing Black Clover before someone spoils it."
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>TICKER ITEMS — ONE PER LINE</FieldLabel>
          <textarea
            rows={4}
            defaultValue={
              "WRITING THESIS ON SETTLEMENT PIPELINES\nWEEK 6/20 OF MARATHON BLOCK · 42 KM\nREADING: EL ÚLTIMO SECRETO + BLACK CLOVER 32\nNEXT ADVENTURE: SNOWBOARD · 08.15"
            }
            className={`${inputClass} font-mono text-meta leading-[1.7] resize-y`}
          />
        </label>
        <div className="flex gap-3 mt-1.5">
          <button className={primaryBtn}>Publish update</button>
          <button className={ghostBtn}>Save draft</button>
        </div>
      </div>
    </div>
  );
}

function ProjectsTab() {
  const rows = [
    { title: "Strixhaven Draft Academy", stack: "TYPESCRIPT · SUPABASE · VERCEL", status: "LIVE" },
    { title: "Ledger Core", stack: "JAVA · SPRING · POSTGRESQL", status: "LIVE" },
    { title: "Settlement Pipeline", stack: "JAVA · KAFKA · CLEAN ARCH", status: "DRAFT" },
  ];
  return (
    <div className="animate-fade-up">
      <TabHeader title="Projects" right={<button className={primaryBtn}>+ New project</button>} />
      <div className="flex flex-col">
        {rows.map((r, i) => (
          <div
            key={r.title}
            className={`grid grid-cols-[1fr_250px_90px_120px] gap-5 items-center px-2 py-4 border-t ${
              i === rows.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="text-base font-semibold">{r.title}</span>
            <span className="font-mono text-label text-muted">{r.stack}</span>
            <span className={`font-mono text-label ${r.status === "LIVE" ? "text-accent" : "text-faint"}`}>
              {r.status}
            </span>
            <RowActions right={r.status === "LIVE" ? "hide" : "publish"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function RowActions({ right }: { right: string }) {
  return (
    <span className="flex gap-3.5 font-mono text-xs justify-end">
      <a href="#" className="text-muted transition-colors duration-200 hover:text-primary">edit</a>
      <a href="#" className="text-faint transition-colors duration-200 hover:text-primary">{right}</a>
    </span>
  );
}

function NotesTab() {
  const rows = [
    { date: "07.06", title: "Idempotency in payment retries", status: "PUBLISHED" },
    { date: "—", title: "Outbox pattern, but explained with empanadas (wip)", status: "DRAFT" },
  ];
  return (
    <div className="animate-fade-up">
      <TabHeader title="Notes" right={<button className={primaryBtn}>+ Write a note</button>} />
      <div className="flex flex-col mb-9">
        {rows.map((r, i) => (
          <div
            key={r.title}
            className={`grid grid-cols-[100px_1fr_110px_120px] gap-5 items-center px-2 py-[15px] border-t ${
              i === rows.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="font-mono text-xs text-faint">{r.date}</span>
            <span className={`text-body font-medium ${r.status === "DRAFT" ? "text-muted" : ""}`}>
              {r.title}
            </span>
            <span className={`font-mono text-label ${r.status === "PUBLISHED" ? "text-accent" : "text-faint"}`}>
              {r.status}
            </span>
            <RowActions right={r.status === "PUBLISHED" ? "unpublish" : "publish"} />
          </div>
        ))}
      </div>
      <div className="border border-strong rounded-[10px] px-7 pt-7 pb-6 max-w-[680px]">
        <div className="font-mono text-label tracking-[.12em] text-faint mb-4.5">QUICK DRAFT</div>
        <input type="text" placeholder="Note title…" className={`${inputClass} w-full box-border mb-3`} />
        <textarea
          rows={4}
          placeholder="Markdown supported. Write like you're explaining it to a colleague at 6pm on a Friday."
          className={`${inputClass} w-full box-border font-mono text-meta leading-[1.7] resize-y`}
        />
      </div>
    </div>
  );
}

function TrainingTab() {
  const [kind, setKind] = useState("RUN");
  return (
    <div className="animate-fade-up">
      <TabHeader title="Log a session" right={<span className="font-mono text-label text-faint">42 KM THIS WEEK</span>} />
      <div className="grid grid-cols-4 gap-2.5 mb-6 w-max">
        {["RUN", "GYM", "SNOWBOARD", "+ OTHER"].map((k) => (
          <button key={k} onClick={() => setKind(k)} className={pillBtn(kind === k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-[680px]">
        <label className="flex flex-col gap-2">
          <FieldLabel>DISTANCE (KM)</FieldLabel>
          <input type="text" placeholder="18" className={`${inputClass} font-mono text-code`} />
        </label>
        <label className="flex flex-col gap-2">
          <FieldLabel>DURATION</FieldLabel>
          <input type="text" placeholder="1:42:36" className={`${inputClass} font-mono text-code`} />
        </label>
        <label className="flex flex-col gap-2 col-span-2">
          <FieldLabel>HOW DID IT GO?</FieldLabel>
          <input type="text" placeholder="Legs survived, ego intact" className={inputClass} />
        </label>
      </div>
      <button className={`${primaryBtn} mt-5`}>Log it →</button>
    </div>
  );
}

function ReadingTab() {
  const rows = [
    { title: "El último secreto", author: "DAN BROWN", status: "READING · 62%", right: "progress" },
    { title: "Black Clover — vol. 32", author: "YŪKI TABATA", status: "READING", right: "progress" },
    { title: "El mago de los libros", author: "JIM C. HINES", status: "QUEUED", right: "start" },
  ];
  return (
    <div className="animate-fade-up">
      <TabHeader title="Bookshelf" right={<button className={primaryBtn}>+ Add book</button>} />
      <div className="flex flex-col">
        {rows.map((r, i) => (
          <div
            key={r.title}
            className={`grid grid-cols-[1fr_180px_140px_120px] gap-5 items-center px-2 py-[15px] border-t ${
              i === rows.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="text-body font-medium">{r.title}</span>
            <span className="font-mono text-label text-muted">{r.author}</span>
            <span className={`font-mono text-label ${r.status.startsWith("READING") ? "text-accent" : "text-faint"}`}>
              {r.status}
            </span>
            <RowActions right={r.right === "start" ? "remove" : "done"} />
          </div>
        ))}
      </div>
    </div>
  );
}

function UsesTab() {
  const rows = [
    { name: "Java + Spring Boot", cat: "LANGUAGES & BACKEND" },
    { name: "Mate + termo", cat: "OFF THE DESK" },
    { name: "Garmin Forerunner", cat: "OFF THE DESK" },
  ];
  return (
    <div className="animate-fade-up">
      <TabHeader title="Uses" right={<button className={primaryBtn}>+ Add item</button>} />
      <div className="flex flex-col max-w-[680px]">
        {rows.map((r, i) => (
          <div
            key={r.name}
            className={`grid grid-cols-[1fr_200px_120px] gap-5 items-center px-2 py-[15px] border-t ${
              i === rows.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="text-body font-medium">{r.name}</span>
            <span className="font-mono text-label text-muted">{r.cat}</span>
            <RowActions right="remove" />
          </div>
        ))}
      </div>
    </div>
  );
}
