import type { DocumentType } from "./documentCheck";

export type DocumentValidation = {
  status: "document_ok" | "missing_fields";
  missing_fields: string[];
  sources: string[];
};

export type QuestionClassification =
  | { intent: "field"; field: string }
  | { intent: "validation" | "decision" | "unsupported"; field: null };

export type OcrAnalyzeResponse = {
  ocr_text?: string;
  document_type: DocumentType;
  fields: Record<string, string | boolean>;
  validation: DocumentValidation;
  classification: QuestionClassification;
  manual_fields?: string[];
};

export type FastApiErrorDetail = string | { msg?: string; loc?: Array<string | number> }[];
