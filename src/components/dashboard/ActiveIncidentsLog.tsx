import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { IncidentCard } from '@/components/common/IncidentCard';
import { AlertTriangle } from 'lucide-react';
import { Match, IncidentEvent } from '@/types';

interface ActiveIncidentsLogProps {
  activeIncidents: IncidentEvent[];
  activeMatch: Match | null;
  onResolve: (incidentId: string) => void;
}

export function ActiveIncidentsLog({ activeIncidents, activeMatch, onResolve }: ActiveIncidentsLogProps) {
  return (
    <Card className="flex-1 flex flex-col justify-between">
      <div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> Active Operations Logs
          </CardTitle>
          <CardDescription>Real-time incident log for the match.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {activeIncidents.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              🟢 All sectors report normal parameters
            </div>
          ) : (
            activeIncidents.map(inc => (
              <IncidentCard
                key={inc.id}
                incident={inc}
                onResolve={onResolve}
              />
            ))
          )}
        </CardContent>
      </div>

      {activeMatch && (
        <div className="p-6 border-t border-slate-800/40 bg-slate-900/10">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Network Connectivity</span>
              <span className="text-xs text-slate-300 font-semibold">Broadcasting telemetry from {activeMatch.stadiumName}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
