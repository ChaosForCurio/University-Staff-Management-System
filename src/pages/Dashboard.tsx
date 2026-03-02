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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          <span className="text-gradient">Dashboard</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-2xl glass-panel p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/10 dark:border-slate-800/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-indigo-500/5"
          >
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-colors duration-500" />

            <dt className="flex items-center gap-4">
              <div className={`rounded-xl p-3 ${item.bg} ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="truncate text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">{item.name}</p>
            </dt>
            <dd className="mt-4 flex items-baseline">
              <p className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl glass-panel shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/10 dark:border-slate-800/50 overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5 dark:border-slate-800/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recently Added Staff</h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Newest</span>
          </div>
          <div className="p-2">
            {recentStaff.length > 0 ? (
              <div className="space-y-1">
                {recentStaff.map((person) => {
                  const dept = departments.find(d => d.id === person.departmentId);
                  return (
                    <div
                      key={person.id}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200 cursor-default"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                          {person.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">{person.name}</p>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/50">{person.role}</span>
                            <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                            <span>{dept?.name}</span>
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">Joined</p>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{new Date(person.joiningDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12">
                <EmptyState
                  icon={<Users className="h-12 w-12 text-slate-300 dark:text-slate-700" />}
                  title="No recent staff"
                  description="Staff members added recently will appear here."
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl glass-panel shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/10 dark:border-slate-800/50 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20 animate-pulse">
            <Activity className="h-10 w-10 text-indigo-500" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white">Quick Stats</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daily overview of operations</p>
          </div>
          <div className="w-full grid grid-cols-2 gap-3 mt-4">
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/10 dark:border-slate-800/50">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Present</p>
              <p className="text-xl font-bold text-emerald-500 mt-1">{presentCount}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/10 dark:border-slate-800/50">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Late</p>
              <p className="text-xl font-bold text-amber-500 mt-1">{lateCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
