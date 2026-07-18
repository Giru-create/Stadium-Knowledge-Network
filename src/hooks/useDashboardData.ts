import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { AIRecommendation, Playbook } from '@/types';

function filterIncidentsByStatus(incidents: ReturnType<typeof useApp>['incidents'], status: 'Active' | 'Resolved') {
  return incidents.filter(i => i.status === status);
}

function computeAverageConfidence(playbooks: Playbook[]): number {
  if (playbooks.length === 0) return 0;
  const total = playbooks.reduce((sum, p) => sum + p.confidenceScore, 0);
  return Math.round(total / playbooks.length);
}

function countImplementedActions(recommendations: AIRecommendation[]): number {
  return recommendations.reduce(
    (count, rec) => count + rec.actions.filter(a => a.status === 'Implemented').length,
    0,
  );
}

export function useDashboardData() {
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
    loading,
  } = useApp();

  const activeIncidents = useMemo(() => filterIncidentsByStatus(incidents, 'Active'), [incidents]);
  const resolvedIncidents = useMemo(() => filterIncidentsByStatus(incidents, 'Resolved'), [incidents]);
  const avgConfidence = useMemo(() => computeAverageConfidence(playbooks), [playbooks]);
  const implementedActionsCount = useMemo(() => countImplementedActions(recommendations), [recommendations]);

  return {
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
  };
}
