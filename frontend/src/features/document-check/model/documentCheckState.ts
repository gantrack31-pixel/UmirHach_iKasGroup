import type { DocumentCheckState } from "../types/documentCheck";

export const initialDocumentCheckState: DocumentCheckState = {
  file: null,
  documentType: "",
  question: "",
  result: null,
  isProcessing: false,
  processingStep: "",
  uploadError: "",
  formError: "",
  documentTypeError: "",
};