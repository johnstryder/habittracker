export interface Habit {
  id: string;
  name: string;
  type: 'good' | 'bad';
  streak: number;
  lastChecked: string;
  goal?: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
}