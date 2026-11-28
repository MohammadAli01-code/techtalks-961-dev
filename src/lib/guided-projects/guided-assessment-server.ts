import { createClient } from "@/lib/supabase/server";
import { getGuidedLearningPath } from "./guided-server";
type Slug = "quiz-application" | "ecommerce-frontend";

export async function getGuidedAssessment(slug: Slug) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Sign in required.");
  const { projectId, missions } = await getGuidedLearningPath(slug);
  const { data: assessment, error: assessmentError } = await supabase.from("assessments")
    .select("id,title").eq("project_id", projectId).single();
  if (assessmentError || !assessment) throw new Error("Assessment unavailable.");
  const { data: questions, error: questionError } = await supabase.from("assessment_questions")
    .select("id,question_number,question_text").eq("assessment_id",assessment.id).order("question_number");
  if (questionError || questions?.length !== 3) throw new Error("Assessment questions unavailable.");
  const { data: options, error: optionError } = await supabase.from("assessment_options")
    .select("id,question_id,option_number,option_text")
    .in("question_id",questions.map((q)=>q.id)).order("option_number");
  if (optionError || options?.length !== 12) throw new Error("Assessment options unavailable.");
  const parsed = questions.map((q)=>({
    id:q.id, number:q.question_number, text:q.question_text,
    options:options.filter((o)=>o.question_id===q.id).map((o)=>({id:o.id,number:o.option_number,text:o.option_text}))
  }));
  if(parsed.some((q)=>q.options.length!==4)) throw new Error("Incomplete assessment options.");
  const {data:progress,error:progressError}=await supabase.from("mission_progress")
    .select("mission_id").eq("user_id",user.id).in("mission_id",missions.map((m)=>m.id));
  if(progressError) throw new Error("Cannot read mission progress.");
  const finished=new Set((progress??[]).map((p)=>p.mission_id));
  const isUnlocked=missions.length>0 && missions.every((m)=>finished.has(m.id));
  const {data:result,error:resultError}=await supabase.from("assessment_progress")
    .select("correct_answers,total_questions,completed_at")
    .eq("user_id",user.id).eq("assessment_id",assessment.id).maybeSingle();
  if(resultError) throw new Error("Cannot load assessment result.");
  return {
    assessmentTitle:assessment.title, questions:parsed,
    isUnlocked, completedMissions:finished.size, totalMissions:missions.length,
    savedScore:result?.correct_answers!=null && result.total_questions!=null
      ? {correctAnswers:result.correct_answers,totalQuestions:result.total_questions} : null,
  };
}
