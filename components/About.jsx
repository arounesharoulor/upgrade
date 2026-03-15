import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import Section from './Section';
import AboutScene from './AboutScene';
import InfoCard from './InfoCard';

export default function About() {
  return (
    <Section id="about" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900/10 to-teal-900/20 py-24 md:py-32 text-white">
      {/* background 3D animation */}
      <div className="absolute inset-0">
        <AboutScene />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-cyan-900/10 to-teal-900/20" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* decorative rings */}
        <svg className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 opacity-20" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" stroke="#ff6600" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="32" stroke="#ff6600" strokeWidth="1" fill="none" />
        </svg>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          className="text-2xl lg:text-3xl font-semibold mb-2 relative inline-block bg-gradient-to-r from-slate-200 via-cyan-200 to-teal-200 bg-clip-text text-transparent"
        >
          About Us
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-cyan-400 to-cyan-400 mt-1" />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ delay: 0.3 }}
          className="text-base leading-relaxed text-slate-300"
        >
          At UpgradeWithAIFolks, we blend design, development, and AI to build products that solve real problems.
          Our team moves fast, thinks strategically, and keeps your users front and center. We're more than
          coders—we're partners in your growth.

          Founded in 2020 by a group of engineers and designers frustrated with bloated
          development cycles, we set out to create lean, intelligent solutions that launch
          quickly and iterate continuously. Every project we take on is backed by data,
          polished with craft, and aligned with business outcomes.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ delay: 0.6 }}
          className="text-lg leading-relaxed mt-6"
        >
          We believe in transparency, shared ownership, and the power of AI to amplify human
          creativity. From startups to enterprises, our clients rely on us to tackle their
          toughest challenges—turning ambitious ideas into products people love and businesses rely on.
        </motion.p>
        {/* floating icon decorations */}
        <div className="absolute -bottom-16 right-10 opacity-25 animate-pulse-slow">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ff6600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          </svg>
        </div>

        {/* additional info cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <InfoCard icon="⚡" title="Fast Turnaround">
            We deliver initial prototypes in under 30 days so you can test and iterate quickly.
          </InfoCard>
          <InfoCard icon="🤖" title="AI-Driven">
            Our solutions leverage machine learning to automate and elevate user experiences.
          </InfoCard>
          <InfoCard icon="🎯" title="User First">
            Every decision is made with your customers in mind, aiming for clarity and conversion.
          </InfoCard>
        </div>
      </div>
    </Section>
  );
}
