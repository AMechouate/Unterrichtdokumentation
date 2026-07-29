# Tertia Unterrichtsdokumentation

Ein webbasierter React-Prototyp für die tägliche Unterrichtsdokumentation. Dozentinnen und Dozenten erfassen Unterrichtsinhalte, Lernfeld, ILIAS-Aufgaben, Besonderheiten und die Teilnahmebewertung der Kursgruppe in einer gemeinsamen Ansicht. Aus den Eingaben entsteht eine fertige E-Mail-Zusammenfassung für Bernhard.

## Was der Prototyp bereits kann

- Tagesbericht mit Datum, Kurs und Dozent/in erfassen
- Lernfeld und ausführliche Unterrichtsdokumentation eintragen
- Aufgaben für die Selbstlernphase in ILIAS beschreiben
- Besonderheiten dokumentieren
- alle Teilnehmenden über einheitliche Auswahlwerte bewerten
- Vollständigkeit des Berichts live anzeigen
- Eingaben automatisch im aktuellen Browser speichern
- E-Mail an Bernhard als Vorschau erzeugen, kopieren oder im E-Mail-Programm öffnen
- Tagesbericht als formatierte `.json`-Datei exportieren
- responsive Darstellung für Desktop, Tablet und Smartphone

Alle Namen in der Demo sind frei erfundene Beispieldaten.

## Wichtige technische Grenze

Die Anwendung besitzt absichtlich kein Backend. Die Datei [`data/course.json`](./data/course.json) liefert nur die Ausgangsdaten für Kurs und Teilnehmerliste. Eine öffentlich bereitgestellte React-Anwendung kann diese Datei im Browser lesen, aber nicht direkt im GitHub-Repository verändern.

Darum nutzt der Prototyp zwei sichere, einfache Mechanismen:

1. Der aktuelle Entwurf wird im lokalen Browserspeicher des verwendeten Geräts abgelegt.
2. Über **JSON exportieren** kann der fertige Bericht als Datei gesichert werden.

Die Daten sind dadurch nicht automatisch zwischen verschiedenen Geräten oder Dozenten synchronisiert. Für eine echte Produktivlösung mit personenbezogenen Teilnehmerdaten sind Anmeldung, Rollen/Rechte, zentrale Speicherung, Aufbewahrungsregeln und Datenschutzprüfung erforderlich.

## Lokale Vorschau

Voraussetzung ist Node.js ab Version 22.13.

```bash
npm install
npm run dev
```

Die angezeigte lokale Adresse im Browser öffnen.

## Qualitätsprüfung

```bash
npm run build
npm run lint
npm test
```

## Beispieldaten anpassen

Kurs, Standarddozent und Teilnehmer befinden sich in [`data/course.json`](./data/course.json). Die Struktur ist bewusst einfach:

```json
{
  "course": "Kursbezeichnung",
  "instructor": "Name des Dozenten",
  "participants": [
    { "id": 1, "name": "Vorname N.", "initials": "VN" }
  ]
}
```

Vor einer öffentlichen Veröffentlichung dürfen dort keine echten Teilnehmerdaten eingetragen werden.

## Veröffentlichung

Das Projekt kann in GitHub gespeichert werden. Für GitHub Pages muss zusätzlich ein rein statischer Build- und Deployment-Workflow eingerichtet werden. Dieser Prototyp ist für die aktuelle Sites-Laufzeit vorbereitet und kann dort direkt veröffentlicht werden.

## Projektunterlagen

- [`PROJECTPLAN.md`](./PROJECTPLAN.md): Phasen, Tickets, Abnahmekriterien, Risiken und Produktiv-Roadmap
- [`CODEX_BRIEF.md`](./CODEX_BRIEF.md): fertiger Arbeitsauftrag für weitere Codex-Sitzungen

## Datenschutz

Die aktuelle Version ist eine Funktionsdemo mit erfundenen Daten. Für den realen Betrieb sollte Tertia mindestens folgende Punkte freigeben:

- Rechtsgrundlage und Zweck der Teilnehmerbewertung
- Zugriff nur für berechtigte Dozenten und Leitung
- verschlüsselte Übertragung und zentrale, geschützte Speicherung
- Lösch- und Aufbewahrungsfristen
- Protokollierung von Änderungen
- klare und sachliche Bewertungskategorien
- Information der betroffenen Teilnehmenden
