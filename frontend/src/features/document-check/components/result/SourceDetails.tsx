import type { DocumentCheckResult } from "../../types/documentCheck";
import { Icon } from "../../../../shared/components/Icon";

export function SourceDetails({ result }: { result: DocumentCheckResult | null }) {
  return (
    <details className="source-details">
      <summary className="source-link">
        <span className="source-icon"><Icon name="file" size={21} /></span>
        <span><strong>{result?.sourceTitle ?? "Демонстрационное основание"}</strong><small>{result?.sourceReference ?? "Источник не подключён"}</small></span>
        <span className="source-toggle" aria-hidden="true">+</span>
      </summary>
      <p className="source-excerpt">{result?.sourceExcerpt ?? "Официальные источники не подключены. Результат показан только для демонстрации интерфейса."}</p>
    </details>
  );
}
