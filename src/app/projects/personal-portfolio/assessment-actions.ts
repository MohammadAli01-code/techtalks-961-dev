"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AssessmentSubmissionResult =
  | {
      success: true;
      correctAnswers: number;
      totalQuestions: number;
      alreadyCompleted: boolean;
    }
  | { success: false; error: string };

/**
 * Submit selected answer-option IDs to PostgreSQL for secure grading.
 * The database function validates the answers and mission prerequisites,
 * then saves the first official result for the authenticated learner.
 */
export async function submitPortfolioAssessment(
  selectedOptionIds: number[],
): Promise<AssessmentSubmissionResult> {
  if (
    !Array.isArray(selectedOptionIds) ||
    selectedOptionIds.length !== 3 ||
    selectedOptionIds.some((id) => !Number.isSafeInteger(id) || id <= 0) ||
    new Set(selectedOptionIds).size !== 3
  ) {
    return {
      success: false,
      error: "Please select one answer for each of the three questions.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authenticationError,
  } = await supabase.auth.getUser();

  if (authenticationError || !user) {
    return {
      success: false,
      error: "Please sign in to submit your assessment.",
    };
  }

  // Important: do NOT read 'is_correct' in application code.
  // Only the restricted database function can grade submitted options.
  const { data, error } = await supabase.rpc("submit_portfolio_assessment", {
    p_option_ids: selectedOptionIds,
  });

  if (error) {
    console.error("Assessment submission failed:", error.message);
    return {
      success: false,
      error:
        "We couldn't submit your assessment. Complete all Portfolio missions and try again.",
    };
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (
    !result ||
    !Number.isInteger(result.correct_answers) ||
    !Number.isInteger(result.total_questions) ||
    result.total_questions !== 3 ||
    result.correct_answers < 0 ||
    result.correct_answers > result.total_questions
  ) {
    console.error("Assessment submission returned an invalid result.");
    return {
      success: false,
      error: "The assessment result could not be verified. Please refresh.",
    };
  }

  revalidatePath("/projects/personal-portfolio/assessment");
  revalidatePath("/projects/personal-portfolio");

  return {
    success: true,
    correctAnswers: result.correct_answers,
    totalQuestions: result.total_questions,
    alreadyCompleted: result.already_completed === true,
  };
}
