import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Mark from './components/Mark.jsx';
import './styles.css';

// Minimal router: /, /articles, /articles/:slug, /admin. Everything else is a 404.
const path = window.location.pathname.replace(/\/+$/, '') || '/';
const Admin = lazy(() => import('./admin/Admin.jsx'));
const ArticlePage = lazy(() => import('./pages/ArticlePage.jsx'));

const loading = <p className="mono" style={{ padding: 24 }}>Loading…</p>;

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
const articleMatch = path.match(/^\/articles(?:\/([a-z0-9-]+))?$/);
if (import.meta.env.DEV && path === '/__editor') {
  // Dev-only harness for the rich text editor (not part of production builds).
  const EditorHarness = lazy(() => import('./admin/EditorHarness.jsx'));
  view = <Suspense fallback={loading}><EditorHarness /></Suspense>;
} else if (/^\/admin(\/|$)/.test(path)) {
  view = <Suspense fallback={loading}><Admin /></Suspense>;
} else if (articleMatch) {
  view = <Suspense fallback={loading}><ArticlePage slug={articleMatch[1] || ''} /></Suspense>;
} else if (path === '/') {
  view = <App />;
} else {
  view = <NotFound />;
}

createRoot(document.getElementById('root')).render(<StrictMode>{view}</StrictMode>);
