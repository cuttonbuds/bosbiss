import { supabase } from '../lib/supabase.js';

const BUCKET = 'media';
const MAX_EDGE = 1600;

/** Downscale large raster images in the browser and re-encode as WebP so the site stays fast. */
export async function optimizeImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/webp', 0.84));
  if (!blob || blob.size >= file.size) return file; // keep the original if WebP is not smaller
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
}

/** Uploads to the public `media` bucket and returns the public URL. */
export async function uploadFile(rawFile, folder) {
  const file = folder === 'images' ? await optimizeImage(rawFile) : rawFile;
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** URL-friendly slug from a title. */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}
