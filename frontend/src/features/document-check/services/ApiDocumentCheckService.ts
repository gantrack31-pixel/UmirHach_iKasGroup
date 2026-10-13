import type { DocumentCheckInput, DocumentCheckResult, FieldStatus } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";

type OcrAnalyzeResponse = {
  status: string;
  promt?: string;
  photos: number;
  answers: string[];
};

type RuntimeEnv = {
  VITE_OCR_API_URL?: string;
};

const getRuntimeEnv = () => ((import.meta as unknown as { env?: RuntimeEnv }).env ?? {});
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const OCR_API_URL = trimTrailingSlash(getRuntimeEnv().VITE_OCR_API_URL || "/ocr-api");

function isPdf(file: File) {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

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

function mapOcrResponseToDocumentCheckResult(response: OcrAnalyzeResponse): DocumentCheckResult {
  const text = compactText(response.answers ?? []);
  const hasText = Boolean(text);

  return {
    status: hasText ? "warning" : "unknown",
    fields: [
      {
        label: "Распознанный текст",
        value: text || "OCR не нашёл текст на изображении.",
        status: fieldStatusForText(text),
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
    if (isPdf(input.file)) {
      throw new Error("OCR-сервис пока принимает только JPG и PNG. PDF подключим отдельным этапом.");
    }

    onProgress("Отправляем документ в OCR-сервис...");

    const formData = new FormData();
    formData.append("photos", input.file, input.file.name);
    formData.append("prompt", input.question);

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
