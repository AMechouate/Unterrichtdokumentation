import type { Metadata } from "next";
import { DocumentationWorkspace } from "./DocumentationWorkspace";

export const metadata: Metadata = {
  title: { absolute: "Tertia Unterrichtsdokumentation" },
  description:
    "Tagesberichte für Unterricht, Lernfelder, ILIAS-Aufgaben und Teilnehmerbeobachtungen.",
};

export default function Home() {
  return <DocumentationWorkspace />;
}
