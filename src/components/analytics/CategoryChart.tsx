'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';
import type { CategoryPoint } from '@/utils/analytics';

interface CategoryChartProps {
  data: CategoryPoint[];
  colors: readonly string[];
}

const TOOLTIP_STYLE = { backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' };

/**
 * Vertical bar chart displaying the distribution of incident categories
 * across all compiled playbooks, with a legend footer.
 */
export function CategoryChart({ data, colors }: CategoryChartProps) {
  return (
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
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Count">
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-slate-800/40">
          {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <span className="text-slate-400 truncate">
                {entry.category}: <b>{entry.count}</b>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
