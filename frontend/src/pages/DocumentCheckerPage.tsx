import { CheckResultPanel, DocumentUploadPanel, ExtractedFieldsPanel, QuestionForm, useDocumentCheck, useDocumentTypes } from "../features/document-check";
import { documentCheckService, documentTypeCatalog } from "../features/document-check/services/documentCheckService";
import { HeroSection, SiteFooter } from "../shared";

export function DocumentCheckerPage() {
  const documentCheck = useDocumentCheck(documentCheckService);
  const documentTypes = useDocumentTypes(documentTypeCatalog);

  return (
    <div className="app-shell">
      <main id="top" className="page-content">
        <HeroSection />
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
          <ExtractedFieldsPanel fields={documentCheck.result?.fields ?? []} hasResult={Boolean(documentCheck.result)} />
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
        <SiteFooter />
      </main>
    </div>
  );
}
