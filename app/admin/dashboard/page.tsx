import { redirect } from "next/navigation";
import { getRepository } from "@/lib/content/get-repository";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { DashboardClient, type DashboardData } from "@/components/admin/dashboard-client";
import { OWNER_EMAIL } from "@/lib/owner";

// Server component: trae los datos reales del repositorio y protege el acceso
// (además del middleware). La UI y las escrituras viven en DashboardClient.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (isSupabaseConfigured()) {
    const {
      data: { user },
    } = await createSupabaseServerClient().auth.getUser();
    if (user?.email !== OWNER_EMAIL) redirect("/admin");
  }

  const repo = getRepository();
  const [now, projects, notes, trainingStats, trainingLogs, books, uses] = await Promise.all([
    repo.getNowStatus(),
    repo.getProjects(),
    repo.getNotes(),
    repo.getTrainingStats(),
    repo.getTrainingLogs(),
    repo.getBooks(),
    repo.getUsesItems(),
  ]);

  const data: DashboardData = { now, projects, notes, trainingStats, trainingLogs, books, uses };
  return <DashboardClient data={data} />;
}
