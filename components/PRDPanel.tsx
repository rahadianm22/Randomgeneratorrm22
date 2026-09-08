"use client";

import { useState } from "react";
import type { Brief } from "@/lib/generate";
import { buildPRD, prdToPlainText } from "@/lib/generate";

export default function PRDPanel({ brief }: { brief: Brief }) {
  const [copied, setCopied] = useState(false);
  const prd = buildPRD(brief);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prdToPlainText(brief, prd));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="border border-line bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-4 text-white">
        <h2 className="text-lg font-bold">The full brief</h2>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs font-semibold text-white/55">
            Brief {brief.id}
          </span>
          <button
            onClick={copy}
            className="no-print border border-white/40 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white hover:text-ink"
          >
            {copied ? "Copied" : "Copy brief"}
          </button>
        </div>
      </header>

      <div className="border-b border-line px-6 py-5">
        <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
          The situation
        </h3>
        <p className="max-w-[70ch] leading-relaxed">{prd.context}</p>
      </div>

      <div className="grid divide-line border-b border-line sm:grid-cols-2 sm:divide-x">
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            The point
          </h3>
          <p className="leading-relaxed">{prd.goal}</p>
        </div>
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            Who uses it
          </h3>
          <p className="leading-relaxed">{prd.users}</p>
        </div>
      </div>

      <div className="border-b border-line px-6 py-5">
        <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
          What to do
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
            You did it right if
          </h3>
          <p className="leading-relaxed">{prd.success}</p>
        </div>
        <div className="px-6 py-5">
          <h3 className="mb-2 text-xs font-bold tracking-wide text-natuna-deep uppercase">
            Do not bother with
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
