"use client";

import type { Brief } from "@/lib/generate";

export default function HistoryView({
  briefs,
  onSelect,
  onClear,
  onDrawFirst,
}: {
  briefs: Brief[];
  onSelect: (brief: Brief) => void;
  onClear: () => void;
  onDrawFirst: () => void;
}) {
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Today&apos;s tickets</h2>
          {briefs.length > 0 && (
            <p className="mt-0.5 text-sm text-muted">
              {briefs.length} pulled so far — pick one to open it again.
            </p>
          )}
        </div>
        {briefs.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-muted underline underline-offset-4 hover:text-ember"
          >
            Clear all
          </button>
        )}
      </div>

      {briefs.length === 0 ? (
        <div className="border border-dashed border-line bg-white px-6 py-14 text-center text-muted">
          <p className="mb-5">
            Nothing pulled yet. Every ticket you draw is kept here so you can
            come back to it.
          </p>
          <button
            onClick={onDrawFirst}
            className="border-none bg-ink px-6 py-3 font-medium text-white shadow-[4px_4px_0_var(--color-line)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5"
          >
            Pull the first one
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {briefs.map((brief) => (
            <button
              key={brief.id}
              onClick={() => onSelect(brief)}
              className={`flex gap-3.5 border border-line bg-white px-4.5 py-4 text-left transition-all hover:translate-x-0.5 ${
                brief.crazy ? "border-l-4 border-l-ember" : "border-l-4 border-l-line hover:border-l-natuna"
              }`}
            >
              <span
                className={`h-fit flex-none px-2 py-0.5 text-sm font-semibold ${
                  brief.crazy ? "bg-ember text-white" : "bg-natuna-soft text-muted"
                }`}
              >
                {brief.id}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-medium">
                  {brief.task}
                </span>
                <span className="mt-1.5 block text-sm text-muted">
                  <b className="font-medium text-ink">{brief.industry}</b> ·{" "}
                  {brief.minutes} min · {brief.style}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
