export type ActionPriority = "High" | "Medium" | "Low";

export type InsightAction = {
  priority: ActionPriority;
  label: string;
  desc: string;
};

export type DayInsight = {
  date: string;
  mood: number;
  reflection: string;
  pattern: string;
  affirmation: string;
  actions: InsightAction[];
};

export type InsightMap = Record<string, Omit<DayInsight, "date">>;

export type TrendPoint = {
  day: number;
  mood: number | null;
  iso: string;
};
