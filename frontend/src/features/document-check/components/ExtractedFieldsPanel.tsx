import type { ExtractedField } from "../types/documentCheck";
import { Icon } from "../../../shared/components/Icon";

type ExtractedFieldsPanelProps = {
  fields: ExtractedField[];
  hasResult: boolean;
};

export function ExtractedFieldsPanel({ fields, hasResult }: ExtractedFieldsPanelProps) {
  return (
    <article className="panel fields-panel">
      <div className="panel-heading"><span className="step-number">02</span><h2>Что найдено</h2></div>
      {fields.length ? (
        <div className="field-list" aria-live="polite">
          {fields.map(({ label, value, status }) => (
            <div className={`field-row field-${status}`} key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
              <span className="field-check" aria-label={status === "found" ? "Найдено в демо-результате" : status === "review" ? "Требует проверки в демо-результате" : "Не найдено в демо-результате"}>
                {status === "found" ? <Icon name="check" size={14} /> : status === "review" ? "!" : "—"}
              </span>
            </div>
          ))}
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