import type { Brief } from "@/lib/generate";

export default function BriefCard({ brief }: { brief: Brief }) {
  return (
    <article className="grid grid-cols-[56px_minmax(0,1fr)] border border-line bg-white shadow-[0_18px_40px_-24px_rgba(19,26,58,0.45)] sm:grid-cols-[76px_minmax(0,1fr)]">
      <div className="relative flex flex-col items-center justify-between bg-ink py-5 text-white [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_8px,rgba(255,255,255,0.35)_8px,rgba(255,255,255,0.35)_9px)] [background-position:right] [background-size:1px_100%] [background-repeat:no-repeat]">
        <span className="[writing-mode:vertical-rl] rotate-180 text-[13px] font-semibold tracking-[.28em] text-white/60">
          NO. {brief.id}
        </span>
        <span className="text-center leading-none">
          <b className="block text-2xl font-extrabold sm:text-[26px]">
            {brief.minutes}
          </b>
          <span className="mt-1 block text-[11px] font-semibold text-white/60">
            MIN
          </span>
        </span>
      </div>

      <div className="relative overflow-hidden px-5 py-6 sm:px-7 sm:py-8">
        {brief.crazy && (
          <div className="pointer-events-none absolute top-0 right-0 h-[168px] w-[168px] overflow-hidden sm:block">
            <span className="absolute top-[30px] -right-[42px] w-[200px] rotate-45 bg-ember py-1.5 text-center text-[13px] font-extrabold tracking-[.14em] text-white shadow-[0_4px_10px_rgba(255,107,44,0.35)]">
              GO CRAZY
            </span>
          </div>
        )}

        <p className="text-sm font-semibold text-muted">
          {brief.industry} · {brief.platform}
        </p>
        <h2 className="mt-2.5 max-w-[22ch] text-3xl leading-tight font-extrabold text-balance sm:text-4xl">
          {brief.task}
        </h2>

        <dl className="mt-7 grid grid-cols-1 border-t border-line sm:grid-cols-2">
          <div className="border-b border-line py-3.5 sm:border-r sm:pr-6">
            <dt className="text-sm font-semibold text-muted">Who it is for</dt>
            <dd className="mt-1 text-lg font-semibold">{brief.audience}</dd>
          </div>
          <div className="border-b border-line py-3.5 sm:pl-6">
            <dt className="text-sm font-semibold text-muted">
              How it should look
            </dt>
            <dd className="mt-1 text-lg font-semibold">{brief.style}</dd>
          </div>
          <div className="border-b border-line py-3.5 sm:border-r sm:pr-6">
            <dt className="text-sm font-semibold text-muted">Where it lives</dt>
            <dd className="mt-1 text-lg font-semibold">{brief.industry}</dd>
          </div>
          <div className="border-b border-line py-3.5 sm:pl-6">
            <dt className="text-sm font-semibold text-muted">Built for</dt>
            <dd className="mt-1 text-lg font-semibold">{brief.platform}</dd>
          </div>
        </dl>

        <div className="mt-6 border-l-4 border-natuna bg-natuna-soft px-4 py-3.5">
          <span className="block text-sm font-semibold text-muted">
            The one rule you cannot break
          </span>
          <span className="text-lg font-bold">{brief.constraint}</span>
        </div>
      </div>
    </article>
  );
}
