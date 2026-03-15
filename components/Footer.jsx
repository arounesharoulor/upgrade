import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

export default function Footer() {
  const year = new Date().getFullYear();
  const [expanded, setExpanded] = useState({});

  const toggleSection = (key) => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const sections = [
    {
      key: 'navigation',
      title: 'Navigation',
      items: [
        { label: 'Services', href: '#services' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Why Us', href: '#why-us' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    {
      key: 'solutions',
      title: 'Solutions',
      items: [
        { label: 'Static Websites', href: '#services' },
        { label: 'Web Applications', href: '#services' },
        { label: 'AI-Powered Solutions', href: '#services' }
      ]
    },
    {
      key: 'contact',
      title: 'Get in Touch',
      items: [
        { label: 'WhatsApp: +91 88258 02060', href: 'https://wa.me/918825802060?text=Hi%20UpgradeWithAIFolks', external: true },
        { label: 'admin@upgradewithaifolks.com', href: 'mailto:admin@upgradewithaifolks.com', external: true }
      ]
    }
  ];

  return (
    <footer className="bg-[#0a0e1f] border-t border-cyan-950/30 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center font-black text-2xl text-white">
              ⚡
            </div>
            <span className="text-xl font-bold">UpgradeWithAIFolks</span>
          </div>
          <p className="text-gray-400 mb-6">
            Building tomorrow's digital experiences — today.
          </p>
          <p className="text-sm text-gray-500">
            © {year} UpgradeWithAIFolks. All rights reserved.
          </p>
        </div>

        {/* Collapsible sections */}
        {sections.map(section => (
          <div key={section.key}>
            <button
              onClick={() => toggleSection(section.key)}
              className="w-full md:w-auto flex items-center justify-between gap-2 text-lg font-semibold text-cyan-300 mb-6 focus:outline-none"
            >
              <span>{section.title}</span>
              <MdKeyboardArrowDown
                className={`md:hidden transition-transform duration-300 ${
                  expanded[section.key] ? 'rotate-180' : ''
                }`}
                size={20}
              />
            </button>
            <ul
              className={`space-y-3 text-gray-400 overflow-hidden transition-all duration-300 md:block ${
                expanded[section.key] ? 'max-h-96' : 'max-h-0 md:max-h-none'
              }`}
            >
              {section.items.map(item => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="hover:text-cyan-400 transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        Designed & developed with precision for the next generation of digital businesses.
      </div>
    </footer>
  );
}