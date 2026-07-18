'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ShieldAlert } from 'lucide-react';

interface Insight {
  label: string;
  title: string;
  description: string;
}

const INSIGHTS: Insight[] = [
  {
    label: 'Top Incident Trigger',
    title: 'Heavy rain causing food court congestion',
    description:
      'Occurred 4 times across Azteca and BMO stadiums. Resolved successfully using mobile app geo-fenced pushes.',
  },
  {
    label: 'Top Operational Remedy',
    title: 'Offline validation switch',
    description:
      'Used during gate entry jams. Prevents queue buildups by using offline local credentials synchronization.',
  },
];

/**
 * Displays the two key operational insights as static cards.
 * Data is internally defined and consistent with the original page.
 */
export function InsightsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-indigo-400" /> Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {INSIGHTS.map((insight) => (
          <div
            key={insight.label}
            className="rounded-xl border border-slate-800 bg-slate-900/20 p-3 flex flex-col gap-1.5"
          >
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {insight.label}
            </span>
            <span className="text-xs font-semibold text-slate-200">
              {insight.title}
            </span>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
              {insight.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
