// src/components/Services.jsx
import { motion as Motion } from 'framer-motion';
import Section from './Section';
import SectionHeader from './SectionHeader';

const services = [
  {
    icon: '🌐',
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications built with cutting-edge technologies.'
  },
  {
    icon: '📱',
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications for iOS and Android.'
  },
  {
    icon: '🤖',
    title: 'AI Integration',
    description: 'Leverage artificial intelligence to enhance user experiences and automate processes.'
  },
  {
    icon: '☁️',
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment solutions for modern businesses.'
  },
  {
    icon: '🔧',
    title: 'Custom Development',
    description: 'Tailored software solutions designed to meet your specific business requirements.'
  },
  {
    icon: '📊',
    title: 'Data Analytics',
    description: 'Transform your data into actionable insights with advanced analytics and reporting.'
  }
];

export default function Services() {
  return (
    <Section id="services" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900/10 to-green-900/20 py-24 md:py-32 text-white">
      {/* background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/10 to-green-900/20" />

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <SectionHeader
          eyebrow="Our Services"
          eyebrowClass="text-slate-300"
          title="What We Offer"
          highlightClass="text-emerald-300"
          subtitle="Comprehensive digital solutions to help your business grow and succeed in the modern world."
          subtitleClass="text-slate-300"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {services.map((service, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="bg-gradient-to-br from-gray-900/40 to-gray-950/40 border border-gray-800 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-emerald-300">{service.title}</h3>
              <p className="text-gray-300 leading-relaxed">{service.description}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}