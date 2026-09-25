import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { Task, Priority, TaskCategory } from '../../types';
import { 
  POPULAR_STUDY_EMOJIS, 
  POPULAR_ICONS, 
  COLOR_PRESETS, 
  CATEGORIES 
} from '../../constants/customization';
import { IconSquircle } from '../ui/IconSquircle';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (updated: Task) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSaveTask,
}) => {
  if (!isOpen || !task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [date, setDate] = useState(task.date);
  const [time, setTime] = useState(task.time || '');
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [category, setCategory] = useState<TaskCategory>(task.category);

  const [emoji, setEmoji] = useState(task.emoji);
  const [iconName, setIconName] = useState<string | undefined>(task.iconName);
  const [activeTab, setActiveTab] = useState<'emoji' | 'icon'>(task.iconName ? 'icon' : 'emoji');
  
  const initialPreset = COLOR_PRESETS.find(p => p.accent === task.accentColor) || COLOR_PRESETS[0];
  const [selectedColorPreset, setSelectedColorPreset] = useState(initialPreset);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveTask({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      priority,
      category,
      emoji: emoji || '📚',
      iconName,
      bgColor: selectedColorPreset.bg,
      accentColor: selectedColorPreset.accent,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/60 dark:border-slate-800 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Edit Task
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-start gap-3">
            <IconSquircle
              emoji={emoji}
              iconName={iconName}
              bgColor={selectedColorPreset.bg}
              accentColor={selectedColorPreset.accent}
              size="lg"
            />
            <div className="flex-1 space-y-1">
              <label htmlFor="edit-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Task Title
              </label>
              <input
                id="edit-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-desc" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="edit-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label htmlFor="edit-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Date
              </label>
              <input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="edit-time" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Time
              </label>
              <input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="edit-priority" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-category" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/30 outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Quick emoji selection */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Emoji or Icon
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('emoji')}
                  className={`px-2 py-0.5 rounded-md ${activeTab === 'emoji' ? 'bg-white dark:bg-slate-900 text-blue-600' : 'text-slate-500'}`}
                >
                  Emoji
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('icon')}
                  className={`px-2 py-0.5 rounded-md ${activeTab === 'icon' ? 'bg-white dark:bg-slate-900 text-blue-600' : 'text-slate-500'}`}
                >
                  Icon
                </button>
              </div>
            </div>

            {activeTab === 'emoji' ? (
              <div className="grid grid-cols-8 gap-1.5 max-h-24 overflow-y-auto">
                {POPULAR_STUDY_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      setEmoji(em);
                      setIconName(undefined);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      emoji === em && !iconName ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {POPULAR_ICONS.slice(0, 8).map((it) => (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => {
                      setIconName(it.id);
                      setEmoji('');
                    }}
                    className={`p-1.5 rounded-lg border text-[11px] text-center ${
                      iconName === it.id ? 'border-blue-500 bg-blue-50 text-blue-600 font-semibold' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            )}

            {/* Colors */}
            <div className="flex items-center gap-2 pt-1">
              {COLOR_PRESETS.map((cp) => (
                <button
                  key={cp.id}
                  type="button"
                  onClick={() => setSelectedColorPreset(cp)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{ backgroundColor: cp.accent }}
                >
                  {selectedColorPreset.id === cp.id && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
