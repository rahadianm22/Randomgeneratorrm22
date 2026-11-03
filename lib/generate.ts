import { GENTLE_CONSTRAINTS, pools } from "./pools";
import { poolsId } from "./pools.id";
import { ui, type Lang } from "./i18n";

// A brief stores indices into the pools, not text, so the same brief can be
// shown in English or Indonesian at any time. task, industry and audience
// always share one index: they describe the same app.
export type Brief = {
  id: string;
  task: number;
  industry: number;
  style: number;
  constraint: number;
  audience: number;
  platform: number;
  crazy: boolean;
  createdAt: number;
};

export type BriefText = {
  task: string;
  industry: string;
  style: string;
  constraint: string;
  audience: string;
  platform: string;
};

// Lowercase only the first letter, so acronyms like ATM or PIN survive.
const lcFirst = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);

function pickIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

let counter = 0;

export function generateBrief(crazy = false): Brief {
  counter += 1;
  const app = pickIndex(pools.tasks.length);
  return {
    id: String(counter).padStart(3, "0"),
    task: app,
    industry: app,
    audience: app,
    style: pickIndex(pools.styles.length),
    constraint: pickIndex(crazy ? pools.constraints.length : GENTLE_CONSTRAINTS),
    platform: pickIndex(pools.platforms.length),
    crazy,
    createdAt: Date.now(),
  };
}

export function briefText(b: Brief, lang: Lang): BriefText {
  const p = lang === "id" ? poolsId : pools;
  return {
    task: p.tasks[b.task],
    industry: p.industries[b.industry],
    style: p.styles[b.style],
    constraint: p.constraints[b.constraint],
    audience: p.audiences[b.audience],
    platform: p.platforms[b.platform],
  };
}

export function buildPrompt(b: Brief, lang: Lang): string {
  const t = briefText(b, lang);
  if (lang === "id") {
    return `# Brief desain

**Yang perlu didesain:** Seluruh alur dari awal sampai akhir: ${t.task}
**Kategori dan platform:** ${t.industry}, ${t.platform}
**Pengguna:** ${t.audience}
**Tampilan:** ${t.style}
**Aturan yang tidak boleh dilanggar:** ${t.constraint}${b.crazy ? "\n**Mode:** Mode gila. Dorong lebih jauh dari batas nyamanmu" : ""}

## Yang perlu diserahkan

1. Semua layar dalam alur, berurutan dari pertama kali dibuka sampai langkah terakhir. Sertakan kondisi penting seperti memuat, error, kosong, atau berhasil di bagian yang memang membutuhkannya.
2. Penjelasan singkat: apa yang ingin dicapai pengguna di tiap tahap, apa yang didahulukan, dan apa yang sengaja dihilangkan.
3. Daftar warna, ukuran teks, dan jarak yang dipakai, supaya orang lain bisa membangunnya kembali.

## Ketentuan

- Patuhi aturan di atas pada setiap layar. Kalau bertentangan dengan kebiasaan umum, tinggalkan kebiasaan itu.
- Alurnya harus utuh: pengguna bisa pindah dari satu layar ke layar berikutnya tanpa ada langkah yang loncat.
- Pakai teks yang sungguhan, bukan teks pengisi atau label sementara.
- Semua elemen yang bisa diklik harus jelas terlihat saat sedang dipilih.
- Beri nama sesuai bahasa yang dipakai pengguna sehari-hari, bukan istilah teknis pembuatnya.`;
  }
  return `# Design brief

**What to design:** The whole flow, start to finish: ${t.task}
**Category and platform:** ${t.industry}, ${t.platform}
**Who uses it:** ${t.audience}
**How it should look:** ${t.style}
**The rule you cannot break:** ${t.constraint}${b.crazy ? "\n**Mode:** Go Crazy. Push it further than feels comfortable" : ""}

## What to hand back

1. Every screen of the flow, in order, from the first time it is opened to the last step. Include the states that matter (loading, an error, empty, or done) wherever the flow needs them.
2. A short explanation: what the person is trying to do at each stage, what each screen puts first, and what you chose to leave out.
3. A list of the colours, text sizes, and spacing you used, so someone else could rebuild it.

## Rules

- Follow the rule above on every screen. If it clashes with the usual way of doing things, break the usual way.
- The flow must hold together: a person can move from each screen to the next with no missing step.
- Write real words. No filler text, no placeholder labels.
- Anything a person can click must clearly show when it is selected.
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

export function buildPRD(b: Brief, lang: Lang): PRD {
  const t = briefText(b, lang);
  if (lang === "id") {
    return {
      context: `Rancang seluruh alur ${lcFirst(t.task)}, untuk ${lcFirst(t.platform)} di kategori ${lcFirst(t.industry)}. Ini hanya latihan, tetapi anggap aturan dan penggunanya nyata. Tantangannya: mendesain dengan baik di dalam batasan yang tidak kamu pilih sendiri.`,
      goal: `Membantu ${lcFirst(t.audience)} berjalan dari awal sampai akhir tanpa perlu meminta bantuan atau mengulang dari awal.`,
      users: `${t.audience}. Rancang sesuai apa yang benar-benar mereka ketahui. Jangan berasumsi mereka sudah terbiasa dengan aplikasi seperti ini.`,
      requirements: [
        "Rancang alur lengkap, layar demi layar dan berurutan, dari pertama kali dibuka sampai langkah terakhir.",
        "Tampilkan kondisi yang penting (memuat, error, kosong, atau berhasil) di bagian yang memang membutuhkannya.",
        `Tampilan harus seperti ini: ${lcFirst(t.style)}.`,
        `Patuhi aturan berikut di setiap layar, walaupun bertentangan dengan kebiasaan umum: ${lcFirst(t.constraint)}.`,
      ],
      success:
        "Orang yang melihatnya bisa mengikuti alur dari layar pertama sampai terakhir tanpa penjelasan, dan jelas terlihat bahwa aturannya dipatuhi di setiap layar.",
      outOfScope: [
        "Layar lain di luar alur ini",
        "Cara kerja di balik layar dan asal datanya",
        b.crazy
          ? "Bermain aman: aturan di atas memang sengaja dibuat tidak nyaman"
          : "Kasus-kasus langka di luar kondisi yang diminta di atas",
      ],
    };
  }
  return {
    context: `Design the whole flow of ${lcFirst(t.task)}, as a ${lcFirst(t.platform)} in the ${lcFirst(t.industry)} category. This is practice, but treat the rule and the people using it as real. The point is designing well inside a limit you did not choose.`,
    goal: `Let ${lcFirst(t.audience)} get from the first screen to the last without asking for help or having to start over.`,
    users: `${t.audience}. Design for what this group actually knows. Do not assume they have used anything like it before.`,
    requirements: [
      "Design the complete flow, screen by screen and in order, from the first time it is opened to the final step.",
      "Show the states that matter (loading, an error, empty, or done) wherever the flow needs them.",
      `Make it look like this: ${lcFirst(t.style)}.`,
      `Follow the rule on every screen, even where it clashes with the usual way: ${lcFirst(t.constraint)}.`,
    ],
    success:
      "Someone looking at it can follow the flow from the first screen to the last without any explanation, and can see the rule was really followed on every screen.",
    outOfScope: [
      "Any screen that is not part of this flow",
      "How it works behind the scenes, and where the data comes from",
      b.crazy
        ? "Playing it safe: the rule above is meant to be uncomfortable"
        : "Unusual situations beyond the states asked for above",
    ],
  };
}

// One markdown file: the ticket, the full brief, then the ready-to-paste prompt.
export function buildDesignMd(b: Brief, lang: Lang): string {
  const t = ui[lang];
  const x = briefText(b, lang);
  const prd = buildPRD(b, lang);
  const bullets = (items: string[]) => items.map((r) => `- ${r}`).join("\n");
  const ticket = [
    `- **${t.whatDesign}:** ${x.task}`,
    `- **${t.lives}:** ${x.industry}`,
    `- **${t.builtFor}:** ${x.platform}`,
    `- **${t.whoFor}:** ${x.audience}`,
    `- **${t.look}:** ${x.style}`,
    `- **${t.rule}:** ${x.constraint}`,
    ...(b.crazy ? [`- **Mode:** ${t.crazy}`] : []),
  ].join("\n");
  // Push the prompt's own headings two levels down so it nests under section 3.
  const prompt = buildPrompt(b, lang).replace(/^(#+) /gm, "##$1 ");

  return `# Design ${t.brief} ${b.id}

## 1. ${t.mdTicket}

${ticket}

## 2. ${t.fullBrief}

### ${t.situation}
${prd.context}

### ${t.point}
${prd.goal}

### ${t.whoUses}
${prd.users}

### ${t.whatToDo}
${bullets(prd.requirements)}

### ${t.rightIf}
${prd.success}

### ${t.skip}
${bullets(prd.outOfScope)}

## 3. ${t.mdPrompt}

${prompt}
`;
}
