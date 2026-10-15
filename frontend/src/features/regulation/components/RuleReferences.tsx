import { formatSource } from "../../document-check/model/documentPresentation";
import { regulationAnchor } from "../data/regulation";

export function RuleReferences({ sources }: { sources: string[] }) {
  if (sources.length === 0) return null;

  return (
    <span className="rule-references">
      {sources.map((source, index) => (
        <span key={`${source}-${index}`}>
          {index > 0 ? "; " : ""}
          {source.startsWith("rule:") ? (
            <a href={`/rules#${regulationAnchor(source.slice(5))}`}>{formatSource(source)}</a>
          ) : formatSource(source)}
        </span>
      ))}
    </span>
  );
}
