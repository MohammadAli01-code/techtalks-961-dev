"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getGuidedLearningPath } from "@/lib/guided-projects/guided-server";

type Slug = "quiz-application" | "ecommerce-frontend";
type Result = { success: true; alreadyCompleted: boolean } | { success: false; error: string };

export async function completeGuidedMission(projectSlug: Slug, missionId: number): Promise<Result> {
  if (!["quiz-application", "ecommerce-frontend"].includes(projectSlug)
      || !Number.isSafeInteger(missionId) || missionId <= 0) {
    return { success: false, error: "Invalid mission." };
  }
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Sign in to save progress." };

  let missions: Awaited<ReturnType<typeof getGuidedLearningPath>>["missions"];
  try { ({missions} = await getGuidedLearningPath(projectSlug)); }
  catch { return { success: false, error: "Unable to load this project's missions." }; }
  const index = missions.findIndex((mission) => mission.id === missionId);
  if (index === -1) return { success: false, error: "Mission does not belong to this project." };

  const { data: completed, error: lookupError } = await supabase.from("mission_progress")
    .select("mission_id").eq("mission_id", missionId).eq("user_id", user.id).maybeSingle();
  if (lookupError) return { success: false, error: "Could not check saved completion." };
  if (completed) return { success: true, alreadyCompleted: true };

  const previousMission = missions[index - 1];
  if (previousMission) {
    const { data: previous, error } = await supabase.from("mission_progress")
      .select("mission_id").eq("user_id", user.id).eq("mission_id", previousMission.id).maybeSingle();
    if (error || !previous) return { success: false, error: "Complete the previous mission first." };
  }
  const taskIds = missions[index].taskItems.map((task) => task.id);
  if (!taskIds.length) return { success: false, error: "This mission has no tasks." };
  const { data: saved, error: taskError } = await supabase.from("task_progress")
    .select("task_id").eq("user_id", user.id).in("task_id", taskIds);
  if (taskError) return { success: false, error: "Unable to check saved tasks." };
  const savedIds = new Set((saved ?? []).map((row) => row.task_id));
  if (!taskIds.every((id) => savedIds.has(id))) {
    return { success: false, error: "Save all tasks before completing the mission." };
  }
  const { error } = await supabase.from("mission_progress").insert({ user_id: user.id, mission_id: missionId });
  if (error && error.code !== "23505") {
    console.error("Guided mission completion failed:", error.message);
    return { success: false, error: "Unable to complete this mission. Please retry." };
  }
  const mission = missions[index];
  revalidatePath(`/projects/${projectSlug}`);
  revalidatePath(`/projects/${projectSlug}/levels/${mission.level}/missions/${mission.number}`);
  return { success: true, alreadyCompleted: Boolean(error) };
}
