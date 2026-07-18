'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SummaryCards } from '@/components/analytics/SummaryCards';
import { TimelineChart } from '@/components/analytics/TimelineChart';
import { LearningCurveChart } from '@/components/analytics/LearningCurveChart';
import { CategoryChart } from '@/components/analytics/CategoryChart';
import { InsightsPanel } from '@/components/analytics/InsightsPanel';

/**
 * Analytics page — responsible only for layout composition.
 * All data is derived through `useAnalytics`; chart and card
 * components are fully self-contained and prop-driven.
 */
export default function AnalyticsPage() {
  const { timelineData, categoryDistribution, learningData, PIE_COLORS } =
    useAnalytics();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            System Analytics
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Global operational analysis, network knowledge sharing, and platform
            learning growth parameters.
          </p>
        </div>

        {/* Summary stats */}
        <SummaryCards />

        {/* Charts split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left column — timeline + learning curve */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <TimelineChart data={timelineData} />
            <LearningCurveChart data={learningData} />
          </div>

          {/* Right column — category distribution + insights */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <CategoryChart data={categoryDistribution} colors={PIE_COLORS} />
            <InsightsPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
