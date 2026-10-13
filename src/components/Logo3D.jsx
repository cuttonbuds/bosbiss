import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ExtrudeGeometry, Group, MathUtils, Vector2 } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { MARK_PATHS, MARK_DOT } from './Mark.jsx';

// Extrude the traced logo paths into real 3D geometry. Built once, shared across renders.
const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 460">
  <path fill="#fff" d="${MARK_PATHS.stem}"/>
  <path fill="#fff" d="${MARK_PATHS.topBowl}"/>
  <path fill="#fff" d="${MARK_PATHS.bottomBowl}"/>
</svg>`;

const EXTRUDE = { depth: 64, bevelEnabled: true, bevelThickness: 5, bevelSize: 4, bevelSegments: 3, curveSegments: 28 };
const DOT_EXTRUDE = { depth: 84, bevelEnabled: true, bevelThickness: 4, bevelSize: 3, bevelSegments: 3, curveSegments: 40 };

function buildGeometry() {
  const { paths } = new SVGLoader().parse(SVG);
  const shapes = paths.flatMap((p) => SVGLoader.createShapes(p));
  const letter = new ExtrudeGeometry(shapes, EXTRUDE);
  letter.center();

  // The dot as a separate, slightly taller cylinder so it pops out of the letter.
  const dotShape = SVGLoader.createShapes(
    new SVGLoader().parse(
      `<svg xmlns="http://www.w3.org/2000/svg"><circle fill="#fff" cx="${MARK_DOT.cx}" cy="${MARK_DOT.cy}" r="${MARK_DOT.r}"/></svg>`
    ).paths[0]
  );
  const dot = new ExtrudeGeometry(dotShape, DOT_EXTRUDE);
  // Position the dot relative to the (now centered) letter: letter bbox is 396x460 centered at (198,230).
  dot.translate(-198, -230, -(DOT_EXTRUDE.depth - EXTRUDE.depth) / 2);

  return { letter, dot };
}

const COLORS = {
  dark: { ink: '#F2F4F5', dot: '#B8F23C' },
  light: { ink: '#0B0D10', dot: '#4F7A00' },
};

function Letter({ theme, pointer }) {
  const group = useRef(new Group());
  const geo = useMemo(buildGeometry, []);
  const colors = COLORS[theme] || COLORS.dark;

  useEffect(() => () => { geo.letter.dispose(); geo.dot.dispose(); }, [geo]);

  useFrame((state, dt) => {
    const g = group.current;
    const t = state.clock.elapsedTime;
    // Idle drift + pointer parallax, eased.
    const targetY = Math.sin(t * 0.45) * 0.35 + pointer.current.x * 0.45;
    const targetX = Math.cos(t * 0.3) * 0.12 - pointer.current.y * 0.3;
    const k = 1 - Math.pow(0.001, dt); // frame-rate independent lerp
    g.rotation.y = MathUtils.lerp(g.rotation.y, targetY, k);
    g.rotation.x = MathUtils.lerp(g.rotation.x, targetX, k);
    g.position.y = Math.sin(t * 0.8) * 0.06;
  });

  // SVG y-axis points down; flip it. 1/230 puts the letter at ~2 units tall.
  return (
    <group ref={group} scale={[1 / 230, -1 / 230, 1 / 230]}>
      <mesh geometry={geo.letter}>
        <meshStandardMaterial color={colors.ink} roughness={0.42} metalness={0.12} />
      </mesh>
      <mesh geometry={geo.dot}>
        <meshStandardMaterial color={colors.dot} emissive={colors.dot} emissiveIntensity={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

/**
 * Animated 3D version of the logo mark.
 * - rendered in its own lazy chunk (three + r3f), never on the critical path
 * - frameloop stops when `active` is false (hero scrolled out of view)
 * - pixel ratio capped to keep GPU work small on high-DPI phones
 */
export default function Logo3D({ theme, active = true }) {
  const pointer = useRef(new Vector2(0, 0));

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 4.2], fov: 32 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <pointLight position={[-2.5, -1, 3]} intensity={2.2} color="#B8F23C" />
      <Letter theme={theme} pointer={pointer} />
    </Canvas>
  );
}
