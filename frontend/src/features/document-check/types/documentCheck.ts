export type CheckStatus = "success" | "warning" | "unknown";
export type DocumentType = "study_certificate" | "academic_leave_application" | "internship_certificate";
export type FieldStatus = "found" | "review" | "missing" | "manual";
export type FieldSource = "ocr" | "manual";

export type UploadedDocument = {
  file: File;
  name: string;
  size: number;
  mimeType: string;
};

export type ExtractedField = {
  id: string;
  label: string;
  value: string;
  status: FieldStatus;
  source?: FieldSource;
};

export type StatusContent = {
  label: string;
  title: string;
  answer: string;
  icon: string;
};

export type DocumentNextAction = {
  fieldId: string;
  title: string;
  description: string;
  sources: string[];
};

export type DocumentCheckResult = {
  status: CheckStatus;
  fields: ExtractedField[];
  answer: string;
  answerTitle?: string;
  answerable?: boolean;
  answerSources?: string[];
  validation?: {
    summary: string;
    sources: string[];
    actions?: DocumentNextAction[];
    needsRecheck?: boolean;
  };
  sourceTitle: string;
  sourceReference: string;
  sourceExcerpt: string;
};

export type DocumentCheckInput = {
  file: File;
  documentType: DocumentType;
  question: string;
  manualFields?: Pick<ExtractedField, "id" | "value">[];
};

export type DocumentCheckState = {
  file: UploadedDocument | null;
  documentType: DocumentType | "";
  question: string;
  result: DocumentCheckResult | null;
  isProcessing: boolean;
  processingStep: string;
  uploadError: string;
  formError: string;
  documentTypeError: string;
};

export type DocumentCheckAction =
  | { type: "file/accepted"; file: UploadedDocument }
  | { type: "file/removed" }
  | { type: "file/rejected"; message: string }
  | { type: "documentType/changed"; documentType: DocumentType | "" }
  | { type: "question/changed"; question: string }
  | { type: "field/manualChanged"; fieldId: string; value: string }
  | { type: "validation/failed"; target: "file" | "documentType" | "question"; message: string }
  | { type: "check/started" }
  | { type: "check/stepChanged"; step: string }
  | { type: "check/succeeded"; result: DocumentCheckResult }
  | { type: "check/failed"; message: string };

export type DocumentCheckViewModel = DocumentCheckState & {
  status: CheckStatus | null;
};
