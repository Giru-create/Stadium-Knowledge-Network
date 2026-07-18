'use client';

import React from 'react';
import { Cpu, Library, Shield } from 'lucide-react';

interface Feature {
  icon: typeof Cpu;
  title: string;
  description: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    icon: Cpu,
    title: 'Incident Simulation',
    description:
      'Test heavy rain or gate shutdowns and watch recommended playbooks execute.',
    color: 'indigo',
  },
  {
    icon: Library,
    title: 'Knowledge Library',
    description:
      'Filter, search, and sort structured incident responses with full telemetry details.',
    color: 'emerald',
  },
  {
    icon: Shield,
    title: 'Interactive Map',
    description:
      'Track live crowd densities, food court waits, and parking flow patterns visually.',
    color: 'purple',
  },
];

/** Maps a feature colour key to the relevant Tailwind utility classes. */
const COLOR_MAP: Record<string, { box: string; icon: string }> = {
  indigo: {
    box: 'bg-indigo-500/5 border-indigo-500/10',
    icon: 'text-indigo-400',
  },
  emerald: {
    box: 'bg-emerald-500/5 border-emerald-500/10',
    icon: 'text-emerald-400',
  },
  purple: {
    box: 'bg-purple-500/5 border-purple-500/10',
    icon: 'text-purple-400',
  },
};

/**
 * Three-column feature pillar grid displayed below the hero stats.
 * Each card highlights a core platform capability.
 */
export function FeaturesSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
      {FEATURES.map((feature) => {
        const style = COLOR_MAP[feature.color];
        const Icon = feature.icon;

        return (
          <div key={feature.title} className="flex gap-3 items-start">
            <div
              className={`p-2 rounded-lg border ${style.box} ${style.icon}`}
            >
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">
                {feature.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
