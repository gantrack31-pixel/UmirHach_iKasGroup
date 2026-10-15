import type { DocumentType } from "../types/documentCheck";
import type { DocumentTypeCatalog } from "../types/service";

export const documentTypeLabels: Record<DocumentType, string> = {
  study_certificate: "Справка об обучении",
  academic_leave_application: "Заявление на академический отпуск",
  internship_certificate: "Справка о практике",
};

export const documentTypeOptions: { value: DocumentType; label: string }[] = [
  { value: "study_certificate", label: documentTypeLabels.study_certificate },
  { value: "academic_leave_application", label: documentTypeLabels.academic_leave_application },
  { value: "internship_certificate", label: documentTypeLabels.internship_certificate },
];

export class StaticDocumentTypeCatalog implements DocumentTypeCatalog {
  async list() {
    return documentTypeOptions;
  }
}
