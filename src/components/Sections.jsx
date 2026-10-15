import { useContent } from '../lib/ContentContext.js';

function SectionHead({ index, title }) {
  return (
    <div className="section-head reveal">
      <span className="mono index">{index}</span>
      <h2>{title}</h2>
    </div>
  );
}

function WorkList({ items }) {
  return (
    <ul className="work">
      {items.map((it, i) => (
        <li key={it.href + it.title} className="reveal">
          <a href={it.href || '#'} className="work-row" target="_blank" rel="noopener">
            <span className="mono work-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="work-main">
              <span className="work-title">{it.title}</span>
              <span className="work-desc">{it.desc}</span>
              {it.tags && it.tags.length > 0 && (
                <span className="tags">
                  {it.tags.map((t) => (
                    <span key={t} className="mono tag">{t}</span>
                  ))}
                </span>
              )}
            </span>
            <span className="mono work-meta">{it.meta}</span>
            <span className="work-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function About() {
  const { about } = useContent();
  return (
    <section className="section" id="about">
      <SectionHead index="01" title="About" />
      <div className="split">
        <div className="prose reveal">
          {about.paragraphs.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </div>
        <dl className="spec reveal">
          {about.spec.map(([k, v]) => (
            <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Services() {
  const { services } = useContent();
  if (!services.length) return null;
  return (
    <section className="section" id="services">
      <SectionHead index="02" title="What I do" />
      <div className="cards">
        {services.map((s) => (
          <article key={s.key + s.title} className="card reveal">
            <span className="mono card-index">{s.key}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Products() {
  const { products, email } = useContent();
  return (
    <section className="section" id="product">
      <SectionHead index="03" title="Digital products" />
      {products.lede && <p className="section-lede reveal">{products.lede}</p>}
      <WorkList items={products.items} />
      {products.callout.title && (
        <div className="callout reveal">
          <p className="callout-title">{products.callout.title}</p>
          <p className="callout-text">{products.callout.text}</p>
          <a className="mono callout-link" href={`mailto:${email}`}>Contact ↗</a>
        </div>
      )}
    </section>
  );
}

export function Projects() {
  const { projects } = useContent();
  return (
    <section className="section" id="projects">
      <SectionHead index="04" title="Tools and live projects" />
      {projects.lede && <p className="section-lede reveal">{projects.lede}</p>}
      <WorkList items={projects.items} />
    </section>
  );
}

export function Articles() {
  const { articles } = useContent();
  return (
    <section className="section" id="articles">
      <SectionHead index="05" title="Technical articles" />
      {articles.lede && <p className="section-lede reveal">{articles.lede}</p>}
      <ul className="posts">
        {articles.items.map((a) => (
          <li key={a.href + a.title} className="reveal">
            <a href={a.href || '#'} className="post" target="_blank" rel="noopener">
              <span className="mono post-date">{a.date}</span>
              <span className="post-main">
                <span className="post-title">{a.title}</span>
                <span className="post-desc">{a.desc}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  const { contact, email } = useContent();
  return (
    <section className="section contact" id="contact">
      <SectionHead index="06" title="Contact" />
      <p className="contact-lede reveal">{contact.lede}</p>
      <a className="contact-email reveal" href={`mailto:${email}`}>{email}</a>
      <ul className="socials reveal">
        {contact.socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} className="mono" target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
              {s.label} ↗
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
