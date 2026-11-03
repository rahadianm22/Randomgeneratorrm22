"use client";

import { useEffect, useState } from "react";
import BriefCard from "@/components/BriefCard";
import PRDPanel from "@/components/PRDPanel";
import PromptPanel from "@/components/PromptPanel";
import HistoryView from "@/components/HistoryView";
import PdfButton from "@/components/PdfButton";
import DesignMdButton from "@/components/DesignMdButton";
import LangSwitch from "@/components/LangSwitch";
import { buildPrompt, generateBrief, type Brief } from "@/lib/generate";
import { ui, type Lang } from "@/lib/i18n";

type Tab = "main" | "history";

export default function Home() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [log, setLog] = useState<Brief[]>([]);
  const [tab, setTab] = useState<Tab>("main");
  const [lang, setLang] = useState<Lang>("en");
  const t = ui[lang];

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "id") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function changeLang(next: Lang) {
    setLang(next);
    try {
      localStorage.setItem("lang", next);
    } catch {}
  }

  function draw(crazy: boolean) {
    const next = generateBrief(crazy);
    setBrief(next);
    setLog((prev) => [next, ...prev].slice(0, 24));
  }

  useEffect(() => {
    draw(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectFromHistory(b: Brief) {
    setBrief(b);
    setTab("main");
  }

  return (
    <>
      <header className="no-print bg-natuna px-5 pt-10 pb-22 text-white sm:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-sm text-white/75">
              <span className="h-2 w-2 rounded-full bg-ember" /> {t.credit}
            </span>
            <LangSwitch lang={lang} onChange={changeLang} />
          </div>
          <h1 className="max-w-[17ch] text-4xl leading-[1.03] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-[52ch] text-[17px] leading-relaxed text-white/80">
            {t.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <DesignMdButton brief={brief} lang={lang} />
            <PdfButton brief={brief} lang={lang} />
          </div>
        </div>
      </header>

      <main className="print-area mx-auto -mt-13 max-w-[1000px] px-5 pb-20 sm:px-8">
        <div className="tabbar-wrap no-print inline-flex gap-1 border border-line bg-white p-1 shadow-[0_18px_40px_-26px_rgba(19,26,58,0.5)]">
          <button
            onClick={() => setTab("main")}
            className={`px-5 py-2.5 text-[15px] font-medium ${
              tab === "main" ? "bg-ink text-white" : "text-muted"
            }`}
          >
            {t.main}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-5 py-2.5 text-[15px] font-medium ${
              tab === "history" ? "bg-ink text-white" : "text-muted"
            }`}
          >
            {t.history}{" "}
            <span
              className={`ml-2 inline-flex h-5 min-w-5 items-center justify-center px-1.5 text-xs font-semibold ${
                tab === "history" ? "bg-white/25" : "bg-ember text-white"
              }`}
            >
              {log.length}
            </span>
          </button>
        </div>

        {tab === "main" ? (
          <div className="mt-7">
            <div className="no-print flex flex-wrap gap-3">
              <button
                onClick={() => draw(false)}
                className="bg-ink px-6.5 py-3.5 text-[15.5px] font-semibold text-white shadow-[4px_4px_0_var(--color-line)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5"
              >
                {t.pull}
              </button>
              <button
                onClick={() => draw(true)}
                className="bg-ember px-6.5 py-3.5 text-[15.5px] font-semibold text-white shadow-[4px_4px_0_var(--color-line)] transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-0.5 active:translate-y-0.5"
              >
                {t.crazy}
              </button>
            </div>

            {brief && (
              <div id="brief-export" className="mt-6 flex flex-col gap-6">
                <div className="print-avoid-break">
                  <BriefCard brief={brief} lang={lang} />
                </div>
                <div className="print-avoid-break">
                  <PRDPanel brief={brief} lang={lang} />
                </div>
                <div className="print-avoid-break">
                  <PromptPanel prompt={buildPrompt(brief, lang)} lang={lang} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-7 no-print">
            <HistoryView
              briefs={log}
              lang={lang}
              onSelect={selectFromHistory}
              onClear={() => setLog([])}
              onDrawFirst={() => {
                draw(false);
                setTab("main");
              }}
            />
          </div>
        )}
      </main>
    </>
  );
}
