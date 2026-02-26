import React, { useMemo } from 'react';
import { FileBarChart2, TrendingUp, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

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
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
          <FileBarChart2 className="h-8 w-8 text-indigo-600 mr-3" />
          Attendance Reports
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Monthly and all-time attendance reports for university staff members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white dark:bg-slate-900/50 overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl border border-slate-100 dark:border-slate-800/60 p-6 flex items-center transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
            <Users className="h-7 w-7" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Total Tracked Staff</dt>
              <dd className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">{reportData.length}</dd>
            </dl>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900/50 overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl border border-slate-100 dark:border-slate-800/60 p-6 flex items-center transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Avg Attendance Rate</dt>
              <dd className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                {reportData.length > 0 ? Math.round(reportData.reduce((acc, curr) => acc + curr.rate, 0) / reportData.length) : 0}%
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {reportData.length > 0 ? (
        <div className="bg-white dark:bg-slate-900/50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-100 dark:ring-slate-800/60 sm:rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/60">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-300 sm:pl-6">Staff Member</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-slate-900 dark:text-slate-300">Total Days</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">Present</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-rose-600 dark:text-rose-400">Absent</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-amber-600 dark:text-amber-400">Late</th>
                  <th className="px-3 py-3.5 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">Leave</th>
                  <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900 dark:text-slate-300 pr-6 w-40 sm:w-48">Attendance Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-transparent">
                {reportData.map((person) => {
                  const dept = departments.find(d => d.id === person.departmentId);
                  return (
                    <tr key={person.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                              {person.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-slate-900 dark:text-white">{person.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm">{dept?.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">{person.totalDays}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium text-center">{person.present}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-rose-600 dark:text-rose-400 font-medium text-center">{person.absent}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-amber-600 dark:text-amber-400 font-medium text-center">{person.late}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600 dark:text-indigo-400 font-medium text-center">{person.leave}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm pr-6">
                        <div className="flex items-center justify-end gap-2 sm:gap-3">
                          <div className="w-16 sm:w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${person.rate >= 90 ? 'bg-emerald-500' : person.rate >= 75 ? 'bg-amber-400' : 'bg-rose-500'}`}
                              style={{ width: `${person.rate}%` }}
                            />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-300 w-8 sm:w-10 text-right">{person.rate}%</span>
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
            icon={<FileBarChart2 />}
            title="No reports available"
            description="There is no staff data to generate attendance reports."
          />
        </div>
      )}
    </div>
  );
};
