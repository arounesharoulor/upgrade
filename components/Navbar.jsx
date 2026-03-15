import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // close menu when a link is clicked (useful for mobile)
  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center font-black text-xl text-white shadow-lg">
            ⚡
          </div>
          <span className="text-xl font-semibold tracking-tight">UpgradeWithAIFolks</span>
        </div>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#services" onClick={handleLinkClick} className="hover:text-cyan-400 transition-colors">
            Services
          </a>
          <a href="#pricing" onClick={handleLinkClick} className="hover:text-cyan-400 transition-colors">
            Pricing
          </a>
          <a href="#why-us" onClick={handleLinkClick} className="hover:text-cyan-400 transition-colors">
            Why Us
          </a>
          <a href="#contact" onClick={handleLinkClick} className="hover:text-cyan-400 transition-colors">
            Contact
          </a>
        </div>

        {/* CTA button */}
        <a
          href="https://wa.me/918825802060?text=Hi!%20I%20want%20to%20discuss%20a%20project%20with%20UpgradeWithAIFolks"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 px-7 py-3 rounded-full font-semibold shadow-lg transition-all"
        >
          Let's Talk
        </a>

        {/* hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-cyan-700/50 hover:bg-cyan-700/70 transition"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <div className="w-6 h-0.5 bg-white mb-1" />
          <div className="w-6 h-0.5 bg-white mb-1" />
          <div className="w-6 h-0.5 bg-white" />
        </button>
      </div>

      {/* mobile menu overlay */}
      {open && (
        <div className="md:hidden bg-[#0a0e1f]/95 backdrop-blur-sm py-8">
          <div className="flex flex-col items-center gap-8">
            <a href="#services" onClick={handleLinkClick} className="text-lg hover:text-cyan-400">
              Services
            </a>
            <a href="#pricing" onClick={handleLinkClick} className="text-lg hover:text-cyan-400">
              Pricing
            </a>
            <a href="#why-us" onClick={handleLinkClick} className="text-lg hover:text-cyan-400">
              Why Us
            </a>
            <a href="#contact" onClick={handleLinkClick} className="text-lg hover:text-cyan-400">
              Contact
            </a>
            <a
              href="https://wa.me/918825802060?text=Hi!%20I%20want%20to%20discuss%20a%20project%20with%20UpgradeWithAIFolks"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full font-semibold shadow-lg hover:from-slate-600 hover:to-slate-500 transition"
            >
              Let's Talk
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}