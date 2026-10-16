import Mark from './Mark.jsx';
import { nav } from '../data/content.js';
import { useContent } from '../lib/ContentContext.js';
import { useActiveSection } from '../hooks.js';

const idOf = (href) => (href.includes('#') ? href.split('#')[1] : '');
const IDS = nav.map((n) => idOf(n.href)).filter(Boolean);
const onArticles = typeof window !== 'undefined' && window.location.pathname.startsWith('/articles');

export default function Nav({ theme, onToggleTheme }) {
  const { name } = useContent();
  const active = useActiveSection(IDS);

  return (
    <header className="nav">
      <a href="/" className="brand" aria-label={`${name}, back to top`}>
        <Mark className="brand-mark" />
        <span className="brand-name">{name}</span>
      </a>
      <nav className="nav-links" aria-label="Main navigation">
        {nav.map((n) => (
          <a key={n.href} href={n.href} className={(idOf(n.href) ? active === idOf(n.href) : onArticles) ? 'active' : undefined}>
            {n.label}
          </a>
        ))}
      </nav>
      <button className="theme-toggle" type="button" aria-label="Toggle theme" onClick={onToggleTheme}>
        <span className="theme-toggle-dot" />
        <span className="mono theme-toggle-label">{theme}</span>
      </button>
    </header>
  );
}
