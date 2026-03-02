import React, { useMemo } from 'react';
import {
  FileBarChart2,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';
import { cn } from '../utils/cn';

export const Reports: React.FC = () => {
  const { staff, attendance, departments, isLoading, error } = useAppContext();

  const reportData = useMemo(() => {
    return staff.map(person => {
      const personAttendance = attendance.filter(a => a.staffId === person.id);
      const totalDays = personAttendance.length;

      const present = personAttendance.filter(a => a.status === 'Present').length;
      const absent = personAttendance.filter(a => a.status === 'Absent').length;
      const late = personAttendance.filter(a => a.status === 'Late').length;
      const leave = personAttendance.filter(a => a.status === 'Leave').length;

      const rate = totalDays > 0 ? Math.round(((present + late) / totalDays) * 100) : 0;

      return {
        ...person,
        present,
        absent,
        late,
        leave,
        totalDays,
        rate
      };
    });
  }, [staff, attendance]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 space-y-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse uppercase tracking-widest">Generating Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel border border-rose-500/20 bg-rose-500/5 p-6 rounded-2xl flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500">!</div>
        <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            <span className="text-gradient">Attendance Analytics</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Comprehensive performance tracking and attendance distribution insights.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 glass-panel border border-white/10 dark:border-slate-800/60 rounded-xl px-4 py-2 flex items-center gap-2 group cursor-default">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Live Reports</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-panel overflow-hidden border border-white/10 dark:border-slate-800/60 p-6 flex items-center group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 rounded-2xl">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
            <Users className="h-7 w-7" />
          </div>
          <div className="ml-5 flex-1">
            <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">Total Tracked Staff</dt>
            <dd className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{reportData.length}</dd>
          </div>
        </div>

        <div className="glass-panel overflow-hidden border border-white/10 dark:border-slate-800/60 p-6 flex items-center group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10 rounded-2xl">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div className="ml-5 flex-1">
            <dt className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Attendance Rate</dt>
            <dd className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {reportData.length > 0 ? Math.round(reportData.reduce((acc, curr) => acc + curr.rate, 0) / reportData.length) : 0}%
            </dd>
          </div>
        </div>
      </div>

      {reportData.length > 0 ? (
        <div className="glass-panel shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/10 dark:border-slate-800/50 sm:rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 dark:divide-slate-800/50">
              <thead className="bg-slate-50/50 dark:bg-slate-800/40">
                <tr>
                  <th className="py-5 pl-4 pr-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest sm:pl-6">Staff Member</th>
                  <th className="px-3 py-5 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Days</th>
                  <th className="px-3 py-5 text-center text-xs font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">Present</th>
                  <th className="px-3 py-5 text-center text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest">Absent</th>
                  <th className="px-3 py-5 text-center text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Late</th>
                  <th className="px-3 py-5 text-center text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Leave</th>
                  <th className="px-3 py-5 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pr-6">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {reportData.map((person) => {
                  const dept = departments.find(d => d.id === person.departmentId);
                  return (
                    <tr key={person.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-200">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-11 w-11 flex-shrink-0">
                            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                              {person.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{person.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">{dept?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500 dark:text-slate-400 text-center font-bold">{person.totalDays}d</td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-emerald-600 dark:text-emerald-400 font-bold text-center">
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/10">{person.present}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-rose-600 dark:text-rose-400 font-bold text-center">
                        <span className="px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/10">{person.absent}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-amber-600 dark:text-amber-400 font-bold text-center">
                        <span className="px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/10">{person.late}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-xs text-indigo-600 dark:text-indigo-400 font-bold text-center">
                        <span className="px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/10">{person.leave}</span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24 bg-slate-200 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-300 dark:border-slate-700/50">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                person.rate >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                  person.rate >= 75 ? 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                    'bg-gradient-to-r from-rose-500 to-pink-600 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                              )}
                              style={{ width: `${person.rate}%` }}
                            />
                          </div>
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 w-10 text-right text-xs">{person.rate}%</span>
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
        <div className="glass-panel border border-white/10 dark:border-slate-800/50 rounded-2xl overflow-hidden p-12">
          <EmptyState
            icon={<FileBarChart2 className="h-12 w-12 text-slate-300 dark:text-slate-600" />}
            title="No analytics data"
            description="Attendance records will appear here once faculty members start checking in."
          />
        </div>
      )}
    </div>
  );
};
