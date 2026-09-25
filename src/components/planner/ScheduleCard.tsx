import React from 'react';
import { Clock, MapPin, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { PlannerItem } from '../../types';

interface ScheduleCardProps {
  item: PlannerItem;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  item,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <div
      className="group relative rounded-2xl p-4 glass-panel hover:shadow-md transition-all duration-200 border-l-4"
      style={{ borderLeftColor: item.color || '#3B82F6' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {onToggleComplete && (
            <button
              type="button"
              onClick={() => onToggleComplete(item.id)}
              className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
              aria-label={item.completed ? 'Mark class incomplete' : 'Mark class complete'}
            >
              {item.completed ? (
                <CheckCircle2 size={18} className="text-emerald-500 fill-emerald-50" />
              ) : (
                <Circle size={18} />
              )}
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {item.subject}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="inline-flex items-center gap-1 text-xs font-medium tabular-nums text-blue-600 dark:text-blue-400">
                <Clock size={12} />
                {item.startTime} - {item.endTime}
              </span>
            </div>

            <h4 className={`text-base font-semibold mt-1 tracking-tight text-slate-900 dark:text-white ${
              item.completed ? 'line-through text-slate-400' : ''
            }`}>
              {item.title}
            </h4>

            {item.location && (
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                <MapPin size={12} className="text-slate-400 shrink-0" />
                <span>{item.location}</span>
              </div>
            )}

            {item.notes && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed bg-slate-50/80 dark:bg-slate-800/50 p-2 rounded-xl">
                {item.notes}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
          aria-label="Delete schedule block"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};
