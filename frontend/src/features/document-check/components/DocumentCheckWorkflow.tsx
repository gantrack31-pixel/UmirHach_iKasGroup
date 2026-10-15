import { useDocumentCheck } from "../hooks/useDocumentCheck";
import { useDocumentTypes } from "../hooks/useDocumentTypes";
import { documentCheckService, documentTypeCatalog } from "../services/documentCheckService";
import { CheckResultPanel } from "./CheckResultPanel";
import { DocumentUploadPanel } from "./DocumentUploadPanel";
import { ExtractedFieldsPanel } from "./ExtractedFieldsPanel";
import { QuestionForm } from "./QuestionForm";

export function DocumentCheckWorkflow() {
  const documentCheck = useDocumentCheck(documentCheckService);
  const documentTypes = useDocumentTypes(documentTypeCatalog);

  return (
    <>
      <section className="workflow" aria-label="Проверка документа">
        <DocumentUploadPanel
          file={documentCheck.file}
          error={documentCheck.uploadError}
          documentType={documentCheck.documentType}
          documentTypeOptions={documentTypes.options}
          documentTypeError={documentCheck.documentTypeError}
          isProcessing={documentCheck.isProcessing}
          onFileAdd={documentCheck.addFile}
          onFileRemove={documentCheck.removeFile}
          onDocumentTypeChange={documentCheck.setDocumentType}
        />
        <ExtractedFieldsPanel
          fields={documentCheck.result?.fields ?? []}
          hasResult={Boolean(documentCheck.result)}
          onManualFieldChange={documentCheck.setManualField}
        />
        <CheckResultPanel
          status={documentCheck.status}
          isProcessing={documentCheck.isProcessing}
          processingStep={documentCheck.processingStep}
          result={documentCheck.result}
        />
      </section>
      <QuestionForm
        question={documentCheck.question}
        isProcessing={documentCheck.isProcessing}
        error={documentCheck.formError}
        onQuestionChange={documentCheck.setQuestion}
        onSubmit={documentCheck.runCheck}
      />
    </>
  );
}
