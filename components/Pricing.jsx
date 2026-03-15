// src/components/Pricing.jsx

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Pricing() {
  const [expandedCard, setExpandedCard] = useState(null);

  const plans = [
    {
      title: "Static Website",
      price: "₹12,999",
      period: "one-time",
      popular: false,
      features: ["Domain Setup", "Web Hosting", "Up to 5-8 Pages", "Logo Design", "SEO Content", "Mobile Responsive", "WhatsApp Integration"],
      cta: "Get Started"
    },
    {
      title: "Medium Web App",
      price: "Custom Quote",
      period: "",
      popular: true,
      features: ["Everything in Static", "Admin Dashboard", "Custom CMS", "API Integration", "Database", "User Auth", "Real-time Features"],
      cta: "Contact Us"
    },
    {
      title: "Advanced Application",
      price: "Scope-based",
      period: "",
      popular: false,
      features: ["Everything in Medium", "AI Features", "Payment Gateway", "Multi-User Auth", "Cloud Deployment", "CI/CD", "Advanced Analytics"],
      cta: "Let's Discuss"
    }
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-gradient-to-br from-slate-900 via-amber-900/10 to-orange-900/20 relative overflow-hidden">
      {/* background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-amber-900/10 to-orange-900/20" />
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 bg-gradient-to-r from-slate-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
          Transparent Pricing for Every Business
        </h2>
        <p className="text-lg text-slate-300 mb-16 max-w-3xl mx-auto">
          Whether you're just getting started or scaling to the next level, we've got a plan for you.
        </p>

        <div className="space-y-4 max-w-2xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="w-full"
            >
              <button
                onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                className={`w-full rounded-lg p-6 text-left transition-all duration-300 border ${
                  expandedCard === i
                    ? 'border-amber-500 bg-gradient-to-r from-amber-900/30 to-orange-900/30'
                    : 'border-gray-700 bg-gray-900/20 hover:border-amber-500/50'
                } ${plan.popular ? 'ring-2 ring-amber-500/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {plan.popular && (
                        <span className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-xs font-medium text-white">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
                    </div>
                    <div className="mt-2 text-amber-300 text-2xl font-semibold">{plan.price}</div>
                    {plan.period && <p className="text-slate-400 text-sm">{plan.period}</p>}
                  </div>
                  <div className={`text-2xl transition-transform duration-300 ${expandedCard === i ? 'rotate-180' : ''}`}>
                    ▼
                  </div>
                </div>
              </button>

              {/* Dropdown Content */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={
                  expandedCard === i
                    ? { opacity: 1, height: 'auto' }
                    : { opacity: 0, height: 0 }
                }
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-900/30 border border-t-0 border-gray-700 rounded-b-lg p-6 space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-slate-300">
                        <span className="text-amber-300">✓</span>
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full mt-6 py-3 px-6 rounded-lg font-medium bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white transition-all">
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}