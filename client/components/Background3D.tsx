import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function usePrefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined")
    return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const vertex = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// 3D-like layered noise + rings shader (unique procedural look)
const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColorA; // primary
  uniform vec3 uColorB; // accent
  varying vec2 vUv;

  // IQ classic noise
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5,183.3)), dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    float a = dot(hash3(i + vec2(0.0,0.0)), vec3(1.0));
    float b = dot(hash3(i + vec2(1.0,0.0)), vec3(1.0));
    float c = dot(hash3(i + vec2(0.0,1.0)), vec3(1.0));
    float d = dot(hash3(i + vec2(1.0,1.0)), vec3(1.0));
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }

  // Fractal noise
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6,1.2,-1.2,1.6);
    for(int i=0;i<6;i++){
      v += a * noise(p);
      p = m * p * 1.8 + vec2(0.7, 0.3);
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.3;

    // layered fields to create depth ("5D" feel by combining time offsets)
    float z1 = fbm(p * 1.5 + vec2(t*0.12));
    float z2 = fbm(p * 3.2 + vec2(t*0.37 + 5.0));
    float z3 = fbm(p * 6.3 + vec2(t*0.82 + 9.0));

    // Combine with radial rings
    float r = length(p);
    float rings = sin((r*12.0 - t*1.3) + z2*6.0) * 0.5 + 0.5;

    // center glow influenced by mouse
    vec2 mouse = (uMouse / uResolution) - 0.5;
    mouse.x *= uResolution.x / uResolution.y;
    float md = length(p - mouse);
    float center = 1.0 / (1.0 + md*10.0);

    // color mix
    vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 1.0, z1*0.7 + z3*0.3 + rings*0.5));
    // add rim and glow
    col += vec3(0.12,0.06,0.22) * pow(center,1.6);

    // subtle grain
    float grain = (fract(sin(dot(uv * uResolution, vec2(12.9898,78.233))) * 43758.5453));
    col += (grain - 0.5) * 0.02;

    // vignette
    float vig = smoothstep(0.8, 0.2, r);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function ShaderMesh() {
  const meshRef = useRef<any>();
  const { size, viewport } = useThree();
  const prefersReduced = usePrefersReducedMotion();
  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColorA: { value: new THREE.Color("#7c3aed") },
    uColorB: { value: new THREE.Color("#06b6d4") },
  });

  useEffect(() => {
    const onResize = () => {
      uniforms.current.uResolution.value.set(
        window.innerWidth,
        window.innerHeight,
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      uniforms.current.uMouse.value.set(
        e.clientX,
        window.innerHeight - e.clientY,
      );
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (!prefersReduced) uniforms.current.uTime.value = clock.getElapsedTime();
    else uniforms.current.uTime.value = 0.0;
  });

  return (
    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[(2 * viewport.width) / viewport.height, 2]} />
      <shaderMaterial
        attach="material"
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms.current}
      />
    </mesh>
  );
}

export default function Background3D() {
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-100"
    >
      <div className="bg-pulse -z-20" />
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 1], fov: 50 }}
          style={{ position: "absolute", inset: 0 }}
          dpr={
            typeof window !== "undefined" && window.devicePixelRatio
              ? Math.min(window.devicePixelRatio, 1.5)
              : 1
          }
        >
          <color attach="background" args={[0.02, 0.02, 0.03]} />
          <ambientLight intensity={0.5} />

          {/* Shader-backed unique background */}
          <ShaderMesh />

          {/* A small set of floating shapes for depth (disabled on mobile for perf) */}
          {!isMobile && !prefersReduced && (
            <>
              <mesh position={[1.8, 0.6, 0.5]}>
                <torusGeometry args={[0.7, 0.12, 64, 128]} />
                <meshStandardMaterial
                  color="#7c3aed"
                  metalness={0.6}
                  roughness={0.2}
                  emissive="#4f46e5"
                  emissiveIntensity={0.1}
                />
              </mesh>
              <mesh position={[-1.6, -0.4, -0.6]}>
                <icosahedronGeometry args={[0.9, 1]} />
                <meshStandardMaterial
                  color="#06b6d4"
                  metalness={0.4}
                  roughness={0.2}
                  emissive="#0891b2"
                  emissiveIntensity={0.08}
                />
              </mesh>
            </>
          )}

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
