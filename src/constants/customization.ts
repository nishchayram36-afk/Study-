export interface ColorPreset {
  id: string;
  name: string;
  bg: string;
  accent: string;
  border: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: 'sky', name: 'Sky Blue', bg: '#EFF6FF', accent: '#3B82F6', border: '#BFDBFE' },
  { id: 'emerald', name: 'Fresh Mint', bg: '#ECFDF5', accent: '#10B981', border: '#A7F3D0' },
  { id: 'violet', name: 'Lavender', bg: '#F5F3FF', accent: '#8B5CF6', border: '#DDD6FE' },
  { id: 'rose', name: 'Blush Pink', bg: '#FFF1F2', accent: '#F43F5E', border: '#FECDD3' },
  { id: 'amber', name: 'Warm Amber', bg: '#FFFBEB', accent: '#F59E0B', border: '#FDE68A' },
  { id: 'orange', name: 'Sunset Peach', bg: '#FFF7ED', accent: '#F97316', border: '#FED7AA' },
  { id: 'indigo', name: 'Indigo Deep', bg: '#EEF2FF', accent: '#6366F1', border: '#C7D2FE' },
  { id: 'teal', name: 'Ocean Teal', bg: '#F0FDFA', accent: '#14B8A6', border: '#99F6E4' },
  { id: 'slate', name: 'Pebble Slate', bg: '#F8FAFC', accent: '#64748B', border: '#E2E8F0' },
];

export const POPULAR_STUDY_EMOJIS = [
  '📚', '✍️', '🔬', '📐', '💻', '🧠', '🎯', '⚡', 
  '☕', '📖', '📝', '💡', '🎨', '🧪', '🏃', '🏆', 
  '📊', '🎵', '🌿', '⭐', '⏳', '📌', '🔍', '🎓'
];

export const POPULAR_ICONS = [
  { id: 'BookOpen', label: 'Reading' },
  { id: 'PenTool', label: 'Writing' },
  { id: 'Code2', label: 'Coding' },
  { id: 'Atom', label: 'Science' },
  { id: 'Compass', label: 'Math' },
  { id: 'Sparkles', label: 'Focus' },
  { id: 'Target', label: 'Goal' },
  { id: 'Coffee', label: 'Break' },
  { id: 'Flame', label: 'Urgent' },
  { id: 'Calendar', label: 'Schedule' },
  { id: 'CheckCircle2', label: 'Review' },
  { id: 'GraduationCap', label: 'Exam' },
] as const;

export const CATEGORIES = [
  'General',
  'Mathematics',
  'Science',
  'Literature',
  'Computer Science',
  'History',
  'Exam Prep',
  'Assignment',
  'Reading',
] as const;
