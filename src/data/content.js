// All site copy lives here. Source: https://bosbiss.my.id/

export const EMAIL = 'bisrimustofa312@gmail.com';

export const nav = [
  { href: '#about', label: 'About' },
  { href: '#product', label: 'Product' },
  { href: '#projects', label: 'Projects' },
  { href: '#articles', label: 'Articles' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  eyebrow: ['WEB DEVELOPER', 'TECH ENTHUSIAST', 'IT DI LAMPUNG CERDAS'],
  lede:
    'Focusing on automation tools and AI technology. I am an experienced web developer with expertise in developing effective and efficient digital systems.',
  status: 'Open for custom work',
};

export const about = {
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
};

export const services = [
  {
    key: 'A',
    title: 'Web development',
    text: 'Company profiles, dashboards, and internal tools built with Laravel, Tailwind CSS, and Filament.',
  },
  {
    key: 'B',
    title: 'Workflow automation',
    text: 'Custom tools and n8n workflows that connect WhatsApp, Google Sheets, and the services you already use.',
  },
  {
    key: 'C',
    title: 'Applied AI',
    text: 'Chatbots and assistants powered by models like Gemini and Mistral, wired into real day-to-day processes.',
  },
];

export const products = {
  lede: 'Produk aktif dari Bisri Mustofa, lengkap dengan harga dan link pembelian.',
  items: [
    {
      title: '[Ebook] Automation Social Media',
      desc: 'Ebook reading that learns how to automate our social media.',
      meta: 'Rp 30.000 · Buy now',
      href: 'https://lynk.id/kubis/2k3xk2l6v385',
    },
  ],
  callout: {
    title: 'Butuh produk atau automation custom?',
    text: 'Saya bisa bantu membuat tool, workflow automation, atau digital product sesuai kebutuhan Anda.',
  },
};

export const projects = {
  lede: 'Published projects with their stack, demo links, and repository links.',
  items: [
    {
      title: 'Company Profile — PT Lampung Cerdas Mendunia',
      desc: 'Build a company profile for PT Lampung Cerdas Mendunia.',
      tags: ['Laravel', 'Tailwind CSS', 'Filament'],
      meta: '2025 · Open demo',
      href: 'https://lampungcerdas.com/',
    },
  ],
};

export const articles = {
  lede: 'Published writing about automation, web development, applied AI, and project notes.',
  items: [
    {
      date: '2025.11',
      title: 'Membuat Chatbot WhatsApp untuk Otomasi Catatan Keuangan Pribadi',
      desc: 'Membuat chatbot WhatsApp untuk membantu pencatatan keuangan pribadi dengan n8n, Gemini, Google Spreadsheet, dan Mistral AI.',
      href: 'https://bosbiss.my.id/articles/chatbot-whatsapp-untuk-otomasi-catatan-keuangan-pribadi',
    },
  ],
};

export const contact = {
  lede: 'Looking for something custom? I can build specialized tools and solutions tailored to your specific technical needs.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/bisbiss' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bisrimustofa/' },
    { label: 'Email', href: `mailto:${EMAIL}` },
  ],
};
