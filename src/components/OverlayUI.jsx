import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useSpring } from 'framer-motion';
import ExploreDropdown from './ExploreDropdown';
import useIsMobile from '../hooks/useIsMobile';

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

export default function OverlayUI({ view, setView, scrollYProgress, activeTemplate, setActiveTemplate }) {
  const isMobile = useIsMobile();
  const [offsets, setOffsets] = useState({ pad: 24, tweak: 20, cWidth: 1000, cHeight: 800 });
  
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.001
  });
  
  useEffect(() => {
    const handleResize = () => {
      const rem = parseFloat(typeof document !== 'undefined' ? getComputedStyle(document.documentElement).fontSize : '16') || 16;
      setOffsets({
        pad: window.innerWidth >= 768 ? 3 * rem : 1.5 * rem,
        tweak: 1.25 * rem,
        cWidth: Math.min(window.innerWidth, 1920),
        cHeight: window.innerHeight
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calcX = `calc(${offsets.cWidth / 2}px - 50% - ${offsets.pad}px)`;
  const calcY = `calc(${offsets.cHeight / 2}px - 50% - ${offsets.pad + offsets.tweak}px)`; // Perfectly centered with slight offset upward
  const scrollX = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [calcX, "0px", "0px", calcX]); 
  const scrollY = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [calcY, "0px", "0px", calcY]);
  const scrollScale = useTransform(smoothProgress, [0, 0.05, 0.95, 1], [1.3, 1, 1, 1.3]);
  const alignItems = useTransform(smoothProgress, [0, 0.05, 0.95, 1], ["center", "flex-start", "flex-start", "center"]);
  const skewX = useTransform(smoothProgress, [0, 0.025, 0.05, 0.95, 0.975, 1], [0, -8, 0, 0, 8, 0]);
  const blurValue = useTransform(smoothProgress, [0, 0.025, 0.05, 0.95, 0.975, 1], [0, 2, 0, 0, 2, 0]);
  const textBlur = useTransform(blurValue, (v) => `blur(${Math.max(0, v)}px)`);
  const textAlign = useTransform(smoothProgress, [0, 0.05, 0.95, 1], ["center", "left", "left", "center"]);
  const h1ScrollColor = useTransform(smoothProgress, [0, 1], ["#ffffff", "#ffffff"]);
  const h2ScrollColor = useTransform(smoothProgress, [0, 1], ["#94a3b8", "#94a3b8"]);
  const headerGlobalOpacity = useTransform(smoothProgress, [0, 0.05, 0.8, 0.95, 0.98, 1], [1, 1, 1, 0, 0, 1]);
  const viewAgainOpacity = useTransform(smoothProgress, [0.99, 1], [0, 1]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex flex-col h-screen w-screen overflow-hidden">
      <div className="w-full h-full max-w-[1920px] mx-auto relative flex flex-col p-6 md:p-12 pointer-events-none">
      
      {/* ── Top Bar: Logo | Centered Nav | Explore Button ── */}
      <div className="flex justify-between items-start pointer-events-auto shrink-0 z-50 relative">

        {/* ── Left: Logo / Brand ── */}
        <motion.div 
          className="flex flex-col cursor-pointer z-50" 
          onClick={() => setView('ROAD')}
          style={{
            x: view === 'ROAD' ? scrollX : "0px",
            y: view === 'ROAD' ? scrollY : "0px",
            scale: view === 'ROAD' ? scrollScale : 1,
            alignItems: view === 'ROAD' ? alignItems : "flex-start",
            skewX: view === 'ROAD' ? skewX : 0,
            filter: view === 'ROAD' ? textBlur : "blur(0px)",
            opacity: view === 'ROAD' ? headerGlobalOpacity : 1
          }}
        >
          <motion.div
             className="flex flex-col origin-center"
             style={{ alignItems: view === 'ROAD' ? alignItems : "flex-start" }}
             initial={{ opacity: 0, scale: 0, filter: 'blur(20px)' }}
             animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
             transition={{ delay: 1.5, duration: 0.8, type: "spring", bounce: 0.5 }}
          >
              <motion.h1 
                style={{ color: '#ffffff', textAlign: view === 'ROAD' ? textAlign : "left" }}
                className="font-wide text-lg md:text-2xl lg:text-3xl font-bold tracking-tighter hover:opacity-80 transition-opacity drop-shadow-2xl w-full whitespace-nowrap uppercase"
              >
              UPGRADE WITH AI
              </motion.h1>

          
              <motion.h2 
                style={{ color: '#94a3b8', textAlign: view === 'ROAD' ? textAlign : "left" }}
                className="text-xs md:text-sm font-sans tracking-[0.2em] mt-1.5 uppercase font-medium w-full"
              >
              High-Performance Web & Intelligent Solutions
              </motion.h2>
          </motion.div>
        </motion.div>

        {/* ── Center: Navigation ── */}
        <motion.nav
          className="fixed bottom-6 left-1/2 md:bottom-auto md:top-8 flex items-center gap-6 md:gap-10 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full pointer-events-auto border border-white/20 z-[100]"
          style={{ x: "-50%" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: 'easeOut' }}
        >
          {['ROAD', 'PRICING', 'CONTACT'].map((item) => (
            <div
              key={item}
              onClick={(e) => {
                e.preventDefault();
                setView(item);
                if (item !== 'ROAD') window.scrollTo(0, 0);
              }}
              className={`nav-link text-white text-xs md:text-sm tracking-widest ${view === item ? 'active text-sm md:text-lg scale-[1.12]' : ''}`}
            >
              {item}
            </div>
          ))}
        </motion.nav>

        {/* ── Right: Explore Dropdown ── */}
        <motion.div
          className="flex items-center z-50 pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.0, duration: 0.6, ease: 'easeOut' }}
        >
          <ExploreDropdown activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
        </motion.div>
      </div>

      {/* ── Main Content Areas based on View ── */}
      <div className="flex-1 w-full h-full relative pointer-events-none flex items-center justify-center pt-8 z-40">
        <AnimatePresence mode="wait">
            {view === 'PRICING' && (
                <motion.div 
                    key="pricing"
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-6xl h-full flex flex-col pointer-events-auto pt-10 md:pt-4 px-4 pb-24 overflow-y-auto hide-scrollbar"
                >
                    <div className="mb-8 md:mb-10 w-full mt-10 md:mt-0">
                        <h3 className="text-blue-400 font-wide font-bold text-lg md:text-2xl lg:text-3xl mb-4 tracking-tighter uppercase italic">MODULAR PRICING TIERS</h3>
                        <p className="text-sm md:text-base font-sans text-slate-300 max-w-4xl leading-relaxed font-medium">
                            Whether you need a high-impact presence or a massive database-driven platform intertwined with an enterprise LLM, we deliver uncompromising quality at fair prices. Every plan is meticulously engineered and includes post-launch technical support.
                        </p>
                    </div>

                    <div className="border-t border-white/20 mb-12">
                        {pricingPlans.map((p, i) => (
                            <div key={i} onClick={() => window.open(`https://wa.me/918825802060?text=I'm%20interested%20in%20estimating%20the%20${encodeURIComponent(p.title)}`, '_blank')} className="py-8 border-b border-white/20 flex flex-col md:flex-row md:justify-between md:items-center hover:bg-white/5 transition duration-300 cursor-pointer group px-4 rounded-xl">
                                <div className="flex flex-col md:w-[70%]">
                                    <span className="font-wide font-bold text-lg md:text-xl lg:text-2xl group-hover:pl-4 transition-all duration-300 group-hover:text-blue-400 text-white uppercase italic tracking-tighter">{p.title}</span>
                                    <span className="text-sm font-sans text-slate-400 mt-2 leading-relaxed font-medium">{p.desc}</span>
                                </div>
                                <span className="font-wide font-bold text-base md:text-lg lg:text-xl mt-4 md:mt-0 text-blue-400 md:text-right whitespace-nowrap">{p.price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-sans">
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                            <strong className="block text-white mb-2 text-base font-wide">TECH STACK</strong>
                            <span className="text-slate-300">We exclusively deploy on modern, highly-scalable stacks including Next.js, React, Node.js, Python, PostgreSQL, and Vercel/AWS infrastructures.</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                            <strong className="block text-white mb-2 text-base font-wide">DELIVERY TIMES</strong>
                            <span className="text-slate-300">Static builds typically launch within 1–2 weeks. Bespoke web applications and AI tools map dynamically based on functional complexity constraints.</span>
                        </div>
                        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
                            <strong className="block text-white mb-2 text-base font-wide">MAINTENANCE</strong>
                            <span className="text-slate-300">Custom Retainer Models available for persistent system updates, continuous AI model tuning, security patching, and server monitoring.</span>
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
                    className="max-w-5xl w-full mx-auto pointer-events-auto h-full overflow-y-auto hide-scrollbar pt-16 md:pt-10 pb-24 px-4 flex flex-col items-center"
                >
                    <div className="text-center w-full mb-10 md:mb-12 mt-10 md:mt-0">
                        <h3 className="text-emerald-400 font-wide font-bold text-lg md:text-2xl lg:text-3xl tracking-tighter mb-6 uppercase italic">INITIATE CONTACT</h3>
                        <p className="text-sm md:text-base leading-relaxed text-slate-200 font-sans font-medium">
                        Ready to disrupt your industry vertical? Reach out to our engineering team to construct your next <span className="text-emerald-400 font-bold">game-changing application.</span>
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-16">
                        <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors text-center w-full shadow-2xl">
                            <h4 className="font-wide font-bold text-xl mb-3 tracking-widest text-white">DIRECT LINE</h4>
                            <p className="font-sans text-slate-300 text-base mb-8 max-w-[280px]">The absolute fastest method for acquiring rough project estimations. Available for rapid brainstorming logic and high-level consultation.</p>
                            <a href="https://wa.me/918825802060" target="_blank" rel="noreferrer" className="w-full py-5 bg-white/10 text-white rounded-full font-wide font-bold text-sm hover:bg-emerald-500 hover:text-white transition-all duration-300 tracking-widest shadow-xl hover:shadow-2xl border border-white/20 hover:border-emerald-400">
                            WHATSAPP / +918825802060
                            </a>
                        </div>
                        <div className="backdrop-blur-md bg-white/5 p-10 rounded-3xl border border-white/10 flex flex-col items-center justify-center hover:bg-white/10 transition-colors text-center w-full shadow-2xl">
                            <div className="text-5xl mb-6">📧</div>
                            <h4 className="font-wide font-bold text-xl mb-3 tracking-widest text-white">BUSINESS INQUIRY</h4>
                            <p className="font-sans text-slate-300 text-base mb-8 max-w-[280px]">Transmit your formal Request for Proposal (RFP) or deep technical scope details. Expect a clinically detailed response within 24 hours.</p>
                            <a href="mailto:admin@upgradewithaifolks.com" className="w-full py-5 border-2 border-white/20 text-white bg-transparent rounded-full font-wide font-bold text-[11px] hover:bg-emerald-500 hover:border-emerald-400 hover:text-white transition-all duration-300 tracking-[0.2em] overflow-hidden whitespace-nowrap shadow-xl hover:shadow-2xl">
                            ADMIN@UPGRADEWITHAIFOLKS.COM
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm font-sans text-slate-200 w-full max-w-4xl pt-8 border-t border-white/10">
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
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* ── Socials - Bottom Right ── */}
      <div className="fixed bottom-32 md:bottom-12 right-6 md:right-12 pointer-events-auto flex items-end z-50">
         <div className="flex space-x-3">
             <a href="mailto:admin@upgradewithaifolks.com" className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center font-wide font-bold text-white hover:bg-white hover:text-black transition-all duration-300 shadow-md backdrop-blur-md text-xs md:text-base cursor-pointer">
                 EM
             </a>
             <a href="https://wa.me/918825802060" target="_blank" rel="noreferrer" className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 flex items-center justify-center font-wide font-bold text-white hover:bg-white hover:text-black transition-all duration-300 shadow-md backdrop-blur-md text-xs md:text-base cursor-pointer">
                 WA
             </a>
         </div>
      </div>

      {/* ── View Again Button (Only visible at end of road) ── */}
      <motion.div 
         className="fixed bottom-[15vh] md:bottom-[20vh] left-1/2 z-[60] -translate-x-1/2 flex flex-col items-center pointer-events-auto"
         style={{ opacity: view === 'ROAD' ? viewAgainOpacity : 0 }}
         initial={false}
      >
         <button 
           onClick={() => {
              if (view === 'ROAD' && window.scrollY > 100) {
                 window.dispatchEvent(new CustomEvent('trigger-tornado'));
                 window.scrollTo({ top: 0, behavior: 'smooth' });
              }
           }}
           className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-wide font-bold tracking-widest rounded-full hover:bg-white/20 hover:scale-105 hover:border-white/50 transition-all text-sm md:text-base uppercase shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] cursor-pointer"
         >
           View Journey Again
         </button>
      </motion.div>

      </div>
    </div>
  );
}
