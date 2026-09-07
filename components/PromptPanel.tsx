"use client";

import { useState } from "react";
import Markdown from "./Markdown";

export default function PromptPanel({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

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
    <section className="border border-line bg-white">
      <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
        <h2 className="text-lg font-bold">Ready to paste into an AI</h2>
        <button
          onClick={copy}
          className="border border-ink px-3 py-1.5 text-sm transition-colors hover:bg-ink hover:text-white"
        >
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </header>
      <div className="px-6 py-6">
        <Markdown source={prompt} />
      </div>
    </section>
  );
}
