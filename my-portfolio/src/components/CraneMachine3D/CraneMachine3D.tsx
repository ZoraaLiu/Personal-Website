import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import {
  EffectComposer,
  ToneMapping,
  Vignette,
  Bloom,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  useCallback,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import styles from "./CraneMachine3D.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type Theme = "light" | "dark";

type GamePhase =
  | "idle"             // auto-rotate showcase
  | "playing"          // player moves claw XZ
  | "dropping"         // claw descends
  | "grabbing"         // proximity check at floor
  | "lifting"          // claw rises, empty
  | "lifting_with_toy" // claw rises, toy attached
  | "delivering"       // carriage moves to drop zone
  | "releasing"        // toy removed + score
  | "ending";          // all toys collected — win screen

interface InputState {
  x: number;           // -1 left / +1 right
  z: number;           // -1 forward / +1 back
  drop: boolean;
  start: boolean;
}

type ToySnapshot = {
  obj:        THREE.Object3D;
  parent:     THREE.Object3D;
  localPos:   THREE.Vector3;
  localQuat:  THREE.Quaternion;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const MODEL_PATH   = `${import.meta.env.BASE_URL}models/crane_machine.glb`;
const PRONG_BELOW  = 0.30;
const GRAB_RADIUS  = 0.2;
const GRAB_PAUSE   = 0.18;
const XZ_SPEED     = 1.4;
const XZ_LERP      = 12.0;
const DROP_LERP    = 6.0;
const LIFT_LERP    = 9.0;
const Y_ARRIVAL    = 0.008;
const XZ_ARRIVAL   = 0.025;
const BOUNDS_X     = 0.52;
const BOUNDS_Z     = 0.28;
const DROP_ZONE_X  = 0.30;
const DROP_ZONE_Z  = 0.22;
const WIN_DELAY_MS = 3500;

// Camera framing — only DIRECTIONS are constant.
// Distance, near, far, and OrbitControls limits are derived at runtime
// from the actual model bounding box + current viewport aspect ratio.
const IDLE_CAM_DIR = new THREE.Vector3(0.45, 0.50, 1).normalize();
const PLAY_CAM_DIR = new THREE.Vector3(0.00, 0.45, 1).normalize();
const FIT_PADDING_IDLE = 1.08;   // 1.0 = exactly fits, >1 = breathing room
const FIT_PADDING_PLAY = 1.04;   // slightly tighter during gameplay
const CAM_FOV          = 34;     // vertical FOV (degrees)

// ─── Fit utilities (no model rescaling, only camera math) ─────────────────────
type FitData = {
  center: THREE.Vector3;  // bbox center in world space *before* centering
  radius: number;         // bounding sphere radius (used for near/far only)
  size:   THREE.Vector3;  // bbox dimensions
  baseY:  number;         // y of model bottom *after* centering at origin
};

/**
 * Distance needed to fit the model's bbox into the frustum from `dir`.
 * Projects the (origin-centered) bbox onto the camera's view plane and
 * solves for the distance that inscribes that 2-D projection — much
 * tighter than a bounding-sphere fit for non-cubic models.
 */
function computeCameraDistance(
  fovDeg: number,
  aspect: number,
  size: THREE.Vector3,
  dir: THREE.Vector3,
  padding: number,
): number {
  const fovV = THREE.MathUtils.degToRad(fovDeg);
  const fovH = 2 * Math.atan(Math.tan(fovV / 2) * Math.max(aspect, 0.0001));

  // Camera basis from dir (assumes world-up = +Y).
  const worldUp = new THREE.Vector3(0, 1, 0);
  const right   = new THREE.Vector3().crossVectors(dir, worldUp).normalize();
  // Fallback if dir is parallel to world-up.
  if (!isFinite(right.x) || right.lengthSq() < 1e-6) right.set(1, 0, 0);
  const upCam   = new THREE.Vector3().crossVectors(right, dir).normalize();

  // Projected bbox extents = sum of |basis · axis| · sizeAxis (axis-aligned bbox).
  const projW = size.x * Math.abs(right.x) + size.y * Math.abs(right.y) + size.z * Math.abs(right.z);
  const projH = size.x * Math.abs(upCam.x) + size.y * Math.abs(upCam.y) + size.z * Math.abs(upCam.z);

  // Distance to inscribe each axis of the projected bbox.
  const distV = (projH / 2) / Math.tan(fovV / 2);
  const distH = (projW / 2) / Math.tan(fovH / 2);
  return Math.max(distV, distH) * padding;
}

// ─── Theme observer ───────────────────────────────────────────────────────────
function useThemeObserver(): Theme {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setTheme(
        document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark",
      ),
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

// ─── Responsive camera (model-fit, resize-aware) ──────────────────────────────
interface ResponsiveCameraProps {
  phase:        GamePhase;
  fit:          FitData | null;
  controlsRef:  MutableRefObject<OrbitControlsImpl | null>;
}

function ResponsiveCamera({ phase, fit, controlsRef }: ResponsiveCameraProps) {
  const { camera, size } = useThree();
  const targetPos    = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const managed      = useRef(false);

  // Recompute camera distance + near/far + control limits.
  // `snap` snaps the camera to the new framing immediately (use on idle / load).
  const applyFit = useCallback((snap: boolean) => {
    if (!fit) return;
    const cam     = camera as THREE.PerspectiveCamera;
    const aspect  = size.width / Math.max(size.height, 1);
    const isIdle  = phase === "idle" || phase === "ending";
    const dir     = isIdle ? IDLE_CAM_DIR : PLAY_CAM_DIR;
    const padding = isIdle ? FIT_PADDING_IDLE : FIT_PADDING_PLAY;

    const distance = computeCameraDistance(cam.fov, aspect, fit.size, dir, padding);

    // Near / far clipping planes derived from distance ± radius (with margin).
    cam.near = Math.max(0.05, distance - fit.radius * 1.6);
    cam.far  = distance + fit.radius * 8;
    cam.updateProjectionMatrix();

    // Centered model is at world origin → look-at is origin.
    targetLookAt.current.set(0, 0, 0);
    targetPos.current.set(0, 0, 0).addScaledVector(dir, distance);

    // OrbitControls limits + target (no hardcoded numbers).
    const ctrl = controlsRef.current;
    if (ctrl) {
      ctrl.target.set(0, 0, 0);
      ctrl.minDistance = distance * 0.60;
      ctrl.maxDistance = distance * 1.70;
      ctrl.update();
    }

    if (snap || isIdle) {
      // Idle: OrbitControls owns the camera. Preserve current orbit direction
      // (so resize doesn't re-frame the auto-rotate angle) but update radius.
      if (isIdle && !snap) {
        const dirToCam = cam.position.clone().sub(targetLookAt.current);
        const len = dirToCam.length();
        if (len > 1e-4) {
          dirToCam.multiplyScalar(distance / len);
          cam.position.copy(targetLookAt.current).add(dirToCam);
        } else {
          cam.position.copy(targetPos.current);
        }
      } else {
        cam.position.copy(targetPos.current);
      }
      cam.lookAt(targetLookAt.current);
      managed.current = false;
    } else {
      managed.current = true;
    }
  }, [camera, controlsRef, fit, phase, size.width, size.height]);

  // Initial fit when model becomes ready.
  useEffect(() => {
    if (!fit) return;
    applyFit(true);
  }, [fit, applyFit]);

  // Phase change → animate to new framing (or hand back to OrbitControls).
  useEffect(() => {
    applyFit(false);
  }, [phase, applyFit]);

  // Viewport resize → re-fit camera distance.
  useEffect(() => {
    if (!fit) return;
    applyFit(false);
  }, [size.width, size.height, fit, applyFit]);

  // Smoothly animate to target during managed (gameplay) phases.
  useFrame((_, delta) => {
    if (!managed.current) return;
    const t = 1 - Math.pow(0.0001, Math.min(delta, 0.05) * 5);
    camera.position.lerp(targetPos.current, t);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

// ─── Lighting ─────────────────────────────────────────────────────────────────
// Night: warm, intimate, lantern/arcade vibe (cozy).
// Day:   bright, clean, slightly warm whites (showroom).
// The internal "lamp" position + reach are derived from fit data so it sits
// inside the cabinet regardless of model size.
function SceneLighting({ theme, fit }: { theme: Theme; fit: FitData | null }) {
  const isDark = theme === "dark";

  // Internal lamp placed roughly mid-cabinet (above toy floor).
  const lampY    = fit ? fit.baseY + fit.size.y * 0.55 : 0.65;
  const lampDist = fit ? Math.max(fit.size.x, fit.size.z) * 1.8 : 1.6;

  return (
    <>
      {/* Ambient base — gentle warm at night, bright & neutral by day */}
      <ambientLight
        intensity={isDark ? 0.32 : 0.55}
        color={isDark ? "#dcd0d8" : "#fff8f0"}
      />

      {/* Key — softly warm at night, clean white sun by day */}
      <directionalLight
        position={[3, 9, 5]}
        intensity={isDark ? 0.95 : 1.6}
        color={isDark ? "#ffe6c4" : "#fff8f0"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />

      {/* Pink accent — subtle blush at night, hint of pink by day */}
      <spotLight
        position={[-2.8, 3.4, -2.2]}
        angle={0.55}
        penumbra={0.9}
        intensity={isDark ? 0.95 : 0.7}
        color={isDark ? "#f7b8d0" : "#fbbcda"}
      />

      {/* Cool back-rim — gives separation so warm tones read warm */}
      <directionalLight
        position={[-4, 2.5, -3.5]}
        intensity={isDark ? 0.35 : 0.30}
        color={isDark ? "#c8d4ec" : "#eef4ff"}
      />

      {/* Soft front fill — keeps faces out of pure shadow */}
      <directionalLight
        position={[-4, 3, 2]}
        intensity={isDark ? 0.40 : 0.55}
        color={isDark ? "#ffe8d4" : "#fff8f5"}
      />

      {/* Inside-the-cabinet warm glow (the "lamp" inside the machine) */}
      <pointLight
        position={[0, lampY, 0]}
        intensity={isDark ? 0.75 : 0.45}
        color={isDark ? "#ffc88a" : "#fff0d4"}
        distance={lampDist}
        decay={2}
      />
    </>
  );
}

function GroundShadow({ theme, fit }: { theme: Theme; fit: FitData | null }) {
  const isDark = theme === "dark";
  // Tight shadow footprint — just a touch wider than the machine base.
  const y     = fit ? fit.baseY - 0.005 : -1.02;
  const scale = fit ? Math.max(fit.size.x, fit.size.z) * 1.6 : 3;
  const far   = fit ? fit.size.y * 0.6 : 2;
  return (
    <ContactShadows
      position={[0, y, 0]}
      opacity={isDark ? 0.32 : 0.18}
      scale={scale}
      blur={2.0}
      far={far}
      resolution={512}
      color={isDark ? "#0a0f20" : "#5e6679"}
    />
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.6, 0.25]} />
      <meshStandardMaterial color="#f472b6" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

// ─── Game model + loop ────────────────────────────────────────────────────────
interface GameModelProps {
  inputRef:       MutableRefObject<InputState>;
  phaseRef:       MutableRefObject<GamePhase>;
  onPhaseChange:  (p: GamePhase) => void;
  onScore:        () => void;
  onFitComputed:  (fit: FitData) => void;
  resetSignal:    number; // increment to trigger toy reset
}

function GameModel({
  inputRef, phaseRef, onPhaseChange, onScore, onFitComputed, resetSignal,
}: GameModelProps) {
  const { scene }      = useGLTF(MODEL_PATH);
  const groupRef       = useRef<THREE.Group>(null);   // bob wrapper
  const offsetGroupRef = useRef<THREE.Group>(null);   // centering wrapper

  // Node refs
  const carriageRef = useRef<THREE.Object3D | null>(null);
  const clawArmRef  = useRef<THREE.Object3D | null>(null);
  const toysRef     = useRef<THREE.Object3D[]>([]);

  // Geometry refs
  const restY   = useRef(0);
  const dropY   = useRef(0);
  const targetX = useRef(0);
  const targetZ = useRef(0);

  // Grab state
  const grabbedToy  = useRef<THREE.Object3D | null>(null);
  const grabTimer   = useRef(0);
  const grabbedCount = useRef(0);
  const snapshots    = useRef<ToySnapshot[]>([]);

  // ── One-time scene setup ─────────────────────────────────────────────
  useEffect(() => {
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;
      mesh.castShadow = mesh.receiveShadow = true;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat?.opacity < 1 && mat?.opacity > 0.05) {
        mat.transparent = true;
        mat.depthWrite  = false;
        mat.side        = THREE.FrontSide;
      }
    });

    carriageRef.current = scene.getObjectByName("Carriage") ?? null;
    clawArmRef.current  = scene.getObjectByName("ClawArm")  ?? null;

    const toys: THREE.Object3D[] = [];
    scene.traverse((obj) => {
      if (/^Plushie_[A-Za-z]+$/.test(obj.name)) toys.push(obj);
    });
    toysRef.current = toys;

    // Snapshot original transforms for reset
    snapshots.current = toys
      .filter((t) => t.parent != null)
      .map((t) => ({
        obj:       t,
        parent:    t.parent!,
        localPos:  t.position.clone(),
        localQuat: t.quaternion.clone(),
      }));
    grabbedCount.current = 0;

    // Compute drop target from actual toy world positions
    const clawArm  = clawArmRef.current;
    const carriage = carriageRef.current;
    if (clawArm) {
      restY.current = clawArm.position.y;
      if (toys.length > 0 && carriage) {
        let sumY = 0;
        for (const t of toys) {
          const w = new THREE.Vector3();
          t.getWorldPosition(w);
          sumY += w.y;
        }
        const avgToyY = sumY / toys.length;
        const carriageW = new THREE.Vector3();
        carriage.getWorldPosition(carriageW);
        dropY.current = (avgToyY - carriageW.y) + PRONG_BELOW + 0.05;
      } else {
        dropY.current = restY.current - 0.7;
      }
    }

    console.log(
      `[CraneMachine] Carriage=${carriageRef.current?.name ?? "MISSING"}`,
      `ClawArm=${clawArmRef.current?.name ?? "MISSING"}`,
      `toys=[${toys.map((t) => t.name).join(",")}]`,
      `restY=${restY.current.toFixed(3)} dropY=${dropY.current.toFixed(3)}`,
    );

    // ── Center the model + report fit data ───────────────────────────────
    // Reset the centering wrapper to identity before measuring so repeated
    // mounts (HMR) measure the model's natural extents.
    const offset = offsetGroupRef.current;
    if (!offset) return;
    offset.position.set(0, 0, 0);
    offset.updateMatrixWorld(true);

    const bbox = new THREE.Box3().setFromObject(scene);
    if (!isFinite(bbox.min.x) || !isFinite(bbox.max.x)) return;

    const sphere = new THREE.Sphere();
    bbox.getBoundingSphere(sphere);
    const sizeV = new THREE.Vector3();
    bbox.getSize(sizeV);

    // Translate so bbox center sits exactly at world origin.
    offset.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z);

    onFitComputed({
      center: sphere.center.clone(),
      radius: sphere.radius,
      size:   sizeV.clone(),
      baseY:  -sizeV.y / 2,
    });
  }, [scene, onFitComputed]);

  // ── Restore toys when resetSignal increments ─────────────────────────
  useEffect(() => {
    if (resetSignal === 0) return;
    for (const s of snapshots.current) {
      s.parent.add(s.obj);
      s.obj.position.copy(s.localPos);
      s.obj.quaternion.copy(s.localQuat);
      s.obj.visible = true;
    }
    grabbedCount.current = 0;
    grabbedToy.current   = null;
    grabTimer.current    = 0;
    targetX.current = 0;
    targetZ.current = 0;
    if (clawArmRef.current) clawArmRef.current.position.y = restY.current;
    if (carriageRef.current) {
      carriageRef.current.position.x = 0;
      carriageRef.current.position.z = 0;
    }
    if (groupRef.current) groupRef.current.position.y = 0;
  }, [resetSignal]);

  // ── Helper ───────────────────────────────────────────────────────────
  const emit = useCallback((p: GamePhase) => {
    if (phaseRef.current === p) return;
    phaseRef.current = p;
    onPhaseChange(p);
  }, [phaseRef, onPhaseChange]);

  // ── Frame loop ───────────────────────────────────────────────────────
  useFrame((_, delta) => {
    const carriage = carriageRef.current;
    const clawArm  = clawArmRef.current;
    const dt       = Math.min(delta, 0.08);
    const p        = phaseRef.current;

    // Idle bob
    if (p === "idle" && groupRef.current) {
      groupRef.current.position.y = Math.sin(Date.now() * 0.001 * 0.6) * 0.012;
    }

    // Start
    if (p === "idle" && inputRef.current.start) {
      inputRef.current.start = false;
      if (groupRef.current) groupRef.current.position.y = 0;
      emit("playing");
      return;
    }

    if (!carriage || !clawArm) return;

    // Playing
    if (p === "playing") {
      targetX.current = THREE.MathUtils.clamp(
        targetX.current + inputRef.current.x * XZ_SPEED * dt, -BOUNDS_X, BOUNDS_X,
      );
      targetZ.current = THREE.MathUtils.clamp(
        targetZ.current + inputRef.current.z * XZ_SPEED * dt, -BOUNDS_Z, BOUNDS_Z,
      );
      const t = 1 - Math.pow(0.0001, dt * XZ_LERP);
      carriage.position.x = THREE.MathUtils.lerp(carriage.position.x, targetX.current, t);
      carriage.position.z = THREE.MathUtils.lerp(carriage.position.z, targetZ.current, t);
      if (inputRef.current.drop) {
        inputRef.current.drop = false;
        emit("dropping");
      }
      return;
    }

    // Dropping
    if (p === "dropping") {
      const t = 1 - Math.pow(0.0001, dt * DROP_LERP);
      clawArm.position.y = THREE.MathUtils.lerp(clawArm.position.y, dropY.current, t);
      if (Math.abs(clawArm.position.y - dropY.current) < Y_ARRIVAL) {
        clawArm.position.y = dropY.current;
        grabTimer.current = 0;
        emit("grabbing");
      }
      return;
    }

    // Grabbing
    if (p === "grabbing") {
      grabTimer.current += dt;
      if (grabTimer.current < GRAB_PAUSE) return;

      let caught: THREE.Object3D | null = null;
      const prongW = new THREE.Vector3();
      clawArm.getWorldPosition(prongW);
      prongW.y -= PRONG_BELOW;

      let best = GRAB_RADIUS;
      for (const toy of toysRef.current) {
        if (!toy.parent) continue;
        const tw = new THREE.Vector3();
        toy.getWorldPosition(tw);
        const d = prongW.distanceTo(tw);
        if (d < best) { best = d; caught = toy; }
      }

      if (caught) {
        const wPos  = new THREE.Vector3();
        const wQuat = new THREE.Quaternion();
        caught.getWorldPosition(wPos);
        caught.getWorldQuaternion(wQuat);
        caught.removeFromParent();
        clawArm.add(caught);
        clawArm.worldToLocal(wPos);
        caught.position.copy(wPos);
        const armQ = new THREE.Quaternion();
        clawArm.getWorldQuaternion(armQ);
        armQ.invert();
        caught.quaternion.copy(wQuat).premultiply(armQ);
        grabbedToy.current = caught;
        emit("lifting_with_toy");
      } else {
        emit("lifting");
      }
      return;
    }

    // Lifting
    if (p === "lifting" || p === "lifting_with_toy") {
      const t = 1 - Math.pow(0.0001, dt * LIFT_LERP);
      clawArm.position.y = THREE.MathUtils.lerp(clawArm.position.y, restY.current, t);
      if (Math.abs(clawArm.position.y - restY.current) < Y_ARRIVAL) {
        clawArm.position.y = restY.current;
        if (p === "lifting_with_toy") {
          targetX.current = DROP_ZONE_X;
          targetZ.current = DROP_ZONE_Z;
          emit("delivering");
        } else {
          emit("playing");
        }
      }
      return;
    }

    // Delivering
    if (p === "delivering") {
      const t = 1 - Math.pow(0.0001, dt * XZ_LERP);
      carriage.position.x = THREE.MathUtils.lerp(carriage.position.x, DROP_ZONE_X, t);
      carriage.position.z = THREE.MathUtils.lerp(carriage.position.z, DROP_ZONE_Z, t);
      if (
        Math.abs(carriage.position.x - DROP_ZONE_X) < XZ_ARRIVAL &&
        Math.abs(carriage.position.z - DROP_ZONE_Z) < XZ_ARRIVAL
      ) {
        carriage.position.set(DROP_ZONE_X, carriage.position.y, DROP_ZONE_Z);
        emit("releasing");
      }
      return;
    }

    // Releasing
    if (p === "releasing") {
      const toy = grabbedToy.current;
      if (toy) {
        toy.visible = false;
        toy.removeFromParent();
        grabbedToy.current = null;
        grabbedCount.current += 1;
        onScore();
      }
      targetX.current = 0;
      targetZ.current = 0;
      const total = snapshots.current.length;
      if (total > 0 && grabbedCount.current >= total) {
        emit("ending");
      } else {
        emit("playing");
      }
      return;
    }

    // Ending — no movement, wait for React timer to reset
  });

  return (
    <group ref={groupRef}>
      <group ref={offsetGroupRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

// ─── D-pad button helper ──────────────────────────────────────────────────────
function DPadBtn({
  label, onDown, onUp,
}: { label: string; onDown: () => void; onUp: () => void }) {
  return (
    <button
      className={styles.dpadBtn}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >{label}</button>
  );
}

// ─── Virtual joystick ─────────────────────────────────────────────────────────
const JOYSTICK_RADIUS = 48; // max stick travel in px

function VirtualJoystick({ inputRef }: { inputRef: MutableRefObject<InputState> }) {
  const stickRef = useRef<HTMLDivElement>(null);
  const active   = useRef<{ id: number; cx: number; cy: number } | null>(null);

  const reset = () => {
    if (stickRef.current) stickRef.current.style.transform = "translate(-50%, -50%)";
    inputRef.current.x = 0;
    inputRef.current.z = 0;
    active.current = null;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    active.current = { id: e.pointerId, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!active.current || e.pointerId !== active.current.id) return;
    const dx = e.clientX - active.current.cx;
    const dy = e.clientY - active.current.cy;
    const dist  = Math.sqrt(dx * dx + dy * dy);
    const clamp = Math.min(dist, JOYSTICK_RADIUS);
    const angle = Math.atan2(dy, dx);
    const ox = Math.cos(angle) * clamp;
    const oy = Math.sin(angle) * clamp;
    if (stickRef.current)
      stickRef.current.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px))`;
    const norm = clamp / JOYSTICK_RADIUS;
    inputRef.current.x =  Math.cos(angle) * norm;
    inputRef.current.z =  Math.sin(angle) * norm;
  };

  return (
    <div
      className={styles.joystickBase}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={reset}
      onPointerCancel={reset}
    >
      <div className={styles.joystickRing} />
      <div ref={stickRef} className={styles.joystickStick} />
    </div>
  );
}

// ─── Game overlay (2-D UI) ────────────────────────────────────────────────────
const PHASE_TOAST: Partial<Record<GamePhase, string>> = {
  dropping:         "▼  Dropping…",
  grabbing:         "✦  Grabbing!",
  lifting:          "▲  Lifting…",
  lifting_with_toy: "▲  Got one!",
  delivering:       "→  Delivering!",
  releasing:        "★  Score!",
};

interface OverlayProps {
  phase:    GamePhase;
  score:    number;
  inputRef: MutableRefObject<InputState>;
  onStart:  () => void;
  onDrop:   () => void;
  onAxis:   (axis: "x" | "z", v: number) => void;
  onExit:   () => void;
}

function GameOverlay({ phase, score, inputRef, onStart, onDrop, onAxis, onExit }: OverlayProps) {
  const isIdle   = phase === "idle";
  const isEnding = phase === "ending";
  const isActive = !isIdle && !isEnding;
  const canDrop  = phase === "playing";
  const toast    = PHASE_TOAST[phase];

  return (
    <div className={styles.overlay}>
      {/* Win screen */}
      {isEnding && (
        <div className={styles.winOverlay}>
          <div className={styles.winCard}>
            <div className={styles.winEmoji}>🎉</div>
            <h2 className={styles.winTitle}>You got them all!</h2>
            <p className={styles.winScore}>Score: {score}</p>
            <p className={styles.winHint}>Returning to arcade…</p>
          </div>
        </div>
      )}

      {/* Idle splash */}
      {isIdle && (
        <div className={styles.idleOverlay}>
          <p className={styles.idleHint}>Arrow keys / D-pad to move · Space to drop</p>
          <button className={styles.startBtn} onClick={onStart}>PLAY</button>
        </div>
      )}

      {/* Active HUD */}
      {isActive && (
        <>
          <button
            className={styles.exitBtn}
            onClick={onExit}
            aria-label="Exit game"
            title="Exit (Esc)"
          >✕</button>

          <div className={styles.scoreDisplay}>
            <span className={styles.scoreLabel}>SCORE</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>

          {toast && <div key={phase} className={styles.phaseToast}>{toast}</div>}

          <div className={styles.controls}>
            {/* Virtual joystick — left */}
            <VirtualJoystick inputRef={inputRef} />

            {/* D-pad + DROP — right */}
            <div className={styles.dpadGroup}>
              <div className={styles.dpad}>
                <span />
                <DPadBtn label="▲" onDown={() => onAxis("z", -1)} onUp={() => onAxis("z", 0)} />
                <span />
                <DPadBtn label="◄" onDown={() => onAxis("x", -1)} onUp={() => onAxis("x", 0)} />
                <span className={styles.dpadCenter} />
                <DPadBtn label="►" onDown={() => onAxis("x",  1)} onUp={() => onAxis("x", 0)} />
                <span />
                <DPadBtn label="▼" onDown={() => onAxis("z",  1)} onUp={() => onAxis("z", 0)} />
                <span />
              </div>
              <button
                className={styles.dropBtn}
                onPointerDown={onDrop}
                disabled={!canDrop}
              >DROP</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────
const CraneMachine3D: React.FC = () => {
  const theme  = useThemeObserver();
  const isDark = theme === "dark";

  const [phase,       setPhase]       = useState<GamePhase>("idle");
  const [score,       setScore]       = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [fit,         setFit]         = useState<FitData | null>(null);

  const phaseRef    = useRef<GamePhase>("idle");
  const inputRef    = useRef<InputState>({ x: 0, z: 0, drop: false, start: false });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleFit = useCallback((f: FitData) => setFit(f), []);

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const handlePhaseChange = useCallback((p: GamePhase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // Keyboard input
  useEffect(() => {
    const axisMap: Record<string, { axis: "x" | "z"; dir: number }> = {
      ArrowLeft:  { axis: "x", dir: -1 }, ArrowRight: { axis: "x", dir: 1 },
      ArrowUp:    { axis: "z", dir: -1 }, ArrowDown:  { axis: "z", dir: 1 },
      a: { axis: "x", dir: -1 }, A: { axis: "x", dir: -1 },
      d: { axis: "x", dir:  1 }, D: { axis: "x", dir:  1 },
      w: { axis: "z", dir: -1 }, W: { axis: "z", dir: -1 },
      s: { axis: "z", dir:  1 }, S: { axis: "z", dir:  1 },
    };
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "idle")    inputRef.current.start = true;
        if (phaseRef.current === "playing") inputRef.current.drop  = true;
        return;
      }
      const m = axisMap[e.key];
      if (m) inputRef.current[m.axis] = m.dir;
    };
    const up = (e: KeyboardEvent) => {
      const m = axisMap[e.key];
      if (m && inputRef.current[m.axis] === m.dir) inputRef.current[m.axis] = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup",   up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  // Win → idle reset after delay
  useEffect(() => {
    if (phase !== "ending") return;
    const t = setTimeout(() => {
      setScore(0);
      setResetSignal((n) => n + 1);
      phaseRef.current = "idle";
      setPhase("idle");
    }, WIN_DELAY_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const setAxis = (axis: "x" | "z", v: number) => { inputRef.current[axis] = v; };
  const fireDrop  = () => { if (phaseRef.current === "playing") inputRef.current.drop  = true; };
  const fireStart = () => { if (phaseRef.current === "idle")    inputRef.current.start = true; };

  const handleExit = useCallback(() => {
    inputRef.current = { x: 0, z: 0, drop: false, start: false };
    setScore(0);
    setResetSignal((n) => n + 1);
    phaseRef.current = "idle";
    setPhase("idle");
  }, []);

  // Escape key exits the game
  useEffect(() => {
    const onEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phaseRef.current !== "idle" && phaseRef.current !== "ending") {
        handleExit();
      }
    };
    window.addEventListener("keydown", onEscKey);
    return () => window.removeEventListener("keydown", onEscKey);
  }, [handleExit]);

  return (
    <div className={styles.container}>
      <Canvas
        className={styles.canvas}
        camera={{ fov: CAM_FOV, near: 0.1, far: 50, position: [0, 0, 5] }}
        shadows
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={[1.5, 2]}
      >
        <ResponsiveCamera phase={phase} fit={fit} controlsRef={controlsRef} />
        <SceneLighting theme={theme} fit={fit} />

        <Suspense fallback={<Loader />}>
          <GameModel
            inputRef={inputRef}
            phaseRef={phaseRef}
            onPhaseChange={handlePhaseChange}
            onScore={() => setScore((s) => s + 1)}
            onFitComputed={handleFit}
            resetSignal={resetSignal}
          />
          <GroundShadow theme={theme} fit={fit} />
          {/* Slightly lower env at night so placed lights still set the mood. */}
          <Environment
            preset="apartment"
            environmentIntensity={isDark ? 0.32 : 0.45}
          />
        </Suspense>

        {/* Theme-keyed composer so adding/removing Bloom doesn't flicker. */}
        <EffectComposer key={isDark ? "dark" : "light"} multisampling={8}>
          {/* Subtle cozy halo — only catches the highlights, not the whole scene. */}
          {isDark ? (
            <Bloom
              intensity={0.22}
              luminanceThreshold={0.78}
              luminanceSmoothing={0.5}
              mipmapBlur
            />
          ) : (
            <></>
          )}
          {/* Vignette only at night (day mode keeps the canvas clean over
              the page background so we don't get a faint corner ring). */}
          {isDark ? (
            <Vignette eskil={false} offset={0.32} darkness={0.28} />
          ) : (
            <></>
          )}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={phase === "idle"}
          autoRotate={phase === "idle"}
          enabled={phase === "idle"}
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          // minDistance / maxDistance / target are set by ResponsiveCamera
          // based on the actual model bounding box.
        />
      </Canvas>

      <GameOverlay
        phase={phase}
        score={score}
        inputRef={inputRef}
        onStart={fireStart}
        onDrop={fireDrop}
        onAxis={setAxis}
        onExit={handleExit}
      />
    </div>
  );
};

useGLTF.preload(MODEL_PATH);
export default CraneMachine3D;
