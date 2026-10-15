import Mark from './Mark.jsx';
import { useContent } from '../lib/ContentContext.js';

export default function Footer() {
  const { footer } = useContent();
  return (
    <footer className="footer">
      <Mark className="footer-mark" />
      <span className="mono">{footer.left.replace('©', `© ${new Date().getFullYear()}`)}</span>
      <span className="mono footer-right">{footer.right}</span>
    </footer>
  );
}
