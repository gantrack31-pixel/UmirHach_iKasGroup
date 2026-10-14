import { DocumentCheckerPage } from "./pages/DocumentCheckerPage";
import { HelpPage } from "./pages/HelpPage";

function App() {
  return window.location.pathname === "/help" ? <HelpPage /> : <DocumentCheckerPage />;
}

export default App;
