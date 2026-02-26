import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StaffDirectory } from './pages/StaffDirectory';
import { Attendance } from './pages/Attendance';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AppProvider>
      <ThemeProvider defaultTheme="system" storageKey="app-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="staff" element={<StaffDirectory />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}
