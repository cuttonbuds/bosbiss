// Logo mark traced from public/assets/Logo B — Mark-selection.png.
// Shared by the inline <Mark/> SVG and by the 3D extrusion in Logo3D.jsx.

export const MARK_VIEWBOX = '0 0 396 460';

export const MARK_PATHS = {
  stem: 'M0 0H86V460H0Z',
  topBowl: 'M144 0H230A136.5 136.5 0 0 1 230 273H187V186H230A50 50 0 0 0 230 86H144Z',
  bottomBowl: 'M187 186H258A136.5 136.5 0 0 1 258 459H144V373H258A50 50 0 0 0 258 273H187Z',
};

export const MARK_DOT = { cx: 136.5, cy: 229.5, r: 32 };

export default function Mark({ className, ...rest }) {
  return (
    <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true" {...rest}>
      <path className="mark-ink" d={MARK_PATHS.stem} />
      <path className="mark-ink" d={MARK_PATHS.topBowl} />
      <path className="mark-ink" d={MARK_PATHS.bottomBowl} />
      <circle className="mark-dot" cx={MARK_DOT.cx} cy={MARK_DOT.cy} r={MARK_DOT.r} />
    </svg>
  );
}
