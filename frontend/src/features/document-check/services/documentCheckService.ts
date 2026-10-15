import type { DocumentCheckService } from "../types/service";
import { ApiDocumentCheckService } from "./ApiDocumentCheckService";
import { DemoDocumentCheckService } from "./DemoDocumentCheckService";
import { StaticDocumentTypeCatalog } from "../data/documentTypes";
import { getRuntimeEnv } from "../../../shared/config/env";
const useDemoService = getRuntimeEnv().VITE_USE_DEMO_SERVICE === "true";

export const documentCheckService: DocumentCheckService = useDemoService
  ? new DemoDocumentCheckService()
  : new ApiDocumentCheckService();
export const documentTypeCatalog = new StaticDocumentTypeCatalog();
