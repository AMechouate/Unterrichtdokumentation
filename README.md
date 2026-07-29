# Unterrichtsdokumentation

Webanwendung zur strukturierten Erfassung täglicher Unterrichtsberichte. Unterrichtsinhalte, Lernfeld, Aufgaben, Besonderheiten und Teilnehmerbeobachtungen werden in einer gemeinsamen Ansicht erfasst und als PDF oder Excel-Datei ausgegeben.

## Anwendung

https://amechouate.github.io/Unterrichtdokumentation/

## Funktionen

- Tagesbericht mit Datum, Kurs und Dozent/in
- Teilnehmerliste mit einheitlichen Bewertungsoptionen
- Dokumentation von Lernfeld, Unterricht, Aufgaben und Besonderheiten
- Formatierter PDF-Export
- Formatierter Excel-Export
- Bedienung auf Desktop, Tablet und Smartphone

## Entwicklung

```bash
npm install
npm run dev
```

Qualitätsprüfung und Produktions-Build:

```bash
npm run lint
npm test
```

Kurs- und Teilnehmerdaten werden in [`data/course.json`](./data/course.json) gepflegt. Die Veröffentlichung auf GitHub Pages erfolgt nach Änderungen am Hauptzweig automatisch.

## Datenschutz und dauerhafte Ablage

Die statische Anwendung überträgt oder speichert keine Berichte. Für eine zentrale, dauerhafte Ablage ist ein geschützter Datendienst mit Anmeldung und Zugriffsregeln erforderlich. PDF- und Excel-Exporte werden ausschließlich im Browser erstellt.
