import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScroll, useSpring } from 'framer-motion';
import { Float, Text, Icosahedron, TorusKnot, MeshDistortMaterial, Sparkles, Stars, OrbitControls } from '@react-three/drei';

export default function Scene({ view, isMobile }) {
  const groupRef = useRef();
  const particlesRef = useRef();
  const tornadoRef = useRef(false);
  const tornadoTime = useRef(0);

  // Use framer-motion useScroll to sync with the rest of the UI
  const { scrollYProgress } = useScroll();
  // Smoothed progress for camera movement
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleTornado = () => {
      tornadoRef.current = true;
      tornadoTime.current = 0;
    };
    window.addEventListener('trigger-tornado', handleTornado);
    return () => {
      window.removeEventListener('trigger-tornado', handleTornado);
    };
  }, []);

  const particleCount = isMobile ? 1200 : 4500;
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const z = - (t * 260); // Path length 260 units
        
        const xPath = Math.sin(z * 0.05) * 8;
        const yPath = Math.cos(z * 0.03) * 3;
        
        const x = xPath + (Math.random() - 0.5) * 22;
        const y = yPath + (Math.random() - 0.5) * 22 - 8; 
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        sizes[i] = Math.random() * 0.08 + 0.02;
    }
    return [positions, sizes];
  }, [isMobile, particleCount]);

  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3(0, 5, 15));

  const colors = useMemo(() => [
    new THREE.Color("#020617"), // Hero
    new THREE.Color("#062029"), // About
    new THREE.Color("#1e1b4b"), // Services
    new THREE.Color("#2a1202"), // Approach
    new THREE.Color("#020617"), // Build
  ], []);

  const particleColors = useMemo(() => [
    new THREE.Color("#3b82f6"), 
    new THREE.Color("#34d399"), 
    new THREE.Color("#a78bfa"), 
    new THREE.Color("#fbbf24"), 
    new THREE.Color("#60a5fa"), 
  ], []);

  useFrame((state) => {
    const s = smoothProgress.get(); // Get the smoothed scroll progress

    if (view === 'ROAD') {
      if (state.scene.fog && particlesRef.current) {
        let c1, c2, t;
        let p1, p2;

        if (s < 0.15) { 
           c1 = colors[0]; c2 = colors[1]; t = Math.max(0, s / 0.15); 
           p1 = particleColors[0]; p2 = particleColors[1];
        } else if (s < 0.35) { 
           c1 = colors[1]; c2 = colors[2]; t = (s - 0.15) / 0.20; 
           p1 = particleColors[1]; p2 = particleColors[2];
        } else if (s < 0.60) { 
           c1 = colors[2]; c2 = colors[3]; t = (s - 0.35) / 0.25; 
           p1 = particleColors[2]; p2 = particleColors[3];
        } else if (s < 0.82) { 
           c1 = colors[3]; c2 = colors[4]; t = (s - 0.60) / 0.22; 
           p1 = particleColors[3]; p2 = particleColors[4];
        } else { 
           c1 = colors[4]; c2 = colors[4]; t = 0; 
           p1 = particleColors[4]; p2 = particleColors[4];
        }
        
        state.scene.fog.color.lerpColors(c1, c2, t);
        particlesRef.current.material.color.lerpColors(p1, p2, t);
      }

      const targetZ = -(s * 240); 
      
      // Increased responsiveness by bumping up the lerp coefficients slightly
      cameraPosition.current.z = THREE.MathUtils.lerp(cameraPosition.current.z, targetZ + 15, 0.08); 
      
      const xPath = Math.sin((targetZ) * 0.05) * 8;
      const yPath = Math.cos((targetZ) * 0.03) * 3 - 3;

      cameraPosition.current.x = THREE.MathUtils.lerp(cameraPosition.current.x, xPath, 0.06); 
      cameraPosition.current.y = THREE.MathUtils.lerp(cameraPosition.current.y, Math.max(yPath + 4, 1), 0.06); 

      state.camera.position.copy(cameraPosition.current);

      cameraTarget.current.x = THREE.MathUtils.lerp(cameraTarget.current.x, xPath, 0.08); 
      cameraTarget.current.y = THREE.MathUtils.lerp(cameraTarget.current.y, yPath, 0.08); 
      cameraTarget.current.z = Math.min(cameraPosition.current.z - 15, targetZ - 10);
      
      if (tornadoRef.current) {
          tornadoTime.current += state.clock.getDelta();
          const angle = tornadoTime.current * 12; 
          state.camera.up.set(Math.sin(angle), Math.cos(angle), 0).normalize();
          if (s < 0.05 && tornadoTime.current > 0.5) {
              tornadoRef.current = false;
          }
      } else {
          state.camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.1); 
      }

      state.camera.lookAt(cameraTarget.current);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1); 
      groupRef.current.scale.set(1, 1, 1);
    } else {
      if (view === 'PRICING') {
          state.camera.position.lerp(new THREE.Vector3(0, 5, 40), 0.05);
          cameraTarget.current.lerp(new THREE.Vector3(0, 5, 0), 0.05);
      } else if (view === 'CONTACT') {
          state.camera.position.lerp(new THREE.Vector3(-20, 10, 20), 0.05);
          cameraTarget.current.lerp(new THREE.Vector3(0, 5, -10), 0.05);
      }
      state.camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.1);
      state.camera.lookAt(cameraTarget.current);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -15, 0.05);

      if (state.scene.fog && particlesRef.current) {
         let targetFog = new THREE.Color("#020617");
         if (view === 'PRICING') targetFog = new THREE.Color("#080c1f");
         if (view === 'CONTACT') targetFog = new THREE.Color("#02120b");
         state.scene.fog.color.lerp(targetFog, 0.05);
         particlesRef.current.material.color.lerp(new THREE.Color("#aaaaaa"), 0.05);
      }
    }
    
    if (particlesRef.current) {
      particlesRef.current.material.opacity = THREE.MathUtils.lerp(
         particlesRef.current.material.opacity,
         view === 'ROAD' ? 0.7 + Math.sin(state.clock.elapsedTime)*0.1 : 0.1,
         0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1.5} color="#60a5fa" />
      <hemisphereLight intensity={0.5} groundColor="#000000" />
      <fog attach="fog" args={['#d4e0fa', 15, 80]} />

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
           size={0.12} 
           color="#1a3b8c" 
           sizeAttenuation 
           transparent 
           opacity={0.7} 
           depthWrite={false}
        />
      </points>

      <Stars radius={100} depth={50} count={isMobile ? 1500 : 5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={isMobile ? 400 : 1500} scale={[50, 50, 50]} size={3} speed={0.4} opacity={0.6} color="#ffffff" />
      
      {view === 'ROAD' && (
        <>
            <Sparkles count={isMobile ? 200 : 800} scale={[25, 25, 30]} size={6} speed={1} opacity={0.3} position={[0, 0, -20]} color="#38bdf8" />
            <IntroAsteroid />
            <SectionSpecificObjects isMobile={isMobile} />
            {!isMobile && <PathRings />}
        </>
      )}

      {view === 'PRICING' && <PricingAnimation />}
      {view === 'CONTACT' && <ContactAnimation />}

    </group>
  );
}

function PricingAnimation() {
   const group = useRef();
   useFrame((state, delta) => {
      if (group.current) {
          group.current.rotation.y += delta * 0.2;
          group.current.rotation.x += delta * 0.1;
      }
   });
   return (
       <group ref={group} position={[0, 5, 0]}>
           <Icosahedron args={[8, 1]}>
               <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.3} polygonOffset polygonOffsetFactor={1} />
           </Icosahedron>
           <Icosahedron args={[6, 0]}>
               <meshStandardMaterial color="#ffffff" transparent opacity={0.1} polygonOffset polygonOffsetFactor={-1} />
           </Icosahedron>
           <Sparkles count={400} scale={[20, 20, 20]} size={6} color="#60a5fa" opacity={0.8} speed={2} />
       </group>
   );
}

function ContactAnimation() {
   const group = useRef();
   useFrame((state, delta) => {
      if (group.current) {
          group.current.rotation.y -= delta * 0.1;
          group.current.rotation.z += delta * 0.05;
          group.current.position.y = 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      }
   });
   return (
       <group ref={group} position={[0, 2, -25]}>
           <mesh>
               <icosahedronGeometry args={[10, 1]} />
               <meshStandardMaterial color="#34d399" wireframe transparent opacity={0.1} polygonOffset polygonOffsetFactor={1} />
           </mesh>
           <Sparkles count={500} scale={[40, 40, 40]} size={6} color="#10b981" opacity={0.4} speed={0.5} />
       </group>
   );
}

function PathRings() {
  const rings = useMemo(() => {
    return Array.from({ length: 5 }).map((_, i) => {
      const z = -(90 + i * 10);
      const x = Math.sin(z * 0.05) * 8;
      const y = Math.cos(z * 0.03) * 3;
      return { x, y, z, key: i };
    });
  }, []);
  
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
        ringRef.current.children.forEach((child, i) => {
            child.rotation.x = state.clock.elapsedTime * 0.3 + i;
            child.rotation.y = state.clock.elapsedTime * 0.1 + i;
        });
    }
  });

  return (
    <group ref={ringRef}>
      {rings.map((r, index) => (
         <mesh key={r.key} position={[r.x, r.y, r.z]}>
           <torusGeometry args={[10, 0.05, 16, 100]} />
           <meshBasicMaterial color={index % 2 === 0 ? "#818cf8" : "#c084fc"} transparent opacity={0.3} wireframe />
         </mesh>
      ))}
    </group>
  );
}

function SectionSpecificObjects({ isMobile }) {
  const objects = useMemo(() => {
    const list = [];
    const countMult = isMobile ? 0.4 : 1;
    for (let i=0; i<Math.ceil(4 * countMult); i++) {
       const z = -(40 + Math.random() * 40);
       const x = Math.sin(z * 0.05) * 8 + (Math.random()-0.5)*25;
       const y = Math.cos(z * 0.03) * 3 + (Math.random()-0.5)*20;
       list.push({ type: 'icosahedron', x, y, z, scale: Math.random()*0.6+0.3, speed: Math.random()*2+1 });
    }
    for (let i=0; i<Math.ceil(3 * countMult); i++) {
       const z = -(85 + Math.random() * 55);
       const x = Math.sin(z * 0.05) * 8 + (Math.random()-0.5)*25;
       const y = Math.cos(z * 0.03) * 3 + (Math.random()-0.5)*20;
       list.push({ type: 'torusknot', x, y, z, scale: Math.random()*0.6+0.3, speed: Math.random()*2+1 });
    }
    for (let i=0; i<Math.ceil(5 * countMult); i++) {
       const z = -(145 + Math.random() * 45);
       const x = Math.sin(z * 0.05) * 8 + (Math.random()-0.5)*25;
       const y = Math.cos(z * 0.03) * 3 + (Math.random()-0.5)*20;
       list.push({ type: 'octahedron', x, y, z, scale: Math.random()*0.6+0.3, speed: Math.random()*2+1 });
    }
    return list;
  }, [isMobile]);

  return (
    <>
      {objects.map((obj, i) => (
        <Float key={i} position={[obj.x, obj.y, obj.z]} speed={obj.speed} rotationIntensity={2} floatIntensity={3}>
            {obj.type === 'icosahedron' && (
              <Icosahedron args={[1, 0]} scale={obj.scale}>
                 <meshStandardMaterial color="#34d399" wireframe opacity={0.4} transparent polygonOffset polygonOffsetFactor={-1} />
              </Icosahedron>
           )}
           {obj.type === 'torusknot' && (
              <TorusKnot args={[0.5, 0.1, 64, 8]} scale={obj.scale}>
                 <MeshDistortMaterial color="#a78bfa" distort={0.5} speed={3} opacity={0.5} transparent polygonOffset polygonOffsetFactor={-1} />
              </TorusKnot>
           )}
           {obj.type === 'octahedron' && (
              <mesh scale={obj.scale * 0.8}>
                 <octahedronGeometry args={[1, 0]} />
                 <meshStandardMaterial color="#fbbf24" wireframe opacity={0.4} transparent polygonOffset polygonOffsetFactor={-1} />
              </mesh>
           )}
        </Float>
      ))}
    </>
  );
}

function IntroAsteroid() {
  const asteroidRef = useRef();
  const materialRef = useRef();
  useFrame((state, delta) => {
    if (asteroidRef.current && materialRef.current) {
        const t = state.clock.elapsedTime;
        const impactTime = 1.5;
        if (t < impactTime) {
            const progress = t / impactTime;
            const ease = progress * progress * progress; 
            const x = THREE.MathUtils.lerp(60, 0, ease);
            const y = THREE.MathUtils.lerp(40, 0, ease); 
            const z = THREE.MathUtils.lerp(20, 0, ease);
            asteroidRef.current.position.set(x, y, z);
            asteroidRef.current.rotation.x += delta * 15;
            asteroidRef.current.rotation.y += delta * 10;
            const scale = THREE.MathUtils.lerp(0.5, 2.5, ease);
            asteroidRef.current.scale.set(scale, scale, scale);
            materialRef.current.opacity = 1;
        } else {
            const timeAfterImpact = t - impactTime;
            if (timeAfterImpact < 0.3) {
               const shrinkProgress = timeAfterImpact / 0.3;
               const shrinkEase = 1 - shrinkProgress;
               const scale = 2.5 * shrinkEase;
               asteroidRef.current.scale.set(scale, scale, scale);
               materialRef.current.opacity = shrinkEase;
            } else {
               asteroidRef.current.scale.set(0, 0, 0);
               materialRef.current.opacity = 0;
            }
        }
    }
  });

  return (
    <mesh ref={asteroidRef}>
        <dodecahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial ref={materialRef} color="#ffffff" emissive="#38bdf8" emissiveIntensity={2} distort={0.8} speed={5} roughness={0.2} metalness={0.8} transparent />
    </mesh>
  );
}
