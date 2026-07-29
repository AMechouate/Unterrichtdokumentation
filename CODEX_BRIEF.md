# Arbeitsauftrag für Codex

Der folgende Auftrag kann in einer neuen Codex-Sitzung verwendet werden, um das Projekt gezielt weiterzuentwickeln.

## Hauptprompt

> Arbeite im Repository `AMechouate/Unterrichtdokumentation`. Lies zuerst `README.md`, `PROJECTPLAN.md`, `CODEX_BRIEF.md` und alle vorhandenen Projektanweisungen. Prüfe anschließend den aktuellen Zustand und den Git-Status, bevor du Dateien änderst.
>
> Entwickle die Anwendung als hochwertige, responsive React-Anwendung für Tertia weiter. Zielgruppe sind Dozentinnen und Dozenten, die täglich Unterricht, Lernfeld, ILIAS-Aufgaben, Besonderheiten und die Teilnahme der Kursgruppe dokumentieren. Bewahre die klare Zweispaltenstruktur: links die Teilnehmerbewertung, rechts das Dokumentationsformular.
>
> Der aktuelle Prototyp bleibt ohne Backend. `data/course.json` enthält nur erfundene Ausgangsdaten. Entwürfe dürfen lokal im Browser gespeichert und als JSON exportiert werden. Behaupte nicht, dass eine Browser-App die JSON-Datei im GitHub-Repository direkt überschreiben kann. Lege niemals echte Teilnehmernamen, Bewertungen, private E-Mail-Adressen oder Zugangsdaten in das öffentliche Repository.
>
> Setze nur die ausdrücklich ausgewählten Tickets aus `PROJECTPLAN.md` um. Erhalte bestehende Funktionen, außer die Aufgabe verlangt eine Änderung. Achte besonders auf verständliche deutsche Texte, Tastaturbedienung, sichtbare Fokuszustände, mobile Darstellung und robuste Fehlerbehandlung.
>
> Führe nach Änderungen mindestens Produktionsbuild und passende Tests aus. Prüfe den Git-Unterschied auf unbeabsichtigte Änderungen. Committe nur die zum Auftrag gehörenden Dateien mit einer klaren Commit-Nachricht. Pushe ausschließlich, wenn ich dich ausdrücklich dazu auffordere und der Zielbranch eindeutig ist. Berichte abschließend knapp: Ergebnis, Tests, bekannte Grenzen und veröffentlichte URL, falls vorhanden.

## Beispiel für einen konkreten Folgeauftrag

> Setze die Tickets TUD-021 und TUD-030 um. Ergänze eine konfigurierbare Empfängeradresse, aber verwende in der öffentlichen Demo nur einen leeren oder erfundenen Wert. Aktualisiere Tests und Dokumentation. Führe Build, Lint und Tests aus. Zeige mir danach die Änderungen, bevor du commitest oder pushst.

## Beispiel für eine spätere Produktivplanung

> Erstelle noch keinen Produktivcode. Erarbeite für TUD-050 und TUD-051 zuerst einen Architekturvorschlag mit Authentifizierung, Rollen, Datenmodell, API-Grenzen, Datenschutzmaßnahmen, Migration vom JSON-Prototyp und realistischen Aufwandsschätzungen. Liste offene Entscheidungen auf und ändere das Repository nur, wenn ich den Vorschlag freigebe.

## Zusammenarbeit mit Codex

Für gute Ergebnisse sollte jeder Auftrag enthalten:

1. die Ticketnummer oder das klare Ziel
2. was ausdrücklich nicht verändert werden soll
3. ob Codex nur planen, implementieren, committen oder auch pushen soll
4. welche Abnahme erwartet wird
5. ob die Anwendung öffentlich oder nur intern erreichbar sein darf

Kleine, klar abgegrenzte Aufträge sind leichter zu prüfen als ein einziger sehr großer Auftrag. Nach jedem wichtigen Schritt sollten Build, Tests und Datenschutzgrenzen erneut kontrolliert werden.
