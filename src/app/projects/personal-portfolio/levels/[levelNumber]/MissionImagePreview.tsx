"use client";

import Image from "next/image";
import { useRef } from "react";

type MissionImagePreviewProps = {
  src: string;
  alt: string;
  missionNumber: number;
  missionTitle: string;
};

// Uses the browser's native dialog for an accessible image lightbox.
// This keeps the server-rendered level roadmap unchanged apart from this preview.
export default function MissionImagePreview({
  src,
  alt,
  missionNumber,
  missionTitle,
}: MissionImagePreviewProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = `mission-${missionNumber}-image-title`;

  return (
    <>
      {/* Consistent medium-sized thumbnail in every mission card. */}
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Enlarge expected result for Mission ${missionNumber}: ${missionTitle}`}
        className="group/preview mx-auto mt-5 block w-full max-w-md overflow-hidden rounded-2xl border border-blue-200 bg-white text-left transition-colors hover:border-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 dark:border-cyan-400/20 dark:bg-[#071126]"
      >
        <div className="relative h-44 w-full bg-slate-100 dark:bg-[#08162b] sm:h-56">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 90vw, 448px"
            className="object-contain p-2"
          />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-blue-100 px-4 py-3 text-xs font-semibold text-blue-700 dark:border-cyan-400/15 dark:text-cyan-300">
          <span>Expected result preview</span>
          <span className="group-hover/preview:underline">Enlarge image ↗</span>
        </div>
      </button>

      {/* Native modal: stays on this page, supports Escape and returns focus. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          // Clicking the backdrop closes the popup; clicking the image does not.
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="m-auto max-h-[94dvh] w-[min(96vw,1100px)] max-w-none overflow-y-auto rounded-2xl border border-cyan-400/40 bg-white p-0 text-slate-900 shadow-[0_25px_90px_rgba(0,0,0,0.5)] backdrop:bg-[#020917]/85 backdrop:backdrop-blur-sm dark:bg-[#0a1830] dark:text-white"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-4 py-4 dark:border-white/10 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-cyan-300">
              Mission {missionNumber} · Expected Result
            </p>
            <h2 id={titleId} className="mt-1 text-base font-extrabold sm:text-lg">
              {missionTitle}
            </h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            aria-label="Close image preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-xl font-semibold text-slate-700 transition-colors hover:border-cyan-400 hover:bg-cyan-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-cyan-400/15"
          >
            ×
          </button>
        </div>

        {/* Original proportions are maintained; tall screenshots scroll naturally. */}
        <div className="flex min-h-[200px] items-center justify-center bg-slate-100 p-3 dark:bg-[#061126] sm:p-5">
          <div className="relative h-[min(70dvh,760px)] w-full">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 96vw, 1050px"
              className="object-contain"
            />
          </div>
        </div>
        <p className="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
          Press Escape, click outside the image, or use × to close.
        </p>
      </dialog>
    </>
  );
}
