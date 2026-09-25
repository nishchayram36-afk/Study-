import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, CheckCircle2, Volume2, Sparkles, Plus, Minus } from 'lucide-react';
import { soundService } from '../../services/sound';
import confetti from 'canvas-confetti';

interface TimerViewProps {
  onSessionComplete: (minutes: number) => void;
  soundEnabled: boolean;
  soundVolume: number;
}

export const TimerView: React.FC<TimerViewProps> = ({
  onSessionComplete,
  soundEnabled,
  soundVolume,
}) => {
  // Input configuration (custom hours, minutes, seconds)
  const [setHours, setSetHours] = useState(0);
  const [setMinutes, setSetMinutes] = useState(25);
  const [setSeconds, setSetSeconds] = useState(0);

  // Runtime state
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [hasNotificationPermission, setHasNotificationPermission] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });

  const timerRef = useRef<number | null>(null);

  // Sync initial seconds when custom inputs change while idle
  useEffect(() => {
    if (status === 'idle') {
      const calculated = (setHours * 3600) + (setMinutes * 60) + setSeconds;
      const validTotal = Math.max(calculated, 1);
      setTotalSeconds(validTotal);
      setSecondsRemaining(validTotal);
    }
  }, [setHours, setMinutes, setSeconds, status]);

  // Main countdown ticker
  useEffect(() => {
    if (status === 'running') {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status]);

  const handleComplete = () => {
    setStatus('completed');
    if (timerRef.current) clearInterval(timerRef.current);

    // Audio chime
    if (soundEnabled) {
      soundService.playCompletionChime(soundVolume);
    }

    // Confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
      });
    } catch {
      // ignore
    }

    // Optional notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('StudyFlow Timer Complete! 🎉', {
          body: 'Great focus session! Take a restorative breath or short break.',
          icon: '/favicon.ico',
        });
      } catch {
        // ignore
      }
    }

    // Log focus minutes
    const focusedMinutes = Math.max(1, Math.round(totalSeconds / 60));
    onSessionComplete(focusedMinutes);
  };

  const requestNotification = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((res) => {
        if (res === 'granted') {
          setHasNotificationPermission(true);
        }
      });
    }
  };

  const handleStart = () => {
    if (secondsRemaining <= 0) {
      const calculated = (setHours * 3600) + (setMinutes * 60) + setSeconds;
      setSecondsRemaining(calculated > 0 ? calculated : 25 * 60);
    }
    if (soundEnabled) soundService.playSoftClick(soundVolume);
    setStatus('running');
  };

  const handlePause = () => {
    if (soundEnabled) soundService.playSoftClick(soundVolume);
    setStatus('paused');
  };

  const handleResume = () => {
    if (soundEnabled) soundService.playSoftClick(soundVolume);
    setStatus('running');
  };

  const handleReset = () => {
    if (soundEnabled) soundService.playSoftClick(soundVolume);
    setStatus('idle');
    const calculated = (setHours * 3600) + (setMinutes * 60) + setSeconds;
    const validTotal = Math.max(calculated, 1);
    setTotalSeconds(validTotal);
    setSecondsRemaining(validTotal);
  };

  const applyPreset = (minutes: number) => {
    if (soundEnabled) soundService.playSoftClick(soundVolume);
    setStatus('idle');
    setSetHours(0);
    setSetMinutes(minutes);
    setSetSeconds(0);
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
  };

  // Adjusters for hours/minutes/seconds
  const adjustValue = (type: 'h' | 'm' | 's', delta: number) => {
    if (status !== 'idle') return;
    if (soundEnabled) soundService.playSoftClick(soundVolume * 0.7);

    if (type === 'h') {
      setSetHours((prev) => Math.max(0, Math.min(23, prev + delta)));
    } else if (type === 'm') {
      setSetMinutes((prev) => Math.max(0, Math.min(59, prev + delta)));
    } else {
      setSetSeconds((prev) => Math.max(0, Math.min(59, prev + delta)));
    }
  };

  // Time format calculations
  const displayHours = Math.floor(secondsRemaining / 3600);
  const displayMinutes = Math.floor((secondsRemaining % 3600) / 60);
  const displaySeconds = secondsRemaining % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  // SVG Progress Ring calculations
  const progressRatio = totalSeconds > 0 ? (secondsRemaining / totalSeconds) : 0;
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressRatio);

  return (
    <div className="max-w-2xl mx-auto space-y-7 pb-20">
      
      {/* Header Info */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Study Focus Timer
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          User-controlled deep study intervals. Maintain uninterrupted concentration.
        </p>
      </div>

      {/* Main Glass Circular Timer Card */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
        {/* Soft background glow */}
        <div className={`absolute inset-0 bg-blue-500/5 dark:bg-blue-400/5 transition-opacity duration-700 pointer-events-none ${
          status === 'running' ? 'opacity-100' : 'opacity-0'
        }`} />

        {/* Circular Progress Ring */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-2 select-none">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            {/* Background ring track */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-100 dark:text-slate-800"
              fill="none"
            />
            {/* Dynamic animated progress stroke */}
            <circle
              cx="150"
              cy="150"
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Digital Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            {status === 'completed' ? (
              <div className="flex flex-col items-center animate-in zoom-in-75 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 shadow-sm">
                  <CheckCircle2 size={36} strokeWidth={2.5} />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Session Done!
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Brilliant study focus.
                </span>
              </div>
            ) : (
              <>
                {/* Timer numbers in solid deep black for the first theme (high contrast) */}
                <div className="text-5xl sm:text-6xl font-black tracking-tight text-black dark:text-white font-mono tabular-nums leading-none select-none">
                  {displayHours > 0 && `${pad(displayHours)}:`}
                  {pad(displayMinutes)}:{pad(displaySeconds)}
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-xs font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    status === 'running'
                      ? 'bg-emerald-500 animate-pulse'
                      : status === 'paused'
                      ? 'bg-amber-500'
                      : 'bg-slate-400 dark:bg-slate-600'
                  }`} />
                  <span className="text-black dark:text-slate-200 font-semibold">{status}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Primary Timer Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          {status === 'idle' && (
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            >
              <Play size={18} fill="currentColor" />
              <span>Start Focus</span>
            </button>
          )}

          {status === 'running' && (
            <>
              <button
                type="button"
                onClick={handlePause}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Pause size={18} fill="currentColor" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
            </>
          )}

          {status === 'paused' && (
            <>
              <button
                type="button"
                onClick={handleResume}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/30 active:scale-95 transition-all"
              >
                <Play size={18} fill="currentColor" />
                <span>Resume</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Reset timer"
              >
                <RotateCcw size={18} />
              </button>
            </>
          )}

          {status === 'completed' && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/30 active:scale-95 transition-all"
            >
              <RotateCcw size={18} />
              <span>Start New Session</span>
            </button>
          )}
        </div>

        {/* Optional Notification Opt-in (Never forced as required) */}
        {!hasNotificationPermission && typeof window !== 'undefined' && 'Notification' in window && (
          <button
            type="button"
            onClick={requestNotification}
            className="mt-6 flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Bell size={13} />
            <span>Enable browser completion alert</span>
          </button>
        )}
      </div>

      {/* CUSTOM TIMER TIME SETTER (Primary user-controlled feature) */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Set Custom Duration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize hours, minutes, and seconds for your exact study block.
            </p>
          </div>
          {status !== 'idle' && (
            <span className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
              Reset to adjust
            </span>
          )}
        </div>

        {/* 3 Step Pickers: Hours, Minutes, Seconds (Plus and Minus placed BELOW the numbers as requested) */}
        <div className="grid grid-cols-3 gap-3">
          
          {/* Hours Picker */}
          <div className="glass-panel-subtle rounded-2xl p-3.5 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Hours
            </span>

            {/* Solid black number for first theme */}
            <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-black dark:text-white my-1 text-center select-none">
              {pad(setHours)}
            </div>

            {/* Minus & Plus below the number ("neeche") */}
            <div className="flex items-center justify-center gap-2 mt-2 w-full max-w-[110px]">
              <button
                type="button"
                disabled={status !== 'idle' || setHours <= 0}
                onClick={() => adjustValue('h', -1)}
                className="flex-1 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 disabled:opacity-30 active:scale-90 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
                aria-label="Decrease hours"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                disabled={status !== 'idle' || setHours >= 23}
                onClick={() => adjustValue('h', 1)}
                className="flex-1 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white disabled:opacity-30 active:scale-90 transition-all shadow-xs"
                aria-label="Increase hours"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Minutes Picker */}
          <div className="glass-panel-subtle rounded-2xl p-3.5 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Minutes
            </span>

            {/* Solid black number for first theme */}
            <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-black dark:text-white my-1 text-center select-none">
              {pad(setMinutes)}
            </div>

            {/* Minus & Plus below the number ("neeche") */}
            <div className="flex items-center justify-center gap-2 mt-2 w-full max-w-[110px]">
              <button
                type="button"
                disabled={status !== 'idle' || setMinutes <= 0}
                onClick={() => adjustValue('m', -1)}
                className="flex-1 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 disabled:opacity-30 active:scale-90 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
                aria-label="Decrease minutes"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                disabled={status !== 'idle' || setMinutes >= 59}
                onClick={() => adjustValue('m', 1)}
                className="flex-1 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white disabled:opacity-30 active:scale-90 transition-all shadow-xs"
                aria-label="Increase minutes"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Seconds Picker */}
          <div className="glass-panel-subtle rounded-2xl p-3.5 flex flex-col items-center">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Seconds
            </span>

            {/* Solid black number for first theme */}
            <div className="text-3xl sm:text-4xl font-black font-mono tabular-nums text-black dark:text-white my-1 text-center select-none">
              {pad(setSeconds)}
            </div>

            {/* Minus & Plus below the number ("neeche") */}
            <div className="flex items-center justify-center gap-2 mt-2 w-full max-w-[110px]">
              <button
                type="button"
                disabled={status !== 'idle' || setSeconds <= 0}
                onClick={() => adjustValue('s', -5)}
                className="flex-1 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 disabled:opacity-30 active:scale-90 transition-all border border-slate-200 dark:border-slate-700 shadow-xs"
                aria-label="Decrease seconds"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                disabled={status !== 'idle' || setSeconds >= 59}
                onClick={() => adjustValue('s', 5)}
                className="flex-1 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white disabled:opacity-30 active:scale-90 transition-all shadow-xs"
                aria-label="Increase seconds"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

        </div>

        {/* Quick Presets (as requested: 5 min, 15 min, 25 min, 45 min, 60 min) */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Quick Presets
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[5, 15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => applyPreset(mins)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  setMinutes === mins && setHours === 0 && setSeconds === 0
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
