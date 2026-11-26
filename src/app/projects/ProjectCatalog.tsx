
"use client";

import { useSyncExternalStore, useState } from "react";
import TechnologyCard from "@/components/TechnologyCard";
import ProjectCard from "@/components/ProjectCard";

import {
  technologies,
  catalogProjects,
  difficultyOptions,
  type TechnologyFilter,
  type DifficultyFilter,
} from "./catalog-data";

// Preserve existing technology anchor links.
function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);

  return () => {
    window.removeEventListener("hashchange", callback);
  };
}

// Read the selected technology from the URL.
function getTechnologyFromHash(): TechnologyFilter {
  const slug = window.location.hash.slice(1);

  const technology = technologies.find(
    (item) => item.slug === slug
  );

  return technology?.slug ?? "all";
}

// Default technology during server rendering.
function getServerTechnology(): TechnologyFilter {
  return "all";
}

export default function ProjectCatalog() {
  // Preserve technology selection after page refresh.
  const selectedTechnology = useSyncExternalStore(
    subscribeToHash,
    getTechnologyFromHash,
    getServerTechnology
  );

  // Manage the selected difficulty level.
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyFilter>("all");

  // Both filters must match for a project to appear.
  const filteredProjects = catalogProjects.filter(
    (project) => {
      const matchesTechnology =
        selectedTechnology === "all" ||
        project.technology === selectedTechnology;

      const matchesDifficulty =
        selectedDifficulty === "all" ||
        project.difficulty === selectedDifficulty;

      return matchesTechnology && matchesDifficulty;
    }
  );

  // Retrieve information about the selected technology.
  const currentTechnology = technologies.find(
    (technology) =>
      technology.slug === selectedTechnology
  );

  // Determine whether any filters are currently active.
  const hasActiveFilters =
    selectedTechnology !== "all" ||
    selectedDifficulty !== "all";

  // Update technology selection without reloading the page.
  function selectTechnology(
    technology: TechnologyFilter
  ) {
    const url =
      window.location.pathname +
      window.location.search +
      (technology === "all" ? "" : `#${technology}`);

    window.history.replaceState(
      window.history.state,
      "",
      url
    );

    window.dispatchEvent(new Event("hashchange"));
  }

  // Reset both filters to their default values.
  function resetFilters() {
    selectTechnology("all");
    setSelectedDifficulty("all");
  }

  // Calculate difficulty counts for the selected technology.
  function getDifficultyCount(
    difficulty: DifficultyFilter
  ) {
    return catalogProjects.filter(
      (project) =>
        (selectedTechnology === "all" ||
          project.technology === selectedTechnology) &&
        (difficulty === "all" ||
          project.difficulty === difficulty)
    ).length;
  }

  return (
    <>
      {/* =========================================
          SECTION 01: TECHNOLOGY SELECTION
      ========================================== */}

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
            Choose a technology to discover projects
            that match your learning goals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Display all available technologies. */}
          <TechnologyCard
            title="All Technologies"
            description="Explore every coding challenge in our project catalog."
            slug="all"
            projectCount={catalogProjects.length}
            selected={selectedTechnology === "all"}
            onSelect={() => selectTechnology("all")}
          />

          {/* Generate reusable technology cards. */}
          {technologies.map((technology) => (
            <TechnologyCard
              key={technology.slug}
              title={technology.title}
              description={technology.description}
              slug={technology.slug}
              comingSoon={technology.comingSoon}
              projectCount={technology.projects.length}
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

      {/* =========================================
          SECTION 02: DIFFICULTY FILTERING
      ========================================== */}

      <section
        aria-labelledby="difficulty-heading"
        className="mt-12"
      >
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
          {"// 02. Set difficulty"}
        </span>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-slate-700/60 dark:bg-[#151d34] sm:p-6">

          {/* Filter heading and reset action. */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2
                id="difficulty-heading"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Filter by Difficulty
              </h2>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Find the right challenge for your skill
                level.
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

          {/* Difficulty filter buttons with dynamic counts. */}
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

      {/* =========================================
          SECTION 03: FILTERED PROJECT RESULTS
      ========================================== */}

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

            {/* Dynamic heading based on selected technology. */}
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

          {/* Accessible dynamic results counter. */}
          <span
            role="status"
            aria-live="polite"
            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
          >
            Showing {filteredProjects.length} of{" "}
            {catalogProjects.length} projects
          </span>
        </div>

        {/* Display matching projects when results exist. */}
        {filteredProjects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="flex min-w-0 flex-col"
              >
                {/* Technology label above each project. */}
                <div className="mb-3 flex items-center gap-2 px-1">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-blue-500 dark:bg-cyan-400"
                  />

                  <span className="font-mono text-xs font-semibold text-blue-700 dark:text-cyan-300">
                    {project.technologyTitle}
                  </span>
                </div>

                {/* Reuse the existing ProjectCard component. */}
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
          /* =========================================
             EMPTY STATE AND PHP COMING SOON
          ========================================== */

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-14 text-center transition-colors duration-300 dark:border-slate-700 dark:bg-[#10182c]/70">

            {/* Programming-inspired empty state icon. */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 font-mono text-2xl font-bold text-blue-600 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
              {currentTechnology?.comingSoon
                ? "</>"
                : "{ }"}
            </div>

            {/* PHP technology is not available yet. */}
            {currentTechnology?.comingSoon ? (
              <>
                <span className="mt-6 inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-300">
                  Coming Soon
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  PHP Projects Are on the Way
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-400">
                  We&apos;re preparing guided PHP projects
                  to help you develop your backend
                  programming skills.
                </p>
              </>
            ) : (
              <>
                {/* Generic empty state for unmatched filters. */}
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  No Matching Projects
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-400">
                  No projects match your current filters.
                  Try another technology or difficulty
                  level.
                </p>
              </>
            )}

            {/* Allow the learner to reset all filters. */}
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
