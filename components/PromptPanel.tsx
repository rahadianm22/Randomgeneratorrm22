"use client";

import { useState } from "react";
import Markdown from "./Markdown";
import { ui, type Lang } from "@/lib/i18n";

export default function PromptPanel({
  prompt,
  lang,
}: {
  prompt: string;
  lang: Lang;
}) {
  const [copied, setCopied] = useState(false);
  const t = ui[lang];

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-line bg-paper">
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <h2 className="text-lg font-bold">{t.promptTitle}</h2>
        <button
          onClick={copy}
          className="no-print rounded-lg border border-fg px-3 py-1.5 text-sm transition-colors hover:bg-ink hover:text-white"
        >
          {copied ? t.copied : t.copyPrompt}
        </button>
      </header>
      <div className="px-6 py-6">
        <Markdown source={prompt} />
      </div>
    </section>
  );
}
