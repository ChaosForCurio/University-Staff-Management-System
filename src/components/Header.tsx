import React from 'react';
import { Bell, Menu, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { logout, userEmail, userUuid, userRole } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 glass-panel border-b border-white/10 dark:border-slate-800/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] sticky top-0 z-20 transition-all duration-300">
      <div className="flex items-center flex-1">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden md:flex relative w-full max-w-md ml-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
            placeholder="Search staff, departments..."
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        <div className="flex items-center gap-3 pl-2">
          <div className="hidden sm:block text-right">
            <div className="flex items-center gap-2 justify-end mb-0.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{userEmail || 'Admin User'}</p>
              {userRole && (
                <span className={cn(
                  "px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider border",
                  userRole === 'Admin'
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                    : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                )}>
                  {userRole}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tighter opacity-70">ID: {userUuid?.split('-')[0] || 'Pending'}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
            title="Logout"
          >
            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
