export enum AppView {
  DASHBOARD = 'DASHBOARD',
  REFLECTIONS = 'REFLECTIONS',
  TRIGGERS = 'TRIGGERS',
  ACCOMPLISHMENTS = 'ACCOMPLISHMENTS'
}

export enum ReflectionCategory {
  PROGRESS = 'Leadership Progress',
  COMMUNICATION = 'Communication',
  STRESS = 'Stress Management'
}

export interface ReflectionEntry {
  id: string;
  date: string; // ISO string
  content: string;
  category: ReflectionCategory;
}

export interface TriggerEntry {
  id: string;
  timestamp: string; // ISO string
  trigger: string;
  notes: string;
  intensity: number; // 1-10
}

export interface AccomplishmentEntry {
  id: string;
  date: string; // ISO string
  title: string;
  details: string;
}

export interface AppState {
  reflections: ReflectionEntry[];
  triggers: TriggerEntry[];
  accomplishments: AccomplishmentEntry[];
}