import type { DocumentType } from "../types/documentCheck";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_QUESTION_LENGTH = 2000;
const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  pdf: ["application/pdf"],
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
};

export type ValidationError = { target: "file" | "documentType" | "question"; message: string };

export function validateUploadedFile(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowedMimeTypes = ALLOWED_FILE_TYPES[extension];

  if (!allowedMimeTypes || (file.type && !allowedMimeTypes.includes(file.type.toLowerCase()))) {
    return "Поддерживаются только файлы PDF, JPG и PNG.";
  }
  if (file.size === 0) return "Файл пустой. Выберите документ с данными.";
  if (file.size > MAX_FILE_SIZE) return "Размер файла не должен превышать 10 МБ.";

  return null;
}

export function validateDocumentCheckInput(file: File | null, documentType: DocumentType | "", question: string): ValidationError | null {
  if (!file) return { target: "file", message: "Сначала загрузите документ." };
  if (!documentType) return { target: "documentType", message: "Выберите тип документа." };
  if (!question.trim()) return { target: "question", message: "Напишите вопрос, чтобы запустить демонстрационную проверку." };
  if (question.length > MAX_QUESTION_LENGTH) return { target: "question", message: `Вопрос не должен превышать ${MAX_QUESTION_LENGTH} символов.` };
  return null;
}
