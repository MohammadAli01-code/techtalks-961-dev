"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Enrollment is currently available for our three completed projects.
const availableProjects = [
  "personal-portfolio",
  "quiz-application",
  "ecommerce-frontend",
] as const;

type ProjectSlug = (typeof availableProjects)[number];

/**
 * Enrolls the authenticated learner in a project.
 * Duplicate enrollments are prevented by the database primary key.
 */
export async function startProject(formData: FormData) {
  const slug = formData.get("projectSlug");

  if (
    typeof slug !== "string" ||
    !availableProjects.includes(slug as ProjectSlug)
  ) {
    throw new Error("Invalid project.");
  }

  const projectRoute = `/projects/${slug}`;
  const supabase = await createClient();

  // Never accept the user ID from the browser.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect(`/login?next=${encodeURIComponent(projectRoute)}`);
  }

  // Find the real project ID in Supabase.
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single();

  if (projectError || !project) {
    throw new Error("Unable to find this project.");
  }

  // Check whether the learner is already enrolled.
  const { data: existing, error: lookupError } = await supabase
    .from("project_enrollments")
    .select("project_id")
    .eq("user_id", user.id)
    .eq("project_id", project.id)
    .maybeSingle();

  if (lookupError) {
    throw new Error("Unable to check your enrollment.");
  }

  // Returning learners keep their previous progress.
  if (existing) {
    redirect(`${projectRoute}#levels`);
  }

  // Create enrollment. A duplicate key is harmless if
  // the learner clicked Start Project more than once.
  const { error: insertError } = await supabase
    .from("project_enrollments")
    .insert({
      user_id: user.id,
      project_id: project.id,
    });

  if (insertError && insertError.code !== "23505") {
    console.error("Enrollment failed:", insertError.message);
    throw new Error("Unable to start this project. Please try again.");
  }

  revalidatePath(projectRoute);

  // Start at the first mission after enrollment.
  redirect(`${projectRoute}/levels/1/missions/1`);
}
