import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text, Icosahedron, TorusKnot, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei';

export default function Scene({ view }) {
  const groupRef = useRef();
  const particlesRef = useRef();
  const scrollRef = useRef(0);
  const tornadoRef = useRef(false);
  const tornadoTime = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress from 0 to 1
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollRef.current = window.scrollY / totalScroll;
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleTornado = () => {
      tornadoRef.current = true;
      tornadoTime.current = 0;
    };
    window.addEventListener('trigger-tornado', handleTornado);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('trigger-tornado', handleTornado);
    };
  }, []);

  const particleCount = 4000;
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
        // Create a winding 3D path going forward (negative Z)
        const t = i / particleCount;
        const z = - (t * 250); // Path length 250 units
        
        // Add waviness to the path
        const xPath = Math.sin(z * 0.05) * 8;
        const yPath = Math.cos(z * 0.03) * 3;
        
        // Scatter particles around the path
        const x = xPath + (Math.random() - 0.5) * 20;
        const y = yPath + (Math.random() - 0.5) * 20 - 8; // offset downwards
        
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        sizes[i] = Math.random() * 0.08 + 0.02;
    }
    return [positions, sizes];
  }, []);

  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3(0, 5, 15));

  const colors = useMemo(() => [
    new THREE.Color("#020617"), // Hero (0-0.15) deep space
    new THREE.Color("#062029"), // About (0.15-0.35) mild teal
    new THREE.Color("#1e1b4b"), // Services (0.35-0.6) indigo
    new THREE.Color("#2a1202"), // Approach (0.6-0.82) amber dark
    new THREE.Color("#020617"), // Build (0.82-1.0) deep slate
  ], []);

  const particleColors = useMemo(() => [
    new THREE.Color("#3b82f6"), // blue
    new THREE.Color("#34d399"), // emerald
    new THREE.Color("#a78bfa"), // purple
    new THREE.Color("#fbbf24"), // amber
    new THREE.Color("#60a5fa"), // blue
  ], []);

  useFrame((state) => {
    if (view === 'ROAD') {
      // Background logic based on scrollRef with multiple color stops
      if (state.scene.fog && particlesRef.current) {
        const s = scrollRef.current;
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

      // Move camera forward based on scroll progress (0 to 1) -> maps to Z 0 to -240
      const targetZ = -(scrollRef.current * 230); 
      
      cameraPosition.current.z = THREE.MathUtils.lerp(cameraPosition.current.z, targetZ + 15, 0.03);
      
      // Calculate path center at camera's future position to follow it
      const xPath = Math.sin((targetZ) * 0.05) * 8;
      const yPath = Math.cos((targetZ) * 0.03) * 3 - 3;

      cameraPosition.current.x = THREE.MathUtils.lerp(cameraPosition.current.x, xPath, 0.02);
      cameraPosition.current.y = THREE.MathUtils.lerp(cameraPosition.current.y, Math.max(yPath + 4, 1), 0.02); // Keep slightly above the path

      state.camera.position.copy(cameraPosition.current);

      cameraTarget.current.x = THREE.MathUtils.lerp(cameraTarget.current.x, xPath, 0.04);
      cameraTarget.current.y = THREE.MathUtils.lerp(cameraTarget.current.y, yPath, 0.04);
      cameraTarget.current.z = Math.min(cameraPosition.current.z - 15, targetZ - 10);
      
      // Tornado / Loop effect going backwards
      if (tornadoRef.current) {
          tornadoTime.current += state.clock.getDelta(); // frame-rate independent
          const angle = tornadoTime.current * 12; // Spin speed!
          state.camera.up.set(Math.sin(angle), Math.cos(angle), 0).normalize();
          
          if (scrollRef.current < 0.05 && tornadoTime.current > 0.5) {
              tornadoRef.current = false;
          }
      } else {
          // smoothly restore camera up vector
          state.camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.05);
      }

      state.camera.lookAt(cameraTarget.current);

      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05);
      groupRef.current.scale.set(1, 1, 1);
    } else {
      // In other views, we move the camera away and show a dispersed view
      if (view === 'PRICING') {
          state.camera.position.lerp(new THREE.Vector3(0, 5, 40), 0.02);
          cameraTarget.current.lerp(new THREE.Vector3(0, 5, 0), 0.02);
      } else if (view === 'CONTACT') {
          state.camera.position.lerp(new THREE.Vector3(-20, 10, 20), 0.02);
          cameraTarget.current.lerp(new THREE.Vector3(0, 5, -10), 0.02);
      } else {
          state.camera.position.lerp(new THREE.Vector3(40, 30, 30), 0.02);
          cameraTarget.current.lerp(new THREE.Vector3(0, 0, -50), 0.02);
      }

      state.camera.up.lerp(new THREE.Vector3(0, 1, 0), 0.05);
      state.camera.lookAt(cameraTarget.current);
      
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -15, 0.02);

      // Change fog color
      if (state.scene.fog && particlesRef.current) {
         let targetFog = new THREE.Color("#020617");
         if (view === 'PRICING') targetFog = new THREE.Color("#080c1f");
         if (view === 'CONTACT') targetFog = new THREE.Color("#02120b");
         state.scene.fog.color.lerp(targetFog, 0.05);
         particlesRef.current.material.color.lerp(new THREE.Color("#aaaaaa"), 0.05);
      }
    }
    
    // Slight rotation to all particles for life
    if (particlesRef.current) {
      // Subtle pulse to the opacity
      particlesRef.current.material.opacity = THREE.MathUtils.lerp(
         particlesRef.current.material.opacity,
         view === 'ROAD' ? 0.7 + Math.sin(state.clock.elapsedTime)*0.1 : 0.1,
         0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.2} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={2} color="#ffffff" />
      <directionalLight position={[-10, 5, -10]} intensity={1} color="#60a5fa" />
      <fog attach="fog" args={['#d4e0fa', 15, 60]} />

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

      {/* Immersive Start / Intro atmosphere (Keep for all views) */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={1500} scale={[50, 50, 50]} size={3} speed={0.4} opacity={0.6} position={[0, 0, 0]} color="#ffffff" />
      
      {/* Decorative 3D Floating Objects along the path */}
      {view === 'ROAD' && (
        <>
            <Sparkles count={800} scale={[25, 25, 30]} size={6} speed={1} opacity={0.3} position={[0, 0, -20]} color="#38bdf8" />
            <IntroAsteroid />
            <SectionSpecificObjects />
            <PathRings />
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
               <meshStandardMaterial color="#3b82f6" wireframe transparent opacity={0.3} />
           </Icosahedron>
           <Icosahedron args={[6, 0]}>
               <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
           </Icosahedron>
           <Sparkles count={400} scale={[20, 20, 20]} size={6} color="#60a5fa" opacity={0.8} speed={2} />
       </group>
   );
}

function ContactAnimation() {
   const group = useRef();
   useFrame((state, delta) => {
      if (group.current) {
          group.current.rotation.y -= delta * 0.15;
          group.current.position.y = 5 + Math.sin(state.clock.elapsedTime) * 1;
      }
   });
   return (
       <group ref={group} position={[0, 5, -10]}>
           <TorusKnot args={[5, 0.2, 100, 16]}>
               <MeshDistortMaterial color="#34d399" distort={0.4} speed={2} transparent opacity={0.6} wireframe />
           </TorusKnot>
           <Sparkles count={300} scale={[15, 15, 15]} size={8} color="#10b981" opacity={0.8} speed={3} />
       </group>
   );
}

function PathRings() {
  const rings = useMemo(() => {
    // Dense tunnel for Services Section (Z = -90 to -140)
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


function SectionSpecificObjects() {
  const objects = useMemo(() => {
    const list = [];
    
    // About Section (Z: -35 to -80): Icosahedrons
    for (let i=0; i<4; i++) {
       const z = -(40 + Math.random() * 40);
       const x = Math.sin(z * 0.05) * 8 + (Math.random()-0.5)*25;
       const y = Math.cos(z * 0.03) * 3 + (Math.random()-0.5)*20;
       list.push({ type: 'icosahedron', x, y, z, scale: Math.random()*0.6+0.3, speed: Math.random()*2+1 });
    }
    
    // Services Section (Z: -80 to -140): TorusKnots
    for (let i=0; i<3; i++) {
       const z = -(85 + Math.random() * 55);
       const x = Math.sin(z * 0.05) * 8 + (Math.random()-0.5)*25;
       const y = Math.cos(z * 0.03) * 3 + (Math.random()-0.5)*20;
       list.push({ type: 'torusknot', x, y, z, scale: Math.random()*0.6+0.3, speed: Math.random()*2+1 });
    }

    // Approach Section (Z: -140 to -190): Octahedrons
    for (let i=0; i<5; i++) {
       const z = -(145 + Math.random() * 45);
       const x = Math.sin(z * 0.05) * 8 + (Math.random()-0.5)*25;
       const y = Math.cos(z * 0.03) * 3 + (Math.random()-0.5)*20;
       list.push({ type: 'octahedron', x, y, z, scale: Math.random()*0.6+0.3, speed: Math.random()*2+1 });
    }

    return list;
  }, []);

  return (
    <>
      {objects.map((obj, i) => (
        <Float key={i} position={[obj.x, obj.y, obj.z]} speed={obj.speed} rotationIntensity={2} floatIntensity={3}>
           {obj.type === 'icosahedron' && (
              <Icosahedron args={[1, 0]} scale={obj.scale}>
                 <meshStandardMaterial color="#34d399" wireframe opacity={0.4} transparent />
              </Icosahedron>
           )}
           {obj.type === 'torusknot' && (
              <TorusKnot args={[0.5, 0.1, 64, 8]} scale={obj.scale}>
                 <MeshDistortMaterial color="#a78bfa" distort={0.5} speed={3} opacity={0.5} transparent />
              </TorusKnot>
           )}
           {obj.type === 'octahedron' && (
              <mesh scale={obj.scale * 0.8}>
                 <octahedronGeometry args={[1, 0]} />
                 <meshStandardMaterial color="#fbbf24" wireframe opacity={0.4} transparent />
              </mesh>
           )}
        </Float>
      ))}
    </>
  );
}


function TextCard({ position, title, text }) {
    // Adding randomness to float to separate cards visually
    const speed = Math.random() * 1.5 + 0.5;
    
    return (
        <group position={position}>
            <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh>
                    <planeGeometry args={[0, 0]} /> {/* Invisible plane, text is standalone */}
                    <Text 
                        position={[0, 1.5, 0]} 
                        color="#000000" 
                        fontSize={3.2} 
                        anchorX="center" 
                        anchorY="middle"
                        material-toneMapped={false}
                        letterSpacing={-0.03}
                        font="https://fonts.gstatic.com/s/syncopate/v21/pe0pMIuPIYBCpEV5eFdKvtKqBP5w.woff"
                    >
                        {title}
                        <meshBasicMaterial attach="material" color="#1a1a1a" fog={true} />
                    </Text>
                    <Text 
                        position={[0, -1.2, 0]} 
                        color="#444444" 
                        fontSize={1} 
                        maxWidth={18}
                        textAlign="center"
                        anchorX="center" 
                        anchorY="middle"
                    >
                        {text}
                        <meshBasicMaterial attach="material" color="#444444" fog={true} />
                    </Text>
                </mesh>
            </Float>
        </group>
    )
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
            // Accelerating curve for striking
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
            // After impact, shrink and fade rapidly to simulate bursting into the name
            const timeAfterImpact = t - impactTime;
            if (timeAfterImpact < 0.3) {
               const shrinkProgress = timeAfterImpact / 0.3;
               const shrinkEase = 1 - shrinkProgress;
               const scale = 2.5 * shrinkEase;
               asteroidRef.current.scale.set(scale, scale, scale);
               materialRef.current.opacity = shrinkEase;
               asteroidRef.current.rotation.x += delta * 40; 
               asteroidRef.current.rotation.y += delta * 30;
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
