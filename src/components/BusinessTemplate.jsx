import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence, useTransform, useScroll, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Environment, 
  MeshDistortMaterial, 
  Sparkles,
  Grid,
  Sphere,
  Line,
  Loader,
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh
} from '@react-three/drei';
import * as THREE from 'three';
import ExploreDropdown from './ExploreDropdown';
import useIsMobile from '../hooks/useIsMobile';

// ─── Theme Constants ───
const THEME_COLOR = "#64ffda";
const ACCENT_BLUE = "#48bfe3";

// ─── Data ───
const pricingPlans = [
  { title: "STARTER BLUEPRINT", price: "₹12,499 - ₹18,999", desc: "Static sites, portfolios, landing pages with SEO & responsive design.", tag: "🌱 Launch" },
  { title: "GROWTH ENGINE", price: "Custom Quote", desc: "E-commerce, dashboards, CMS, payment gateways & admin panels.", tag: "🚀 Scale" },
  { title: "SCALE PROTOCOL", price: "Scope-based", desc: "AI agents, LLM APIs, cloud-native microservices & enterprise SaaS.", tag: "🔥 Enterprise" },
];

const services = [
  { icon: '💻', title: 'SaaS Platforms', desc: 'Multi-tenant cloud applications with subscription billing, role-based access & real-time analytics.', color: 'rgba(100,255,218,0.06)' },
  { icon: '🛒', title: 'E-Commerce', desc: 'Complete online stores with Stripe/Razorpay, inventory management & automated order fulfillment.', color: 'rgba(72,191,227,0.06)' },
  { icon: '🔐', title: 'Cybersecurity', desc: 'Penetration testing, OWASP compliance, SOC-2 audits & zero-trust architecture implementation.', color: 'rgba(99,102,241,0.06)' },
  { icon: '⚙️', title: 'DevOps & CI/CD', desc: 'Docker, Kubernetes, GitHub Actions pipelines with automated testing & blue-green deployments.', color: 'rgba(34,211,238,0.06)' },
  { icon: '🧬', title: 'Blockchain', desc: 'Solidity smart contracts, DeFi protocols, NFT marketplaces & tokenized asset platforms.', color: 'rgba(139,92,246,0.06)' },
  { icon: '📡', title: 'IoT Systems', desc: 'Connected device networks, MQTT protocols, edge computing & real-time telemetry dashboards.', color: 'rgba(45,212,191,0.06)' }
];

const successMetrics = [
  { val: "200+", label: "Clients Served", icon: "🏢", sub: "Across 12 countries" },
  { val: "98%", label: "Satisfaction Rate", icon: "⭐", sub: "Based on 500+ reviews" },
  { val: "50+", label: "Enterprise Deals", icon: "🤝", sub: "Fortune 500 partners" },
  { val: "3.2M", label: "Users Impacted", icon: "🌍", sub: "Monthly active users" }
];

// ─── Corporate Data Intro Animation ───

function BusinessIntro({ onComplete, isMobile }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0); // 0=bars, 1=metrics, 2=reveal

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 60);

    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(onComplete, 3800);
    return () => { clearInterval(interval); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const barHeights = [65, 40, 85, 55, 72, 48, 90, 60, 78, 45, 88, 52, 70, 82, 58, 95, 42, 75, 68, 50];
  const tickerItems = [
    { label: "REVENUE", val: "+34.2%", color: "#64ffda" },
    { label: "USERS", val: "3.2M", color: "#48bfe3" },
    { label: "UPTIME", val: "99.9%", color: "#64ffda" },
    { label: "GROWTH", val: "+127%", color: "#48bfe3" },
    { label: "NODES", val: "140+", color: "#64ffda" },
    { label: "LATENCY", val: "12ms", color: "#48bfe3" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[1000] bg-[#020c1b] flex items-center justify-center overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `linear-gradient(rgba(100,255,218,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(100,255,218,0.03) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] z-10"
        style={{ background: 'linear-gradient(90deg, transparent, #64ffda, transparent)' }}
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Rising bar chart background - Hidden on mobile for smoothness */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-[40vh] flex items-end justify-center gap-[6px] px-16 z-0 opacity-20">
          {barHeights.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ background: `linear-gradient(to top, transparent, ${i % 2 === 0 ? '#64ffda' : '#48bfe3'})` }}
              initial={{ height: 0 }}
              animate={{ height: `${h * (progress / 100)}%` }}
              transition={{ duration: 1.2, delay: i * 0.05, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      {/* Ticker strip */}
      <motion.div
        className="absolute top-16 left-0 right-0 overflow-hidden z-20 border-y border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex gap-16 whitespace-nowrap py-3 px-8"
          animate={{ x: [0, -600] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-[10px] font-wide font-bold tracking-[0.3em] uppercase">
              <span className="text-slate-500">{item.label}</span>
              <span style={{ color: item.color }} className="ml-3">{item.val}</span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Center content */}
      <div className="relative z-30 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
        >
          {/* Briefcase icon with data ring */}
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-2xl flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #0a192f, #112240)' }}
              animate={{ boxShadow: ['0 0 40px rgba(100,255,218,0.1)', '0 0 80px rgba(100,255,218,0.25)', '0 0 40px rgba(100,255,218,0.1)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-5xl">💼</span>
            </motion.div>
            <motion.div
              className="absolute -inset-4 rounded-3xl border border-[#64ffda]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <h2 className="text-white font-wide font-bold text-lg tracking-[0.8em] uppercase">Business</h2>
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#64ffda]" />
              <span className="text-[#64ffda] text-[8px] font-wide font-bold tracking-[0.6em] uppercase">Command Center</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#64ffda]" />
            </div>
          </motion.div>

          <div className="w-72 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-wide font-bold text-slate-500 uppercase tracking-widest">
                {phase === 0 ? 'Loading Assets' : phase === 1 ? 'Syncing Data' : 'Initializing UI'}
              </span>
              <span className="text-[8px] font-wide font-bold text-[#64ffda] tracking-widest">{progress}%</span>
            </div>
            <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #64ffda, #48bfe3)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── 3D Background Scene ───

function BusinessScene({ scrollRef, view, isMobile }) {
  const group = useRef();
  const sphereMatRef = useRef();
  const networkRef = useRef();

  const { nodes, edges } = useMemo(() => {
    const points = [];
    const count = isMobile ? 15 : 40;
    for (let i = 0; i < count; i++) {
        const r = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        points.push(new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)));
    }
    const lines = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].distanceTo(points[j]) < 18) {
                lines.push([points[i], points[j]]);
            }
        }
    }
    return { nodes: points, edges: lines };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const el = scrollRef?.current;
    const sp = el ? el.scrollTop / Math.max(el.scrollHeight - el.clientHeight, 1) : 0;

    if (group.current) {
      group.current.rotation.y = t * 0.05;
      if (view !== 'ROAD') {
        group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, 0.05);
        group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 4, 0.05);
        group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -15, 0.05);
      } else {
        if (sp < 0.2) {
          group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, 0.05);
          group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.05);
          group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.05);
        } else if (sp < 0.4) {
          group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 8, 0.05);
        } else if (sp < 0.6) {
          group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -10, 0.05);
        } else {
          group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 40, 0.05);
        }
      }
    }
    if (sphereMatRef.current) sphereMatRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.1;
    if (networkRef.current) {
      networkRef.current.rotation.x = t * 0.05;
      networkRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <sphereGeometry args={[5, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
          {isMobile ? (
            <meshStandardMaterial color="#112240" roughness={0.2} metalness={0.8} polygonOffset polygonOffsetFactor={-1} />
          ) : (
            <MeshDistortMaterial ref={sphereMatRef} color="#112240" roughness={0.2} metalness={0.8} distort={0.4} polygonOffset polygonOffsetFactor={-1} />
          )}
        </mesh>
      </Float>
      <group ref={networkRef}>
          {nodes.map((pos, i) => (
              <mesh key={`node-${i}`} position={pos}>
                  <icosahedronGeometry args={[0.3, 0]} />
                  <meshStandardMaterial color={THEME_COLOR} emissive={THEME_COLOR} emissiveIntensity={0.5} transparent opacity={0.6} />
              </mesh>
          ))}
          {edges.map((line, i) => (
              <Line key={`edge-${i}`} points={line} color={THEME_COLOR} lineWidth={1} transparent opacity={0.15} />
          ))}
      </group>
      <Sparkles count={isMobile ? 150 : 500} scale={[100, 100, 100]} size={2} speed={0.2} color={THEME_COLOR} />
      <Grid position={[0, -20, 0]} infiniteGrid fadeDistance={100} cellSize={1} sectionSize={5} sectionColor={THEME_COLOR} sectionThickness={1} />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </group>
  );
}

function AdvancedSection({ children, progress, start, end, isMobile, isLast = false }) {
  const duration = end - start;
  const p1 = start;
  const p2 = start + duration * 0.2;
  const p3 = start + duration * 0.8;
  const p4 = end;

  const opacity = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0, 1, 1, isLast ? 1 : 0]);
  const scale = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0.01, 1, 1, isLast ? 1 : 1.5]);
  const rotateX = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [70, 0, 0, isLast ? 0 : -45]);
  const y = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], ["0px", "0px", "0px", isLast ? "0px" : "-150px"]);
  const blurValue = isMobile ? 0 : 25;
  const blur = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [blurValue, 0, 0, isLast ? 0 : blurValue]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  const pointerEvents = useTransform(progress, (v) => {
    if (isLast) return v >= start - 0.05 ? "auto" : "none";
    return (v >= start - 0.05 && v <= end + 0.05) ? "auto" : "none";
  });

  return (
    <motion.div
      style={{ opacity, scale, rotateX, y, filter: filterBlur, transformPerspective: 2000, pointerEvents, transformOrigin: 'center center' }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-16 text-center"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10 overflow-y-auto max-h-[80vh] hide-scrollbar p-6">
        {children}
      </div>
    </motion.div>
  );
}

export default function BusinessTemplate({ activeTemplate, setActiveTemplate, view, setView }) {
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (scrollContainerRef.current) {
        setTimeout(() => {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
            scrollContainerRef.current.dispatchEvent(new Event('scroll'));
        }, 10);
    }
  }, [view, activeTemplate]);

  return (
    <>
      <AnimatePresence>
        {loading && <BusinessIntro onComplete={() => setLoading(false)} isMobile={isMobile} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-[#020c1b] overflow-hidden font-sans text-white">
        
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <Canvas dpr={isMobile ? [1, 1] : [1, 2]} gl={{ antialias: false, powerPreference: "high-performance" }}>
            <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
            <color attach="background" args={["#020c1b"]} />
            <fog attach="fog" args={["#020c1b", 20, 100]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color={THEME_COLOR} />
            <React.Suspense fallback={null}>
              <Bvh firstHitOnly>
                <BusinessScene scrollRef={scrollContainerRef} view={view} isMobile={isMobile} />
              </Bvh>
            </React.Suspense>
            <Environment preset="city" />
          </Canvas>
          <Loader 
             dataInterpolation={(p) => `BUSINESS SYSTEM LOAD… ${p.toFixed(0)}%`}
             containerStyles={{ background: '#020c1b' }}
             innerStyles={{ backgroundColor: '#1e293b' }}
             barStyles={{ backgroundColor: '#64ffda' }}
          />
        </div>

        {isMobile && <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#020c1b] via-[#05162d] to-[#0a192f]" />}

        <nav className="fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 py-6 md:px-12 md:py-10 pointer-events-none">
          <div className="flex flex-col cursor-pointer z-50 group origin-left hover:scale-105 transition-all duration-500 pointer-events-auto" onClick={() => { setView('ROAD'); scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <h1 className="font-wide text-lg md:text-2xl lg:text-3xl font-bold tracking-tighter text-white drop-shadow-sm whitespace-nowrap uppercase">
                  UPGRADE WITH<span className="text-[#64ffda] italic"> AI</span>
              </h1>
              <h2 className="text-[7px] md:text-[10px] font-sans tracking-[0.25em] md:tracking-[0.3em] mt-1 uppercase font-medium text-slate-400">
                  High-Performance Web & Intelligent Solutions
              </h2>
          </div>
          <div className="flex items-center gap-6 md:gap-10 z-[110] pointer-events-auto">
            <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
          </div>
        </nav>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:top-10 md:bottom-auto z-[150] flex gap-5 md:gap-10 bg-[#020c1b]/80 backdrop-blur-xl px-6 py-4 md:px-8 md:py-4 rounded-full border border-[#64ffda]/20 pointer-events-auto text-white text-[10px] md:text-xs font-wide font-bold tracking-[0.2em] uppercase min-w-max shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <button onClick={() => { setView('ROAD'); scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`hover:text-[#64ffda] transition-colors flex-shrink-0 ${view === 'ROAD' ? 'text-[#64ffda]' : ''}`}>ROOT</button>
          <button onClick={() => setView('PRICING')} className={`hover:text-[#64ffda] transition-colors flex-shrink-0 ${view === 'PRICING' ? 'text-[#64ffda]' : ''}`}>PRICING</button>
          <button onClick={() => setView('CONTACT')} className={`hover:text-[#64ffda] transition-colors flex-shrink-0 ${view === 'CONTACT' ? 'text-[#64ffda]' : ''}`}>CONTACT</button>
        </div>

        <div className="absolute inset-0 z-10">
          <AnimatePresence mode="wait">
            {view === 'ROAD' && (
              <motion.div key="road" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto hide-scrollbar">
                  <div className="h-[600vh] relative">
                    <div className="sticky top-0 h-screen w-full">

                      <AdvancedSection progress={smoothProgress} start={0} end={0.15} isMobile={isMobile}>
                        <div className="flex flex-col items-center justify-center">
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 2 }} className="text-[#64ffda]/80 font-wide font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase flex flex-col items-center">
                              <span className="mb-6">Scroll to explore</span>
                              <div className="w-[2px] h-24 bg-gradient-to-b from-[#64ffda] to-transparent animate-bounce"></div>
                           </motion.div>
                        </div>
                      </AdvancedSection>

                      <AdvancedSection progress={smoothProgress} start={0.15} end={0.35} isMobile={isMobile}>
                        <span className="text-[#64ffda] font-wide text-[10px] md:text-xs tracking-[0.4em] uppercase mb-8 block font-bold">Enterprise Command</span>
                        <h1 className="text-white font-wide text-lg md:text-2xl lg:text-3xl font-bold mb-8 leading-tight tracking-tighter uppercase italic">
                          BUILDING <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-[#48bfe3]">MARKET LEADERS</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10 font-sans font-medium">
                          We architect enterprise-grade digital solutions that scale with your ambition and dominate your market.
                        </p>
                        <button onClick={() => setView('CONTACT')} className="px-12 py-5 bg-[#64ffda] text-[#020c1b] font-wide font-bold text-[10px] tracking-[0.2em] uppercase rounded-full hover:shadow-[0_0_30px_rgba(100,255,218,0.3)] transition-all duration-700">
                          START PROJECT
                        </button>
                      </AdvancedSection>

                      <AdvancedSection progress={smoothProgress} start={0.35} end={0.55} isMobile={isMobile}>
                        <span className="text-[#64ffda] font-wide text-[10px] md:text-xs tracking-[0.4em] uppercase mb-10 block font-bold">Who We Are</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                          <div>
                            <p className="text-xl md:text-2xl lg:text-3xl font-wide font-bold mb-6 leading-tight tracking-tighter uppercase italic text-white flex flex-col gap-2">
                              <span>From Concept</span> <span className="text-[#48bfe3]">To Domination.</span>
                            </p>
                            <p className="text-slate-300 text-sm md:text-base font-sans leading-relaxed mb-4">Founded in 2020, we evolved from a design studio into a full-scale digital engineering firm trusted globally.</p>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {[{ t: "Rapid Prototyping", i: "🚀", d: "MVP in under 3 weeks.", bg: "rgba(100,255,218,0.15)" }, { t: "Data-First", i: "📈", d: "Analytics-driven decisions.", bg: "rgba(72,191,227,0.15)" }].map((pillar, idx) => (
                              <div key={idx} style={{ background: pillar.bg }} className="border border-[#64ffda]/30 p-5 rounded-[20px] backdrop-blur-md flex items-center gap-5 group transition-all">
                                <div className="text-2xl">{pillar.i}</div>
                                <div>
                                  <h4 className="text-[10px] font-wide font-bold uppercase text-white tracking-widest">{pillar.t}</h4>
                                  <p className="text-[9px] text-slate-300 font-sans font-bold uppercase mt-1">{pillar.d}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AdvancedSection>

                      <AdvancedSection progress={smoothProgress} start={0.55} end={0.75} isMobile={isMobile}>
                        <h2 className="text-[#64ffda] font-wide text-[10px] md:text-xs tracking-[0.4em] uppercase mb-12 font-bold">Impact Dashboard</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-4xl mx-auto">
                          {successMetrics.map((sm, i) => (
                            <div key={i} className="p-6 border border-[#64ffda]/30 rounded-[25px] bg-white/[0.03] group transition-all">
                              <div className="text-2xl mb-2">{sm.icon}</div>
                              <div className="text-xl md:text-2xl lg:text-3xl font-wide font-bold mb-2 text-white">{sm.val}</div>
                              <div className="text-[9px] font-wide font-bold tracking-[0.2em] text-[#64ffda] uppercase">{sm.label}</div>
                            </div>
                          ))}
                        </div>
                      </AdvancedSection>

                      <AdvancedSection progress={smoothProgress} start={0.75} end={0.9} isMobile={isMobile}>
                        <h2 className="text-[#64ffda] font-wide text-[10px] md:text-xs tracking-[0.4em] uppercase mb-12 font-bold">Service Arsenal</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                          {services.map((s, i) => (
                            <div key={i} style={{ background: s.color.replace('0.06', '0.12') }} className="p-6 border border-white/20 flex flex-col items-center rounded-[24px] group transition-all text-center">
                              <div className="text-3xl mb-4">{s.icon}</div>
                              <h4 className="font-wide font-bold text-[10px] md:text-xs tracking-widest uppercase text-white mb-2">{s.title}</h4>
                              <p className="text-[9px] text-slate-300 font-sans font-bold uppercase leading-relaxed">{s.desc}</p>
                            </div>
                          ))}
                        </div>
                      </AdvancedSection>

                      <AdvancedSection progress={smoothProgress} start={0.9} end={1.0} isMobile={isMobile} isLast={true}>
                        <h1 className="text-lg md:text-2xl lg:text-3xl font-wide font-bold mb-10 text-white uppercase italic tracking-tighter leading-none">
                          READY TO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-[#48bfe3]">DOMINATE?</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-sans max-w-md mx-auto mb-12 font-medium">The future belongs to those who build it. Let's engineer your competitive advantage.</p>
                        <div className="flex flex-col items-center gap-10 mt-4">
                          <div className="flex justify-center gap-10">
                            <button onClick={() => setView('CONTACT')} className="px-16 py-6 bg-white text-[#020c1b] font-wide font-bold text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] cursor-pointer">LAUNCH PROJECT</button>
                          </div>
                          {/* VISIT AGAIN BUTTON */}
                          <button 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="group flex flex-col items-center gap-2 transition-all relative z-[100]"
                          >
                            <div className="w-12 h-12 border border-[#64ffda] rounded-full bg-[#64ffda]/5 flex items-center justify-center group-hover:bg-[#64ffda] group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(100,255,218,0.15)] group-hover:shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                                <span className="text-sm text-white rotate-[-90deg] block group-hover:text-[#020c1b] transition-colors">➔</span>
                            </div>
                            <span className="text-[10px] font-wide font-bold uppercase tracking-[0.4em] text-[#64ffda] group-hover:text-white transition-colors">Visit Again</span>
                          </button>
                        </div>
                      </AdvancedSection>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'PRICING' && (
                <motion.div 
                    key="pricing"
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 z-50 w-full h-full flex flex-col pointer-events-auto pt-32 md:pt-40 px-6 md:px-12 pb-24 overflow-y-auto hide-scrollbar bg-[#020c1b]/60 backdrop-blur-md items-center"
                >
                  <div className="w-full max-w-6xl">
                    <div className="mb-8 md:mb-10 w-full">
                        <h3 className="text-[#64ffda] font-wide font-bold text-lg md:text-2xl lg:text-3xl mb-4 tracking-tighter uppercase italic">MODULAR PRICING TIERS</h3>
                        <p className="text-sm md:text-base font-sans text-slate-300 max-w-4xl leading-relaxed font-medium">
                            Whether you need a high-impact presence or a massive database-driven platform intertwined with an enterprise LLM, we deliver uncompromising quality at fair prices. Every plan is meticulously engineered and includes post-launch technical support.
                        </p>
                    </div>

                    <div className="border-t border-white/20 mb-12">
                        {pricingPlans.map((p, i) => (
                            <div key={i} onClick={() => window.open(`https://wa.me/918825802060?text=I'm%20interested%20in%20estimating%20the%20${encodeURIComponent(p.title)}`, '_blank')} className="py-8 border-b border-white/20 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-white/5 transition duration-300 cursor-pointer group px-4 rounded-xl">
                                <div className="flex flex-col md:w-[70%]">
                                    <span className="font-wide font-bold text-lg md:text-xl lg:text-2xl group-hover:pl-4 transition-all duration-300 group-hover:text-[#64ffda] text-white uppercase italic tracking-tighter">{p.title}</span>
                                    <span className="text-sm font-sans text-slate-400 mt-2 leading-relaxed font-medium">{p.desc}</span>
                                </div>
                                <span className="font-wide font-bold text-base md:text-lg lg:text-xl mt-4 md:mt-0 text-[#64ffda] md:text-right whitespace-nowrap">{p.price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-sans">
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-[#64ffda]/20 shadow-xl group hover:border-[#64ffda]/50 transition-colors">
                            <strong className="block text-white mb-2 text-base font-wide">TECH STACK</strong>
                            <span className="text-slate-300">We exclusively deploy on modern, highly-scalable stacks including Next.js, React, Node.js, Python, PostgreSQL, and Vercel/AWS infrastructures.</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-[#64ffda]/20 shadow-xl group hover:border-[#64ffda]/50 transition-colors">
                            <strong className="block text-white mb-2 text-base font-wide">DELIVERY TIMES</strong>
                            <span className="text-slate-300">Static builds typically launch within 1–2 weeks. Bespoke web applications and AI tools map dynamically based on functional complexity constraints.</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-[#64ffda]/20 shadow-xl group hover:border-[#64ffda]/50 transition-colors">
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
                    className="absolute inset-0 z-50 w-full h-full flex flex-col pointer-events-auto pt-32 md:pt-40 px-6 md:px-12 pb-24 overflow-y-auto hide-scrollbar bg-[#020c1b]/60 backdrop-blur-md items-center"
                >
                  <div className="w-full max-w-5xl flex flex-col items-center">
                    <div className="text-center w-full mb-10 md:mb-12">
                        <h3 className="text-[#64ffda] font-wide font-bold text-lg md:text-2xl lg:text-3xl tracking-tighter mb-6 uppercase italic">INITIATE CONTACT</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-200 font-sans font-medium">
                        Ready to disrupt your industry vertical? Reach out to our engineering team to construct your next <span className="text-[#64ffda] font-bold">game-changing application.</span>
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
                        <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-[#64ffda]/20 flex flex-col items-center justify-center hover:bg-[#64ffda]/5 transition-colors text-center w-full shadow-[0_0_30px_rgba(100,255,218,0.05)]">
                            <h4 className="font-wide font-bold text-xl mb-3 tracking-widest text-[#64ffda]">DIRECT LINE</h4>
                            <p className="font-sans text-slate-300 text-base mb-8 max-w-[280px]">The absolute fastest method for acquiring rough project estimations. Available for rapid brainstorming logic and high-level consultation.</p>
                            <a href="https://wa.me/918825802060" target="_blank" rel="noreferrer" className="w-full py-5 bg-[#64ffda]/10 text-[#64ffda] rounded-full font-wide font-bold text-sm hover:bg-[#64ffda] hover:text-[#020c1b] transition-all duration-300 tracking-widest shadow-xl border border-[#64ffda]/30 hover:shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                            WHATSAPP / +918825802060
                            </a>
                        </div>
                        <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-[#64ffda]/20 flex flex-col items-center justify-center hover:bg-[#64ffda]/5 transition-colors text-center w-full shadow-[0_0_30px_rgba(100,255,218,0.05)]">
                            <div className="text-5xl mb-6">📧</div>
                            <h4 className="font-wide font-bold text-xl mb-3 tracking-widest text-[#64ffda]">BUSINESS INQUIRY</h4>
                            <p className="font-sans text-slate-300 text-base mb-8 max-w-[280px]">Transmit your formal Request for Proposal (RFP) or deep technical scope details. Expect a clinically detailed response within 24 hours.</p>
                            <a href="mailto:admin@upgradewithaifolks.com" className="w-full py-5 border-2 border-[#64ffda]/30 text-[#64ffda] bg-transparent rounded-full font-wide font-bold text-[11px] hover:bg-[#64ffda] hover:border-[#64ffda] hover:text-[#020c1b] transition-all duration-300 tracking-[0.2em] overflow-hidden whitespace-nowrap shadow-xl hover:shadow-[0_0_30px_rgba(100,255,218,0.3)]">
                            ADMIN@UPGRADEWITHAIFOLKS.COM
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm font-sans text-slate-200 w-full max-w-4xl pt-8 border-t border-[#64ffda]/20">
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

        <div className="absolute bottom-24 left-6 md:bottom-12 md:left-16 flex items-center gap-6 md:gap-10 z-[50] pointer-events-none opacity-40">
          <div className="flex items-center gap-2 md:gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-wide font-bold uppercase tracking-[0.5em]">System.Active</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-[8px] md:text-[10px] font-wide font-bold uppercase tracking-[0.5em] italic">CORP v2.1.0</span>
        </div>
      </motion.div>
    </>
  );
}
