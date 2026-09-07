import { Fragment } from "react";

function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export default function Markdown({ source }: { source: string }) {
  const lines = source.split("\n");
  const nodes: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (!list.length) return;
    nodes.push(
      <ul key={key} className="my-3 list-disc space-y-1.5 pl-5">
        {list.map((item, i) => (
          <li key={i}>{inline(item)}</li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      list.push(line.replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
      return;
    }
    flush(`list-${i}`);

    if (line.startsWith("## ")) {
      nodes.push(
        <h3 key={i} className="mt-6 mb-2 text-lg font-semibold">
          {line.slice(3)}
        </h3>,
      );
    } else if (line.startsWith("# ")) {
      nodes.push(
        <h2 key={i} className="mb-3 text-xl font-semibold">
          {line.slice(2)}
        </h2>,
      );
    } else if (line === "") {
      nodes.push(<div key={i} className="h-2" />);
    } else {
      nodes.push(
        <p key={i} className="leading-relaxed">
          {inline(line)}
        </p>,
      );
    }
  });

  flush("list-end");

  return <div className="max-w-[70ch] text-[15px]">{nodes}</div>;
}
