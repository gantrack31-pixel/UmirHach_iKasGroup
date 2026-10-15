import type { ExtractedField, FieldStatus } from "../../types/documentCheck";
import { Icon } from "../../../../shared/components/Icon";

const statusLabels: Record<FieldStatus, string> = {
  found: "Найдено в демо-результате",
  review: "Требует проверки в демо-результате",
  missing: "Не найдено в демо-результате",
};

export function ExtractedFieldRow({ label, value, status }: ExtractedField) {
  return (
    <div className={`field-row field-${status}`}>
      <strong>{label}</strong>
      <span>{value}</span>
      <span className="field-check" aria-label={statusLabels[status]}>
        {status === "found" ? <Icon name="check" size={14} /> : status === "review" ? "!" : "—"}
      </span>
    </div>
  );
}
