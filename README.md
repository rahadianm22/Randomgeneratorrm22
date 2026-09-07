# Random Generator — Design by Rahadianm22

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Structure

```
app/
  layout.tsx      root layout, font, metadata
  page.tsx         main screen, tab state (Main / History)
  globals.css      design tokens (Tailwind v4 @theme)
components/
  BriefCard.tsx    the drawn brief, ticket-styled
  PRDPanel.tsx     PRD document generated from the same brief
  PromptPanel.tsx  Claude Design prompt + copy action
  Markdown.tsx     minimal markdown renderer
  HistoryView.tsx  grid of past tickets, click to reload into Main
lib/
  pools.ts         all brief content pools — edit here to change the output
  generate.ts      Brief type, random draw, prompt builder, PRD builder
```

## Where to edit what

- New tasks, industries, styles, constraints, audiences, platforms: `lib/pools.ts`
- Prompt wording: `buildPrompt()` in `lib/generate.ts`
- PRD wording: `buildPRD()` in `lib/generate.ts`
- Colours, font: the `@theme` block in `app/globals.css`
- Tab layout / masthead copy: `app/page.tsx`

## Deploy

Push to a Git repo and import it on Vercel, or run `npx vercel`.
