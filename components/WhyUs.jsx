
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Section from './Section';
import SectionHeader from './SectionHeader';

const benefits = [
  {
    icon: '⚡',
    title: 'Speed to Market',
    tagline: 'Launch Faster, Iterate Sooner',
    desc: "We build and ship functional MVPs in weeks — not months — so you can validate, learn, and grow with momentum.",
    highlight: 'Average launch: 21–30 days'
  },
  {
    icon: '🎯',
    title: 'Design That Converts',
    tagline: 'Clarity. Focus. Results.',
    desc: 'Every design choice is intentional — crafted to improve engagement, lower friction, and increase conversions.',
    highlight: 'Conversion-focused UI/UX'
  },
  {
    icon: '🔧',
    title: 'Built to Scale',
    tagline: 'From Prototype to Production',
    desc: 'Architectures and workflows designed for growth: modular code, testable APIs, and reliable deployments.',
    highlight: 'Cloud-ready, maintainable code'
  },
  {
    icon: '🔒',
    title: 'Security First',
    tagline: 'Protect Users, Protect Brand',
    desc: 'We follow modern security best practices so your customers — and your reputation — stay safe.',
    highlight: 'TLS, OWASP basics, secure storage'
  },
  {
    icon: '📈',
    title: 'Growth Mindset',
    tagline: 'Data-Driven Improvements',
    desc: 'We ship with analytics and measurement in place so every release moves the needle on real business metrics.',
    highlight: 'Analytics + A/B experimentation'
  },
  {
    icon: '🤝',
    title: 'Partnership Support',
    tagline: 'We’re With You Long-Term',
    desc: 'Beyond launch, we offer continued optimisation, monitoring, and priority support so you never need to go it alone.',
    highlight: 'Flexible support plans available'
  }
];

export default function WhyUs() {
  return (
    <Section id="why-us" className="bg-gradient-to-br from-slate-900 via-purple-900/10 to-violet-900/20 relative overflow-hidden text-center text-white">
      {/* background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/10 to-violet-900/20" />
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <SectionHeader
            eyebrow="Why UpgradeWithAIFolks"
            eyebrowClass="text-slate-300"
            title="What Sets Us Apart"

            highlightClass="text-purple-300"
            subtitle="Interactive flip cards reveal the full story. Move your cursor to turn each benefit over."
            subtitleClass="text-slate-300"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-10"
        >
        {benefits.map((b, i) => (
          <div
            key={i}
            className="relative w-full h-64 group"
            style={{ perspective: '1000px' }}
          >
            {/* front */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-gray-900/40 to-gray-950/40 border border-gray-800 rounded-2xl p-6 flex flex-col justify-center items-center transition-transform duration-500"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
            >
              <div className="text-3xl mb-4">{b.icon}</div>
              <h3 className="text-xl font-semibold text-white text-center">{b.title}</h3>
            </div>
            {/* back */}
            <div
              className="absolute inset-0 bg-[#111827] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between transition-transform duration-500"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div>
                <h4 className="text-lg font-medium text-cyan-300 mb-2">{b.tagline}</h4>
                <p className="text-stone-200 text-sm leading-relaxed">{b.desc}</p>
              </div>
              <div className="mt-4">
                <span className="text-cyan-300 text-sm font-medium">✓ {b.highlight}</span>
              </div>
            </div>
            {/* hover effect toggles transformation via group-hover */}
            <div
              className="absolute inset-0"
              style={{
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const front = e.currentTarget.previousSibling.previousSibling;
                const back = e.currentTarget.previousSibling;
                front.style.transform = 'rotateY(180deg)';
                back.style.transform = 'rotateY(360deg)';
              }}
              onMouseLeave={e => {
                const front = e.currentTarget.previousSibling.previousSibling;
                const back = e.currentTarget.previousSibling;
                front.style.transform = 'rotateY(0deg)';
                back.style.transform = 'rotateY(180deg)';
              }}
            />
          </div>
        ))}
        </motion.div>
      </div>

    </Section>
  );
}