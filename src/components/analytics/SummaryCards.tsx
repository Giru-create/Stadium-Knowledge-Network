'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Brain, Clock, Sparkles } from 'lucide-react';

const CARDS = [
  {
    icon: Brain,
    color: 'indigo',
    label: 'Operations Intelligence',
    value: '42%',
    description:
      'Reduction in crowd congestions and queue delays across connected venues.',
  },
  {
    icon: Clock,
    color: 'purple',
    label: 'Response Mitigation',
    value: '-15 min',
    description:
      'Average reduction in incident resolution times after AI Playbook integration.',
  },
  {
    icon: Sparkles,
    color: 'emerald',
    label: 'Network Sharing',
    value: '8.4x',
    description:
      'Increase in cross-stadium knowledge exchange frequency.',
  },
] as const;

/** Maps a colour name to the corresponding Tailwind utility fragments. */
const COLOR_MAP: Record<string, { gradient: string; text: string; blur: string }> = {
  indigo: {
    gradient: 'bg-gradient-to-r from-indigo-950/20 to-slate-900/60',
    text: 'text-indigo-400',
    blur: 'bg-indigo-500/5',
  },
  purple: {
    gradient: 'bg-gradient-to-r from-purple-950/20 to-slate-900/60',
    text: 'text-purple-400',
    blur: 'bg-purple-500/5',
  },
  emerald: {
    gradient: 'bg-gradient-to-r from-emerald-950/20 to-slate-900/60',
    text: 'text-emerald-400',
    blur: 'bg-emerald-500/5',
  },
};

/**
 * Renders the three highlight summary cards across the top of the analytics page.
 * Each card is statically defined — no props required.
 */
export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CARDS.map((card) => {
        const style = COLOR_MAP[card.color];
        const Icon = card.icon;

        return (
          <Card
            key={card.label}
            className={`relative overflow-hidden ${style.gradient}`}
          >
            <div
              className={`absolute top-0 right-0 h-24 w-24 ${style.blur} blur-xl rounded-full`}
            />
            <div className="flex flex-col gap-2">
              <span
                className={`text-[10px] font-bold ${style.text} uppercase tracking-wider flex items-center gap-1.5`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {card.label}
              </span>
              <h3 className="text-3xl font-black text-slate-100">
                {card.value}
              </h3>
              <p className="text-xs text-slate-400 leading-normal">
                {card.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
