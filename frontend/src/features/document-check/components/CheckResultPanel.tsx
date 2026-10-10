import { checkStatuses, statusContent } from "../data/statusLabels";
import type { CheckStatus, DocumentCheckResult } from "../types/documentCheck";
import { Icon } from "../../../shared/components/Icon";

type CheckResultPanelProps = {
  status: CheckStatus | null;
  isProcessing: boolean;
  processingStep: string;
  result: DocumentCheckResult | null;
};

export function CheckResultPanel({ status, isProcessing, processingStep, result }: CheckResultPanelProps) {
  const currentStatus = status ? statusContent[status] : null;

  return (
    <article className="panel result-panel">
      <div className="panel-heading"><span className="step-number">03</span><h2>Результат проверки</h2></div>
      {status && <div className="status-options" role="list" aria-label="Статусы проверки">
        {checkStatuses.map((item) => (
          <div className={`status-option ${item}${status === item ? " is-active" : ""}`} key={item} role="listitem" aria-current={status === item ? "true" : undefined}>
            <span className="status-icon">{item === "success" ? <Icon name="check" size={22} /> : statusContent[item].icon}</span>
            <span>{statusContent[item].label}</span>
          </div>
        ))}
      </div>}

      <div className={`answer-card ${status ?? "empty"}${isProcessing ? " is-processing" : ""}`} aria-live="polite">
        {isProcessing ? (
          <div className="processing-state">
            <span className="spinner" />
            <strong>{processingStep || "Готовим демо-результат…"}</strong>
            <span>Файл обрабатывается только в интерфейсе; OCR не запускается.</span>
          </div>
        ) : !currentStatus ? (
          <div className="result-empty" aria-live="polite">
            <strong>Результат появится здесь</strong>
            <span>Выберите тип документа, загрузите файл и задайте вопрос, чтобы запустить демо-сценарий.</span>
          </div>
        ) : (
          <>
            <div className="answer-title">
              <span className="answer-check">
                {status === "success" ? <Icon name="check" size={29} /> : currentStatus.icon}
              </span>
              <h3>{currentStatus.title}</h3>
            </div>
            <p>{result?.answer ?? currentStatus.answer}</p>
            <details className="source-details">
              <summary className="source-link">
                <span className="source-icon"><Icon name="file" size={21} /></span>
                <span><strong>{result?.sourceTitle ?? "Демонстрационное основание"}</strong><small>{result?.sourceReference ?? "Источник не подключён"}</small></span>
                <span className="source-toggle" aria-hidden="true">+</span>
              </summary>
              <p className="source-excerpt">{result?.sourceExcerpt ?? "Официальные источники не подключены. Результат показан только для демонстрации интерфейса."}</p>
            </details>
          </>
        )}
      </div>
    </article>
  );
}