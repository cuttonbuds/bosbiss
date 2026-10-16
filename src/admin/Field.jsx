import { useState } from 'react';
import { supabase } from '../lib/supabase.js';

const BUCKET = 'media';

/** Uploads to the public `media` bucket and returns the public URL. */
async function uploadFile(file, folder) {
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function UploadControl({ id, value, onChange, accept, folder, preview }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setErr(null);
    try { onChange(await uploadFile(file, folder)); }
    catch (ex) { setErr(ex.message || 'Upload failed'); }
    finally { setBusy(false); }
  };

  return (
    <div className="upload">
      {preview && value && <img className="upload-preview" src={value} alt="" />}
      <input id={id} type="text" placeholder="https://… or upload" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      <div className="upload-actions">
        <label className="btn btn-ghost upload-btn">
          {busy ? 'Uploading…' : 'Upload'}
          <input type="file" accept={accept} onChange={pick} disabled={busy} hidden />
        </label>
        {value && <button type="button" className="btn btn-ghost" onClick={() => onChange('')}>Clear</button>}
      </div>
      {err && <span className="auth-msg err">{err}</span>}
    </div>
  );
}

// One form control, driven by a field definition from schema.js.
export default function Field({ field, value, onChange, id }) {
  const { name, label, type = 'text', hint, width } = field;
  const inputId = id || `f-${name}`;
  const cls = `field${width === 'sm' ? ' field-sm' : ''}${type === 'image' || type === 'file' ? ' field-wide' : ''}`;

  if (type === 'bool') {
    return (
      <label className={`${cls} field-check`} htmlFor={inputId}>
        <input id={inputId} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }

  let control;
  if (type === 'textarea') {
    control = <textarea id={inputId} rows={3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  } else if (type === 'tags') {
    control = (
      <input
        id={inputId}
        type="text"
        value={Array.isArray(value) ? value.join(', ') : value ?? ''}
        onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
      />
    );
  } else if (type === 'number') {
    control = <input id={inputId} type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
  } else if (type === 'date') {
    control = <input id={inputId} type="date" value={value ?? ''} onChange={(e) => onChange(e.target.value || null)} />;
  } else if (type === 'image') {
    control = <UploadControl id={inputId} value={value} onChange={onChange} accept="image/*" folder="images" preview />;
  } else if (type === 'file') {
    control = <UploadControl id={inputId} value={value} onChange={onChange} accept="application/pdf,image/*" folder="files" />;
  } else {
    control = <input id={inputId} type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }

  return (
    <div className={cls}>
      <label className="mono field-label" htmlFor={inputId}>{label}</label>
      {control}
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}
