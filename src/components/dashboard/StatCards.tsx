import React from 'react';
import { Card } from '@/components/ui/Card';
import { Building2, BookOpen, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface StatCardEntry {
  label: string;
  value: number;
  footer: string;
  icon: React.ReactNode;
  color: string;
}

interface StatCardsProps {
  stadiumCount: number;
  playbookCount: number;
  avgConfidence: number;
  activeIncidentCount: number;
  resolvedIncidentCount: number;
  implementedActionsCount: number;
}

function buildStatCards({
  stadiumCount,
  playbookCount,
  avgConfidence,
  activeIncidentCount,
  resolvedIncidentCount,
  implementedActionsCount,
}: StatCardsProps): StatCardEntry[] {
  return [
    {
      label: 'Connected Stadiums',
      value: stadiumCount,
      footer: 'All FIFA systems sync active',
      icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
      color: 'indigo',
    },
    {
      label: 'AI Playbooks Library',
      value: playbookCount,
      footer: `${avgConfidence}% Avg Confidence Rating`,
      icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
      color: 'purple',
    },
    {
      label: 'Active Operations Alerts',
      value: activeIncidentCount,
      footer: `${resolvedIncidentCount} incidents resolved today`,
      icon: <AlertTriangle className={`h-5 w-5 ${activeIncidentCount > 0 ? 'animate-pulse' : ''}`} aria-hidden="true" />,
      color: 'rose',
    },
    {
      label: 'AI Actions Implemented',
      value: implementedActionsCount,
      footer: 'Continuous mitigation online',
      icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
      color: 'emerald',
    },
  ];
}

const colorMap: Record<string, { bg: string; text: string; border: string; footerClass: string }> = {
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/10', footerClass: 'text-indigo-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/10', footerClass: 'text-purple-400' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/10', footerClass: 'text-rose-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/10', footerClass: 'text-emerald-400' },
};

export function StatCards(props: StatCardsProps) {
  const cards = buildStatCards(props);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const c = colorMap[card.color];
        return (
          <Card key={card.label}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
                <span className="text-2xl font-black text-slate-100">{card.value}</span>
              </div>
              <div className={`rounded-xl ${c.bg} p-2.5 ${c.text} border ${c.border}`}>
                {card.icon}
              </div>
            </div>
            <div className={`mt-4 flex items-center text-[10px] ${c.footerClass} font-bold`}>
              <span>{card.footer}</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
