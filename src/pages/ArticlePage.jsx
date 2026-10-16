import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Stem from '../components/Stem.jsx';
import { useTheme } from '../hooks.js';
import { useSiteContent } from '../lib/useSiteContent.js';
import { ContentContext } from '../lib/ContentContext.js';
import { listArticles, getArticle, formatDate } from '../lib/articles.js';

function setMeta(title, description) {
  document.title = title;
  const m = document.querySelector('meta[name="description"]');
  if (m && description) m.setAttribute('content', description);
  const c = document.querySelector('link[rel="canonical"]');
  if (c) c.setAttribute('href', `https://www.bosbiss.com${window.location.pathname}`);
}

function ArticleList() {
  const [state, setState] = useState({ items: null, error: null });

  useEffect(() => {
    setMeta('Articles — Bisri Mustofa', 'Technical articles about automation, web development, and applied AI.');
    const ctrl = new AbortController();
    listArticles(ctrl.signal)
      .then((items) => setState({ items, error: null }))
      .catch((e) => { if (e.name !== 'AbortError') setState({ items: [], error: e.message }); });
    return () => ctrl.abort();
  }, []);

  return (
    <section className="page">
      <p className="mono index">ARTICLES</p>
      <h1 className="page-title">Technical articles</h1>
      <p className="muted page-lede">Published writing about automation, web development, applied AI, and project notes.</p>

      {state.items === null && <p className="mono admin-note">Loading…</p>}
      {state.error && <p className="auth-msg err">Could not load articles ({state.error}).</p>}
      {state.items && state.items.length === 0 && !state.error && <p className="muted">No articles yet.</p>}

      <ul className="article-list">
        {(state.items || []).map((a) => (
          <li key={a.slug} className="article-card">
            <a href={`/articles/${a.slug}`}>
              {a.cover_url && <img className="article-card-cover" src={a.cover_url} alt="" loading="lazy" decoding="async" />}
              <span className="article-card-body">
                <span className="mono post-date">{formatDate(a.published_on)}</span>
                <span className="article-card-title">{a.title}</span>
                {a.description && <span className="work-desc">{a.description}</span>}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Article({ slug }) {
  const [state, setState] = useState({ article: undefined, error: null });

  useEffect(() => {
    const ctrl = new AbortController();
    getArticle(slug, ctrl.signal)
      .then((article) => {
        setState({ article, error: null });
        if (article) setMeta(`${article.title} — Bisri Mustofa`, article.description);
        else setMeta('Article not found — Bisri Mustofa');
      })
      .catch((e) => { if (e.name !== 'AbortError') setState({ article: null, error: e.message }); });
    return () => ctrl.abort();
  }, [slug]);

  const html = useMemo(
    () => (state.article ? DOMPurify.sanitize(state.article.content, { USE_PROFILES: { html: true } }) : ''),
    [state.article]
  );

  if (state.article === undefined) return <section className="page"><p className="mono admin-note">Loading…</p></section>;

  if (!state.article) {
    return (
      <section className="page">
        <p className="mono index">404</p>
        <h1 className="page-title">Article not found.</h1>
        {state.error && <p className="auth-msg err">{state.error}</p>}
        <a className="btn-cta" href="/articles">All articles</a>
      </section>
    );
  }

  const a = state.article;
  return (
    <article className="page article">
      <a className="mono back-link" href="/articles">← All articles</a>
      <p className="mono post-date">{formatDate(a.published_on)}</p>
      <h1 className="page-title">{a.title}</h1>
      {a.description && <p className="muted page-lede">{a.description}</p>}
      {a.cover_url && <img className="article-cover" src={a.cover_url} alt="" decoding="async" />}
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}

/** Handles /articles and /articles/:slug */
export default function ArticlePage({ slug }) {
  const [theme, toggleTheme] = useTheme();
  const content = useSiteContent();

  return (
    <ContentContext.Provider value={content}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Stem />
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main id="main" className="page-main">
        {slug ? <Article slug={slug} /> : <ArticleList />}
      </main>
      <Footer />
    </ContentContext.Provider>
  );
}
