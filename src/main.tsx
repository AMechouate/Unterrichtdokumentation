import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

declare global {
  interface Window {
    __DOCUMENTATION_CLASSIC_BUNDLE__?: boolean;
    __DOCUMENTATION_APP_STARTED__?: boolean;
  }
}

const forceClassic = new URLSearchParams(window.location.search).has("kompatibel");

if (
  !window.__DOCUMENTATION_APP_STARTED__ &&
  (!forceClassic || window.__DOCUMENTATION_CLASSIC_BUNDLE__)
) {
  window.__DOCUMENTATION_APP_STARTED__ = true;
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
