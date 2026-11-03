import { briefText, type Brief } from "@/lib/generate";
import { ui, type Lang } from "@/lib/i18n";

export default function BriefCard({ brief, lang }: { brief: Brief; lang: Lang }) {
  const t = ui[lang];
  const text = briefText(brief, lang);
  return (
    <article className="grid grid-cols-[56px_minmax(0,1fr)] border border-line bg-white shadow-[0_18px_40px_-24px_rgba(19,26,58,0.45)] sm:grid-cols-[76px_minmax(0,1fr)]">
      <div className="relative flex flex-col items-center justify-start bg-ink py-5 text-white [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_8px,rgba(255,255,255,0.35)_8px,rgba(255,255,255,0.35)_9px)] [background-position:right] [background-size:1px_100%] [background-repeat:no-repeat]">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[13px] font-semibold tracking-[.28em] text-white/60">
          NO. {brief.id}
        </span>
      </div>

      <div className="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8">
        {brief.crazy && (
          <div className="pointer-events-none absolute top-0 right-0 h-[168px] w-[168px] overflow-hidden sm:block">
            <span className="absolute top-[30px] -right-[42px] w-[200px] rotate-45 bg-ember py-1.5 text-center text-[13px] font-extrabold tracking-[.14em] text-white shadow-[0_4px_10px_rgba(255,107,44,0.35)]">
              {t.goCrazy}
            </span>
          </div>
        )}

        <p className="text-sm font-semibold text-muted">
          {text.industry} · {text.platform}
        </p>
        <h2
          className={`mt-2.5 text-2xl leading-tight font-extrabold break-words text-balance sm:text-3xl lg:text-4xl ${
            brief.crazy ? "pr-12 sm:pr-24" : ""
          }`}
        >
          {text.task}
        </h2>

        <dl className="mt-7 grid grid-cols-1 border-t border-line sm:grid-cols-2">
          <div className="border-b border-line py-3.5 sm:border-r sm:pr-6">
            <dt className="text-sm font-semibold text-muted">{t.whoFor}</dt>
            <dd className="mt-1 text-lg font-semibold">{text.audience}</dd>
          </div>
          <div className="border-b border-line py-3.5 sm:pl-6">
            <dt className="text-sm font-semibold text-muted">{t.look}</dt>
            <dd className="mt-1 text-lg font-semibold">{text.style}</dd>
          </div>
          <div className="border-b border-line py-3.5 sm:border-r sm:pr-6">
            <dt className="text-sm font-semibold text-muted">{t.lives}</dt>
            <dd className="mt-1 text-lg font-semibold">{text.industry}</dd>
          </div>
          <div className="border-b border-line py-3.5 sm:pl-6">
            <dt className="text-sm font-semibold text-muted">{t.builtFor}</dt>
            <dd className="mt-1 text-lg font-semibold">{text.platform}</dd>
          </div>
        </dl>

        <div className="mt-6 border-l-4 border-natuna bg-natuna-soft px-4 py-3.5">
          <span className="block text-sm font-semibold text-muted">
            {t.rule}
          </span>
          <span className="text-lg font-bold">{text.constraint}</span>
        </div>
      </div>
    </article>
  );
}
