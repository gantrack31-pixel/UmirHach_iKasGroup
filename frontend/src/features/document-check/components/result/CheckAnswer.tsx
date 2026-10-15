import { statusContent } from "../../data/statusLabels";
import type { CheckStatus, DocumentCheckResult } from "../../types/documentCheck";
import { Icon } from "../../../../shared/components/Icon";
import { SourceDetails } from "./SourceDetails";

type CheckAnswerProps = {
  status: CheckStatus;
  result: DocumentCheckResult | null;
};

export function CheckAnswer({ status, result }: CheckAnswerProps) {
  const currentStatus = statusContent[status];
  const showCheck = result?.answerable === true || status === "success";
  const indicator = result?.answerable === false ? "?" : showCheck ? <Icon name="check" size={29} /> : currentStatus.icon;

  return (
    <>
      <div className="answer-title">
        <span className="answer-check">{indicator}</span>
        <h3>{result?.answerTitle ?? currentStatus.title}</h3>
      </div>
      <p>{result?.answer ?? currentStatus.answer}</p>
      {result?.validation && (
        <div className="validation-summary">
          <strong>Комплектность документа</strong>
          <p>{result.validation.summary}</p>
          {result.validation.sources.length > 0 && <small>{result.validation.sources.join("; ")}</small>}
        </div>
      )}
      <SourceDetails result={result} />
    </>
  );
}
