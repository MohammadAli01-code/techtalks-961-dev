"use server";

import { createClient } from "@/lib/supabase/server";

type TaskProgressResult =
  | { success: true; completed: boolean }
  | { success: false; error: string };

/**
 * Save or remove a task completion for any guided project.
 *
 * Security checks:
 * 1. The learner is authenticated.
 * 2. The task belongs to the requested mission.
 * 3. The mission belongs to an existing project.
 * 4. The learner is enrolled in that project.
 * 5. Previous missions are officially completed.
 * 6. Completed mission tasks cannot be unchecked.
 */
export async function savePortfolioTaskProgress(
  missionId: number,
  taskId: number,
  completed: boolean,
): Promise<TaskProgressResult> {
  if (
    !Number.isSafeInteger(missionId) ||
    missionId <= 0 ||
    !Number.isSafeInteger(taskId) ||
    taskId <= 0 ||
    typeof completed !== "boolean"
  ) {
    return {
      success: false,
      error: "Invalid task information.",
    };
  }

  const supabase = await createClient();

  // Identify the authenticated learner.
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

  // Verify that the task belongs to the requested mission.
  const { data: task, error: taskError } = await supabase
    .from("mission_tasks")
    .select("id, mission_id")
    .eq("id", taskId)
    .eq("mission_id", missionId)
    .maybeSingle();

  if (taskError || !task) {
    return {
      success: false,
      error: "This task does not belong to the mission.",
    };
  }

  // Find the mission's level.
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select("id, level_id")
    .eq("id", missionId)
    .maybeSingle();

  if (missionError || !mission) {
    return {
      success: false,
      error: "Mission not found.",
    };
  }

  // Determine which project owns this mission.
  const { data: level, error: levelError } = await supabase
    .from("levels")
    .select("project_id")
    .eq("id", mission.level_id)
    .maybeSingle();

  if (levelError || !level) {
    return {
      success: false,
      error: "Unable to identify the project.",
    };
  }

  // Require enrollment before allowing task changes.
  const { data: enrollment, error: enrollmentError } = await supabase
    .from("project_enrollments")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("project_id", level.project_id)
    .maybeSingle();

  if (enrollmentError) {
    return {
      success: false,
      error: "Unable to verify your enrollment.",
    };
  }

  if (!enrollment) {
    return {
      success: false,
      error: "Start this project before saving tasks.",
    };
  }

  // Retrieve levels and missions to enforce their sequence.
  const { data: projectLevels, error: levelsError } = await supabase
    .from("levels")
    .select("id, level_number")
    .eq("project_id", level.project_id)
    .order("level_number", { ascending: true });

  if (levelsError || !projectLevels?.length) {
    return {
      success: false,
      error: "Unable to verify the learning path.",
    };
  }

  const levelIds = projectLevels.map((item) => item.id);

  const { data: projectMissions, error: missionsError } = await supabase
    .from("missions")
    .select("id, level_id, mission_number")
    .in("level_id", levelIds);

  if (missionsError || !projectMissions?.length) {
    return {
      success: false,
      error: "Unable to verify mission progression.",
    };
  }

  const levelOrder = new Map(
    projectLevels.map((item) => [item.id, item.level_number]),
  );

  const orderedMissions = [...projectMissions].sort(
    (a, b) =>
      (levelOrder.get(a.level_id) ?? 0) - (levelOrder.get(b.level_id) ?? 0) ||
      a.mission_number - b.mission_number,
  );

  const missionIndex = orderedMissions.findIndex(
    (item) => item.id === missionId,
  );

  if (missionIndex === -1) {
    return {
      success: false,
      error: "Mission not found in this project.",
    };
  }

  // Prevent saving tasks in a locked mission.
  const previousMission = orderedMissions[missionIndex - 1];

  if (previousMission) {
    const { data: previousProgress, error: previousError } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .eq("mission_id", previousMission.id)
      .maybeSingle();

    if (previousError) {
      return {
        success: false,
        error: "Unable to verify your previous mission.",
      };
    }

    if (!previousProgress) {
      return {
        success: false,
        error: "Complete the previous mission before continuing.",
      };
    }
  }

  // Once completed, a mission's tasks must remain checked.
  if (!completed) {
    const { data: missionProgress, error: progressError } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .eq("mission_id", missionId)
      .maybeSingle();

    if (progressError) {
      return {
        success: false,
        error: "Unable to verify mission completion.",
      };
    }

    if (missionProgress) {
      return {
        success: false,
        error: "Completed mission tasks cannot be unchecked.",
      };
    }
  }

  // Save a checked task.
  if (completed) {
    const { error: insertError } = await supabase.from("task_progress").insert({
      user_id: user.id,
      task_id: taskId,
    });

    // Repeated requests must not create duplicate progress.
    if (insertError && insertError.code !== "23505") {
      console.error("Task progress insert failed:", insertError.message);

      return {
        success: false,
        error: "Could not save your task. Please try again.",
      };
    }

    return {
      success: true,
      completed: true,
    };
  }

  // Remove an unfinished task completion.
  const { error: deleteError } = await supabase
    .from("task_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("task_id", taskId);

  if (deleteError) {
    console.error("Task progress deletion failed:", deleteError.message);

    return {
      success: false,
      error: "Could not update your task. Please try again.",
    };
  }

  return {
    success: true,
    completed: false,
  };
}
