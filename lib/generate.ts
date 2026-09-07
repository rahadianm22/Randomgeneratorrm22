import { pools } from "./pools";

export type Brief = {
  id: string;
  task: string;
  industry: string;
  style: string;
  constraint: string;
  audience: string;
  platform: string;
  minutes: number;
  crazy: boolean;
  createdAt: number;
};

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

const timeBoxes = [30, 45, 60, 90, 120];
let counter = 0;

export function generateBrief(crazy = false): Brief {
  counter += 1;
  return {
    id: String(counter).padStart(3, "0"),
    task: pick(pools.tasks),
    industry: pick(pools.industries),
    style: pick(pools.styles),
    constraint: crazy ? pick(pools.constraints) : pick(pools.constraints.slice(0, 12)),
    audience: pick(pools.audiences),
    platform: pick(pools.platforms),
    minutes: crazy ? 30 : pick(timeBoxes),
    crazy,
    createdAt: Date.now(),
  };
}

export function buildPrompt(b: Brief): string {
  return `# Design brief

**What to design:** ${b.task}
**Where it lives:** ${b.industry} — ${b.platform}
**Who uses it:** ${b.audience}
**How it should look:** ${b.style}
**The rule you cannot break:** ${b.constraint}
**Time you have:** ${b.minutes} minutes${b.crazy ? " (Go Crazy mode — push it further than feels comfortable)" : ""}

## What to hand back

1. The main screen as it normally looks, plus the two other versions that matter most here — for example while it is still loading, when something goes wrong, when it is empty, or when it worked.
2. A short explanation: what the person is trying to do, what the screen puts first, and what you chose to leave out.
3. A list of the colours, text sizes, and spacing you used, so someone else could rebuild it.

## Rules

- Follow the rule above exactly. If it clashes with the usual way of doing things, break the usual way.
- Write real words. No filler text, no placeholder labels.
- Anything a person can click must clearly show when it is selected.
- Keep lines of text short enough to read comfortably.
- Name things the way the person using it would say them, not the way it was built.`;
}

export type PRD = {
  context: string;
  goal: string;
  users: string;
  requirements: string[];
  success: string;
  outOfScope: string[];
};

export function buildPRD(b: Brief): PRD {
  return {
    context: `${b.industry} needs this built for ${b.platform.toLowerCase()}: ${b.task.toLowerCase()}. This is practice, but treat the rule and the people using it as real. The point is designing well inside a limit you did not choose.`,
    goal: `Let ${b.audience.toLowerCase()} get through this without asking for help or having to start over.`,
    users: `${b.audience}. Design for what this group actually knows and can reach — not for someone who uses it every day.`,
    requirements: [
      "Show the screen as it normally looks, plus the two other versions that matter most here — loading, an error, empty, or finished.",
      `Make it look like this: ${b.style.toLowerCase()}.`,
      `Follow the rule exactly, even where it clashes with the usual way: ${b.constraint.toLowerCase()}.`,
      `Finish inside ${b.minutes} minutes — the time limit is part of the brief, not a suggestion.`,
    ],
    success:
      "Someone looking at it can tell what the screen is for in about three seconds, and can see the rule was really followed.",
    outOfScope: [
      "Any screen that is not part of this one job",
      "How it works behind the scenes, and where the data comes from",
      b.crazy
        ? "Playing it safe — the rule above is meant to be uncomfortable"
        : "Unusual situations beyond the versions asked for above",
    ],
  };
}

export function prdToPlainText(b: Brief, p: PRD): string {
  return `Brief — ${b.task}

The situation
${p.context}

The point
${p.goal}

Who uses it
${p.users}

What to do
${p.requirements.map((r) => "- " + r).join("\n")}

You did it right if
${p.success}

Do not bother with
${p.outOfScope.map((r) => "- " + r).join("\n")}`;
}
