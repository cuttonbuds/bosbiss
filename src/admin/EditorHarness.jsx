import { useState } from 'react';
import Field from './Field.jsx';
import './admin.css';

/** Dev-only page (/__editor) to exercise the rich text editor without signing in. */
export default function EditorHarness() {
  const [html, setHtml] = useState('<p>Hello <strong>world</strong></p>');
  return (
    <div className="admin">
      <main className="admin-main">
        <div className="editor">
          <Field field={{ name: 'content', label: 'Article', type: 'richtext' }} value={html} onChange={setHtml} />
        </div>
        <pre id="harness-html" style={{ whiteSpace: 'pre-wrap', fontSize: 12, marginTop: 24 }}>{html}</pre>
      </main>
    </div>
  );
}
