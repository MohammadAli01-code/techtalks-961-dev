"use client";

import Link from "next/link";
import { useState } from "react";

const projectRoute = "/projects/quiz-application";

// Assessment questions based on the learning missions.
const questions = [
  {
    id: 1,
    question:
      "Why do we store quiz questions in an array of objects?",
    options: [
      "To change the background color",
      "To organize data and display questions dynamically",
      "To prevent CSS from loading",
      "To create a separate HTML page for every question",
    ],
    correct: 1,
    explanation:
      "Arrays of objects organize questions, options, and correct answers in a reusable structure.",
  },
  {
    id: 2,
    question:
      "How can we prevent a user from scoring twice on the same question?",
    options: [
      "Increase the score every time a button is clicked",
      "Refresh the page after every answer",
      "Use an answered variable and disable the answer buttons",
      "Remove the questions array",
    ],
    correct: 2,
    explanation:
      "The answered variable prevents repeated submissions, while disabling buttons prevents additional selections.",
  },
  {
    id: 3,
    question:
      "What should happen when the user restarts the quiz?",
    options: [
      "Reset the question index, score, and interface",
      "Keep the previous score",
      "Delete all questions",
      "Display only the last question",
    ],
    correct: 0,
    explanation:
      "Restarting requires resetting the application state and displaying the first question again.",
  },
];

export default function QuizAssessmentPage() {
  const [answers, setAnswers] = useState<
    Record<number, number>
  >({});

  const [submitted, setSubmitted] = useState(false);

  // Calculate assessment statistics.
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const score = questions.filter(
    (question) =>
      answers[question.id] === question.correct,
  ).length;

  const percentage = Math.round(
    (score / questions.length) * 100,
  );

  const progress = Math.round(
    (answeredCount / questions.length) * 100,
  );

  // Store the selected answer.
  function selectAnswer(
    questionId: number,
    optionIndex: number,
  ) {
    if (submitted) return;

    setAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  }

  // Submit only when every question is answered.
  function submitAssessment() {
    if (!allAnswered) return;

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Reset the assessment for another attempt.
  function retryAssessment() {
    setAnswers({});
    setSubmitted(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#080d1e] dark:text-white">

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:py-8">

        {/* Breadcrumb */}
        <Link
          href={projectRoute}
          className="text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-300"
        >
          ← Back to Quiz Application
        </Link>

        {/* Assessment header */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#151d34] sm:p-6">

          <div className="flex flex-wrap gap-2">

            <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-cyan-400/10 dark:text-cyan-300">
              Quiz Application
            </span>

            <span className="rounded-lg bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
              Medium Level
            </span>

          </div>

          <p className="mt-4 font-mono text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
            Final Checkpoint
          </p>

          <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Final Assessment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Test your understanding of JavaScript logic,
            dynamic questions, score calculation, and
            application state.
          </p>

          {/* Assessment information */}
          <div className="mt-5 grid grid-cols-3 gap-2">

            {[
              {
                label: "Questions",
                value: questions.length,
              },
              {
                label: "Answered",
                value: answeredCount,
              },
              {
                label: "Progress",
                value: `${progress}%`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-[#10182c]"
              >

                <p className="text-xl font-extrabold text-blue-600 dark:text-cyan-300">
                  {item.value}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>

              </div>
            ))}

          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-label="Assessment progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          >

            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

          </div>

        </section>

        {/* Assessment result */}
        {submitted && (
          <section
            role="status"
            className="mt-5 rounded-2xl border border-blue-200 bg-white p-6 text-center dark:border-cyan-400/20 dark:bg-[#151d34]"
          >

            <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
              Assessment Result
            </p>

            <div
              className="relative mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #22d3ee ${percentage}%,
                  #64748b ${percentage}% 100%
                )`,
              }}
            >

              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-[#080d1e]">

                <span className="text-2xl font-extrabold">
                  {percentage}%
                </span>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {score}/{questions.length}
                </span>

              </div>

            </div>

            <h2 className="mt-4 text-xl font-extrabold">
              {score === questions.length
                ? "Excellent Work!"
                : "Assessment Completed!"}
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-400">
              {score === questions.length
                ? "You demonstrated a strong understanding of the quiz application concepts."
                : "Review the explanations below to strengthen your understanding."}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">

              <button
                type="button"
                onClick={retryAssessment}
                className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300"
              >
                Retry Assessment
              </button>

              <Link
                href={projectRoute}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 dark:bg-cyan-400 dark:text-slate-950"
              >
                Return to Project →
              </Link>

            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Practice result only. Account saving is
              not connected yet.
            </p>

          </section>
        )}

        {/* Assessment questions */}
        <div className="mt-5 space-y-4">

          {questions.map((question, index) => (
            <section
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#151d34]"
            >

              <div className="flex items-center justify-between gap-3">

                <p className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-300">
                  Question {index + 1}
                </p>

                {submitted && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      answers[question.id] === question.correct
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                        : "bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-300"
                    }`}
                  >
                    {answers[question.id] === question.correct
                      ? "Correct"
                      : "Incorrect"}
                  </span>
                )}

              </div>

              <h2 className="mt-3 text-base font-bold leading-7 sm:text-lg">
                {question.question}
              </h2>

              <div
                role="group"
                aria-label={`Answers for question ${index + 1}`}
                className="mt-4 grid gap-2"
              >

                {question.options.map((option, optionIndex) => {

                  const selected =
                    answers[question.id] === optionIndex;

                  const isCorrect =
                    optionIndex === question.correct;

                  let optionStyle =
                    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-[#10182c] dark:text-slate-300";

                  if (!submitted && selected) {
                    optionStyle =
                      "border-blue-500 bg-blue-50 text-blue-700 dark:border-cyan-400 dark:bg-cyan-400/10 dark:text-cyan-300";
                  }

                  if (submitted && isCorrect) {
                    optionStyle =
                      "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300";
                  }

                  if (
                    submitted &&
                    selected &&
                    !isCorrect
                  ) {
                    optionStyle =
                      "border-red-400 bg-red-50 text-red-700 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-300";
                  }

                  return (
                    <button
                      key={optionIndex}
                      type="button"
                      disabled={submitted}
                      aria-pressed={selected}
                      onClick={() =>
                        selectAnswer(
                          question.id,
                          optionIndex,
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors enabled:hover:border-blue-400 disabled:cursor-default ${optionStyle}`}
                    >

                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current font-mono text-xs font-bold">
                        {String.fromCharCode(
                          65 + optionIndex,
                        )}
                      </span>

                      <span className="flex-1">
                        {option}
                      </span>

                      {submitted && isCorrect && (
                        <span aria-hidden="true">✓</span>
                      )}

                      {submitted &&
                        selected &&
                        !isCorrect && (
                          <span aria-hidden="true">✕</span>
                        )}

                    </button>
                  );
                })}

              </div>

              {/* Show explanations after submission */}
              {submitted && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-cyan-400/20 dark:bg-cyan-400/5">

                  <p className="text-xs font-bold text-blue-700 dark:text-cyan-300">
                    Explanation
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {question.explanation}
                  </p>

                </div>
              )}

            </section>
          ))}

        </div>

        {/* Submit assessment */}
        {!submitted && (
          <section className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#151d34]">

            <div>

              <p className="text-sm font-bold">
                Ready to submit?
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {allAnswered
                  ? "All questions have been answered."
                  : "Answer every question before submitting."}
              </p>

            </div>

            <button
              type="button"
              disabled={!allAnswered}
              onClick={submitAssessment}
              className="rounded-lg bg-blue-600 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-cyan-400 dark:text-slate-950"
            >
              Submit Assessment →
            </button>

          </section>
        )}

        {/* Footer */}
        <p className="mt-8 text-center font-mono text-xs font-bold tracking-widest text-blue-600 dark:text-cyan-300">
          LEARN. BUILD. GROW.
        </p>

      </div>

    </main>
  );
}