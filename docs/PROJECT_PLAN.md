# Projektplan

## Ziel

Eine responsive Webanwendung vereinfacht die tägliche Unterrichtsdokumentation und erzeugt einheitliche PDF- und Excel-Berichte.

## Umgesetzter Umfang

### Oberfläche

- Zweispaltige Arbeitsansicht für Teilnehmer und Tagesdokumentation
- Optimierte Darstellung für Smartphone, Tablet und Desktop
- Einheitliche Bewertungsoptionen je Teilnehmer
- Fortschrittsanzeige für den aktuellen Bericht

### Exporte

- PDF im druckfähigen A4-Layout
- Excel-Arbeitsmappe mit formatierten Abschnitten und Teilnehmerübersicht
- Einheitliche Dateinamen mit Berichtsdatum

### Veröffentlichung

- Automatischer Build über GitHub Actions
- Öffentliche Bereitstellung über GitHub Pages
- Technische Prüfung bei jeder Veröffentlichung

## Nächste Ausbaustufe: zentrale Speicherung

### T-01 Anmeldung und Rollen

**Ziel:** Zugriff nur für berechtigte Personen.

**Akzeptanzkriterien:**

- Anmeldung für Dozenten
- Rollen für Bearbeitung und Lesenzugriff
- Geschützte Kurs- und Teilnehmerdaten

### T-02 Datenmodell und Schnittstelle

**Ziel:** Berichte zentral und nachvollziehbar speichern.

**Akzeptanzkriterien:**

- Kurse, Teilnehmer, Tagesberichte und Bewertungen werden serverseitig gespeichert
- Berichte lassen sich nach Datum und Kurs aufrufen
- Änderungen erhalten Zeitstempel und Bearbeiter

### T-03 Berichtsarchiv

**Ziel:** Bereits erstellte Dokumentationen schnell finden.

**Akzeptanzkriterien:**

- Filter nach Kurs und Zeitraum
- Detailansicht eines Tagesberichts
- PDF- und Excel-Export aus dem Archiv

### T-04 Datenschutz und Betrieb

**Ziel:** Verlässlicher Umgang mit personenbezogenen Daten.

**Akzeptanzkriterien:**

- Verbindliches Berechtigungskonzept
- Aufbewahrungs- und Löschfristen
- Verschlüsselte Übertragung
- Datensicherung und Wiederherstellungsprüfung
