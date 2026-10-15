import { fieldLabels } from "../data/fieldLabels.ts";
import type { DocumentValidation } from "../types/api";
import type { FieldStatus } from "../types/documentCheck";

export function getFieldLabel(key: string): string {
  return fieldLabels[key] ?? key.replace(/_/g, " ");
}

export function formatFieldValue(value: string | boolean): string {
  if (typeof value === "boolean") return value ? "Присутствует" : "Не найдено";
  return value.trim() || "не найдено";
}

export function getFieldStatus(value: string | boolean): FieldStatus {
  if (typeof value === "boolean") return value ? "found" : "missing";
  return !value.trim() || value.trim().toLowerCase() === "не найдено" ? "missing" : "found";
}

export function validationSummary(validation: DocumentValidation): string {
  if (validation.status === "document_ok") return "Документ содержит все обязательные сведения.";
  return `Не найдены обязательные сведения: ${validation.missing_fields.map(getFieldLabel).join(", ")}.`;
}

export function formatSource(source: string): string {
  if (source.startsWith("field:")) return `Поле «${getFieldLabel(source.slice(6))}»`;
  if (source.startsWith("rule:")) return `Положение, п. ${source.slice(5)}`;
  return source;
}
