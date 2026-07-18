'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardLoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { AdvisoryPanel } from '@/components/dashboard/AdvisoryPanel';
import { CrowdFlowChart } from '@/components/dashboard/CrowdFlowChart';
import { ActiveIncidentsLog } from '@/components/dashboard/ActiveIncidentsLog';
import { StadiumDetails } from '@/components/dashboard/StadiumDetails';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardPage() {
  const {
    stadiums,
    matches,
    activeMatch,
    activeIncidents,
    resolvedIncidents,
    playbooks,
    recommendations,
    avgConfidence,
    implementedActionsCount,
    changeActiveMatch,
    resolveActiveIncident,
    updateActionItemStatus,
    loading,
  } = useDashboardData();

  if (loading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <DashboardHeader
          matches={matches}
          activeMatchId={activeMatch?.id}
          onMatchChange={changeActiveMatch}
        />

        <StatCards
          stadiumCount={stadiums.length}
          playbookCount={playbooks.length}
          avgConfidence={avgConfidence}
          activeIncidentCount={activeIncidents.length}
          resolvedIncidentCount={resolvedIncidents.length}
          implementedActionsCount={implementedActionsCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AdvisoryPanel
              recommendations={recommendations}
              onUpdateAction={updateActionItemStatus}
            />
            <CrowdFlowChart />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-8">
            <ActiveIncidentsLog
              activeIncidents={activeIncidents}
              activeMatch={activeMatch}
              onResolve={resolveActiveIncident}
            />
            {activeMatch && <StadiumDetails activeMatch={activeMatch} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
