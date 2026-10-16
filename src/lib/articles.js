import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };
const BASE = `${SUPABASE_URL}/rest/v1/articles`;

async function get(query, signal) {
  const r = await fetch(`${BASE}?${query}`, { headers: HEADERS, signal });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

/** Published articles that have an internal page, newest first. */
export function listArticles(signal) {
  return get('select=slug,title,description,cover_url,published_on&published=eq.true&content=neq.&order=published_on.desc.nullslast,sort_order.asc', signal);
}

/** One published article by slug, or null. */
export async function getArticle(slug, signal) {
  const rows = await get(`select=slug,title,description,cover_url,content,published_on,updated_at&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`, signal);
  return rows[0] || null;
}

export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
