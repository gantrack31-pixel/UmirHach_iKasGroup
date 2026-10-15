import { documentTypeLabels } from "../../data/documentTypes.ts";
import type { OcrAnalyzeResponse } from "../../types/api";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

/** Checks the API shape before values are used by the presentation layer. */
export function parseAnalyzeResponse(value: unknown): OcrAnalyzeResponse {
  if (isRecord(value) && typeof value.document_type === "string" &&
      Object.prototype.hasOwnProperty.call(documentTypeLabels, value.document_type) && isRecord(value.fields) &&
      Object.values(value.fields).every((field) => typeof field === "string" || typeof field === "boolean") &&
      (value.ocr_text === undefined || typeof value.ocr_text === "string") &&
      isRecord(value.validation) &&
      ["document_ok", "missing_fields"].includes(String(value.validation.status)) &&
      isStringArray(value.validation.missing_fields) && isStringArray(value.validation.sources) &&
      value.validation.missing_fields.every((key) => Object.prototype.hasOwnProperty.call(value.fields, key)) &&
      isRecord(value.classification)) {
    const { intent, field } = value.classification;
    if ((intent === "field" && typeof field === "string" && Object.prototype.hasOwnProperty.call(value.fields, field)) ||
        (["validation", "decision", "unsupported"].includes(String(intent)) && field === null)) {
      return value as OcrAnalyzeResponse;
    }
  }
  throw new Error("Некорректный ответ сервера. Проверьте, что запущена актуальная версия бэкенда.");
}
