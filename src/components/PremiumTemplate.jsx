import React, { useRef, useMemo } from 'react';
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
  Grid
} from '@react-three/drei';
import * as THREE from 'three';
import { useState, useEffect } from 'react';
import ExploreDropdown from './ExploreDropdown';

// ─── Constants ───
const THEME_COLOR = "#e63946"; 
const ACCENT_COLOR = "#ff8e3c"; 

// ─── Neural Dimension Intro ───

function NeuralEffect() {
  const points = useMemo(() => {
    const p = [];
    for (let i = 0; i < 200; i++) {
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

function NeuralDimensionIntro({ onComplete }) {
    useEffect(() => {
        const timer = setTimeout(onComplete, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[1000] bg-[#020308] flex items-center justify-center overflow-hidden"
        >
            <div className="absolute inset-0 z-0 opacity-40">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 30]} />
                    <NeuralEffect />
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
                        <h2 className="text-white font-wide font-black text-2xl tracking-[1em] uppercase">Initialising</h2>
                        <span className="text-[#e63946] text-[10px] font-black tracking-[0.8em] uppercase animate-pulse">Upgrade with AI Premium service</span>
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

function DiamondCore({ scrollProgress }) {
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
          <MeshDistortMaterial
            color="#e63946"
            speed={3}
            distort={0.15}
            metalness={1}
            roughness={0.05}
            envMapIntensity={2}
          />
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

function PremiumScene({ scrollProgress }) {
  const masterGroup = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const sp = scrollProgress?.get() || 0;

    if (masterGroup.current) {
      masterGroup.current.rotation.y = t * 0.05;

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
  });

  return (
    <group ref={masterGroup}>
      <DiamondCore />
    </group>
  );
}

function Scene3D({ scrollProgress }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
      <color attach="background" args={["#020308"]} />
      <fog attach="fog" args={["#020308", 25, 120]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[20, 30, 10]} intensity={4} color={THEME_COLOR} distance={100} />
      <pointLight position={[-20, -20, -10]} intensity={3} color={ACCENT_COLOR} distance={80} />
      <pointLight position={[0, 0, 20]} intensity={1} color="#ffffff" distance={40} />
      
      <PremiumScene scrollProgress={scrollProgress} />
      
      <Sparkles count={600} scale={[80, 80, 80]} size={1.5} speed={0.3} color={ACCENT_COLOR} />
      
      <Stars radius={150} depth={60} count={3000} factor={4} saturation={0} fade speed={0.8} />
      
      <Grid
        position={[0, -25, 0]}
        infiniteGrid
        fadeDistance={100}
        cellSize={1.5}
        sectionSize={6}
        sectionThickness={0.8}
        sectionColor={THEME_COLOR}
      />
      
      <ContactShadows position={[0, -25, 0]} opacity={0.3} scale={100} blur={3} />
      <Environment preset="night" />
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
    <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-[0.07]">
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
function AdvancedSection({ children, progress, start, end, isLast = false }) {
  const duration = end - start;
  const p1 = start;
  const p2 = start + duration * 0.15; 
  const p3 = start + duration * 0.85; 
  const p4 = end;

  // Depth Zoom method: sections scale from small/blurry to full, then zoom past camera
  const scale = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0.6, 1, 1, isLast ? 1 : 1.4]);
  const opacity = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0, 1, 1, isLast ? 1 : 0]);
  const y = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], ["80px", "0px", "0px", isLast ? "0px" : "-80px"]);
  const blur = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [8, 0, 0, isLast ? 0 : 8]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.div
      style={{ 
        opacity, 
        scale,
        y,
        filter: filterBlur,
      }}
      className="absolute inset-0 flex items-center justify-center p-8 z-20 pointer-events-none"
    >
      <div className="w-full h-full pointer-events-auto flex flex-col items-center justify-center text-center">
        <motion.div 
            style={{ 
              transformStyle: "preserve-3d",
              boxShadow: "0 100px 200px rgba(0,0,0,0.8)"
            }}
            className="w-full max-w-4xl bg-white/[0.01] backdrop-blur-[30px] border border-white/10 rounded-[40px] p-8 md:p-16"
        >
            {children}
        </motion.div>
      </div>
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
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });

  return (
    <>
      <AnimatePresence>
        {isNeuralLoading && (
          <NeuralDimensionIntro onComplete={() => setIsNeuralLoading(false)} />
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={{ 
          opacity: isNeuralLoading ? 0 : 1, 
          filter: isNeuralLoading ? "blur(20px)" : "blur(0px)" 
        }}
        transition={{ duration: 1.5 }}
        className="fixed inset-0 z-30 bg-[#020308] text-white overflow-hidden font-sans flex items-center justify-center"
      >
        
        {/* ── Immersive 3D Engine ── */}
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]}>
            <Scene3D scrollProgress={smoothProgress} />
          </Canvas>
        </div>

      {/* ── Visual Polish ── */}
      <ColorGradingOverlay />

      {/* ── Data Diagrams ── */}
      <DataDiagramsOverlay />

      {/* ── Navigation ── */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-12 py-10 z-[100]">
          <div className="flex items-center gap-5 cursor-pointer group" onClick={() => setView('ROAD')}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e63946] to-[#ff8e3c] flex items-center justify-center shadow-[0_0_40px_rgba(230,57,70,0.4)] group-hover:rotate-[360deg] transition-all duration-1000">
                  <span className="text-white font-black text-3xl italic">U</span>
              </div>
              <div className="flex flex-col">
                  <span className="font-wide font-black tracking-tighter text-2xl leading-none uppercase">Upgrade with<span className="text-[#e63946]"> AI</span></span>
                  <span className="text-[10px] tracking-[0.5em] text-slate-500 font-black uppercase mt-1">Transcendent Tech </span>
              </div>
          </div>
          <div className="flex items-center gap-12">
              <div className="hidden lg:flex gap-12">
                  {['ROAD', 'PRICING', 'CONTACT'].map(item => (
                      <button key={item} onClick={() => setView(item)} className="text-[10px] font-black tracking-[0.3em] uppercase transition-all hover:text-[#e63946] flex flex-col items-center group">
                          {item === 'ROAD' ? 'Root' : item}
                          <div className={`h-[1px] bg-[#e63946] transition-all duration-500 ${view === item ? 'w-full' : 'w-0 group-hover:w-full'} mt-1`} />
                      </button>
                  ))}
              </div>
              <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
          </div>
      </nav>

      {/* ── Main Content Engine ── */}
      <div className="w-full h-full relative z-10">
          <AnimatePresence mode="wait">
              {view === 'ROAD' && (
                  <motion.div key="road" className="absolute inset-0">
                      
                      {/* Section 01: Hero */}
                      <AdvancedSection progress={smoothProgress} start={0} end={0.2}>
                          <span className="text-[#e63946] font-wide text-[10px] tracking-[0.8em] uppercase mb-6 block font-black">Singularity Core</span>
                          <h1 className="text-3xl md:text-5xl font-wide font-black tracking-tighter leading-[0.85] mb-8 italic">
                               HYPER <br/>
                               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] via-[#ff8e3c] to-[#ffffff]">ELITE</span>
                          </h1>
                          <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10 font-medium">
                              Architecting digital dominance for the next generation of industry leaders.
                          </p>
                          <button onClick={() => setView('CONTACT')} className="px-12 py-5 bg-white text-black font-wide font-black text-[10px] tracking-[0.2em] uppercase rounded-full hover:bg-[#e63946] hover:text-white transition-all duration-700 shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
                              INITIALIZE
                          </button>
                      </AdvancedSection>

                      {/* Section 02: About */}
                      <AdvancedSection progress={smoothProgress} start={0.2} end={0.4}>
                          <h2 className="text-[#e63946] font-wide text-[10px] tracking-[0.6em] uppercase mb-10 font-black">Visionary Authority</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                              <div className="text-left">
                                  <p className="text-2xl md:text-4xl font-black mb-6 leading-[1.1] tracking-tighter uppercase italic">
                                      Defying the <br/>
                                      <span className="text-[#ff8e3c]">Gravity of Norm.</span>
                                  </p>
                                  <div className="text-slate-500 text-sm leading-relaxed space-y-3">
                                      <p>Upgrade ELITE represents the apex of digital engineering — every line of code optimized for extreme velocity and visual impact.</p>
                                      <p className="text-xs text-slate-600">Our elite squad of 15+ senior architects specializes in bleeding-edge tech that most agencies won't touch: WebGL, Three.js, real-time AI, and immersive experiences.</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                  {[
                                      { t: "Speed Index", i: "🏎️", d: "0.8s LCP Score", bg: "rgba(230,57,70,0.06)" },
                                      { t: "Neural AI", i: "🧪", d: "GPT-4 Integrated", bg: "rgba(255,142,60,0.06)" },
                                      { t: "Global CDN", i: "🛰️", d: "140+ Edge Nodes", bg: "rgba(168,85,247,0.06)" },
                                      { t: "Pixel Perfect", i: "💎", d: "Award-Level UX", bg: "rgba(244,114,182,0.06)" }
                                  ].map((item, idx) => (
                                      <div key={idx} style={{ background: item.bg }} className="border border-white/5 p-4 rounded-[18px] backdrop-blur-md group hover:border-[#e63946]/50 transition-all text-left">
                                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.i}</div>
                                          <h4 className="text-[9px] font-black uppercase tracking-widest text-white mb-1">{item.t}</h4>
                                          <p className="text-[7px] text-slate-500 font-bold uppercase">{item.d}</p>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </AdvancedSection>

                      {/* Section 03: Metrics */}
                      <AdvancedSection progress={smoothProgress} start={0.4} end={0.6}>
                          <h2 className="text-[#e63946] font-wide text-[10px] tracking-[0.6em] uppercase mb-12 font-black">Operation Stats</h2>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-4xl mx-auto">
                              {[
                                  { v: "0.8s", l: "LCP SCORE", ic: "📱", sub: "Lighthouse 100", bg: "rgba(230,57,70,0.07)" },
                                  { v: "99.9%", l: "UPTIME SLA", ic: "🟢", sub: "Enterprise grade", bg: "rgba(255,142,60,0.07)" },
                                  { v: "140+", l: "EDGE NODES", ic: "🌐", sub: "Global CDN mesh", bg: "rgba(168,85,247,0.07)" },
                                  { v: "4.8M", l: "DAILY HITS", ic: "📈", sub: "Peak traffic handled", bg: "rgba(251,191,36,0.07)" }
                              ].map((m, i) => (
                                  <div key={i} style={{ background: m.bg }} className="p-6 border border-white/5 rounded-[25px] group hover:border-[#e63946]/30 transition-all">
                                      <div className="text-xl mb-2">{m.ic}</div>
                                      <div className="text-3xl font-black mb-2 group-hover:scale-110 transition-transform">{m.v}</div>
                                      <div className="text-[8px] font-black tracking-[0.4em] text-[#e63946] uppercase">{m.l}</div>
                                      <div className="text-[7px] text-slate-500 mt-1 font-bold uppercase">{m.sub}</div>
                                  </div>
                              ))}
                          </div>
                      </AdvancedSection>

                      {/* Section 04: Services */}
                      <AdvancedSection progress={smoothProgress} start={0.6} end={0.8}>
                          <h2 className="text-[#e63946] font-wide text-[9px] tracking-[0.6em] uppercase mb-12 font-black">Capabilities</h2>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                              {servicesData.map((s, i) => (
                                  <div key={i} style={{ background: s.color }} className="p-5 border border-white/5 flex flex-col items-center rounded-[24px] hover:border-[#e63946]/50 group transition-all">
                                      <div className="text-3xl mb-3 group-hover:rotate-12 transition-transform">{s.icon}</div>
                                      <h4 className="font-black text-[9px] tracking-widest uppercase text-white mb-1">{s.title}</h4>
                                      <p className="text-[7px] text-slate-500 font-bold uppercase leading-relaxed text-center">{s.desc}</p>
                                  </div>
                              ))}
                          </div>
                      </AdvancedSection>

                      {/* Section 05: Final */}
                      <AdvancedSection progress={smoothProgress} start={0.8} end={1.0} isLast={true}>
                          <h2 className="text-3xl md:text-6xl font-black mb-10 uppercase italic tracking-tighter leading-none">
                               VOID <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] to-[#ff8e3c]">INIT.</span>
                          </h2>
                          <p className="text-slate-500 text-sm max-w-md mx-auto mb-12 font-medium">Ready to deploy your enterprise vision into the void of the ordinary?</p>
                          <div className="flex flex-col items-center gap-10">
                              <div className="flex justify-center gap-10">
                                  <button onClick={() => setView('CONTACT')} className="px-16 py-6 bg-white text-black font-wide font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.05)]">DEPLOY PROTOCOL</button>
                              </div>
                              {/* VISIT AGAIN BUTTON - MEDIUM SCALE */}
                              <button 
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="group flex flex-col items-center gap-2 transition-all"
                              >
                                <div className="w-12 h-12 border border-[#e63946] rounded-full bg-[#e63946]/5 flex items-center justify-center group-hover:bg-[#e63946] group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(230,57,70,0.15)]">
                                    <span className="text-sm text-white rotate-[-90deg] block">➔</span>
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#e63946] group-hover:text-white transition-colors">Visit Again</span>
                              </button>
                          </div>
                      </AdvancedSection>

                  </motion.div>
              )}

              {view === 'PRICING' && (
                  <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center p-8 bg-[#020308]/95 backdrop-blur-3xl overflow-y-auto">
                       <div className="w-full max-w-4xl py-32">
                          <h2 className="text-3xl font-black mb-16 uppercase italic tracking-tighter">ELITE <span className="text-[#e63946]">VALUE.</span></h2>
                          <div className="grid gap-4">
                              {[
                                { t: "CORE FRAME", p: "₹18,999", d: "Standard high-fidelity portfolio." },
                                { t: "NEURAL NODE", p: "CUSTOM", d: "Advanced AI web applications." },
                                { t: "ENTERPRISE GRID", p: "QUOTE", d: "Scalable global architecture." }
                              ].map((p, i) => (
                                  <motion.div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[30px] flex items-center justify-between group hover:border-[#e63946]/50 transition-all cursor-pointer" onClick={() => window.open(`https://wa.me/918825802060`)}>
                                      <div className="text-left">
                                          <h3 className="text-2xl font-black uppercase group-hover:text-[#e63946] transition-colors tracking-tighter">{p.t}</h3>
                                          <p className="text-slate-500 mt-1 text-sm">{p.d}</p>
                                      </div>
                                      <div className="text-right">
                                          <div className="text-2xl font-black text-white mb-1">{p.p}</div>
                                          <div className="text-[9px] uppercase tracking-widest font-black text-[#e63946]">Initialize Plan</div>
                                      </div>
                                  </motion.div>
                              ))}
                          </div>
                       </div>
                  </motion.div>
              )}

              {view === 'CONTACT' && (
                  <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center p-8 bg-[#020308]/95 backdrop-blur-3xl">
                       <div className="text-center">
                           <h2 className="text-3xl md:text-6xl font-black mb-16 uppercase italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-tr from-[#ff8e3c] to-[#e63946]">SECURE <br/> LINK.</h2>
                           <div className="flex gap-8 justify-center">
                               <a href="https://wa.me/918825802060" className="p-12 border border-white/5 bg-white/[0.01] rounded-[40px] hover:border-[#e63946] transition-all group flex flex-col items-center">
                                   <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">💬</span>
                                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Wireless Protocol</span>
                               </a>
                               <a href="mailto:admin@upgradewithaifolks.com" className="p-12 border border-white/5 bg-white/[0.01] rounded-[40px] hover:border-[#e63946] transition-all group flex flex-col items-center">
                                   <span className="text-5xl mb-4 block group-hover:scale-110 transition-transform">📧</span>
                                   <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Secure Inquiry</span>
                               </a>
                           </div>
                       </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>

      {/* ── Metadata Overlay ── */}
      <div className="absolute bottom-12 left-16 flex items-center gap-10 z-[100] pointer-events-none opacity-40">
          <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">System.Active</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">ELITE v4.0.0</span>
      </div>
      </motion.div>
    </>
  );
}
