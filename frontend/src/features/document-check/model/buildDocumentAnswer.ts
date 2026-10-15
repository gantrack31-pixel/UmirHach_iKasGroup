import type { OcrAnalyzeResponse } from "../types/api";
import type { DocumentCheckResult } from "../types/documentCheck";
import { getFieldLabel, getFieldStatus, validationSummary } from "./documentPresentation.ts";

type DocumentAnswer = Required<Pick<DocumentCheckResult, "answer" | "answerTitle" | "answerable" | "answerSources">>;

/** Formats the backend classification; it does not run a model or validate rules. */
export function buildDocumentAnswer(response: OcrAnalyzeResponse): DocumentAnswer {
  const classification = response.classification;
  switch (classification.intent) {
    case "field": {
      const value = response.fields[classification.field];
      const label = getFieldLabel(classification.field);
      if (typeof value === "string" && getFieldStatus(value) === "missing") {
        return {
          answer: `${label}: не найдено. В документе нет читаемого значения этого поля.`,
          answerTitle: "Сведения не найдены", answerable: false, answerSources: [],
        };
      }
      return {
        answer: `${label}: ${typeof value === "boolean" ? (value ? "присутствует" : "отсутствует") : value.trim()}.`,
        answerTitle: "Ответ на ваш вопрос", answerable: true,
        answerSources: [`field:${classification.field}`],
      };
    }
    case "validation":
      return {
        answer: `${validationSummary(response.validation)} Окончательное решение примет сотрудник деканата.`,
        answerTitle: "Предварительная проверка", answerable: true,
        answerSources: response.validation.sources,
      };
    case "decision":
      return {
        answer: "Окончательное решение о принятии документа принимает сотрудник деканата.",
        answerTitle: "Ответ на ваш вопрос", answerable: true, answerSources: ["rule:1.3"],
      };
    case "unsupported":
      return {
        answer: "В документе и в Положении нет информации для ответа на этот вопрос. Обратитесь в деканат. Если вопрос касается нескольких полей, задайте его об одном поле.",
        answerTitle: "Нет ответа на этот вопрос", answerable: false, answerSources: [],
      };
  }
}
