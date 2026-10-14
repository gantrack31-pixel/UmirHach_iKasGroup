import type { DocumentCheckInput, DocumentCheckResult, DocumentType, FieldStatus } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";

type OcrAnalyzeResponse = {
  status: string;
  ocr_text: string;
  document_type: DocumentType;
  fields: Record<string, string | boolean>;
};

type RuntimeEnv = {
  VITE_OCR_API_URL?: string;
};

const documentTypeLabels: Record<DocumentType, string> = {
  study_certificate: "Справка об обучении",
  academic_leave_application: "Заявление на академический отпуск",
  internship_certificate: "Справка о практике",
};

const fieldLabels: Record<string, string> = {
  student_name: "ФИО студента",
  university: "Название вуза",
  program: "Направление подготовки",
  study_form: "Форма обучения",
  study_start: "Начало периода обучения",
  study_end: "Окончание периода обучения",
  document_number: "Номер справки",
  issue_date: "Дата выдачи",
  group: "Учебная группа",
  course: "Курс",
  leave_reason: "Причина отпуска",
  leave_start: "Дата начала отпуска",
  leave_end: "Дата окончания отпуска",
  application_date: "Дата заявления",
  organization: "Название организации",
  internship_start: "Дата начала практики",
  internship_end: "Дата окончания практики",
  supervisor_name: "ФИО руководителя практики",
  grade: "Оценка",
  signature_present: "Подпись",
  seal_present: "Печать",
};

const getRuntimeEnv = () => ((import.meta as unknown as { env?: RuntimeEnv }).env ?? {});
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const OCR_API_URL = trimTrailingSlash(getRuntimeEnv().VITE_OCR_API_URL || "/ocr-api");

async function readErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: string };
    if (payload.detail) return payload.detail;
  } catch {
    // The backend may return a non-JSON error page if it fails before FastAPI handles it.
  }

  if (response.status === 413) return "Файл слишком большой для OCR-сервиса.";
  if (response.status === 422) return "Проверьте тип документа и формат файла: нужны JPG, PNG или одностраничный PDF.";
  if (response.status === 503) return "OCR временно недоступен. Попробуйте позже.";
  return "Не удалось получить ответ от OCR-сервиса.";
}

function getFieldLabel(key: string) {
  return fieldLabels[key] ?? key.replace(/_/g, " ");
}

function formatFieldValue(value: string | boolean) {
  if (typeof value === "boolean") return value ? "Присутствует" : "Не найдено";
  return value.trim() || "не найдено";
}

function getFieldStatus(value: string | boolean): FieldStatus {
  if (typeof value === "boolean") return value ? "found" : "missing";
  return value.trim().toLowerCase() === "не найдено" ? "missing" : "found";
}

function getResultStatus(response: OcrAnalyzeResponse): DocumentCheckResult["status"] {
  const values = Object.values(response.fields);
  const foundCount = values.filter((value) => getFieldStatus(value) === "found").length;

  if (!response.ocr_text.trim() || values.length === 0 || foundCount === 0) return "unknown";
  if (foundCount === values.length) return "success";
  return "warning";
}

function formatMissingFieldsCount(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} полей требуют`;
  if (lastDigit === 1) return `${count} поле требует`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count} поля требуют`;
  return `${count} полей требуют`;
}

function buildAnswer(response: OcrAnalyzeResponse) {
  const values = Object.values(response.fields);
  const missingCount = values.filter((value) => getFieldStatus(value) === "missing").length;

  if (!response.ocr_text.trim()) {
    return "OCR не нашёл текст в документе. Попробуйте загрузить более чёткое фото или одностраничный PDF.";
  }

  if (missingCount === 0) {
    return "Документ распознан, обязательные поля для выбранного типа найдены.";
  }

  return `Документ распознан, но ${formatMissingFieldsCount(missingCount)} проверки или заполнения.`;
}

function mapOcrResponseToDocumentCheckResult(response: OcrAnalyzeResponse): DocumentCheckResult {
  const ocrText = response.ocr_text.trim();

  return {
    status: getResultStatus(response),
    fields: Object.entries(response.fields).map(([key, value]) => ({
      label: getFieldLabel(key),
      value: formatFieldValue(value),
      status: getFieldStatus(value),
    })),
    answer: buildAnswer(response),
    sourceTitle: "OCR-сервис",
    sourceReference: `${documentTypeLabels[response.document_type]} · структурированное распознавание`,
    sourceExcerpt: ocrText || "Нет распознанного текста.",
  };
}

export class ApiDocumentCheckService implements DocumentCheckService {
  async analyze(input: DocumentCheckInput, onProgress: (message: string) => void): Promise<DocumentCheckResult> {
    onProgress("Отправляем документ в OCR-сервис...");

    const formData = new FormData();
    formData.append("photos", input.file, input.file.name);
    formData.append("prompt", input.question);
    formData.append("document_type", input.documentType);

    const response = await fetch(`${OCR_API_URL}/analyze`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await readErrorMessage(response));
    }

    onProgress("Преобразуем результат распознавания...");

    const payload = (await response.json()) as OcrAnalyzeResponse;
    return mapOcrResponseToDocumentCheckResult(payload);
  }
}
