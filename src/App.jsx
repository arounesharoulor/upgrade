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
             {!isMobile ? (
               <Canvas camera={{ position: [0, 5, 15], fov: 60 }} dpr={[1, 2]}>
                  <Scene view={view} />
                  <Preload all />
               </Canvas>
             ) : (
               <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#051025] to-[#020617]" />
             )}
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