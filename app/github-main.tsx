import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DocumentationWorkspace } from "./DocumentationWorkspace";
import "./globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Der Anwendungsbereich konnte nicht gefunden werden.");
}

createRoot(root).render(
  <StrictMode>
    <DocumentationWorkspace />
  </StrictMode>,
);
