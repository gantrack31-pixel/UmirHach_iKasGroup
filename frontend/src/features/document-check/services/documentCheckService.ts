import type { DocumentCheckService } from "../types/service";
import { DemoDocumentCheckService } from "./DemoDocumentCheckService";
import { StaticDocumentTypeCatalog } from "../data/documentTypes";

export const documentCheckService: DocumentCheckService = new DemoDocumentCheckService();
export const documentTypeCatalog = new StaticDocumentTypeCatalog();