"use client";

import { useRef, useState } from "react";
import { toBlob } from "html-to-image";
import type { Brief } from "@/lib/generate";
import { buildPRD } from "@/lib/generate";
import { ui, type Lang } from "@/lib/i18n";

type Status = "idle" | "copied" | "failed";

export default function PRDPanel({ brief, lang }: { brief: Brief; lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const ref = useRef<HTMLElement>(null);
  const prd = buildPRD(brief, lang);
  const t = ui[lang];

  async function copy() {
    const node = ref.current;
    if (!node) return;
    try {
      // Promise passed straight to ClipboardItem so Safari keeps the click gesture.
      const blob = toBlob(node, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        filter: (n) => !(n instanceof HTMLElement && n.dataset.noCapture),
      }).then((b) => {
        if (!b) throw new Error("render failed");
        return b;
      });
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 1600);
  }

  return (
    <section ref={ref} className="border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-4 text-white">
        <h2 className="text-lg font-bold">{t.fullBrief}</h2>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-white/55">
            {t.brief} {brief.id}
          </span>
          <button
            onClick={copy}
            data-no-capture="true"
            className="no-print border border-white/40 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white hover:text-ink"
          >
            {status === "copied"
              ? t.imageCopied
              : status === "failed"
                ? t.copyFailed
                : t.copyImage}
          </button>
        </div>
      </header>

      <div className="border-b border-line px-6 py-5">
        <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
          {t.situation}
        </h3>
        <p className="max-w-[70ch] leading-relaxed">{prd.context}</p>
      </div>

      <div className="grid divide-line border-b border-line sm:grid-cols-2 sm:divide-x">
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            {t.point}
          </h3>
          <p className="leading-relaxed">{prd.goal}</p>
        </div>
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            {t.whoUses}
          </h3>
          <p className="leading-relaxed">{prd.users}</p>
        </div>
      </div>

      <div className="border-b border-line px-6 py-5">
        <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
          {t.whatToDo}
        </h3>
        <ul className="list-disc space-y-1.5 pl-5">
          {prd.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <div className="grid divide-line sm:grid-cols-2 sm:divide-x">
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            {t.rightIf}
          </h3>
          <p className="leading-relaxed">{prd.success}</p>
        </div>
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            {t.skip}
          </h3>
          <ul className="list-disc space-y-1.5 pl-5">
            {prd.outOfScope.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
