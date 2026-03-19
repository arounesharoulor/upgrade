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
  Line
} from '@react-three/drei';
import * as THREE from 'three';
import ExploreDropdown from './ExploreDropdown';

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

function BusinessIntro({ onComplete }) {
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

      {/* Rising bar chart background */}
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
            <span key={i} className="text-[10px] font-black tracking-[0.3em] uppercase">
              <span className="text-slate-500">{item.label}</span>
              <span style={{ color: item.color }} className="ml-3">{item.val}</span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom ticker */}
      <motion.div
        className="absolute bottom-16 left-0 right-0 overflow-hidden z-20 border-y border-white/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 1 ? 0.4 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex gap-16 whitespace-nowrap py-3 px-8"
          animate={{ x: [-300, 300] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          {["ENTERPRISE READY", "ISO 27001", "SOC-2 COMPLIANT", "GDPR CERTIFIED", "AWS PARTNER", "99.9% SLA", "24/7 SUPPORT", "ZERO TRUST"].map((item, i) => (
            <span key={i} className="text-[9px] font-black tracking-[0.5em] uppercase text-white/20">
              {item}
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
            {/* Orbiting ring */}
            <motion.div
              className="absolute -inset-4 rounded-3xl border border-[#64ffda]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -inset-8 rounded-[28px] border border-[#48bfe3]/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            {/* Corner data points */}
            <motion.div className="absolute -top-2 -right-2 w-3 h-3 bg-[#64ffda] rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#48bfe3] rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
          </div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <h2 className="text-white font-wide font-black text-lg tracking-[0.8em] uppercase">Business</h2>
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#64ffda]" />
              <span className="text-[#64ffda] text-[8px] font-black tracking-[0.6em] uppercase">Command Center</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#64ffda]" />
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-72 mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                {phase === 0 ? 'Loading Assets' : phase === 1 ? 'Syncing Data' : 'Initializing UI'}
              </span>
              <span className="text-[8px] font-black text-[#64ffda] tracking-widest">{progress}%</span>
            </div>
            <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #64ffda, #48bfe3)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-3">
              {['Systems', 'Database', 'Analytics', 'Dashboard'].map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${progress > (i+1) * 25 ? 'bg-[#64ffda]' : 'bg-white/10'}`} />
                  <span className={`text-[7px] font-bold uppercase transition-colors duration-500 ${progress > (i+1) * 25 ? 'text-[#64ffda]' : 'text-white/20'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── 3D Background Scene ───

function BusinessScene({ scrollRef, view }) {
  const group = useRef();
  const sphereMatRef = useRef();
  const networkRef = useRef();

  // Generate fixed random points for the connected data network
  const { nodes, edges } = useMemo(() => {
    const points = [];
    for (let i = 0; i < 40; i++) {
        // distribute them in a wider sphere space around the center
        const r = 15 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        points.push(new THREE.Vector3(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi)
        ));
    }
    
    // Connect nodes that are close to each other
    const lines = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (points[i].distanceTo(points[j]) < 18) { // distance threshold for connection
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
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.1, 0.05);
      } else {
        if (sp < 0.2) {
          group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 0, 0.05);
          group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0, 0.05);
          group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.05);
          group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, 0.05);
        } else if (sp < 0.4) {
          group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, 8, 0.05);
        } else if (sp < 0.6) {
          group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -10, 0.05);
        } else if (sp < 0.8) {
          group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -Math.PI / 4, 0.05);
        } else {
          group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 40, 0.05);
        }
      }
    }

    if (sphereMatRef.current) {
      sphereMatRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.1;
    }
    if (networkRef.current) {
      networkRef.current.rotation.x = t * 0.05;
      networkRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[5, 64, 64]}>
          <MeshDistortMaterial ref={sphereMatRef} color="#112240" roughness={0.2} metalness={0.8} distort={0.4} />
        </Sphere>
      </Float>

      {/* Connected Data Network */}
      <group ref={networkRef}>
          {nodes.map((pos, i) => (
              <mesh key={`node-${i}`} position={pos}>
                  <icosahedronGeometry args={[0.3, 0]} />
                  <meshStandardMaterial color={THEME_COLOR} emissive={THEME_COLOR} emissiveIntensity={0.5} transparent opacity={0.6} />
              </mesh>
          ))}
          {edges.map((line, i) => (
              <Line 
                 key={`edge-${i}`}
                 points={line}
                 color={THEME_COLOR}
                 lineWidth={1}
                 transparent
                 opacity={0.15}
              />
          ))}
      </group>

      <Sparkles count={500} scale={[100, 100, 100]} size={2} speed={0.2} color={THEME_COLOR} />

      <Grid position={[0, -20, 0]} infiniteGrid fadeDistance={100} cellSize={1} sectionSize={5} sectionColor={THEME_COLOR} sectionThickness={1} />
    </group>
  );
}

function AdvancedSection({ children, progress, start, end, isLast = false }) {
  const duration = end - start;
  const p1 = start;
  const p2 = start + duration * 0.2;
  const p3 = start + duration * 0.8;
  const p4 = end;

  // Expanding dynamically from the core data network
  const opacity = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0, 1, 1, isLast ? 1 : 0]);
  const scale = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [0.01, 1, 1, isLast ? 1 : 1.5]);
  const rotateX = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [70, 0, 0, isLast ? 0 : -45]);
  const rotateZ = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [-30, 0, 0, isLast ? 0 : 30]);
  const y = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], ["0px", "0px", "0px", isLast ? "0px" : "-150px"]);
  const blur = useTransform(progress, [p1, p2, p3, isLast ? 1.05 : p4], [25, 0, 0, isLast ? 0 : 25]);
  const filterBlur = useTransform(blur, (v) => `blur(${v}px)`);

  // Simulated extraction beam logic
  const laserOpacity = useTransform(progress, [p1, p1 + (p2 - p1) * 0.5, p2], [0, 1, 0]);

  const pointerEvents = useTransform(progress, (v) => {
    if (isLast) return v >= start - 0.05 ? "auto" : "none";
    return (v >= start - 0.05 && v <= end + 0.05) ? "auto" : "none";
  });

  return (
    <motion.div
      style={{ opacity, scale, rotateX, rotateZ, y, filter: filterBlur, transformPerspective: 2000, pointerEvents, transformOrigin: 'center center' }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-16 text-center"
    >
      <motion.div 
         style={{ opacity: laserOpacity }}
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] rounded-full h-[600px] bg-gradient-to-t from-transparent via-[#64ffda] to-transparent shadow-[0_0_30px_#64ffda] pointer-events-none" 
      />
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───

export default function BusinessTemplate({ activeTemplate, setActiveTemplate }) {
  const [view, setView] = useState('ROAD');
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    // Force the internal scroll container back to the absolute top explicitly
    // to stop the browser from trying to remember scroll height when switching templates.
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
        {loading && <BusinessIntro onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-30 bg-[#020c1b] overflow-hidden font-sans text-white">

        {/* 3D Canvas Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 35]} fov={50} />
            <color attach="background" args={["#020c1b"]} />
            <fog attach="fog" args={["#020c1b", 20, 100]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color={THEME_COLOR} />
            <BusinessScene scrollRef={scrollContainerRef} view={view} />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* Top Header (Transparent, no bar) */}
        <nav className="absolute top-0 left-0 w-full z-[100] flex items-center justify-between px-6 py-6 md:px-16 md:py-8 pointer-events-auto mix-blend-screen">
          <div className="flex flex-col cursor-pointer z-50 group origin-left hover:scale-105 transition-all duration-500" onClick={() => { setView('ROAD'); scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <h1 className="font-wide text-lg md:text-3xl font-black tracking-tighter text-[#64ffda] drop-shadow-[0_0_15px_rgba(100,255,218,0.4)] whitespace-nowrap uppercase">
                  UPGRADE <span className="text-white">WITH</span><span className="text-white italic"> AI</span>
              </h1>
              <h2 className="text-[7px] md:text-[10px] font-sans tracking-[0.25em] md:tracking-[0.3em] mt-1 uppercase font-medium text-slate-400">
                  High-Performance Web & Intelligent Solutions
              </h2>
          </div>
          <div className="flex items-center gap-6 md:gap-10 z-[110]">
            <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
          </div>
        </nav>

        {/* Expandable Top Nav */}
        <div className="group fixed top-[80px] md:top-8 left-1/2 -translate-x-1/2 z-[150] flex items-center bg-[#020c1b]/80 backdrop-blur-xl rounded-full border border-[#64ffda]/30 pointer-events-auto shadow-[0_0_30px_rgba(100,255,218,0.1)] px-6 py-3 md:px-8 md:py-4 transition-all duration-500 hover:border-[#64ffda]/60 hover:bg-[#020c1b]/95">
          <div className="flex items-center gap-0 group-hover:gap-6 md:group-hover:gap-10 transition-all duration-500">
            {['ROAD', 'PRICING', 'CONTACT'].map((item) => {
              const isActive = view === item;
              const label = item === 'ROAD' ? 'ROOT' : item;
              return (
                <button 
                  key={item}
                  onClick={(e) => { 
                    e.stopPropagation();
                    setView(item); 
                    if(item === 'ROAD') scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }} 
                  className={`relative flex items-center justify-center transition-all duration-500 overflow-hidden ${isActive ? 'max-w-[120px] opacity-100 text-[#64ffda]' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100 hover:text-white text-slate-400'}`}
                >
                  <span className="whitespace-nowrap font-black tracking-[0.3em] md:tracking-[0.4em] text-[10px]">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10">
          <AnimatePresence mode="wait">
            {view === 'ROAD' && (
              <motion.div key="road" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                {/* Scrollable container */}
                <div ref={scrollContainerRef} className="absolute inset-0 overflow-y-auto hide-scrollbar">
                  {/* Tall spacer for scroll */}
                  <div className="h-[600vh] relative">
                    {/* Sticky viewport for sections */}
                    <div className="sticky top-0 h-screen w-full">

                      {/* SCROLL TO EXPLORE (0 - 0.15) */}
                      <AdvancedSection progress={smoothProgress} start={0} end={0.15}>
                        <div className="flex flex-col items-center justify-center pt-24">
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }} 
                             animate={{ opacity: 1, y: 0 }} 
                             transition={{ delay: 1, duration: 2 }}
                             className="text-[#64ffda]/80 font-wide font-black tracking-[0.4em] text-[10px] md:text-xs uppercase flex flex-col items-center"
                           >
                              <span className="mb-6  shadow-[#64ffda] drop-shadow-md">Scroll to explore</span>
                              <div className="w-[2px] h-24 bg-gradient-to-b from-[#64ffda] to-transparent animate-bounce"></div>
                           </motion.div>
                        </div>
                      </AdvancedSection>

                      {/* HERO (0.15 - 0.35) */}
                      <AdvancedSection progress={smoothProgress} start={0.15} end={0.35}>
                        <h2 className="text-[#64ffda] font-wide text-xs md:text-sm tracking-[0.6em] uppercase mb-8 font-black">Enterprise Command</h2>
                        <h1 className="text-white font-wide text-4xl md:text-6xl font-black mb-8 leading-[1.05] tracking-tighter uppercase italic">
                          BUILDING <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-[#48bfe3]">MARKET LEADERS</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10 font-medium">
                          We architect enterprise-grade digital solutions that scale with your ambition and dominate your market.
                        </p>
                        <button onClick={() => setView('CONTACT')} className="px-12 py-5 bg-[#64ffda] text-[#020c1b] font-wide font-black text-[10px] tracking-[0.2em] uppercase rounded-full hover:shadow-[0_0_30px_rgba(100,255,218,0.3)] transition-all duration-700">
                          START YOUR PROJECT
                        </button>
                      </AdvancedSection>

                      {/* ABOUT (0.35 - 0.55) */}
                      <AdvancedSection progress={smoothProgress} start={0.35} end={0.55}>
                        <h2 className="text-[#64ffda] font-wide text-xs md:text-sm tracking-[0.6em] uppercase mb-10 font-black">Who We Are</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
                          <div>
                            <p className="text-2xl md:text-4xl font-black mb-6 leading-[1.1] tracking-tighter uppercase italic text-white flex flex-col gap-2">
                              <span>From Concept</span>
                              <span className="text-[#48bfe3]">To Domination.</span>
                            </p>
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-4 font-medium">Founded in 2020, we evolved from a design studio into a full-scale digital engineering firm trusted by enterprises across 12 countries.</p>
                            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">Our team of 40+ engineers, designers & data scientists specializes in transforming complex business logic into elegant, high-performance digital products.</p>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {[
                              { t: "Rapid Prototyping", i: "🚀", d: "MVP in under 3 weeks with full CI/CD.", bg: "rgba(100,255,218,0.15)" },
                              { t: "Data-First", i: "📈", d: "Analytics-driven decisions & A/B testing.", bg: "rgba(72,191,227,0.15)" },
                              { t: "Enterprise Scale", i: "🏗️", d: "Microservices built for millions of users.", bg: "rgba(99,102,241,0.15)" },
                              { t: "24/7 Monitoring", i: "🛡️", d: "Real-time alerts & zero-downtime deploys.", bg: "rgba(45,212,191,0.15)" }
                            ].map((pillar, idx) => (
                              <div key={idx} style={{ background: pillar.bg }} className="border border-[#64ffda]/30 p-5 rounded-[20px] backdrop-blur-md flex items-center gap-5 group hover:border-[#48bfe3]/60 hover:bg-[#48bfe3]/10 transition-all shadow-[0_0_30px_rgba(100,255,218,0.05)]">
                                <div className="text-2xl group-hover:scale-110 transition-transform">{pillar.i}</div>
                                <div>
                                  <h4 className="text-xs font-black uppercase text-white tracking-widest">{pillar.t}</h4>
                                  <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">{pillar.d}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AdvancedSection>

                      {/* METRICS (0.55 - 0.75) */}
                      <AdvancedSection progress={smoothProgress} start={0.55} end={0.75}>
                        <h2 className="text-[#64ffda] font-wide text-xs md:text-sm tracking-[0.6em] uppercase mb-12 font-black">Impact Dashboard</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-4xl mx-auto">
                          {successMetrics.map((sm, i) => {
                            const colors = ['rgba(100,255,218,0.15)', 'rgba(250,204,21,0.15)', 'rgba(99,102,241,0.15)', 'rgba(45,212,191,0.15)'];
                            return (
                              <div key={i} style={{ background: colors[i] }} className="p-6 border border-[#64ffda]/30 rounded-[25px] group hover:border-[#64ffda]/60 hover:-translate-y-2 transition-all shadow-[0_0_40px_rgba(100,255,218,0.05)]">
                                <div className="text-2xl mb-2">{sm.icon}</div>
                                <div className="text-3xl font-black mb-2 text-white group-hover:scale-110 transition-transform">{sm.val}</div>
                                <div className="text-[10px] md:text-[11px] font-black tracking-[0.4em] text-[#64ffda] uppercase">{sm.label}</div>
                                <div className="text-[9px] text-slate-300 mt-2 font-bold uppercase">{sm.sub}</div>
                              </div>
                            );
                          })}
                        </div>
                      </AdvancedSection>

                      {/* SERVICES (0.75 - 0.9) */}
                      <AdvancedSection progress={smoothProgress} start={0.75} end={0.9}>
                        <h2 className="text-[#64ffda] font-wide text-xs md:text-sm tracking-[0.6em] uppercase mb-12 font-black">Service Arsenal</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mx-auto">
                          {services.map((s, i) => (
                            <div key={i} style={{ background: s.color.replace('0.06', '0.12') }} className="p-6 border border-white/20 flex flex-col items-center rounded-[24px] hover:border-[#64ffda]/60 group transition-all text-center">
                              <div className="text-3xl mb-4 group-hover:rotate-12 transition-transform">{s.icon}</div>
                              <h4 className="font-black text-xs md:text-sm tracking-widest uppercase text-white mb-2">{s.title}</h4>
                              <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed">{s.desc}</p>
                            </div>
                          ))}
                        </div>
                      </AdvancedSection>

                      {/* FINAL (0.9 - 1.0) */}
                      <AdvancedSection progress={smoothProgress} start={0.9} end={1.0} isLast={true}>
                        <h2 className="text-3xl md:text-6xl font-black mb-10 text-white uppercase italic tracking-tighter leading-none">
                          READY TO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-[#48bfe3]">DOMINATE?</span>
                        </h2>
                        <p className="text-slate-500 text-sm max-w-md mx-auto mb-12 font-medium">The future belongs to those who build it. Let's engineer your competitive advantage.</p>
                        <div className="flex flex-col items-center gap-10">
                          <button onClick={() => setView('CONTACT')} className="px-16 py-6 bg-white text-[#020c1b] font-wide font-black text-[10px] tracking-[0.3em] uppercase rounded-2xl hover:scale-105 transition-transform">LAUNCH PROJECT</button>
                          <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (scrollContainerRef.current) {
                                    scrollContainerRef.current.style.scrollBehavior = 'smooth';
                                    scrollContainerRef.current.scrollTop = 0;
                                    setTimeout(() => {
                                        if (scrollContainerRef.current) scrollContainerRef.current.style.scrollBehavior = 'auto';
                                    }, 1000);
                                }
                            }}
                            className="group flex flex-col items-center gap-2 transition-all relative z-[100]"
                          >
                            <div className="w-12 h-12 border border-[#64ffda] rounded-full bg-[#64ffda]/5 flex items-center justify-center group-hover:bg-[#64ffda] group-hover:scale-110 transition-all duration-500">
                              <span className="text-sm text-[#64ffda] rotate-[-90deg] group-hover:text-[#020c1b] transition-colors block">➔</span>
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#64ffda] group-hover:text-white transition-colors">Back To Top</span>
                          </button>
                        </div>
                      </AdvancedSection>

                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'PRICING' && (
              <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-start justify-center p-4 md:p-8 bg-[#020c1b]/50 backdrop-blur-md overflow-y-auto w-full hide-scrollbar">
                <div className="w-full max-w-4xl pt-32 md:pt-40 px-4 md:px-0 pb-32">
                  <h2 className="text-2xl md:text-3xl font-black mb-10 md:mb-16 uppercase italic tracking-tighter text-white">INVESTMENT <span className="text-[#64ffda]">TIERS.</span></h2>
                  <div className="grid gap-4">
                    {pricingPlans.map((p, i) => (
                      <motion.div key={i} className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[24px] md:rounded-[30px] flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-[#64ffda]/50 transition-all cursor-pointer gap-4 md:gap-0" onClick={() => window.open('https://wa.me/918825802060')}>
                        <div className="text-left">
                          <h3 className="text-xl md:text-2xl font-black uppercase text-white group-hover:text-[#64ffda] transition-colors tracking-tighter">{p.title}</h3>
                          <p className="text-slate-500 mt-1 text-xs md:text-sm">{p.desc}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-white mb-1">{p.price}</div>
                          <div className="text-[9px] uppercase tracking-widest font-black text-[#64ffda]">Get Started</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {view === 'CONTACT' && (
              <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-start justify-center p-4 md:p-8 bg-[#020c1b]/50 backdrop-blur-md overflow-y-auto w-full hide-scrollbar">
                <div className="text-center px-4 w-full pt-32 md:pt-40 pb-32">
                  <h2 className="text-3xl md:text-6xl font-black mb-10 md:mb-16 uppercase italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-tr from-[#64ffda] to-[#48bfe3]">LET'S <br /> CONNECT.</h2>
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center">
                    <a href="https://wa.me/918825802060" className="p-8 md:p-12 border border-white/5 bg-white/[0.01] rounded-[30px] md:rounded-[40px] hover:border-[#64ffda] transition-all group flex flex-col items-center">
                      <span className="text-4xl md:text-5xl mb-4 block group-hover:scale-110 transition-transform">💬</span>
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">WhatsApp Direct</span>
                    </a>
                    <a href="mailto:admin@upgradewithaifolks.com" className="p-8 md:p-12 border border-white/5 bg-white/[0.01] rounded-[30px] md:rounded-[40px] hover:border-[#64ffda] transition-all group flex flex-col items-center">
                      <span className="text-4xl md:text-5xl mb-4 block group-hover:scale-110 transition-transform">📧</span>
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Send Email</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Metadata Overlay */}
        <div className="absolute bottom-28 left-6 md:bottom-12 md:left-16 flex items-center gap-6 md:gap-10 z-[50] pointer-events-none opacity-40">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.5em]">Enterprise.Live</span>
          </div>
          <div className="w-[1px] h-4 bg-white/20" />
          <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] md:tracking-[0.5em] italic">CORP v4.2.0</span>
        </div>
      </motion.div>
    </>
  );
}
