import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Coffee, 
  Download, 
  Upload, 
  Trash2, 
  Info, 
  ShieldCheck, 
  Check, 
  Play,
  BookOpen,
  Cloud,
  LogOut,
  User as UserIcon,
  Clock as ClockIcon,
  Tag
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { AppSettings } from '../../types';
import { soundService } from '../../services/sound';
import { UserAuthButton } from '../auth/UserAuthButton';
import { logoutUser } from '../../services/firebase';

interface MoreViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onExportData: () => void;
  onImportData: (json: string) => boolean;
  onResetData: () => void;
  user: FirebaseUser | null;
  onLoginSuccess?: (user: FirebaseUser) => void;
  onLogoutSuccess?: () => void;
  onNavigateToClock?: () => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetData,
  user,
  onLoginSuccess,
  onLogoutSuccess,
  onNavigateToClock,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [handleInput, setHandleInput] = useState(settings.preferredHandle || '');
  const [handleSaved, setHandleSaved] = useState(false);

  const handleSoundToggle = () => {
    onUpdateSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({
      ...settings,
      soundVolume: vol,
    });
  };

  const handleTestSound = () => {
    soundService.playCompletionChime(settings.soundVolume);
  };

  const handleThemeChange = (theme: 'light' | 'midnight' | 'cream') => {
    onUpdateSettings({
      ...settings,
      theme,
    });
  };

  const handleDurationChange = (minutes: number) => {
    onUpdateSettings({
      ...settings,
      defaultFocusDuration: minutes,
    });
  };

  const handleSaveHandle = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      preferredHandle: handleInput.trim(),
    });
    setHandleSaved(true);
    setTimeout(() => setHandleSaved(false), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImportData(content);
      if (success) {
        setImportStatus('Data imported successfully!');
        setTimeout(() => setImportStatus(null), 3000);
      } else {
        setImportStatus('Invalid backup file.');
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          Preferences & Settings
        </h2>
        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
          Tailor StudyFlow to your workflow, identity, audio, and visual comfort.
        </p>
      </div>

      {/* GOOGLE ACCOUNT & CLOUD SYNC */}
      <div className="glass-panel-elevated rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cloud size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                Google Account & Cloud Sync
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {user ? 'Connected and actively synchronizing your study data.' : 'Sign in with Google to sync across all your devices.'}
              </p>
            </div>
          </div>

          <UserAuthButton
            user={user}
            onLoginSuccess={onLoginSuccess}
            onLogoutSuccess={onLogoutSuccess}
          />
        </div>

        {user && (
          <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
            <span className="truncate max-w-[200px]">Logged in as <strong className="text-slate-950 dark:text-white">{user.email}</strong></span>
            <button
              type="button"
              onClick={async () => {
                await logoutUser();
                if (onLogoutSuccess) onLogoutSuccess();
              }}
              className="text-rose-600 dark:text-rose-400 hover:underline font-bold"
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* PERSONAL GREETING & HANDLE */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3 border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">
            Custom Study Handle / Name
          </h3>
        </div>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Personalize the greeting on your dashboard (e.g. "Nishchay", "Mr. Nishchay", "nero.thencis").
        </p>

        <form onSubmit={handleSaveHandle} className="flex items-center gap-2.5 pt-1">
          <input
            type="text"
            placeholder="e.g. Nishchay or nero.thencis"
            value={handleInput}
            onChange={(e) => setHandleInput(e.target.value)}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-semibold"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
          >
            Save Handle
          </button>
        </form>
        {handleSaved && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check size={13} />
            <span>Greeting updated successfully!</span>
          </span>
        )}
      </div>

      {/* CLOCK SHORTCUT */}
      {onNavigateToClock && (
        <div className="glass-panel rounded-3xl p-5 sm:p-6 flex items-center justify-between gap-3 border border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <ClockIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                Precision Analog Clock
              </h3>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                View full-screen Swiss & iOS timepiece with live sweeping seconds.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToClock}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-sm transition-all"
          >
            Open Clock
          </button>
        </div>
      )}

      {/* 1. THEME SELECTION */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3 border border-slate-200/90 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Appearance & Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
              settings.theme === 'light'
                ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Sun size={20} className={settings.theme === 'light' ? 'text-blue-600' : 'text-slate-600'} />
            <span className="text-xs font-bold">Glass Light</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('midnight')}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
              settings.theme === 'midnight'
                ? 'border-blue-500 bg-slate-900 text-blue-400 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Moon size={20} className={settings.theme === 'midnight' ? 'text-blue-400' : 'text-slate-600'} />
            <span className="text-xs font-bold">Midnight</span>
          </button>

          <button
            type="button"
            onClick={() => handleThemeChange('cream')}
            className={`p-3.5 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
              settings.theme === 'cream'
                ? 'border-amber-600 bg-amber-50 text-amber-800 shadow-sm'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Coffee size={20} className={settings.theme === 'cream' ? 'text-amber-700' : 'text-slate-600'} />
            <span className="text-xs font-bold">Warm Cream</span>
          </button>

        </div>
      </div>

      {/* 2. SOUND PREFERENCES */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">
              Sound Feedback & Chimes
            </h3>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Tibetan singing bowl chime on timer completion and gentle UI snaps.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSoundToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              settings.soundEnabled
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{settings.soundEnabled ? 'Enabled' : 'Muted'}</span>
          </button>
        </div>

        {settings.soundEnabled && (
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Volume</span>
                <span className="tabular-nums font-bold text-slate-900 dark:text-white">{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button
              type="button"
              onClick={handleTestSound}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Play size={13} />
              <span>Test Chime</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. TIMER PREFERENCES */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3 border border-slate-200/90 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-950 dark:text-white">
          Default Focus Duration
        </h3>
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Standard session length loaded when opening the Timer.
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {[15, 25, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => handleDurationChange(mins)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                settings.defaultFocusDuration === mins
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-slate-950 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {mins} Minutes
            </button>
          ))}
        </div>
      </div>

      {/* 4. DATA MANAGEMENT & BACKUP */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">
            Data Storage & Backup
          </h3>
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Export JSON backup or transfer study records across environments.
          </p>
        </div>

        {importStatus && (
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 text-xs font-bold text-center">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download size={14} />
            <span>Export Backup (JSON)</span>
          </button>

          <label className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700">
            <Upload size={14} />
            <span>Import Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors border border-rose-300 dark:border-rose-900/60 ml-auto"
          >
            <Trash2 size={14} />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="glass-panel-elevated rounded-3xl max-w-sm w-full p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <Trash2 size={24} />
            </div>
            <h4 className="text-base font-bold text-slate-950 dark:text-white">
              Reset all StudyFlow data?
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              This will clear your tasks, timetable items, and reset settings back to default. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetData();
                  setShowResetConfirm(false);
                }}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-sm"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ABOUT STUDYFLOW */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-3 border border-slate-200/90 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm ring-1 ring-white/50">
            <BookOpen size={18} strokeWidth={2.4} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-950 dark:text-white leading-tight">
              StudyFlow
            </h4>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Personal Student Planner & Focus
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed pt-1">
          StudyFlow is a personal student productivity app crafted for deep focus, clear day planning, and serene time management.
        </p>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-400 pt-1">
          <span>Version 2.0</span>
          <span>·</span>
          <span>Offline-First</span>
          <span>·</span>
          <span>100% Private</span>
        </div>
      </div>

    </div>
  );
};
