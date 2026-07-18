import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PlaybookCardSkeleton } from '@/components/ui/Skeleton';

/** Full-page loading skeleton shown while initial data loads. */
export function LoadingState() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8" role="status" aria-label="Loading library data">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
            <div className="h-4 w-96 bg-slate-800/20 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-48 bg-slate-800/20 rounded-lg animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PlaybookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
