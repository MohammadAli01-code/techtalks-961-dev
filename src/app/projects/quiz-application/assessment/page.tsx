import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGuidedAssessment } from "@/lib/guided-projects/guided-assessment-server";
import MatchingAssessmentQuiz from "@/components/guided-projects/MatchingAssessmentQuiz";

const slug = "quiz-application" as const;

export default async function AssessmentPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    redirect(
      `/login?next=${encodeURIComponent(`/projects/${slug}/assessment`)}`,
    );
  }

  const result = await getGuidedAssessment(slug);

  return (
    <MatchingAssessmentQuiz
      slug={slug}
      projectName="Quiz Application"
      description="Apply what you learned while building your quiz. Answer three practical questions about HTML, CSS, JavaScript, and quiz logic."
      assessment={{
        assessmentTitle: result.assessmentTitle,
        questions: result.questions,
        isUnlocked: result.isUnlocked,
        isCompleted: result.savedScore !== null,
        completedAt: null,
        completedMissions: result.completedMissions,
        totalMissions: result.totalMissions,
      }}
      savedScore={result.savedScore}
    />
  );
}
