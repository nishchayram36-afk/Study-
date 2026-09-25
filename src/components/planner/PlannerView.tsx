import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ListFilter, 
  Plus, 
  BookOpen,
  Search,
  Check,
  Edit3
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { Task, PlannerItem } from '../../types';
import { TaskCard } from './TaskCard';
import { ScheduleCard } from './ScheduleCard';

type FilterType = 'all' | 'today' | 'upcoming' | 'completed';
type PlannerSubView = 'tasks' | 'schedule';

interface PlannerViewProps {
  tasks: Task[];
  plannerItems: PlannerItem[];
  onToggleCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeletePlannerItem: (id: string) => void;
  onTogglePlannerItem?: (id: string) => void;
  onOpenCreate: (initialMode?: 'task' | 'planner') => void;
  streakDays: number;
  focusMinutesToday: number;
  user: FirebaseUser | null;
  preferredHandle?: string;
  onUpdatePreferredHandle?: (handle: string) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  tasks,
  plannerItems,
  onToggleCompleteTask,
  onDeleteTask,
  onEditTask,
  onDeletePlannerItem,
  onTogglePlannerItem,
  onOpenCreate,
  user,
  preferredHandle,
  onUpdatePreferredHandle,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [activeSubView, setActiveSubView] = useState<PlannerSubView>('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  // Today's date string and display format
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const formattedToday = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(new Date());
  }, []);

  // Personalized dynamic greeting: "Hello Mr. [Name/nero.thencis]"
  const userSalutation = useMemo(() => {
    if (preferredHandle && preferredHandle.trim()) {
      return `Hello Mr. ${preferredHandle.trim()}`;
    }
    if (user) {
      if (user.displayName) {
        const firstName = user.displayName.split(' ')[0];
        return `Hello Mr. ${firstName}`;
      }
      if (user.email) {
        const handle = user.email.split('@')[0];
        return `Hello Mr. ${handle}`;
      }
    }
    return 'Hello, Scholar';
  }, [user, preferredHandle]);

  // Genuine task completion metrics
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const pendingCount = totalTasksCount - completedCount;

  // Filter tasks reactively
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCategory = task.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }

      if (filter === 'all') return true;
      if (filter === 'completed') return task.completed;
      if (filter === 'today') return task.date === todayStr && !task.completed;
      if (filter === 'upcoming') return task.date > todayStr && !task.completed;
      return true;
    });
  }, [tasks, filter, searchQuery, todayStr]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim() && onUpdatePreferredHandle) {
      onUpdatePreferredHandle(nameInput.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Reactive Vibe Header: Clean, High-Contrast, Personal Greeting */}
      <section className="glass-panel-elevated rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-slate-200/90 dark:border-slate-800 transition-all duration-300">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              <Sparkles size={14} className="text-blue-600 animate-pulse" />
              <span>{formattedToday}</span>
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter name (e.g. Nishchay, nero.thencis)"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="text-lg sm:text-2xl font-black px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-blue-600 text-slate-950 dark:text-white focus:outline-none shadow-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 shadow-xs"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2.5 pt-0.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  {userSalutation}
                </h1>
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(preferredHandle || (user?.displayName?.split(' ')[0] ?? ''));
                    setIsEditingName(true);
                  }}
                  className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                  title="Edit greeting name"
                >
                  <Edit3 size={15} />
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 max-w-md pt-0.5">
              Your personal study workspace. Plan your sessions, track assignments, and focus smoothly.
            </p>
          </div>

          {/* Genuine Task Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="glass-panel px-4 py-2.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-950 dark:text-white tabular-nums">
                  {completedCount} / {totalTasksCount} completed
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {pendingCount === 0 && totalTasksCount > 0 ? 'All caught up! 🎉' : `${pendingCount} tasks remaining`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reactive Sub-View Switcher: Tasks vs Daily Schedule */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800/80 rounded-2xl w-fit border border-slate-300/70 dark:border-slate-700/70">
          <button
            type="button"
            onClick={() => setActiveSubView('tasks')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeSubView === 'tasks'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>Tasks ({tasks.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('schedule')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              activeSubView === 'schedule'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <CalendarIcon size={15} />
            <span>Schedule ({plannerItems.length})</span>
          </button>
        </div>

        {/* Quick Add Action Button */}
        <div>
          {activeSubView === 'tasks' ? (
            <button
              type="button"
              onClick={() => onOpenCreate('task')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Task</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenCreate('planner')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add Schedule Block</span>
            </button>
          )}
        </div>
      </div>

      {/* TASKS SUB-VIEW */}
      {activeSubView === 'tasks' && (
        <div className="space-y-4">
          
          {/* Reactive Filters & Live Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(['all', 'today', 'upcoming', 'completed'] as FilterType[]).map((tabKey) => {
                const label = tabKey.charAt(0).toUpperCase() + tabKey.slice(1);
                const count = 
                  tabKey === 'all' ? tasks.length :
                  tabKey === 'today' ? tasks.filter(t => t.date === todayStr && !t.completed).length :
                  tabKey === 'upcoming' ? tasks.filter(t => t.date > todayStr && !t.completed).length :
                  tasks.filter(t => t.completed).length;

                return (
                  <button
                    key={tabKey}
                    type="button"
                    onClick={() => setFilter(tabKey)}
                    className={`px-3.5 py-1.5 text-xs rounded-xl whitespace-nowrap transition-all duration-150 font-bold ${
                      filter === tabKey
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300/80 dark:border-slate-700/80'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="ml-1.5 tabular-nums text-[11px] opacity-80">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* High-Contrast Search Input */}
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Reactive Task Cards List */}
          {filteredTasks.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 text-center space-y-3 border border-slate-200/90 dark:border-slate-800">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                <ListFilter size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'today'
                  ? 'No tasks scheduled for today'
                  : 'No tasks found'}
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-sm mx-auto">
                {filter === 'completed'
                  ? 'Finish items on your to-do list to celebrate your wins here!'
                  : 'Add a new study assignment, review milestone, or exam goal to get started.'}
              </p>
              {filter !== 'completed' && (
                <button
                  type="button"
                  onClick={() => onOpenCreate('task')}
                  className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition-all active:scale-95"
                >
                  <Plus size={15} />
                  <span>Create New Task</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleCompleteTask}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* SCHEDULE / TIMETABLE SUB-VIEW */}
      {activeSubView === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                Daily Study Timetable
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Organized classes, study blocks, and laboratory sessions.
              </p>
            </div>
          </div>

          {plannerItems.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 text-center space-y-3 border border-slate-200/90 dark:border-slate-800">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                <BookOpen size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                No schedule blocks created yet
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 max-w-sm mx-auto">
                Structure your day with dedicated study sessions, lectures, and revision periods.
              </p>
              <button
                type="button"
                onClick={() => onOpenCreate('planner')}
                className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition-all active:scale-95"
              >
                <Plus size={15} />
                <span>Add First Schedule Block</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {plannerItems.map((item) => (
                <ScheduleCard
                  key={item.id}
                  item={item}
                  onDelete={onDeletePlannerItem}
                  onToggleComplete={onTogglePlannerItem}
                />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
