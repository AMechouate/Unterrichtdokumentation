# Projektplanung: Tertia Unterrichtsdokumentation

## 1. Ausgangslage

Jeder Dozent erstellt derzeit nach jedem Unterrichtstag eine einzelne E-Mail an Bernhard. Darin müssen Unterrichtsinhalte, Lernfeld, ILIAS-Aufgaben für die Selbstlernphase, Besonderheiten und relevante Beobachtungen zu den Teilnehmenden zusammengetragen werden. Der Ablauf ist zeitaufwendig, uneinheitlich und fehleranfällig.

## 2. Zielbild

Die Anwendung führt den Dozenten in wenigen Minuten durch eine standardisierte Tagesdokumentation. Alle Informationen befinden sich in einer übersichtlichen Oberfläche. Am Ende erzeugt die Anwendung einen vollständigen, einheitlich formulierten Bericht, der als E-Mail vorbereitet und zusätzlich als JSON-Datei archiviert werden kann.

Der aktuelle Projektstand ist ein bewusst einfacher React-Prototyp ohne Backend. Er dient zur Vorführung, zur Prüfung des Ablaufs mit Bernhard und zur Erhebung von Feedback vor einer datenschutzkonformen Produktivversion.

## 3. Nutzer und Rollen

### Dozent/in

- erstellt den Tagesbericht
- bewertet die Teilnahme der Kursgruppe
- prüft die E-Mail-Vorschau
- exportiert oder versendet die Zusammenfassung

### Bernhard / Bildungsleitung

- erhält einheitlich strukturierte Berichte
- erkennt Unterrichtsthema, Lernfeld, Aufgaben und Besonderheiten schneller
- gibt Anforderungen für die spätere Übersichts- und Archivfunktion frei

### Administrator/in (erst Produktivversion)

- verwaltet Kurse, Dozenten und Teilnehmer
- steuert Rollen und Zugriffe
- setzt Aufbewahrungs- und Löschregeln um

## 4. Funktionsumfang des Prototyps

### Im Umfang

- eine Seite für einen Tagesbericht
- Kurs-, Datums- und Dozentenangabe
- freie Texteingabe für Unterrichtsdokumentation
- Angabe des Lernfelds
- Beschreibung der ILIAS-Aufgaben
- Besonderheiten
- Teilnehmerliste mit standardisierten Bewertungsoptionen
- Vollständigkeitsanzeige
- lokale Autospeicherung im Browser
- E-Mail-Vorschau und Übergabe an das lokale E-Mail-Programm
- Kopieren des E-Mail-Texts
- JSON-Export
- Demo mit erfundenen Teilnehmerdaten
- responsive und barrierearme Bedienung

### Nicht im Umfang des Prototyps

- echte Benutzerkonten
- zentrale Datenbank
- Synchronisierung zwischen Geräten
- Versand über einen Mailserver
- echte Teilnehmerdaten in einer öffentlichen Demo
- Kurs- und Benutzerverwaltung
- revisionssicheres Archiv
- Auswertungen über mehrere Tage

## 5. Datenmodell des Prototyps

### Kursstammdaten

- `course`: Kursbezeichnung
- `instructor`: vorgeschlagener Name des Dozenten
- `participants[]`: ID, Anzeigename und Initialen

### Tagesbericht

- `date`: Unterrichtsdatum
- `course`: Kursbezeichnung
- `instructor`: verantwortliche Person
- `learningField`: Lernfeldnummer oder Bezeichnung
- `documentation`: Unterrichtsinhalte, Methoden und Lernfortschritt
- `selfStudyTasks`: Aufgaben und Materialien in ILIAS
- `specialNotes`: technische, organisatorische oder sonstige Besonderheiten
- `participants[].rating`: Tagesbewertung je Teilnehmer
- `exportedAt`: Zeitpunkt des JSON-Exports
- `schemaVersion`: Version der Exportstruktur

## 6. Bewertungskategorien

Die Kategorien sollten mit der Bildungsleitung und dem Datenschutz abgestimmt werden. Der Prototyp verwendet:

- Sehr gut mitgemacht
- Gut mitgemacht
- Mittel
- Schlecht mitgemacht
- Nicht erschienen
- Kamera aus
- Schlechte Verbindung
- Ohne Grund gegangen

Empfehlung für die Produktivversion: Beobachtbare, sachliche Kategorien bevorzugen und wertende Formulierungen auf das notwendige Maß reduzieren.

## 7. Ticketplan

### EPIC 1 – Produktklärung und Datenschutz

#### TUD-001: Berichtsinhalte mit Bernhard abnehmen

**Priorität:** Muss  
**Aufwand:** 0,5 Tag  
**Abhängigkeiten:** keine

Aufgaben:

- Pflicht- und optionale Felder gemeinsam prüfen
- Betreff und Aufbau der erzeugten E-Mail freigeben
- gewünschte Reihenfolge der Teilnehmerinformationen bestätigen
- klären, ob Bernhard nur E-Mails oder später auch eine Übersicht benötigt

Abnahmekriterien:

- eine schriftlich bestätigte Feldliste liegt vor
- E-Mail-Muster ist freigegeben
- Verantwortliche Person für fachliche Entscheidungen ist benannt

#### TUD-002: Bewertungskategorien fachlich und rechtlich prüfen

**Priorität:** Muss vor echten Daten  
**Aufwand:** 1 Tag  
**Abhängigkeiten:** TUD-001

Aufgaben:

- jede Kategorie auf Sachlichkeit und Notwendigkeit prüfen
- „nicht erschienen“, technische Störung und Verhalten sauber trennen
- festlegen, wer Bewertungen sehen darf
- Aufbewahrungs- und Löschfrist bestimmen

Abnahmekriterien:

- finale Kategorien sind dokumentiert
- Datenschutzverantwortliche haben den Verwendungszweck bewertet
- Zugriff und Löschfrist sind festgelegt

#### TUD-003: Erfolgskriterien der Pilotphase definieren

**Priorität:** Soll  
**Aufwand:** 0,5 Tag  
**Abhängigkeiten:** TUD-001

Messgrößen:

- durchschnittliche Bearbeitungszeit pro Tagesbericht
- Anteil vollständig ausgefüllter Berichte
- Anzahl notwendiger Rückfragen von Bernhard
- Zufriedenheit der Dozenten

Abnahmekriterien:

- Zielwerte und Messzeitraum sind vereinbart

### EPIC 2 – UX und React-Prototyp

#### TUD-010: Grundlayout der Tagesdokumentation

**Priorität:** Muss  
**Aufwand:** 1 Tag  
**Status:** umgesetzt

Aufgaben:

- Kopfbereich mit Produktname und Speicherstatus
- Kontextzeile für Datum, Kurs und Dozent
- linke Teilnehmerliste und rechter Dokumentationsbereich
- klare visuelle Hierarchie und ruhige Tertia-nahe Gestaltung

Abnahmekriterien:

- alle Kernbereiche sind ohne Seitenwechsel erreichbar
- die Hauptfunktion ist im ersten Bildschirm erkennbar
- Darstellung funktioniert ab 320 Pixel Breite

#### TUD-011: Teilnehmerbewertung

**Priorität:** Muss  
**Aufwand:** 0,5 Tag  
**Status:** umgesetzt

Aufgaben:

- JSON-basierte Teilnehmerliste einlesen
- Dropdown je Teilnehmer anzeigen
- Bewertungsfortschritt zählen
- Status visuell, aber nicht nur über Farbe unterscheiden

Abnahmekriterien:

- jede Person kann genau eine Auswahl erhalten
- noch nicht bewertete Personen sind erkennbar
- Bedienung ist per Tastatur möglich

#### TUD-012: Dokumentationsformular

**Priorität:** Muss  
**Aufwand:** 0,75 Tag  
**Status:** umgesetzt

Aufgaben:

- Lernfeld
- Unterrichtsdokumentation
- ILIAS-Selbstlernaufgaben
- Besonderheiten
- Zeichenanzeige und verständliche Hilfetexte

Abnahmekriterien:

- Pflichtfelder sind gekennzeichnet
- lange Texte bleiben gut bearbeitbar
- Formularwerte bleiben bei Layoutwechsel erhalten

#### TUD-013: Autospeicherung und Wiederherstellung

**Priorität:** Muss für Demo  
**Aufwand:** 0,5 Tag  
**Status:** umgesetzt

Aufgaben:

- Bericht nach Änderungen lokal speichern
- gespeicherten Entwurf beim nächsten Öffnen laden
- sichtbaren Speicherstatus anzeigen
- Funktion zum Beginnen eines neuen Berichts anbieten

Abnahmekriterien:

- Neuladen der Seite löscht den Entwurf nicht
- Löschen verlangt eine Bestätigung
- beschädigte lokale Daten blockieren die Anwendung nicht

#### TUD-014: Vollständigkeitsprüfung

**Priorität:** Soll  
**Aufwand:** 0,25 Tag  
**Status:** umgesetzt

Abnahmekriterien:

- Fortschritt berücksichtigt Dozent, Lernfeld, Dokumentation, ILIAS-Aufgaben und alle Teilnehmerbewertungen
- fehlende Angaben werden verständlich zusammengefasst

### EPIC 3 – Ausgabe und Automatisierung

#### TUD-020: E-Mail-Zusammenfassung erzeugen

**Priorität:** Muss  
**Aufwand:** 0,75 Tag  
**Status:** umgesetzt

Aufgaben:

- einheitlichen Betreff bilden
- alle Berichtsteile lesbar formatieren
- Teilnehmerübersicht vollständig anhängen
- Vorschau anzeigen
- Text in die Zwischenablage kopieren
- Standard-E-Mail-Programm öffnen

Abnahmekriterien:

- Vorschau enthält alle erfassten Daten
- Sonderzeichen werden im E-Mail-Entwurf korrekt übertragen
- fehlende optionale Besonderheiten erscheinen als „Keine Besonderheiten“

#### TUD-021: Empfängeradresse konfigurierbar machen

**Priorität:** Soll  
**Aufwand:** 0,25 Tag  
**Abhängigkeiten:** Bernhards offizielle Zieladresse

Aufgaben:

- Zieladresse nicht hart im Quellcode verteilen
- für Demo optional in der Kurs-JSON hinterlegen
- in der Produktivversion zentral administrieren

Abnahmekriterien:

- E-Mail-Programm öffnet sich mit korrektem Empfänger
- in öffentlichen Beispieldaten steht keine private Adresse

#### TUD-022: JSON-Export

**Priorität:** Muss für Demo  
**Aufwand:** 0,5 Tag  
**Status:** umgesetzt

Abnahmekriterien:

- Dateiname enthält das Berichtsdatum
- Datei ist valides, formatiertes JSON
- Export enthält Zeitstempel und Schemaversion

#### TUD-023: Direkter automatischer Mailversand

**Priorität:** Später  
**Aufwand:** 2–4 Tage  
**Abhängigkeiten:** Backend, Mailkonto, Freigaben, Authentifizierung

Hinweis: Ein sicherer automatischer Versand ist in einer reinen Browser-App ohne Backend nicht sinnvoll. Zugangsdaten für ein Mailkonto dürfen nicht im React-Code liegen.

Abnahmekriterien:

- Versand erfolgt serverseitig
- Absender ist authentifiziert
- Fehler und Zustellstatus werden angezeigt
- keine Mail-Zugangsdaten gelangen in den Browser

### EPIC 4 – Qualität, Barrierefreiheit und Sicherheit

#### TUD-030: Automatisierte Build- und Renderingtests

**Priorität:** Muss  
**Aufwand:** 0,5 Tag  

Abnahmekriterien:

- Produktionsbuild läuft fehlerfrei
- Hauptüberschrift und Kernfelder sind serverseitig im HTML vorhanden
- Starter- und Demo-Metadaten sind entfernt

#### TUD-031: Bedien- und Browserprüfung

**Priorität:** Muss vor Pilot  
**Aufwand:** 1 Tag  

Prüfumfang:

- Desktop, Tablet und Smartphone
- Chrome, Edge, Safari und Firefox in aktuellen Versionen
- reine Tastaturbedienung
- sichtbare Fokuszustände
- verständliche Beschriftungen für Screenreader
- lange Teilnehmernamen und lange Texte

Abnahmekriterien:

- keine blockierenden Darstellungs- oder Bedienfehler
- vollständiger Ablauf ist ohne Maus möglich

#### TUD-032: Datenschutz- und Sicherheitsprüfung

**Priorität:** Muss vor echten Daten  
**Aufwand:** 1–2 Tage  
**Abhängigkeiten:** TUD-002

Abnahmekriterien:

- keine echten personenbezogenen Daten in öffentlichem Repository oder Demo
- Datenflüsse und Speicherorte sind dokumentiert
- Rollen- und Berechtigungskonzept ist freigegeben
- Löschung und Auskunft können umgesetzt werden

### EPIC 5 – GitHub und Veröffentlichung

#### TUD-040: Repository vorbereiten

**Priorität:** Muss  
**Aufwand:** 0,5 Tag

Aufgaben:

- Quellcode und Dokumentation versionieren
- generierte Dateien und lokale Daten ausschließen
- verständliche README bereitstellen
- Hauptbranch festlegen

Abnahmekriterien:

- Repository lässt sich frisch installieren und bauen
- keine Zugangsdaten oder realen Teilnehmerdaten sind enthalten

#### TUD-041: Demo veröffentlichen

**Priorität:** Muss  
**Aufwand:** 0,5 Tag

Aufgaben:

- erfolgreichen Produktionsbuild erstellen
- öffentliche oder gezielt freigegebene Demo bereitstellen
- URL und Testhinweise dokumentieren

Abnahmekriterien:

- URL ist erreichbar
- Anwendung lädt ohne lokale Entwicklungswerkzeuge
- ausschließlich Beispieldaten sind sichtbar

#### TUD-042: GitHub Pages Workflow (optional)

**Priorität:** Kann  
**Aufwand:** 0,5–1 Tag  
**Abhängigkeiten:** Entscheidung für GitHub Pages, statische Build-Konfiguration

Aufgaben:

- statischen Build aktivieren
- Unterpfad `/Unterrichtdokumentation/` berücksichtigen
- GitHub Actions Workflow anlegen
- Pages in den Repository-Einstellungen aktivieren

Abnahmekriterien:

- jede Änderung am Hauptbranch aktualisiert die Demo automatisch
- URL `https://amechouate.github.io/Unterrichtdokumentation/` ist erreichbar

### EPIC 6 – Produktivversion

#### TUD-050: Anmeldung und Rollen

**Priorität:** Muss für Produktivbetrieb  
**Aufwand:** 3–5 Tage

Rollen: Dozent, Bildungsleitung, Administrator.

#### TUD-051: Zentrale Datenbank und API

**Priorität:** Muss für Produktivbetrieb  
**Aufwand:** 5–8 Tage

Benötigt werden Kurse, Benutzer, Teilnehmer, Tagesberichte, Einzelbewertungen und Änderungsprotokoll.

#### TUD-052: Berichtshistorie und Suche

**Priorität:** Soll  
**Aufwand:** 3–5 Tage

Filter nach Datum, Kurs, Dozent und Besonderheit; rollenabhängige Einsicht.

#### TUD-053: Kurs- und Teilnehmerimport

**Priorität:** Soll  
**Aufwand:** 2–4 Tage

Import aus einem freigegebenen Quellsystem oder einer CSV-Datei; keine parallele Pflege mehrerer Wahrheiten.

#### TUD-054: Erinnerungen und Eskalationen

**Priorität:** Kann  
**Aufwand:** 2–4 Tage

Nur mit abgestimmtem Zeitplan und serverseitiger Benachrichtigung.

## 8. Empfohlene Reihenfolge

1. Prototyp mit Bernhard und zwei Dozenten testen.
2. Formulierungen und Bewertungskategorien überarbeiten.
3. Datenschutz und Berechtigungen verbindlich klären.
4. Entscheidung treffen: einfache Demo beibehalten oder Produktivversion mit Backend bauen.
5. Bei Produktiventscheidung Authentifizierung und Datenmodell zuerst umsetzen.
6. Danach Berichtshistorie, Mailversand und Administration ergänzen.
7. Pilot mit einem Kurs durchführen und Erfolgskriterien auswerten.
8. Erst danach auf weitere Kurse ausrollen.

## 9. Risiken und Gegenmaßnahmen

### Personenbezogene Daten in öffentlicher Demo

**Risiko:** Bewertungen und Fehlzeiten werden unbeabsichtigt veröffentlicht.  
**Gegenmaßnahme:** Nur erfundene Daten, keine echten Namen oder E-Mail-Adressen im Repository.

### Erwartung einer zentralen Speicherung

**Risiko:** Nutzer glauben, lokale Entwürfe seien auf allen Geräten verfügbar.  
**Gegenmaßnahme:** Speicherort in der Oberfläche erklären; Produktivversion klar abgrenzen.

### Ungeeignete Bewertungskategorien

**Risiko:** Formulierungen sind missverständlich oder unnötig wertend.  
**Gegenmaßnahme:** Kategorien fachlich und datenschutzrechtlich freigeben; beobachtbares Verhalten bevorzugen.

### Zu lange Mailto-Links

**Risiko:** Sehr lange Berichte überschreiten Grenzen einzelner E-Mail-Programme.  
**Gegenmaßnahme:** Kopierfunktion als zuverlässige Alternative; später serverseitiger Versand.

### Datenverlust durch Browserbereinigung

**Risiko:** Lokale Entwürfe werden gelöscht.  
**Gegenmaßnahme:** JSON-Export; in der Produktivversion zentrale Datenbank.

## 10. Definition of Done

Ein Ticket ist abgeschlossen, wenn:

- Abnahmekriterien erfüllt sind
- Build und relevante Tests erfolgreich laufen
- Oberfläche auf kleinen und großen Bildschirmen funktioniert
- neue Texte verständlich und auf Deutsch geprüft sind
- keine Zugangsdaten oder realen personenbezogenen Daten eingecheckt wurden
- technische und fachliche Dokumentation aktualisiert ist
