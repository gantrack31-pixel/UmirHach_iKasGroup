import type { DocumentCheckInput, DocumentCheckResult } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";
import { analyzeDocument } from "./api/analyzeDocument.ts";
import { mapAnalyzeResponse } from "./api/mapAnalyzeResponse.ts";
import { parseAnalyzeResponse } from "./api/parseAnalyzeResponse.ts";

export class ApiDocumentCheckService implements DocumentCheckService {
  async analyze(input: DocumentCheckInput, onProgress: (message: string) => void): Promise<DocumentCheckResult> {
    onProgress("Отправляем документ в OCR-сервис...");
    const response = await analyzeDocument(input);

    onProgress("Показываем поля, проверку комплектности и ответ...");
    return mapAnalyzeResponse(parseAnalyzeResponse(await response.json()));
  }
}
