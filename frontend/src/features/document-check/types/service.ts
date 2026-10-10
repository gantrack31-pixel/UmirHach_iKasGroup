import type { DocumentCheckInput, DocumentCheckResult, DocumentType } from "./documentCheck";

export interface DocumentCheckService {
  analyze(input: DocumentCheckInput, onProgress: (message: string) => void): Promise<DocumentCheckResult>;
}

export interface DocumentTypeCatalog {
  list(): Promise<{ value: DocumentType; label: string }[]>;
}