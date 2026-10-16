// Bundled fallback copy of the site content (rendered on the very first paint and
// whenever Supabase is unreachable). Live content comes from the `get_site_content`
// RPC and is mapped into this same shape by `fromDb`.

export const nav = [
  { href: '/#about', label: 'About' },
  { href: '/#products', label: 'Products' },
  { href: '/#projects', label: 'Projects' },
  { href: '/articles', label: 'Articles' },
  { href: '/#contact', label: 'Contact' },
];

export const staticContent = {
  name: 'Bisri Mustofa',
  email: 'bisrimustofa312@gmail.com',
  whatsapp: '',
  cvUrl: '',
  photoUrl: '',
  hero: {
    eyebrow: ['WEB DEVELOPER', 'TECH ENTHUSIAST', 'IT DI LAMPUNG CERDAS'],
    headline: ['Building digital', 'experiences with', 'code and creativity.'],
    lede: 'Focusing on automation tools and AI technology. I am an experienced web developer with expertise in developing effective and efficient digital systems.',
    status: 'Open for custom work',
  },
  about: {
    paragraphs: [
      "I'm Bisri Mustofa, a web developer and tech enthusiast based in Lampung, Indonesia, currently working in IT at Lampung Cerdas. I build digital experiences with code and creativity, with a focus on automation tools and applied AI.",
      'My work ranges from company websites and internal tools to workflow automation and chatbots. Whatever the shape, the goal is the same: digital systems that are effective, efficient, and actually used.',
    ],
    spec: [
      ['Location', 'Lampung, Indonesia'],
      ['Role', 'IT at Lampung Cerdas'],
      ['Focus', 'Automation tools & AI technology'],
      ['Stack', 'Laravel, Tailwind CSS, Filament, n8n'],
    ],
  },
  services: [
    { key: 'A', title: 'Web development', text: 'Company profiles, dashboards, and internal tools built with Laravel, Tailwind CSS, and Filament.' },
    { key: 'B', title: 'Workflow automation', text: 'Custom tools and n8n workflows that connect WhatsApp, Google Sheets, and the services you already use.' },
    { key: 'C', title: 'Applied AI', text: 'Chatbots and assistants powered by models like Gemini and Mistral, wired into real day-to-day processes.' },
  ],
  products: {
    lede: 'Produk aktif dari Bisri Mustofa, lengkap dengan harga dan link pembelian.',
    items: [
      { title: '[Ebook] Automation Social Media', desc: 'Ebook reading that learns how to automate our social media.', meta: 'Rp 30.000 · Buy now', href: 'https://lynk.id/kubis/2k3xk2l6v385' },
    ],
    callout: {
      title: 'Butuh produk atau automation custom?',
      text: 'Saya bisa bantu membuat tool, workflow automation, atau digital product sesuai kebutuhan Anda.',
    },
  },
  projects: {
    lede: 'Published projects with their stack, demo links, and repository links.',
    items: [
      { title: 'Company Profile — PT Lampung Cerdas Mendunia', desc: 'Build a company profile for PT Lampung Cerdas Mendunia.', tags: ['Laravel', 'Tailwind CSS', 'Filament'], meta: '2025 · Open demo', href: 'https://lampungcerdas.com/', image: '', details: '' },
    ],
  },
  articles: {
    lede: 'Published writing about automation, web development, applied AI, and project notes.',
    items: [
      { date: '2025.11', title: 'Membuat Chatbot WhatsApp untuk Otomasi Catatan Keuangan Pribadi', desc: 'Membuat chatbot WhatsApp untuk membantu pencatatan keuangan pribadi dengan n8n, Gemini, Google Spreadsheet, dan Mistral AI.', href: 'https://bosbiss.my.id/articles/chatbot-whatsapp-untuk-otomasi-catatan-keuangan-pribadi' },
    ],
  },
  testimonials: [],
  contact: {
    lede: 'Looking for something custom? I can build specialized tools and solutions tailored to your specific technical needs.',
    socials: [
      { label: 'GitHub', href: 'https://github.com/bisbiss' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bisrimustofa/' },
      { label: 'Email', href: 'mailto:bisrimustofa312@gmail.com' },
    ],
  },
  footer: { left: '© BISRI MUSTOFA', right: 'BOSBISS.COM / LAMPUNG, ID' },
};

const fmtDate = (d) => (d ? String(d).slice(0, 7).replace('-', '.') : '');

/** Map the `get_site_content()` JSON into the shape the components render. */
export function fromDb(json) {
  const p = json.profile || {};
  const s = staticContent;
  return {
    name: p.name || s.name,
    email: p.email || s.email,
    whatsapp: (p.whatsapp || '').replace(/\D/g, ''),
    cvUrl: p.cv_url || '',
    photoUrl: p.photo_url || '',
    hero: {
      eyebrow: p.eyebrow && p.eyebrow.length ? p.eyebrow : s.hero.eyebrow,
      headline: [p.headline_1, p.headline_2, p.headline_3].filter(Boolean),
      lede: p.lede || '',
      status: p.status_text || '',
    },
    about: {
      paragraphs: [p.about_1, p.about_2].filter(Boolean),
      spec: [['Location', p.location], ['Role', p.role], ['Focus', p.focus], ['Stack', p.stack]].filter(([, v]) => v),
    },
    services: (json.services || []).map((r) => ({ key: r.key, title: r.title, text: r.description })),
    products: {
      lede: p.products_lede || '',
      items: (json.products || []).map((r) => ({
        title: r.title, desc: r.description, href: r.url,
        meta: [r.price_label, 'Buy now'].filter(Boolean).join(' · '),
      })),
      callout: { title: p.products_callout_title || '', text: p.products_callout_text || '' },
    },
    projects: {
      lede: p.projects_lede || '',
      items: (json.projects || []).map((r) => ({
        title: r.title, desc: r.description, tags: r.tags || [], href: r.url,
        image: r.image_url || '', details: r.details || '',
        meta: [r.year, r.url ? 'Open demo' : ''].filter(Boolean).join(' · '),
      })),
    },
    articles: {
      lede: p.articles_lede || '',
      items: (json.articles || []).map((r) => {
        const internal = !!(r.has_content && r.slug);
        return {
          date: fmtDate(r.published_on), title: r.title, desc: r.description,
          href: internal ? `/articles/${r.slug}` : r.url, internal,
        };
      }),
    },
    testimonials: (json.testimonials || []).map((r) => ({ quote: r.quote, author: r.author, role: r.role || '' })),
    contact: {
      lede: p.contact_lede || '',
      socials: (json.social_links || []).map((r) => ({ label: r.label, href: r.url })),
    },
    footer: { left: p.footer_left || s.footer.left, right: p.footer_right || s.footer.right },
  };
}
