import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BEAD_COUNT } from "@/lib/terco/sequence";

const RING_R = 2.4;
const VIOLET = new THREE.Color("#8b5cf6");
const GOLD = new THREE.Color("#e9c46a");

/** Posições das 61 contas: 0..5 no pingente (cruz embaixo), 6 = medalha, 7..60 no anel. */
function useBeadPositions() {
  return useMemo(() => {
    const pos: THREE.Vector3[] = new Array(BEAD_COUNT);
    const medalY = -RING_R;
    pos[6] = new THREE.Vector3(0, medalY, 0);
    // pingente: 5 (perto da medalha) até 0 (cruz)
    const pend = [5, 4, 3, 2, 1, 0];
    pend.forEach((b, i) => { pos[b] = new THREE.Vector3(0, medalY - 0.55 - i * 0.42 - (b === 0 ? 0.35 : 0), 0); });
    const ringBeads = BEAD_COUNT - 7; // 54 contas no anel (7..60)
    for (let i = 0; i < ringBeads; i++) {
      const a = -Math.PI / 2 + ((i + 1) / (ringBeads + 1)) * Math.PI * 2;
      pos[7 + i] = new THREE.Vector3(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0);
    }
    return pos;
  }, []);
}

export function beadKind(i: number): "cross" | "big" | "small" | "medal" {
  if (i === 0) return "cross";
  if (i === 6) return "medal";
  if (i === 1 || i === 5) return "big";
  if (i > 6 && (i - 6) % 11 === 0) return "big";
  return "small";
}

function Cross() {
  const wood = { color: "#7a4a24", roughness: 0.55, metalness: 0.05 } as const;
  return (
    <group>
      <mesh><boxGeometry args={[0.16, 0.8, 0.1]} /><meshStandardMaterial {...wood} /></mesh>
      <mesh position={[0, 0.15, 0]}><boxGeometry args={[0.5, 0.15, 0.1]} /><meshStandardMaterial {...wood} /></mesh>
      <mesh position={[0, 0.08, 0.07]}><boxGeometry args={[0.07, 0.4, 0.04]} /><meshStandardMaterial color="#d8b25a" metalness={0.8} roughness={0.3} /></mesh>
    </group>
  );
}

function Bead({ i, p, state, onTap }: { i: number; p: THREE.Vector3; state: "done" | "current" | "todo"; onTap: (i: number) => void }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const kind = beadKind(i);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.emissiveIntensity = state === "current" ? 0.8 + Math.sin(clock.elapsedTime * 4) * 0.4 : state === "done" ? 0.25 : 0;
  });
  const emissive = state === "current" ? VIOLET : GOLD;
  const handle = (e: any) => { e.stopPropagation(); onTap(i); };
  if (kind === "cross") return <group position={p} onClick={handle}><Cross />{state === "current" && <pointLight color="#8b5cf6" intensity={4} distance={1.5} />}</group>;
  if (kind === "medal") {
    return (
      <mesh position={p} rotation={[Math.PI / 2, 0, 0]} onClick={handle}>
        <cylinderGeometry args={[0.28, 0.28, 0.07, 32]} />
        <meshStandardMaterial ref={ref} color="#d9b45b" metalness={0.85} roughness={0.25} emissive={emissive} />
      </mesh>
    );
  }
  const r = kind === "big" ? 0.17 : 0.11;
  return (
    <mesh position={p} onClick={handle}>
      <sphereGeometry args={[r, 24, 24]} />
      <meshStandardMaterial ref={ref} color={kind === "big" ? "#5b3a1e" : "#8a5a2b"} roughness={0.35} metalness={0.1} emissive={emissive} />
    </mesh>
  );
}

function Cord({ pos }: { pos: THREE.Vector3[] }) {
  const geo = useMemo(() => {
    const ring = new THREE.CatmullRomCurve3(Array.from({ length: 64 }, (_, k) => {
      const a = (k / 64) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0);
    }), true);
    return new THREE.TubeGeometry(ring, 200, 0.018, 6, true);
  }, []);
  const pend = useMemo(() => new THREE.TubeGeometry(new THREE.LineCurve3(pos[6], pos[0]), 4, 0.018, 6), [pos]);
  return (<>
    <mesh geometry={geo}><meshStandardMaterial color="#c9b8a0" roughness={0.9} /></mesh>
    <mesh geometry={pend}><meshStandardMaterial color="#c9b8a0" roughness={0.9} /></mesh>
  </>);
}

function Focus({ target, controls }: { target: THREE.Vector3; controls: React.MutableRefObject<any> }) {
  const { camera } = useThree();
  useFrame((_, d) => {
    const dt = Math.min(d, 0.05);
    const c = controls.current; if (!c) return;
    const k = 1 - Math.exp(-3 * dt);
    const desired = target.clone().multiplyScalar(0.55);
    c.target.lerp(desired, k);
    c.update();
    void camera;
  });
  return null;
}

export default function RosaryScene({ currentBead, doneBeads, onTapBead }: { currentBead: number; doneBeads: Set<number>; onTapBead: (i: number) => void }) {
  const controls = useRef<any>(null);
  return (
    <Canvas camera={{ position: [0, -0.5, 8.5], fov: 45 }} dpr={[1, 2]} onCreated={({ gl }) => { gl.domElement.parentElement?.parentElement?.setAttribute("data-scene-ready", "1"); }}>
      <Inner currentBead={currentBead} doneBeads={doneBeads} onTapBead={onTapBead} controls={controls} />
    </Canvas>
  );
}

function Inner({ currentBead, doneBeads, onTapBead, controls }: any) {
  const pos = useBeadPositions();
  return (<>
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 4, 5]} intensity={1.6} />
    <Environment resolution={64}>
      <Lightformer intensity={2} position={[0, 5, 2]} scale={[10, 10, 1]} />
      <Lightformer intensity={1} color="#c4b5fd" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
    </Environment>
    <group position={[0, 1.2, 0]}>
      <Cord pos={pos} />
      {pos.map((p, i) => (
        <Bead key={i} i={i} p={p} state={i === currentBead ? "current" : doneBeads.has(i) ? "done" : "todo"} onTap={onTapBead} />
      ))}
    </group>
    <OrbitControls ref={controls} enablePan={false} minDistance={3} maxDistance={12} />
    <Focus target={pos[currentBead].clone().add(new THREE.Vector3(0, 1.2, 0))} controls={controls} />
  </>);
}
