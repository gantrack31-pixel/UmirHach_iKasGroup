import { documentTypeLabels } from "../../data/documentTypes.ts";
import { buildDocumentAnswer } from "../../model/buildDocumentAnswer.ts";
import { buildDocumentActions } from "../../model/buildDocumentActions.ts";
import { formatFieldValue, formatSource, getFieldLabel, getFieldStatus, validationSummary } from "../../model/documentPresentation.ts";
import type { OcrAnalyzeResponse } from "../../types/api";
import type { DocumentCheckResult } from "../../types/documentCheck";

/** Keeps backend DTOs out of the components' view model. */
export function mapAnalyzeResponse(response: OcrAnalyzeResponse): DocumentCheckResult {
  const ocrText = response.ocr_text?.trim() ?? "";
  const answer = buildDocumentAnswer(response);
  const manualFields = new Set(response.manual_fields ?? []);

  return {
    status: response.validation.status === "document_ok" ? "success" : "warning",
    fields: Object.entries(response.fields).map(([key, value]) => {
      const isManual = manualFields.has(key);
      return {
        id: key,
        label: getFieldLabel(key),
        value: formatFieldValue(value),
        status: isManual ? "manual" : getFieldStatus(value),
        source: isManual ? "manual" : getFieldStatus(value) === "found" ? "ocr" : undefined,
      };
    }),
    ...answer,
    validation: {
      summary: validationSummary(response.validation),
      sources: response.validation.sources,
      actions: buildDocumentActions(response.document_type, response.validation),
    },
    sourceTitle: "Источники и распознанный текст",
    sourceReference: [documentTypeLabels[response.document_type], ...answer.answerSources.map(formatSource)].join(" · "),
    sourceExcerpt: ocrText || "Нет распознанного текста.",
  };
}
