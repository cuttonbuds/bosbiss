import Mark from './Mark.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <Mark className="footer-mark" />
      <span className="mono">© {new Date().getFullYear()} BISRI MUSTOFA</span>
      <span className="mono footer-right">BOSBISS.COM &nbsp;/&nbsp; LAMPUNG, ID</span>
    </footer>
  );
}
