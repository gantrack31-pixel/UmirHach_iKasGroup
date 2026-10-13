import type { DocumentCheckService } from "../types/service";
import { ApiDocumentCheckService } from "./ApiDocumentCheckService";
import { DemoDocumentCheckService } from "./DemoDocumentCheckService";
import { StaticDocumentTypeCatalog } from "../data/documentTypes";

type RuntimeEnv = {
  VITE_USE_DEMO_SERVICE?: string;
};

const getRuntimeEnv = () => ((import.meta as unknown as { env?: RuntimeEnv }).env ?? {});
const useDemoService = getRuntimeEnv().VITE_USE_DEMO_SERVICE === "true";

export const documentCheckService: DocumentCheckService = useDemoService
  ? new DemoDocumentCheckService()
  : new ApiDocumentCheckService();
export const documentTypeCatalog = new StaticDocumentTypeCatalog();
