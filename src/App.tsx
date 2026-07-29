import { useMemo, useState } from "react";
import courseData from "../data/course.json";
import { exportExcel, exportPdf } from "./exporters";
import {
  ratingOptions,
  type CourseData,
  type DailyReport,
  type Rating,
} from "./types";

const course = courseData as CourseData;

function today() {
  const current = new Date();
  const local = new Date(current.getTime() - current.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function longDate(value: string) {
  if (!value) return "Datum auswählen";
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function ratingTone(rating: Rating) {
  if (rating === "Sehr gut mitgearbeitet" || rating === "Gut mitgearbeitet") {
    return "positive";
  }
  if (
    rating === "Nicht erschienen" ||
    rating === "Schlecht mitgearbeitet" ||
    rating === "Ohne Grund gegangen"
  ) {
    return "attention";
  }
  return rating ? "neutral" : "empty";
}

function DownloadIcon({ kind }: { kind: "pdf" | "excel" }) {
  return kind === "pdf" ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2.75h7l4 4V21.25H7z" />
      <path d="M14 2.75v4h4M9.5 16.5h5M9.5 13.5h5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 2.75h10v18.5H7zM7 8h10M7 13h10M12 8v13.25" />
      <path d="m2.75 9 4.5 6M7.25 9l-4.5 6" />
    </svg>
  );
}

export default function App() {
  const [date, setDate] = useState(today);
  const [instructor, setInstructor] = useState(course.instructor);
  const [learningField, setLearningField] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [assignments, setAssignments] = useState("");
  const [notes, setNotes] = useState("");
  const [ratings, setRatings] = useState<Record<number, Rating>>({});
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const [notice, setNotice] = useState("");

  const assessedCount = Object.values(ratings).filter(Boolean).length;
  const completedFields = [learningField, documentation, assignments, notes].filter(
    (value) => value.trim(),
  ).length;
  const progress = Math.round(
    ((completedFields + assessedCount) / (4 + course.participants.length)) * 100,
  );

  const report = useMemo<DailyReport>(
    () => ({
      date,
      course: course.course,
      instructor: instructor.trim() || "—",
      learningField,
      documentation,
      assignments,
      notes,
      assessments: course.participants.map((participant) => ({
        ...participant,
        rating: ratings[participant.id] ?? "",
      })),
    }),
    [assignments, date, documentation, instructor, learningField, notes, ratings],
  );

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  }

  async function handleExport(kind: "pdf" | "excel") {
    setExporting(kind);
    try {
      if (kind === "pdf") {
        await exportPdf(report);
      } else {
        await exportExcel(report);
      }
      showNotice(`${kind === "pdf" ? "PDF" : "Excel-Datei"} wurde erstellt.`);
    } catch {
      showNotice("Die Datei konnte nicht erstellt werden.");
    } finally {
      setExporting(null);
    }
  }

  function resetForm() {
    if (!window.confirm("Alle Eingaben dieses Tagesberichts zurücksetzen?")) return;
    setDate(today());
    setInstructor(course.instructor);
    setLearningField("");
    setDocumentation("");
    setAssignments("");
    setNotes("");
    setRatings({});
    showNotice("Tagesbericht wurde zurückgesetzt.");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="wordmark">
          <span className="wordmark-symbol" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <div>
            <p>Tagesbericht</p>
            <h1>Unterrichtsdokumentation</h1>
          </div>
        </div>

        <div className="header-meta">
          <label>
            <span>Datum</span>
            <input
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label>
            <span>Dozent/in</span>
            <input
              value={instructor}
              onChange={(event) => setInstructor(event.target.value)}
              placeholder="Name eintragen"
            />
          </label>
        </div>
      </header>

      <main className="workspace">
        <section className="intro-row" aria-labelledby="report-title">
          <div>
            <p className="eyebrow">{course.course}</p>
            <h2 id="report-title">{longDate(date)}</h2>
          </div>
          <div className="progress-block" aria-label={`${progress} Prozent ausgefüllt`}>
            <div className="progress-copy">
              <span>Vollständigkeit</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <div className="content-grid">
          <aside className="participants-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Anwesenheit &amp; Mitarbeit</p>
                <h3>Teilnehmer</h3>
              </div>
              <span className="count-badge">{course.participants.length}</span>
            </div>

            <div className="participant-list">
              {course.participants.map((participant) => {
                const rating = ratings[participant.id] ?? "";
                return (
                  <article className="participant-row" key={participant.id}>
                    <div className="participant-person">
                      <span className="avatar" aria-hidden="true">
                        {participant.initials}
                      </span>
                      <div>
                        <strong>{participant.name}</strong>
                        <span>Teilnehmer/in</span>
                      </div>
                    </div>
                    <div className={`select-wrap ${ratingTone(rating)}`}>
                      <select
                        aria-label={`Bewertung für ${participant.name}`}
                        value={rating}
                        onChange={(event) =>
                          setRatings((current) => ({
                            ...current,
                            [participant.id]: event.target.value as Rating,
                          }))
                        }
                      >
                        <option value="">Bewertung wählen</option>
                        {ratingOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span aria-hidden="true">⌄</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>

          <section className="report-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Inhalte des Tages</p>
                <h3>Dokumentation</h3>
              </div>
            </div>

            <div className="field-grid">
              <label className="field field-learning">
                <span>Lernfeld</span>
                <input
                  value={learningField}
                  onChange={(event) => setLearningField(event.target.value)}
                  placeholder="z. B. LF 4 – Software entwickeln"
                />
              </label>

              <label className="field">
                <span>Unterrichtsdokumentation</span>
                <textarea
                  className="textarea-large"
                  value={documentation}
                  onChange={(event) => setDocumentation(event.target.value)}
                  placeholder="Behandelte Themen, Lernziele und Unterrichtsverlauf"
                />
              </label>

              <label className="field">
                <span>Aufgaben für die Selbstlernphase</span>
                <textarea
                  value={assignments}
                  onChange={(event) => setAssignments(event.target.value)}
                  placeholder="Aufgaben, Materialien und Abgabefristen"
                />
              </label>

              <label className="field">
                <span>Besonderheiten</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Abwesenheiten, technische Probleme oder weitere Hinweise"
                />
              </label>
            </div>
          </section>
        </div>

        <footer className="actionbar">
          <div className="completion-summary">
            <span className="summary-mark" aria-hidden="true">
              {assessedCount}/{course.participants.length}
            </span>
            <div>
              <strong>Teilnehmer bewertet</strong>
              <span>{progress}% des Tagesberichts ausgefüllt</span>
            </div>
          </div>

          <div className="actions">
            <button className="button button-quiet" type="button" onClick={resetForm}>
              Zurücksetzen
            </button>
            <button
              className="button button-pdf"
              type="button"
              disabled={exporting !== null}
              onClick={() => void handleExport("pdf")}
            >
              <DownloadIcon kind="pdf" />
              {exporting === "pdf" ? "PDF wird erstellt …" : "PDF herunterladen"}
            </button>
            <button
              className="button button-excel"
              type="button"
              disabled={exporting !== null}
              onClick={() => void handleExport("excel")}
            >
              <DownloadIcon kind="excel" />
              {exporting === "excel"
                ? "Excel wird erstellt …"
                : "Excel herunterladen"}
            </button>
          </div>
        </footer>
      </main>

      <div className={`notice ${notice ? "is-visible" : ""}`} aria-live="polite">
        {notice}
      </div>
    </div>
  );
}
