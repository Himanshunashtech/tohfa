import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { registerSW } from "virtual:pwa-register";

// Register the service worker for PWA functionality
if (import.meta.env.PROD) {
  registerSW({
    onNeedRefresh() {
      if (confirm("New content available. Reload?")) {
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log("App prepared for offline use.");
    },
  });
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
