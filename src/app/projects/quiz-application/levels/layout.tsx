import type { ReactNode } from "react";
import { requireProjectEnrollment } from "@/lib/guided-projects/enrollment";

// Applied to both the level roadmap and all its nested mission URLs.
export default async function LevelsLayout({ children }: { children: ReactNode }) {
  await requireProjectEnrollment("quiz-application");
  return children;
}
