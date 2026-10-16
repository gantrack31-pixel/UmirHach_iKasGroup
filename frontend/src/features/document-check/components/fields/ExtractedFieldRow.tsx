import type { ExtractedField, FieldStatus } from "../../types/documentCheck";
import { Icon } from "../../../../shared/components/Icon";

const statusLabels: Record<FieldStatus, string> = {
  found: "Распознано",
  review: "Требует проверки",
  missing: "Не распознано",
  manual: "Введено вручную",
};

type ExtractedFieldRowProps = ExtractedField & {
  onManualFieldChange?: (fieldId: string, value: string) => void;
};

export function ExtractedFieldRow({ id, label, value, status, source, onManualFieldChange }: ExtractedFieldRowProps) {
  const canEdit = status === "missing" || status === "review" || status === "manual";
  const inputValue = status === "missing" && source !== "manual" ? "" : value;

  return (
    <div className={`field-row field-${status}`}>
      <strong>{label}</strong>
      <span className="field-value">
        {canEdit ? (
          <>
            <input
              value={inputValue}
              placeholder="Введите значение вручную"
              aria-label={`Уточнить поле: ${label}`}
              onChange={(event) => onManualFieldChange?.(id, event.target.value)}
            />
            <small>{statusLabels[status]}</small>
          </>
        ) : (
          <>
            {value}
            {source === "ocr" && <small>Распознано OCR</small>}
          </>
        )}
      </span>
      <span className="field-check" aria-label={statusLabels[status]}>
        {status === "found" || status === "manual" ? <Icon name="check" size={14} /> : status === "review" ? "!" : "—"}
      </span>
    </div>
  );
}
