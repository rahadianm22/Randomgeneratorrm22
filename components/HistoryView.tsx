"use client";

import { briefText, type Brief } from "@/lib/generate";
import { ui, type Lang } from "@/lib/i18n";

export default function HistoryView({
  briefs,
  lang,
  onSelect,
  onClear,
  onDrawFirst,
}: {
  briefs: Brief[];
  lang: Lang;
  onSelect: (brief: Brief) => void;
  onClear: () => void;
  onDrawFirst: () => void;
}) {
  const t = ui[lang];
  return (
    <section>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{t.todays}</h2>
          {briefs.length > 0 && (
            <p className="mt-0.5 text-sm text-muted">
              {t.pulledSoFar(briefs.length)}
            </p>
          )}
        </div>
        {briefs.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-muted underline underline-offset-4 hover:text-ember"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {briefs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-muted">
          <p className="mb-5">{t.emptyHistory}</p>
          <button
            onClick={onDrawFirst}
            className="rounded-xl bg-ink px-6 py-3 font-semibold text-white shadow-[4px_4px_0_var(--color-line)] transition-[transform,box-shadow] hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_var(--color-line)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            {t.pullFirst}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {briefs.map((brief) => {
            const text = briefText(brief, lang);
            return (
            <button
              key={brief.id}
              onClick={() => onSelect(brief)}
              className={`flex gap-3.5 rounded-xl border bg-white px-4 py-4 text-left transition-[border-color,background-color] hover:bg-natuna-soft/40 ${
                brief.crazy ? "border-ember/60" : "border-line hover:border-natuna"
              }`}
            >
              <span
                className={`h-fit flex-none rounded-md px-2 py-0.5 text-sm font-semibold ${
                  brief.crazy ? "bg-ember text-white" : "bg-natuna-soft text-muted"
                }`}
              >
                {brief.id}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-medium">
                  {text.task}
                </span>
                <span className="mt-1.5 block text-sm text-muted">
                  <b className="font-medium text-ink">{text.industry}</b>, {text.platform}
                </span>
              </span>
            </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
