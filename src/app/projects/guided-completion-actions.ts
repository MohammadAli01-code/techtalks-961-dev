"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getGuidedLearningPath } from "@/lib/guided-projects/guided-server";

type ProjectSlug = "quiz-application" | "ecommerce-frontend";

type Result =
  | { success: true; alreadyCompleted: boolean }
  | { success: false; error: string };

/**
 * Officially completes a guided mission.
 *
 * Security requirements:
 * 1. The learner must be authenticated.
 * 2. The learner must be enrolled in this project.
 * 3. The mission must belong to the selected project.
 * 4. The previous mission must be completed.
 * 5. Every task must be saved in Supabase.
 */
export async function completeGuidedMission(
  projectSlug: ProjectSlug,
  missionId: number,
): Promise<Result> {
  // Validate incoming information.
  if (
    !["quiz-application", "ecommerce-frontend"].includes(projectSlug) ||
    !Number.isSafeInteger(missionId) ||
    missionId <= 0
  ) {
    return { success: false, error: "Invalid mission." };
  }

  const supabase = await createClient();

  // Always identify the learner through Supabase Auth.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Please sign in to save your progress.",
    };
  }

  // Load the selected project and its missions.
  let learningPath;

  try {
    learningPath = await getGuidedLearningPath(projectSlug);
  } catch {
    return {
      success: false,
      error: "Unable to load this project's missions.",
    };
  }

  const { projectId, missions } = learningPath;

  // Verify that the learner is enrolled in this project.
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("project_enrollments")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .maybeSingle();

  if (enrollmentError) {
    console.error(
      "Unable to verify project enrollment:",
      enrollmentError.message,
    );

    return {
      success: false,
      error: "Unable to verify your project enrollment.",
    };
  }

  if (!enrollment) {
    return {
      success: false,
      error: "Start this project before completing missions.",
    };
  }

  // Verify that the mission belongs to this project.
  const missionIndex = missions.findIndex(
    (mission) => mission.id === missionId,
  );

  if (missionIndex === -1) {
    return {
      success: false,
      error: "Mission does not belong to this project.",
    };
  }

  const mission = missions[missionIndex];

  // Check for an existing completion.
  const { data: completed, error: lookupError } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("mission_id", missionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (lookupError) {
    return {
      success: false,
      error: "Could not check saved completion.",
    };
  }

  if (completed) {
    return {
      success: true,
      alreadyCompleted: true,
    };
  }

  // Enforce sequential mission completion.
  const previousMission = missions[missionIndex - 1];

  if (previousMission) {
    const { data: previous, error: previousError } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .eq("mission_id", previousMission.id)
      .maybeSingle();

    if (previousError || !previous) {
      return {
        success: false,
        error: "Complete the previous mission first.",
      };
    }
  }

  // Verify all mission tasks have been saved.
  const taskIds = mission.taskItems.map((task) => task.id);

  if (taskIds.length === 0) {
    return {
      success: false,
      error: "This mission has no configured tasks.",
    };
  }

  const { data: savedTasks, error: taskError } = await supabase
    .from("task_progress")
    .select("task_id")
    .eq("user_id", user.id)
    .in("task_id", taskIds);

  if (taskError) {
    return {
      success: false,
      error: "Unable to verify your saved tasks.",
    };
  }

  const savedTaskIds = new Set((savedTasks ?? []).map((task) => task.task_id));

  if (!taskIds.every((taskId) => savedTaskIds.has(taskId))) {
    return {
      success: false,
      error: "Save all tasks before completing the mission.",
    };
  }

  // Save the official mission completion.
  const { error: insertError } = await supabase
    .from("mission_progress")
    .insert({
      user_id: user.id,
      mission_id: missionId,
    });

  if (insertError && insertError.code !== "23505") {
    console.error("Guided mission completion failed:", insertError.message);

    return {
      success: false,
      error: "Unable to complete this mission. Please try again.",
    };
  }

  // Refresh affected pages.
  const projectRoute = `/projects/${projectSlug}`;

  revalidatePath(projectRoute);
  revalidatePath(`${projectRoute}/levels/${mission.level}`);
  revalidatePath(
    `${projectRoute}/levels/${mission.level}/missions/${mission.number}`,
  );

  return {
    success: true,
    alreadyCompleted: insertError?.code === "23505",
  };
}
