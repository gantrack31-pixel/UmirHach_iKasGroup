import type { DocumentNextAction } from "../../types/documentCheck";
import { RuleReferences } from "../../../regulation/components/RuleReferences";

export function DocumentActions({ actions }: { actions: DocumentNextAction[] }) {
  if (actions.length === 0) return null;

  return (
    <section className="document-actions" aria-label="Что сделать перед подачей">
      <h4>Что сделать перед подачей</h4>
      <p>Раскройте замечание, чтобы увидеть действие.</p>
      <ol className="document-action-list">
        {actions.map((action) => (
          <li key={action.fieldId}>
            <details>
              <summary>
                <strong>{action.title}</strong>
                {action.sources.length > 0 && <small><RuleReferences sources={action.sources} /></small>}
              </summary>
              <p>{action.description}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
