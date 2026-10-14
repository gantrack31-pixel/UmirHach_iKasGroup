import type { DocumentCheckInput, DocumentCheckResult, DocumentType, ExtractedField, FieldStatus } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";

type LegacyOcrAnalyzeResponse = {
  status: string;
  promt?: string;
  photos: number;
  answers: string[];
};

type CurrentAnalyzeResponse = {
  status: string;
  ocr_text: string;
  document_type: string;
  fields: Record<string, string | boolean>;
};

type OcrAnalyzeResponse = LegacyOcrAnalyzeResponse | CurrentAnalyzeResponse;

type RuntimeEnv = {
  VITE_OCR_API_URL?: string;
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
  if (response.status === 422) return "OCR-сервис принимает только корректные JPG или PNG.";
  if (response.status === 503) return "OCR временно недоступен. Попробуйте позже.";
  return "Не удалось получить ответ от OCR-сервиса.";
}

function compactText(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean).join("\n\n");
}

function fieldStatusForText(text: string): FieldStatus {
  return text ? "review" : "missing";
}

const backendDocumentTypes: Record<Exclude<DocumentType, "other">, string> = {
  study_certificate: "study_certificate",
  application: "academic_leave_application",
  internship_certificate: "internship_certificate",
};

const fieldLabels: Record<string, string> = {
  student_name: "ФИО студента",
  university: "Название вуза",
  program: "Направление подготовки",
  study_form: "Форма обучения",
  study_start: "Начало обучения",
  study_end: "Окончание обучения",
  document_number: "Номер документа",
  issue_date: "Дата выдачи",
  group: "Учебная группа",
  course: "Курс",
  leave_reason: "Причина отпуска",
  leave_start: "Начало отпуска",
  leave_end: "Окончание отпуска",
  application_date: "Дата заявления",
  organization: "Организация",
  internship_start: "Начало практики",
  internship_end: "Окончание практики",
  supervisor_name: "Руководитель практики",
  grade: "Оценка",
  signature_present: "Подпись",
  seal_present: "Печать",
};

function getBackendDocumentType(documentType: DocumentType) {
  if (documentType === "other") {
    throw new Error("OCR-сервис пока поддерживает справку об обучении, заявление и справку о практике.");
  }

  return backendDocumentTypes[documentType];
}

function formatFieldValue(value: string | boolean) {
  if (typeof value === "boolean") return value ? "Есть" : "";
  return value === "не найдено" ? "" : value;
}

function getFieldStatus(value: string | boolean): FieldStatus {
  if (typeof value === "boolean") return value ? "found" : "missing";
  return value && value !== "не найдено" ? "found" : "missing";
}

function mapFields(fields: Record<string, string | boolean>): ExtractedField[] {
  return Object.entries(fields).map(([id, value]) => ({
    id,
    label: fieldLabels[id] ?? id,
    value: formatFieldValue(value),
    status: getFieldStatus(value),
    source: getFieldStatus(value) === "found" ? "ocr" : undefined,
  }));
}

function isCurrentAnalyzeResponse(response: OcrAnalyzeResponse): response is CurrentAnalyzeResponse {
  return "ocr_text" in response && "fields" in response;
}

function mapOcrResponseToDocumentCheckResult(response: OcrAnalyzeResponse): DocumentCheckResult {
  if (isCurrentAnalyzeResponse(response)) {
    const text = response.ocr_text.trim();
    const fields = mapFields(response.fields ?? {});
    const foundCount = fields.filter((field) => field.status === "found").length;

    return {
      status: foundCount === fields.length && fields.length ? "success" : foundCount ? "warning" : "unknown",
      fields,
      answer: text
        ? "Документ распознан. Заполните нераспознанные поля вручную, если они есть на документе."
        : "OCR не нашёл текст на изображении. Попробуйте загрузить более чёткое фото документа.",
      sourceTitle: "OCR-сервис",
      sourceReference: `EasyOCR backend · ${response.document_type}`,
      sourceExcerpt: text || "Нет распознанного текста.",
    };
  }

  const text = compactText(response.answers ?? []);
  const hasText = Boolean(text);

  return {
    status: hasText ? "warning" : "unknown",
    fields: [
      {
        id: "recognized_text",
        label: "Распознанный текст",
        value: text || "OCR не нашёл текст на изображении.",
        status: fieldStatusForText(text),
        source: text ? "ocr" : undefined,
      },
    ],
    answer: hasText
      ? "Документ распознан. Проверка по правилам университета пока не подключена."
      : "OCR не нашёл текст на изображении. Попробуйте загрузить более чёткое фото документа.",
    sourceTitle: "OCR-сервис",
    sourceReference: `EasyOCR backend · ${response.photos} фото`,
    sourceExcerpt: text || "Нет распознанного текста.",
  };
}

export class ApiDocumentCheckService implements DocumentCheckService {
  async analyze(input: DocumentCheckInput, onProgress: (message: string) => void): Promise<DocumentCheckResult> {
    onProgress("Отправляем документ в OCR-сервис...");

    const formData = new FormData();
    formData.append("photos", input.file, input.file.name);
    formData.append("prompt", input.question);
    formData.append("document_type", getBackendDocumentType(input.documentType));

    if (input.manualFields?.length) {
      formData.append("manual_fields", JSON.stringify(input.manualFields));
    }

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
