import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import Field from './Field.jsx';

export default function ProfileEditor({ fields }) {
  const [row, setRow] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    supabase.from('profile').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error) setMsg({ ok: false, text: error.message });
      setRow(data || { id: 1 });
    });
  }, []);

  const set = (name, value) => { setRow((r) => ({ ...r, [name]: value })); setDirty(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const { updated_at, ...payload } = row; // eslint-disable-line no-unused-vars
    const { error } = await supabase.from('profile').upsert({ ...payload, id: 1 });
    setSaving(false);
    if (error) setMsg({ ok: false, text: error.message });
    else { setMsg({ ok: true, text: 'Saved.' }); setDirty(false); }
  };

  if (!row) return <p className="mono admin-note">Loading…</p>;

  return (
    <form className="editor" onSubmit={save}>
      {fields.map((f, i) =>
        f.group ? (
          <h2 key={`g-${i}`} className="editor-group">{f.group}</h2>
        ) : (
          <Field key={f.name} field={f} value={row[f.name]} onChange={(v) => set(f.name, v)} />
        )
      )}
      <div className="editor-actions">
        <button className="btn" type="submit" disabled={saving || !dirty}>{saving ? 'Saving…' : 'Save profile'}</button>
        {msg && <span className={`auth-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</span>}
      </div>
    </form>
  );
}
