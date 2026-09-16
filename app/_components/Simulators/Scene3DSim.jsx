"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Line,
  Text,
  Sphere,
  Box,
  Cylinder,
  Plane,
} from "@react-three/drei";
import { Parser } from "expr-eval";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";

// Dynamic 3D simulator. The LLM emits a scene DSL per question:
//   {
//     camera:  { position: [x,y,z], target?: [x,y,z], fov?: number },
//     controls: [{ name, label, value, min, max, unit? }, ...],
//     primitives: [
//       { type: "sphere", at:[x,y,z], r, color, label?, opacity? },
//       { type: "box",    at, size:[w,h,d], color, label?, rotation? },
//       { type: "arrow",  from:[x,y,z], to:[x,y,z], color, label? },
//       { type: "line",   from, to, color, dashed? },
//       { type: "cylinder", from, to, r, color, label? },  // bonds / rods
//       { type: "plane",  at, size:[w,h], color, opacity?, rotation? },
//       { type: "text",   at, text, size?, color? },
//     ]
//   }
//
// Any numeric slot (a coordinate, a radius, etc.) can be either a literal
// number OR a string expression that references control names — evaluated
// live with expr-eval. So a slider on "distance" instantly moves the
// primitive that has "at: ['distance', 0, 0]".
//
// Sandboxed: expr-eval whitelisted math only. No eval, no code exec.

export default function Scene3DSim({
  camera = { position: [4, 3, 5], target: [0, 0, 0], fov: 50 },
  controls = [],
  primitives = [],
  autoRotate = false,
}) {
  const initial = useMemo(
    () => Object.fromEntries(controls.map((c) => [c.name, Number(c.value)])),
    [controls],
  );
  const [values, setValues] = useState(initial);
  const parser = useMemo(() => new Parser(), []);

  const evalNum = (v, scope) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      try {
        return parser.parse(v).evaluate(scope);
      } catch {
        return 0;
      }
    }
    return 0;
  };
  const evalArr = (arr, scope) =>
    Array.isArray(arr) ? arr.map((v) => evalNum(v, scope)) : undefined;

  const resolved = useMemo(() => {
    return primitives.map((p) => ({
      ...p,
      at: evalArr(p.at, values),
      from: evalArr(p.from, values),
      to: evalArr(p.to, values),
      size: evalArr(p.size, values),
      rotation: evalArr(p.rotation, values),
      r: p.r != null ? evalNum(p.r, values) : undefined,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primitives, values]);

  const reset = () => setValues(initial);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative rounded-2xl border border-border bg-[#0b0d10] overflow-hidden"
        style={{ height: "min(60vh, 400px)" }}
      >
        <Canvas
          camera={{
            position: camera.position ?? [4, 3, 5],
            fov: camera.fov ?? 50,
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#0b0d10"]} />
          <ambientLight intensity={0.55} />
          <directionalLight position={[5, 8, 5]} intensity={0.9} />
          <directionalLight position={[-5, 3, -3]} intensity={0.35} />
          <Grid
            args={[20, 20]}
            cellColor="#333"
            sectionColor="#555"
            fadeDistance={30}
            fadeStrength={1.5}
            infiniteGrid
          />
          <axesHelper args={[1.5]} />
          <Suspense fallback={null}>
            {resolved.map((p, i) => (
              <Primitive key={i} p={p} />
            ))}
          </Suspense>
          <OrbitControls
            target={camera.target ?? [0, 0, 0]}
            enablePan
            enableRotate
            enableZoom
            autoRotate={autoRotate}
            autoRotateSpeed={0.6}
          />
        </Canvas>
        <div className="absolute bottom-3 left-3 text-[10.5px] text-white/70 bg-black/40 backdrop-blur px-2 py-1 rounded-md">
          Drag to rotate · scroll to zoom
        </div>
        <button
          type="button"
          onClick={reset}
          className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 flex items-center justify-center"
          title="Reset sliders"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Sliders — only rendered when the scene declares them */}
      {controls.length > 0 && (
        <div className="rounded-2xl border border-border bg-background/50 p-4">
          <h4 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Controls — drag to move things in the scene
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {controls.map((c) => (
              <Slider
                key={c.name}
                label={c.label ?? c.name}
                unit={c.unit ?? ""}
                min={c.min ?? 0}
                max={c.max ?? Math.max(c.value * 3, c.value + 1)}
                step={c.step ?? guessStep(c)}
                value={values[c.name]}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, [c.name]: v }))
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Dispatch a single primitive to its Three.js representation.
function Primitive({ p }) {
  const color = p.color || "#ea580c";
  switch (p.type) {
    case "sphere":
      return (
        <group position={p.at ?? [0, 0, 0]}>
          <Sphere args={[p.r ?? 0.3, 24, 24]}>
            <meshStandardMaterial
              color={color}
              transparent={p.opacity != null}
              opacity={p.opacity ?? 1}
            />
          </Sphere>
          {p.label ? <Label at={[0, (p.r ?? 0.3) + 0.25, 0]} text={p.label} color={color} /> : null}
        </group>
      );
    case "box":
      return (
        <group position={p.at ?? [0, 0, 0]} rotation={p.rotation ?? [0, 0, 0]}>
          <Box args={p.size ?? [1, 1, 1]}>
            <meshStandardMaterial
              color={color}
              transparent={p.opacity != null}
              opacity={p.opacity ?? 1}
            />
          </Box>
          {p.label ? <Label at={[0, (p.size?.[1] ?? 1) / 2 + 0.25, 0]} text={p.label} color={color} /> : null}
        </group>
      );
    case "arrow":
      return <ArrowLine from={p.from} to={p.to} color={color} label={p.label} />;
    case "line":
      return (
        <Line
          points={[p.from ?? [0, 0, 0], p.to ?? [1, 0, 0]]}
          color={color}
          lineWidth={p.dashed ? 1 : 1.5}
          dashed={!!p.dashed}
          dashSize={0.1}
          gapSize={0.05}
        />
      );
    case "cylinder": {
      const from = new THREE.Vector3(...(p.from ?? [0, 0, 0]));
      const to = new THREE.Vector3(...(p.to ?? [1, 0, 0]));
      const mid = from.clone().add(to).multiplyScalar(0.5);
      const length = from.distanceTo(to);
      const dir = to.clone().sub(from).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir,
      );
      return (
        <group position={mid.toArray()} quaternion={quat.toArray()}>
          <Cylinder args={[p.r ?? 0.05, p.r ?? 0.05, length, 16]}>
            <meshStandardMaterial color={color} />
          </Cylinder>
          {p.label ? <Label at={[0, 0, 0]} text={p.label} color={color} /> : null}
        </group>
      );
    }
    case "plane":
      return (
        <group position={p.at ?? [0, 0, 0]} rotation={p.rotation ?? [-Math.PI / 2, 0, 0]}>
          <Plane args={p.size ?? [2, 2]}>
            <meshStandardMaterial
              color={color}
              transparent
              opacity={p.opacity ?? 0.35}
              side={THREE.DoubleSide}
            />
          </Plane>
        </group>
      );
    case "text":
      return (
        <Label at={p.at ?? [0, 0, 0]} text={p.text ?? ""} color={color} size={p.size ?? 0.22} />
      );
    default:
      return null;
  }
}

function ArrowLine({ from, to, color, label }) {
  const start = new THREE.Vector3(...(from ?? [0, 0, 0]));
  const end = new THREE.Vector3(...(to ?? [1, 0, 0]));
  const dir = end.clone().sub(start);
  const length = dir.length();
  if (length < 1e-4) return null;
  const nDir = dir.clone().normalize();
  // Arrowhead sits at the end; shaft goes from start to (end - head).
  const headLen = Math.min(0.25, length * 0.25);
  const shaftEnd = end.clone().sub(nDir.clone().multiplyScalar(headLen));
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    nDir,
  );
  return (
    <group>
      <Line
        points={[start.toArray(), shaftEnd.toArray()]}
        color={color}
        lineWidth={2}
      />
      <group
        position={end.clone().sub(nDir.clone().multiplyScalar(headLen / 2)).toArray()}
        quaternion={quat.toArray()}
      >
        <mesh>
          <coneGeometry args={[headLen * 0.5, headLen, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
      {label ? (
        <Label
          at={end
            .clone()
            .add(nDir.clone().multiplyScalar(0.15))
            .toArray()}
          text={label}
          color={color}
        />
      ) : null}
    </group>
  );
}

function Label({ at, text, color, size = 0.22 }) {
  return (
    <Billboard at={at}>
      <Text
        fontSize={size}
        color={color ?? "#eaeaea"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000"
      >
        {text}
      </Text>
    </Billboard>
  );
}

// Billboard — a lightweight rig that keeps its children facing the camera
// every frame. Only runs while a Canvas is mounted, so useFrame is safe.
function Billboard({ at, children }) {
  const ref = useRef();
  useFrame(({ camera }) => {
    if (ref.current) ref.current.quaternion.copy(camera.quaternion);
  });
  return (
    <group ref={ref} position={at}>
      {children}
    </group>
  );
}

function guessStep(input) {
  const range = (input.max ?? input.value * 3) - (input.min ?? 0);
  if (range <= 1) return 0.01;
  if (range <= 20) return 0.1;
  if (range <= 200) return 1;
  return Math.round(range / 100);
}

function Slider({ label, value, unit, min, max, step, onChange }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <span className="normal-case tracking-normal text-[11px] text-foreground/85">
          {label}
        </span>
        <span className="font-mono normal-case tracking-normal text-foreground">
          {typeof value === "number" ? value.toFixed(2) : value}
          {unit ? ` ${unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
    </label>
  );
}
