import type { FastApiErrorDetail } from "../../types/api";

/** Reads FastAPI detail or supplies a fallback for gateway responses. */
export async function readApiError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: FastApiErrorDetail };
    if (typeof payload.detail === "string") return payload.detail;
    if (Array.isArray(payload.detail) && payload.detail.length > 0) {
      const firstError = payload.detail[0];
      const fieldName = firstError.loc?.slice(1).join(".") || "поле формы";
      return firstError.msg ? `${fieldName}: ${firstError.msg}` : "Проверьте данные формы и попробуйте ещё раз.";
    }
  } catch {
    // A proxy may return a non-JSON error page before FastAPI handles the request.
  }

  if (response.status === 413) return "Файл слишком большой для OCR-сервиса.";
  if (response.status === 422) return "Проверьте тип документа и формат файла: нужны JPG, PNG или одностраничный PDF.";
  if (response.status === 503) return "Сервис распознавания или классификатор вопросов временно недоступен. Попробуйте позже.";
  if (response.status === 504) return "Превышено время обработки вопроса. Попробуйте ещё раз.";
  return "Не удалось получить ответ от OCR-сервиса.";
}
