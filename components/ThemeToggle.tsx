"use client";

import { useEffect, useState } from "react";
import { ui, type Lang } from "@/lib/i18n";

type Theme = "light" | "dark";

export default function ThemeToggle({ lang }: { lang: Lang }) {
  const [theme, setTheme] = useState<Theme>("light");
  const t = ui[lang];

  // The inline script in layout.tsx already set the theme before paint.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  const label = theme === "dark" ? t.toLight : t.toDark;

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="no-print inline-flex items-center justify-center rounded-xl border-2 border-white/40 px-3.5 text-white transition-colors hover:bg-white/10"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[18px] w-[18px]"
      >
        {theme === "dark" ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}
