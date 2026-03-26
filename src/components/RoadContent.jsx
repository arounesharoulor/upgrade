import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';

function ScrollSection({ progress, start, end, title, children }) {
  const duration = end - start;
  
  // Create non-overlapping sequence: Title reveals, then hides. Details reveal, then hide.
  const p1 = start; 
  const p2 = start + duration * 0.15; 
  const p3 = start + duration * 0.50; 
  const p4 = start + duration * 0.60; 
  
  const p5 = start + duration * 0.70; 
  const p6 = start + duration * 0.80; 
  const p7 = start + duration * 0.95; 
  const p8 = end;                     

  const titleOpacity = useTransform(progress, [p1, p2, p3, p4], [0, 1, 1, 0]);
  const titleScale = useTransform(progress, [p1, p2, p3, p4], [0.8, 1, 1.05, 1.5]);

  const detailOpacity = useTransform(progress, [p4, p5, p6, p7, p8], [0, 0, 1, 1, 0]);
  const detailScale = useTransform(progress, [p4, p5, p6, p7, p8], [0.9, 0.95, 1, 1.05, 1.2]);

  const pointerEvents = useTransform(progress, (v) => {
    return (v > p5 && v < p8 - 0.05) ? "auto" : "none";
  });

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center px-4 z-10 pointer-events-none"
    >
       <motion.h2 
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="absolute top-[40%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-wide font-bold text-lg md:text-2xl lg:text-3xl tracking-tighter text-center uppercase italic drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 w-full px-6"
       >
          {title}
       </motion.h2>
       
       <motion.div
          style={{ opacity: detailOpacity, scale: detailScale, pointerEvents }}
          className="w-full px-4 md:px-8 max-w-5xl text-center z-10 absolute top-[55%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[70vh] md:max-h-[85vh] overflow-y-auto hide-scrollbar"
       >
          {children}
       </motion.div>
    </motion.div>
  );
}

export default function RoadContent() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.001
  });

  return (
    <>
      <ScrollSection progress={smoothProgress} start={0} end={0.12} title="">
        <div className="flex flex-col items-center justify-center mt-32 md:mt-40">
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ delay: 1, duration: 2 }}
             className="text-white/60 font-wide font-bold tracking-[0.4em] text-xs md:text-sm uppercase flex flex-col items-center"
           >
              <span className="mb-6">Scroll to start the journey</span>
              <div className="w-[2px] h-24 bg-gradient-to-b from-white to-transparent animate-bounce"></div>
           </motion.div>
        </div>
      </ScrollSection>

      <ScrollSection progress={smoothProgress} start={0.15} end={0.32} title="ABOUT US">
        <div className="backdrop-blur-2xl bg-slate-950/40 p-6 md:p-12 rounded-[24px] md:rounded-[40px] border border-white/10 shadow-2xl mx-auto max-w-4xl">
          <p className="text-white text-sm md:text-base lg:text-lg font-sans leading-relaxed mb-8 font-medium">
             At UpgradeWithAIFolks, we blend <span className="font-bold text-emerald-400 drop-shadow-sm">design, development, and AI</span> to build products that solve real problems.
          </p>
          <div className="text-slate-300 text-xs md:text-sm font-sans leading-relaxed text-left space-y-4 mb-10">
             <p>Founded in 2020, we evolved from a design studio into a full-scale digital engineering firm trusted by enterprises globally. Every project we take on is backed by data, polished with craft, and aligned with outcomes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { t: "Fast Turnaround", i: "⚡", d: "Prototypes in under 3 weeks.", bg: "rgba(52,211,153,0.1)" },
                { t: "AI-Driven", i: "🤖", d: "Machine learning integration.", bg: "rgba(96,165,250,0.1)" },
                { t: "User First", i: "🎯", d: "Focused on clarity and ROI.", bg: "rgba(251,191,36,0.1)" }
              ].map((pill, idx) => (
                <div key={idx} style={{ background: pill.bg }} className="p-5 rounded-2xl border border-white/5 backdrop-blur-md">
                   <div className="text-2xl mb-2">{pill.i}</div>
                   <h4 className="text-white font-wide font-bold text-xs md:text-sm mb-1 uppercase tracking-wider">{pill.t}</h4>
                   <p className="text-slate-400 text-[10px] md:text-xs uppercase font-bold">{pill.d}</p>
                </div>
              ))}
          </div>
        </div>
      </ScrollSection>

      <ScrollSection progress={smoothProgress} start={0.35} end={0.52} title="OUR SERVICES">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full mx-auto max-w-5xl">
            {[
              { icon: '🌐', title: 'Web Development', desc: 'Modern responsive cloud portals.' },
              { icon: '📱', title: 'Mobile Apps', desc: 'Native iOS & Android experiences.' },
              { icon: '🤖', title: 'AI Integration', desc: 'LLMs, RAG & Neural Automation.' },
              { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable serverless infrastructure.' },
              { icon: '🔧', title: 'Custom Dev', desc: 'Bespoke enterprise internal tools.' },
              { icon: '📊', title: 'Data Analytics', desc: 'Real-time telemetry & insights.' }
            ].map((s, i) => (
               <div key={i} className="backdrop-blur-2xl bg-white/[0.03] p-6 md:p-8 rounded-[24px] border border-white/10 shadow-xl flex flex-col items-center text-center hover:border-blue-400/50 transition-colors group">
                   <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                   <h3 className="text-blue-400 font-wide font-bold text-xs md:text-sm mb-3 uppercase tracking-widest">{s.title}</h3>
                   <p className="text-slate-300 font-sans text-[10px] md:text-xs uppercase font-bold leading-relaxed">
                       {s.desc}
                   </p>
               </div>
            ))}
        </div>
      </ScrollSection>

      <ScrollSection progress={smoothProgress} start={0.55} end={0.72} title="OUR APPROACH">
         <div className="backdrop-blur-2xl bg-white/[0.02] p-8 md:p-14 rounded-[40px] border border-white/10 shadow-2xl mx-auto max-w-3xl space-y-8 text-left">
             {[
               { n: "1", t: "DISCOVERY", d: "Mapping the optimal technical path before any engineering begins." },
               { n: "2", t: "PROTOTYPING", d: "Constructing intelligent wireframes for maximum engagement." },
               { n: "3", t: "DEPLOYMENT", d: "Reliable cloud eng fortified by adaptive AI modules." }
             ].map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                  <span className="text-2xl md:text-4xl font-wide font-bold text-amber-400 leading-none opacity-50">{step.n}</span>
                  <div>
                     <h4 className="text-base md:text-lg font-wide font-bold text-white mb-2 uppercase tracking-tighter italic">{step.t}</h4>
                     <p className="text-slate-300 font-sans text-xs md:text-sm leading-relaxed">{step.d}</p>
                  </div>
              </div>
             ))}
         </div>
      </ScrollSection>

      <ScrollSection progress={smoothProgress} start={0.75} end={1.0} title="COMMENCE BUILD">
        <div className="backdrop-blur-2xl bg-slate-950/40 p-10 md:p-20 rounded-[40px] border border-white/10 shadow-2xl flex flex-col items-center mx-auto max-w-2xl">
          <p className="text-lg md:text-2xl lg:text-3xl font-wide font-bold leading-tight mb-8 text-center uppercase tracking-tighter italic">
             The horizon belongs to <br/><span className="text-blue-400 drop-shadow-md">those who invent it.</span>
          </p>
          <p className="text-slate-400 text-xs md:text-sm font-sans text-center max-w-sm font-medium">
             Explore our pricing plans below to view tiers, or contact us to start.
          </p>
        </div>
      </ScrollSection>
    </>
  );
}
