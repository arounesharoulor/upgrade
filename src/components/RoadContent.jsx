import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function ScrollSection({ progress, start, end, title, children }) {
  const duration = end - start;
  
  // Create non-overlapping sequence: Title reveals, then hides. Details reveal, then hide.
  const p1 = start; 
  const p2 = start + duration * 0.15; // Title scale/fade in
  const p3 = start + duration * 0.35; // Title solid
  const p4 = start + duration * 0.45; // Title fades out & zooms past
  
  const p5 = start + duration * 0.55; // Details start showing
  const p6 = start + duration * 0.65; // Details solid
  const p7 = start + duration * 0.85; // Details hold
  const p8 = end;                     // Details fade out & zoom past

  const titleOpacity = useTransform(progress, [p1, p2, p3, p4], [0, 1, 1, 0]);
  const titleScale = useTransform(progress, [p1, p2, p3, p4], [0.7, 1, 1.05, 2]);

  const detailOpacity = useTransform(progress, [p4, p5, p6, p7, p8], [0, 0, 1, 1, 0]);
  const detailScale = useTransform(progress, [p4, p5, p6, p7, p8], [0.8, 0.9, 1, 1.05, 1.5]);

  const pointerEvents = useTransform(progress, (v) => {
    return (v > p5 && v < p8 - 0.05) ? "auto" : "none";
  });

  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center px-4 z-10 pointer-events-none"
    >
       <motion.h2 
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-wide font-bold text-3xl md:text-5xl lg:text-7xl tracking-wider text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] z-20 w-full"
       >
          {title}
       </motion.h2>
       
       <motion.div
          style={{ opacity: detailOpacity, scale: detailScale, pointerEvents }}
          className="w-full max-w-6xl text-center z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] overflow-y-auto hide-scrollbar"
       >
          {children}
       </motion.div>
    </motion.div>
  );
}

export default function RoadContent() {
  const { scrollYProgress } = useScroll();

  return (
    <>
      <ScrollSection progress={scrollYProgress} start={0} end={0.15} title="">
        <div className="flex flex-col items-center justify-center mt-32 md:mt-40">
           <motion.div 
             initial={{ opacity: 0, y: 10 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ delay: 1, duration: 2 }}
             className="text-white/60 font-sans tracking-[0.3em] text-[10px] md:text-sm uppercase flex flex-col items-center"
           >
              <span>Scroll to start the journey</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent mt-4 animate-bounce"></div>
           </motion.div>
        </div>
      </ScrollSection>

      <ScrollSection progress={scrollYProgress} start={0.15} end={0.35} title="ABOUT US">
        <div className="backdrop-blur-xl bg-slate-900/60 p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl mx-auto max-w-5xl">
          <p className="text-white text-sm md:text-base lg:text-lg font-sans leading-relaxed mb-6">
             At UpgradeWithAIFolks, we blend <span className="font-bold text-emerald-400 drop-shadow-sm">design, development, and AI</span> to build products that solve real problems. Our team moves fast, thinks strategically, and keeps your users front and center.
          </p>
          <div className="text-slate-300 text-xs md:text-sm font-sans leading-relaxed text-left space-y-4 mb-8">
             <p>Founded in 2020 by a group of engineers and designers frustrated with bloated development cycles, we set out to create lean, intelligent solutions that launch quickly and iterate continuously. Every project we take on is backed by data, polished with craft, and aligned with business outcomes.</p>
             <p>We believe in transparency, shared ownership, and the power of AI to amplify human creativity. From startups to enterprises, our clients rely on us to tackle their toughest challenges—turning ambitious ideas into products people love and businesses rely on.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <div className="text-2xl mb-2">⚡</div>
                 <h4 className="text-white font-wide text-xs mb-1">Fast Turnaround</h4>
                 <p className="text-slate-400 text-[10px] md:text-xs">Initial prototypes in under 30 days so you can test and iterate.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <div className="text-2xl mb-2">🤖</div>
                 <h4 className="text-white font-wide text-xs mb-1">AI-Driven</h4>
                 <p className="text-slate-400 text-[10px] md:text-xs">Solutions leveraging machine learning to automate and elevate UX.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <div className="text-2xl mb-2">🎯</div>
                 <h4 className="text-white font-wide text-xs mb-1">User First</h4>
                 <p className="text-slate-400 text-[10px] md:text-xs">Every decision is made to aim for clarity and conversion.</p>
              </div>
          </div>
        </div>
      </ScrollSection>

      <ScrollSection progress={scrollYProgress} start={0.35} end={0.60} title="OUR SERVICES">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 w-full mx-auto">
            {[
              { icon: '🌐', title: 'Web Development', desc: 'Modern, responsive websites built with cutting-edge tech.' },
              { icon: '📱', title: 'Mobile Apps', desc: 'Native and cross-platform applications for iOS and Android.' },
              { icon: '🤖', title: 'AI Integration', desc: 'Leverage AI to enhance user experiences and automate workflows.' },
              { icon: '☁️', title: 'Cloud Solutions', desc: 'Scalable cloud infrastructure and robust deployment.' },
              { icon: '🔧', title: 'Custom Dev', desc: 'Tailored software solutions designed for specific business needs.' },
              { icon: '📊', title: 'Data Analytics', desc: 'Transform your data into actionable insights.' }
            ].map((s, i) => (
               <div key={i} className="backdrop-blur-xl bg-slate-900/60 p-4 md:p-6 rounded-2xl border border-white/10 shadow-xl flex flex-col items-center text-center hover:border-purple-500/50 transition-colors">
                   <div className="text-2xl md:text-3xl mb-2 md:mb-4">{s.icon}</div>
                   <h3 className="text-purple-400 font-wide font-bold text-[10px] md:text-xs mb-2 uppercase">{s.title}</h3>
                   <p className="text-slate-300 font-sans text-[9px] md:text-[11px] leading-relaxed">
                       {s.desc}
                   </p>
               </div>
            ))}
        </div>
      </ScrollSection>

      <ScrollSection progress={scrollYProgress} start={0.60} end={0.82} title="OUR APPROACH">
         <div className="backdrop-blur-xl bg-slate-900/60 p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl mx-auto max-w-3xl space-y-4 md:space-y-6 text-left">
             <div className="flex gap-3 md:gap-4 items-start">
                 <span className="text-xl md:text-2xl font-wide font-bold text-amber-400 leading-none">1</span>
                 <div>
                    <h4 className="text-sm md:text-base font-wide font-bold text-white mb-1">DISCOVERY & TARGETING</h4>
                    <p className="text-slate-300 font-sans text-xs md:text-sm">We aggressively analyze market dynamics and business metrics to map the optimal technical path before any engineering begins.</p>
                 </div>
             </div>
             <div className="flex gap-3 md:gap-4 items-start">
                 <span className="text-xl md:text-2xl font-wide font-bold text-amber-400 leading-none">2</span>
                 <div>
                    <h4 className="text-sm md:text-base font-wide font-bold text-white mb-1">PROTOTYPING & UX</h4>
                    <p className="text-slate-300 font-sans text-xs md:text-sm">We construct intelligent wireframes and model intricate user journeys to guarantee maximum retention and engagement density.</p>
                 </div>
             </div>
             <div className="flex gap-3 md:gap-4 items-start">
                 <span className="text-xl md:text-2xl font-wide font-bold text-amber-400 leading-none">3</span>
                 <div>
                    <h4 className="text-sm md:text-base font-wide font-bold text-white mb-1">A.I. & CLOUD ENG</h4>
                    <p className="text-slate-300 font-sans text-xs md:text-sm">We deploy pure, reliable software into auto-scaling cloud environments, fortified by adaptable artificial intelligence modules.</p>
                 </div>
             </div>
         </div>
      </ScrollSection>

      <ScrollSection progress={scrollYProgress} start={0.82} end={1.0} title="COMMENCE BUILD">
        <div className="backdrop-blur-xl bg-slate-900/60 p-8 md:p-14 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center mx-auto max-w-2xl">
          <p className="text-white text-lg md:text-2xl font-wide font-bold leading-relaxed mb-4 text-center uppercase tracking-tighter">
             The horizon belongs to <br/><span className="text-blue-400 drop-shadow-md">those who invent it.</span>
          </p>
          <p className="text-slate-300 text-xs md:text-sm font-sans text-center max-w-sm">
             Explore our <span className="font-bold text-white">Pricing</span> to view tiers, or jump to <span className="font-bold text-white">Contact</span> to start.
          </p>
        </div>
      </ScrollSection>
    </>
  );
}

