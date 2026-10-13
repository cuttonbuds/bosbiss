import { useEffect, useRef } from 'react';

/** The brand "stem": a fixed vertical rule whose lime dot tracks scroll progress. */
export default function Stem() {
  const dot = useRef(null);

  useEffect(() => {
    let ticking = false;
    const place = () => {
      ticking = false;
      const el = dot.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      const pad = 24;
      el.style.top = `${pad + p * (window.innerHeight - pad * 2)}px`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(place);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    place();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="stem" aria-hidden="true">
      <span className="stem-dot" ref={dot} />
    </div>
  );
}
