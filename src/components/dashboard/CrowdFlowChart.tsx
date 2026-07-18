import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { crowdFlowData } from '@/utils/chartData';

export function CrowdFlowChart() {
  return (
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
            <AreaChart data={crowdFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
  );
}
