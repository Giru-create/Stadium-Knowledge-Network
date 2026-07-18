import { useCallback } from 'react';
import { Match, Playbook, AIRecommendation, IncidentType, SeverityLevel } from '@/types';
import { incidentService, recommendationService, telemetryService } from '@/lib/firebase';
import { aiEngineService } from '@/lib/gemini';

interface UseIncidentSimulationParams {
  activeMatch: Match | null;
  playbooks: Playbook[];
  recommendations: AIRecommendation[];
  setPlaybooks: React.Dispatch<React.SetStateAction<Playbook[]>>;
}

interface UseIncidentSimulationReturn {
  triggerIncidentSimulation: (eventType: IncidentType, customDescription?: string) => Promise<void>;
  resolveActiveIncident: (incidentId: string) => Promise<void>;
  updateActionItemStatus: (
    recId: string,
    actionIndex: number,
    status: 'Pending' | 'In Progress' | 'Implemented',
  ) => Promise<void>;
}

/** Maps an incident type to its severity level. */
function resolveSeverity(eventType: IncidentType): SeverityLevel {
  if (['Power Failure', 'Medical Emergency', 'Lost Child'].includes(eventType)) return 'Critical';
  if (['Heavy Rain', 'Gate Closed', 'Large Crowd'].includes(eventType)) return 'High';
  return 'Medium';
}

/** Logs a category-specific telemetry record for the active match. */
async function logTelemetryForEvent(match: Match, eventType: IncidentType): Promise<void> {
  const common = { stadiumId: match.stadiumId, matchId: match.id };

  const telemetryMap: Record<string, () => Promise<void>> = {
    'Heavy Rain': () =>
      telemetryService.logTelemetry('weather', { ...common, temperature: 18, precipitation: 32, windSpeed: 25, condition: 'Heavy Rain' }),
    'Large Crowd': () =>
      telemetryService.logTelemetry('crowd', { ...common, zone: 'Zone A', density: 95, flowRate: 350, gateId: 'Gate A' }),
    'Food Queue': () =>
      telemetryService.logTelemetry('food', { ...common, outletId: 'food-2', outletName: 'Tacobar East', queueLength: 42, averageWaitTime: 2400, transactionRate: 15 }),
    'Parking Jam': () =>
      telemetryService.logTelemetry('parking', { ...common, lotId: 'Lot C', capacity: 1500, occupied: 1490, status: 'Full' }),
    'Volunteer Shortage': () =>
      telemetryService.logTelemetry('volunteers', { ...common, totalAssigned: 50, active: 30, checkedIn: 32, missingZones: ['Sector East', 'Gate D'] }),
    'Metro Delay': () =>
      telemetryService.logTelemetry('transport', { ...common, shuttleStatus: 'Delayed', metroDelayMinutes: 35, rideShareWaitTime: 45, pedestrianFlowRate: 280 }),
    'Power Failure': () =>
      telemetryService.logTelemetry('energy', { ...common, consumptionKW: 4200, generatorLoad: 88, gridStatus: 'Failing', gridUsagePercentage: 12 }),
    'Gate Closed': () =>
      telemetryService.logTelemetry('crowd', { ...common, zone: 'Gate B Plaza', density: 98, flowRate: 10, gateId: 'Gate B' }),
  };

  await telemetryMap[eventType]?.();
}

/**
 * Encapsulates the incident simulation engine: triggering simulations,
 * resolving incidents, and updating action item statuses.
 */
export function useIncidentSimulation({
  activeMatch,
  playbooks,
  recommendations,
  setPlaybooks,
}: UseIncidentSimulationParams): UseIncidentSimulationReturn {
  const triggerIncidentSimulation = useCallback(
    async (eventType: IncidentType, customDescription?: string) => {
      if (!activeMatch) return;

      const severity = resolveSeverity(eventType);
      const description =
        customDescription || `Simulated ${eventType} alert reported in active sector. Sensor logs indicate sudden surge.`;

      const newIncident = await incidentService.createIncident({
        matchId: activeMatch.id,
        stadiumId: activeMatch.stadiumId,
        stadiumName: activeMatch.stadiumName,
        type: eventType,
        severity,
        description,
        status: 'Active',
        timestamp: new Date().toISOString(),
      });

      await logTelemetryForEvent(activeMatch, eventType);

      let matchingPlaybook = playbooks.find((p) => p.eventType === eventType);

      if (!matchingPlaybook) {
        matchingPlaybook = await aiEngineService.generatePlaybook(
          activeMatch.id,
          activeMatch.stadiumId,
          activeMatch.stadiumName,
          eventType,
          description,
        );
        const refreshed = await import('@/services/playbook.service').then((m) => m.playbookService.getAllPlaybooks());
        setPlaybooks(refreshed);
      }

      await aiEngineService.generateRecommendation(
        activeMatch.id,
        activeMatch.stadiumId,
        newIncident.id,
        eventType,
        description,
        matchingPlaybook,
      );
    },
    [activeMatch, playbooks, setPlaybooks],
  );

  const resolveActiveIncident = useCallback(
    async (incidentId: string) => {
      await incidentService.resolveIncident(incidentId);
      const relatedRecs = recommendations.filter((r) => r.incidentId === incidentId);
      for (const rec of relatedRecs) {
        for (let i = 0; i < rec.actions.length; i++) {
          await recommendationService.updateActionStatus(rec.id, i, 'Implemented');
        }
      }
    },
    [recommendations],
  );

  const updateActionItemStatus = useCallback(
    async (recId: string, actionIndex: number, status: 'Pending' | 'In Progress' | 'Implemented') => {
      await recommendationService.updateActionStatus(recId, actionIndex, status);
    },
    [],
  );

  return { triggerIncidentSimulation, resolveActiveIncident, updateActionItemStatus };
}
