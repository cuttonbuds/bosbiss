import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import Field from './Field.jsx';
import { blankRow } from './schema.js';

export default function CollectionEditor({ config }) {
  const { table, label, fields, titleField } = config;
  const [rows, setRows] = useState(null);
  const [open, setOpen] = useState(null); // id of the row being edited, or 'new'
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    const { data, error } = await supabase.from(table).select('*').order('sort_order').order('created_at');
    if (error) setMsg({ ok: false, text: error.message });
    setRows(data || []);
  };

  useEffect(() => { load(); }, [table]); // eslint-disable-line react-hooks/exhaustive-deps

  const startNew = () => {
    const next = rows.length ? Math.max(...rows.map((r) => r.sort_order || 0)) + 1 : 1;
    setDraft(blankRow(config, next));
    setOpen('new');
    setMsg(null);
  };

  const startEdit = (row) => { setDraft({ ...row }); setOpen(row.id); setMsg(null); };
  const cancel = () => { setOpen(null); setDraft(null); };
  const set = (name, value) => setDraft((d) => ({ ...d, [name]: value }));

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { id, created_at, updated_at, ...payload } = draft; // eslint-disable-line no-unused-vars
    const q = open === 'new'
      ? supabase.from(table).insert(payload)
      : supabase.from(table).update(payload).eq('id', id);
    const { error } = await q;
    setBusy(false);
    if (error) { setMsg({ ok: false, text: error.message }); return; }
    setMsg({ ok: true, text: 'Saved.' });
    cancel();
    load();
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row[titleField]}"? This cannot be undone.`)) return;
    const { error } = await supabase.from(table).delete().eq('id', row.id);
    if (error) setMsg({ ok: false, text: error.message });
    else load();
  };

  const togglePublished = async (row) => {
    const { error } = await supabase.from(table).update({ published: !row.published }).eq('id', row.id);
    if (error) setMsg({ ok: false, text: error.message });
    else load();
  };

  if (!rows) return <p className="mono admin-note">Loading…</p>;

  // Only build the form when something is actually being edited (draft is null otherwise).
  const form = draft ? (
    <form className="editor editor-inline" onSubmit={save}>
      {fields.map((f) => (
        <Field key={f.name} field={f} id={`${table}-${f.name}`} value={draft[f.name]} onChange={(v) => set(f.name, v)} />
      ))}
      <div className="editor-actions">
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        <button className="btn btn-ghost" type="button" onClick={cancel}>Cancel</button>
      </div>
    </form>
  ) : null;

  return (
    <div className="collection">
      <div className="collection-head">
        <h2 className="admin-title">{label}</h2>
        <span className="mono muted">{rows.length} item{rows.length === 1 ? '' : 's'}</span>
        <button className="btn" type="button" onClick={startNew} disabled={open === 'new'}>+ Add</button>
      </div>

      {msg && <p className={`auth-msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</p>}

      {open === 'new' && <div className="row-card">{form}</div>}

      <ul className="rows">
        {rows.map((row) => (
          <li key={row.id} className={`row-card${row.published ? '' : ' row-draft'}`}>
            {open === row.id ? form : (
              <div className="row-line">
                <span className="mono row-order">{String(row.sort_order ?? 0).padStart(2, '0')}</span>
                <span className="row-title">{row[titleField]}</span>
                {!row.published && <span className="mono tag">draft</span>}
                <span className="row-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => togglePublished(row)}>
                    {row.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn btn-ghost" type="button" onClick={() => startEdit(row)}>Edit</button>
                  <button className="btn btn-ghost btn-danger" type="button" onClick={() => remove(row)}>Delete</button>
                </span>
              </div>
            )}
          </li>
        ))}
        {!rows.length && open !== 'new' && <li className="mono admin-note">Nothing here yet.</li>}
      </ul>
    </div>
  );
}
