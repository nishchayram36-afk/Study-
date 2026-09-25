import React, { useState } from 'react';
import { X, Calendar, Clock, Check, Plus, BookOpen } from 'lucide-react';
import { Task, PlannerItem, Priority, TaskCategory } from '../../types';
import { 
  POPULAR_STUDY_EMOJIS, 
  POPULAR_ICONS, 
  COLOR_PRESETS, 
  CATEGORIES 
} from '../../constants/customization';
import { IconSquircle } from '../ui/IconSquircle';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCreatePlannerItem: (item: Omit<PlannerItem, 'id'>) => void;
  initialMode?: 'task' | 'planner';
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCreateTask,
  onCreatePlannerItem,
  initialMode = 'task',
}) => {
  const [mode, setMode] = useState<'task' | 'planner'>(initialMode);

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [taskTime, setTaskTime] = useState('14:00');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('General');

  // Custom Emoji & Icon selection state
  const [selectedEmoji, setSelectedEmoji] = useState('📚');
  const [selectedIconName, setSelectedIconName] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'emoji' | 'icon'>('emoji');
  const [customEmojiInput, setCustomEmojiInput] = useState('');
  const [selectedColorPreset, setSelectedColorPreset] = useState(COLOR_PRESETS[0]);

  // Planner form state
  const [planTitle, setPlanTitle] = useState('');
  const [planSubject, setPlanSubject] = useState('Mathematics');
  const [planDate, setPlanDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [planStartTime, setPlanStartTime] = useState('09:00');
  const [planEndTime, setPlanEndTime] = useState('10:30');
  const [planLocation, setPlanLocation] = useState('');
  const [planNotes, setPlanNotes] = useState('');
  const [planColor, setPlanColor] = useState('#3B82F6');

  if (!isOpen) return null;

  const handleCustomEmojiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomEmojiInput(val);
    if (val.trim()) {
      setSelectedEmoji(val.trim());
      setSelectedIconName(undefined);
    }
  };

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
    setSelectedIconName(undefined);
    setCustomEmojiInput('');
  };

  const handleSelectIcon = (iconId: string) => {
    setSelectedIconName(iconId);
    setSelectedEmoji('');
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onCreateTask({
      title: taskTitle.trim(),
      description: taskDesc.trim() || undefined,
      date: taskDate,
      time: taskTime || undefined,
      completed: false,
      emoji: selectedEmoji || '📚',
      iconName: selectedIconName,
      bgColor: selectedColorPreset.bg,
      accentColor: selectedColorPreset.accent,
      priority: taskPriority,
      category: taskCategory,
    });

    // Reset & close
    setTaskTitle('');
    setTaskDesc('');
    onClose();
  };

  const handleSubmitPlanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planTitle.trim()) return;

    onCreatePlannerItem({
      title: planTitle.trim(),
      subject: planSubject,
      date: planDate,
      startTime: planStartTime,
      endTime: planEndTime,
      location: planLocation.trim() || undefined,
      notes: planNotes.trim() || undefined,
      color: planColor,
      completed: false,
    });

    // Reset & close
    setPlanTitle('');
    setPlanLocation('');
    setPlanNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md transition-opacity">
      <div 
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/60 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom duration-250"
      >
        {/* Mobile drag affordance */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          {/* Mode Switcher: New Task vs New Planner */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                mode === 'task'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Plus size={14} />
              <span>New Task</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('planner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                mode === 'planner'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              <Calendar size={14} />
              <span>New Planner</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {mode === 'task' ? (
            <form id="create-task-form" onSubmit={handleSubmitTask} className="space-y-5">
              
              {/* Live Preview & Title Row */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <IconSquircle
                    emoji={selectedEmoji}
                    iconName={selectedIconName}
                    bgColor={selectedColorPreset.bg}
                    accentColor={selectedColorPreset.accent}
                    size="lg"
                  />
                  <span className="text-[10px] text-slate-400 font-medium">Badge</span>
                </div>

                <div className="flex-1 space-y-1">
                  <label htmlFor="task-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Task Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    required
                    placeholder="e.g. Read Physics Chapter 7"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes & Details (Optional)
                </label>
                <textarea
                  id="task-desc"
                  rows={2}
                  placeholder="Key concepts, practice problems, or links..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              {/* Date, Time & Priority */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label htmlFor="task-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Date
                  </label>
                  <input
                    id="task-date"
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="task-time" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Time
                  </label>
                  <input
                    id="task-time"
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="task-priority" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label htmlFor="task-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subject Category
                </label>
                <select
                  id="task-category"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* CUSTOM EMOJI & ICON SYSTEM */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Icon & Color Styling
                  </span>
                  
                  {/* Toggle emoji vs clean vector icon */}
                  <div className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setActiveTab('emoji')}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        activeTab === 'emoji' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Emoji
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('icon')}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        activeTab === 'icon' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Vector Icon
                    </button>
                  </div>
                </div>

                {activeTab === 'emoji' ? (
                  <div className="space-y-2.5">
                    {/* Custom emoji input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="Type or paste custom emoji..."
                        value={customEmojiInput}
                        onChange={handleCustomEmojiChange}
                        className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 flex-1"
                      />
                    </div>

                    {/* Popular study emojis grid */}
                    <div className="grid grid-cols-8 gap-1.5">
                      {POPULAR_STUDY_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleSelectEmoji(emoji)}
                          className={`w-9 h-9 flex items-center justify-center rounded-xl text-lg transition-transform active:scale-90 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                            selectedEmoji === emoji && !selectedIconName
                              ? 'ring-2 ring-blue-500 bg-blue-50/80 dark:bg-blue-950/60 shadow-xs scale-105'
                              : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Vector icons grid */
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {POPULAR_ICONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectIcon(item.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                          selectedIconName === item.id
                            ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/50 text-blue-600 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Circular Color Swatches */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Pastel Accent Color
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = selectedColorPreset.id === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSelectedColorPreset(preset)}
                          title={preset.name}
                          className="relative shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                          style={{
                            backgroundColor: preset.accent,
                          }}
                        >
                          {isSelected && (
                            <Check size={14} className="text-white drop-shadow-sm" strokeWidth={3} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </form>
          ) : (
            /* PLANNER SCHEDULE FORM (Manual creation, NO AI timetable generator) */
            <form id="create-planner-form" onSubmit={handleSubmitPlanner} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="plan-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Block Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="plan-title"
                  type="text"
                  required
                  placeholder="e.g. Calculus Lecture & Review"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="plan-subject" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject / Area
                  </label>
                  <input
                    id="plan-subject"
                    type="text"
                    value={planSubject}
                    onChange={(e) => setPlanSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="plan-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Date
                  </label>
                  <input
                    id="plan-date"
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="plan-start" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Start Time
                  </label>
                  <input
                    id="plan-start"
                    type="time"
                    value={planStartTime}
                    onChange={(e) => setPlanStartTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="plan-end" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    End Time
                  </label>
                  <input
                    id="plan-end"
                    type="time"
                    value={planEndTime}
                    onChange={(e) => setPlanEndTime(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="plan-location" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Location / Room (Optional)
                </label>
                <input
                  id="plan-location"
                  type="text"
                  placeholder="e.g. Science Building 302 or Library Room 4"
                  value={planLocation}
                  onChange={(e) => setPlanLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="plan-notes" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Study Goals & Notes
                </label>
                <textarea
                  id="plan-notes"
                  rows={2}
                  placeholder="Goals for this study block..."
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
                />
              </div>

              {/* Color tag picker */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Color Tag
                </span>
                <div className="flex items-center gap-2">
                  {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#6366F1'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPlanColor(c)}
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-90"
                      style={{ backgroundColor: c }}
                    >
                      {planColor === c && <Check size={12} className="text-white" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            form={mode === 'task' ? 'create-task-form' : 'create-planner-form'}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm shadow-blue-500/30 active:scale-95 transition-all"
          >
            {mode === 'task' ? 'Create Task' : 'Save Schedule Block'}
          </button>
        </div>

      </div>
    </div>
  );
};
