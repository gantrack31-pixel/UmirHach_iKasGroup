import type { DocumentType } from "../types/documentCheck";
import type { DocumentTypeCatalog } from "../types/service";

export const documentTypeOptions: { value: DocumentType; label: string }[] = [
  { value: "study_certificate", label: "Справка об обучении" },
  { value: "academic_leave_application", label: "Заявление на академический отпуск" },
  { value: "internship_certificate", label: "Справка о практике" },
];

export class StaticDocumentTypeCatalog implements DocumentTypeCatalog {
  async list() {
    return documentTypeOptions;
  }
}
