import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Mark from './components/Mark.jsx';
import './styles.css';

// /admin is a separate, lazily loaded bundle (supabase-js lives only there).
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const isAdmin = /^\/admin(\/|$)/.test(path);
const Admin = lazy(() => import('./admin/Admin.jsx'));

function NotFound() {
  return (
    <main className="notfound">
      <Mark className="notfound-mark" />
      <p className="mono index">404</p>
      <h1>Page not found.</h1>
      <p className="muted">The page you are looking for does not exist or has moved.</p>
      <a className="btn-cta" href="/">Back to home</a>
    </main>
  );
}

let view;
if (isAdmin) {
  view = (
    <Suspense fallback={<p className="mono" style={{ padding: 24 }}>Loading dashboard…</p>}>
      <Admin />
    </Suspense>
  );
} else if (path === '/') {
  view = <App />;
} else {
  view = <NotFound />;
}

createRoot(document.getElementById('root')).render(<StrictMode>{view}</StrictMode>);
