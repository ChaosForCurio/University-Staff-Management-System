import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';

export const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-20 transition-colors">
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
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};
