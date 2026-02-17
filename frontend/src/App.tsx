import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { health } from './lib/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Hygiene from './pages/Hygiene';
import Promotion from './pages/Promotion';
import Finance from './pages/Finance';
import Admin from './pages/Admin';
import Complaint from './pages/Complaint';
import Policies from './pages/Policies';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

function StatusBadge() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const ok = await health();
        if (active) setOnline(ok);
      } catch {
        if (active) setOnline(false);
      }
    };

    check();
    const id = setInterval(check, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const label = online === null ? 'Checking backend...' : online ? 'Backend online' : 'Backend offline';
  const color = online === null ? 'bg-amber-400' : online ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-md text-xs font-semibold text-slate-700">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`}></span>
      {label}
    </div>
  );
}

function App() {
  return (
    <Router>
      <StatusBadge />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hygiene" element={<Hygiene />} />
        <Route path="/promotion" element={<Promotion />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
