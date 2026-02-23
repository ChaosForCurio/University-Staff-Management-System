import React, { useMemo } from 'react';
import { FileBarChart2, TrendingUp, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Reports: React.FC = () => {
  const { staff, attendance, departments } = useAppContext();

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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center">
          <FileBarChart2 className="h-8 w-8 text-indigo-600 mr-3" />
          Attendance Reports
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Monthly and all-time attendance reports for university staff members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl border border-slate-100 p-6 flex items-center transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <Users className="h-7 w-7" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">Total Tracked Staff</dt>
              <dd className="text-3xl font-bold tracking-tight text-slate-900 mt-1">{reportData.length}</dd>
            </dl>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] rounded-2xl border border-slate-100 p-6 flex items-center transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-7 w-7" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">Avg Attendance Rate</dt>
              <dd className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                {reportData.length > 0 ? Math.round(reportData.reduce((acc, curr) => acc + curr.rate, 0) / reportData.length) : 0}%
              </dd>
            </dl>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] ring-1 ring-slate-100 sm:rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Staff Member</th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold text-slate-900">Total Days</th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold text-emerald-600">Present</th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold text-rose-600">Absent</th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold text-amber-600">Late</th>
                <th className="px-3 py-3.5 text-center text-sm font-semibold text-indigo-600">Leave</th>
                <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900 pr-6 w-48">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {reportData.map((person) => {
                const dept = departments.find(d => d.id === person.departmentId);
                return (
                  <tr key={person.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                            {person.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-slate-900">{person.name}</div>
                          <div className="text-slate-500 text-sm">{dept?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 text-center">{person.totalDays}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-emerald-600 font-medium text-center">{person.present}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-rose-600 font-medium text-center">{person.absent}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-amber-600 font-medium text-center">{person.late}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-600 font-medium text-center">{person.leave}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${person.rate >= 90 ? 'bg-emerald-500' : person.rate >= 75 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                            style={{ width: `${person.rate}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-700 w-10 text-right">{person.rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
