import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useScroll, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  MeshDistortMaterial, 
  ContactShadows, 
  Stars,
  Sparkles,
  Grid,
  Loader,
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh
} from '@react-three/drei';
import * as THREE from 'three';
import ExploreDropdown from './ExploreDropdown';
import useIsMobile from '../hooks/useIsMobile';

// ─── Constants ───
const THEME_COLOR = "#e63946"; 
const ACCENT_COLOR = "#ff8e3c"; 

// ─── Neural Dimension Intro ───

function NeuralEffect({ isMobile }) {
  const points = useMemo(() => {
    const p = [];
    const count = isMobile ? 60 : 200;
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3((Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40));
    }
    return p;
  }, []);

  const lines = useMemo(() => {
    const l = [];
    for (let i = 0; i < points.length; i++) {
        const near = points.filter(p => p.distanceTo(points[i]) < 8);
        near.forEach(p => l.push(points[i], p));
    }
    return l;
  }, [points]);

  const lineRef = useRef();
  const pointRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lineRef.current) {
        lineRef.current.rotation.y = t * 0.1;
        lineRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
    if (pointRef.current) {
        pointRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lines.length}
            array={new Float32Array(lines.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={THEME_COLOR} transparent opacity={0.3} />
      </lineSegments>
      <points ref={pointRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={ACCENT_COLOR} size={0.15} transparent opacity={0.8} sizeAttenuation />
      </points>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function NeuralDimensionIntro({ onComplete, isMobile }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, isMobile ? 1500 : 3500);
        return () => clearTimeout(timer);
    }, [onComplete, isMobile]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[1000] bg-[#020308] flex items-center justify-center overflow-hidden"
        >
            <div className="absolute inset-0 z-0 opacity-40">
                <Canvas 
                  dpr={isMobile ? [1, 1] : [1, 2]}
                  gl={{ antialias: false }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 30]} />
                    <NeuralEffect isMobile={isMobile} />
                </Canvas>
            </div>
            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#e63946] to-[#ff8e3c] flex items-center justify-center shadow-[0_0_100px_#e63946] animate-pulse">
                        <span className="text-white font-black text-5xl italic">E</span>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-white font-wide font-bold text-2xl tracking-[1em] uppercase">Initialising</h2>
                        <span className="text-[#e63946] text-[10px] font-wide font-bold tracking-[0.8em] uppercase animate-pulse">Upgrade with AI Premium service</span>
                    </div>
                </motion.div>
                
                {/* Progression Bar */}
                <div className="w-64 h-[1px] bg-white/10 mt-12 relative overflow-hidden">
                    <motion.div 
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#e63946] to-transparent"
                    />
                </div>
            </div>
        </motion.div>
    );
}

// ─── 3D Premium Crown Scene ───

function DiamondCore({ scrollProgress, isMobile }) {
  const diamondRef = useRef();
  const outerRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (diamondRef.current) {
      diamondRef.current.rotation.y = t * 0.3;
      diamondRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
      // Pulse scale
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      diamondRef.current.scale.setScalar(pulse);
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -t * 0.15;
      outerRef.current.rotation.z = Math.cos(t * 0.3) * 0.3;
    }
  });

  return (
    <group>
      {/* Inner diamond crystal */}
      <Float speed={3} rotationIntensity={1} floatIntensity={0.5}>
        <mesh ref={diamondRef}>
          <octahedronGeometry args={[3, 0]} />
          {isMobile ? (
            <meshStandardMaterial color="#e63946" metalness={1} roughness={0.1} polygonOffset polygonOffsetFactor={-1} />
          ) : (
            <MeshDistortMaterial
              color="#e63946"
              speed={3}
              distort={0.15}
              metalness={1}
              roughness={0.05}
              envMapIntensity={2}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          )}
        </mesh>
      </Float>
      
      {/* Outer wireframe cage */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[5, 1]} />
        <meshStandardMaterial
          color={ACCENT_COLOR}
          wireframe
          transparent
          opacity={0.08}
          emissive={ACCENT_COLOR}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
}

function PremiumScene({ scrollProgress, view, isMobile }) {
  const masterGroup = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const sp = scrollProgress?.get() || 0;

    if (masterGroup.current) {
      masterGroup.current.rotation.y = t * 0.05;

      if (view !== 'ROAD') {
        masterGroup.current.position.x = THREE.MathUtils.lerp(masterGroup.current.position.x, 0, 0.02);
        masterGroup.current.position.y = THREE.MathUtils.lerp(masterGroup.current.position.y, 2, 0.02);
        masterGroup.current.position.z = THREE.MathUtils.lerp(masterGroup.current.position.z, -10, 0.02);
      } else {
        if (sp < 0.2) {
          masterGroup.current.position.x = THREE.MathUtils.lerp(masterGroup.current.position.x, 0, 0.03);
          masterGroup.current.position.y = THREE.MathUtils.lerp(masterGroup.current.position.y, 0, 0.03);
          masterGroup.current.position.z = THREE.MathUtils.lerp(masterGroup.current.position.z, 0, 0.03);
        } else if (sp < 0.4) {
          masterGroup.current.position.x = THREE.MathUtils.lerp(masterGroup.current.position.x, 12, 0.04);
        } else if (sp < 0.6) {
          masterGroup.current.position.y = THREE.MathUtils.lerp(masterGroup.current.position.y, 15, 0.04);
          masterGroup.current.position.x = THREE.MathUtils.lerp(masterGroup.current.position.x, 0, 0.03);
        } else if (sp < 0.8) {
          masterGroup.current.position.y = THREE.MathUtils.lerp(masterGroup.current.position.y, -5, 0.03);
          masterGroup.current.position.x = THREE.MathUtils.lerp(masterGroup.current.position.x, -12, 0.04);
        } else {
          masterGroup.current.position.z = THREE.MathUtils.lerp(masterGroup.current.position.z, 50, 0.03);
          masterGroup.current.rotation.z += delta * 1;
        }
      }
    }
  });

  return (
    <group ref={masterGroup}>
      <DiamondCore isMobile={isMobile} />
    </group>
  );
}

function Scene3D({ scrollProgress, view, isMobile }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      <color attach="background" args={["#020308"]} />
      <fog attach="fog" args={["#020308", 25, 120]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[20, 30, 10]} intensity={4} color={THEME_COLOR} distance={100} />
      <pointLight position={[-20, -20, -10]} intensity={3} color={ACCENT_COLOR} distance={80} />
      <pointLight position={[0, 0, 20]} intensity={1} color="#ffffff" distance={40} />
      
      <PremiumScene scrollProgress={scrollProgress} view={view} isMobile={isMobile} />
      
      <Sparkles count={isMobile ? 150 : 600} scale={[80, 80, 80]} size={1.5} speed={0.3} color={ACCENT_COLOR} />
      
      <Stars radius={150} depth={60} count={isMobile ? 1000 : 3000} factor={4} saturation={0} fade speed={0.8} />
      
      <Grid
        position={[0, -25, 0]}
        infiniteGrid
        fadeDistance={isMobile ? 60 : 100}
        cellSize={1.5}
        sectionSize={6}
        sectionThickness={0.8}
        sectionColor={THEME_COLOR}
      />
      
      {!isMobile && <ContactShadows position={[0, -25, 0]} opacity={0.3} scale={100} blur={3} />}
      <Environment preset="night" />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </>
  );
}

// ─── Static Data Diagrams Overlay ───
function DataDiagramsOverlay() {
  const diagrams = [
    // Bar chart cluster - top left
    { type: 'bars', x: '8%', y: '15%', delay: 0 },
    // Pie chart - bottom right
    { type: 'pie', x: '78%', y: '65%', delay: 2 },
    // Line graph - top right  
    { type: 'line', x: '72%', y: '12%', delay: 1 },
    // Stats card - bottom left
    { type: 'stats', x: '5%', y: '70%', delay: 3 },
    // Mini bar - center right
    { type: 'minibars', x: '88%', y: '40%', delay: 1.5 },
    // Dots chart - center left
    { type: 'dots', x: '3%', y: '42%', delay: 0.5 },
  ];

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-[0.07] max-w-[1920px] mx-auto left-1/2 -translate-x-1/2">
      {diagrams.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: d.x, top: d.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{ delay: d.delay, duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {d.type === 'bars' && (
            <div className="flex items-end gap-[3px] h-20">
              {[60, 80, 45, 90, 70, 55, 85, 50].map((h, j) => (
                <div key={j} className="w-[6px] rounded-t-sm" style={{ height: `${h}%`, background: j % 2 === 0 ? '#e63946' : '#ff8e3c' }} />
              ))}
            </div>
          )}
          {d.type === 'pie' && (
            <div className="w-16 h-16 rounded-full border-[3px] border-[#e63946]" style={{ background: `conic-gradient(#e63946 0% 35%, #ff8e3c 35% 65%, #ff6b81 65% 85%, transparent 85%)` }} />
          )}
          {d.type === 'line' && (
            <svg width="120" height="50" className="overflow-visible">
              <polyline points="0,40 15,30 30,35 50,15 65,25 80,10 100,20 120,5" fill="none" stroke="#e63946" strokeWidth="1.5" />
              <polyline points="0,45 15,38 30,42 50,25 65,32 80,22 100,28 120,15" fill="none" stroke="#ff8e3c" strokeWidth="1" strokeDasharray="3,3" />
            </svg>
          )}
          {d.type === 'stats' && (
            <div className="flex flex-col gap-2">
              {[{ w: '60px', c: '#e63946' }, { w: '85px', c: '#ff8e3c' }, { w: '45px', c: '#ff6b81' }, { w: '72px', c: '#e63946' }].map((bar, j) => (
                <div key={j} className="h-[3px] rounded-full" style={{ width: bar.w, background: bar.c }} />
              ))}
            </div>
          )}
          {d.type === 'minibars' && (
            <div className="flex items-end gap-[2px] h-12">
              {[50, 70, 30, 80, 60].map((h, j) => (
                <div key={j} className="w-[4px] rounded-t-sm" style={{ height: `${h}%`, background: '#e63946' }} />
              ))}
            </div>
          )}
          {d.type === 'dots' && (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(12)].map((_, j) => (
                <div key={j} className="w-2 h-2 rounded-full" style={{ background: j % 3 === 0 ? '#e63946' : j % 3 === 1 ? '#ff8e3c' : 'transparent', opacity: Math.random() > 0.3 ? 1 : 0.3 }} />
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Cinematic Color Grading Overlay ───
function ColorGradingOverlay() {
  return (
    <>
      {/* 1. Global Color Balance (Warm/Cool split) */}
      <div className="absolute inset-0 z-[6] pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-tr from-[#0a1128] via-transparent to-[#e6394622]" />
      
      {/* 2. Color Intensity Boost */}
      <div className="absolute inset-0 z-[7] pointer-events-none mix-blend-color-dodge opacity-10 bg-[radial-gradient(circle_at_20%_30%,#e63946_0%,transparent_50%),radial-gradient(circle_at_80%_70%,#ff8e3c_0%,transparent_50%)]" />

      {/* 3. Film Grain / Noise */}
      <div className="absolute inset-0 z-[8] pointer-events-none opacity-[0.03] grayscale bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* 4. Deep Contrast Vignette */}
      <div className="absolute inset-0 z-[9] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.95)_100%)]" />
    </>
  );
}

// ─── Depth Zoom Section Wrapper ───
function AdvancedSection({ children, progress, start, end, isMobile, isLast = false, noCard = false }) {
  const duration = end - start;
  const p1 = start;
  const p2 = start + duration * 0.15; 
  const p3 = start + duration * 0.85; 
  const p4 = end;

  // Hyper-Cinematic Depth Zoom
  const scale = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0.4, 1, 1, isLast ? 1 : 1.8]);
  const opacity = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0, 1, 1, isLast ? 1 : 0]);
  const y = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], ["150px", "0px", "0px", isLast ? "0px" : "-150px"]);
  const rotateY = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [25, 0, 0, isLast ? 0 : -25]);
  const rotateX = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [-20, 0, 0, isLast ? 0 : 20]);
  const blurValue = isMobile ? 0 : 12;
  const blur = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [blurValue, 0, 0, isLast ? 0 : blurValue]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  const pointerEvents = useTransform(progress, (v) => {
    if (isLast) return v >= p1 - 0.05 ? "auto" : "none";
    return (v >= p1 - 0.05 && v <= p4 + 0.05) ? "auto" : "none";
  });

  return (
    <motion.div
      style={{ 
        opacity, 
        scale,
        y,
        rotateX,
        rotateY,
        filter: filterBlur,
        transformPerspective: 2000
      }}
      className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-20 pointer-events-none"
    >
      <motion.div 
        style={{ pointerEvents }}
        className="w-full h-full flex flex-col items-center justify-center text-center"
      >
        {noCard ? children : (
          <motion.div 
              style={{ 
                transformStyle: "preserve-3d",
                boxShadow: "0 100px 200px rgba(0,0,0,0.8)"
              }}
              className="w-full max-w-4xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-[30px] border border-white/20 rounded-[24px] md:rounded-[40px] p-6 md:p-16 shadow-[0_0_50px_rgba(230,57,70,0.05)] overflow-y-auto max-h-[75vh] hide-scrollbar"
          >
              {children}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

const servicesData = [
    { title: 'AI AUTOMATION', desc: 'Custom neural networks, LLM fine-tuning & intelligent workflow automation.', icon: '🧠', color: 'rgba(230,57,70,0.06)' },
    { title: 'WEB3 PORTALS', desc: 'Decentralized apps, wallet integration & on-chain analytics dashboards.', icon: '🔗', color: 'rgba(255,142,60,0.06)' },
    { title: 'CLOUD NATIVE', desc: 'Serverless architectures, auto-scaling clusters & edge deployments.', icon: '☁️', color: 'rgba(168,85,247,0.06)' },
    { title: 'MOTION DESIGN', desc: 'Cinematic UI animations, 3D WebGL experiences & interactive storytelling.', icon: '🎨', color: 'rgba(244,114,182,0.06)' },
    { title: 'PERFORMANCE', desc: 'Sub-second load times, CDN optimization & Core Web Vitals mastery.', icon: '⚡', color: 'rgba(251,191,36,0.06)' },
    { title: 'DATA SCIENCE', desc: 'Predictive modeling, anomaly detection & real-time recommendation engines.', icon: '🔬', color: 'rgba(34,211,238,0.06)' },
];

export default function PremiumTemplate({ view, setView, scrollYProgress, activeTemplate, setActiveTemplate }) {
  const [isNeuralLoading, setIsNeuralLoading] = useState(true);
  const isMobile = useIsMobile();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 25, restDelta: 0.001 });

  return (
    <>
      <AnimatePresence mode="wait">
        {isNeuralLoading && (
          <NeuralDimensionIntro key="intro" onComplete={() => setIsNeuralLoading(false)} isMobile={isMobile} />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isNeuralLoading ? 0 : 1
        }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 z-30 bg-[#020308] text-white overflow-hidden font-sans"
      >
        
        {/* ── Immersive 3D Engine ── */}
        <div className="absolute inset-0 z-[1]">
          <Canvas dpr={isMobile ? [1, 1.2] : [1, 2.5]} gl={{ antialias: false, powerPreference: "high-performance" }}>
            <React.Suspense fallback={null}>
              <Bvh firstHitOnly>
                <Scene3D scrollProgress={smoothProgress} view={view} isMobile={isMobile} />
              </Bvh>
            </React.Suspense>
          </Canvas>
          <Loader 
            dataInterpolation={(p) => `PREMIUM LOAD… ${p.toFixed(0)}%`}
            containerStyles={{ background: '#020308' }}
            innerStyles={{ backgroundColor: '#e63946' }}
            barStyles={{ backgroundColor: '#ff8e3c' }}
          />
        </div>

        {/* Fallback Static Gradient Background for Mobile (Layered behind 3D) */}
        {isMobile && (
          <div className="absolute inset-0 z-[-1] bg-gradient-to-tr from-[#020308] via-[#05060b] to-[#0a1128] opacity-100" />
        )}

      {/* ── Visual Polish ── */}
      {!isMobile && <ColorGradingOverlay />}

      {/* ── Data Diagrams ── */}
      {(view === 'ROAD' && !isMobile) && <DataDiagramsOverlay />}

      {/* ── Navigation ── */}
      <nav className="absolute top-0 w-full max-w-[1920px] left-1/2 -translate-x-1/2 flex items-center justify-between px-6 py-6 md:px-12 md:py-10 z-[100] pointer-events-auto">
          <div className="flex flex-col cursor-pointer z-50 group origin-left hover:scale-105 transition-all duration-500" onClick={() => setView('ROAD')}>
              <h1 className="font-wide text-lg md:text-2xl lg:text-3xl font-bold tracking-tighter text-white drop-shadow-sm whitespace-nowrap uppercase">
                  UPGRADE WITH<span className="text-[#e63946] italic"> AI</span>
              </h1>
              <h2 className="text-[7px] md:text-[10px] font-sans tracking-[0.25em] md:tracking-[0.3em] mt-1 uppercase font-medium text-slate-400">
                  High-Performance Web & Intelligent Solutions
              </h2>
          </div>
          <div className="flex items-center gap-6 md:gap-12 z-[110]">
              <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
          </div>
      </nav>

      {/* ── Floating Nav ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:top-10 md:bottom-auto z-[150] flex gap-6 md:gap-12 bg-[#020308]/80 backdrop-blur-xl px-6 py-4 md:px-8 md:py-4 rounded-full border border-white/10 pointer-events-auto min-w-max shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {['ROAD', 'PRICING', 'CONTACT'].map(item => (
              <button key={item} onClick={() => setView(item)} className="flex-shrink-0 text-[10px] md:text-xs font-wide font-bold tracking-[0.2em] uppercase transition-all hover:text-[#e63946] flex flex-col items-center group text-white">
                  {item === 'ROAD' ? 'ROOT' : item}
                  <div className={`h-[1px] bg-[#e63946] transition-all duration-500 ${view === item ? 'w-full' : 'w-0 group-hover:w-full'} mt-1 flex-shrink-0`} />
              </button>
          ))}
      </div>

      {/* ── Main Content Engine ── */}
      <div className="w-full h-full relative z-10">
          <AnimatePresence mode="wait">
              {view === 'ROAD' && (
                  <motion.div key="road" className="absolute inset-0">
                      
                      {/* Section 00: Scroll To Explore */}
                      <AdvancedSection progress={smoothProgress} start={0} end={0.12} isMobile={isMobile} noCard={true}>
                        <div className="flex flex-col items-center justify-center">
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }} 
                             animate={{ opacity: 1, y: 0 }} 
                             transition={{ delay: 1, duration: 2 }}
                             className="text-white/60 font-wide tracking-[0.4em] text-xs md:text-sm uppercase flex flex-col items-center"
                           >
                              <span className="mb-6">Scroll to explore</span>
                              <div className="w-[2px] h-24 bg-gradient-to-b from-[#e63946] to-transparent animate-bounce"></div>
                           </motion.div>
                        </div>
                      </AdvancedSection>

                      {/* Section 01: Hero */}
                      <AdvancedSection progress={smoothProgress} start={0.15} end={0.32} isMobile={isMobile}>
                          <span className="text-[#e63946] font-wide text-xs md:text-sm tracking-[0.4em] uppercase mb-6 block font-bold">Singularity Core</span>
                          <h1 className="text-lg md:text-2xl lg:text-3xl font-wide font-bold tracking-tighter leading-tight mb-8 uppercase italic">
                                HYPER <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] via-[#ff8e3c] to-[#ffffff]">ELITE</span>
                          </h1>
                          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10 font-sans font-medium">
                              Architecting digital dominance for the next generation of industry leaders.
                          </p>
                          <button onClick={() => setView('CONTACT')} className="px-12 py-5 bg-white text-black font-wide font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-[#e63946] hover:text-white transition-all duration-700 shadow-[0_20px_40px_rgba(255,255,255,0.05)] cursor-pointer">
                              INITIALIZE
                          </button>
                      </AdvancedSection>

                      {/* Section 02: About */}
                      <AdvancedSection progress={smoothProgress} start={0.35} end={0.52} isMobile={isMobile}>
                          <h2 className="text-[#e63946] font-wide text-xs md:text-sm tracking-[0.4em] uppercase mb-10 font-bold">Visionary Authority</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div className="text-left">
                                  <p className="text-xl md:text-2xl lg:text-3xl font-wide font-bold mb-6 leading-tight tracking-tighter uppercase italic">
                                      Defying the <br/>
                                      <span className="text-[#ff8e3c]">Gravity of Norm.</span>
                                  </p>
                                  <div className="text-slate-300 text-sm font-sans leading-relaxed space-y-3">
                                      <p>Upgrade ELITE represents the apex of digital engineering — every line of code optimized for extreme velocity and visual impact.</p>
                                      <p className="text-xs text-slate-400">Our elite squad of 15+ senior architects specializes in bleeding-edge tech that most agencies won't touch: WebGL, Three.js, real-time AI, and immersive experiences.</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                  {[
                                      { t: "Speed Index", i: "🏎️", d: "0.8s LCP Score", bg: "rgba(230,57,70,0.15)" },
                                      { t: "Neural AI", i: "🧪", d: "GPT-4 Integrated", bg: "rgba(255,142,60,0.15)" },
                                      { t: "Global CDN", i: "🛰️", d: "140+ Edge Nodes", bg: "rgba(168,85,247,0.15)" },
                                      { t: "Pixel Perfect", i: "💎", d: "Award-Level UX", bg: "rgba(244,114,182,0.15)" }
                                  ].map((item, idx) => (
                                      <div key={idx} style={{ background: item.bg }} className="border border-white/20 p-4 rounded-[18px] backdrop-blur-md group hover:border-[#e63946]/50 transition-all text-left">
                                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.i}</div>
                                          <h4 className="text-xs md:text-sm font-wide font-bold uppercase tracking-widest text-white mb-1">{item.t}</h4>
                                          <p className="text-[10px] md:text-xs text-slate-300 font-sans font-bold uppercase">{item.d}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </AdvancedSection>

                      {/* Section 03: Metrics */}
                      <AdvancedSection progress={smoothProgress} start={0.55} end={0.72} isMobile={isMobile}>
                          <h2 className="text-[#e63946] font-wide text-xs md:text-sm tracking-[0.4em] uppercase mb-12 font-bold">Operation Stats</h2>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-4xl mx-auto">
                              {[
                                  { v: "0.8s", l: "LCP SCORE", ic: "📱", sub: "Lighthouse 100", bg: "rgba(230,57,70,0.15)" },
                                  { v: "99.9%", l: "UPTIME SLA", ic: "🟢", sub: "Enterprise grade", bg: "rgba(255,142,60,0.15)" },
                                  { v: "140+", l: "EDGE NODES", ic: "🌐", sub: "Global CDN mesh", bg: "rgba(168,85,247,0.15)" },
                                  { v: "4.8M", l: "DAILY HITS", ic: "📈", sub: "Peak traffic handled", bg: "rgba(251,191,36,0.15)" }
                              ].map((m, i) => (
                                  <div key={i} style={{ background: m.bg }} className="p-6 border border-white/20 rounded-[25px] group hover:border-[#e63946]/50 transition-all">
                                      <div className="text-xl mb-2">{m.ic}</div>
                                      <div className="text-xl md:text-2xl lg:text-3xl font-wide font-bold mb-2 group-hover:scale-110 transition-transform">{m.v}</div>
                                      <div className="text-xs md:text-sm font-wide font-bold tracking-[0.2em] text-[#ff8e3c] uppercase">{m.l}</div>
                                      <div className="text-[10px] md:text-xs text-slate-300 mt-1 font-sans font-bold uppercase">{m.sub}</div>
                                  </div>
                              ))}
                          </div>
                      </AdvancedSection>

                      {/* Section 04: Services */}
                      <AdvancedSection progress={smoothProgress} start={0.75} end={0.88} isMobile={isMobile}>
                          <h2 className="text-[#e63946] font-wide text-xs md:text-sm tracking-[0.4em] uppercase mb-12 font-bold">Capabilities</h2>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                              {servicesData.map((s, i) => (
                                  <div key={i} style={{ background: s.color.replace('0.06', '0.15') }} className="p-5 border border-white/20 flex flex-col items-center rounded-[24px] hover:border-[#e63946]/50 group transition-all">
                                      <div className="text-3xl mb-3 group-hover:rotate-12 transition-transform">{s.icon}</div>
                                      <h4 className="font-wide font-bold text-xs md:text-sm tracking-widest uppercase text-white mb-2">{s.title}</h4>
                                      <p className="text-[10px] md:text-xs text-slate-300 font-sans font-bold uppercase leading-relaxed text-center">{s.desc}</p>
                                  </div>
                              ))}
                          </div>
                      </AdvancedSection>

                      {/* Section 05: Final */}
                      <AdvancedSection progress={smoothProgress} start={0.91} end={1.0} isMobile={isMobile} isLast={true}>
                          <h2 className="text-lg md:text-2xl lg:text-3xl font-wide font-bold mb-10 uppercase italic tracking-tighter leading-none">
                                VOID <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] to-[#ff8e3c]">INIT.</span>
                          </h2>
                          <p className="text-slate-500 text-sm font-sans max-w-md mx-auto mb-12 font-medium">Ready to deploy your enterprise vision into the void of the ordinary?</p>
                          <div className="flex flex-col items-center gap-10">
                              <div className="flex justify-center gap-10">
                                  <button onClick={() => setView('CONTACT')} className="px-16 py-6 bg-white text-black font-wide font-bold text-xs md:text-sm tracking-[0.3em] uppercase rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] cursor-pointer">DEPLOY PROTOCOL</button>
                              </div>
                              {/* VISIT AGAIN BUTTON - MEDIUM SCALE */}
                              <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    document.documentElement.style.scrollBehavior = 'smooth';
                                    window.scrollTo(0, 0);
                                    setTimeout(() => {
                                        document.documentElement.style.scrollBehavior = 'auto';
                                    }, 1000);
                                }}
                                className="group flex flex-col items-center gap-2 transition-all relative z-[100]"
                              >
                                <div className="w-12 h-12 border border-[#e63946] rounded-full bg-[#e63946]/5 flex items-center justify-center group-hover:bg-[#e63946] group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(230,230,230,0.15)]">
                                    <span className="text-sm text-white rotate-[-90deg] block">➔</span>
                                </div>
                                <span className="text-[10px] font-wide font-bold uppercase tracking-[0.4em] text-[#e63946] group-hover:text-white transition-colors">Visit Again</span>
                              </button>
                          </div>
                      </AdvancedSection>

                  </motion.div>
              )}

              {view === 'PRICING' && (
                <motion.div 
                    key="pricing"
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 z-50 w-full h-full flex flex-col pointer-events-auto pt-32 md:pt-40 px-6 md:px-12 pb-24 overflow-y-auto hide-scrollbar bg-[#020308]/60 backdrop-blur-md items-center"
                >
                  <div className="w-full max-w-6xl">
                    <div className="mb-8 md:mb-10 w-full">
                        <h3 className="text-[#e63946] font-wide font-bold text-lg md:text-2xl lg:text-3xl mb-4 tracking-tighter uppercase italic">MODULAR PRICING TIERS</h3>
                        <p className="text-sm md:text-base font-sans text-slate-300 max-w-4xl leading-relaxed font-medium">
                            Whether you need a high-impact presence or a massive database-driven platform intertwined with an enterprise LLM, we deliver uncompromising quality at fair prices. Every plan is meticulously engineered and includes post-launch technical support.
                        </p>
                    </div>

                    <div className="border-t border-white/20 mb-12">
                        {[
                            { title: "CORE FRAME", price: "₹18,999", desc: "Standard high-fidelity portfolio." },
                            { title: "NEURAL NODE", price: "CUSTOM", desc: "Advanced AI web applications." },
                            { title: "ENTERPRISE GRID", price: "QUOTE", desc: "Scalable global architecture." }
                        ].map((p, i) => (
                            <div key={i} onClick={() => window.open(`https://wa.me/918825802060?text=I'm%20interested%20in%20estimating%20the%20${encodeURIComponent(p.title)}`, '_blank')} className="py-8 border-b border-white/20 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-white/5 transition duration-300 cursor-pointer group px-4 rounded-xl">
                                <div className="flex flex-col md:w-[70%]">
                                    <span className="font-wide font-bold text-lg md:text-xl lg:text-2xl group-hover:pl-4 transition-all duration-300 group-hover:text-[#e63946] text-white uppercase italic tracking-tighter">{p.title}</span>
                                    <span className="text-sm font-sans text-slate-400 mt-2 leading-relaxed font-medium">{p.desc}</span>
                                </div>
                                <span className="font-wide font-bold text-base md:text-lg lg:text-xl mt-4 md:mt-0 text-[#e63946] md:text-right whitespace-nowrap">{p.price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-sans">
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-[#e63946]/20 shadow-xl group hover:border-[#e63946]/50 transition-colors">
                            <strong className="block text-white mb-2 text-base font-wide">TECH STACK</strong>
                            <span className="text-slate-300">We exclusively deploy on modern, highly-scalable stacks including Next.js, React, Node.js, Python, PostgreSQL, and Vercel/AWS infrastructures.</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-[#e63946]/20 shadow-xl group hover:border-[#e63946]/50 transition-colors">
                            <strong className="block text-white mb-2 text-base font-wide">DELIVERY TIMES</strong>
                            <span className="text-slate-300">Static builds typically launch within 1–2 weeks. Bespoke web applications and AI tools map dynamically based on functional complexity constraints.</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-[#e63946]/20 shadow-xl group hover:border-[#e63946]/50 transition-colors">
                            <strong className="block text-white mb-2 text-base font-wide">MAINTENANCE</strong>
                            <span className="text-slate-300">Custom Retainer Models available for persistent system updates, continuous AI model tuning, security patching, and server monitoring.</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {view === 'CONTACT' && (
                <motion.div 
                    key="contact"
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 z-50 w-full h-full flex flex-col pointer-events-auto pt-32 md:pt-40 px-6 md:px-12 pb-24 overflow-y-auto hide-scrollbar bg-[#020308]/60 backdrop-blur-md items-center"
                >
                  <div className="w-full max-w-5xl flex flex-col items-center">
                    <div className="text-center w-full mb-10 md:mb-12">
                        <h3 className="text-[#e63946] font-wide font-bold text-lg md:text-2xl lg:text-3xl tracking-tighter mb-6 uppercase italic">INITIATE CONTACT</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-200 font-sans font-medium">
                        Ready to disrupt your industry vertical? Reach out to our engineering team to construct your next <span className="text-[#e63946] font-bold">game-changing application.</span>
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
                        <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-[#e63946]/20 flex flex-col items-center justify-center hover:bg-[#e63946]/10 transition-colors text-center w-full shadow-[0_0_30px_rgba(230,57,70,0.05)] text-white">
                            <h4 className="font-wide font-bold text-xl mb-3 tracking-widest text-[#e63946]">DIRECT LINE</h4>
                            <p className="font-sans text-slate-300 text-base mb-8 max-w-[280px]">The absolute fastest method for acquiring rough project estimations. Available for rapid brainstorming logic and high-level consultation.</p>
                            <a href="https://wa.me/918825802060" target="_blank" rel="noreferrer" className="w-full py-5 bg-[#e63946]/10 text-[#e63946] rounded-full font-wide font-bold text-sm hover:bg-[#e63946] hover:text-[#020308] transition-all duration-300 tracking-widest shadow-xl border border-[#e63946]/30 hover:shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                            WHATSAPP / +918825802060
                            </a>
                        </div>
                        <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-[#e63946]/20 flex flex-col items-center justify-center hover:bg-[#e63946]/10 transition-colors text-center w-full shadow-[0_0_30px_rgba(230,57,70,0.05)] text-white">
                            <div className="text-5xl mb-6">📧</div>
                            <h4 className="font-wide font-bold text-xl mb-3 tracking-widest text-[#e63946]">BUSINESS INQUIRY</h4>
                            <p className="font-sans text-slate-300 text-base mb-8 max-w-[280px]">Transmit your formal Request for Proposal (RFP) or deep technical scope details. Expect a clinically detailed response within 24 hours.</p>
                            <a href="mailto:admin@upgradewithaifolks.com" className="w-full py-5 border-2 border-[#e63946]/30 text-[#e63946] bg-transparent rounded-full font-wide font-bold text-[11px] hover:bg-[#e63946] hover:border-[#e63946] hover:text-[#020308] transition-all duration-300 tracking-[0.2em] overflow-hidden whitespace-nowrap shadow-xl hover:shadow-[0_0_30px_rgba(230,57,70,0.3)]">
                            ADMIN@UPGRADEWITHAIFOLKS.COM
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm font-sans text-slate-200 w-full max-w-4xl pt-8 border-t border-[#e63946]/20 text-white">
                        <div className="flex flex-col items-center">
                            <strong className="text-white block mb-2 font-wide text-base">GLOBAL REACH</strong>
                            <span className="text-base text-slate-400">Servicing diverse clients worldwide through highly calibrated asynchronous workflows.</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <strong className="text-white block mb-2 font-wide text-base">OPERATING BOUNDS</strong>
                            <span className="text-base text-slate-400">Monday - Friday<br/>09:00 - 19:00 IST<br/>Weekend Emergency Retainers.</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <strong className="text-white block mb-2 font-wide text-base">HEADQUARTERS</strong>
                            <span className="text-base text-slate-400">Chennai, Tamil Nadu, India<br/>100% Remote Deployment Capacity.</span>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
      </div>

      {/* ── Metadata Overlay ── */}
      <div className="absolute bottom-24 left-6 md:bottom-12 md:left-16 flex items-center gap-6 md:gap-10 z-[50] pointer-events-none opacity-40">
          <div className="flex items-center gap-2 md:gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-wide font-bold uppercase tracking-[0.3em] md:tracking-[0.5em]">System.Active</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-[8px] md:text-[10px] font-wide font-bold uppercase tracking-[0.3em] md:tracking-[0.5em] italic">ELITE v4.0.0</span>
      </div>
      </motion.div>
    </>
  );
}
