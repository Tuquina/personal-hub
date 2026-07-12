import type {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { ContentRepository } from "./content-repository";
import type {
  Book,
  BookPatch,
  NewBook,
  NewNote,
  NewProject,
  NewTrainingLog,
  NewUsesItem,
  Note,
  NotePatch,
  NowStatus,
  NowStatusInput,
  Project,
  ProjectPatch,
  TrainingLog,
  TrainingLogPatch,
  TrainingStats,
  UsesItem,
  UsesItemPatch,
} from "./types";

type DB = SupabaseClient<Database>;
type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];

// Día de carrera (maratón). Se muestra fijo en la training page; de acá sale daysToRaceDay.
const RACE_DAY = new Date("2026-11-22T00:00:00Z");

/** Write con .single(): lanza si hubo error, devuelve la fila. */
function unwrap<T>(res: PostgrestSingleResponse<T>): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}
/** Select de lista: lanza si hubo error, devuelve el array. */
function unwrapList<T>(res: PostgrestResponse<T>): T[] {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}
/** Delete / mutación sin retorno: solo propaga el error. */
function check(res: { error: { message: string } | null }): void {
  if (res.error) throw new Error(res.error.message);
}

// --- formato de fechas para display ---
function isoToMMDDYYYY(d: string | null): string {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${m}.${day}.${y}`;
}
function isoToMMDD(d: string): string {
  const [, m, day] = d.split("-");
  return `${m}.${day}`;
}
function fmtUpdated(iso: string): string {
  const d = new Date(iso);
  const opts = { timeZone: "America/Argentina/Buenos_Aires" } as const;
  const day = d.toLocaleDateString("en-US", { weekday: "long", ...opts }).toUpperCase();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", ...opts });
  return `${day} ${time}`;
}

// --- parseo de inputs de escritura (display -> DB) ---
function displayToISO(d?: string): string | null {
  if (!d) return null;
  const m = d.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  return m ? `${m[3]}-${m[1]}-${m[2]}` : null;
}
function mmddToISO(d: string): string {
  const m = d.match(/^(\d{2})\.(\d{2})$/);
  const y = new Date().getFullYear();
  return m ? `${y}-${m[1]}-${m[2]}` : new Date().toISOString().slice(0, 10);
}
function kmFromDetail(detail?: string): number | null {
  if (!detail) return null;
  const m = detail.match(/([\d.]+)\s*KM/i);
  return m ? Number(m[1]) : null;
}
function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
  return `${base || "note"}-${Math.random().toString(36).slice(2, 6)}`;
}

// --- derivación de stats de training ---
function durationToSecs(s: string | null): number | null {
  if (!s) return null;
  const parts = s.split(":").map(Number);
  if (parts.some((n) => Number.isNaN(n))) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return null;
}
function secsToPace(secsPerKm: number): string {
  const m = Math.floor(secsPerKm / 60);
  const s = Math.round(secsPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function computeStats(rows: Row<"training_logs">[]): TrainingStats {
  const now = Date.now();
  const WEEK = 7 * 86_400_000;

  const rawWeeks = new Array(12).fill(0) as number[];
  let longest = 0;
  let runSecs = 0;
  let runKm = 0;

  for (const r of rows) {
    if (r.upcoming || r.distance_km == null) continue;
    const km = Number(r.distance_km);
    const t = new Date(`${r.logged_on}T00:00:00Z`).getTime();
    const weeksAgo = Math.floor((now - t) / WEEK);
    if (weeksAgo >= 0 && weeksAgo < 12) rawWeeks[11 - weeksAgo] += km;
    if (r.kind === "RUN") {
      if (km > longest) longest = km;
      const secs = durationToSecs(r.duration);
      if (secs) {
        runSecs += secs;
        runKm += km;
      }
    }
  }

  const max = Math.max(...rawWeeks, 0);
  const weeklyVolume = max > 0 ? rawWeeks.map((v) => Math.round((v / max) * 100)) : rawWeeks;
  const daysToRaceDay = Math.max(0, Math.ceil((RACE_DAY.getTime() - now) / 86_400_000));

  return {
    thisWeekKm: Math.round(rawWeeks[11]),
    longestRunKm: Math.round(longest),
    avgPace: runKm > 0 ? secsToPace(runSecs / runKm) : "—",
    daysToRaceDay,
    weeklyVolume,
  };
}

// --- mappers DB -> dominio ---
function toProject(r: Row<"projects">): Project {
  return {
    id: r.id,
    code: r.code,
    title: r.title,
    description: r.description,
    stack: r.stack,
    year: r.year_label,
    url: r.url ?? undefined,
    status: r.status as Project["status"],
  };
}
function toNote(r: Row<"notes">): Note {
  return {
    id: r.id,
    date: isoToMMDDYYYY(r.published_at),
    title: r.title,
    category: r.category,
    minutes: r.minutes,
    published: r.published,
  };
}
function toLog(r: Row<"training_logs">): TrainingLog {
  const detail = r.upcoming ? "UPCOMING" : r.distance_km != null ? `${Number(r.distance_km)} KM` : "";
  return {
    id: r.id,
    date: isoToMMDD(r.logged_on),
    kind: r.kind as TrainingLog["kind"],
    description: r.description,
    detail,
    duration: r.duration ?? "—",
    upcoming: r.upcoming,
  };
}
function toBook(r: Row<"books">): Book {
  return {
    id: r.id,
    title: r.title,
    author: r.author,
    genre: r.genre,
    status: r.status as Book["status"],
    progressPercent: r.progress_percent ?? undefined,
    rating: r.rating ?? undefined,
    note: r.note ?? undefined,
  };
}
function toUse(r: Row<"uses_items">): UsesItem {
  return { id: r.id, name: r.name, category: r.category as UsesItem["category"], tag: r.tag };
}

/**
 * Adapter real contra Supabase. La escritura queda protegida por RLS (solo el
 * usuario cuyo email es el de Fernando). Recibe un cliente ya ligado a la
 * sesión del request (ver lib/supabase/server.ts).
 */
export class SupabaseContentRepository implements ContentRepository {
  constructor(private db: DB) {}

  private async nextSort(table: "projects" | "uses_items"): Promise<number> {
    const { data } = await this.db
      .from(table)
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    return (data?.sort_order ?? -1) + 1;
  }

  // --- lectura ---
  async getNowStatus(): Promise<NowStatus> {
    const { data, error } = await this.db.from("now_status").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      return { headline: "", weekSummary: "", tickerItems: [], lastUpdated: "—" };
    }
    return {
      headline: data.headline,
      weekSummary: data.week_summary,
      tickerItems: data.ticker_items,
      lastUpdated: fmtUpdated(data.updated_at),
    };
  }

  async getProjects(): Promise<Project[]> {
    const data = unwrapList(
      await this.db.from("projects").select("*").order("sort_order").order("created_at"),
    );
    return data.map(toProject);
  }
  async getProject(id: string): Promise<Project | null> {
    const { data, error } = await this.db.from("projects").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toProject(data) : null;
  }

  async getNotes(): Promise<Note[]> {
    const data = unwrapList(
      await this.db.from("notes").select("*").order("published_at", { ascending: false, nullsFirst: false }),
    );
    return data.map(toNote);
  }
  async getPublishedNotes(): Promise<Note[]> {
    const data = unwrapList(
      await this.db
        .from("notes")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false, nullsFirst: false }),
    );
    return data.map(toNote);
  }

  async getTrainingLogs(): Promise<TrainingLog[]> {
    const data = unwrapList(
      await this.db
        .from("training_logs")
        .select("*")
        .order("upcoming", { ascending: false })
        .order("logged_on", { ascending: false }),
    );
    return data.map(toLog);
  }
  async getTrainingStats(): Promise<TrainingStats> {
    const data = unwrapList(await this.db.from("training_logs").select("*"));
    return computeStats(data);
  }

  async getBooks(): Promise<Book[]> {
    const data = unwrapList(await this.db.from("books").select("*").order("created_at"));
    return data.map(toBook);
  }

  async getUsesItems(): Promise<UsesItem[]> {
    const data = unwrapList(await this.db.from("uses_items").select("*").order("sort_order"));
    return data.map(toUse);
  }

  // --- escritura ---
  async updateNowStatus(input: NowStatusInput): Promise<NowStatus> {
    const data = unwrap(
      await this.db
        .from("now_status")
        .upsert({
          id: 1,
          headline: input.headline,
          week_summary: input.weekSummary,
          ticker_items: input.tickerItems,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single(),
    );
    return {
      headline: data.headline,
      weekSummary: data.week_summary,
      tickerItems: data.ticker_items,
      lastUpdated: fmtUpdated(data.updated_at),
    };
  }

  async createProject(input: NewProject): Promise<Project> {
    const sort_order = await this.nextSort("projects");
    const data = unwrap(
      await this.db
        .from("projects")
        .insert({
          code: input.code,
          title: input.title,
          description: input.description,
          stack: input.stack,
          year_label: input.year,
          url: input.url ?? null,
          status: input.status,
          sort_order,
        })
        .select("*")
        .single(),
    );
    return toProject(data);
  }
  async updateProject(id: string, patch: ProjectPatch): Promise<Project> {
    const data = unwrap(
      await this.db
        .from("projects")
        .update({
          ...(patch.code !== undefined && { code: patch.code }),
          ...(patch.title !== undefined && { title: patch.title }),
          ...(patch.description !== undefined && { description: patch.description }),
          ...(patch.stack !== undefined && { stack: patch.stack }),
          ...(patch.year !== undefined && { year_label: patch.year }),
          ...(patch.url !== undefined && { url: patch.url ?? null }),
          ...(patch.status !== undefined && { status: patch.status }),
        })
        .eq("id", id)
        .select("*")
        .single(),
    );
    return toProject(data);
  }
  async deleteProject(id: string): Promise<void> {
    check(await this.db.from("projects").delete().eq("id", id));
  }

  async createNote(input: NewNote): Promise<Note> {
    const data = unwrap(
      await this.db
        .from("notes")
        .insert({
          slug: slugify(input.title),
          title: input.title,
          category: input.category,
          minutes: input.minutes,
          published: input.published,
          published_at: displayToISO(input.date),
        })
        .select("*")
        .single(),
    );
    return toNote(data);
  }
  async updateNote(id: string, patch: NotePatch): Promise<Note> {
    const data = unwrap(
      await this.db
        .from("notes")
        .update({
          ...(patch.title !== undefined && { title: patch.title }),
          ...(patch.category !== undefined && { category: patch.category }),
          ...(patch.minutes !== undefined && { minutes: patch.minutes }),
          ...(patch.published !== undefined && { published: patch.published }),
          ...(patch.date !== undefined && { published_at: displayToISO(patch.date) }),
        })
        .eq("id", id)
        .select("*")
        .single(),
    );
    return toNote(data);
  }
  async deleteNote(id: string): Promise<void> {
    check(await this.db.from("notes").delete().eq("id", id));
  }

  async createTrainingLog(input: NewTrainingLog): Promise<TrainingLog> {
    const data = unwrap(
      await this.db
        .from("training_logs")
        .insert({
          logged_on: mmddToISO(input.date),
          kind: input.kind,
          description: input.description,
          distance_km: kmFromDetail(input.detail),
          duration: input.duration,
          upcoming: input.upcoming ?? false,
        })
        .select("*")
        .single(),
    );
    return toLog(data);
  }
  async updateTrainingLog(id: string, patch: TrainingLogPatch): Promise<TrainingLog> {
    const data = unwrap(
      await this.db
        .from("training_logs")
        .update({
          ...(patch.date !== undefined && { logged_on: mmddToISO(patch.date) }),
          ...(patch.kind !== undefined && { kind: patch.kind }),
          ...(patch.description !== undefined && { description: patch.description }),
          ...(patch.detail !== undefined && { distance_km: kmFromDetail(patch.detail) }),
          ...(patch.duration !== undefined && { duration: patch.duration }),
          ...(patch.upcoming !== undefined && { upcoming: patch.upcoming }),
        })
        .eq("id", id)
        .select("*")
        .single(),
    );
    return toLog(data);
  }
  async deleteTrainingLog(id: string): Promise<void> {
    check(await this.db.from("training_logs").delete().eq("id", id));
  }

  async createBook(input: NewBook): Promise<Book> {
    const data = unwrap(
      await this.db
        .from("books")
        .insert({
          title: input.title,
          author: input.author,
          genre: input.genre,
          status: input.status,
          progress_percent: input.progressPercent ?? null,
          rating: input.rating ?? null,
          note: input.note ?? null,
        })
        .select("*")
        .single(),
    );
    return toBook(data);
  }
  async updateBook(id: string, patch: BookPatch): Promise<Book> {
    const data = unwrap(
      await this.db
        .from("books")
        .update({
          ...(patch.title !== undefined && { title: patch.title }),
          ...(patch.author !== undefined && { author: patch.author }),
          ...(patch.genre !== undefined && { genre: patch.genre }),
          ...(patch.status !== undefined && { status: patch.status }),
          ...(patch.progressPercent !== undefined && { progress_percent: patch.progressPercent ?? null }),
          ...(patch.rating !== undefined && { rating: patch.rating ?? null }),
          ...(patch.note !== undefined && { note: patch.note ?? null }),
        })
        .eq("id", id)
        .select("*")
        .single(),
    );
    return toBook(data);
  }
  async deleteBook(id: string): Promise<void> {
    check(await this.db.from("books").delete().eq("id", id));
  }

  async createUsesItem(input: NewUsesItem): Promise<UsesItem> {
    const sort_order = await this.nextSort("uses_items");
    const data = unwrap(
      await this.db
        .from("uses_items")
        .insert({ name: input.name, category: input.category, tag: input.tag, sort_order })
        .select("*")
        .single(),
    );
    return toUse(data);
  }
  async updateUsesItem(id: string, patch: UsesItemPatch): Promise<UsesItem> {
    const data = unwrap(
      await this.db
        .from("uses_items")
        .update({
          ...(patch.name !== undefined && { name: patch.name }),
          ...(patch.category !== undefined && { category: patch.category }),
          ...(patch.tag !== undefined && { tag: patch.tag }),
        })
        .eq("id", id)
        .select("*")
        .single(),
    );
    return toUse(data);
  }
  async deleteUsesItem(id: string): Promise<void> {
    check(await this.db.from("uses_items").delete().eq("id", id));
  }
}
