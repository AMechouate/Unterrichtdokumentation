export const ratingOptions = [
  "Sehr gut mitgearbeitet",
  "Gut mitgearbeitet",
  "Mittel",
  "Schlecht mitgearbeitet",
  "Nicht erschienen",
  "Kamera ausgeschaltet",
  "Schlechte Verbindung",
  "Ohne Grund gegangen",
] as const;

export type Rating = (typeof ratingOptions)[number] | "";

export interface Participant {
  id: number;
  name: string;
  initials: string;
}

export interface CourseData {
  course: string;
  instructor: string;
  participants: Participant[];
}

export interface ParticipantAssessment extends Participant {
  rating: Rating;
}

export interface DailyReport {
  date: string;
  course: string;
  instructor: string;
  learningField: string;
  documentation: string;
  assignments: string;
  notes: string;
  assessments: ParticipantAssessment[];
}
