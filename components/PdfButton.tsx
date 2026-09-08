"use client";

import type { Brief } from "@/lib/generate";

export default function PdfButton({ brief }: { brief: Brief | null }) {
  function handleClick() {
    if (!brief) return;
    const prevTitle = document.title;
    document.title = `Brief ${brief.id} — ${brief.task}`.slice(0, 80);
    window.print();
    document.title = prevTitle;
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 border-2 border-ink bg-white px-6 py-3.5 text-[15.5px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 flex-none"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download as PDF
    </button>
  );
}
