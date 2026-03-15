import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function AnimatedTorus() {
  const mesh = useRef();

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} scale={[2.5,2.5,2.5]}> 
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial color="#ff6600" metalness={0.6} roughness={0.2} />
    </mesh>
  );
}

export default function AboutScene() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -10,
        pointerEvents: 'none'
      }}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <AnimatedTorus />
    </Canvas>
  );
}