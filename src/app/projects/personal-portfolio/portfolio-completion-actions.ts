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
 * 1. Learner must be authenticated.
 * 2. Learner must be enrolled in Personal Portfolio.
 * 3. Mission must belong to Personal Portfolio.
 * 4. Previous mission must be completed.
 * 5. Every task must be saved in Supabase.
 *
 * The learner ID always comes from Supabase Auth.
 */
export async function completePortfolioMission(
  missionId: number,
): Promise<MissionCompletionResult> {
  if (!Number.isSafeInteger(missionId) || missionId <= 0) {
    return {
      success: false,
      error: "Invalid mission.",
    };
  }

  const supabase = await createClient();

  // 1. Authenticate the learner.
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

  // 2. Retrieve the actual Portfolio project and missions.
  let learningPath;

  try {
    learningPath = await getPortfolioLearningPath();
  } catch {
    return {
      success: false,
      error: "Unable to load the learning path.",
    };
  }

  const { projectId, missions } = learningPath;

  // 3. Verify enrollment before allowing mission completion.
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("project_enrollments")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("project_id", projectId)
    .maybeSingle();

  if (enrollmentError) {
    console.error(
      "Unable to verify Portfolio enrollment:",
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
      error: "Start Personal Portfolio before completing missions.",
    };
  }

  // 4. Verify that the mission belongs to this project.
  const missionIndex = missions.findIndex(
    (mission) => mission.id === missionId,
  );

  if (missionIndex === -1) {
    return {
      success: false,
      error: "Mission not found in Personal Portfolio.",
    };
  }

  const mission = missions[missionIndex];

  // 5. Check whether the mission is already completed.
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

  // 6. Enforce sequential mission progression.
  const previousMission = missions[missionIndex - 1];

  if (previousMission) {
    const { data: previousCompletion, error: previousError } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .eq("mission_id", previousMission.id)
      .maybeSingle();

    if (previousError) {
      console.error(
        "Unable to verify previous mission:",
        previousError.message,
      );

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

  // 7. Verify that every task is saved.
  const taskIds = mission.taskItems.map((task) => task.id);

  if (taskIds.length === 0) {
    return {
      success: false,
      error: "This mission has no configured tasks.",
    };
  }

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

  const allTasksCompleted = taskIds.every((taskId) =>
    completedTaskIds.has(taskId),
  );

  if (!allTasksCompleted) {
    return {
      success: false,
      error: "Complete and save every task before finishing this mission.",
    };
  }

  // 8. Save official mission completion.
  // The database trigger provides additional validation.
  const { error: insertError } = await supabase
    .from("mission_progress")
    .insert({
      user_id: user.id,
      mission_id: missionId,
    });

  if (insertError && insertError.code !== "23505") {
    console.error("Unable to complete Portfolio mission:", insertError.message);

    return {
      success: false,
      error: "Could not complete this mission. Please try again.",
    };
  }

  // 9. Refresh affected pages.
  const baseRoute = "/projects/personal-portfolio";

  revalidatePath(baseRoute);
  revalidatePath(`${baseRoute}/levels/${mission.level}`);
  revalidatePath(
    `${baseRoute}/levels/${mission.level}/missions/${mission.number}`,
  );

  return {
    success: true,
    alreadyCompleted: insertError?.code === "23505",
  };
}
