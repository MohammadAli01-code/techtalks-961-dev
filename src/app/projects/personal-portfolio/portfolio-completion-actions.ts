"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioLearningPath } from "./portfolio-server";

type MissionCompletionResult =
  | {
      success: true;
      alreadyCompleted: boolean;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Officially completes a Personal Portfolio mission.
 *
 * Requirements:
 * 1. The learner must be authenticated.
 * 2. The mission must belong to Personal Portfolio.
 * 3. The previous mission must already be completed.
 * 4. Every task must have a saved completion record.
 *
 * The learner ID is always obtained from Supabase Auth.
 */
export async function completePortfolioMission(
  missionId: number,
): Promise<MissionCompletionResult> {
  // Validate the mission ID.
  if (!Number.isSafeInteger(missionId) || missionId <= 0) {
    return {
      success: false,
      error: "Invalid mission.",
    };
  }

  const supabase = await createClient();

  // Verify the authenticated learner.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: "Please sign in to complete this mission.",
    };
  }

  // Load the Portfolio learning path from Supabase.
  let learningPath;

  try {
    learningPath = await getPortfolioLearningPath();
  } catch {
    return {
      success: false,
      error: "Unable to load the learning path.",
    };
  }

  const { missions } = learningPath;

  // Verify that this mission belongs to our Portfolio.
  const missionIndex = missions.findIndex(
    (mission) => mission.id === missionId,
  );

  if (missionIndex === -1) {
    return {
      success: false,
      error: "Mission not found.",
    };
  }

  const mission = missions[missionIndex];

  // Check whether this learner already completed it.
  // Repeated confirmation should not create duplicates.
  const { data: existingCompletion, error: existingError } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("user_id", user.id)
    .eq("mission_id", missionId)
    .maybeSingle();

  if (existingError) {
    console.error("Unable to check mission completion:", existingError.message);

    return {
      success: false,
      error: "Unable to check your mission progress.",
    };
  }

  if (existingCompletion) {
    return {
      success: true,
      alreadyCompleted: true,
    };
  }

  // Verify sequential progression.
  // Mission 1 has no previous mission.
  const previousMission = missions[missionIndex - 1];

  if (previousMission) {
    const { data: previousCompletion, error: previousError } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .eq("mission_id", previousMission.id)
      .maybeSingle();

    if (previousError) {
      console.error("Unable to check previous mission:", previousError.message);

      return {
        success: false,
        error: "Unable to verify your learning progress.",
      };
    }

    if (!previousCompletion) {
      return {
        success: false,
        error: "Complete the previous mission before continuing.",
      };
    }
  }

  // Get the real database IDs of this mission's tasks.
  const taskIds = mission.taskItems.map((task) => task.id);

  if (taskIds.length === 0) {
    return {
      success: false,
      error: "This mission has no configured tasks.",
    };
  }

  // Read the learner's saved task completions.
  const { data: savedTasks, error: tasksError } = await supabase
    .from("task_progress")
    .select("task_id")
    .eq("user_id", user.id)
    .in("task_id", taskIds);

  if (tasksError) {
    console.error("Unable to verify completed tasks:", tasksError.message);

    return {
      success: false,
      error: "Unable to verify your saved tasks.",
    };
  }

  const completedTaskIds = new Set(
    (savedTasks ?? []).map((task) => task.task_id),
  );

  // Every task must be saved before mission completion.
  const allTasksCompleted = taskIds.every((taskId) =>
    completedTaskIds.has(taskId),
  );

  if (!allTasksCompleted) {
    return {
      success: false,
      error: "Complete and save every task before finishing this mission.",
    };
  }

  // The existing database trigger also checks tasks
  // before accepting an official completion record.
  const { error: insertError } = await supabase
    .from("mission_progress")
    .insert({
      user_id: user.id,
      mission_id: missionId,
    });

  if (insertError) {
    // Handle repeated requests safely.
    if (insertError.code === "23505") {
      return {
        success: true,
        alreadyCompleted: true,
      };
    }

    console.error("Unable to complete mission:", insertError.message);

    return {
      success: false,
      error: "Could not complete this mission. Please try again.",
    };
  }

  // Refresh affected project pages.
  const baseRoute = "/projects/personal-portfolio";

  revalidatePath(baseRoute);

  revalidatePath(`${baseRoute}/levels/${mission.level}`);

  revalidatePath(
    `${baseRoute}/levels/${mission.level}/missions/${mission.number}`,
  );

  return {
    success: true,
    alreadyCompleted: false,
  };
}
