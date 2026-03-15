import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import ExploreDropdown from './ExploreDropdown';

// ─── Color palette for Business ───────────────────────────────────────────
// Deep Corporate Blue: #0a192f
// Accents: #64ffda (Cyan), #ccd6f6 (Light Blue/Silver)
// Background: #020c1b

const pricingPlans = [
  { 
    title: "STATIC WEBSITE / PORTFOLIO", 
    price: "₹12,499 - ₹18,999", 
    desc: "Domain, Premium Hosting, 5–8 Pages, Essential SEO, Ultra-Responsive UI, Built for Brand Credibility."
  },
  { 
    title: "MEDIUM WEB APP / E-COMMERCE", 
    price: "Custom Quote", 
    desc: "Authentication, Content Management System, Database Architecting, Payment Integrations, Custom Admin Dashboards." 
  },
  { 
    title: "ADVANCED APP + A.I.", 
    price: "Scope-based", 
    desc: "Large Language Models Integration, Vector Databases, Retrieval-Augmented Generation (RAG), Complex Cloud Deployments." 
  },
];

const services = [
    { icon: '🌐', title: 'Web Development', desc: 'Modern, responsive websites built with cutting-edge tech.' },
    { icon: '📱', title: 'Mobile Apps', desc: 'Native and cross-platform applications for iOS and Android.' },
    { icon: '🤖', title: 'AI Integration', desc: 'Leverage AI to enhance user experiences and automate workflows.' },
    { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and robust deployment.' },
    { icon: '🔧', title: 'Custom Dev', desc: 'Tailored software solutions designed for specific business needs.' },
    { icon: '📊', title: 'Data Analytics', desc: 'Transform your data into actionable insights.' }
];

function BusinessScene({ scrollProgress }) {
  const groupRef = useRef();
  const sphereRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const sp = scrollProgress.current || 0;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, -sp * 15, 0.05);
    }
    
    if (sphereRef.current) {
      sphereRef.current.distort = 0.3 + Math.sin(t * 0.5) * 0.1;
    }

    state.camera.position.x = Math.sin(t * 0.2) * 2;
    state.camera.position.y = 2 + Math.cos(t * 0.15) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#64ffda" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#48bfe3" />
      
      <group ref={groupRef}>
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
           <Sphere ref={sphereRef} args={[4, 64, 64]} position={[0, 0, 0]}>
             <MeshDistortMaterial
               color="#112240"
               roughness={0.1}
               metalness={1}
               distort={0.4}
               speed={2}
             />
           </Sphere>
        </Float>
        
        {[...Array(20)].map((_, i) => (
          <Float key={i} speed={1 + Math.random()} position={[(Math.random()-0.5)*30, (Math.random()-0.5)*30, (Math.random()-0.5)*30]}>
            <mesh>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#64ffda" emissive="#64ffda" emissiveIntensity={0.5} wireframe />
            </mesh>
          </Float>
        ))}
      </group>

      <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={40} blur={2} far={20} />
      <Environment preset="city" />
    </>
  );
}

function RevealSection({ children, className = '' }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  return (
    <motion.div ref={ref} style={{ opacity, scale }} className={className}>
      {children}
    </motion.div>
  );
}

export default function BusinessTemplate({ activeTemplate, setActiveTemplate }) {
  const [view, setView] = useState('ROAD');
  const containerRef = useRef();
  const scrollProgress = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleScroll = () => {
      scrollProgress.current = el.scrollTop / (el.scrollHeight - el.clientHeight);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-30 overflow-hidden"
      style={{ background: '#020c1b' }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 2, 15], fov: 50 }}>
          <BusinessScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <div ref={containerRef} className="absolute inset-0 z-10 overflow-y-auto hide-scrollbar">
        {/* Nav */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-6 bg-[#020c1b]/80 backdrop-blur-xl border-b border-[#64ffda]/10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('ROAD')}>
            <div className="w-8 h-8 bg-[#64ffda] rounded flex items-center justify-center font-bold text-[#020c1b]">B</div>
            <span className="font-sans font-bold text-white tracking-widest text-sm uppercase">Business Elite</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-8 text-[#ccd6f6] text-xs font-bold tracking-widest uppercase">
              <div onClick={() => setView('ROAD')} className={`cursor-pointer hover:text-[#64ffda] ${view === 'ROAD' ? 'text-[#64ffda]' : ''}`}>Work</div>
              <div onClick={() => setView('PRICING')} className={`cursor-pointer hover:text-[#64ffda] ${view === 'PRICING' ? 'text-[#64ffda]' : ''}`}>Pricing</div>
              <div onClick={() => setView('CONTACT')} className={`cursor-pointer hover:text-[#64ffda] ${view === 'CONTACT' ? 'text-[#64ffda]' : ''}`}>Contact</div>
            </div>
            <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {view === 'ROAD' && (
            <motion.div key="road" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Hero */}
              <section className="min-h-screen flex items-center px-8 md:px-24">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="max-w-2xl">
                  <h1 className="text-[#64ffda] font-sans text-sm tracking-[0.3em] font-bold uppercase mb-6">Empowering Enterprise</h1>
                  <h2 className="text-white font-wide text-5xl md:text-7xl font-black mb-8 leading-tight">
                    Architecture for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#64ffda] to-[#48bfe3]">Transformation</span>
                  </h2>
                  <p className="text-[#8892b0] text-lg font-sans mb-12 max-w-lg leading-relaxed">
                    We engineer complex digital ecosystems that drive business efficiency and dominance.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setView('CONTACT')} className="px-8 py-4 bg-[#64ffda] text-[#020c1b] font-bold text-sm tracking-widest uppercase hover:shadow-[0_0_20px_rgba(100,255,218,0.4)] transition-all rounded">
                      Partner With Us
                    </button>
                  </div>
                </motion.div>
              </section>

              {/* About */}
              <section className="py-32 px-8 md:px-24 bg-[#0a192f]/50">
                <RevealSection>
                  <h2 className="text-[#64ffda] font-sans text-xs tracking-[0.4em] uppercase mb-12">About Our Vision</h2>
                  <div className="max-w-4xl">
                    <p className="text-white text-xl md:text-2xl font-sans leading-relaxed mb-8">
                       At UpgradeWithAIFolks, we blend <span className="text-[#64ffda] font-bold">design, development, and AI</span> to build products that solve real problems.
                    </p>
                    <div className="text-[#8892b0] text-sm md:text-base space-y-6 leading-relaxed">
                      <p>Founded in 2020 by a group of engineers and designers, we set out to create lean, intelligent solutions that launch quickly and iterate continuously. Every project is backed by data and aligned with business outcomes.</p>
                      <p>We believe in transparency, shared ownership, and the power of AI to amplify human creativity.</p>
                    </div>
                  </div>
                </RevealSection>
              </section>

              {/* Services */}
              <section className="py-32 px-8 md:px-24 border-t border-[#64ffda]/10">
                <RevealSection>
                  <h2 className="text-[#64ffda] font-sans text-xs tracking-[0.4em] uppercase mb-12 text-center">Core Solutions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                      <div key={i} className="p-8 bg-[#112240] border border-[#233554] rounded-xl hover:border-[#64ffda]/50 transition-all group">
                        <div className="text-3xl mb-6 group-hover:scale-110 transition-transform">{s.icon}</div>
                        <h3 className="text-white font-bold text-lg mb-4">{s.title}</h3>
                        <p className="text-[#8892b0] text-sm leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </RevealSection>
              </section>

              {/* Approach */}
              <section className="py-32 px-8 md:px-24 bg-[#0a192f]/50 border-t border-[#64ffda]/10">
                <RevealSection>
                  <h2 className="text-[#64ffda] font-sans text-xs tracking-[0.4em] uppercase mb-12">Systemic Approach</h2>
                  <div className="space-y-8 max-w-3xl">
                    {[
                      { n: "01", t: "Discovery & Targeting", d: "We aggressively analyze market dynamics and business metrics to map the optimal technical path." },
                      { n: "02", t: "Prototyping & UX", d: "We construct intelligent wireframes and model intricate user journeys for maximum engagement." },
                      { n: "03", t: "AI & Cloud Engineering", d: "We deploy onto secure cloud environments, fortified by artificial intelligence modules." }
                    ].map((step, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <span className="text-3xl font-bold text-[#64ffda] opacity-50">{step.n}</span>
                        <div>
                          <h4 className="text-white font-bold text-lg mb-2">{step.t}</h4>
                          <p className="text-[#8892b0] text-sm">{step.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RevealSection>
              </section>

              <footer className="p-24 text-center border-t border-[#233554]">
                <h2 className="text-white text-3xl font-bold mb-8 uppercase tracking-widest">
                  The horizon belongs to <span className="text-[#64ffda]">those who invent it.</span>
                </h2>
                <div className="flex justify-center gap-6">
                   <button onClick={() => setView('PRICING')} className="text-[#64ffda] text-xs font-bold tracking-widest border border-[#64ffda] px-6 py-3 rounded hover:bg-[#64ffda]/10 transition-all">PRICING</button>
                   <button onClick={() => setView('CONTACT')} className="bg-[#64ffda] text-[#020c1b] text-xs font-bold tracking-widest px-6 py-3 rounded hover:opacity-90 transition-all">CONTACT</button>
                </div>
              </footer>
            </motion.div>
          )}

          {view === 'PRICING' && (
            <motion.div key="pricing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-8 md:p-32 max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">Enterprise <span className="text-[#64ffda]">Pricing</span></h2>
              <div className="space-y-6">
                {pricingPlans.map((p, i) => (
                  <div key={i} className="p-8 md:p-12 bg-[#112240] border border-[#233554] rounded-2xl flex flex-col md:flex-row justify-between items-center group cursor-pointer hover:border-[#64ffda]/50 transition-all" onClick={() => window.open(`https://wa.me/918825802060`, '_blank')}>
                    <div className="md:w-2/3 mb-8 md:mb-0">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#64ffda] transition-colors">{p.title}</h3>
                      <p className="text-[#8892b0] text-base">{p.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#64ffda] mb-2">{p.price}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Quote per scope</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'CONTACT' && (
            <motion.div key="contact" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="min-h-[80vh] flex items-center justify-center p-8">
               <div className="text-center">
                  <h2 className="text-5xl md:text-8xl font-black text-white mb-12 uppercase">Initiate <span className="text-[#64ffda]">Contact</span></h2>
                  <div className="flex flex-col md:flex-row gap-8 justify-center mt-12">
                     <a href="https://wa.me/918825802060" className="p-12 bg-[#112240] border border-[#233554] rounded-3xl hover:border-[#64ffda] transition-all group flex flex-col items-center">
                        <span className="text-5xl mb-6 group-hover:scale-110 transition-transform">💬</span>
                        <span className="text-white font-bold tracking-widest uppercase">WhatsApp Direct</span>
                     </a>
                     <a href="mailto:admin@upgradewithaifolks.com" className="p-12 bg-[#112240] border border-[#233554] rounded-3xl hover:border-[#64ffda] transition-all group flex flex-col items-center">
                        <span className="text-5xl mb-6 group-hover:scale-110 transition-transform">📧</span>
                        <span className="text-white font-bold tracking-widest uppercase">Email Inquiry</span>
                     </a>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
