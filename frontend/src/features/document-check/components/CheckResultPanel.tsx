import type { CheckStatus, DocumentCheckResult } from "../types/documentCheck";
import { PanelHeading } from "../../../shared/components/PanelHeading";
import { CompletenessStatuses } from "./result/CompletenessStatuses";
import { CheckAnswer } from "./result/CheckAnswer";

type CheckResultPanelProps = {
  status: CheckStatus | null;
  isProcessing: boolean;
  processingStep: string;
  result: DocumentCheckResult | null;
};

export function CheckResultPanel({ status, isProcessing, processingStep, result }: CheckResultPanelProps) {
  return (
    <article className="panel result-panel">
      <PanelHeading step="03" title="Результат проверки" />
      {status && !isProcessing && <CompletenessStatuses status={status} />}
      <div className={`answer-card ${status ?? "empty"}${isProcessing ? " is-processing" : ""}`} aria-live="polite">
        {isProcessing ? (
          <div className="processing-state">
            <span className="spinner" />
            <strong>{processingStep || "Обрабатываем документ и вопрос…"}</strong>
          </div>
        ) : !status ? (
          <div className="result-empty" aria-live="polite">
            <strong>Результат появится здесь</strong>
            <span>Выберите тип документа, загрузите файл и задайте вопрос.</span>
          </div>
        ) : (
          <CheckAnswer status={status} result={result} />
        )}
      </div>
    </article>
  );
}
