import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type StaffStatus = 'Active' | 'Inactive';
export type AttendanceStatus = 'Present' | 'Absent' | 'Leave' | 'Late';

export interface Department {
  id: string;
  name: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  departmentId: string;
  role: string;
  phone: string;
  joiningDate: string;
  status: StaffStatus;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

interface AppState {
  departments: Department[];
  staff: Staff[];
  attendance: AttendanceRecord[];
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  addStaff: (staff: Omit<Staff, 'id'>) => Promise<void>;
  updateStaff: (id: string, staff: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => Promise<void>;
  refreshData: () => Promise<void>;
}



const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initRes = await fetch('/api/init');

      if (!initRes.ok) {
        throw new Error('Failed to fetch initial data');
      }

      const data = await initRes.json();
      setDepartments(data.departments);
      setStaff(data.staff);
      setAttendance(data.attendance);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while loading data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addStaff = async (newStaff: Omit<Staff, 'id'>) => {
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });
      if (!res.ok) throw new Error('Failed to add staff');
      const savedStaff = await res.json();
      setStaff((prev) => [...prev, savedStaff]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateStaff = async (id: string, updates: Partial<Staff>) => {
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update staff');
      const updatedStaff = await res.json();
      setStaff((prev) => prev.map((s) => (s.id === id ? updatedStaff : s)));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete staff');
      setStaff((prev) => prev.filter((s) => s.id !== id));
      setAttendance((prev) => prev.filter((a) => a.staffId !== id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const markAttendance = async (newRecord: Omit<AttendanceRecord, 'id'>) => {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) throw new Error('Failed to mark attendance');
      const savedRecord = await res.json();

      setAttendance((prev) => {
        const existingIndex = prev.findIndex(a => a.staffId === savedRecord.staffId && a.date === savedRecord.date);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = savedRecord;
          return updated;
        }
        return [...prev, savedRecord];
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateAttendance = async (id: string, updates: Partial<AttendanceRecord>) => {
    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update attendance');
      const updatedRecord = await res.json();
      setAttendance((prev) => prev.map((a) => (a.id === id ? updatedRecord : a)));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      departments, staff, attendance, isLoading, error,
      addStaff, updateStaff, deleteStaff, markAttendance, updateAttendance, refreshData: fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
