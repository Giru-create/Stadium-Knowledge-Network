'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrendingUp } from 'lucide-react';
import type { TimelinePoint } from '@/utils/analytics';

interface TimelineChartProps {
  data: TimelinePoint[];
}

const TOOLTIP_STYLE = { backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' };

/**
 * Line chart showing the monthly growth of compiled playbooks versus resolved incidents.
 * Accepts pre-computed `data` from the parent hook.
 */
export function TimelineChart({ data }: TimelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-400" /> Platform Deployment Timeline
            </CardTitle>
            <CardDescription>
              Playbooks generated vs. active incidents resolved successfully.
            </CardDescription>
          </div>
          <Badge variant="primary">Updated realtime</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="Playbooks"
                stroke="#6366f1"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                name="Playbooks Compiled"
              />
              <Line
                type="monotone"
                dataKey="Resolved"
                stroke="#10b981"
                strokeWidth={3}
                name="Incidents Prevented"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
