import React from 'react';
import { Match } from '@/types';

interface DashboardHeaderProps {
  matches: Match[];
  activeMatchId: string | undefined;
  onMatchChange: (matchId: string) => void;
}

export function DashboardHeader({ matches, activeMatchId, onMatchChange }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
          Operational Command
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Active Monitoring, AI Incident Advisory, and Stadium Knowledge Sharing.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Match:</span>
        <select
          value={activeMatchId || ''}
          onChange={(e) => onMatchChange(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              {m.teams.home} vs {m.teams.away} ({m.status})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
