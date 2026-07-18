'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Award } from 'lucide-react';
import type { LearningPoint } from '@/utils/analytics';

interface LearningCurveChartProps {
  data: LearningPoint[];
}

const TOOLTIP_STYLE = { backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' };

/**
 * Dual-axis area + line chart showing the correlation between matches played,
 * response speed reduction, and AI mitigation score improvement.
 */
export function LearningCurveChart({ data }: LearningCurveChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-4.5 w-4.5 text-indigo-400" /> Learning Curve & Response Efficiency
        </CardTitle>
        <CardDescription>
          Correlation between matches played, response speeds, and AI efficiency scores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="match" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorScore)"
                name="Mitigation Score %"
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#f43f5e"
                strokeWidth={3}
                name="Avg Response Time (min)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
