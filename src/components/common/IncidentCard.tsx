'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Clock, AlertTriangle } from 'lucide-react';
import { IncidentEvent } from '@/types';

interface IncidentCardProps {
  incident: IncidentEvent;
  onResolve: (id: string) => void;
  compact?: boolean;
}

export function IncidentCard({ incident, onResolve, compact = false }: IncidentCardProps) {
  if (compact) {
    // Used in notification panel
    return (
      <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>{incident.type}</span>
          </div>
          <Badge variant="danger" className="text-[8px] px-1 py-0">{incident.severity}</Badge>
        </div>
        <p className="text-[11px] text-slate-400 line-clamp-2">{incident.description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] text-slate-500">
            {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={() => onResolve(incident.id)}
            className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
            aria-label={`Resolve incident: ${incident.type}`}
          >
            Resolve
          </button>
        </div>
      </div>
    );
  }

  // Full card — used in dashboard and simulator
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-rose-400">{incident.type}</span>
        <Badge variant="danger" className="text-[8px] px-1 py-0">{incident.severity}</Badge>
      </div>
      {!compact && (
        <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{incident.description}</p>
      )}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/40">
        <span className="text-[9px] text-slate-500 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <button
          onClick={() => onResolve(incident.id)}
          className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition-colors cursor-pointer"
          aria-label={`Resolve incident: ${incident.type}`}
        >
          Resolve Alert
        </button>
      </div>
    </div>
  );
}
