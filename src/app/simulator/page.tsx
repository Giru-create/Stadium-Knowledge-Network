'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  CloudRain, 
  Users, 
  Utensils, 
  Car, 
  Zap, 
  UserMinus, 
  Activity, 
  Accessibility, 
  Users2, 
  Train,
  Terminal,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { IncidentType } from '@/types';
import { IncidentCard } from '@/components/common/IncidentCard';

export default function SimulatorPage() {
  const { 
    activeMatch, 
    triggerIncidentSimulation, 
    recommendations,
    incidents,
    resolveActiveIncident
  } = useApp();

  const [simulatingEvent, setSimulatingEvent] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ time: string, message: string, type: 'info' | 'success' | 'warning' | 'error' }>>([
    { time: new Date().toLocaleTimeString(), message: 'Simulation network initialized. Ready to process triggers.', type: 'info' }
  ]);

  const activeIncidents = incidents.filter(i => i.status === 'Active');

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setConsoleLogs(prev => [
      { time: new Date().toLocaleTimeString(), message, type },
      ...prev
    ]);
  };

  const handleSimulate = async (eventType: IncidentType, label: string) => {
    if (!activeMatch) return;
    setSimulatingEvent(eventType);
    addLog(`Initiating simulator connection for incident: ${label}...`, 'info');

    try {
      // Trigger context simulation which hits Firestore & Gemini/Mock
      await triggerIncidentSimulation(eventType, `Simulated event: ${label} reported in North-East quadrant.`);
      
      addLog(`Incident logged in database collections under '${eventType}' successfully.`, 'success');
      addLog(`Gemini operations analysis triggered automatically. Compiling Playbook.`, 'info');
      
      // Delay feedback a bit to simulate processing
      setTimeout(() => {
        addLog(`AI Operational Playbook successfully compiled. advisory recommendations sent to operators.`, 'success');
        setSimulatingEvent(null);
      }, 1500);

    } catch {
      addLog(`Simulation failure: Failed to sync telemetry with Firestore.`, 'error');
      setSimulatingEvent(null);
    }
  };

  const eventButtons = [
    { type: 'Heavy Rain' as IncidentType, label: 'Heavy Rain', desc: 'Precipitation surge to 30mm/h', icon: CloudRain, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { type: 'Large Crowd' as IncidentType, label: 'Increase Crowd', desc: 'Plaza entry bottlenecks', icon: Users, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { type: 'Food Queue' as IncidentType, label: 'Food Queue Jam', desc: 'Wait times exceed 30 mins', icon: Utensils, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { type: 'Parking Jam' as IncidentType, label: 'Parking Block', desc: 'Lot exit tailbacks', icon: Car, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { type: 'Power Failure' as IncidentType, label: 'Power Outage', desc: 'Main grid fluctuation', icon: Zap, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { type: 'Lost Child' as IncidentType, label: 'Lost Child', desc: 'Child missing in Sector 104', icon: UserMinus, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { type: 'Medical Emergency' as IncidentType, label: 'Medical Alert', desc: 'Heatstroke inside Section C', icon: Activity, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { type: 'Accessibility Request' as IncidentType, label: 'Wheelchair Influx', desc: 'Elevator traffic bottleneck', icon: Accessibility, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { type: 'Volunteer Shortage' as IncidentType, label: 'Staff Shortage', desc: 'Key check gates understaffed', icon: Users2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { type: 'Metro Delay' as IncidentType, label: 'Metro Delays', desc: '35-minute line breakdown', icon: Train, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Event Simulator
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulate operational alerts to test AI Playbook compiles and check live recommendation streams.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Simulation Grid Board (8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Control Board</CardTitle>
                <CardDescription>
                  Select an operational anomaly below to test how the connected stadium databases react.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {eventButtons.map((btn) => {
                    const Icon = btn.icon;
                    const isCurrent = simulatingEvent === btn.type;
                    return (
                      <button
                        key={btn.type}
                        onClick={() => handleSimulate(btn.type, btn.label)}
                        disabled={simulatingEvent !== null}
                        className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-300 relative group cursor-pointer disabled:opacity-50 ${btn.color} hover:scale-[1.02] hover:bg-slate-900/60`}
                        aria-label={`Simulate ${btn.label} incident`}
                      >
                        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <span className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                            {btn.label}
                          </span>
                          <span className="text-xs text-slate-400">{btn.desc}</span>
                        </div>
                        {isCurrent && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/70 backdrop-blur-xs">
                            <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Real-time recommendations preview inside simulator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-4.5 w-4.5 text-indigo-400 animate-pulse" /> Live AI Advisory Stream
                </CardTitle>
                <CardDescription>
                  Recommendations matching triggered alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-900/10 text-xs text-slate-500">
                    No active AI suggestions. Click a trigger above to see live recommendations generate.
                  </div>
                ) : (
                  recommendations.map(rec => (
                    <div key={rec.id} className="rounded-xl border border-slate-800/80 bg-slate-900/25 p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-200">{rec.title}</span>
                          <span className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">Based on Playbook: {rec.playbookTitle}</span>
                        </div>
                        <Badge variant="info">{rec.eventType}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">{rec.explanation}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rec.actions.map((act, i) => (
                          <Badge key={i} variant={act.status === 'Implemented' ? 'success' : 'neutral'} className="text-[9px]">
                            {act.action} ({act.status})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Simulation Logs Terminal (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Logs console */}
            <Card className="flex flex-col flex-1 h-[450px]">
              <CardHeader className="border-b border-slate-800/80 pb-3 mb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-slate-300 font-bold uppercase tracking-wider">
                  <Terminal className="h-4.5 w-4.5 text-indigo-400" /> Simulator Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto font-mono text-[11px] flex flex-col gap-3 pr-2 select-text">
                {consoleLogs.map((log, idx) => {
                  let color = 'text-slate-400';
                  if (log.type === 'success') color = 'text-emerald-400';
                  if (log.type === 'warning') color = 'text-amber-400';
                  if (log.type === 'error') color = 'text-rose-400';
                  return (
                    <div key={idx} className="flex gap-2.5 items-start">
                      <span className="text-slate-500 font-medium whitespace-nowrap">[{log.time}]</span>
                      <span className={`${color} leading-relaxed`}>{log.message}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Currently Active Anomalies list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold">Active Match Incidents</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {activeIncidents.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    🟢 Normal operations
                  </div>
                ) : (
                  activeIncidents.map(inc => (
                    <IncidentCard
                      key={inc.id}
                      incident={inc}
                      onResolve={resolveActiveIncident}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
