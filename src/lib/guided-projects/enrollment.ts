import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Only the three currently implemented guided projects support enrollment.
export type EnrollableProjectSlug =
  | "personal-portfolio"
  | "quiz-application"
  | "ecommerce-frontend";

/** Check enrollment for a known, authenticated learner and database project ID. */
export async function isProjectEnrolled(userId: string, projectId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_enrollments")
    .select("project_id")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) {
    console.error("Enrollment check failed:", error.message);
    throw new Error("Unable to check project enrollment. Please try again.");
  }

  return Boolean(data);
}

/**
 * Secure server-side guard for all level and mission pages.
 * Never rely on a disabled link in the UI for authorization.
 */
export async function requireProjectEnrollment(slug: EnrollableProjectSlug) {
  const supabase = await createClient();
  const overviewPath = `/projects/${slug}`;
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect(`/login?next=${encodeURIComponent(overviewPath)}`);
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("slug", slug)
    .single();

  if (projectError || !project) {
    console.error("Enrollment project lookup failed:", projectError?.message);
    throw new Error("Unable to locate this guided project.");
  }

  const isEnrolled = await isProjectEnrolled(data.claims.sub, project.id);

  if (!isEnrolled) {
    // Return to the visible enrollment CTA, rather than displaying a broken page.
    redirect(`${overviewPath}#enrollment`);
  }
}
