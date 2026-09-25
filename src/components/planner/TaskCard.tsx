import React from 'react';
import { Check, Clock, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Task } from '../../types';
import { IconSquircle } from '../ui/IconSquircle';
import confetti from 'canvas-confetti';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  soundEnabled?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed) {
      try {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 28,
          spread: 60,
          origin: { x, y },
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'],
          disableForReducedMotion: true,
          ticks: 180,
          gravity: 1.2,
          scalar: 0.8,
        });
      } catch {
        // Safe fallback
      }
    }
    onToggleComplete(task.id);
  };

  const priorityMeta = {
    high: { label: 'High Priority', color: 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800' },
    medium: { label: 'Medium Priority', color: 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800' },
    low: { label: 'Low Priority', color: 'text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700' },
  }[task.priority || 'medium'];

  return (
    <div
      className={`group relative rounded-2xl p-4 transition-all duration-200 border ${
        task.completed
          ? 'bg-white/60 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
          : 'glass-panel border-slate-200/90 dark:border-slate-800 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* Custom iOS Checkbox */}
        <button
          type="button"
          onClick={handleToggle}
          className={`shrink-0 mt-1 flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            task.completed
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
              : 'border-2 border-slate-400 dark:border-slate-500 hover:border-blue-600 bg-white dark:bg-slate-800'
          }`}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
        >
          {task.completed && <Check size={14} strokeWidth={3} className="animate-in zoom-in-50 duration-150" />}
        </button>

        {/* 3D Emoji / Icon Squircle */}
        <IconSquircle
          emoji={task.emoji}
          iconName={task.iconName}
          bgColor={task.bgColor}
          accentColor={task.accentColor}
          size="md"
        />

        {/* Content details with high contrast */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                className={`text-sm sm:text-base font-bold tracking-tight transition-all duration-200 leading-snug ${
                  task.completed
                    ? 'line-through text-slate-500 dark:text-slate-400 font-normal'
                    : 'text-slate-950 dark:text-white'
                }`}
              >
                {task.title}
              </h3>
            </div>

            {/* Actions: Edit / Delete */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Edit task"
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`text-xs mt-1.5 leading-relaxed font-medium transition-colors ${
                task.completed
                  ? 'text-slate-500 line-through dark:text-slate-400'
                  : 'text-slate-800 dark:text-slate-200'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* High-Contrast Metadata row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2.5 text-xs text-slate-700 dark:text-slate-300 font-semibold">
            {task.category && (
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {task.category}
              </span>
            )}
            
            {task.time && (
              <>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">·</span>
                <span className="inline-flex items-center gap-1 tabular-nums text-slate-800 dark:text-slate-200">
                  <Clock size={12} className="text-slate-600 dark:text-slate-400" />
                  {task.time}
                </span>
              </>
            )}

            {task.date && (
              <>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">·</span>
                <span className="tabular-nums text-slate-800 dark:text-slate-200">
                  {task.date}
                </span>
              </>
            )}

            {task.priority && task.priority !== 'low' && (
              <>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-500">·</span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border ${priorityMeta.color}`}>
                  <AlertCircle size={10} />
                  {task.priority.toUpperCase()}
                </span>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
