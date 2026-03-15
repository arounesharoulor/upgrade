// src/components/Hero.jsx
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function Hero({ onEnterExperience }) {
  const handleEnterExperience = () => {
    onEnterExperience();
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 text-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-indigo-900/30"
    >
      {/* background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/20 to-indigo-900/30" />

      <div className="relative z-10 max-w-5xl flex flex-col items-center justify-center space-y-6 md:space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-none bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent uppercase"
        >
          TRANSFORM YOUR BUSINESS WITH AI-POWERED SOLUTIONS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg sm:text-xl md:text-2xl text-slate-300 font-medium tracking-wide max-w-4xl"
        >
          We blend cutting-edge technology with creative design to build exceptional digital experiences that drive growth and innovation for modern businesses.
        </motion.p>

        {/* Innovative Animation - Floating Arrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-cyan-400 text-4xl cursor-pointer"
            onClick={handleEnterExperience}
          >
            ↓
          </motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-cyan-300 text-sm font-medium"
          >
            Scroll to explore
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}