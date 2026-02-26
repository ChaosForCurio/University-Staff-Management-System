import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Clock, Plane, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useAppContext, AttendanceStatus } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const Attendance: React.FC = () => {
  const { staff, departments, attendance, markAttendance, isLoading, error } = useAppContext();
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

  const defaultButtonClass = 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50 dark:hover:bg-slate-800';

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
          <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Daily Attendance
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Record and manage daily attendance for all university staff members.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none flex items-center bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-800/60 rounded-md px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow transition-colors relative">
          <CalendarIcon className="h-5 w-5 text-slate-400 mr-2 pointer-events-none" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full border-0 p-0 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-0 sm:text-sm bg-transparent outline-none cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>
      </div>

      {staff.length > 0 ? (
        <div className="bg-white dark:bg-slate-900/50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-100 dark:ring-slate-800/60 sm:rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/60">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 sm:pl-6">Staff Member</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 hidden sm:table-cell">Department</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 min-w-[320px]">Mark Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-transparent">
                {staff.map((person) => {
                  const dept = departments.find(d => d.id === person.departmentId);
                  const currentStatus = getStatus(person.id);

                  return (
                    <tr key={person.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                              {person.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-slate-900 dark:text-white">{person.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm">{person.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {dept?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map((status) => {
                            const isSelected = currentStatus === status;
                            return (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(person.id, status)}
                                className={`inline-flex items-center px-2.5 py-1.5 border rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSelected ? statusColors[status] : defaultButtonClass
                                  }`}
                              >
                                {statusIcons[status]}
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
