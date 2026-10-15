import { HelpDocumentExample, HelpHeader, HelpSteps, HelpTips } from "../features/help";

export function HelpPage() {
  return (
    <main className="help-page">
      <HelpHeader />
      <HelpDocumentExample />
      <HelpSteps />
      <HelpTips />
    </main>
  );
}
