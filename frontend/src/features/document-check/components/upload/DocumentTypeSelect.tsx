import type { DocumentType } from "../../types/documentCheck";

type DocumentTypeSelectProps = {
  value: DocumentType | "";
  options: { value: DocumentType; label: string }[];
  error: string;
  disabled: boolean;
  onChange: (documentType: DocumentType | "") => void;
};

export function DocumentTypeSelect({ value, options, error, disabled, onChange }: DocumentTypeSelectProps) {
  return (
    <>
      <label className="document-type-field" htmlFor="document-type">
        <span>Тип документа</span>
        <select
          id="document-type"
          name="document-type"
          value={value}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "document-type-error" : undefined}
          onChange={(event) => onChange(event.target.value as DocumentType | "")}
        >
          <option value="">Выберите тип документа</option>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {error && <p id="document-type-error" className="inline-error" role="alert">{error}</p>}
    </>
  );
}
