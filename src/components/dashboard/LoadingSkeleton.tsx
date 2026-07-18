import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCardSkeleton, RecommendationSkeleton } from '@/components/ui/Skeleton';

export function DashboardLoadingSkeleton() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8" role="status" aria-label="Loading dashboard data">
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
