export type Priority = 'low' | 'medium' | 'high';

export type TaskCategory = 
  | 'General'
  | 'Mathematics'
  | 'Science'
  | 'Literature'
  | 'Computer Science'
  | 'History'
  | 'Exam Prep'
  | 'Assignment'
  | 'Reading';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  completed: boolean;
  completedAt?: string;
  emoji: string;
  iconName?: string;
  bgColor: string; // hex or tailwind class
  accentColor: string;
  priority: Priority;
  category: TaskCategory;
  createdAt: string;
}

export interface PlannerItem {
  id: string;
  title: string;
  dayOfWeek?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location?: string;
  subject: string;
  notes?: string;
  color: string;
  completed?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'midnight' | 'cream';
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  clockFormat: '12h' | '24h';
  showClockSeconds: boolean;
  defaultFocusDuration: number; // minutes
  totalFocusMinutesCompleted: number;
  completedTasksCount: number;
  streakDays: number;
  lastActiveDate: string;
  preferredHandle?: string;
}

export type NavTab = 'planner' | 'timer' | 'clock' | 'more';
