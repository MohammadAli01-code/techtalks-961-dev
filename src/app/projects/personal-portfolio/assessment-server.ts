import { createClient } from "@/lib/supabase/server";
import { getPortfolioLearningPath } from "./portfolio-server";

// A single answer option.
// Notice: We never send is_correct to the browser.
export type AssessmentOption = {
  id: number;
  number: number;
  text: string;
};

// A question with its available answer options.
export type AssessmentQuestion = {
  id: number;
  number: number;
  text: string;
  options: AssessmentOption[];
};

/**
 * Loads the Personal Portfolio final assessment.
 *
 * Responsibilities:
 * 1. Verify authentication.
 * 2. Retrieve questions and answer options.
 * 3. Check whether all missions are completed.
 * 4. Check existing assessment completion.
 *
 * Correct answers are never included in the result.
 */
export async function getPortfolioAssessment() {
  const supabase = await createClient();

  // 1. Verify the authenticated learner.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Please sign in to access the assessment.");
  }

  // 2. Retrieve our existing project and missions.
  const { projectId, missions } = await getPortfolioLearningPath();

  // 3. Find the assessment for Personal Portfolio.
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("id, title")
    .eq("project_id", projectId)
    .single();

  if (assessmentError || !assessment) {
    console.error("Assessment loading failed:", assessmentError?.message);

    throw new Error("Unable to load the final assessment.");
  }

  // 4. Retrieve the assessment's questions.
  const { data: questionRows, error: questionsError } = await supabase
    .from("assessment_questions")
    .select("id, question_number, question_text")
    .eq("assessment_id", assessment.id)
    .order("question_number", { ascending: true });

  if (questionsError || questionRows?.length !== 3) {
    console.error("Assessment questions are missing:", questionsError?.message);

    throw new Error("The final assessment is not configured correctly.");
  }

  const questionIds = questionRows.map((question) => question.id);

  // 5. Retrieve only the public option fields.
  // is_correct is intentionally excluded.
  const { data: optionRows, error: optionsError } = await supabase
    .from("assessment_options")
    .select("id, question_id, option_number, option_text")
    .in("question_id", questionIds)
    .order("option_number", { ascending: true });

  if (optionsError || optionRows?.length !== 12) {
    console.error("Assessment options are missing:", optionsError?.message);

    throw new Error("Unable to load the assessment options.");
  }

  // 6. Organize options underneath their questions.
  const questions: AssessmentQuestion[] = questionRows.map((question) => ({
    id: question.id,
    number: question.question_number,
    text: question.question_text,

    options: optionRows
      .filter((option) => option.question_id === question.id)
      .map((option) => ({
        id: option.id,
        number: option.option_number,
        text: option.option_text,
      })),
  }));

  // Make sure every question has four options.
  if (questions.some((question) => question.options.length !== 4)) {
    throw new Error("Some assessment questions are missing options.");
  }

  // 7. Retrieve the learner's official mission progress.
  const missionIds = missions.map((mission) => mission.id);

  const { data: completedMissionRows, error: progressError } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("user_id", user.id)
    .in("mission_id", missionIds);

  if (progressError) {
    console.error("Unable to verify mission progress:", progressError.message);

    throw new Error("Unable to verify your learning progress.");
  }

  const completedMissionIds = new Set(
    (completedMissionRows ?? []).map((record) => record.mission_id),
  );

  // The assessment becomes available only after
  // all Portfolio missions are officially completed.
  const isUnlocked = missions.every((mission) =>
    completedMissionIds.has(mission.id),
  );

  // 8. Check whether the assessment was already completed.
  const { data: completion, error: completionError } = await supabase
    .from("assessment_progress")
    .select("assessment_id, completed_at")
    .eq("user_id", user.id)
    .eq("assessment_id", assessment.id)
    .maybeSingle();

  if (completionError) {
    console.error(
      "Unable to load assessment completion:",
      completionError.message,
    );

    throw new Error("Unable to verify assessment completion.");
  }

  return {
    assessmentId: assessment.id,
    assessmentTitle: assessment.title,
    questions,

    isUnlocked,
    isCompleted: Boolean(completion),
    completedAt: completion?.completed_at ?? null,

    completedMissions: completedMissionIds.size,
    totalMissions: missions.length,
  };
}
