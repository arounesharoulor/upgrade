import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useScroll } from 'framer-motion';
import Scene from './components/Scene';
import OverlayUI from './components/OverlayUI';
import RoadContent from './components/RoadContent';
import PremiumTemplate from './components/PremiumTemplate';
import BusinessTemplate from './components/BusinessTemplate';

function App() {
  const [view, setView] = useState('ROAD'); // ROAD, OVERVIEW, LIST, ABOUT
  const [activeTemplate, setActiveTemplate] = useState('client'); // 'client' | 'business' | 'premium'
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Scroll to top when view changes away from road
    if (view !== 'ROAD') {
      window.scrollTo(0, 0);
    }
  }, [view]);

  return (
    <div className={`w-full ${(view === 'ROAD' && (activeTemplate === 'client' || activeTemplate === 'premium')) ? 'h-[600vh]' : 'h-screen overflow-hidden'}`}>
      {activeTemplate === 'client' ? (
        <>
          <div className="fixed inset-0 w-full h-full z-0 bg-transparent">
             <Canvas camera={{ position: [0, 5, 15], fov: 60 }} dpr={[1, 2]}>
                <Scene view={view} />
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
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
        />
      )}
    </div>
  );
}

export default App;