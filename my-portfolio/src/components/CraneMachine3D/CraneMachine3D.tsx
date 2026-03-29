import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Center,
  ContactShadows,
} from "@react-three/drei";
import {
  EffectComposer,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import type { Group } from "three";
import * as THREE from "three";
import styles from "./CraneMachine3D.module.css";

const MODEL_PATH = `${import.meta.env.BASE_URL}models/crane_machine.glb`;

type Theme = "light" | "dark";

function useThemeObserver(): Theme {
  const [theme, setTheme] = useState<Theme>(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    return attr === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.documentElement.getAttribute("data-theme");
      setTheme(attr === "light" ? "light" : "dark");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

function CraneMachineModel() {
  const { scene } = useGLTF(MODEL_PATH);
  const ref = useRef<Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && mat.opacity < 1 && mat.opacity > 0.1) {
          mat.transparent = true;
          mat.depthWrite = false;
          mat.side = THREE.FrontSide;
        }
      }
    });
  }, [scene]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.6) * 0.012;
  });

  return (
    <group ref={ref}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(1.5, 1.2, 2.8);
    camera.lookAt(0, 0.1, 0);
  }, [camera]);
  return null;
}

function SceneLighting({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  return (
    <>
      <ambientLight
        intensity={isDark ? 0.35 : 0.55}
        color={isDark ? "#c0c8e0" : "#fff5f8"}
      />

      <directionalLight
        position={[3, 8, 5]}
        intensity={isDark ? 1.2 : 1.6}
        color="#fffaf5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      <directionalLight
        position={[-4, 3, 2]}
        intensity={isDark ? 0.5 : 0.7}
        color={isDark ? "#c8d0e8" : "#fff8f5"}
      />

      <directionalLight
        position={[-2, 4, -6]}
        intensity={isDark ? 0.6 : 0.4}
        color={isDark ? "#f9a8d4" : "#f472b6"}
      />
    </>
  );
}

function GroundShadow({ theme }: { theme: Theme }) {
  const isDark = theme === "dark";

  return (
    <ContactShadows
      position={[0, -1.02, 0]}
      opacity={isDark ? 0.35 : 0.25}
      scale={8}
      blur={3.0}
      far={3}
      resolution={256}
      color={isDark ? "#0a0f20" : "#6b7280"}
    />
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.3, 0.6, 0.25]} />
      <meshStandardMaterial
        color="#f472b6"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

const CraneMachine3D: React.FC = () => {
  const theme = useThemeObserver();
  const isDark = theme === "dark";

  return (
    <div className={styles.container}>
      <Canvas
        className={styles.canvas}
        camera={{ fov: 40, near: 0.1, far: 50 }}
        shadows
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.NoToneMapping,
        }}
        dpr={[1.5, 2]}
      >
        <CameraSetup />
        <SceneLighting theme={theme} />

        <Suspense fallback={<Loader />}>
          <CraneMachineModel />
          <GroundShadow theme={theme} />
          <Environment
            preset="apartment"
            environmentIntensity={isDark ? 0.3 : 0.4}
          />
        </Suspense>

        <EffectComposer multisampling={8}>
          <Vignette
            eskil={false}
            offset={0.35}
            darkness={isDark ? 0.35 : 0.12}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0.1, 0]}
        />
      </Canvas>
    </div>
  );
};

useGLTF.preload(MODEL_PATH);

export default CraneMachine3D;
