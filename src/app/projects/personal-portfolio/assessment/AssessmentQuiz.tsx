"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { AssessmentQuestion } from "../assessment-server";
import { submitPortfolioAssessment } from "../assessment-actions";

type AssessmentView = {
  assessmentTitle: string;
  questions: AssessmentQuestion[];
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  completedMissions: number;
  totalMissions: number;
};

type SavedScore = {
  correctAnswers: number;
  totalQuestions: number;
};

type Props = {
  assessment: AssessmentView;
  savedScore: SavedScore | null;
};

const overviewHref = "/projects/personal-portfolio";

export default function AssessmentQuiz({ assessment, savedScore }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SavedScore | null>(savedScore);
  const [isCompleted, setIsCompleted] = useState(assessment.isCompleted);
  const [completedNow, setCompletedNow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const answeredCount = assessment.questions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const canSubmit =
    assessment.isUnlocked &&
    !isCompleted &&
    !isSubmitting &&
    answeredCount === assessment.questions.length;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setShowConfirmation(true);
  }

  async function confirmSubmission() {
    if (!canSubmit) return;
    setError(null);
    setIsSubmitting(true);

    try {
      // Always send one option in database question order.
      const selectedOptionIds = assessment.questions.map(
        (question) => answers[question.id],
      );
      const response = await submitPortfolioAssessment(selectedOptionIds);

      if (!response.success) {
        setError(response.error);
        return;
      }

      setResult({
        correctAnswers: response.correctAnswers,
        totalQuestions: response.totalQuestions,
      });
      setIsCompleted(true);
      setCompletedNow(!response.alreadyCompleted);
      setShowConfirmation(false);
    } catch {
      setError(
        "Something went wrong. Your selected answers are still here; please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-[#080d1e] dark:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-0 h-[420px] w-[420px] rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-400/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[580px] h-[440px] w-[440px] rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/10"
      />

      <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-9 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
        >
          <Link
            href="/projects"
            className="hover:text-blue-600 dark:hover:text-cyan-300"
          >
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={overviewHref}
            className="hover:text-blue-600 dark:hover:text-cyan-300"
          >
            Personal Portfolio
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-blue-700 dark:text-cyan-300">
            Final Assessment
          </span>
        </nav>

        <header className="mt-10 rounded-[28px] border border-blue-200 bg-white/95 p-6 shadow-xl shadow-blue-500/5 dark:border-cyan-400/20 dark:bg-[#121d35]/95 dark:shadow-black/20 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">
                961-DEV / FINAL CHECKPOINT
              </p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                Personal Portfolio{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
                  Assessment
                </span>
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Apply what you learned while building your website. Answer three
                practical questions covering HTML, responsive CSS, and
                JavaScript.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-center dark:border-cyan-400/20 dark:bg-cyan-400/10">
              <p className="font-mono text-3xl font-extrabold text-blue-600 dark:text-cyan-300">
                03
              </p>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Questions
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5 text-xs font-semibold dark:border-slate-700">
            <span className="rounded-full bg-blue-50 px-3 py-2 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              HTML
            </span>
            <span className="rounded-full bg-cyan-50 px-3 py-2 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
              CSS
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-2 text-slate-700 dark:bg-slate-700/60 dark:text-slate-200">
              JavaScript
            </span>
            <span className="ml-auto text-slate-500 dark:text-slate-400">
              One saved submission
            </span>
          </div>
        </header>

        {!assessment.isUnlocked && !isCompleted ? (
          <section className="mt-8 rounded-3xl border border-amber-200 bg-white p-7 shadow-sm dark:border-amber-400/20 dark:bg-[#121d35] sm:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
              Assessment locked
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">
              Complete your missions first
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              You have officially completed {assessment.completedMissions} of{" "}
              {assessment.totalMissions} missions. Finish the remaining missions
              to unlock this assessment. Your existing progress will be saved.
            </p>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                style={{
                  width: `${assessment.totalMissions ? Math.round((assessment.completedMissions / assessment.totalMissions) * 100) : 0}%`,
                }}
              />
            </div>
            <Link
              href={overviewHref}
              className="mt-7 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Continue Learning →
            </Link>
          </section>
        ) : isCompleted ? (
          <section
            aria-live="polite"
            className="mt-8 rounded-3xl border border-emerald-200 bg-white p-7 shadow-sm dark:border-emerald-400/20 dark:bg-[#121d35] sm:p-10"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-3xl text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300"
              aria-hidden="true"
            >
              ✓
            </div>
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
              Project officially completed
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">
              Congratulations! Your Personal Portfolio project is complete.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              You finished all {assessment.totalMissions} guided missions and
              submitted your final assessment. Your first score and project
              completion remain saved to your account after refreshing or
              signing back in. Completion does not require a minimum quiz score.
            </p>
            {result ? (
              <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Your score
                  </p>
                  <p className="mt-2 font-mono text-4xl font-extrabold text-blue-600 dark:text-cyan-300">
                    {result.correctAnswers}
                    <span className="text-xl text-slate-400">
                      {" "}
                      / {result.totalQuestions}
                    </span>
                  </p>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Correct answers
                  </p>
                  <p className="mt-2 font-mono text-4xl font-extrabold text-blue-600 dark:text-cyan-300">
                    {Math.round(
                      (result.correctAnswers / result.totalQuestions) * 100,
                    )}
                    %
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Your completion is saved. The score is not available for this
                record.
              </p>
            )}
            {completedNow && (
              <p className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Submission saved successfully.
              </p>
            )}
            <Link
              href={overviewHref}
              className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
            >
              Back to Personal Portfolio →
            </Link>
          </section>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="rounded-2xl border border-blue-200 bg-blue-50/80 px-5 py-4 dark:border-cyan-400/20 dark:bg-cyan-400/5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-bold text-blue-800 dark:text-cyan-200">
                  Your assessment progress
                </p>
                <span className="font-mono text-sm font-bold text-blue-700 dark:text-cyan-300">
                  {answeredCount} / {assessment.questions.length} answered
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-blue-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                  style={{
                    width: `${Math.round((answeredCount / assessment.questions.length) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {assessment.questions.map((question, index) => (
              <fieldset
                key={question.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/70 dark:bg-[#121d35] sm:p-7"
                disabled={isSubmitting}
              >
                <legend className="sr-only">Question {index + 1}</legend>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-mono text-sm font-extrabold text-blue-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    Question {index + 1} of {assessment.questions.length}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-extrabold leading-8 sm:text-xl">
                  {question.text}
                </h2>
                <div className="mt-6 grid gap-3">
                  {question.options.map((option) => {
                    const selected = answers[question.id] === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border px-4 py-4 transition-colors sm:px-5 ${selected ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:border-cyan-300 dark:bg-cyan-400/10" : "border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-cyan-400/40"}`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={selected}
                          onChange={() => {
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: option.id,
                            }));
                            setError(null);
                          }}
                          className="mt-1 h-4 w-4 shrink-0 accent-blue-600 dark:accent-cyan-400"
                        />
                        <span className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">
                          {option.text}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <section className="rounded-3xl border border-blue-200 bg-white p-6 dark:border-cyan-400/20 dark:bg-[#121d35] sm:p-8">
              <h2 className="text-lg font-extrabold">Ready to finish?</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Review your selections before submitting. Your first score is
                saved permanently; the assessment cannot be retaken using this
                account.
              </p>
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
                >
                  {error}
                </p>
              )}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {answeredCount === 3
                    ? "All questions answered"
                    : `${3 - answeredCount} question(s) remaining`}
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-extrabold text-white transition-opacity hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                >
                  {isSubmitting ? "Saving your result…" : "Submit Assessment →"}
                </button>
              </div>
            </section>
          </form>
        )}

        {showConfirmation && !isCompleted && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            role="presentation"
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="assessment-confirm-title"
              aria-describedby="assessment-confirm-description"
              className="w-full max-w-md rounded-3xl border border-blue-200 bg-white p-7 shadow-2xl dark:border-cyan-400/30 dark:bg-[#121d35]"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-cyan-300">
                Confirm your submission
              </p>
              <h2
                id="assessment-confirm-title"
                className="mt-3 text-2xl font-extrabold"
              >
                Submit all three answers?
              </h2>
              <p
                id="assessment-confirm-description"
                className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300"
              >
                Your first assessment result will be saved permanently and
                cannot be replaced. Make sure you have reviewed all your
                selections.
              </p>
              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:bg-rose-400/10 dark:text-rose-200"
                >
                  {error}
                </p>
              )}
              <div className="mt-7 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Review answers
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={confirmSubmission}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300"
                >
                  {isSubmitting ? "Saving…" : "Confirm & Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        <p className="mt-12 text-center text-xs font-semibold tracking-[0.2em] text-blue-600 dark:text-cyan-300">
          LEARN. BUILD. GROW.
        </p>
      </div>
    </main>
  );
}
