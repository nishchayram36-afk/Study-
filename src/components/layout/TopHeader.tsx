import React from 'react';
import { Calendar, Timer, Clock, MoreHorizontal, Plus } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { NavTab } from '../../types';
import { UserAuthButton } from '../auth/UserAuthButton';

interface TopHeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCreate: () => void;
  completedCount: number;
  totalCount: number;
  focusMinutes: number;
  user: FirebaseUser | null;
  onLoginSuccess?: (user: FirebaseUser) => void;
  onLogoutSuccess?: () => void;
}

/**
 * Sleek, custom-crafted Book Logo SVG with flowing pages & study depth
 */
export const SleekBookLogo: React.FC<{ size?: number; className?: string }> = ({
  size = 28,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 select-none ${className}`}
  >
    <defs>
      {/* Outer book cover gradient */}
      <linearGradient id="bookCoverGrad" x1="2" y1="4" x2="30" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>

      {/* Pages inner gradient */}
      <linearGradient id="bookPageGrad" x1="5" y1="6" x2="27" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#EFF6FF" />
      </linearGradient>

      {/* Subtle page fold shading */}
      <linearGradient id="bookSpineGrad" x1="16" y1="6" x2="16" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.05" />
      </linearGradient>

      {/* Ribbon accent gradient */}
      <linearGradient id="bookRibbonGrad" x1="16" y1="4" x2="16" y2="13" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>

    {/* Book Cover Base with depth */}
    <path
      d="M16 23.5C11.5 21.8 5.5 22.3 2.5 24.5V8.5C5.5 6.3 11.5 5.8 16 7.5C20.5 5.8 26.5 6.3 29.5 8.5V24.5C26.5 22.3 20.5 21.8 16 23.5Z"
      fill="url(#bookCoverGrad)"
      stroke="#1D4ED8"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />

    {/* Outer Pages Layer (Left & Right Wings) */}
    <path
      d="M16 22C12 20.4 6.8 20.8 4 22.8V7.5C6.8 5.5 12 5.1 16 6.8C20 5.1 25.2 5.5 28 7.5V22C25.2 20.8 20 20.4 16 22Z"
      fill="url(#bookPageGrad)"
    />

    {/* Flowing Text Lines (Left Page) */}
    <path
      d="M7 11.5C9.5 10.3 12 10.4 13.5 11"
      stroke="#93C5FD"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M7 14.5C9.5 13.3 12 13.4 13.5 14"
      stroke="#BFDBFE"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M7 17.5C9.5 16.3 12 16.4 13.5 17"
      stroke="#DBEAFE"
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Flowing Text Lines (Right Page) */}
    <path
      d="M18.5 11C20 10.4 22.5 10.3 25 11.5"
      stroke="#93C5FD"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M18.5 14C20 13.4 22.5 13.3 25 14.5"
      stroke="#BFDBFE"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M18.5 17C20 16.4 22.5 16.3 25 17.5"
      stroke="#DBEAFE"
      strokeWidth="1.2"
      strokeLinecap="round"
    />

    {/* Spine Shadow / Crease */}
    <path
      d="M15.4 6.5C15.8 7 16 14 16 22.5C16 14 16.2 7 16.6 6.5"
      stroke="url(#bookSpineGrad)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Elegant Flow Bookmark Ribbon */}
    <path
      d="M15 4.5C15 4 17 4 17 4.5V12.5L16 11.2L15 12.5V4.5Z"
      fill="url(#bookRibbonGrad)"
      stroke="#D97706"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />

    {/* Tiny Sparkle of Inspiration */}
    <circle cx="16" cy="3" r="1.2" fill="#FBBF24" />
  </svg>
);

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreate,
  completedCount,
  totalCount,
  user,
  onLoginSuccess,
  onLogoutSuccess,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-slate-900/75 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Sleek Book Logo & Brand Text */}
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => onSelectTab('planner')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="StudyFlow Home"
          >
            {/* Sleek Book Logo Container */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-blue-600/15 dark:from-blue-500/20 dark:to-indigo-500/25 border border-blue-500/20 dark:border-blue-400/30 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:shadow-md group-hover:shadow-blue-500/15 transition-all duration-200">
              <SleekBookLogo size={24} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
              {/* Glass specular top shine */}
              <div className="absolute inset-x-1 top-0.5 h-3 bg-gradient-to-b from-white/60 dark:from-white/20 to-transparent rounded-t-xl pointer-events-none" />
            </div>

            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white block leading-tight">
                StudyFlow
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Desktop (hidden on mobile, uses bottom nav) */}
        <nav aria-label="Desktop Navigation" className="hidden md:flex items-center p-1 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => onSelectTab('planner')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              currentTab === 'planner'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calendar size={15} />
            <span>Planner</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('timer')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              currentTab === 'timer'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Timer size={15} />
            <span>Timer</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('clock')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              currentTab === 'clock'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-800 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Clock size={15} />
            <span>Clock</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('more')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
              currentTab === 'more'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal size={15} />
            <span>More</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action, Google Login & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Google Sign In / User Profile Button */}
          <UserAuthButton
            user={user}
            onLoginSuccess={onLoginSuccess}
            onLogoutSuccess={onLogoutSuccess}
          />

          {/* Quick status pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50">
            <span className="tabular-nums font-semibold text-slate-700 dark:text-slate-300">
              {completedCount}/{totalCount}
            </span>
            <span className="text-[11px] text-slate-400">tasks done</span>
          </div>

          {/* Desktop primary Create button */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm shadow-blue-500/25 active:scale-95 transition-all duration-150 border border-blue-400/30"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New</span>
          </button>

          {/* Mobile quick create indicator */}
          <button
            type="button"
            onClick={onOpenCreate}
            className="sm:hidden flex md:hidden items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow-sm active:scale-90 transition-transform"
            aria-label="Quick Add"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </header>
  );
};
