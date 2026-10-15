import type { DocumentCheckInput, DocumentCheckResult } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";
import { analyzeDocument } from "./api/analyzeDocument.ts";
import { mapAnalyzeResponse } from "./api/mapAnalyzeResponse.ts";
import { parseAnalyzeResponse } from "./api/parseAnalyzeResponse.ts";

export class ApiDocumentCheckService implements DocumentCheckService {
  async analyze(input: DocumentCheckInput, onProgress: (message: string) => void): Promise<DocumentCheckResult> {
    onProgress("Отправляем документ и ручные уточнения в сервис...");
    const response = await analyzeDocument(input);
    onProgress("Проверяем ответ сервиса...");
    return mapAnalyzeResponse(parseAnalyzeResponse(await response.json()));
  }
}
