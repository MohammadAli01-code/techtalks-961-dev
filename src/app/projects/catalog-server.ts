import { createClient } from "@/lib/supabase/server";

// Database difficulty values match the SQL schema.
export type DatabaseDifficulty = "easy" | "medium" | "hard";

// Technology record returned by Supabase.
export type DatabaseTechnology = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

// Project record returned by Supabase.
export type DatabaseProject = {
  id: number;
  technology_id: number;
  title: string;
  slug: string;
  description: string | null;
  difficulty: DatabaseDifficulty;
};

// Retrieve the catalog from the database.
// This function runs on the Next.js server.
export async function getCatalogData() {
  const supabase = await createClient();

  // Retrieve technologies and projects from Supabase.
  // Existing RLS policies control which records are visible.
  const [technologiesResult, projectsResult] = await Promise.all([
    supabase
      .from("technologies")
      .select("id, name, slug, description")
      .order("id", { ascending: true }),

    supabase
      .from("projects")
      .select("id, technology_id, title, slug, description, difficulty")
      .order("id", { ascending: true }),
  ]);

  // Never silently substitute hardcoded data when the database fails.
  if (technologiesResult.error || projectsResult.error) {
    console.error("Unable to retrieve project catalog", {
      technologiesError: technologiesResult.error?.message,
      projectsError: projectsResult.error?.message,
    });

    throw new Error("Unable to load the project catalog.");
  }

  return {
    technologies: (technologiesResult.data ?? []) as DatabaseTechnology[],
    projects: (projectsResult.data ?? []) as DatabaseProject[],
  };
}
