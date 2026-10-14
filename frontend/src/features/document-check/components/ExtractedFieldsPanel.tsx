import type { ExtractedField } from "../types/documentCheck";
import { Icon } from "../../../shared/components/Icon";

type ExtractedFieldsPanelProps = {
  fields: ExtractedField[];
  hasResult: boolean;
  onManualFieldChange?: (fieldId: string, value: string) => void;
};

function getFieldStatusLabel(status: ExtractedField["status"]) {
  if (status === "found") return "Найдено";
  if (status === "manual") return "Введено вручную";
  if (status === "review") return "Требует проверки";
  return "Не распознано";
}

export function ExtractedFieldsPanel({ fields, hasResult, onManualFieldChange }: ExtractedFieldsPanelProps) {
  return (
    <article className="panel fields-panel">
      <div className="panel-heading"><span className="step-number">02</span><h2>Что найдено</h2></div>
      {fields.length ? (
        <div className="field-list" aria-live="polite">
          {fields.map(({ id, label, value, status, source }) => {
            const canEdit = status === "missing" || status === "review" || status === "manual";
            const manualValue = status === "missing" && source !== "manual" ? "" : value;

            return (
              <div className={`field-row field-${status}`} key={id}>
                <strong>{label}</strong>
                <span className="field-value">
                  {canEdit ? (
                    <>
                      <input
                        value={manualValue}
                        placeholder="Введите значение вручную"
                        aria-label={`Уточнить поле: ${label}`}
                        onChange={(event) => onManualFieldChange?.(id, event.target.value)}
                      />
                      <small>{getFieldStatusLabel(status)}</small>
                    </>
                  ) : (
                    <>
                      {value}
                      {source === "ocr" && <small>Распознано OCR</small>}
                    </>
                  )}
                </span>
                <span className="field-check" aria-label={getFieldStatusLabel(status)}>
                  {status === "found" || status === "manual" ? <Icon name="check" size={14} /> : status === "review" ? "!" : "—"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="fields-empty" aria-live="polite">
          <strong>{hasResult ? "Нет данных для отображения" : "Пока ничего не распознано"}</strong>
          <span>{hasResult ? "Для выбранного сценария нет примеров полей." : "Выберите тип документа, загрузите файл и запустите демо-проверку."}</span>
        </div>
      )}
      <p className="fields-note"><span className="note-dot" /> Данные примера, не распознавание файла</p>
    </article>
  );
}
