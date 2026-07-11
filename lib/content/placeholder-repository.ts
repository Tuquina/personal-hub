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

/**
 * ⚠️ TODO: contenido placeholder.
 *
 * Todo lo que hay en este archivo lo genero Claude Design como ejemplo
 * (la tesis, los libros, las corridas, los proyectos) -- Fernando confirmo
 * que no es real. Reemplazar por SupabaseContentRepository cuando este
 * lista la base, o editar estos arrays a mano mientras tanto.
 */

const NOW_STATUS: NowStatus = {
  headline:
    "Deep in my thesis, slowly building a marathon base, and finishing Black Clover before someone spoils it.",
  weekSummary:
    "This block updates every week — it's how I keep myself honest. If it's stale, ping me.",
  lastUpdated: "WEDNESDAY 23:47",
  tickerItems: [
    "WRITING THESIS ON SETTLEMENT PIPELINES",
    "WEEK 6/20 OF MARATHON BLOCK · 42 KM",
    "READING: EL ÚLTIMO SECRETO + BLACK CLOVER 32",
    "NEXT ADVENTURE: SNOWBOARD · 08.15",
  ],
};

const PROJECTS: Project[] = [
  {
    id: "strixhaven-draft-academy",
    code: "P—01",
    title: "Strixhaven Draft Academy",
    description: "Draft training platform for Magic players — live picks, pack simulation and stats.",
    stack: "TYPESCRIPT · SUPABASE · VERCEL",
    year: "2025 →",
    url: "https://github.com/Tuquina/strixhaven-draft-academy",
    status: "live",
  },
  {
    id: "ledger-core",
    code: "P—02",
    title: "Ledger Core",
    description: "Double-entry ledger engine for a payments platform — immutable events, exact balances.",
    stack: "JAVA · SPRING BOOT · POSTGRESQL",
    year: "2025",
    status: "live",
  },
  {
    id: "settlement-pipeline",
    code: "P—03",
    title: "Settlement Pipeline",
    description: "Thesis project — event-driven settlement between institutions, with replay and audit.",
    stack: "JAVA · KAFKA · CLEAN ARCH",
    year: "2026",
    status: "draft",
  },
  {
    id: "reconcile-cli",
    code: "P—04",
    title: "Reconcile CLI",
    description: "Bank-statement reconciliation tool — fuzzy matching, diff reports, zero dependencies.",
    stack: "C# · .NET",
    year: "2024",
    status: "live",
  },
  {
    id: "this-site",
    code: "P—05",
    title: "This site",
    description: "The hub you're looking at — portfolio, notes, training and reading logs in one place.",
    stack: "NEXT.JS · TAILWIND · SUPABASE",
    year: "2026 →",
    status: "live",
  },
];

const NOTES: Note[] = [
  { id: "n1", date: "07.06.2026", title: "Idempotency in payment retries", category: "DISTRIBUTED", minutes: 6, published: true },
  { id: "n2", date: "06.21.2026", title: "Clean architecture without the ceremony", category: "ARCHITECTURE", minutes: 9, published: true },
  { id: "n3", date: "06.02.2026", title: "Money is not a double: storing amounts in SQL", category: "DATABASES", minutes: 7, published: true },
  { id: "n4", date: "05.18.2026", title: "What running 60km weeks taught me about tech debt", category: "PERSONAL", minutes: 4, published: true },
  { id: "n5", date: "04.29.2026", title: "Spring transactions: the gotchas nobody documents", category: "JAVA", minutes: 11, published: true },
  { id: "n6", date: "—", title: "Outbox pattern, but explained with empanadas (wip)", category: "DRAFT", minutes: 0, published: false },
];

const TRAINING_STATS: TrainingStats = {
  thisWeekKm: 42,
  longestRunKm: 18,
  avgPace: "5:42",
  daysToRaceDay: 134,
  weeklyVolume: [30, 38, 34, 46, 42, 54, 36, 58, 52, 66, 60, 80],
};

const TRAINING_LOGS: TrainingLog[] = [
  { id: "t1", date: "08.15", kind: "SNOW", description: "Snowboard trip — Cerro Catedral (counting the days)", detail: "UPCOMING", duration: "—", upcoming: true },
  { id: "t2", date: "07.07", kind: "RUN", description: "Long run — legs survived, ego intact", detail: "18 KM · 5:42/KM", duration: "1:42:36" },
  { id: "t3", date: "07.05", kind: "GYM", description: "Strength — lower body + core", detail: "5 EXERCISES", duration: "0:55:00" },
  { id: "t4", date: "07.04", kind: "RUN", description: "Intervals — 6 × 800m @ 4:50", detail: "9 KM · 5:10/KM", duration: "0:46:30" },
  { id: "t5", date: "07.02", kind: "RUN", description: "Easy recovery — podcast pace", detail: "8 KM · 6:15/KM", duration: "0:50:00" },
];

const BOOKS: Book[] = [
  { id: "b1", title: "El último secreto", author: "DAN BROWN", genre: "THRILLER", status: "reading", progressPercent: 62 },
  { id: "b2", title: "Black Clover — vol. 32", author: "YŪKI TABATA", genre: "MANGA · VOLUME 32 OF 36", status: "reading", progressPercent: 89 },
  { id: "b3", title: "El mago de los libros", author: "JIM C. HINES", genre: "FANTASY", status: "queued" },
  { id: "b4", title: "Black Clover — vol. 31", author: "YŪKI TABATA", genre: "MANGA", status: "done", rating: 5 },
  { id: "b5", title: "Black Clover — vol. 30", author: "YŪKI TABATA", genre: "MANGA", status: "done", rating: 4 },
  { id: "b6", title: "El código Da Vinci (re-read)", author: "DAN BROWN", genre: "THRILLER", status: "done", rating: 4 },
];

const USES: UsesItem[] = [
  { id: "u1", name: "Java + Spring Boot", category: "LANGUAGES & BACKEND", tag: "DAILY" },
  { id: "u2", name: "SQL / PostgreSQL", category: "LANGUAGES & BACKEND", tag: "DAILY" },
  { id: "u3", name: "C# / .NET", category: "LANGUAGES & BACKEND", tag: "OFTEN" },
  { id: "u4", name: "C", category: "LANGUAGES & BACKEND", tag: "WHEN IT HURTS" },
  { id: "u5", name: "TypeScript", category: "LANGUAGES & BACKEND", tag: "SIDE PROJECTS" },
  { id: "u6", name: "IntelliJ IDEA", category: "EVERYDAY TOOLS", tag: "EDITOR" },
  { id: "u7", name: "DBeaver", category: "EVERYDAY TOOLS", tag: "SQL" },
  { id: "u8", name: "Docker", category: "EVERYDAY TOOLS", tag: "EVERYTHING" },
  { id: "u9", name: "Postman", category: "EVERYDAY TOOLS", tag: "APIS" },
  { id: "u10", name: "Obsidian", category: "EVERYDAY TOOLS", tag: "NOTES" },
  { id: "u11", name: "Garmin Forerunner", category: "OFF THE DESK", tag: "RUNS" },
  { id: "u12", name: "Kindle Paperwhite", category: "OFF THE DESK", tag: "BOOKS" },
  { id: "u13", name: "Burton board", category: "OFF THE DESK", tag: "WINTER ❄" },
  { id: "u14", name: "Mate + termo", category: "OFF THE DESK", tag: "NON-NEGOTIABLE" },
];

/** Helpers de escritura sobre arrays en memoria (solo para el placeholder). */
function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function insert<T extends { id: string }>(arr: T[], input: Omit<T, "id">): T {
  const created = { ...(input as object), id: newId() } as T;
  arr.push(created);
  return created;
}

function patch<T extends { id: string }>(arr: T[], id: string, changes: Partial<Omit<T, "id">>, label: string): T {
  const item = arr.find((x) => x.id === id);
  if (!item) throw new Error(`${label} no encontrado: ${id}`);
  Object.assign(item, changes);
  return item;
}

function remove<T extends { id: string }>(arr: T[], id: string, label: string): void {
  const i = arr.findIndex((x) => x.id === id);
  if (i === -1) throw new Error(`${label} no encontrado: ${id}`);
  arr.splice(i, 1);
}

export class PlaceholderContentRepository implements ContentRepository {
  // --- lectura ---
  async getNowStatus() { return NOW_STATUS; }

  async getProjects() { return PROJECTS; }
  async getProject(id: string) { return PROJECTS.find((p) => p.id === id) ?? null; }

  async getNotes() { return NOTES; }
  async getPublishedNotes() { return NOTES.filter((n) => n.published); }

  async getTrainingLogs() { return TRAINING_LOGS; }
  async getTrainingStats() { return TRAINING_STATS; }

  async getBooks() { return BOOKS; }

  async getUsesItems() { return USES; }

  // --- escritura ---
  async updateNowStatus(input: NowStatusInput) {
    NOW_STATUS.headline = input.headline;
    NOW_STATUS.weekSummary = input.weekSummary;
    NOW_STATUS.tickerItems = input.tickerItems;
    NOW_STATUS.lastUpdated = new Date().toUTCString();
    return NOW_STATUS;
  }

  async createProject(input: NewProject) { return insert(PROJECTS, input); }
  async updateProject(id: string, changes: ProjectPatch) { return patch(PROJECTS, id, changes, "project"); }
  async deleteProject(id: string) { remove(PROJECTS, id, "project"); }

  async createNote(input: NewNote) { return insert(NOTES, input); }
  async updateNote(id: string, changes: NotePatch) { return patch(NOTES, id, changes, "note"); }
  async deleteNote(id: string) { remove(NOTES, id, "note"); }

  async createTrainingLog(input: NewTrainingLog) { return insert(TRAINING_LOGS, input); }
  async updateTrainingLog(id: string, changes: TrainingLogPatch) { return patch(TRAINING_LOGS, id, changes, "training log"); }
  async deleteTrainingLog(id: string) { remove(TRAINING_LOGS, id, "training log"); }

  async createBook(input: NewBook) { return insert(BOOKS, input); }
  async updateBook(id: string, changes: BookPatch) { return patch(BOOKS, id, changes, "book"); }
  async deleteBook(id: string) { remove(BOOKS, id, "book"); }

  async createUsesItem(input: NewUsesItem) { return insert(USES, input); }
  async updateUsesItem(id: string, changes: UsesItemPatch) { return patch(USES, id, changes, "uses item"); }
  async deleteUsesItem(id: string) { remove(USES, id, "uses item"); }
}
