export type NowStatus = {
  headline: string;
  tickerItems: string[];
  lastUpdated: string;
  weekSummary: string;
};

export type Project = {
  id: string;
  code: string; // "P—01"
  title: string;
  description: string;
  stack: string;
  year: string;
  url?: string;
  status: "live" | "draft";
};

export type Note = {
  id: string;
  date: string; // display format MM.DD.YYYY
  title: string;
  category: string;
  minutes: number;
  published: boolean;
};

export type TrainingLog = {
  id: string;
  date: string; // MM.DD
  kind: "RUN" | "GYM" | "SNOW" | "OTHER";
  description: string;
  detail: string; // "18 KM · 5:42/KM" or "5 EXERCISES"
  duration: string;
  upcoming?: boolean;
};

export type TrainingStats = {
  thisWeekKm: number;
  longestRunKm: number;
  avgPace: string;
  daysToRaceDay: number;
  weeklyVolume: number[]; // last 12 weeks, 0-100 scale for the bar chart
};

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: "reading" | "queued" | "done";
  progressPercent?: number;
  rating?: number; // 1-5
  note?: string;
};

export type UsesItem = {
  id: string;
  name: string;
  category: "LANGUAGES & BACKEND" | "EVERYDAY TOOLS" | "OFF THE DESK";
  tag: string;
};
