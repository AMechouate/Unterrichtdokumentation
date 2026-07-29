"use client";

import { useEffect, useMemo, useState } from "react";
import courseData from "@/data/course.json";

type Rating =
  | ""
  | "Sehr gut mitgemacht"
  | "Gut mitgemacht"
  | "Mittel"
  | "Schlecht mitgemacht"
  | "Nicht erschienen"
  | "Kamera aus"
  | "Schlechte Verbindung"
  | "Ohne Grund gegangen";

type Participant = {
  id: number;
  name: string;
  initials: string;
  rating: Rating;
};

type DailyReport = {
  date: string;
  course: string;
  instructor: string;
  learningField: string;
  documentation: string;
  selfStudyTasks: string;
  specialNotes: string;
  participants: Participant[];
};

const STORAGE_KEY = "tertia-unterrichtsdokumentation-v1";

const ratingOptions: Array<{ value: Rating; label: string }> = [
  { value: "", label: "Bewertung wählen" },
  { value: "Sehr gut mitgemacht", label: "Sehr gut mitgemacht" },
  { value: "Gut mitgemacht", label: "Gut mitgemacht" },
  { value: "Mittel", label: "Mittel" },
  { value: "Schlecht mitgemacht", label: "Schlecht mitgemacht" },
  { value: "Nicht erschienen", label: "Nicht erschienen" },
  { value: "Kamera aus", label: "Kamera aus" },
  { value: "Schlechte Verbindung", label: "Schlechte Verbindung" },
  { value: "Ohne Grund gegangen", label: "Ohne Grund gegangen" },
];

function todayAsInputValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function createInitialReport(): DailyReport {
  return {
    date: todayAsInputValue(),
    course: courseData.course,
    instructor: courseData.instructor,
    learningField: "",
    documentation: "",
    selfStudyTasks: "",
    specialNotes: "",
    participants: courseData.participants.map((participant) => ({
      ...participant,
      rating: "" as Rating,
    })),
  };
}

function formatDate(date: string) {
  if (!date) return "Kein Datum";
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function buildEmail(report: DailyReport) {
  const participantLines = report.participants
    .map((participant) => `• ${participant.name}: ${participant.rating || "Nicht bewertet"}`)
    .join("\n");

  return `Hallo Bernhard,

hier ist die Unterrichtsdokumentation für ${formatDate(report.date)}.

Kurs: ${report.course}
Dozent/in: ${report.instructor}
Lernfeld: ${report.learningField || "–"}

UNTERRICHTSDOKUMENTATION
${report.documentation || "–"}

AUFGABEN FÜR DIE SELBSTLERNPHASE IN ILIAS
${report.selfStudyTasks || "–"}

BESONDERHEITEN
${report.specialNotes || "Keine Besonderheiten"}

TEILNEHMERÜBERSICHT
${participantLines}

Viele Grüße
${report.instructor || "Das Dozententeam"}`;
}

function ratingTone(rating: Rating) {
  if (rating === "Sehr gut mitgemacht" || rating === "Gut mitgemacht") return "positive";
  if (rating === "Nicht erschienen" || rating === "Ohne Grund gegangen") return "critical";
  if (rating === "Kamera aus" || rating === "Schlechte Verbindung") return "warning";
  if (rating) return "neutral";
  return "empty";
}

export function DocumentationWorkspace() {
  const [report, setReport] = useState<DailyReport>(createInitialReport);
  const [isHydrated, setIsHydrated] = useState(false);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [showPreview, setShowPreview] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as DailyReport;
          setReport(parsed);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
      setSaveState("saved");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [report, isHydrated]);

  const ratedCount = report.participants.filter((participant) => participant.rating).length;
  const requiredChecks = [
    report.instructor.trim(),
    report.learningField.trim(),
    report.documentation.trim(),
    report.selfStudyTasks.trim(),
    ratedCount === report.participants.length ? "complete" : "",
  ];
  const completedChecks = requiredChecks.filter(Boolean).length;
  const progress = Math.round((completedChecks / requiredChecks.length) * 100);
  const reportIsComplete = progress === 100;
  const emailText = useMemo(() => buildEmail(report), [report]);

  function updateField<K extends keyof DailyReport>(field: K, value: DailyReport[K]) {
    setSaveState("saving");
    setReport((current) => ({ ...current, [field]: value }));
  }

  function updateRating(id: number, rating: Rating) {
    setSaveState("saving");
    setReport((current) => ({
      ...current,
      participants: current.participants.map((participant) =>
        participant.id === id ? { ...participant, rating } : participant,
      ),
    }));
  }

  async function copyEmail() {
    await navigator.clipboard.writeText(emailText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openEmailClient() {
    const subject = `Unterrichtsdokumentation ${report.date} – ${report.course}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailText)}`;
  }

  function downloadJson() {
    const exportData = {
      ...report,
      exportedAt: new Date().toISOString(),
      schemaVersion: 1,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `unterrichtsdokumentation-${report.date || "entwurf"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function startNewReport() {
    if (!window.confirm("Möchtest du den aktuellen Entwurf wirklich leeren?")) return;
    const fresh = createInitialReport();
    setReport(fresh);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <span className="brand-mark" aria-hidden="true">T</span>
          <div>
            <p className="eyebrow">Tertia Bildungszentrum</p>
            <h1>Unterrichtsdokumentation</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <span className={`save-status ${saveState}`} aria-live="polite">
            <span className="status-dot" aria-hidden="true" />
            {saveState === "saving" ? "Wird gespeichert …" : "Entwurf lokal gespeichert"}
          </span>
          <button className="icon-button" type="button" onClick={() => setShowInfo(true)} aria-label="Informationen zur Datenspeicherung">
            i
          </button>
        </div>
      </header>

      <section className="context-bar" aria-label="Angaben zum Tagesbericht">
        <label className="compact-field">
          <span>Datum</span>
          <input type="date" value={report.date} onChange={(event) => updateField("date", event.target.value)} />
        </label>
        <label className="compact-field course-field">
          <span>Kurs</span>
          <input value={report.course} onChange={(event) => updateField("course", event.target.value)} />
        </label>
        <label className="compact-field instructor-field">
          <span>Dozent/in</span>
          <input value={report.instructor} onChange={(event) => updateField("instructor", event.target.value)} placeholder="Name eintragen" />
        </label>
        <div className="completion-card" aria-label={`${progress} Prozent vollständig`}>
          <div className="completion-copy">
            <span>Tagesbericht</span>
            <strong>{progress}% vollständig</strong>
          </div>
          <div className="progress-track" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </section>

      <div className="workspace-grid">
        <aside className="participants-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">Kursgruppe</p>
              <h2>Teilnehmer</h2>
            </div>
            <span className="count-badge">{ratedCount}/{report.participants.length}</span>
          </div>
          <p className="panel-intro">Bewerte die heutige Teilnahme kurz und einheitlich.</p>

          <div className="participant-list">
            {report.participants.map((participant) => (
              <article className={`participant-card tone-${ratingTone(participant.rating)}`} key={participant.id}>
                <div className="participant-identity">
                  <span className="avatar" aria-hidden="true">{participant.initials}</span>
                  <div>
                    <strong>{participant.name}</strong>
                    <span>{participant.rating || "Noch nicht bewertet"}</span>
                  </div>
                </div>
                <label className="rating-field">
                  <span className="sr-only">Bewertung für {participant.name}</span>
                  <select value={participant.rating} onChange={(event) => updateRating(participant.id, event.target.value as Rating)}>
                    {ratingOptions.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>
        </aside>

        <section className="documentation-panel">
          <div className="document-heading">
            <div>
              <p className="section-kicker">{formatDate(report.date)}</p>
              <h2>Was wurde heute gemacht?</h2>
            </div>
            <span className="demo-chip">Demo · Beispieldaten</span>
          </div>

          <div className="form-section learning-section">
            <label htmlFor="learning-field">Lernfeld <span aria-hidden="true">*</span></label>
            <input
              id="learning-field"
              value={report.learningField}
              onChange={(event) => updateField("learningField", event.target.value)}
              placeholder="z. B. LF 4 – IT-Systeme in Betrieb nehmen"
            />
            <p className="field-hint">Bezeichnung oder Nummer des heute vermittelten Lernfelds.</p>
          </div>

          <div className="form-section primary-section">
            <div className="label-row">
              <label htmlFor="documentation">Unterrichtsdokumentation <span aria-hidden="true">*</span></label>
              <span>{report.documentation.length} Zeichen</span>
            </div>
            <textarea
              id="documentation"
              value={report.documentation}
              onChange={(event) => updateField("documentation", event.target.value)}
              placeholder="Beschreibe Inhalte, Methoden und Lernfortschritt des heutigen Unterrichts …"
            />
          </div>

          <div className="form-section">
            <div className="label-row">
              <label htmlFor="self-study">Selbstlernphase in ILIAS <span aria-hidden="true">*</span></label>
              <span>{report.selfStudyTasks.length} Zeichen</span>
            </div>
            <textarea
              id="self-study"
              className="medium-textarea"
              value={report.selfStudyTasks}
              onChange={(event) => updateField("selfStudyTasks", event.target.value)}
              placeholder="Welche Aufgaben, Materialien oder Tests wurden für den Nachmittag bereitgestellt?"
            />
          </div>

          <div className="form-section notes-section">
            <div className="label-row">
              <label htmlFor="special-notes">Besonderheiten</label>
              <span>Optional</span>
            </div>
            <textarea
              id="special-notes"
              className="medium-textarea"
              value={report.specialNotes}
              onChange={(event) => updateField("specialNotes", event.target.value)}
              placeholder="Technische Probleme, organisatorische Hinweise oder besondere Vorkommnisse …"
            />
          </div>

          <div className="form-footer">
            <button className="text-button" type="button" onClick={startNewReport}>Neuen Bericht beginnen</button>
            <div className="primary-actions">
              <button className="secondary-button" type="button" onClick={downloadJson}>JSON exportieren</button>
              <button className="primary-button" type="button" onClick={() => setShowPreview(true)}>
                E-Mail vorbereiten
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
          {!reportIsComplete && (
            <p className="completion-note" role="status">
              Noch offen: Pflichtfelder ausfüllen und alle Teilnehmer bewerten. Eine Vorschau ist trotzdem jederzeit möglich.
            </p>
          )}
        </section>
      </div>

      {showPreview && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowPreview(false)}>
          <section className="modal-card email-modal" role="dialog" aria-modal="true" aria-labelledby="email-preview-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <p className="section-kicker">Versandfertig</p>
                <h2 id="email-preview-title">E-Mail an Bernhard</h2>
              </div>
              <button className="close-button" type="button" onClick={() => setShowPreview(false)} aria-label="Vorschau schließen">×</button>
            </div>
            <div className="email-subject">
              <span>Betreff</span>
              <strong>Unterrichtsdokumentation {report.date} – {report.course}</strong>
            </div>
            <pre className="email-preview">{emailText}</pre>
            <div className="modal-actions">
              <button className="secondary-button" type="button" onClick={copyEmail}>{copied ? "Text kopiert ✓" : "Text kopieren"}</button>
              <button className="primary-button" type="button" onClick={openEmailClient}>Im E-Mail-Programm öffnen <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>
      )}

      {showInfo && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowInfo(false)}>
          <section className="modal-card info-modal" role="dialog" aria-modal="true" aria-labelledby="storage-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <p className="section-kicker">Prototyp ohne Backend</p>
                <h2 id="storage-title">Wo werden die Daten gespeichert?</h2>
              </div>
              <button className="close-button" type="button" onClick={() => setShowInfo(false)} aria-label="Hinweis schließen">×</button>
            </div>
            <p>Der Entwurf bleibt ausschließlich im Browser auf diesem Gerät. Über „JSON exportieren“ kann ein Tagesbericht als Datei gesichert werden.</p>
            <p><strong>Wichtig:</strong> Für echte Teilnehmerdaten braucht eine spätere Produktivversion Anmeldung, Zugriffsrechte und eine datenschutzkonforme zentrale Speicherung.</p>
            <button className="primary-button full-button" type="button" onClick={() => setShowInfo(false)}>Verstanden</button>
          </section>
        </div>
      )}
    </main>
  );
}
