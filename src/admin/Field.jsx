// One form control, driven by a field definition from schema.js.
export default function Field({ field, value, onChange, id }) {
  const { name, label, type = 'text', hint, width } = field;
  const inputId = id || `f-${name}`;
  const cls = `field${width === 'sm' ? ' field-sm' : ''}`;

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
