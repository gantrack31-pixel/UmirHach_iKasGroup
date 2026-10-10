import { useReducer } from "react";
import { documentCheckReducer } from "../model/documentCheckReducer";
import { initialDocumentCheckState } from "../model/documentCheckState";
import { validateDocumentCheckInput, validateUploadedFile } from "../model/validateDocument";
import type { DocumentType } from "../types/documentCheck";
import type { DocumentCheckService } from "../types/service";

export function useDocumentCheck(service: DocumentCheckService) {
  const [state, dispatch] = useReducer(documentCheckReducer, initialDocumentCheckState);

  const addFile = (file?: File) => {
    if (!file) return;
    const error = validateUploadedFile(file);
    if (error) {
      dispatch({ type: "file/rejected", message: error });
      return;
    }
    dispatch({ type: "file/accepted", file: { file, name: file.name, size: file.size, mimeType: file.type } });
  };

  const runCheck = async () => {
    const validationError = validateDocumentCheckInput(state.file?.file ?? null, state.documentType, state.question);
    if (validationError) {
      dispatch({ type: "validation/failed", ...validationError });
      return;
    }

    const input = {
      file: state.file!.file,
      documentType: state.documentType as DocumentType,
      question: state.question,
    };

    dispatch({ type: "check/started" });
    try {
      const result = await service.analyze(input, (step) => {
        dispatch({ type: "check/stepChanged", step });
      });
      dispatch({ type: "check/succeeded", result });
    } catch {
      dispatch({ type: "check/failed", message: "Не удалось сформировать результат. Попробуйте ещё раз." });
    }
  };

  return {
    ...state,
    status: state.result?.status ?? (state.isProcessing ? "unknown" : null),
    addFile,
    removeFile: () => dispatch({ type: "file/removed" }),
    setQuestion: (question: string) => dispatch({ type: "question/changed", question }),
    setDocumentType: (documentType: DocumentType | "") => dispatch({ type: "documentType/changed", documentType }),
    runCheck,
  };
}