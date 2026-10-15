import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// /admin is a separate, lazily loaded bundle (supabase-js lives only there).
const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname);
const Admin = lazy(() => import('./admin/Admin.jsx'));

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<p className="mono" style={{ padding: 24 }}>Loading dashboard…</p>}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>
);
