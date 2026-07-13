"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type {
  Book,
  Note,
  NowStatus,
  Project,
  TrainingLog,
  TrainingStats,
  UsesItem,
} from "@/lib/content/types";
import {
  createBookAction,
  createNoteAction,
  createProjectAction,
  createTrainingLogAction,
  createUsesItemAction,
  deleteBookAction,
  deleteNoteAction,
  deleteProjectAction,
  deleteTrainingLogAction,
  deleteUsesItemAction,
  saveNowStatus,
  updateBookAction,
  updateNoteAction,
  updateProjectAction,
} from "@/app/admin/actions";

export type DashboardData = {
  now: NowStatus;
  projects: Project[];
  notes: Note[];
  trainingStats: TrainingStats;
  trainingLogs: TrainingLog[];
  books: Book[];
  uses: UsesItem[];
};

type Tab = "now" | "projects" | "notes" | "training" | "reading" | "uses";

const TABS: { id: Tab; label: string }[] = [
  { id: "now", label: "✎ now / this week" },
  { id: "projects", label: "▤ projects" },
  { id: "notes", label: "✍ notes" },
  { id: "training", label: "⚡ training" },
  { id: "reading", label: "❥ reading" },
  { id: "uses", label: "⚙ uses" },
];

const inputClass =
  "bg-ink/60 border border-strong rounded-lg px-4 py-[13px] text-primary text-body transition-colors duration-250 outline-none focus:border-accent w-full box-border";
const primaryBtn =
  "bg-accent border-none rounded-lg px-6 py-3 text-ink font-bold text-code cursor-pointer transition-shadow duration-250 hover:shadow-glow-btn disabled:opacity-60 disabled:cursor-default";
const ghostBtn =
  "bg-transparent border border-strong rounded-lg px-6 py-3 text-muted text-code cursor-pointer transition-all duration-250 hover:border-muted hover:text-primary";
const pillBtn = (active: boolean) =>
  `border rounded-full px-5 py-[9px] font-mono text-xs cursor-pointer transition-all duration-250 ${
    active
      ? "bg-accent/[.12] border-accent text-primary"
      : "bg-transparent border-strong text-muted hover:border-muted hover:text-primary"
  }`;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-label tracking-[.12em] text-faint">{children}</span>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <FieldLabel>{label}</FieldLabel>
      {children}
    </label>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");
function today(withYear: boolean) {
  const d = new Date();
  const base = `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  return withYear ? `${base}.${d.getFullYear()}` : base;
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("now");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function run(fn: () => Promise<unknown>, after?: () => void) {
    setError("");
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
        after?.();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Algo falló");
      }
    });
  }

  const ctx = { data, run, pending };

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
          onClick={async () => {
            await createSupabaseBrowserClient().auth.signOut();
            router.push("/");
            router.refresh();
          }}
          className="mt-auto mx-7 text-left bg-transparent border-none border-t border-soft py-4 text-faint font-mono text-xs cursor-pointer transition-colors duration-250 hover:text-primary"
        >
          ← log out
        </button>
      </div>

      {/* content */}
      <div className="px-12 py-10">
        {pending && (
          <div className="mb-4 font-mono text-label text-accent">guardando…</div>
        )}
        {error && (
          <div className="mb-4 font-mono text-label text-accent border border-accent/[.35] rounded-lg px-4 py-2.5">
            {error}
          </div>
        )}
        {tab === "now" && <NowTab {...ctx} />}
        {tab === "projects" && <ProjectsTab {...ctx} />}
        {tab === "notes" && <NotesTab {...ctx} />}
        {tab === "training" && <TrainingTab {...ctx} />}
        {tab === "reading" && <ReadingTab {...ctx} />}
        {tab === "uses" && <UsesTab {...ctx} />}
      </div>
    </div>
  );
}

type Ctx = { data: DashboardData; run: (fn: () => Promise<unknown>, after?: () => void) => void; pending: boolean };

function TabHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-baseline mb-7">
      <div className="text-h4 font-bold tracking-[-.02em]">{title}</div>
      {right}
    </div>
  );
}

function RowActions({ children }: { children: React.ReactNode }) {
  return <span className="flex gap-3.5 font-mono text-xs justify-end items-center">{children}</span>;
}
function LinkBtn({ onClick, children, danger }: { onClick: () => void; children: React.ReactNode; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-primary ${
        danger ? "text-faint" : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}

// --- NOW ---
function NowTab({ data, run, pending }: Ctx) {
  const [headline, setHeadline] = useState(data.now.headline);
  const [weekSummary, setWeekSummary] = useState(data.now.weekSummary);
  const [ticker, setTicker] = useState(data.now.tickerItems.join("\n"));

  return (
    <div className="animate-fade-up">
      <TabHeader
        title="This week's status"
        right={<span className="font-mono text-label text-faint">LAST SAVED {data.now.lastUpdated}</span>}
      />
      <div className="flex flex-col gap-4 max-w-[680px]">
        <Field label="HEADLINE">
          <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className={inputClass} />
        </Field>
        <Field label="WEEK SUMMARY">
          <textarea
            rows={2}
            value={weekSummary}
            onChange={(e) => setWeekSummary(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="TICKER ITEMS — ONE PER LINE">
          <textarea
            rows={4}
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className={`${inputClass} font-mono text-meta leading-[1.7] resize-y`}
          />
        </Field>
        <div className="flex gap-3 mt-1.5">
          <button
            disabled={pending}
            className={primaryBtn}
            onClick={() =>
              run(() =>
                saveNowStatus({
                  headline,
                  weekSummary,
                  tickerItems: ticker.split("\n").map((s) => s.trim()).filter(Boolean),
                }),
              )
            }
          >
            Publish update
          </button>
        </div>
      </div>
    </div>
  );
}

// --- PROJECTS ---
function ProjectsTab({ data, run, pending }: Ctx) {
  const [open, setOpen] = useState(false);
  const empty = { code: "", title: "", description: "", stack: "", year: "", url: "", status: "draft" as "live" | "draft" };
  const [form, setForm] = useState(empty);

  return (
    <div className="animate-fade-up">
      <TabHeader
        title="Projects"
        right={
          <button className={primaryBtn} onClick={() => setOpen((o) => !o)}>
            {open ? "Cerrar" : "+ New project"}
          </button>
        }
      />
      {open && (
        <div className="border border-strong rounded-[10px] p-6 mb-6 grid grid-cols-2 gap-3 max-w-[760px]">
          <Field label="CODE"><input className={inputClass} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="P—06" /></Field>
          <Field label="TITLE"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <label className="flex flex-col gap-2 col-span-2"><FieldLabel>DESCRIPTION</FieldLabel><textarea rows={2} className={`${inputClass} resize-y`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <Field label="STACK"><input className={inputClass} value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} placeholder="JAVA · SPRING" /></Field>
          <Field label="YEAR"><input className={inputClass} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2026" /></Field>
          <Field label="URL (opcional)"><input className={inputClass} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></Field>
          <Field label="STATUS">
            <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "live" | "draft" })}>
              <option value="draft">draft</option>
              <option value="live">live</option>
            </select>
          </Field>
          <div className="col-span-2">
            <button
              disabled={pending || !form.title}
              className={primaryBtn}
              onClick={() =>
                run(
                  () => createProjectAction({ ...form, url: form.url || undefined }),
                  () => {
                    setForm(empty);
                    setOpen(false);
                  },
                )
              }
            >
              Crear
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col">
        {data.projects.map((p, i) => (
          <div
            key={p.id}
            className={`grid grid-cols-[1fr_240px_80px_150px] gap-5 items-center px-2 py-4 border-t ${
              i === data.projects.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="text-base font-semibold">{p.title}</span>
            <span className="font-mono text-label text-muted">{p.stack}</span>
            <span className={`font-mono text-label ${p.status === "live" ? "text-accent" : "text-faint"}`}>
              {p.status.toUpperCase()}
            </span>
            <RowActions>
              <LinkBtn onClick={() => run(() => updateProjectAction(p.id, { status: p.status === "live" ? "draft" : "live" }))}>
                {p.status === "live" ? "hide" : "publish"}
              </LinkBtn>
              <LinkBtn danger onClick={() => run(() => deleteProjectAction(p.id))}>delete</LinkBtn>
            </RowActions>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- NOTES ---
function NotesTab({ data, run, pending }: Ctx) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [minutes, setMinutes] = useState("5");

  return (
    <div className="animate-fade-up">
      <TabHeader title="Notes" right={<span className="font-mono text-label text-faint">{data.notes.length} TOTAL</span>} />
      <div className="flex flex-col mb-9">
        {data.notes.map((n, i) => (
          <div
            key={n.id}
            className={`grid grid-cols-[100px_1fr_110px_150px] gap-5 items-center px-2 py-[15px] border-t ${
              i === data.notes.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="font-mono text-xs text-faint">{n.date}</span>
            <span className={`text-body font-medium ${n.published ? "" : "text-muted"}`}>{n.title}</span>
            <span className={`font-mono text-label ${n.published ? "text-accent" : "text-faint"}`}>
              {n.published ? "PUBLISHED" : "DRAFT"}
            </span>
            <RowActions>
              <LinkBtn onClick={() => run(() => updateNoteAction(n.id, { published: !n.published }))}>
                {n.published ? "unpublish" : "publish"}
              </LinkBtn>
              <LinkBtn danger onClick={() => run(() => deleteNoteAction(n.id))}>delete</LinkBtn>
            </RowActions>
          </div>
        ))}
      </div>
      <div className="border border-strong rounded-[10px] px-7 pt-7 pb-6 max-w-[680px]">
        <div className="font-mono text-label tracking-[.12em] text-faint mb-4">NEW NOTE</div>
        <div className="grid grid-cols-[1fr_160px_90px] gap-3 mb-3">
          <input className={inputClass} placeholder="Title…" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className={inputClass} placeholder="CATEGORY" value={category} onChange={(e) => setCategory(e.target.value)} />
          <input className={inputClass} placeholder="min" value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </div>
        <button
          disabled={pending || !title}
          className={primaryBtn}
          onClick={() =>
            run(
              () =>
                createNoteAction({
                  title,
                  category: category || "DRAFT",
                  minutes: Number(minutes) || 0,
                  date: today(true),
                  published: false,
                }),
              () => {
                setTitle("");
                setCategory("");
                setMinutes("5");
              },
            )
          }
        >
          + Crear borrador
        </button>
      </div>
    </div>
  );
}

// --- TRAINING ---
function TrainingTab({ data, run, pending }: Ctx) {
  const [kind, setKind] = useState<TrainingLog["kind"]>("RUN");
  const [date, setDate] = useState(today(false));
  const [description, setDescription] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const kinds: TrainingLog["kind"][] = ["RUN", "GYM", "SNOW", "OTHER"];

  return (
    <div className="animate-fade-up">
      <TabHeader
        title="Log a session"
        right={<span className="font-mono text-label text-faint">{data.trainingStats.thisWeekKm} KM THIS WEEK</span>}
      />
      <div className="grid grid-cols-4 gap-2.5 mb-6 w-max">
        {kinds.map((k) => (
          <button key={k} onClick={() => setKind(k)} className={pillBtn(kind === k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-[680px]">
        <Field label="DATE (MM.DD)"><input className={`${inputClass} font-mono text-code`} value={date} onChange={(e) => setDate(e.target.value)} /></Field>
        <Field label="DISTANCE (KM)"><input className={`${inputClass} font-mono text-code`} value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="18" /></Field>
        <Field label="DURATION"><input className={`${inputClass} font-mono text-code`} value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="1:42:36" /></Field>
        <Field label="HOW DID IT GO?"><input className={inputClass} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Legs survived, ego intact" /></Field>
      </div>
      <button
        disabled={pending || !description}
        className={`${primaryBtn} mt-5`}
        onClick={() =>
          run(
            () =>
              createTrainingLogAction({
                date,
                kind,
                description,
                detail: distance ? `${distance} KM` : "",
                duration: duration || "—",
                upcoming: false,
              }),
            () => {
              setDescription("");
              setDistance("");
              setDuration("");
            },
          )
        }
      >
        Log it →
      </button>

      <div className="mt-10 flex flex-col">
        <div className="font-mono text-label tracking-[.14em] text-faint mb-3">RECENT SESSIONS</div>
        {data.trainingLogs.map((log, i) => (
          <div
            key={log.id}
            className={`grid grid-cols-[64px_80px_1fr_120px] gap-5 items-center px-2 py-3 border-t ${
              i === data.trainingLogs.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="font-mono text-xs text-faint">{log.date}</span>
            <span className={`font-mono text-label ${log.kind === "SNOW" ? "text-accent" : "text-muted"}`}>{log.kind}</span>
            <span className="text-body">{log.description}</span>
            <RowActions>
              <LinkBtn danger onClick={() => run(() => deleteTrainingLogAction(log.id))}>delete</LinkBtn>
            </RowActions>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- READING ---
function ReadingTab({ data, run, pending }: Ctx) {
  const empty = { title: "", author: "", genre: "", status: "reading" as Book["status"], progressPercent: "", rating: "" };
  const [form, setForm] = useState(empty);

  return (
    <div className="animate-fade-up">
      <TabHeader title="Bookshelf" right={<span className="font-mono text-label text-faint">{data.books.length} BOOKS</span>} />
      <div className="border border-strong rounded-[10px] p-6 mb-6 grid grid-cols-2 gap-3 max-w-[760px]">
        <Field label="TITLE"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="AUTHOR"><input className={inputClass} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></Field>
        <Field label="GENRE"><input className={inputClass} value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></Field>
        <Field label="STATUS">
          <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Book["status"] })}>
            <option value="reading">reading</option>
            <option value="queued">queued</option>
            <option value="done">done</option>
          </select>
        </Field>
        <Field label="PROGRESS % (opcional)"><input className={inputClass} value={form.progressPercent} onChange={(e) => setForm({ ...form, progressPercent: e.target.value })} /></Field>
        <Field label="RATING 1-5 (opcional)"><input className={inputClass} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></Field>
        <div className="col-span-2">
          <button
            disabled={pending || !form.title}
            className={primaryBtn}
            onClick={() =>
              run(
                () =>
                  createBookAction({
                    title: form.title,
                    author: form.author,
                    genre: form.genre,
                    status: form.status,
                    progressPercent: form.progressPercent ? Number(form.progressPercent) : undefined,
                    rating: form.rating ? Number(form.rating) : undefined,
                  }),
                () => setForm(empty),
              )
            }
          >
            + Add book
          </button>
        </div>
      </div>
      <div className="flex flex-col">
        {data.books.map((b, i) => (
          <div
            key={b.id}
            className={`grid grid-cols-[1fr_180px_130px_120px] gap-5 items-center px-2 py-[15px] border-t ${
              i === data.books.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="text-body font-medium">{b.title}</span>
            <span className="font-mono text-label text-muted">{b.author}</span>
            <span className={`font-mono text-label ${b.status === "reading" ? "text-accent" : "text-faint"}`}>
              {b.status.toUpperCase()}
              {b.progressPercent ? ` · ${b.progressPercent}%` : ""}
            </span>
            <RowActions>
              {b.status !== "done" && (
                <LinkBtn onClick={() => run(() => updateBookAction(b.id, { status: "done" }))}>done</LinkBtn>
              )}
              <LinkBtn danger onClick={() => run(() => deleteBookAction(b.id))}>delete</LinkBtn>
            </RowActions>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- USES ---
function UsesTab({ data, run, pending }: Ctx) {
  const cats: UsesItem["category"][] = ["LANGUAGES & BACKEND", "EVERYDAY TOOLS", "OFF THE DESK"];
  const empty = { name: "", category: cats[0], tag: "" };
  const [form, setForm] = useState(empty);

  return (
    <div className="animate-fade-up">
      <TabHeader title="Uses" right={<span className="font-mono text-label text-faint">{data.uses.length} ITEMS</span>} />
      <div className="border border-strong rounded-[10px] p-6 mb-6 grid grid-cols-[1fr_220px_140px] gap-3 items-end max-w-[760px]">
        <Field label="NAME"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="CATEGORY">
          <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as UsesItem["category"] })}>
            {cats.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="TAG"><input className={inputClass} value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="DAILY" /></Field>
        <div className="col-span-3">
          <button
            disabled={pending || !form.name}
            className={primaryBtn}
            onClick={() => run(() => createUsesItemAction(form), () => setForm(empty))}
          >
            + Add item
          </button>
        </div>
      </div>
      <div className="flex flex-col max-w-[760px]">
        {data.uses.map((it, i) => (
          <div
            key={it.id}
            className={`grid grid-cols-[1fr_220px_120px_90px] gap-5 items-center px-2 py-[13px] border-t ${
              i === data.uses.length - 1 ? "border-b" : ""
            } border-soft rounded-md hover-row-tight`}
          >
            <span className="text-body font-medium">{it.name}</span>
            <span className="font-mono text-label text-muted">{it.category}</span>
            <span className="font-mono text-label text-faint">{it.tag}</span>
            <RowActions>
              <LinkBtn danger onClick={() => run(() => deleteUsesItemAction(it.id))}>delete</LinkBtn>
            </RowActions>
          </div>
        ))}
      </div>
    </div>
  );
}
