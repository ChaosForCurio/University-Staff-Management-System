import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface AppContextType extends AppState {
  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;
}

const mockDepartments: Department[] = [
  { id: 'd1', name: 'Computer Science' },
  { id: 'd2', name: 'Mathematics' },
  { id: 'd3', name: 'Administration' },
  { id: 'd4', name: 'Student Services' },
  { id: 'd5', name: 'Library' },
];

const mockStaff: Staff[] = [
  { id: 's1', name: 'Dr. Alan Turing', email: 'alan@university.edu', departmentId: 'd1', role: 'Professor', phone: '555-0101', joiningDate: '2015-08-15', status: 'Active' },
  { id: 's2', name: 'Ada Lovelace', email: 'ada@university.edu', departmentId: 'd1', role: 'Associate Professor', phone: '555-0102', joiningDate: '2018-01-10', status: 'Active' },
  { id: 's3', name: 'Carl Gauss', email: 'carl@university.edu', departmentId: 'd2', role: 'Professor', phone: '555-0103', joiningDate: '2010-09-01', status: 'Active' },
  { id: 's4', name: 'Grace Hopper', email: 'grace@university.edu', departmentId: 'd3', role: 'Registrar', phone: '555-0104', joiningDate: '2020-03-15', status: 'Active' },
  { id: 's5', name: 'Tim Berners-Lee', email: 'tim@university.edu', departmentId: 'd5', role: 'Head Librarian', phone: '555-0105', joiningDate: '2019-11-20', status: 'Active' },
];

const mockAttendance: AttendanceRecord[] = [
  { id: 'a1', staffId: 's1', date: new Date().toISOString().split('T')[0], status: 'Present' },
  { id: 'a2', staffId: 's2', date: new Date().toISOString().split('T')[0], status: 'Late', remarks: 'Traffic' },
  { id: 'a3', staffId: 's3', date: new Date().toISOString().split('T')[0], status: 'Present' },
  { id: 'a4', staffId: 's4', date: new Date().toISOString().split('T')[0], status: 'Absent', remarks: 'Sick leave' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [departments] = useState<Department[]>(mockDepartments);
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);

  const addStaff = (newStaff: Omit<Staff, 'id'>) => {
    const id = `s${Date.now()}`;
    setStaff((prev) => [...prev, { ...newStaff, id }]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStaff = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    // Also remove attendance records for deleted staff
    setAttendance((prev) => prev.filter((a) => a.staffId !== id));
  };

  const markAttendance = (newRecord: Omit<AttendanceRecord, 'id'>) => {
    const id = `a${Date.now()}`;
    // Check if record exists for this staff and date
    const existingIndex = attendance.findIndex(a => a.staffId === newRecord.staffId && a.date === newRecord.date);
    
    if (existingIndex >= 0) {
      setAttendance((prev) => {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...newRecord };
        return updated;
      });
    } else {
      setAttendance((prev) => [...prev, { ...newRecord, id }]);
    }
  };

  const updateAttendance = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  return (
    <AppContext.Provider value={{ departments, staff, attendance, addStaff, updateStaff, deleteStaff, markAttendance, updateAttendance }}>
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
