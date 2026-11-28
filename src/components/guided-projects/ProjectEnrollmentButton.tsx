import { startProject } from "@/app/projects/enrollment-actions";
import type { EnrollableProjectSlug } from "@/lib/guided-projects/enrollment";

type Props = {
  slug: EnrollableProjectSlug;
  id?: string;
};

/** Shared Start Project button: the server action determines the user ID. */
export default function ProjectEnrollmentButton({ slug, id }: Props) {
  return (
    <form id={id} action={startProject} className="scroll-mt-28">
      <input type="hidden" name="projectSlug" value={slug} />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
      >
        Start Project →
      </button>
    </form>
  );
}
