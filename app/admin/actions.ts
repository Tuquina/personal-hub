"use server";

import { revalidatePath } from "next/cache";
import { getRepository } from "@/lib/content/get-repository";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isOwnerEmail } from "@/lib/owner";
import type {
  NewBook,
  NewNote,
  NewProject,
  NewTrainingLog,
  NewUsesItem,
  NowStatusInput,
} from "@/lib/content/types";

/**
 * Server actions del admin. Cada una exige sesión (además, la escritura la
 * ataja RLS por email en Supabase) y revalida las páginas afectadas para que
 * el cambio se vea al toque, tanto en el dashboard como en el sitio público.
 */
async function requireOwner() {
  const {
    data: { user },
  } = await createSupabaseServerClient().auth.getUser();
  if (!isOwnerEmail(user?.email)) throw new Error("No autorizado — iniciá sesión con tu cuenta.");
}

function bump(...paths: string[]) {
  for (const p of new Set([...paths, "/admin/dashboard"])) revalidatePath(p);
}

// --- now / this week ---
export async function saveNowStatus(input: NowStatusInput) {
  await requireOwner();
  await getRepository().updateNowStatus(input);
  bump("/");
}

// --- projects ---
export async function createProjectAction(input: NewProject) {
  await requireOwner();
  await getRepository().createProject(input);
  bump("/work", "/");
}
export async function updateProjectAction(id: string, patch: Partial<NewProject>) {
  await requireOwner();
  await getRepository().updateProject(id, patch);
  bump("/work", "/");
}
export async function deleteProjectAction(id: string) {
  await requireOwner();
  await getRepository().deleteProject(id);
  bump("/work", "/");
}

// --- notes ---
export async function createNoteAction(input: NewNote) {
  await requireOwner();
  await getRepository().createNote(input);
  bump("/notes", "/");
}
export async function updateNoteAction(id: string, patch: Partial<NewNote>) {
  await requireOwner();
  await getRepository().updateNote(id, patch);
  bump("/notes", "/");
}
export async function deleteNoteAction(id: string) {
  await requireOwner();
  await getRepository().deleteNote(id);
  bump("/notes", "/");
}

// --- training ---
export async function createTrainingLogAction(input: NewTrainingLog) {
  await requireOwner();
  await getRepository().createTrainingLog(input);
  bump("/training", "/");
}
export async function deleteTrainingLogAction(id: string) {
  await requireOwner();
  await getRepository().deleteTrainingLog(id);
  bump("/training", "/");
}

// --- books ---
export async function createBookAction(input: NewBook) {
  await requireOwner();
  await getRepository().createBook(input);
  bump("/reading", "/");
}
export async function updateBookAction(id: string, patch: Partial<NewBook>) {
  await requireOwner();
  await getRepository().updateBook(id, patch);
  bump("/reading", "/");
}
export async function deleteBookAction(id: string) {
  await requireOwner();
  await getRepository().deleteBook(id);
  bump("/reading", "/");
}

// --- uses ---
export async function createUsesItemAction(input: NewUsesItem) {
  await requireOwner();
  await getRepository().createUsesItem(input);
  bump("/uses");
}
export async function deleteUsesItemAction(id: string) {
  await requireOwner();
  await getRepository().deleteUsesItem(id);
  bump("/uses");
}
