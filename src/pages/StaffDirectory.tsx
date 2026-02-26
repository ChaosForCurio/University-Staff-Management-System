import React, { useState } from 'react';
import { Plus, Search, Trash2, X, Users } from 'lucide-react';
import { useAppContext, Staff } from '../context/AppContext';
import { EmptyState } from '../components/EmptyState';

export const StaffDirectory: React.FC = () => {
  const { staff, departments, addStaff, deleteStaff, isLoading, error } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '', email: '', departmentId: '', role: '', phone: '', joiningDate: '', status: 'Active'
  });

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStaff.name && newStaff.departmentId && newStaff.role) {
      addStaff(newStaff as Omit<Staff, 'id'>);
      setIsAddModalOpen(false);
      setNewStaff({ name: '', email: '', departmentId: '', role: '', phone: '', joiningDate: '', status: 'Active' });
    }
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
          <h1 className="text-2xl font-bold leading-7 text-slate-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
            Staff Directory
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            A list of all the university staff members including their name, title, email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 sm:w-auto transition-colors"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Staff
          </button>
        </div>
      </div>

      <div className="mb-6 max-w-md">
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-slate-300 dark:border-slate-700/50 pl-10 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border bg-white dark:bg-slate-900/50 dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
            placeholder="Search staff members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredStaff.length > 0 ? (
        <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800/60 sm:rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/60">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Title & Department</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Contact</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 bg-white dark:bg-transparent">
                {filteredStaff.map((person) => {
                  const dept = departments.find(d => d.id === person.departmentId);
                  return (
                    <tr key={person.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                              {person.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-slate-900 dark:text-white">{person.name}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-sm">Joined: {person.joiningDate}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="text-slate-900 dark:text-white font-medium">{person.role}</div>
                        <div className="text-slate-500 dark:text-slate-400">{dept?.name}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${person.status === 'Active' ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400'}`}>
                          {person.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="text-slate-900 dark:text-white">{person.email}</div>
                        <div className="text-slate-500 dark:text-slate-400">{person.phone}</div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => deleteStaff(person.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 inline-flex items-center">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900/50 dark:backdrop-blur-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-800/60 sm:rounded-2xl overflow-hidden">
          <EmptyState
            icon={<Users />}
            title={staff.length === 0 ? "No staff members yet" : "No matching staff found"}
            description={staff.length === 0 ? "Get started by adding your first staff member to the directory." : `No staff members match your search for "${searchTerm}".`}
            action={
              staff.length === 0 ? (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Add First Staff Member
                </button>
              ) : undefined
            }
          />
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden dark:border dark:border-slate-800/60" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/60 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Add New Staff</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input required type="text" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} className="block w-full rounded-lg border-slate-200 dark:border-slate-700/50 py-2 px-3 border bg-slate-50/50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all outline-none" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} className="block w-full rounded-lg border-slate-200 dark:border-slate-700/50 py-2 px-3 border bg-slate-50/50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all outline-none" placeholder="jane@university.edu" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select required value={newStaff.departmentId} onChange={e => setNewStaff({ ...newStaff, departmentId: e.target.value })} className="block w-full rounded-lg border-slate-200 dark:border-slate-700/50 py-2 px-3 border bg-slate-50/50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all outline-none">
                    <option value="">Select...</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <input required type="text" value={newStaff.role} onChange={e => setNewStaff({ ...newStaff, role: e.target.value })} className="block w-full rounded-lg border-slate-200 dark:border-slate-700/50 py-2 px-3 border bg-slate-50/50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all outline-none" placeholder="e.g. Professor" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input type="text" value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} className="block w-full rounded-lg border-slate-200 dark:border-slate-700/50 py-2 px-3 border bg-slate-50/50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all outline-none" placeholder="555-0199" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date</label>
                  <input required type="date" value={newStaff.joiningDate} onChange={e => setNewStaff({ ...newStaff, joiningDate: e.target.value })} className="block w-full rounded-lg border-slate-200 dark:border-slate-700/50 py-2 px-3 border bg-slate-50/50 dark:bg-slate-800/50 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 sm:text-sm transition-all outline-none" />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors">Save Staff Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
