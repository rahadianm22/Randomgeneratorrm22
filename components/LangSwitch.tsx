"use client";

import { LANGS, ui, type Lang } from "@/lib/i18n";

export default function LangSwitch({
  lang,
  onChange,
}: {
  lang: Lang;
  onChange: (lang: Lang) => void;
}) {
  return (
    <div
      role="group"
      aria-label={ui[lang].langLabel}
      className="no-print inline-flex items-stretch rounded-xl border-2 border-white/40 p-1"
    >
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          aria-pressed={lang === code}
          className={`flex items-center rounded-lg px-3.5 text-sm font-semibold transition-colors ${
            lang === code ? "bg-white text-natuna" : "text-white/80 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
