'use client';

import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IncidentCard } from '@/components/common/IncidentCard';
import { StatCardSkeleton, RecommendationSkeleton } from '@/components/ui/Skeleton';
import { 
  Building2, 
  BookOpen, 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function DashboardPage() {
  const { 
    stadiums, 
    matches, 
    activeMatch, 
    incidents, 
    playbooks, 
    recommendations,
    changeActiveMatch,
    resolveActiveIncident,
    updateActionItemStatus,
    loading
  } = useApp();

  const activeIncidents = useMemo(() => incidents.filter(i => i.status === 'Active'), [incidents]);
  const resolvedIncidents = useMemo(() => incidents.filter(i => i.status === 'Resolved'), [incidents]);
  
  // Calculate average confidence score of playbooks
  const avgConfidence = useMemo(() => 
    playbooks.length > 0 
      ? Math.round(playbooks.reduce((acc, p) => acc + p.confidenceScore, 0) / playbooks.length) 
      : 0,
  [playbooks]);

  // Mock chart data for crowd flow
  const chartData = [
    { time: '17:00', density: 12, flowRate: 80 },
    { time: '17:30', density: 25, flowRate: 150 },
    { time: '18:00', density: 48, flowRate: 280 },
    { time: '18:30', density: 65, flowRate: 310 },
    { time: '19:00', density: 78, flowRate: 390 }, // Kickoff
    { time: '19:30', density: 82, flowRate: 120 },
    { time: '20:00', density: 84, flowRate: 95 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-slate-800/20 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-48 bg-slate-800/20 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-8">
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
                <div className="h-6 w-48 bg-slate-800/40 rounded-lg animate-pulse" />
                <RecommendationSkeleton />
                <RecommendationSkeleton />
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-6">
                <div className="h-6 w-32 bg-slate-800/40 rounded-lg animate-pulse" />
                <div className="h-20 w-full bg-slate-800/20 rounded-xl animate-pulse" />
                <div className="h-20 w-full bg-slate-800/20 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Upper Header Welcome */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              Operational Command
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Active Monitoring, AI Incident Advisory, and Stadium Knowledge Sharing.
            </p>
          </div>

          {/* Quick Match Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Match:</span>
            <select
              value={activeMatch?.id || ''}
              onChange={(e) => changeActiveMatch(e.target.value)}
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

        {/* Global Platform Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connected Stadiums</span>
                <span className="text-2xl font-black text-slate-100">{stadiums.length}</span>
              </div>
              <div className="rounded-xl bg-indigo-500/10 p-2.5 text-indigo-400 border border-indigo-500/10">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] text-indigo-400 font-bold">
              <span>All FIFA systems sync active</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Playbooks Library</span>
                <span className="text-2xl font-black text-slate-100">{playbooks.length}</span>
              </div>
              <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400 border border-purple-500/10">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] text-purple-400 font-bold">
              <span>{avgConfidence}% Avg Confidence Rating</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Operations Alerts</span>
                <span className="text-2xl font-black text-slate-100">{activeIncidents.length}</span>
              </div>
              <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-400 border border-rose-500/10">
                <AlertTriangle className={`h-5 w-5 ${activeIncidents.length > 0 ? 'animate-pulse' : ''}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] text-rose-400 font-bold">
              <span>{resolvedIncidents.length} incidents resolved today</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Actions Implemented</span>
                <span className="text-2xl font-black text-slate-100">
                  {recommendations.reduce((acc, r) => acc + r.actions.filter(a => a.status === 'Implemented').length, 0)}
                </span>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/10">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] text-emerald-400 font-bold">
              <span>Continuous mitigation online</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </div>
          </Card>
        </div>

        {/* Dashboard Split Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live incidents and advisory checklist (7 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Real-time AI advisory panel */}
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-4.5 w-4.5 text-indigo-400 animate-pulse" /> Live AI Operations Advisory
                    </CardTitle>
                    <CardDescription>
                      Proactive operational adjustments generated automatically based on sensor inputs.
                    </CardDescription>
                  </div>
                  <Badge variant="primary" className="text-[10px]">Real-time recommendations</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10">
                    <p className="text-xs text-slate-500">
                      System stable. Adjust match parameters in the <b>Event Simulator</b> to trigger anomalies and view AI advice.
                    </p>
                  </div>
                ) : (
                  recommendations.slice(0, 3).map(rec => (
                    <div key={rec.id} className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 flex flex-col gap-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500" />
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200">{rec.title}</span>
                            <Badge variant="info" className="text-[8px] px-1 py-0">{rec.eventType}</Badge>
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                            Linked to Playbook: <span className="text-indigo-400 font-bold">{rec.playbookTitle}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/30 p-3 rounded-xl border border-slate-800/40">
                        {rec.explanation}
                      </p>

                      {/* Actions checklist */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Required Operational Actions</span>
                        {rec.actions.map((act, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/20 px-4 py-2.5 text-xs">
                            <span className="text-slate-300 font-medium max-w-[70%]">{act.action}</span>
                            <div className="flex items-center gap-2">
                              {act.status === 'Implemented' ? (
                                <Badge variant="success">Implemented</Badge>
                              ) : (
                                <>
                                  <Button 
                                    variant="secondary" 
                                    size="sm"
                                    onClick={() => updateActionItemStatus(rec.id, idx, 'In Progress')}
                                    disabled={act.status === 'In Progress'}
                                    className="px-2 py-1 text-[10px]"
                                  >
                                    {act.status === 'In Progress' ? 'In Progress' : 'Deploy'}
                                  </Button>
                                  <Button 
                                    variant="emerald" 
                                    size="sm"
                                    onClick={() => updateActionItemStatus(rec.id, idx, 'Implemented')}
                                    className="px-2 py-1 text-[10px]"
                                  >
                                    Done
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Recharts Crowd Flow Graph */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> Live Match Telemetry
                    </CardTitle>
                    <CardDescription>
                      Crowd density fluctuations and gate ingress flow rates.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center text-[10px] text-slate-400 gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" /> Density %</span>
                    <span className="inline-flex items-center text-[10px] text-slate-400 gap-1"><span className="h-2 w-2 rounded-full bg-purple-500" /> Inflow/min</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="density" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorDensity)" name="Density %" />
                      <Area type="monotone" dataKey="flowRate" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorFlow)" name="Inflow/min" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Live Telemetry status details (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Active alerts log */}
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
                        onResolve={resolveActiveIncident}
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

            {/* Stadium Details Card */}
            {activeMatch && (
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
                      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2 flex justify-between">
                        <span className="text-slate-400">Gate A</span>
                        <span className="text-emerald-400 font-bold">NORMAL</span>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2 flex justify-between">
                        <span className="text-slate-400">Gate B</span>
                        <span className="text-emerald-400 font-bold">NORMAL</span>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2 flex justify-between">
                        <span className="text-slate-400">Gate C</span>
                        <span className="text-emerald-400 font-bold">NORMAL</span>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-2 flex justify-between">
                        <span className="text-slate-400">Gate D</span>
                        <span className="text-emerald-400 font-bold">NORMAL</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
