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
 * Puerto (en el sentido de ports & adapters). Ni las paginas ni el bot de
 * Telegram importan Supabase directo -- solo conocen esta interface.
 *
 * Hoy la unica implementacion es PlaceholderContentRepository (datos de
 * ejemplo generados por Claude Design). El dia que este lista la base en
 * Supabase, se escribe SupabaseContentRepository implementando lo mismo
 * y se cambia una linea en get-repository.ts. Nada mas se entera.
 *
 * La lectura es publica; la escritura (create/update/delete + updateNowStatus)
 * la usan el admin y el bot, y en Supabase queda protegida por RLS.
 */
export interface ContentRepository {
  // --- lectura ---
  getNowStatus(): Promise<NowStatus>;

  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;

  getNotes(): Promise<Note[]>;
  getPublishedNotes(): Promise<Note[]>;

  getTrainingLogs(): Promise<TrainingLog[]>;
  getTrainingStats(): Promise<TrainingStats>;

  getBooks(): Promise<Book[]>;

  getUsesItems(): Promise<UsesItem[]>;

  // --- escritura ---
  updateNowStatus(input: NowStatusInput): Promise<NowStatus>;

  createProject(input: NewProject): Promise<Project>;
  updateProject(id: string, patch: ProjectPatch): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  createNote(input: NewNote): Promise<Note>;
  updateNote(id: string, patch: NotePatch): Promise<Note>;
  deleteNote(id: string): Promise<void>;

  createTrainingLog(input: NewTrainingLog): Promise<TrainingLog>;
  updateTrainingLog(id: string, patch: TrainingLogPatch): Promise<TrainingLog>;
  deleteTrainingLog(id: string): Promise<void>;

  createBook(input: NewBook): Promise<Book>;
  updateBook(id: string, patch: BookPatch): Promise<Book>;
  deleteBook(id: string): Promise<void>;

  createUsesItem(input: NewUsesItem): Promise<UsesItem>;
  updateUsesItem(id: string, patch: UsesItemPatch): Promise<UsesItem>;
  deleteUsesItem(id: string): Promise<void>;
}
