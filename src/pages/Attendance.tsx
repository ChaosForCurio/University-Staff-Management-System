import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock, Plane, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useAppContext, AttendanceStatus } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export const Attendance: React.FC = () => {
  const { staff, departments, attendance, markAttendance, isLoading, error } = useAppContext();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'Admin';
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const currentAttendance = useMemo(() => {
    return attendance.filter(a => a.date === selectedDate);
  }, [attendance, selectedDate]);

  const getStatus = (staffId: string): AttendanceStatus | undefined => {
    return currentAttendance.find(a => a.staffId === staffId)?.status;
  };

  const handleStatusChange = (staffId: string, status: AttendanceStatus) => {
    markAttendance({ staffId, date: selectedDate, status });
  };

  const statusIcons = {
    Present: <CheckCircle2 className="h-4 w-4 mr-1" />,
    Absent: <XCircle className="h-4 w-4 mr-1" />,
    Late: <Clock className="h-4 w-4 mr-1" />,
    Leave: <Plane className="h-4 w-4 mr-1" />,
  };

  const statusColors = {
    Present: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/30',
    Absent: 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30 dark:hover:bg-rose-500/30',
    Late: 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 dark:hover:bg-amber-500/30',
    Leave: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30 dark:hover:bg-indigo-500/30',
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            <span className="text-gradient">Daily Attendance</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Record and manage daily attendance sessions with real-time sync.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center glass-panel border border-white/10 dark:border-slate-800/60 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-300 relative group">
          <CalendarIcon className="h-5 w-5 text-slate-400 mr-3 pointer-events-none group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full border-0 p-0 text-slate-900 dark:text-white font-bold placeholder-slate-500 dark:placeholder-slate-400 focus:ring-0 sm:text-sm bg-transparent outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {staff.length > 0 ? (
        <div className="glass-panel shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/10 dark:border-slate-800/50 sm:rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 dark:divide-slate-800/50">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="py-4 pl-4 pr-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest sm:pl-6">Staff Member</th>
                  <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hidden sm:table-cell">Department</th>
                  <th className="px-3 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest min-w-[320px]">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {staff.map((person) => {
                  const dept = departments.find(d => d.id === person.departmentId);
                  const currentStatus = getStatus(person.id);

                  return (
                    <tr key={person.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-slate-500/10 to-slate-600/10 border border-slate-500/20 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold group-hover:bg-indigo-500/10 group-hover:text-indigo-500 group-hover:border-indigo-500/20 transition-all">
                              {person.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{person.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs font-medium">{person.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell font-medium">
                        {dept?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map((status) => {
                            const isSelected = currentStatus === status;
                            return (
                              <button
                                key={status}
                                onClick={() => isAdmin && handleStatusChange(person.id, status)}
                                disabled={!isAdmin}
                                className={`inline-flex items-center px-3 py-1.5 border rounded-lg text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 ${isSelected
                                  ? `${statusColors[status]} shadow-lg shadow-black/5`
                                  : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                                  } ${!isAdmin ? 'opacity-50 cursor-not-allowed scale-95' : 'active:scale-95'}`}
                              >
                                <span className={cn(
                                  "mr-1.5 transition-transform group-hover:scale-110",
                                  isSelected ? "scale-110" : "opacity-70"
                                )}>
                                  {statusIcons[status]}
                                </span>
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-100 dark:ring-slate-800/60 sm:rounded-2xl overflow-hidden">
          <EmptyState
            icon={<Users />}
            title="No staff members yet"
            description="Add staff members in the directory to start managing their attendance."
          />
        </div>
      )}
    </div>
  );
};
