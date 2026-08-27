import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

type PetalRing = {
  count: number;
  radius: number;
  petalHeight: number;
  petalWidth: number;
  color: string;
  rotationOffset: number;
  tilt: number;
};

const RINGS: PetalRing[] = [
  { count: 6, radius: 0, petalHeight: 0.15, petalWidth: 0.5, color: '#e63946', rotationOffset: 0, tilt: 0 },
  { count: 8, radius: 0.8, petalHeight: 0.25, petalWidth: 0.45, color: '#f4a261', rotationOffset: 0.2, tilt: 0.15 },
  { count: 12, radius: 1.5, petalHeight: 0.35, petalWidth: 0.5, color: '#e76f51', rotationOffset: 0.1, tilt: 0.25 },
  { count: 16, radius: 2.3, petalHeight: 0.4, petalWidth: 0.55, color: '#f9c74f', rotationOffset: 0.05, tilt: 0.3 },
  { count: 20, radius: 3.1, petalHeight: 0.35, petalWidth: 0.5, color: '#f8961e', rotationOffset: 0.08, tilt: 0.35 },
  { count: 24, radius: 3.9, petalHeight: 0.3, petalWidth: 0.45, color: '#90be6d', rotationOffset: 0.04, tilt: 0.4 },
  { count: 28, radius: 4.6, petalHeight: 0.25, petalWidth: 0.4, color: '#43aa8b', rotationOffset: 0.06, tilt: 0.45 },
];

function Petal({
  position,
  rotation,
  color,
  height,
  width,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  height: number;
  width: number;
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.bezierCurveTo(width * 0.5, height * 0.3, width * 0.5, height * 0.8, 0, height);
    s.bezierCurveTo(-width * 0.5, height * 0.8, -width * 0.5, height * 0.3, 0, 0);
    return s;
  }, [width, height]);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4,
    }),
    []
  );

  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.15}
        side={THREE.DoubleSide}
        emissive={color}
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function Pookalam() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 2.2, 0, 0]}>
      {/* Center diya (lamp) */}
      <mesh position={[0, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.15, 32]} />
        <meshStandardMaterial color="#8b4513" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.22]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ff6600"
          emissiveIntensity={2}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0, 0, 0.5]} intensity={2} distance={6} color="#ff8800" />

      {/* Petal rings */}
      {RINGS.map((ring, ringIdx) => {
        const petals = [];
        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2 + ring.rotationOffset;
          const x = Math.cos(angle) * ring.radius;
          const z = Math.sin(angle) * ring.radius;
          petals.push(
            <Petal
              key={`${ringIdx}-${i}`}
              position={[x, z, 0]}
              rotation={[ring.tilt, 0, angle + Math.PI / 2]}
              color={ring.color}
              height={ring.petalHeight}
              width={ring.petalWidth}
            />
          );
        }
        return petals;
      })}

      {/* Decorative dots between rings */}
      {RINGS.slice(0, -1).map((ring, ringIdx) => {
        const nextRing = RINGS[ringIdx + 1];
        const midRadius = (ring.radius + nextRing.radius) / 2;
        const dotCount = ring.count;
        const dots = [];
        for (let i = 0; i < dotCount; i++) {
          const angle = (i / dotCount) * Math.PI * 2 + ring.rotationOffset + Math.PI / dotCount;
          const x = Math.cos(angle) * midRadius;
          const z = Math.sin(angle) * midRadius;
          dots.push(
            <mesh key={`dot-${ringIdx}-${i}`} position={[x, z, 0.03]} castShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                color={ringIdx % 2 === 0 ? '#fff3b0' : '#ffd166'}
                roughness={0.3}
                metalness={0.2}
                emissive={ringIdx % 2 === 0 ? '#fff3b0' : '#ffd166'}
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        }
        return dots;
      })}
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = Math.random() * 6 - 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += 0.008;
        if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = -1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function Pookalam3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 6, 6], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.3} color="#ffaa00" />

        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <Pookalam />
        </Float>

        <FloatingParticles />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={12}
          blur={2.5}
          far={4}
        />

        <Environment preset="sunset" />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={14}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
