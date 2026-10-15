import { getRuntimeEnv } from "../../../../shared/config/env.ts";
import type { DocumentCheckInput } from "../../types/documentCheck";
import { readApiError } from "./readApiError.ts";

const OCR_API_URL = (getRuntimeEnv().VITE_OCR_API_URL || "/ocr-api").replace(/\/+$/, "");

/** Uploads the original document and checks the HTTP response status. */
export async function analyzeDocument(input: DocumentCheckInput): Promise<Response> {
  const formData = new FormData();
  formData.append("photos", input.file, input.file.name);
  formData.append("prompt", input.question);
  formData.append("document_type", input.documentType);

  const response = await fetch(`${OCR_API_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error(await readApiError(response));
  return response;
}
