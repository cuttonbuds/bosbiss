import { useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { uploadFile } from './upload.js';

const BTN = (editor, label, action, isActive, title) => (
  <button
    type="button"
    key={label}
    title={title || label}
    className={`rte-btn${isActive && isActive() ? ' active' : ''}`}
    onMouseDown={(e) => e.preventDefault()}
    onClick={action}
  >
    {label}
  </button>
);

/** TipTap-based rich text editor. Emits HTML through onChange. */
export default function RichEditor({ id, value, onChange }) {
  const fileInput = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: 'Write your article…' }),
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.isEmpty ? '' : ed.getHTML()),
    editorProps: { attributes: { class: 'rte-content', id: id || undefined } },
  });

  // Keep the editor in sync if the parent swaps rows while mounted.
  const lastValue = useRef(value);
  useEffect(() => {
    if (!editor || value === lastValue.current) return;
    lastValue.current = value;
    if (value !== editor.getHTML()) editor.commands.setContent(value || '', false);
  }, [value, editor]);

  if (!editor) return <p className="mono admin-note">Loading editor…</p>;

  const setLink = () => {
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('Link URL', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const pickImage = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const url = await uploadFile(file, 'images');
      editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, '') }).run();
    } catch (ex) {
      window.alert(ex.message || 'Upload failed');
    }
  };

  const c = () => editor.chain().focus();

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        {BTN(editor, 'H2', () => c().toggleHeading({ level: 2 }).run(), () => editor.isActive('heading', { level: 2 }), 'Heading 2')}
        {BTN(editor, 'H3', () => c().toggleHeading({ level: 3 }).run(), () => editor.isActive('heading', { level: 3 }), 'Heading 3')}
        {BTN(editor, 'P', () => c().setParagraph().run(), () => editor.isActive('paragraph'), 'Paragraph')}
        <span className="rte-sep" />
        {BTN(editor, 'B', () => c().toggleBold().run(), () => editor.isActive('bold'), 'Bold')}
        {BTN(editor, 'I', () => c().toggleItalic().run(), () => editor.isActive('italic'), 'Italic')}
        {BTN(editor, 'S', () => c().toggleStrike().run(), () => editor.isActive('strike'), 'Strikethrough')}
        {BTN(editor, '</>', () => c().toggleCode().run(), () => editor.isActive('code'), 'Inline code')}
        <span className="rte-sep" />
        {BTN(editor, '• List', () => c().toggleBulletList().run(), () => editor.isActive('bulletList'), 'Bullet list')}
        {BTN(editor, '1. List', () => c().toggleOrderedList().run(), () => editor.isActive('orderedList'), 'Numbered list')}
        {BTN(editor, '❝', () => c().toggleBlockquote().run(), () => editor.isActive('blockquote'), 'Quote')}
        {BTN(editor, '{ }', () => c().toggleCodeBlock().run(), () => editor.isActive('codeBlock'), 'Code block')}
        {BTN(editor, '—', () => c().setHorizontalRule().run(), null, 'Divider')}
        <span className="rte-sep" />
        {BTN(editor, 'Link', setLink, () => editor.isActive('link'), 'Add / edit link')}
        {BTN(editor, 'Image', () => fileInput.current && fileInput.current.click(), null, 'Upload image')}
        <input ref={fileInput} type="file" accept="image/*" hidden onChange={pickImage} />
        <span className="rte-sep" />
        {BTN(editor, '↶', () => c().undo().run(), null, 'Undo')}
        {BTN(editor, '↷', () => c().redo().run(), null, 'Redo')}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
