import type { ExtractedField } from "../types/documentCheck";
import { PanelHeading } from "../../../shared/components/PanelHeading";
import { ExtractedFieldRow } from "./fields/ExtractedFieldRow";

type ExtractedFieldsPanelProps = {
  fields: ExtractedField[];
  hasResult: boolean;
  onManualFieldChange?: (fieldId: string, value: string) => void;
};

export function ExtractedFieldsPanel({ fields, hasResult, onManualFieldChange }: ExtractedFieldsPanelProps) {
  return (
    <article className="panel fields-panel">
      <PanelHeading step="02" title="Что найдено" />
      {fields.length ? (
        <div className="field-list" aria-live="polite">
          {fields.map((field) => (
            <ExtractedFieldRow key={field.id} {...field} onManualFieldChange={onManualFieldChange} />
          ))}
        </div>
      ) : (
        <div className="fields-empty" aria-live="polite">
          <strong>{hasResult ? "Нет данных для отображения" : "Пока ничего не распознано"}</strong>
          <span>{hasResult ? "Для выбранного сценария нет примеров полей." : "Выберите тип документа, загрузите файл и запустите демо-проверку."}</span>
        </div>
      )}
      <p className="fields-note"><span className="note-dot" /> Поля из результата проверки документа</p>
    </article>
  );
}
