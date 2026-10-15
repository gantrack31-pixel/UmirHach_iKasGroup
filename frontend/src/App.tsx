import { DocumentCheckerPage } from "./pages/DocumentCheckerPage";
import { HelpPage } from "./pages/HelpPage";
import { RegulationPage } from "./pages/RegulationPage";

function App() {
  if (window.location.pathname === "/help") return <HelpPage />;
  if (window.location.pathname === "/rules") return <RegulationPage />;
  return <DocumentCheckerPage />;
}

export default App;
