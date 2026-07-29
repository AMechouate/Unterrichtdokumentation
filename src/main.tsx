import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

declare global {
  interface Window {
    __DOCUMENTATION_APP_STARTED__?: boolean;
  }
}

if (!window.__DOCUMENTATION_APP_STARTED__) {
  window.__DOCUMENTATION_APP_STARTED__ = true;
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
