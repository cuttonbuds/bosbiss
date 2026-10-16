import { useState } from 'react';
import { useContent } from '../lib/ContentContext.js';

function SectionHead({ index, title }) {
  return (
    <div className="section-head reveal">
      <span className="mono index">{index}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Tags({ tags }) {
  if (!tags || !tags.length) return null;
  return (
    <span className="tags">
      {tags.map((t) => <span key={t} className="mono tag">{t}</span>)}
    </span>
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
              <Tags tags={it.tags} />
            </span>
            <span className="mono work-meta">{it.meta}</span>
            <span className="work-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Project card with optional thumbnail and expandable case-study details. */
function ProjectCard({ item, index }) {
  const [open, setOpen] = useState(false);
  const paragraphs = item.details ? item.details.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [];
  return (
    <li className="project reveal">
      {item.image && (
        <a className="project-thumb" href={item.href || '#'} target="_blank" rel="noopener" tabIndex={-1} aria-hidden="true">
          <img src={item.image} alt="" loading="lazy" decoding="async" />
        </a>
      )}
      <div className="project-body">
        <div className="project-head">
          <span className="mono work-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="mono work-meta">{item.meta}</span>
        </div>
        <h3 className="project-title">
          {item.href ? <a href={item.href} target="_blank" rel="noopener">{item.title} ↗</a> : item.title}
        </h3>
        <p className="work-desc">{item.desc}</p>
        <Tags tags={item.tags} />
        {paragraphs.length > 0 && (
          <>
            <button type="button" className="mono link-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
              {open ? 'Hide details' : 'Read case study'}
            </button>
            {open && (
              <div className="project-details">
                {paragraphs.map((p) => <p key={p.slice(0, 32)}>{p}</p>)}
              </div>
            )}
          </>
        )}
      </div>
    </li>
  );
}

export function About() {
  const { about, photoUrl, name } = useContent();
  return (
    <section className="section" id="about">
      <SectionHead index="01" title="About" />
      <div className={`split${photoUrl ? ' split-photo' : ''}`}>
        {photoUrl && (
          <figure className="photo reveal">
            <img src={photoUrl} alt={name} loading="lazy" decoding="async" />
          </figure>
        )}
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
  if (!products.items.length) return null;
  return (
    <section className="section" id="products">
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
  if (!projects.items.length) return null;
  return (
    <section className="section" id="projects">
      <SectionHead index="04" title="Tools and live projects" />
      {projects.lede && <p className="section-lede reveal">{projects.lede}</p>}
      <ul className="projects">
        {projects.items.map((it, i) => <ProjectCard key={it.href + it.title} item={it} index={i} />)}
      </ul>
    </section>
  );
}

export function Articles() {
  const { articles } = useContent();
  if (!articles.items.length) return null;
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

export function Testimonials() {
  const { testimonials } = useContent();
  if (!testimonials.length) return null;
  return (
    <section className="section" id="testimonials">
      <SectionHead index="06" title="What clients say" />
      <ul className="quotes">
        {testimonials.map((t) => (
          <li key={t.author + t.quote.slice(0, 16)} className="quote reveal">
            <blockquote>
              <p>“{t.quote}”</p>
              <footer>
                <span className="quote-author">{t.author}</span>
                {t.role && <span className="mono quote-role">{t.role}</span>}
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Contact() {
  const { contact, email, whatsapp, cvUrl, testimonials } = useContent();
  const index = testimonials.length ? '07' : '06';
  return (
    <section className="section contact" id="contact">
      <SectionHead index={index} title="Contact" />
      <p className="contact-lede reveal">{contact.lede}</p>
      <a className="contact-email reveal" href={`mailto:${email}`}>{email}</a>
      <div className="contact-ctas reveal">
        {whatsapp && <a className="btn-cta" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener">Chat on WhatsApp ↗</a>}
        {cvUrl && <a className="btn-cta btn-cta-ghost" href={cvUrl} target="_blank" rel="noopener">Download CV ↗</a>}
      </div>
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
