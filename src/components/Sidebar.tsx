import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, FileText, GraduationCap } from 'lucide-react';
import { cn } from '../utils/cn';

import { X } from 'lucide-react';

export const Sidebar: React.FC<{ isOpen: boolean; close: () => void }> = ({ isOpen, close }) => {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff', icon: Users, label: 'Staff Directory' },
    { to: '/attendance', icon: CalendarCheck, label: 'Attendance' },
    { to: '/reports', icon: FileText, label: 'Reports' },
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

      {/* Sidebar component */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:w-64 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-500 mr-3" />
            <span className="text-white font-semibold text-lg tracking-tight">UniStaff</span>
          </div>
          <button onClick={close} className="md:hidden p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => close()}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
                  isActive
                    ? 'bg-indigo-600/10 text-indigo-400 font-semibold'
                    : 'hover:bg-slate-800 hover:text-white'
                )
              }
            >
            <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
            AD
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-500">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
