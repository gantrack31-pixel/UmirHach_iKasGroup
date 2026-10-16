import type { DocumentValidation } from "../types/api";
import type { DocumentNextAction, DocumentType } from "../types/documentCheck";
import { getFieldLabel } from "./documentPresentation.ts";

const guidance: Record<DocumentType, { section: string; signature: string; seal?: string; missingText: string }> = {
  study_certificate: {
    section: "3",
    signature: "уполномоченного сотрудника вуза",
    seal: "вуза",
    missingText: "Если поле пустое, обратитесь в выдавший справку вуз для его заполнения или получения исправленной справки.",
  },
  academic_leave_application: {
    section: "4",
    signature: "студента",
    missingText: "Если поле пустое, заполните его в заявлении перед подачей.",
  },
  internship_certificate: {
    section: "5",
    signature: "руководителя практики",
    seal: "организации",
    missingText: "Если поле пустое, обратитесь в выдавшую справку организацию для его заполнения или получения исправленной справки.",
  },
};

/** Explains backend-reported omissions without changing the validation result. */
export function buildDocumentActions(documentType: DocumentType, validation: DocumentValidation): DocumentNextAction[] {
  if (validation.status === "document_ok") return [];
  const document = guidance[documentType];

  return [...new Set(validation.missing_fields)].map((fieldId) => {
    const title = getFieldLabel(fieldId);
    let requirement = "1";
    let description = `Проверьте поле «${title}» в оригинале. Если оно заполнено, загрузите более чёткий снимок. ${document.missingText}`;

    if (fieldId === "signature_present") {
      requirement = "2";
      description = `Проверьте наличие подписи ${document.signature} в оригинале. Если подпись есть, загрузите чёткий снимок этой страницы целиком. Если её нет, подпишите заявление.`;
      if (documentType !== "academic_leave_application") {
        description = `Проверьте наличие подписи ${document.signature} в оригинале. Если подпись есть, загрузите чёткий снимок этой страницы целиком. Если её нет, обратитесь к ${documentType === "study_certificate" ? "уполномоченному сотруднику вуза" : "руководителю практики"} за подписью.`;
      }
    } else if (fieldId === "seal_present" && document.seal) {
      requirement = "3";
      description = `Проверьте наличие печати ${document.seal} в оригинале. Если печать есть, загрузите чёткий снимок этой страницы целиком. Если её нет, обратитесь в ${documentType === "study_certificate" ? "выдавший справку вуз" : "выдавшую справку организацию"} за печатью.`;
    }

    const source = `rule:${document.section}.${requirement}`;
    return { fieldId, title, description, sources: validation.sources.filter((item) => item === source) };
  });
}
