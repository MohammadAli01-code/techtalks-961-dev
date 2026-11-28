import type { ReactNode } from "react";
import { requireProjectEnrollment } from "@/lib/guided-projects/enrollment";

export default async function AssessmentLayout({ children }: { children: ReactNode }) {
  await requireProjectEnrollment("personal-portfolio");
  return children;
}
