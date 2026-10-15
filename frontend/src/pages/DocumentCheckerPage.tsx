import { DocumentCheckWorkflow } from "../features/document-check";
import { HeroSection, SiteFooter } from "../shared";

export function DocumentCheckerPage() {
  return (
    <div className="app-shell">
      <main id="top" className="page-content">
        <HeroSection />
        <DocumentCheckWorkflow />
        <SiteFooter />
      </main>
    </div>
  );
}
