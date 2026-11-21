
import Link from "next/link";

export default function PersonalPortfolioPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/projects"
          className="text-sm text-cyan-400 hover:underline"
        >
          ← Back to Projects
        </Link>

        <div className="mt-10">
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400">
            Easy
          </span>

          <h1 className="mt-6 text-4xl font-bold">
            Personal Portfolio Website
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Build your own responsive personal portfolio
            website using HTML, CSS, and JavaScript.
            Learn how to organize a web page, style
            components, and add basic interactivity.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            Technologies
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {["HTML", "CSS", "JavaScript"].map((tech) => (
              <span
                key={tech}
                className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">
            What You Will Learn
          </h2>

          <ul className="mt-5 list-disc space-y-3 pl-6 text-slate-300">
            <li>Structure web pages using semantic HTML.</li>
            <li>Style layouts with CSS and Flexbox.</li>
            <li>Create responsive designs.</li>
            <li>Add basic JavaScript interactions.</li>
          </ul>
        </section>

        <section className="mt-12 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold">
            Your Project Journey
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            You will build this portfolio step by step
            through guided missions. Each mission will
            help you complete a part of the final website.
          </p>

          <p className="mt-5 text-sm text-cyan-400">
            Guided missions will be available soon.
          </p>
        </section>
      </div>
    </main>
  );
}
