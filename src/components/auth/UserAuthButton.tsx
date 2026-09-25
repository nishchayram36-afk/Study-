import React, { useState } from 'react';
import { LogIn, LogOut, CheckCircle2, User as UserIcon } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { loginWithGoogle, logoutUser } from '../../services/firebase';

interface UserAuthButtonProps {
  user: FirebaseUser | null;
  onLoginSuccess?: (user: FirebaseUser) => void;
  onLogoutSuccess?: () => void;
}

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({
  user,
  onLoginSuccess,
  onLogoutSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const loggedUser = await loginWithGoogle();
      if (loggedUser && onLoginSuccess) {
        onLoginSuccess(loggedUser);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      console.error('Sign-in error:', msg);
      if (!msg.includes('closed-by-user')) {
        setErrorMsg('Sign-in error. Please try again.');
        setTimeout(() => setErrorMsg(null), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setShowMenu(false);
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (!user) {
    return (
      <div className="relative">
        <button
          type="button"
          disabled={loading}
          onClick={handleSignIn}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/90 shadow-xs hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 active:scale-95 transition-all text-xs font-semibold focus:outline-none"
          aria-label="Sign in with Google"
        >
          {/* Official Google 'G' icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="hidden xs:inline">
            {loading ? 'Signing in...' : 'Sign In with Google'}
          </span>
          <span className="xs:hidden">Google</span>
        </button>

        {errorMsg && (
          <div className="absolute right-0 top-full mt-2 w-52 p-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-[11px] shadow-lg z-50">
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  // Logged-in profile badge
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/70 dark:border-slate-700/70 transition-all focus:outline-none"
        aria-label="User Account Menu"
      >
        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight max-w-[100px] truncate">
            {user.displayName || user.email?.split('@')[0] || 'Student'}
          </div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced</span>
          </div>
        </div>

        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full border border-blue-500/40 object-cover shadow-xs"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
        )}
      </button>

      {/* Account Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user.displayName || 'Google User'}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="py-2 space-y-1">
              <div className="flex items-center gap-2 px-2 py-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 size={13} />
                <span>Cloud Auto-Sync Active</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
