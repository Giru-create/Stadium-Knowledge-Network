import { useEffect, useCallback } from 'react';
import { Match, Stadium, IncidentEvent } from '@/types';
import {
  authService,
  stadiumService,
  matchService,
  playbookService,
  incidentService,
  recommendationService,
  getPlatformMode,
} from '@/lib/firebase';

interface UseRealtimeDataParams {
  setUser: React.Dispatch<React.SetStateAction<import('@/types').UserProfile | null>>;
  setStadiums: React.Dispatch<React.SetStateAction<Stadium[]>>;
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  setActiveMatch: React.Dispatch<React.SetStateAction<Match | null>>;
  setIncidents: React.Dispatch<React.SetStateAction<import('@/types').IncidentEvent[]>>;
  setPlaybooks: React.Dispatch<React.SetStateAction<import('@/types').Playbook[]>>;
  setRecommendations: React.Dispatch<React.SetStateAction<import('@/types').AIRecommendation[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPlatformMode: React.Dispatch<React.SetStateAction<'LIVE' | 'SANDBOX'>>;
  activeMatch: Match | null;
}

/** Maps incident types to zone-level occupancy impacts. */
function applyIncidentZoneImpacts(zones: Stadium['zones'], activeIncidentTypes: string[]) {
  return zones.map((z) => {
    let status = z.status;
    let occupancy = z.occupancy;

    if (activeIncidentTypes.includes('Heavy Rain') && z.id === 'z4') {
      status = 'Congested';
      occupancy = 92;
    } else if (activeIncidentTypes.includes('Food Queue') && z.id === 'z4') {
      status = 'Critical';
      occupancy = 98;
    } else if (activeIncidentTypes.includes('Gate Closed') && z.id === 'z3') {
      status = 'Critical';
      occupancy = 95;
    } else if (activeIncidentTypes.includes('Large Crowd') && z.id === 'z1') {
      status = 'Congested';
      occupancy = 88;
    } else if (activeIncidentTypes.length === 0) {
      status = 'Normal';
      occupancy = Math.floor(Math.random() * 20) + 30;
    }

    return { ...z, status, occupancy };
  });
}

/**
 * Manages real-time Firestore subscriptions, zone-impact side effects,
 * and the initial data load triggered by auth state changes.
 *
 * This hook has no return value — it is purely side-effect driven.
 */
export function useRealtimeData({
  setUser,
  setStadiums,
  setMatches,
  setActiveMatch,
  setIncidents,
  setPlaybooks,
  setRecommendations,
  setLoading,
  setPlatformMode,
  activeMatch,
}: UseRealtimeDataParams): void {
  // Initial data load on auth change
  useEffect(() => {
    setPlatformMode(getPlatformMode());

    const unsubscribeAuth = authService.onAuthChanged(async (currentUser) => {
      setUser(currentUser);

      try {
        const [loadedStadiums, loadedMatches, loadedPlaybooks] = await Promise.all([
          stadiumService.getAllStadiums(),
          matchService.getAllMatches(),
          playbookService.getAllPlaybooks(),
        ]);

        setStadiums(loadedStadiums);
        setMatches(loadedMatches);
        setPlaybooks(loadedPlaybooks);

        const liveMatch = loadedMatches.find((m) => m.status === 'Live') || loadedMatches[0];
        if (liveMatch) setActiveMatch(liveMatch);
      } catch {
        console.error('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Updates stadium zone occupancy based on active incident types. */
  const updateStadiumZonesRealtime = useCallback(
    (activeIncidents: IncidentEvent[]) => {
      if (!activeMatch) return;

      const activeIncidentTypes = activeIncidents.filter((i) => i.status === 'Active').map((i) => i.type);

      setStadiums((prev) =>
        prev.map((s) => {
          if (s.id !== activeMatch.stadiumId) return s;
          return { ...s, zones: applyIncidentZoneImpacts(s.zones, activeIncidentTypes) };
        }),
      );
    },
    [activeMatch, setStadiums],
  );

  // Real-time incident + recommendation subscriptions
  useEffect(() => {
    if (!activeMatch) return;

    const unsubscribeIncidents = incidentService.subscribeToIncidents(activeMatch.id, (loadedIncidents) => {
      setIncidents(loadedIncidents);
      updateStadiumZonesRealtime(loadedIncidents);
    });

    const unsubscribeRecommendations = recommendationService.subscribeToRecommendations(
      activeMatch.id,
      (loadedRecs) => {
        setRecommendations(loadedRecs);
      },
    );

    return () => {
      if (unsubscribeIncidents) unsubscribeIncidents();
      if (unsubscribeRecommendations) unsubscribeRecommendations();
    };
  }, [activeMatch, updateStadiumZonesRealtime, setIncidents, setRecommendations]);
}
