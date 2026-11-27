"use client";

import { useState, useSyncExternalStore } from "react";

import TechnologyCard from "@/components/TechnologyCard";
import ProjectCard from "@/components/ProjectCard";

import type {
  DatabaseTechnology,
  DatabaseProject,
} from "./catalog-server";

import {
  difficultyOptions,
  type Difficulty,
  type DifficultyFilter,
} from "./catalog-data";

// Database records passed from the server page.
type ProjectCatalogProps = {
  databaseTechnologies: DatabaseTechnology[];
  databaseProjects: DatabaseProject[];
};

// Listen for changes to the technology URL anchor.
function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);

  return () => {
    window.removeEventListener("hashchange", callback);
  };
}

// Default technology during server rendering.
function getServerTechnology() {
  return "all";
}

// Convert database difficulty values into UI labels.
function formatDifficulty(
  difficulty: DatabaseProject["difficulty"],
): Difficulty {
  const labels: Record<
    DatabaseProject["difficulty"],
    Difficulty
  > = {
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
  };

  return labels[difficulty];
}

// Only projects with implemented pages have active links.
const implementedProjects = [
  "personal-portfolio",
  "quiz-application", "ecommerce-frontend",
];

export default function ProjectCatalog({
  databaseTechnologies,
  databaseProjects,
}: ProjectCatalogProps) {
  // Build technology cards using Supabase records.
  const technologies = databaseTechnologies.map(
    (technology) => ({
      ...technology,
      title: technology.name,
      description: technology.description ?? "",
      comingSoon: technology.slug === "php",
    }),
  );

  // Convert database projects into ProjectCard data.
  const catalogProjects = databaseProjects.flatMap(
    (project) => {
      const technology = technologies.find(
        (item) => item.id === project.technology_id,
      );

      if (!technology || technology.comingSoon) {
        return [];
      }

      return [
        {
          id: project.id,
          title: project.title,
          description: project.description ?? "",
          difficulty: formatDifficulty(
            project.difficulty,
          ),
          technology: technology.slug,
          technologyTitle: technology.title,

          // Connect implemented guided project pages.
          href:
            technology.slug === "html-css-js" &&
            implementedProjects.includes(project.slug)
              ? `/projects/${project.slug}`
              : undefined,
        },
      ];
    },
  );

  // Read technology selection from the URL hash.
  function getTechnologyFromHash() {
    const slug = window.location.hash.slice(1);

    const technology = technologies.find(
      (item) => item.slug === slug,
    );

    return technology?.slug ?? "all";
  }

  // Preserve technology selection after refresh.
  const selectedTechnology = useSyncExternalStore(
    subscribeToHash,
    getTechnologyFromHash,
    getServerTechnology,
  );

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("all");

  // Filter projects by technology and difficulty.
  const filteredProjects = catalogProjects.filter(
    (project) => {
      const matchesTechnology =
        selectedTechnology === "all" ||
        project.technology === selectedTechnology;

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        project.difficulty === selectedDifficulty;

      return matchesTechnology && matchesDifficulty;
    },
  );

  const currentTechnology = technologies.find(
    (technology) =>
      technology.slug === selectedTechnology,
  );

  const hasActiveFilters =
    selectedTechnology !== "all" ||
    selectedDifficulty !== "all";

  // Update technology selection without reloading.
  function selectTechnology(technology: string) {
    const url =
      window.location.pathname +
      window.location.search +
      (technology === "all" ? "" : `#${technology}`);

    window.history.replaceState(
      window.history.state,
      "",
      url,
    );

    window.dispatchEvent(new Event("hashchange"));
  }

  // Reset technology and difficulty filters.
  function resetFilters() {
    selectTechnology("all");
    setSelectedDifficulty("all");
  }

  // Calculate difficulty counts from database records.
  function getDifficultyCount(
    difficulty: DifficultyFilter,
  ) {
    return catalogProjects.filter(
      (project) =>
        (selectedTechnology === "all" ||
          project.technology === selectedTechnology) &&
        (difficulty === "all" ||
          project.difficulty === difficulty),
    ).length;
  }

  return (
    <>
      {/* SECTION 01: TECHNOLOGY SELECTION */}

      <section
        aria-labelledby="technologies-heading"
        className="mt-16"
      >
        <div className="mb-7">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            {"// 01. Select technology"}
          </span>

          <h2
            id="technologies-heading"
            className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
          >
            Choose Your Technology
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Choose a technology to discover projects that
            match your learning goals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TechnologyCard
            title="All Technologies"
            description="Explore every coding challenge in our project catalog."
            slug="all"
            projectCount={catalogProjects.length}
            selected={selectedTechnology === "all"}
            onSelect={() => selectTechnology("all")}
          />

          {/* Technologies retrieved from Supabase */}
          {technologies.map((technology) => (
            <TechnologyCard
              key={technology.id}
              title={technology.title}
              description={technology.description}
              slug={technology.slug}
              comingSoon={technology.comingSoon}
              projectCount={
                catalogProjects.filter(
                  (project) =>
                    project.technology === technology.slug,
                ).length
              }
              selected={
                selectedTechnology === technology.slug
              }
              onSelect={() =>
                selectTechnology(technology.slug)
              }
            />
          ))}
        </div>
      </section>

      {/* SECTION 02: DIFFICULTY FILTERING */}

      <section
        aria-labelledby="difficulty-heading"
        className="mt-12"
      >
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
          {"// 02. Set difficulty"}
        </span>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-700/60 dark:bg-[#151d34] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2
                id="difficulty-heading"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Filter by Difficulty
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Find the right challenge for your skill level.
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-cyan-300 dark:hover:bg-cyan-400/10"
            >
              Reset Filters
            </button>
          </div>

          <div
            role="group"
            aria-label="Project difficulty"
            className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {difficultyOptions.map((option) => {
              const isSelected =
                selectedDifficulty === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    setSelectedDifficulty(option.value)
                  }
                  className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
                    isSelected
                      ? "border-blue-500 bg-blue-600 text-white dark:border-cyan-400 dark:bg-cyan-400 dark:text-slate-950"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-400 dark:border-slate-700 dark:bg-[#10182c] dark:text-slate-300 dark:hover:border-cyan-400"
                  }`}
                >
                  <span>{option.label}</span>

                  <span
                    className={`rounded-md px-2 py-1 text-xs ${
                      isSelected
                        ? "bg-black/10"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    {getDifficultyCount(option.value)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 03: PROJECT RESULTS */}

      <section
        id="catalog-results"
        aria-labelledby="results-heading"
        className="mt-12 scroll-mt-28"
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-700/60">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
              {"// 03. Start building"}
            </span>

            <h2
              id="results-heading"
              className="mt-3 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl"
            >
              {currentTechnology
                ? `${currentTechnology.title} Projects`
                : "Explore All Projects"}
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {selectedDifficulty === "all"
                ? "Discover projects across all difficulty levels."
                : `Showing ${selectedDifficulty.toLowerCase()} difficulty projects.`}
            </p>
          </div>

          {/* Dynamic project counter */}
          <span
            role="status"
            aria-live="polite"
            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
          >
            Showing {filteredProjects.length} of{" "}
            {catalogProjects.length} projects
          </span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex min-w-0 flex-col"
              >
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-blue-500 dark:bg-cyan-400"
                  />

                  <span className="font-mono text-xs font-semibold text-blue-700 dark:text-cyan-300">
                    {project.technologyTitle}
                  </span>
                </div>

                {/* Reuse the existing ProjectCard */}
                <div className="flex flex-1 flex-col">
                  <ProjectCard
                    title={project.title}
                    description={project.description}
                    difficulty={project.difficulty}
                    href={project.href}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-[#10182c]/70">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 font-mono text-2xl font-bold text-blue-600 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              {currentTechnology?.comingSoon
                ? "</>"
                : "{ }"}
            </div>

            {currentTechnology?.comingSoon ? (
              <>
                <span className="mt-6 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  Coming Soon
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  PHP Projects Are on the Way
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-400">
                  We&apos;re preparing guided PHP projects to
                  help you develop your backend programming
                  skills.
                </p>
              </>
            ) : (
              <>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  No Matching Projects
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-400">
                  No projects match your current filters.
                  Try another technology or difficulty level.
                </p>
              </>
            )}

            <button
              type="button"
              onClick={resetFilters}
              className="mt-7 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Explore All Projects
            </button>
          </div>
        )}
      </section>
    </>
  );
}
