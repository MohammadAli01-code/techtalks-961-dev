"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
type Slug="quiz-application"|"ecommerce-frontend";
type Result={success:true;correctAnswers:number;totalQuestions:number;alreadyCompleted:boolean}
  | {success:false;error:string};

export async function submitGuidedAssessment(slug:Slug, optionIds:number[]):Promise<Result> {
  if(!["quiz-application","ecommerce-frontend"].includes(slug)
    || !Array.isArray(optionIds) || optionIds.length!==3 || new Set(optionIds).size!==3
    || optionIds.some((id)=>!Number.isSafeInteger(id)||id<=0)) {
      return {success:false,error:"Select one valid answer for each question."};
  }
  const supabase=await createClient();
  const {data:{user},error:authError}=await supabase.auth.getUser();
  if(authError || !user) return {success:false,error:"Sign in before submitting."};
  const {data,error}=await supabase.rpc("submit_guided_assessment",{
    p_project_slug:slug,p_option_ids:optionIds
  });
  if(error) {
    console.error("Assessment grading failed:",error.message);
    return {success:false,error:"Could not submit. Complete every mission and retry."};
  }
  const r=Array.isArray(data)?data[0]:data;
  if(!r || !Number.isInteger(r.correct_answers) || r.total_questions!==3) {
    return {success:false,error:"Unexpected score response."};
  }
  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/projects/${slug}/assessment`);
  return {success:true,correctAnswers:r.correct_answers,totalQuestions:r.total_questions,alreadyCompleted:Boolean(r.already_completed)};
}
