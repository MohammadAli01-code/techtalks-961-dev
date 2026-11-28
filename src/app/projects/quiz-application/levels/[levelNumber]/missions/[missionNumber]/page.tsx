import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGuidedLearningPath } from "@/lib/guided-projects/guided-server";
import MissionWorkspace from "@/components/guided-projects/MissionWorkspace";
import MissionImagePreview from "@/app/projects/personal-portfolio/levels/[levelNumber]/MissionImagePreview";

type Props = { params: Promise<{levelNumber:string;missionNumber:string}> };
const slug = "quiz-application" as const;
const base = `/projects/${slug}`;
const href = (level:number,mission:number) => `${base}/levels/${level}/missions/${mission}`;

export default async function GuidedMissionPage({params}:Props) {
  const {levelNumber,missionNumber}=await params;
  const level=Number(levelNumber), number=Number(missionNumber);
  if (!Number.isSafeInteger(level) || level<1 || !Number.isSafeInteger(number) || number<1
    || String(level)!==levelNumber || String(number)!==missionNumber) notFound();
  const supabase=await createClient();
  const {data,error}=await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect(`/login?next=${encodeURIComponent(href(level,number))}`);
  const {missions,levels}=await getGuidedLearningPath(slug);
  const idx=missions.findIndex((m)=>m.level===level && m.number===number);
  if (idx<0) notFound();
  const mission=missions[idx], currentLevel=levels[level];
  if (!currentLevel) notFound();
  const ids=missions.map((m)=>m.id);
  const {data:progress,error:progressError}=await supabase.from("mission_progress")
    .select("mission_id").eq("user_id",data.claims.sub).in("mission_id",ids);
  if (progressError) throw new Error("Unable to load mission progress.");
  const done=new Set((progress??[]).map((p)=>p.mission_id));
  const blocking=missions.slice(0,idx).find((m)=>!done.has(m.id));
  if (blocking) redirect(href(blocking.level,blocking.number));
  const taskIds=mission.taskItems.map((t)=>t.id);
  const {data:taskProgress,error:taskError}=await supabase.from("task_progress")
    .select("task_id").eq("user_id",data.claims.sub).in("task_id",taskIds);
  if (taskError) throw new Error("Unable to load saved tasks.");
  const previous=missions[idx-1],next=missions[idx+1];
  return <MissionWorkspace
    key={`${level}-${number}`}
    projectName="Quiz Application"
    projectSlug={slug}
    totalMissions={missions.length}
    mission={mission}
    levelGoal={currentLevel.goal}
    levelGiven={currentLevel.given}
    roadmapHref={`${base}/levels/${level}`}
    initialCompletedTaskIds={(taskProgress??[]).map((r)=>r.task_id)}
    initialMissionCompleted={done.has(mission.id)}
    previousMission={previous?{label:`Mission ${previous.number}`,href:href(previous.level,previous.number)}:undefined}
    nextMission={next?{label:`Mission ${next.number}`,href:href(next.level,next.number),level:next.level}:undefined}
    finalAssessmentHref={`${base}/assessment`}
    imagePreview={mission.image?<MissionImagePreview src={mission.image} alt={`Expected result of Mission ${mission.number}: ${mission.title}`} missionNumber={mission.number} missionTitle={mission.title}/>:undefined}
  />;
}
