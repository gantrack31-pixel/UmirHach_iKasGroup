import type { DocumentCheckAction, DocumentCheckState, ExtractedField } from "../types/documentCheck";

function getStatusAfterManualCorrection(state: DocumentCheckState) {
  const fields = state.result?.fields ?? [];
  if (!fields.length) return state.result?.status ?? "unknown";

  const filledCount = fields.filter((field) => field.status === "found" || field.status === "manual").length;
  if (filledCount === fields.length) return "success";
  if (filledCount === 0) return "unknown";
  return "warning";
}

export function documentCheckReducer(state: DocumentCheckState, action: DocumentCheckAction): DocumentCheckState {
  switch (action.type) {
    case "file/accepted":
      return { ...state, file: action.file, result: null, uploadError: "", formError: "", documentTypeError: "" };
    case "file/removed":
      return { ...state, file: null, result: null, uploadError: "", formError: "", documentTypeError: "" };
    case "file/rejected":
      return { ...state, uploadError: action.message };
    case "documentType/changed":
      return { ...state, documentType: action.documentType, result: null, formError: "", documentTypeError: "" };
    case "question/changed":
      return { ...state, question: action.question, result: null, formError: "" };
    case "field/manualChanged": {
      if (!state.result) return state;

      const fields: ExtractedField[] = state.result.fields.map((field) => {
        if (field.id !== action.fieldId) return field;

        const value = action.value.trim();
        return {
          ...field,
          value,
          status: value ? "manual" : "missing",
          source: value ? "manual" : undefined,
        };
      });
      const nextState = { ...state, result: { ...state.result, fields } };

      return {
        ...nextState,
        result: {
          ...nextState.result,
          status: getStatusAfterManualCorrection(nextState),
        },
      };
    }
    case "validation/failed":
      return {
        ...state,
        uploadError: action.target === "file" ? action.message : "",
        documentTypeError: action.target === "documentType" ? action.message : "",
        formError: action.target === "question" ? action.message : "",
      };
    case "check/started":
      return { ...state, isProcessing: true, result: null, processingStep: "Подготавливаем проверку…", uploadError: "", formError: "", documentTypeError: "" };
    case "check/stepChanged":
      return { ...state, processingStep: action.step };
    case "check/succeeded":
      return { ...state, isProcessing: false, processingStep: "", result: action.result };
    case "check/failed":
      return { ...state, isProcessing: false, processingStep: "", formError: action.message };
    default: {
      action satisfies never;
      return state;
    }
  }
}
