import type { Book, Note, NowStatus, Project, TrainingLog, TrainingStats, UsesItem } from "./types";

/**
 * Puerto (en el sentido de ports & adapters). Ni las paginas ni el bot de
 * Telegram importan Supabase directo -- solo conocen esta interface.
 *
 * Hoy la unica implementacion es PlaceholderContentRepository (datos de
 * ejemplo generados por Claude Design). El dia que este lista la base en
 * Supabase, se escribe SupabaseContentRepository implementando lo mismo
 * y se cambia una linea en get-repository.ts. Nada mas se entera.
 */
export interface ContentRepository {
  getNowStatus(): Promise<NowStatus>;

  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;

  getNotes(): Promise<Note[]>;
  getPublishedNotes(): Promise<Note[]>;

  getTrainingLogs(): Promise<TrainingLog[]>;
  getTrainingStats(): Promise<TrainingStats>;

  getBooks(): Promise<Book[]>;

  getUsesItems(): Promise<UsesItem[]>;
}
