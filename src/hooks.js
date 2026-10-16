import { useEffect, useState, useCallback } from 'react';

const lightQuery = () => window.matchMedia('(prefers-color-scheme: light)');

function resolveTheme() {
  const set = document.documentElement.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return lightQuery().matches ? 'light' : 'dark';
}

/** Current theme ('light' | 'dark') plus a toggle. Persists the choice. */
export function useTheme() {
  const [theme, setTheme] = useState(() => (typeof window === 'undefined' ? 'dark' : resolveTheme()));

  useEffect(() => {
    const mq = lightQuery();
    const sync = () => setTheme(resolveTheme());
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#F7F7F8' : '#0B0D10');
  }, [theme]);

  const toggle = useCallback(() => {
    const next = resolveTheme() === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('bb-theme', next); } catch (e) { /* ignore */ }
    setTheme(next);
  }, []);

  return [theme, toggle];
}

/** Returns the id of the section currently in the middle of the viewport. */
export function useActiveSection(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** True once `ref` has entered the viewport (with optional margin). */
export function useInView(ref, rootMargin = '0px') {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Resolves true after the browser is idle (or after a timeout), so heavy work never blocks first paint. */
export function useIdle(timeout = 1500) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setIdle(true), 600);
    return () => clearTimeout(id);
  }, [timeout]);
  return idle;
}
