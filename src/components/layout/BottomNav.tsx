import React from 'react';
import { Calendar, Timer, Clock, MoreHorizontal, Plus } from 'lucide-react';
import { NavTab } from '../../types';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCreate: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreate,
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        {/* 1. Planner */}
        <button
          type="button"
          onClick={() => onSelectTab('planner')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 ${
            currentTab === 'planner'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 font-semibold'
          }`}
          aria-label="Planner Tab"
        >
          <div className="relative">
            <Calendar size={21} strokeWidth={currentTab === 'planner' ? 2.5 : 2} />
            {currentTab === 'planner' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1 font-bold">Planner</span>
        </button>

        {/* 2. Timer */}
        <button
          type="button"
          onClick={() => onSelectTab('timer')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 ${
            currentTab === 'timer'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 font-semibold'
          }`}
          aria-label="Timer Tab"
        >
          <div className="relative">
            <Timer size={21} strokeWidth={currentTab === 'timer' ? 2.5 : 2} />
            {currentTab === 'timer' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1 font-bold">Timer</span>
        </button>

        {/* 3. Center Create (+) - Floating Glass Button with depth */}
        <div className="flex items-center justify-center h-full">
          <button
            type="button"
            onClick={onOpenCreate}
            className="group relative -top-3.5 flex items-center justify-center w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white shadow-[0_8px_20px_-3px_rgba(37,99,235,0.45),0_3px_6px_0_rgba(0,0,0,0.1),inset_0_1px_1px_0_rgba(255,255,255,0.4)] border border-blue-400/40 active:scale-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Create Task or Planner"
          >
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus size={26} strokeWidth={2.7} className="transition-transform duration-200 group-hover:rotate-90 group-active:scale-95 drop-shadow-sm" />
          </button>
        </div>

        {/* 4. Clock */}
        <button
          type="button"
          onClick={() => onSelectTab('clock')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 ${
            currentTab === 'clock'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 font-semibold'
          }`}
          aria-label="Clock Tab"
        >
          <div className="relative">
            <Clock size={21} strokeWidth={currentTab === 'clock' ? 2.5 : 2} />
            {currentTab === 'clock' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1 font-bold">Clock</span>
        </button>

        {/* 5. More */}
        <button
          type="button"
          onClick={() => onSelectTab('more')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-all duration-200 active:scale-95 ${
            currentTab === 'more'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-700 hover:text-slate-950 dark:text-slate-300 font-semibold'
          }`}
          aria-label="Settings and More Tab"
        >
          <div className="relative">
            <MoreHorizontal size={21} strokeWidth={currentTab === 'more' ? 2.5 : 2} />
            {currentTab === 'more' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
          </div>
          <span className="text-[11px] tracking-tight mt-1 font-bold">More</span>
        </button>
      </div>
    </nav>
  );
};
