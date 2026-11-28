import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGuidedAssessment } from "@/lib/guided-projects/guided-assessment-server";
import MatchingAssessmentQuiz from "@/components/guided-projects/MatchingAssessmentQuiz";

const slug = "ecommerce-frontend" as const;

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
      projectName="E-commerce Frontend"
      description="Apply what you learned while building your store. Answer three practical questions about filtering, cart calculations, and Local Storage."
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
