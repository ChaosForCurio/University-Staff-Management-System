import React, { useMemo } from 'react';
import { Users, Building, Activity, CalendarX2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const Dashboard: React.FC = () => {
  const { staff, departments, attendance, isLoading, error } = useAppContext();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = useMemo(() => attendance.filter(a => a.date === today), [attendance, today]);

  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  const presentOrLate = presentCount + lateCount;

  const totalStaff = staff.length;
  const attendanceRate = totalStaff > 0 ? Math.round((presentOrLate / totalStaff) * 100) : 0;

  const stats = [
    { name: 'Total Staff', stat: totalStaff.toString(), icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
    { name: 'Departments', stat: departments.length.toString(), icon: Building, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-500/20' },
    { name: 'Today\'s Attendance', stat: `${attendanceRate}%`, icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
    { name: 'Absent Today', stat: todayAttendance.filter(a => a.status === 'Absent').length.toString(), icon: CalendarX2, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-500/20' },
  ];

  const recentStaff = useMemo(() => {
    return [...staff].sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()).slice(0, 5);
  }, [staff]);

  return (
    <div>
      <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 transition-all hover:-translate-y-1 hover:shadow-md dark:hover:shadow-indigo-500/10">
            <dt className="flex items-center">
              <div className={`rounded-xl p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-4 truncate text-sm font-medium text-slate-500 dark:text-slate-400">{item.name}</p>
            </dt>
            <dd className="mt-4 flex items-baseline">
              <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none border border-slate-100 dark:border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">Recently Added Staff</h3>
          </div>
          {recentStaff.length > 0 ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentStaff.map((person) => {
                const dept = departments.find(d => d.id === person.departmentId);
                return (
                  <li key={person.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                          {person.name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{person.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{person.role} &middot; {dept?.name}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-6">
              <EmptyState
                icon={<Users />}
                title="No recent staff"
                description="Staff members added recently will appear here."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
