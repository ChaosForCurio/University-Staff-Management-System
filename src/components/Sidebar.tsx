import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, FileText, GraduationCap, Settings } from 'lucide-react';
import { cn } from '../utils/cn';

import { X } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; close: () => void }> = ({ isOpen, close }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff', icon: Users, label: 'Staff Directory' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/reports', icon: FileText, label: 'Reports' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/80 backdrop-blur-sm transition-opacity md:hidden"
          onClick={close}
        />
      )}

      {/* Desktop spacer to push main content smoothly */}
      <div className={cn("hidden md:block transition-all duration-300 ease-in-out shrink-0", isOpen ? "w-64" : "w-0")} />

      {/* Sidebar component */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 flex flex-col border-r border-slate-200 dark:border-slate-800/60 transform transition-transform duration-300 ease-in-out md:w-64",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600 dark:text-indigo-500 mr-3" />
            <span className="text-slate-900 dark:text-white font-semibold text-lg tracking-tight">UniStaff</span>
          </div>
          <button onClick={close} className="md:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 768) {
                  close();
                }
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                )
              }
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-medium">
              AD
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Admin User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">System Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
