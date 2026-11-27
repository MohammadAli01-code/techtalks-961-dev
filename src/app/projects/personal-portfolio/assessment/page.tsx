import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioAssessment } from "../assessment-server";
import AssessmentQuiz from "./AssessmentQuiz";

export default async function PersonalPortfolioAssessmentPage() {
  const supabase = await createClient();

  // Only authenticated learners can open the assessment.
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect("/login?next=%2Fprojects%2Fpersonal-portfolio%2Fassessment");
  }

  // Load the assessment without exposing correct answers.
  const assessment = await getPortfolioAssessment();

  // Restore an existing score when the learner returns.
  let savedScore: {
    correctAnswers: number;
    totalQuestions: number;
  } | null = null;

  if (assessment.isCompleted) {
    const { data: result, error: resultError } = await supabase
      .from("assessment_progress")
      .select("correct_answers, total_questions")
      .eq("user_id", data.claims.sub)
      .eq("assessment_id", assessment.assessmentId)
      .maybeSingle();

    if (resultError) {
      console.error("Unable to load assessment result:", resultError.message);

      throw new Error(
        "Unable to load your assessment result. Please try again.",
      );
    }

    if (result?.correct_answers != null && result?.total_questions != null) {
      savedScore = {
        correctAnswers: result.correct_answers,
        totalQuestions: result.total_questions,
      };
    }
  }

  return <AssessmentQuiz assessment={assessment} savedScore={savedScore} />;
}
