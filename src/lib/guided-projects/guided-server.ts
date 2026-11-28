import { createClient } from "@/lib/supabase/server";

// Each task has a permanent database ID.
// We will use it to save learner progress later.
type PortfolioTask = {
  id: number;
  number: number;
  instruction: string;
};

// Level information retrieved from Supabase.
type PortfolioLevel = {
  id: number;
  number: number;
  name: string;
  description: string;
  goal: string;
  given: string[];
};

// Keep the same field names used by our existing
// MissionWorkspace component.
type PortfolioMission = {
  id: number;
  levelId: number;
  number: number;
  level: number;
  levelTitle: string;
  title: string;
  why: string;
  workIn: string;
  instructions: string;
  tasks: string[];
  taskItems: PortfolioTask[];
  completedWhen: string;
  hint1: string;
  hint2: string;
  solutionLanguage: string;
  solution: string;
  check: string;
  image: string | null;
};

function retrievalError(section: string, message?: string): never {
  // Technical details stay on the server.
  console.error(
    `Guided project retrieval failed (${section}):`,
    message ?? "Missing required data",
  );

  throw new Error("Unable to load the guided learning path.");
}

export async function getGuidedLearningPath(projectSlug: "quiz-application" | "ecommerce-frontend") {
  const supabase = await createClient();

  // 1. Find the correct technology.
  const { data: technology, error: technologyError } = await supabase
    .from("technologies")
    .select("id")
    .eq("slug", "html-css-js")
    .single();

  if (technologyError || !technology) {
    retrievalError("technology", technologyError?.message);
  }

  // 2. Find our Personal Portfolio project.
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("technology_id", technology.id)
    .eq("slug", projectSlug)
    .single();

  if (projectError || !project) {
    retrievalError("project", projectError?.message);
  }

  // 3. Retrieve every level in order.
  const { data: levelRows, error: levelsError } = await supabase
    .from("levels")
    .select("id, level_number, title, description, objective, given_items")
    .eq("project_id", project.id)
    .order("level_number", { ascending: true });

  if (levelsError || !levelRows?.length) {
    retrievalError("levels", levelsError?.message);
  }

  const levelIds = levelRows.map((level) => level.id);

  // 4. Retrieve all missions belonging to these levels.
  const { data: missionRows, error: missionsError } = await supabase
    .from("missions")
    .select(
      "id, level_id, mission_number, title, summary, instructions, purpose, file_to_edit, expected_result, expected_image_path, hint_1, hint_2, final_answer, solution_language, success_criteria, verification_check",
    )
    .in("level_id", levelIds)
    .order("mission_number", { ascending: true });

  if (missionsError || !missionRows?.length) {
    retrievalError("missions", missionsError?.message);
  }

  const missionIds = missionRows.map((mission) => mission.id);

  // 5. Retrieve the tasks for every mission.
  const { data: taskRows, error: tasksError } = await supabase
    .from("mission_tasks")
    .select("id, mission_id, task_number, instruction")
    .in("mission_id", missionIds)
    .order("task_number", { ascending: true });

  if (tasksError || !taskRows?.length) {
    retrievalError("tasks", tasksError?.message);
  }

  // 6. Organize level data for the existing UI.
  const levels: Record<number, PortfolioLevel> = {};

  for (const level of levelRows) {
    levels[level.level_number] = {
      id: level.id,
      number: level.level_number,
      name: level.title,
      description: level.description ?? "",
      goal: level.objective ?? "",
      given: Array.isArray(level.given_items) ? level.given_items : [],
    };
  }

  // Match each database level ID to its information.
  const levelById = new Map(
    levelRows.map((level) => [level.id, level] as const),
  );

  // 7. Group tasks by mission ID.
  const tasksByMission = new Map<number, PortfolioTask[]>();

  for (const task of taskRows) {
    const existing = tasksByMission.get(task.mission_id) ?? [];

    existing.push({
      id: task.id,
      number: task.task_number,
      instruction: task.instruction,
    });

    tasksByMission.set(task.mission_id, existing);
  }

  // 8. Transform database records into the format
  // our existing MissionWorkspace already understands.
  const missions: PortfolioMission[] = missionRows.map((mission) => {
    const level = levelById.get(mission.level_id);

    if (!level) {
      retrievalError("mission level relationship");
    }

    const taskItems = tasksByMission.get(mission.id) ?? [];

    if (taskItems.length === 0) {
      retrievalError("mission tasks", `Mission ${mission.id} has no tasks`);
    }

    return {
      id: mission.id,
      levelId: level.id,
      number: mission.mission_number,
      level: level.level_number,
      levelTitle: level.title,
      title: mission.title,
      why: mission.purpose ?? mission.summary,
      workIn: mission.file_to_edit ?? "",
      instructions: mission.instructions,
      tasks: taskItems.map((task) => task.instruction),
      taskItems,
      completedWhen: mission.success_criteria ?? mission.expected_result ?? "",
      hint1: mission.hint_1 ?? "",
      hint2: mission.hint_2 ?? "",
      solutionLanguage: mission.solution_language ?? "text",
      solution: mission.final_answer ?? "",
      check: mission.verification_check ?? "",
      image: mission.expected_image_path,
    };
  });

  // Sort by level and mission number.
  missions.sort((a, b) => a.level - b.level || a.number - b.number);

  return {
    projectId: project.id,
    levels,
    missions,
  };
}
