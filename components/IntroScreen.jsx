// src/components/IntroScreen.jsx

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

function generateParticleCoordinates() {
  return [...Array(8)].map(() => ({
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 600
  }));
}

export default function IntroScreen({ onEnter }) {
  const [isExiting, setIsExiting] = useState(false);

  const particleCoordinates = useMemo(() => {
    return generateParticleCoordinates();
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0e1f] text-center px-6 overflow-hidden"
    >
      {/* Background particles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {isExiting && (
          <>
            {particleCoordinates.map((coords, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.6, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: 0, 
                  scale: 2, 
                  x: coords.x,
                  y: coords.y
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute w-4 h-4 bg-cyan-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-8px',
                  marginTop: '-8px'
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Text block - matched to your screenshot */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: isExiting ? 0 : 1, 
          y: isExiting ? -100 : 0 
        }}
        transition={{ duration: 0.6 }}
        className="mb-16 md:mb-20"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight text-white uppercase mb-4">
          UPGRADEWITHAIFOLKS
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
          MODERN WEB APPLICATION DEVELOPMENT
        </p>
      </motion.div>

      {/* Circle Button - teal base + gradient hover */}
      <motion.button
        onClick={handleEnter}
        whileHover={!isExiting ? { scale: 1.06 } : {}}
        whileTap={!isExiting ? { scale: 0.96 } : {}}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: isExiting ? 0 : 1, 
          scale: isExiting ? 0.5 : 1,
          rotate: isExiting ? 360 : 0
        }}
        transition={{ 
          duration: isExiting ? 0.8 : 0.6,
          delay: isExiting ? 0 : 0.7,
          type: "spring",
          stiffness: isExiting ? 100 : 150
        }}
        disabled={isExiting}
        className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-[#00d4ff] flex items-center justify-center text-white text-lg sm:text-xl md:text-2xl font-semibold shadow-lg shadow-cyan-900/30 hover:shadow-cyan-700/40 transition-all duration-300 overflow-hidden group disabled:cursor-default"
      >
        {/* Default solid teal */}
        <span className="relative z-10">{isExiting ? '✓' : 'Enter Experience'}</span>

        {/* Hover: gradient fill + shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full" />
      </motion.button>

      {/* Expanding circles on exit */}
      {isExiting && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full border-2 border-cyan-400"
            style={{ left: '50%', top: '50%', marginLeft: '-80px', marginTop: '-80px' }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute w-40 h-40 rounded-full border-2 border-purple-400"
            style={{ left: '50%', top: '50%', marginLeft: '-80px', marginTop: '-80px' }}
          />
        </>
      )}
    </motion.section>
  );
}