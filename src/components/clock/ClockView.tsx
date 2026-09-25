import React, { useState, useEffect, useRef } from 'react';
import { Clock, Globe, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

interface ClockViewProps {
  clockFormat: '12h' | '24h';
  showSeconds: boolean;
  onToggleFormat?: () => void;
}

export const ClockView: React.FC<ClockViewProps> = ({
  clockFormat,
  showSeconds,
  onToggleFormat,
}) => {
  const [now, setNow] = useState(new Date());
  const [format, setFormat] = useState<'12h' | '24h'>(clockFormat);
  const animFrameRef = useRef<number | null>(null);

  // Update with high precision for buttery smooth sweeping second hand
  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Angle calculations (continuous sweep)
  const secondDegrees = ((seconds + milliseconds / 1000) / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = (((hours % 12) + minutes / 60 + seconds / 3600) / 12) * 360;

  // Digital formatting
  const formattedTime = () => {
    let h = hours;
    const ampm = h >= 12 ? 'PM' : 'AM';
    if (format === '12h') {
      h = h % 12;
      if (h === 0) h = 12;
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(h)}:${pad(minutes)}${showSeconds ? `:${pad(seconds)}` : ''}`;
    return { timeStr, ampm };
  };

  const { timeStr, ampm } = formattedTime();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now);

  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="max-w-2xl mx-auto space-y-7 pb-20">
      
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Study Clock
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Precision analog timepiece for serene temporal awareness.
        </p>
      </div>

      {/* Analog Clock Display Card */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 flex flex-col items-center relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Circular Clock Face */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full glass-panel flex items-center justify-center p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_6px_rgba(0,0,0,0.05)] border-4 border-white/90 dark:border-slate-800">
          
          {/* Glass specular top reflection */}
          <div className="absolute top-2 inset-x-8 h-28 rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

          {/* Clock Dial Container */}
          <div className="relative w-full h-full rounded-full">
            
            {/* 60 Minute tick marks */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isMajor = i % 5 === 0;
              const angle = i * 6;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex justify-center pointer-events-none"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className={`${
                      isMajor
                        ? 'w-1 h-3.5 bg-slate-700 dark:bg-slate-300 rounded-full mt-1.5'
                        : 'w-0.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mt-2'
                    }`}
                  />
                </div>
              );
            })}

            {/* 12 Hour Numbers (12, 3, 6, 9 prominent) */}
            <div className="absolute top-6 inset-x-0 text-center font-bold text-sm text-slate-800 dark:text-slate-200 select-none">
              12
            </div>
            <div className="absolute right-5 inset-y-0 flex items-center font-bold text-sm text-slate-800 dark:text-slate-200 select-none">
              3
            </div>
            <div className="absolute bottom-6 inset-x-0 text-center font-bold text-sm text-slate-800 dark:text-slate-200 select-none">
              6
            </div>
            <div className="absolute left-5 inset-y-0 flex items-center font-bold text-sm text-slate-800 dark:text-slate-200 select-none">
              9
            </div>

            {/* Hour Hand */}
            <div
              className="absolute inset-0 flex justify-center pointer-events-none"
              style={{
                transform: `rotate(${hourDegrees}deg)`,
                transformOrigin: '50% 50%',
              }}
            >
              <div 
                className="w-1.5 h-20 sm:h-24 bg-slate-800 dark:bg-slate-100 rounded-full mt-12 sm:mt-16 shadow-md" 
              />
            </div>

            {/* Minute Hand */}
            <div
              className="absolute inset-0 flex justify-center pointer-events-none"
              style={{
                transform: `rotate(${minuteDegrees}deg)`,
                transformOrigin: '50% 50%',
              }}
            >
              <div 
                className="w-1 h-26 sm:h-32 bg-slate-600 dark:bg-slate-300 rounded-full mt-6 sm:mt-8 shadow-md" 
              />
            </div>

            {/* Second Hand (Smooth continuous sweep with bright accent) */}
            <div
              className="absolute inset-0 flex justify-center pointer-events-none"
              style={{
                transform: `rotate(${secondDegrees}deg)`,
                transformOrigin: '50% 50%',
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Long needle */}
                <div className="w-0.5 h-28 sm:h-36 bg-orange-500 rounded-full mt-4 drop-shadow-sm" />
                {/* Center pin & Counterweight */}
                <div className="w-1.5 h-5 bg-orange-500 rounded-b-full -mt-1" />
              </div>
            </div>

            {/* Center Cap */}
            <div className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full bg-slate-900 dark:bg-white border-2 border-orange-500 shadow-md pointer-events-none" />

          </div>
        </div>

        {/* Digital Time & Date Readout */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
              {timeStr}
            </span>
            {format === '12h' && (
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {ampm}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <CalendarIcon size={14} className="text-blue-500" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            <Globe size={12} />
            <span>{timezoneName}</span>
          </div>
        </div>

        {/* Toggle 12h / 24h format */}
        <div className="mt-6 flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setFormat('12h')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              format === '12h'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            12-Hour
          </button>
          <button
            type="button"
            onClick={() => setFormat('24h')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              format === '24h'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            24-Hour
          </button>
        </div>

      </div>

    </div>
  );
};
