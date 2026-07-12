'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Radio, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function MapPage() {
  const { activeMatch, stadiums, triggerIncidentSimulation, incidents } = useApp();
  const [selectedZoneId, setSelectedZoneId] = useState<string>('z1');

  // Find active stadium metadata
  const activeStadium = stadiums.find(s => s.id === activeMatch?.stadiumId) || stadiums[0];
  
  if (!activeStadium) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-slate-500">No active stadium data available.</div>
      </DashboardLayout>
    );
  }

  const selectedZone = activeStadium.zones.find(z => z.id === selectedZoneId) || activeStadium.zones[0];
  const activeIncidentTypes = incidents.filter(i => i.status === 'Active').map(i => i.type);

  // Status-to-color mapping for SVG fill
  const getZoneColor = (status: 'Normal' | 'Congested' | 'Warning' | 'Critical') => {
    switch (status) {
      case 'Normal':
        return 'fill-emerald-500/20 stroke-emerald-500/60 hover:fill-emerald-500/35';
      case 'Congested':
        return 'fill-amber-500/25 stroke-amber-500/60 hover:fill-amber-500/40';
      case 'Warning':
        return 'fill-amber-600/30 stroke-amber-500/70 hover:fill-amber-600/45';
      case 'Critical':
        return 'fill-rose-500/30 stroke-rose-500/70 hover:fill-rose-500/50 animate-pulse-glow';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Interactive Stadium Map
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            2D Vector telemetry monitor. Click zones to inspect occupancy grids and deploy AI SOPs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: SVG Stadium Plan (7 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="flex flex-col items-center justify-center p-8 bg-slate-900/40 relative min-h-[450px]">
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live Broadcast</span>
                <span className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Radio className="h-4 w-4 text-rose-500 animate-pulse" /> {activeStadium.name}
                </span>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 flex items-center gap-4 text-[10px] text-slate-400 font-semibold bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500/30 border border-emerald-500" /> Normal</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500/40 border border-amber-500" /> Congested</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500/40 border border-rose-500 animate-pulse" /> Critical</span>
              </div>

              {/* SVG Map */}
              <svg viewBox="0 0 500 500" className="w-full max-w-[380px] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
                {/* Outer Ring */}
                <circle cx="250" cy="250" r="230" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 8" opacity="0.3" />
                
                {/* Stadium Outer Bowl */}
                <ellipse cx="250" cy="250" rx="200" ry="170" fill="rgba(15, 23, 42, 0.6)" stroke="#475569" strokeWidth="4" />

                {/* Zone 1: North Plaza (Top Arc) */}
                <path 
                  d="M 120 135 A 200 170 0 0 1 380 135 L 340 165 A 150 120 0 0 0 160 165 Z" 
                  className={`cursor-pointer transition-all duration-300 ${getZoneColor(activeStadium.zones[0].status)}`}
                  onClick={() => setSelectedZoneId('z1')}
                />
                
                {/* Zone 2: East Concourse (Right Arc) */}
                <path 
                  d="M 380 135 A 200 170 0 0 1 380 365 L 340 335 A 150 120 0 0 0 340 165 Z" 
                  className={`cursor-pointer transition-all duration-300 ${getZoneColor(activeStadium.zones[1].status)}`}
                  onClick={() => setSelectedZoneId('z2')}
                />

                {/* Zone 3: North Entrance Gate (Bottom Arc) */}
                <path 
                  d="M 380 365 A 200 170 0 0 1 120 365 L 160 335 A 150 120 0 0 0 340 335 Z" 
                  className={`cursor-pointer transition-all duration-300 ${getZoneColor(activeStadium.zones[2].status)}`}
                  onClick={() => setSelectedZoneId('z3')}
                />

                {/* Zone 4: South Concourse / Concession Hall (Left Arc) */}
                <path 
                  d="M 120 365 A 200 170 0 0 1 120 135 L 160 165 A 150 120 0 0 0 160 335 Z" 
                  className={`cursor-pointer transition-all duration-300 ${getZoneColor(activeStadium.zones[3].status)}`}
                  onClick={() => setSelectedZoneId('z4')}
                />

                {/* The Pitch (Center Green) */}
                <ellipse cx="250" cy="250" rx="100" ry="70" fill="#1e293b" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
                <ellipse cx="250" cy="250" rx="80" ry="50" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3" opacity="0.6" />
                
                {/* Center Circle */}
                <circle cx="250" cy="250" r="20" fill="none" stroke="#6366f1" strokeWidth="2" opacity="0.8" />
                
                {/* Text Labels */}
                <text x="250" y="90" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">NORTH PLAZA</text>
                <text x="390" y="255" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" transform="rotate(90, 390, 255)">EAST CONCOURSE</text>
                <text x="250" y="420" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">SOUTH ENTRY</text>
                <text x="110" y="255" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" transform="rotate(-90, 110, 255)">FOOD QUADRANT</text>
              </svg>
            </Card>
          </div>

          {/* Right: Zone Metadata and Trigger (5 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedZone.name}</CardTitle>
                  <Badge variant={
                    selectedZone.status === 'Normal' ? 'success' : 
                    selectedZone.status === 'Congested' ? 'warning' : 'danger'
                  }>
                    {selectedZone.status}
                  </Badge>
                </div>
                <CardDescription>Zone telemetry logs & sensor indicators.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Users className="h-3 w-3" /> Density Level
                    </span>
                    <span className="text-base font-black text-slate-100">{selectedZone.occupancy}%</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Flow Index
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      {selectedZone.status === 'Normal' ? 'OPTIMAL' : 'SLUGGISH'}
                    </span>
                  </div>
                </div>

                {/* Specific details depending on selected zone */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Sector Warnings</span>
                  {selectedZone.id === 'z4' && activeIncidentTypes.includes('Heavy Rain') ? (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 flex gap-2.5 items-start text-xs text-rose-400">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <div>
                        <span className="font-bold">Weather Relocation Congestion</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                          Fans escaping rain on main seating bowl are packing Concourse B Food Stalls.
                        </p>
                      </div>
                    </div>
                  ) : selectedZone.id === 'z3' && activeIncidentTypes.includes('Gate Closed') ? (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 flex gap-2.5 items-start text-xs text-rose-400">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <div>
                        <span className="font-bold">Hardware Validation Failure</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                          Entry Gate turnstiles offline. Inbound crowd backing up at plazas.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 py-2">
                      No active anomalies localized in this sector.
                    </div>
                  )}
                </div>

                {/* Quick actions for this zone */}
                <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-800/40">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Deploy Zone Test Anomalies</span>
                  {selectedZone.id === 'z4' ? (
                    <div className="flex flex-col gap-2">
                      <Button variant="secondary" size="sm" onClick={() => triggerIncidentSimulation('Heavy Rain', 'Sudden cloudburst above concession hall.')}>
                        Simulate Rain Congestion
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => triggerIncidentSimulation('Food Queue', 'Tacobar East checkout terminal offline.')}>
                        Simulate Queue Backlog
                      </Button>
                    </div>
                  ) : selectedZone.id === 'z3' ? (
                    <Button variant="secondary" size="sm" onClick={() => triggerIncidentSimulation('Gate Closed', 'Local network switch outage at main entrance.')}>
                      Simulate Gate Closed
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => triggerIncidentSimulation('Large Crowd', 'Group booking arrival bottleneck.')}>
                      Simulate Crowd Pressure
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
