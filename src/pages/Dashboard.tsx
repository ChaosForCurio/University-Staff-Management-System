import React, { useMemo } from 'react';
import { Users, Building, Activity, CalendarX2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Dashboard: React.FC = () => {
  const { staff, departments, attendance } = useAppContext();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = useMemo(() => attendance.filter(a => a.date === today), [attendance, today]);
  
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  const presentOrLate = presentCount + lateCount;
  
  const totalStaff = staff.length;
  const attendanceRate = totalStaff > 0 ? Math.round((presentOrLate / totalStaff) * 100) : 0;

  const stats = [
    { name: 'Total Staff', stat: totalStaff.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Departments', stat: departments.length.toString(), icon: Building, color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'Today\'s Attendance', stat: `${attendanceRate}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Absent Today', stat: todayAttendance.filter(a => a.status === 'Absent').length.toString(), icon: CalendarX2, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const recentStaff = useMemo(() => {
    return [...staff].sort((a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()).slice(0, 5);
  }, [staff]);

  return (
    <div>
      <h1 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-md">
            <dt className="flex items-center">
              <div className={`rounded-xl p-3 ${item.bg}`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-4 truncate text-sm font-medium text-slate-500">{item.name}</p>
            </dt>
            <dd className="mt-4 flex items-baseline">
              <p className="text-3xl font-bold tracking-tight text-slate-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-semibold leading-6 text-slate-900">Recently Added Staff</h3>
          </div>
          <ul className="divide-y divide-slate-100">
            {recentStaff.map((person) => {
              const dept = departments.find(d => d.id === person.departmentId);
              return (
                <li key={person.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        {person.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{person.name}</p>
                      <p className="text-sm text-slate-500 truncate">{person.role} &middot; {dept?.name}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
