import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExploreDropdown({ activeTemplate, setActiveTemplate }) {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);

  const options = [
    { id: 'business', label: 'Business', icon: '🏢', desc: 'Corporate & enterprise template' },
    { id: 'premium',  label: 'Premium',  icon: '💎', desc: 'High-end luxury template' },
    { id: 'client',   label: 'Client',   icon: '👤', desc: 'Current portfolio template' },
  ];

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const active = options.find(o => o.id === activeTemplate) || options[2];

  return (
    <div ref={dropRef} className="relative pointer-events-auto">
      {/* Explore Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="explore-btn flex items-center gap-1 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-full font-wide font-bold text-[10px] md:text-sm tracking-widest transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.25) 100%)',
          border: '1px solid rgba(139,92,246,0.5)',
          color: '#e2d9ff',
          backdropFilter: 'blur(12px)',
          boxShadow: open
            ? '0 0 20px rgba(139,92,246,0.5), inset 0 0 20px rgba(139,92,246,0.1)'
            : '0 0 10px rgba(139,92,246,0.2)',
        }}
      >
        <span>EXPLORE</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-xs"
        >
          ▾
        </motion.span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-52 rounded-2xl overflow-hidden z-[100]"
            style={{
              background: 'rgba(10,14,35,0.92)',
              border: '1px solid rgba(139,92,246,0.35)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(139,92,246,0.15)',
            }}
          >
            <div className="py-2 px-1">
              {options.map((opt, i) => {
                const isActive = activeTemplate === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setActiveTemplate(opt.id);
                      setOpen(false);
                      // Scroll to top when switching templates
                      window.scrollTo(0, 0);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))'
                        : 'transparent',
                      borderLeft: isActive ? '2px solid rgba(139,92,246,0.8)' : '2px solid transparent',
                    }}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <div className="flex flex-col">
                      <span
                        className="font-wide font-bold text-xs tracking-widest transition-colors"
                        style={{ color: isActive ? '#c4b5fd' : '#e2e8f0' }}
                      >
                        {opt.label.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans mt-0.5">{opt.desc}</span>
                    </div>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-violet-400 text-xs"
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Label at bottom */}
            <div className="px-4 py-2 border-t border-white/10 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-sans tracking-widest uppercase">
                Active Template:
              </span>
              <span className="text-[10px] text-violet-400 font-wide font-bold tracking-widest uppercase">
                {active.label}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
