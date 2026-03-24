import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Loader, AdaptiveDpr, AdaptiveEvents, Bvh } from '@react-three/drei';
import { useScroll, AnimatePresence, motion } from 'framer-motion';
import Scene from './components/Scene';
import OverlayUI from './components/OverlayUI';
import RoadContent from './components/RoadContent';
import PremiumTemplate from './components/PremiumTemplate';
import BusinessTemplate from './components/BusinessTemplate';
import useIsMobile from './hooks/useIsMobile';

function App() {
  const [view, setView] = useState('ROAD'); // ROAD, OVERVIEW, LIST, ABOUT
  const [activeTemplate, setActiveTemplate] = useState('client'); // 'client' | 'business' | 'premium'
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Reset window scroll position when view or template changes,
    // ensuring we don't land on the bottom of a new template.
    // Using setTimeout to guarantee the DOM height expands to 1200vh before scrolling.
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    }, 10);

    // Apply scroll-snapping to the root HTML element during the road journey
    if (view === 'ROAD' && activeTemplate === 'client' && !isMobile) {
      document.documentElement.classList.add('snap-y', 'snap-mandatory');
    } else {
      document.documentElement.classList.remove('snap-y', 'snap-mandatory');
    }
    
    return () => document.documentElement.classList.remove('snap-y', 'snap-mandatory');
  }, [view, activeTemplate, isMobile]);

  return (
    <div className={`w-full ${(view === 'ROAD' && (activeTemplate === 'client' || activeTemplate === 'premium')) ? 'h-[950vh] snap-y snap-mandatory' : 'h-screen overflow-hidden'} bg-[#020617]`}>
      {/* 5 Content Snap Points across the 950vh vertical track */}
      {view === 'ROAD' && activeTemplate === 'client' && (
        <div className="absolute inset-0 pointer-events-none">
           {[0, 200, 400, 600, 800, 920].map(vh => (
             <div key={vh} className="h-screen snap-start" style={{ marginTop: vh === 0 ? 0 : `${vh}vh` }} />
           ))}
        </div>
      )}
      <AnimatePresence mode="wait">
        {activeTemplate === 'client' && (
          <motion.div 
            key="client"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 w-full h-full"
          >
            <div className="absolute inset-0 w-full h-full z-0 bg-[#020617]">
               <Canvas 
                  camera={{ position: [0, 5, 15], fov: 60 }} 
                  dpr={isMobile ? [1, 1.2] : [1, 2]}
                  gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
               >
                  <React.Suspense fallback={null}>
                    <Bvh firstHitOnly>
                      <Scene view={view} isMobile={isMobile} />
                    </Bvh>
                    <Preload all />
                  </React.Suspense>
                  <AdaptiveDpr pixelated />
                  <AdaptiveEvents />
               </Canvas>
               <Loader 
                  dataInterpolation={(p) => `INITIALIZING SYSTEMS… ${p.toFixed(0)}%`}
                  containerStyles={{ background: '#020617' }}
                  innerStyles={{ backgroundColor: '#1e293b' }}
                  barStyles={{ backgroundColor: '#3b82f6' }}
                  dataStyles={{ color: '#ffffff', fontFamily: 'sans-serif', fontWeight: 'bold' }}
               />
            </div>

            <OverlayUI 
              view={view} 
              setView={setView} 
              scrollYProgress={scrollYProgress} 
              activeTemplate={activeTemplate}
              setActiveTemplate={setActiveTemplate}
            />
            
            {view === 'ROAD' && <RoadContent />}
          </motion.div>
        )}

        {activeTemplate === 'premium' && (
          <motion.div 
            key="premium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 w-full h-full"
          >
            <PremiumTemplate 
              view={view}
              setView={setView}
              scrollYProgress={scrollYProgress}
              activeTemplate={activeTemplate}
              setActiveTemplate={setActiveTemplate}
            />
          </motion.div>
        )}

        {activeTemplate === 'business' && (
          <motion.div 
            key="business"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 w-full h-full"
          >
            <BusinessTemplate 
              view={view}
              setView={setView}
              activeTemplate={activeTemplate}
              setActiveTemplate={setActiveTemplate}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;