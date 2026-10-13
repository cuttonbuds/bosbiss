import { lazy, Suspense, useRef, useMemo } from 'react';
import Mark from './Mark.jsx';
import { hero } from '../data/content.js';
import { useInView, useIdle } from '../hooks.js';

// three.js + react-three-fiber load in their own chunk, only after first paint.
const Logo3D = lazy(() => import('./Logo3D.jsx'));

function can3D() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (navigator.connection && navigator.connection.saveData) return false;
  const c = document.createElement('canvas');
  return !!(c.getContext('webgl2') || c.getContext('webgl'));
}

export default function Hero({ theme }) {
  const stage = useRef(null);
  const inView = useInView(stage, '120px');
  const idle = useIdle();
  const ok = useMemo(can3D, []);
  const [a, b, c] = hero.eyebrow;

  return (
    <section className="hero" id="top">
      <p className="mono eyebrow reveal">
        {a} &nbsp;/&nbsp; {b} &nbsp;/&nbsp; {c}
      </p>
      <h1 className="reveal">
        Building digital<br />
        experiences with<br />
        <span className="muted">code and creativity.</span>
      </h1>
      <div className="hero-foot reveal">
        <p className="lede">{hero.lede}</p>
        <a className="status" href="#contact">
          <span className="status-dot" />
          <span className="mono">{hero.status}</span>
        </a>
      </div>

      <div className="hero-3d" ref={stage} aria-hidden="true">
        {ok ? (
          <Suspense fallback={<Mark className="hero-mark-fallback" />}>
            {idle ? <Logo3D theme={theme} active={inView} /> : <Mark className="hero-mark-fallback" />}
          </Suspense>
        ) : (
          <Mark className="hero-mark-fallback" />
        )}
      </div>
    </section>
  );
}
