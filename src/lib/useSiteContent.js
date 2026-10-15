import { useEffect, useState } from 'react';
import { staticContent, fromDb } from '../data/content.js';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

const CACHE_KEY = 'bb-content-v1';

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? fromDb(JSON.parse(raw)) : null;
  } catch (e) { return null; }
}

/**
 * Site content with zero loading state:
 *  1. render instantly from the last cached copy (or the bundled static copy),
 *  2. fetch the live content from Supabase with ONE request (an RPC, no SDK),
 *  3. swap it in and refresh the cache.
 */
export function useSiteContent() {
  const [content, setContent] = useState(() => readCache() || staticContent);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${SUPABASE_URL}/rest/v1/rpc/get_site_content`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: '{}',
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => {
        if (!json || !json.profile) return;
        setContent(fromDb(json));
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(json)); } catch (e) { /* ignore */ }
      })
      .catch(() => { /* keep whatever we already have */ });
    return () => ctrl.abort();
  }, []);

  return content;
}
