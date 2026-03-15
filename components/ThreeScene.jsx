import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingCube() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
    </mesh>
  );
}

function FloatingBox() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= 0.003;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[3, 0, 0]} scale={0.8}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshPhongMaterial color="#0088ff" wireframe />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
      camera={{ position: [0, 0, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00ff88" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#0088ff" />
      <RotatingCube />
      <FloatingBox />
    </Canvas>
  );
}

