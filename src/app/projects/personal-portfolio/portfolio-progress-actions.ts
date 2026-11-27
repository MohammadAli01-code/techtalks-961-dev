"use server";

import { createClient } from "@/lib/supabase/server";

type TaskProgressResult =
  | {
      success: true;
      completed: boolean;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Saves or removes one learner's task completion.
 *
 * The user ID comes from Supabase Auth, never from
 * the browser. Supabase RLS provides an additional
 * layer of protection.
 */
export async function savePortfolioTaskProgress(
  missionId: number,
  taskId: number,
  completed: boolean,
): Promise<TaskProgressResult> {
  // Validate all inputs before accessing the database.
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

  // Get the authenticated learner from Supabase.
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

  // Confirm that the requested task exists
  // and belongs to the specified mission.
  const { data: task, error: taskError } = await supabase
    .from("mission_tasks")
    .select("id, mission_id")
    .eq("id", taskId)
    .eq("mission_id", missionId)
    .maybeSingle();

  if (taskError) {
    console.error("Unable to verify task:", taskError.message);

    return {
      success: false,
      error: "Unable to verify this task.",
    };
  }

  if (!task) {
    return {
      success: false,
      error: "This task does not belong to the mission.",
    };
  }

  // Once a mission is completed, its task checklist
  // should remain complete.
  if (!completed) {
    const { data: missionProgress, error: progressError } = await supabase
      .from("mission_progress")
      .select("mission_id")
      .eq("user_id", user.id)
      .eq("mission_id", missionId)
      .maybeSingle();

    if (progressError) {
      console.error(
        "Unable to verify mission progress:",
        progressError.message,
      );

      return {
        success: false,
        error: "Unable to verify mission completion.",
      };
    }

    if (missionProgress) {
      return {
        success: false,
        error:
          "This mission is already completed. Its tasks cannot be unchecked.",
      };
    }
  }

  // CASE 1: Learner checks a task.
  if (completed) {
    const { error: insertError } = await supabase.from("task_progress").insert({
      user_id: user.id,
      task_id: taskId,
    });

    // A duplicate means the task was already saved.
    // Treat this as success for repeated requests.
    if (insertError && insertError.code !== "23505") {
      console.error("Unable to save task progress:", insertError.message);

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

  // CASE 2: Learner unchecks an unfinished task.
  const { error: deleteError } = await supabase
    .from("task_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("task_id", taskId);

  if (deleteError) {
    console.error("Unable to remove task progress:", deleteError.message);

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
