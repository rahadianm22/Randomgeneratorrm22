"use client";

import { useState } from "react";
import type { Brief } from "@/lib/generate";
import { ui, type Lang } from "@/lib/i18n";

type Status = "idle" | "busy" | "failed";

// A4 in points, with a margin and a gap between panels.
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 28;
const GAP = 14;

export default function PdfButton({
  brief,
  lang,
}: {
  brief: Brief | null;
  lang: Lang;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const t = ui[lang];

  async function handleClick() {
    const root = document.getElementById("brief-export");
    if (!brief || !root || status === "busy") return;
    setStatus("busy");
    try {
      const [{ toCanvas }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const contentW = PAGE_W - MARGIN * 2;
      const pageInnerH = PAGE_H - MARGIN * 2;
      let y = MARGIN;

      for (const panel of Array.from(root.children) as HTMLElement[]) {
        const canvas = await toCanvas(panel, {
          pixelRatio: 2,
          backgroundColor: "#ffffff",
          filter: (n) =>
            !(
              n instanceof HTMLElement &&
              (n.dataset.noCapture || n.classList.contains("no-print"))
            ),
        });
        const scale = contentW / canvas.width;
        const panelH = canvas.height * scale;

        // Start a fresh page if the panel would be cut but fits on one page.
        if (y + panelH > PAGE_H - MARGIN && panelH <= pageInnerH && y > MARGIN) {
          doc.addPage();
          y = MARGIN;
        }

        // Panels taller than a page are sliced across pages.
        let srcY = 0;
        while (srcY < canvas.height) {
          const room = PAGE_H - MARGIN - y;
          const sliceH = Math.min(canvas.height - srcY, Math.floor(room / scale));
          const slice = document.createElement("canvas");
          slice.width = canvas.width;
          slice.height = sliceH;
          slice.getContext("2d")!.drawImage(
            canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH,
          );
          doc.addImage(
            slice.toDataURL("image/jpeg", 0.92), "JPEG",
            MARGIN, y, contentW, sliceH * scale,
          );
          srcY += sliceH;
          y += sliceH * scale;
          if (srcY < canvas.height) {
            doc.addPage();
            y = MARGIN;
          }
        }
        y += GAP;
      }

      doc.save(`design-${brief.id}.pdf`);
      setStatus("idle");
    } catch {
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={!brief || status === "busy"}
      className="inline-flex items-center gap-2 border-2 border-white bg-transparent px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-white hover:text-ink disabled:opacity-60"
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
      {status === "busy" ? t.pdfBusy : status === "failed" ? t.pdfFailed : t.pdf}
    </button>
  );
}
