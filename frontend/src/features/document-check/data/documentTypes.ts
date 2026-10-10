import type { DocumentType } from "../types/documentCheck";
import type { DocumentTypeCatalog } from "../types/service";

export const documentTypeOptions: { value: DocumentType; label: string }[] = [
  { value: "study_certificate", label: "Справка об обучении" },
  { value: "application", label: "Заявление" },
  { value: "internship_certificate", label: "Справка о практике" },
  { value: "other", label: "Другой документ" },
];

export class StaticDocumentTypeCatalog implements DocumentTypeCatalog {
  async list() {
    return documentTypeOptions;
  }
}