import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';
import { Match } from '@/types';

interface StadiumDetailsProps {
  activeMatch: Match;
}

const GATE_NAMES = ['Gate A', 'Gate B', 'Gate C', 'Gate D'] as const;

export function StadiumDetails({ activeMatch }: StadiumDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4.5 w-4.5 text-indigo-400" /> Stadium Configuration
        </CardTitle>
        <CardDescription>Telemetry nodes & regional parameters.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-slate-950/40 p-4 border border-slate-900 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Seating Capacity</span>
            <span className="font-bold text-slate-200">{activeMatch.attendance.toLocaleString()} seats</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Regional Climate Profile</span>
            <span className="font-bold text-slate-200">Subtropical Highland</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Dynamic Sensor Nodes</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> 108 online
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Gate Status Indices</span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {GATE_NAMES.map(gate => (
              <div key={gate} className="rounded-lg border border-slate-800 bg-slate-900/30 p-2 flex justify-between">
                <span className="text-slate-400">{gate}</span>
                <span className="text-emerald-400 font-bold">NORMAL</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
