import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useTransform, useScroll } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial, ContactShadows, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import ExploreDropdown from './ExploreDropdown';

// ─── Isometric Dashboard Component ───
function IsometricUI({ scrollProgress }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sp = scrollProgress?.get() || 0;
    if (groupRef.current) {
      // Rotate and react to scroll
      groupRef.current.rotation.y = -Math.PI / 4 + sp * 2 + Math.sin(t * 0.2) * 0.05;
      groupRef.current.rotation.x = Math.PI / 6 + Math.cos(sp * 3) * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
      groupRef.current.position.z = sp * 10;
    }
  });

  return (
    <group ref={groupRef} scale={0.7} position={[0, -1, 0]}>
      {/* Main Base Board */}
      <RoundedBox args={[12, 0.4, 8]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="#1e1e2d" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Floating Panels */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <RoundedBox args={[5, 0.2, 3]} radius={0.1} position={[-2, 1, 1]}>
             <meshStandardMaterial color="#2d2d3f" emissive="#ff4d4d" emissiveIntensity={0.1} />
          </RoundedBox>
          <mesh position={[-3.5, 1.15, 1]}>
             <circleGeometry args={[0.2, 32]} />
             <meshBasicMaterial color="#ff4d4d" />
          </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
          <RoundedBox args={[4, 0.2, 4]} radius={0.1} position={[3, 2, -1]}>
             <meshStandardMaterial color="#252535" />
          </RoundedBox>
          <mesh position={[2, 2.7, -1]}>
             <boxGeometry args={[0.4, 3, 0.4]} />
             <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1} />
          </mesh>
          <mesh position={[2.8, 3.1, -1]}>
             <boxGeometry args={[0.4, 4, 0.4]} />
             <meshStandardMaterial color="#f472b6" emissive="#f472b6" emissiveIntensity={1} />
          </mesh>
          <mesh position={[3.6, 2.5, -1]}>
             <boxGeometry args={[0.4, 2.5, 0.4]} />
             <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={1} />
          </mesh>
          <mesh position={[4.4, 3.8, -1]}>
             <boxGeometry args={[0.4, 5, 0.4]} />
             <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={1} />
          </mesh>
      </Float>

      <Float speed={2.2} floatIntensity={1.2}>
          <mesh position={[1, 1.5, 2]}>
             <torusGeometry args={[1.5, 0.3, 32, 64]} />
             <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={0.5} />
          </mesh>
      </Float>

      {[...Array(6)].map((_, i) => (
          <Float key={i} speed={3} position={[(Math.random()-0.5)*10, Math.random()*4, (Math.random()-0.5)*6]}>
             <RoundedBox args={[0.4, 0.1, 0.4]} radius={0.05}>
                <meshStandardMaterial color="#ff4d4d" emissive="#ff4d4d" emissiveIntensity={0.5} />
             </RoundedBox>
          </Float>
      ))}
      <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={20} blur={3} far={10} color="#000" />
    </group>
  );
}

// ─── 3D Animatic Wrapper ──────────────────────────────────────────────────
function AnimaticSection({ children, progress, start, end }) {
  const duration = end - start;
  const p1 = start;
  const p2 = start + duration * 0.2; 
  const p3 = start + duration * 0.8; 
  const p4 = end;

  const opacity = useTransform(progress, [p1, p2, p3, p4], [0, 1, 1, 0]);
  const y = useTransform(progress, [p1, p2, p3, p4], ["60vh", "0vh", "0vh", "-60vh"]);
  const rotateX = useTransform(progress, [p1, p2, p3, p4], [45, 0, 0, -45]);
  const blur = useTransform(progress, [p1, p2, p3, p4], ["10px", "0px", "0px", "10px"]);

  return (
    <motion.div
      style={{ opacity, y, rotateX, filter: blur, transformStyle: "preserve-3d", perspective: 1200 }}
      className="absolute inset-0 flex items-center justify-center p-8 md:p-20 z-20 pointer-events-none"
    >
      <div className="w-full h-full pointer-events-auto flex flex-col lg:flex-row items-center">
        {children}
      </div>
    </motion.div>
  );
}

const pricingPlans = [
  { title: "STATIC WEBSITE / PORTFOLIO", price: "₹12,499 - ₹18,999", desc: "Domain, Premium Hosting, 5–8 Pages, Essential SEO, Ultra-Responsive UI, Built for Brand Credibility." },
  { title: "MEDIUM WEB APP / E-COMMERCE", price: "Custom Quote", desc: "Authentication, Content Management System, Database Architecting, Payment Integrations, Custom Admin Dashboards." },
  { title: "ADVANCED APP + A.I.", price: "Scope-based", desc: "Large Language Models Integration, Vector Databases, Retrieval-Augmented Generation (RAG), Complex Cloud Deployments." },
];

const servicesData = [
    { icon: '🌐', title: 'Web Development', desc: 'Modern, responsive websites built with cutting-edge tech.' },
    { icon: '📱', title: 'Mobile Apps', desc: 'Native and cross-platform applications for iOS and Android.' },
    { icon: '🤖', title: 'AI Integration', desc: 'Leverage AI to enhance user experiences and automate workflows.' },
    { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and robust deployment.' },
    { icon: '🔧', title: 'Custom Dev', desc: 'Tailored software solutions designed for specific business needs.' },
    { icon: '📊', title: 'Data Analytics', desc: 'Transform your data into actionable insights.' }
];

export default function PremiumTemplate({ view, setView, scrollYProgress, activeTemplate, setActiveTemplate }) {
  return (
    <div className="fixed inset-0 z-30 bg-[#12121e] text-white overflow-hidden font-sans flex items-center justify-center">
      
      {/* ── Background Glows ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-[#e63946]/10 blur-[150px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-[#e63946]/10 blur-[150px] rounded-full" />
      </div>

      {/* ── Inner Card View ── */}
      <div className="w-full h-full md:w-[95%] md:h-[92%] bg-[#0d0e1a] md:rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 relative overflow-hidden flex flex-col">
          
          <nav className="shrink-0 flex items-center justify-between px-8 md:px-12 py-6 z-50">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('ROAD')}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e63946] to-[#ff6b35] flex items-center justify-center shadow-[0_0_15px_rgba(230,57,70,0.4)]">
                    <span className="text-white font-black text-lg italic">U</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-wide font-black tracking-tight text-lg leading-none uppercase text-white">Upgrade <span className="text-[#e63946]">With AI</span></span>
                </div>
            </div>

            <div className="flex items-center gap-12">
                <div className="hidden lg:flex gap-10 text-[10px] font-black tracking-widest uppercase text-slate-400">
                    {['ROAD', 'PRICING', 'CONTACT'].map((item) => (
                        <div key={item} onClick={() => setView(item)} className={`cursor-pointer transition-all hover:text-white ${view === item ? 'text-[#e63946]' : ''}`}>
                            {item === 'ROAD' ? 'Home' : item === 'PRICING' ? 'Services' : 'Contact'}
                        </div>
                    ))}
                </div>
                <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
            </div>
          </nav>

          <div className="flex-1 relative z-10 overflow-hidden">
              <AnimatePresence mode="wait">
                  {view === 'ROAD' && (
                      <motion.div key="road" className="absolute inset-0">
                          
                          {/* ── Section 1: Hero (Text + Isometric) ── */}
                          <AnimaticSection progress={scrollYProgress} start={0} end={0.25}>
                              <div className="w-full lg:w-1/2 flex flex-col items-start px-4">
                                  <span className="text-slate-500 font-sans text-sm tracking-widest mb-6 block capitalize italic">High-Performance Web & Intelligent Solutions</span>
                                  <h1 className="text-5xl md:text-7xl font-wide font-black tracking-tighter leading-[1.05] mb-8">
                                      THE NEW ERA OF <br/>
                                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] to-[#ff6b35]">TECHNOLOGY.</span>
                                  </h1>
                                  <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed mb-12">
                                      At UpgradeWithAIFolks, we blend design, development, and AI to build products that solve real problems.
                                  </p>
                                  <div className="flex flex-wrap gap-6">
                                      <button onClick={() => setView('CONTACT')} className="px-10 py-4 bg-gradient-to-r from-[#e63946] to-[#ff6b35] text-white font-wide font-black text-xs tracking-widest uppercase rounded-xl shadow-[0_15px_35px_rgba(230,57,70,0.4)]">
                                          Partner With Us
                                      </button>
                                  </div>
                              </div>
                              <div className="w-full lg:w-1/2 h-full hidden lg:block">
                                  <Canvas dpr={[1, 2]}>
                                      <PerspectiveCamera makeDefault position={[12, 10, 12]} fov={40} />
                                      <ambientLight intensity={0.4} />
                                      <pointLight position={[10, 10, 10]} intensity={2} color="#e63946" />
                                      <pointLight position={[-10, 5, -5]} intensity={1} color="#60a5fa" />
                                      <IsometricUI scrollProgress={scrollYProgress} />
                                      <Environment preset="night" />
                                  </Canvas>
                              </div>
                          </AnimaticSection>

                          {/* ── Section 2: About (Content Centered) ── */}
                          <AnimaticSection progress={scrollYProgress} start={0.25} end={0.5}>
                              <div className="w-full max-w-4xl mx-auto text-left">
                                  <h2 className="text-[#e63946] font-wide text-[10px] tracking-[0.5em] uppercase mb-8">About Our Vision</h2>
                                  <p className="text-3xl md:text-5xl font-black mb-8 leading-tight">We build products that <span className="text-[#ff6b35]">solve real problems</span> with precision engineering.</p>
                                  <p className="text-slate-400 text-lg leading-relaxed mb-10">Founded in 2020 by a group of engineers and designers frustrated with bloated development cycles, we set out to create lean, intelligent solutions that launch quickly and iterate continuously. Every project we take on is backed by data, polished with craft, and aligned with business outcomes.</p>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
                                          <div className="text-3xl mb-4">⚡</div>
                                          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">Fast Flow</h4>
                                          <p className="text-slate-500 text-[10px]">Prototypes in under 30 days.</p>
                                      </div>
                                      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
                                          <div className="text-3xl mb-4">🤖</div>
                                          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">AI Driven</h4>
                                          <p className="text-slate-500 text-[10px]">Neural core integration.</p>
                                      </div>
                                      <div className="p-8 bg-white/5 border border-white/5 rounded-3xl">
                                          <div className="text-3xl mb-4">🎯</div>
                                          <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">User First</h4>
                                          <p className="text-slate-500 text-[10px]">Conversion optimized UX.</p>
                                      </div>
                                  </div>
                              </div>
                          </AnimaticSection>

                          {/* ── Section 3: Services (Grid) ── */}
                          <AnimaticSection progress={scrollYProgress} start={0.5} end={0.75}>
                              <div className="w-full">
                                  <h2 className="text-[#e63946] font-wide text-[10px] tracking-[0.5em] uppercase mb-12 text-center">Elite Architecture</h2>
                                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                      {servicesData.map((s, i) => (
                                          <div key={i} className="p-8 md:p-12 bg-white/[0.03] border border-white/5 rounded-[40px] hover:bg-[#e63946]/10 hover:border-[#e63946]/30 transition-all group">
                                              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                                              <h3 className="text-white font-wide font-black text-xs uppercase mb-3 tracking-widest">{s.title}</h3>
                                              <p className="text-slate-500 text-[10px] leading-relaxed italic">{s.desc}</p>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </AnimaticSection>

                          {/* ── Section 4: Approach + CTA ── */}
                          <AnimaticSection progress={scrollYProgress} start={0.75} end={1.0}>
                              <div className="w-full text-center">
                                  <h2 className="text-5xl md:text-8xl font-black mb-12 uppercase italic tracking-tighter">
                                      Horizon belongs to <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e63946] to-[#ff6b35]">those who invent it.</span>
                                  </h2>
                                  <div className="flex justify-center gap-8 mt-16">
                                      <button onClick={() => setView('PRICING')} className="px-12 py-5 bg-gradient-to-r from-[#e63946] to-[#ff6b35] text-white font-wide font-bold text-xs tracking-widest uppercase rounded-2xl shadow-2xl">View Tiers</button>
                                      <button onClick={() => setView('CONTACT')} className="px-12 py-5 border-2 border-white/10 text-white font-wide font-bold text-xs tracking-widest uppercase rounded-2xl hover:bg-white/5">Start Now</button>
                                  </div>
                              </div>
                          </AnimaticSection>

                      </motion.div>
                  )}

                  {view === 'PRICING' && (
                      <motion.div key="pricing" className="absolute inset-0 overflow-y-auto p-12 md:p-32 hide-scrollbar">
                           <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter">Modular <span className="text-[#e63946]">Services</span></h2>
                           <div className="space-y-4 max-w-5xl">
                               {pricingPlans.map((p, i) => (
                                   <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col md:flex-row justify-between items-center hover:bg-[#e63946]/5 transition-all cursor-pointer" onClick={() => window.open(`https://wa.me/918825802060`)}>
                                       <div className="md:w-2/3"><h3 className="text-2xl font-black text-white uppercase">{p.title}</h3><p className="text-slate-400 mt-4">{p.desc}</p></div>
                                       <div className="text-right"><div className="text-2xl font-bold text-[#e63946]">{p.price}</div></div>
                                   </div>
                               ))}
                           </div>
                      </motion.div>
                  )}

                  {view === 'CONTACT' && (
                      <motion.div key="contact" className="absolute inset-0 flex items-center justify-center p-8">
                           <div className="text-center">
                               <h2 className="text-5xl md:text-9xl font-black mb-16 uppercase italic">Initiate <span className="text-[#e63946]">Contact.</span></h2>
                               <div className="flex gap-8 justify-center">
                                   <a href="https://wa.me/918825802060" className="p-16 bg-white/[0.02] border border-white/10 rounded-[40px] hover:border-[#e63946] transition-all flex flex-col items-center">
                                       <span className="text-6xl mb-6">📱</span><span className="font-black tracking-widest uppercase">WhatsApp</span>
                                   </a>
                                   <a href="mailto:admin@upgradewithaifolks.com" className="p-16 bg-white/[0.02] border border-white/10 rounded-[40px] hover:border-[#e63946] transition-all flex flex-col items-center">
                                       <span className="text-6xl mb-6">📧</span><span className="font-black tracking-widest uppercase">Email RFP</span>
                                   </a>
                               </div>
                           </div>
                      </motion.div>
                  )}
              </AnimatePresence>
          </div>

          <div className="absolute bottom-10 right-10 flex gap-4">
              <a href="https://wa.me/918825802060" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs hover:bg-white/10">WA</a>
              <a href="mailto:admin@upgradewithaifolks.com" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs hover:bg-white/10">EM</a>
          </div>
      </div>
    </div>
  );
}
