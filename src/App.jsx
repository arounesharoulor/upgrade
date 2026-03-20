import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useScroll } from 'framer-motion';
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
    // Using setTimeout to guarantee the DOM height expands to 600vh before scrolling.
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.dispatchEvent(new Event('scroll'));
    }, 10);
  }, [view, activeTemplate]);

  return (
    <div className={`w-full ${(view === 'ROAD' && (activeTemplate === 'client' || activeTemplate === 'premium')) ? 'h-[600vh]' : 'h-screen overflow-hidden'}`}>
      {activeTemplate === 'client' ? (
        <>
          <div className="fixed inset-0 w-full h-full z-0 bg-[#020617]">
             <Canvas 
                camera={{ position: [0, 5, 15], fov: 60 }} 
                dpr={isMobile ? [1, 1.2] : [1, 2]}
                gl={{ antialias: !isMobile }}
             >
                <Scene view={view} isMobile={isMobile} />
                <Preload all />
             </Canvas>
          </div>

          <OverlayUI 
            view={view} 
            setView={setView} 
            scrollYProgress={scrollYProgress} 
            activeTemplate={activeTemplate}
            setActiveTemplate={setActiveTemplate}
          />
          
          {view === 'ROAD' && <RoadContent />}
        </>
      ) : activeTemplate === 'premium' ? (
        <PremiumTemplate 
          view={view}
          setView={setView}
          scrollYProgress={scrollYProgress}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
        />
      ) : (
        <BusinessTemplate 
          view={view}
          setView={setView}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
        />
      )}
    </div>
  );
}

export default App;