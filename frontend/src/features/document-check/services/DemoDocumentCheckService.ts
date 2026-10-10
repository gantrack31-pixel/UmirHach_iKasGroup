import { demoScenarios } from "../data/demoScenarios";
import type { DocumentCheckInput } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export class DemoDocumentCheckService implements DocumentCheckService {
  async analyze(input: DocumentCheckInput, onProgress: (message: string) => void) {
    onProgress("Подготавливаем демонстрационный сценарий…");
    await wait(450);
    onProgress("Формируем пример результата…");
    await wait(650);

    return demoScenarios[input.documentType];
  }
}