import React from 'react';

export default function SectionHeader({ eyebrow, title, highlight, subtitle, className = '', highlightClass = 'text-cyan-400', subtitleClass = 'text-gray-300', eyebrowClass = 'text-cyan-400' }) {
  return (
    <div className={`max-w-3xl mx-auto text-center ${className}`}>
      {eyebrow && (
        <div className={`inline-block px-6 py-2 bg-cyan-950/20 border border-cyan-900/30 rounded-full ${eyebrowClass} text-sm font-medium mb-4`}>
          {eyebrow}
        </div>
      )}

      <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-4 leading-tight">
        {title} {highlight && <span className={highlightClass}>{highlight}</span>}
      </h2>

      {subtitle && (
        <p className={`${subtitleClass} text-base max-w-3xl mx-auto mb-8`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
