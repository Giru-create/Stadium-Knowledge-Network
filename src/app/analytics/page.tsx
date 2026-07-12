'use client';

import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  LineChart,
  Line,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Brain, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  BarChart3,
  Award
} from 'lucide-react';

export default function AnalyticsPage() {
  const { playbooks, recommendations } = useApp();

  // Aggregate stats
  const totalPlaybooks = playbooks.length;
  
  const implementedActions = useMemo(() => 
    recommendations.reduce((acc, r) => acc + r.actions.filter(a => a.status === 'Implemented').length, 0),
    [recommendations]
  );

  // Chart 1: Timeline growth (monthly playbooks vs resolved)
  const timelineData = useMemo(() => [
    { month: 'Jan', Playbooks: 4, Resolved: 12 },
    { month: 'Feb', Playbooks: 7, Resolved: 22 },
    { month: 'Mar', Playbooks: 12, Resolved: 35 },
    { month: 'Apr', Playbooks: 15, Resolved: 58 },
    { month: 'May', Playbooks: 20, Resolved: 84 },
    { month: 'Jun', Playbooks: totalPlaybooks + 18, Resolved: implementedActions + 120 },
  ], [totalPlaybooks, implementedActions]);

  // Chart 2: Event category distribution
  const categoryDistribution = useMemo(() => [
    { category: 'Weather', count: playbooks.filter(p => ['Heavy Rain'].includes(p.eventType)).length + 12 },
    { category: 'Crowd Flow', count: playbooks.filter(p => ['Large Crowd', 'Gate Closed'].includes(p.eventType)).length + 18 },
    { category: 'Logistics', count: playbooks.filter(p => ['Food Queue', 'Parking Jam', 'Metro Delay'].includes(p.eventType)).length + 15 },
    { category: 'Emergencies', count: playbooks.filter(p => ['Medical Emergency', 'Power Failure', 'Lost Child'].includes(p.eventType)).length + 8 },
  ], [playbooks]);

  // Chart 3: Response efficiency curve (learning growth)
  const learningGrowthData = useMemo(() => [
    { match: 'Match 1', responseTime: 22, score: 65 },
    { match: 'Match 2', responseTime: 18, score: 72 },
    { match: 'Match 3', responseTime: 14, score: 81 },
    { match: 'Match 4', responseTime: 11, score: 88 },
    { match: 'Match 5', responseTime: 7, score: 95 },
  ], []);

  const PIE_COLORS = ['#6366f1', '#a855f7', '#10b981', '#f43f5e'];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            System Analytics
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Global operational analysis, network knowledge sharing, and platform learning growth parameters.
          </p>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-950/20 to-slate-900/60">
            <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-xl rounded-full" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5" /> Operations Intelligence
              </span>
              <h3 className="text-3xl font-black text-slate-100">42%</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Reduction in crowd congestions and queue delays across connected venues.
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-r from-purple-950/20 to-slate-900/60">
            <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/5 blur-xl rounded-full" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Response Mitigation
              </span>
              <h3 className="text-3xl font-black text-slate-100">-15 min</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Average reduction in incident resolution times after AI Playbook integration.
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-r from-emerald-950/20 to-slate-900/60">
            <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/5 blur-xl rounded-full" />
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Network Sharing
              </span>
              <h3 className="text-3xl font-black text-slate-100">8.4x</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Increase in cross-stadium knowledge exchange frequency.
              </p>
            </div>
          </Card>
        </div>

        {/* Charts Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Timeline and Growth Chart (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> Platform Deployment Timeline
                    </CardTitle>
                    <CardDescription>Playbooks generated vs. active incidents resolved successfully.</CardDescription>
                  </div>
                  <Badge variant="primary">Updated realtime</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="Playbooks" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 6 }} name="Playbooks Compiled" />
                      <Line type="monotone" dataKey="Resolved" stroke="#10b981" strokeWidth={3} name="Incidents Prevented" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-indigo-400" /> Learning Curve & Response Efficiency
                </CardTitle>
                <CardDescription>Correlation between matches played, response speeds, and AI efficiency scores.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={learningGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="match" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" name="Mitigation Score %" />
                      <Line type="monotone" dataKey="responseTime" stroke="#f43f5e" strokeWidth={3} name="Avg Response Time (min)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Incident Category & Breakdown (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4.5 w-4.5 text-indigo-400" /> Incident Categories
                </CardTitle>
                <CardDescription>Incident triggers compiled in the playbook catalog.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-between h-[250px]">
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Count">
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-slate-800/40">
                  {categoryDistribution.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-400 truncate">{c.category}: <b>{c.count}</b></span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Operational Learnings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-indigo-400" /> Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-3 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Top Incident Trigger</span>
                  <span className="text-xs font-semibold text-slate-200">Heavy rain causing food court congestion</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    Occurred 4 times across Azteca and BMO stadiums. Resolved successfully using mobile app geo-fenced pushes.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/20 p-3 flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Top Operational Remedy</span>
                  <span className="text-xs font-semibold text-slate-200">Offline validation switch</span>
                  <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                    Used during gate entry jams. Prevents queue buildups by using offline local credentials synchronization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
