'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

const STATS = [
  { value: '12', label: 'Host Stadiums' },
  { value: '94.2%', label: 'AI Confidence' },
  { value: '420+', label: 'SOPs Prevented' },
] as const;

/**
 * Left-hand hero column: the eyebrow badge, headline, tagline paragraph,
 * interactive statistics grid, and three feature-pillar cards.
 *
 * This component is purely presentational — all data is static.
 */
export function HeroSection() {
  return (
    <div className="lg:col-span-7 flex flex-col gap-8">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-3 py-1 rounded-full text-xs font-semibold w-fit">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Next-Gen Stadium Intelligence</span>
      </div>

      {/* Headline */}
      <div className="flex flex-col gap-4">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
          Every Match Makes <br />
          <span className="text-gradient-primary">Every Stadium Smarter.</span>
        </h2>
        <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
          SKN turns real-time stadium operational incidents into AI playbooks.
          Future host stadiums query weather, transport, and crowd models to
          proactively prevent bottlenecks before they occur.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-slate-900 pt-8 max-w-lg">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl font-black text-slate-100">{stat.value}</div>
            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
