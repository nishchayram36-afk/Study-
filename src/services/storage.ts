import { Task, PlannerItem, AppSettings } from '../types';

const TASKS_KEY = 'studyflow_tasks_v2';
const PLANNER_KEY = 'studyflow_planner_v2';
const SETTINGS_KEY = 'studyflow_settings_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  soundEnabled: true,
  soundVolume: 0.7,
  clockFormat: '12h',
  showClockSeconds: true,
  defaultFocusDuration: 25,
  totalFocusMinutesCompleted: 75,
  completedTasksCount: 4,
  streakDays: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

// High quality initial tasks for a realistic, immediately engaging experience
export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review Discrete Mathematics Chapter 4',
    description: 'Solve recurrence relations and proof by induction problems for Friday lecture quiz.',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    completed: false,
    emoji: '📐',
    bgColor: '#EFF6FF', // Sky/blue
    accentColor: '#3B82F6',
    priority: 'high',
    category: 'Mathematics',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Organic Chemistry Lab Report Draft',
    description: 'Summarize titration curves and calculate unknown molar concentration values.',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    completed: false,
    emoji: '🧪',
    bgColor: '#F0FDF4', // Mint/green
    accentColor: '#10B981',
    priority: 'medium',
    category: 'Science',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Read 25 Pages: Modern World History',
    description: 'Take Cornell notes on the Industrial Revolution trade routes and urban shifts.',
    date: new Date().toISOString().split('T')[0],
    time: '17:00',
    completed: true,
    completedAt: new Date().toISOString(),
    emoji: '📖',
    bgColor: '#FFFBEB', // Amber
    accentColor: '#F59E0B',
    priority: 'low',
    category: 'History',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Algorithm Design: Binary Trees & Heaps',
    description: 'Implement Dijkstra shortest path algorithm and optimize priority queue lookup.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    completed: false,
    emoji: '💻',
    bgColor: '#F5F3FF', // Purple
    accentColor: '#8B5CF6',
    priority: 'high',
    category: 'Computer Science',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Flashcards: French Vocabulary Drill',
    description: 'Memorize 30 irregular past participles and subjunctive clauses.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '16:00',
    completed: false,
    emoji: '✍️',
    bgColor: '#FDF2F8', // Pink
    accentColor: '#EC4899',
    priority: 'low',
    category: 'Literature',
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_PLANNER_ITEMS: PlannerItem[] = [
  {
    id: 'plan-1',
    title: 'Linear Algebra Lecture',
    subject: 'Mathematics',
    startTime: '09:00',
    endTime: '10:15',
    location: 'Hall B - Room 204',
    notes: 'Eigenvalues and Diagonalization proofs',
    color: '#3B82F6',
    date: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 'plan-2',
    title: 'Deep Focus: Problem Set 3',
    subject: 'Self Study',
    startTime: '10:45',
    endTime: '12:15',
    location: 'Library 3rd Floor Quiet Zone',
    notes: 'Work through problem set questions 1 to 8 without phone distractions',
    color: '#10B981',
    date: new Date().toISOString().split('T')[0],
    completed: false,
  },
  {
    id: 'plan-3',
    title: 'CS Data Structures Lab',
    subject: 'Computer Science',
    startTime: '13:30',
    endTime: '15:00',
    location: 'Turing Computer Lab 102',
    notes: 'Submit lab exercise code to Git repo',
    color: '#8B5CF6',
    date: new Date().toISOString().split('T')[0],
    completed: false,
  }
];

export const storage = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
    }
  },

  getPlannerItems(): PlannerItem[] {
    try {
      const data = localStorage.getItem(PLANNER_KEY);
      if (!data) {
        localStorage.setItem(PLANNER_KEY, JSON.stringify(INITIAL_PLANNER_ITEMS));
        return INITIAL_PLANNER_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PLANNER_ITEMS;
    }
  },

  savePlannerItems(items: PlannerItem[]): void {
    try {
      localStorage.setItem(PLANNER_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving planner items to localStorage:', err);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error('Error saving settings to localStorage:', err);
    }
  },

  exportAllData(): string {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      planner: this.getPlannerItems(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.tasks)) {
        this.saveTasks(parsed.tasks);
      }
      if (Array.isArray(parsed.planner)) {
        this.savePlannerItems(parsed.planner);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        this.saveSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
      }
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },

  resetAll(): void {
    try {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(PLANNER_KEY);
      localStorage.removeItem(SETTINGS_KEY);
    } catch (err) {
      console.error('Reset failed:', err);
    }
  }
};
