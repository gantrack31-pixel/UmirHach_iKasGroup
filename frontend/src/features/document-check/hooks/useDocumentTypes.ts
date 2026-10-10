import { useEffect, useState } from "react";
import type { DocumentType } from "../types/documentCheck";
import type { DocumentTypeCatalog } from "../types/service";

type DocumentTypeOptionsState = {
  options: { value: DocumentType; label: string }[];
  isLoading: boolean;
  error: string;
};

export function useDocumentTypes(catalog: DocumentTypeCatalog): DocumentTypeOptionsState {
  const [state, setState] = useState<DocumentTypeOptionsState>({ options: [], isLoading: true, error: "" });

  useEffect(() => {
    let isMounted = true;
    catalog.list()
      .then((options) => {
        if (isMounted) setState({ options, isLoading: false, error: "" });
      })
      .catch(() => {
        if (isMounted) setState({ options: [], isLoading: false, error: "Не удалось загрузить список типов документов." });
      });

    return () => { isMounted = false; };
  }, [catalog]);

  return state;
}