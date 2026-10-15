import type { DocumentType, UploadedDocument } from "../types/documentCheck";
import { PanelHeading } from "../../../shared/components/PanelHeading";
import { DocumentTypeSelect } from "./upload/DocumentTypeSelect";
import { FileDropzone } from "./upload/FileDropzone";
import { SelectedFile } from "./upload/SelectedFile";

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
  return (
    <article className="panel upload-panel">
      <PanelHeading step="01" title="Загрузите документ" />
      <DocumentTypeSelect value={documentType} options={documentTypeOptions} error={documentTypeError} disabled={isProcessing} onChange={onDocumentTypeChange} />
      <FileDropzone isProcessing={isProcessing} onFileAdd={onFileAdd} />
      <SelectedFile file={file} isProcessing={isProcessing} onFileRemove={onFileRemove} />
      {error && <p className="inline-error" role="alert">{error}</p>}
    </article>
  );
}
