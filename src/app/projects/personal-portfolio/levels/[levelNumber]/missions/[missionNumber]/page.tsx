import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import MissionWorkspace from "@/components/guided-projects/MissionWorkspace";
import MissionImagePreview from "../../MissionImagePreview";
import { getPortfolioLearningPath } from "../../../../portfolio-server";

type MissionPageProps = {
  params: Promise<{
    levelNumber: string;
    missionNumber: string;
  }>;
};

const projectRoute = "/projects/personal-portfolio";

/**
 * Build the route of a mission using its
 * actual level and mission numbers.
 */
function missionHref(level: number, mission: number) {
  return `${projectRoute}/levels/${level}/missions/${mission}`;
}

export default async function PortfolioMissionPage({
  params,
}: MissionPageProps) {
  const { levelNumber, missionNumber } = await params;

  const levelNumberValue = Number(levelNumber);
  const missionNumberValue = Number(missionNumber);

  // 1. Reject invalid URL parameters.
  if (
    !Number.isInteger(levelNumberValue) ||
    !Number.isInteger(missionNumberValue) ||
    levelNumberValue < 1 ||
    missionNumberValue < 1 ||
    levelNumber !== String(levelNumberValue) ||
    missionNumber !== String(missionNumberValue)
  ) {
    notFound();
  }

  // 2. Check that the learner is authenticated.
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    const destination = missionHref(levelNumberValue, missionNumberValue);

    redirect(`/login?next=${encodeURIComponent(destination)}`);
  }

  const userId = data.claims.sub;

  // 3. Load the complete learning path from Supabase.
  const { levels, missions } = await getPortfolioLearningPath();

  // Find the requested mission.
  const missionIndex = missions.findIndex(
    (item) =>
      item.level === levelNumberValue && item.number === missionNumberValue,
  );

  if (missionIndex === -1) {
    notFound();
  }

  const mission = missions[missionIndex];
  const level = levels[levelNumberValue];

  if (!level) {
    notFound();
  }

  // 4. Retrieve the learner's officially
  // completed missions from the database.
  const missionIds = missions.map((item) => item.id);

  const { data: missionProgress, error: missionProgressError } = await supabase
    .from("mission_progress")
    .select("mission_id")
    .eq("user_id", userId)
    .in("mission_id", missionIds);

  if (missionProgressError) {
    console.error(
      "Unable to load mission progression:",
      missionProgressError.message,
    );

    throw new Error(
      "Unable to verify your mission progress. Please try again.",
    );
  }

  // Store completed mission IDs for fast lookups.
  const completedMissionIds = new Set(
    (missionProgress ?? []).map((record) => record.mission_id),
  );

  // 5. Enforce the required mission sequence.
  //
  // A learner may access the requested mission
  // only after completing every preceding mission.
  //
  // We redirect to the FIRST unfinished prerequisite
  // instead of displaying an inaccessible page.
  const precedingMissions = missions.slice(0, missionIndex);

  const firstUnfinishedPrerequisite = precedingMissions.find(
    (item) => !completedMissionIds.has(item.id),
  );

  if (firstUnfinishedPrerequisite) {
    redirect(
      missionHref(
        firstUnfinishedPrerequisite.level,
        firstUnfinishedPrerequisite.number,
      ),
    );
  }

  // 6. Load the learner's saved task checkboxes.
  const taskIds = mission.taskItems.map((task) => task.id);

  const { data: savedTasks, error: savedTasksError } = await supabase
    .from("task_progress")
    .select("task_id")
    .eq("user_id", userId)
    .in("task_id", taskIds);

  if (savedTasksError) {
    console.error(
      "Unable to load saved task progress:",
      savedTasksError.message,
    );

    throw new Error("Unable to load your task progress. Please try again.");
  }

  const initialCompletedTaskIds = (savedTasks ?? []).map(
    (record) => record.task_id,
  );

  // 7. Determine official mission completion
  // using saved mission_progress records.
  const initialMissionCompleted = completedMissionIds.has(mission.id);

  // 8. Preserve existing mission navigation.
  const previousMission = missions[missionIndex - 1];
  const nextMission = missions[missionIndex + 1];

  const roadmapHref = `${projectRoute}/levels/${levelNumberValue}`;

  // 9. Render the EXISTING Mission Workspace.
  return (
    <MissionWorkspace
      key={`${mission.level}-${mission.number}`}
      projectName="Personal Portfolio"
      totalMissions={missions.length}
      mission={mission}
      levelGoal={level.goal}
      levelGiven={level.given}
      roadmapHref={roadmapHref}
      initialCompletedTaskIds={initialCompletedTaskIds}
      initialMissionCompleted={initialMissionCompleted}
      previousMission={
        previousMission
          ? {
              label: `Mission ${previousMission.number}`,
              href: missionHref(previousMission.level, previousMission.number),
            }
          : undefined
      }
      nextMission={
        nextMission
          ? {
              label: `Mission ${nextMission.number}`,
              href: missionHref(nextMission.level, nextMission.number),
              level: nextMission.level,
            }
          : undefined
      }
      imagePreview={
        mission.image ? (
          <MissionImagePreview
            src={mission.image}
            alt={`Expected visual result for Mission ${mission.number}: ${mission.title}`}
            missionNumber={mission.number}
            missionTitle={mission.title}
          />
        ) : undefined
      }
    />
  );
}
