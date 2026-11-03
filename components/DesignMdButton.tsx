"use client";

import { useEffect, useState } from "react";
import Markdown from "./Markdown";
import { buildDesignMd, type Brief } from "@/lib/generate";
import { ui, type Lang } from "@/lib/i18n";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-4 w-4 flex-none",
};

export default function DesignMdButton({
  brief,
  lang,
}: {
  brief: Brief | null;
  lang: Lang;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"preview" | "raw">("preview");
  const t = ui[lang];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const markdown = brief ? buildDesignMd(brief, lang) : "";
  const filename = brief ? `design-${brief.id}.md` : "design.md";

  function download() {
    const url = URL.createObjectURL(
      new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!brief}
        className="inline-flex items-center gap-2 border-2 border-white bg-white px-5 py-3 text-[15px] font-bold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:opacity-50"
      >
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        {t.mdView}
      </button>

      {open && brief && (
        <div
          className="no-print fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={filename}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92dvh] w-full max-w-[820px] flex-col border border-line bg-white text-ink shadow-[0_30px_80px_-20px_rgba(19,26,58,0.6)] sm:max-h-[86dvh]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">{filename}</h2>
                <p className="mt-0.5 text-sm text-muted">{t.mdHint}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.mdClose}
                className="flex-none p-1 text-muted hover:text-ink"
              >
                <svg {...iconProps}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            <div className="flex gap-1 border-b border-line px-5 pt-3 sm:px-6">
              {(["preview", "raw"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={`-mb-px border-b-2 px-3 py-2 text-sm font-semibold ${
                    view === v
                      ? "border-ink text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {v === "preview" ? t.mdPreview : t.mdRaw}
                </button>
              ))}
            </div>

            {view === "preview" ? (
              <div className="min-h-0 flex-1 overflow-auto px-5 py-5 sm:px-6">
                <Markdown source={markdown} />
              </div>
            ) : (
              <pre className="min-h-0 flex-1 overflow-auto bg-natuna-soft/40 px-5 py-5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words sm:px-6">
                {markdown}
              </pre>
            )}

            <footer className="flex flex-wrap justify-end gap-3 border-t border-line px-5 py-4 sm:px-6">
              <button
                onClick={copy}
                className="border-2 border-ink px-4 py-2.5 text-[15px] font-bold transition-colors hover:bg-ink hover:text-white"
              >
                {copied ? t.copied : t.mdCopy}
              </button>
              <button
                onClick={download}
                className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[15px] font-bold text-white transition-colors hover:bg-natuna hover:border-natuna"
              >
                <svg {...iconProps}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                {t.mdDownload}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
