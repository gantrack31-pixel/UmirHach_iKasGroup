import { useRef, useState } from "react";
import type { DocumentType, UploadedDocument } from "../types/documentCheck";
import { formatSize } from "../../../shared/utils/formatSize";
import { Icon } from "../../../shared/components/Icon";

type DocumentUploadPanelProps = {
  file: UploadedDocument | null;
  error: string;
  documentType: DocumentType | "";
  documentTypeOptions: { value: DocumentType; label: string }[];
  documentTypeError: string;
  isProcessing: boolean;
  onFileAdd: (file?: File) => void;
  onFileRemove: () => void;
  onDocumentTypeChange: (documentType: DocumentType | "") => void;
};

export function DocumentUploadPanel({ file, error, documentType, documentTypeOptions, documentTypeError, isProcessing, onFileAdd, onFileRemove, onDocumentTypeChange }: DocumentUploadPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <article className="panel upload-panel">
      <div className="panel-heading"><span className="step-number">01</span><h2>Загрузите документ</h2></div>
      <label className="document-type-field" htmlFor="document-type">
        <span>Тип документа</span>
        <select
          id="document-type"
          value={documentType}
          disabled={isProcessing}
          aria-invalid={Boolean(documentTypeError)}
          aria-describedby={documentTypeError ? "document-type-error" : undefined}
          onChange={(event) => onDocumentTypeChange(event.target.value as DocumentType | "")}
        >
          <option value="">Выберите тип документа</option>
          {documentTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      {documentTypeError && <p id="document-type-error" className="inline-error" role="alert">{documentTypeError}</p>}
      <div
        className={`dropzone${isDragging ? " is-dragging" : ""}`}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => { event.preventDefault(); setIsDragging(false); onFileAdd(event.dataTransfer.files[0]); }}
      >
        <span className="upload-symbol"><Icon name="upload" size={30} /></span>
        <strong>Перетащите файл сюда</strong>
        <span className="drop-hint">или выберите на компьютере</span>
        <span className="format-hint">PDF, JPG, PNG <i>·</i> до 10 МБ</span>
        <button className="button button-primary upload-button" type="button" disabled={isProcessing} onClick={() => fileInput.current?.click()}>
          <Icon name="folder" size={19} /> Выбрать файл
        </button>
        <input
          ref={fileInput}
          className="visually-hidden"
          type="file"
          disabled={isProcessing}
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={(event) => {
            onFileAdd(event.target.files?.[0]);
            event.currentTarget.value = "";
          }}
        />
      </div>

      {file ? (
        <div className="file-card">
          <span className="file-icon"><Icon name="file" size={22} /></span>
          <div className="file-details">
            <strong title={file.name}>{file.name}</strong>
            <span>{file.name.split(".").pop()?.toUpperCase()} <i>·</i> {formatSize(file.size)}</span>
          </div>
          <span className="file-check" aria-label="Файл загружен"><Icon name="check" size={16} /></span>
          <button className="icon-button remove-file" type="button" disabled={isProcessing} aria-label="Удалить файл" onClick={onFileRemove}>
            <Icon name="close" size={19} />
          </button>
        </div>
      ) : (
        <div className="empty-file"><span>Файл ещё не выбран</span><span>Загрузите документ, чтобы начать проверку</span></div>
      )}

      {error && <p className="inline-error" role="alert">{error}</p>}
    </article>
  );
}