/**
 * ThreeScene Template Options
 * Pick one and replace the content of ThreeScene.jsx
 */

// ============================================================================
// TEMPLATE 1: ANIMATED PARTICLE FIELD WITH MOUSE INTERACTION
// Perfect for: Tech, AI, Data-driven
// Effect: Floating particles that react to mouse movement
// ============================================================================
export const ParticleFieldTemplate = `
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';

function ParticleField() {
  const pointsRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0003;
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  const particleCount = 2000;
  const particlesData = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    particlesData[i] = (Math.random() - 0.5) * 20;
    particlesData[i + 1] = (Math.random() - 0.5) * 20;
    particlesData[i + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlesData}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#00ff88" sizeAttenuation transparent />
    </points>
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
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <ParticleField />
    </Canvas>
  );
}
`;

// ============================================================================
// TEMPLATE 2: MORPHING GEOMETRIC SHAPES
// Perfect for: Creative, Design-focused, Modern
// Effect: Shapes that smoothly morph between different forms with colors
// ============================================================================
export const MorphingShapesTemplate = `
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MeshLine, MeshLineMaterial } from 'meshline';

function MorphingShape() {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 4]} />
      <meshPhongMaterial
        color="#0088ff"
        emissive="#00ff88"
        emissiveIntensity={0.5}
        wireframe={false}
      />
    </mesh>
  );
}

function WireframeBox() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x -= 0.003;
      meshRef.current.rotation.z -= 0.005;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}>
      <boxGeometry args={[2, 2, 2]} />
      <meshPhongMaterial color="#ff00ff" wireframe emissive="#00ffff" />
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
      camera={{ position: [0, 0, 6], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#0088ff" />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color="#ff00ff" />
      <MorphingShape />
      <WireframeBox />
    </Canvas>
  );
}
`;

// ============================================================================
// TEMPLATE 3: ANIMATED NEURAL NETWORK / NODE GRAPH
// Perfect for: AI/ML focus, Tech companies, Data visualization
// Effect: Floating nodes connected by lines, pulsing with activity
// ============================================================================
export const NeuralNetworkTemplate = `
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';

function NeuralNetwork() {
  const groupRef = useRef();
  const nodesRef = useRef([]);

  const { positions, connections } = useMemo(() => {
    const nodeArray = [];
    for (let i = 0; i < 30; i++) {
      nodeArray.push({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 10,
        z: (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.01,
        vz: (Math.random() - 0.5) * 0.01
      });
    }

    const positions = new Float32Array(nodeArray.length * 3);
    nodeArray.forEach((node, i) => {
      positions[i * 3] = node.x;
      positions[i * 3 + 1] = node.y;
      positions[i * 3 + 2] = node.z;
    });

    return { positions: positions, connections: nodeArray };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.0002;
      groupRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connections.length}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#00ff88" sizeAttenuation />
      </points>

      {/* Connection lines */}
      <group>
        {connections.map((node, i) =>
          connections.slice(i + 1, i + 4).map((other, j) => (
            <line key={\`\${i}-\${j}\`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    node.x, node.y, node.z,
                    other.x, other.y, other.z
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#0088ff" linewidth={1} transparent opacity={0.4} />
            </line>
          ))
        )}
      </group>
    </group>
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
      camera={{ position: [0, 0, 8], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <NeuralNetwork />
    </Canvas>
  );
}
`;

// ============================================================================
// TEMPLATE 4: ANIMATED WAVES / FLUID SURFACE
// Perfect for: Elegant, minimalist, trendy
// Effect: Wavy surface that undulates smoothly
// ============================================================================
export const WaveSurfaceTemplate = `
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function WaveSurface() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current && meshRef.current.geometry.attributes.position) {
      const positionAttribute = meshRef.current.geometry.attributes.position;
      const positionData = positionAttribute.array;

      for (let i = 0; i < positionData.length; i += 3) {
        const x = positionData[i];
        const y = positionData[i + 1];
        const z = positionData[i + 2];

        const wave1 = Math.sin(x * 0.5 + state.clock.elapsedTime) * 0.3;
        const wave2 = Math.cos(y * 0.5 + state.clock.elapsedTime * 0.7) * 0.3;

        positionData[i + 2] = z + wave1 + wave2;
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-0.5, 0, 0]}>
      <planeGeometry args={[8, 8, 64, 64]} />
      <meshPhongMaterial
        color="#0088ff"
        emissive="#00ff88"
        emissiveIntensity={0.3}
        wireframe={false}
      />
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
      camera={{ position: [0, 2, 5], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />
      <WaveSurface />
    </Canvas>
  );
}
`;

// ============================================================================
// TEMPLATE 5: FLOATING TORUS WITH TUNNEL EFFECT
// Perfect for: Immersive, sci-fi, eye-catching
// Effect: Glowing torus rings floating in a tunnel-like vortex
// ============================================================================
export const TunnelTemplate = `
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function FloatingTorus() {
  const torus1Ref = useRef();
  const torus2Ref = useRef();
  const torus3Ref = useRef();

  useFrame((state) => {
    if (torus1Ref.current) {
      torus1Ref.current.rotation.x += 0.005;
      torus1Ref.current.rotation.y += 0.01;
      torus1Ref.current.scale.y = 1 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
    if (torus2Ref.current) {
      torus2Ref.current.rotation.y -= 0.008;
      torus2Ref.current.rotation.z += 0.003;
      torus2Ref.current.scale.x = 1 + Math.cos(state.clock.elapsedTime * 1.2) * 0.1;
    }
    if (torus3Ref.current) {
      torus3Ref.current.rotation.x -= 0.003;
      torus3Ref.current.rotation.y += 0.006;
      torus3Ref.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
    }
  });

  return (
    <>
      <mesh ref={torus1Ref} scale={1}>
        <torusGeometry args={[2, 0.5, 16, 100]} />
        <meshPhongMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={torus2Ref} scale={0.7}>
        <torusGeometry args={[2.5, 0.4, 16, 100]} />
        <meshPhongMaterial color="#0088ff" emissive="#0088ff" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={torus3Ref} scale={0.5}>
        <torusGeometry args={[2, 0.3, 16, 100]} />
        <meshPhongMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.8} />
      </mesh>
    </>
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
      camera={{ position: [0, 0, 4], fov: 75 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#0088ff" />
      <pointLight position={[5, 5, -5]} intensity={1} color="#ff00ff" />
      <FloatingTorus />
    </Canvas>
  );
}
`;

export default { ParticleFieldTemplate, MorphingShapesTemplate, NeuralNetworkTemplate, WaveSurfaceTemplate, TunnelTemplate };
