'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type {
  UserProfile,
  UserRole,
  Stadium,
  Match,
  IncidentEvent,
  Playbook,
  AIRecommendation,
  IncidentType,
  RecommendationAction,
} from '@/types';
import { stadiumService, playbookService } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useIncidentSimulation } from '@/hooks/useIncidentSimulation';
import { useRealtimeData } from '@/hooks/useRealtimeData';

type PlatformMode = 'LIVE' | 'SANDBOX';
type ActionStatus = RecommendationAction['status'];

interface AppContextType {
  // ── State ────────────────────────────────────────────────────────────────
  user: UserProfile | null;
  stadiums: Stadium[];
  matches: Match[];
  activeMatch: Match | null;
  incidents: IncidentEvent[];
  playbooks: Playbook[];
  recommendations: AIRecommendation[];
  loading: boolean;
  platformMode: PlatformMode;
  // ── Auth handlers ────────────────────────────────────────────────────────
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<boolean>;
  // ── Domain handlers ──────────────────────────────────────────────────────
  changeActiveMatch: (matchId: string) => void;
  triggerIncidentSimulation: (eventType: IncidentType, customDescription?: string) => Promise<void>;
  resolveActiveIncident: (incidentId: string) => Promise<void>;
  updateActionItemStatus: (recId: string, actionIndex: number, status: ActionStatus) => Promise<void>;
  reloadPlaybooks: () => Promise<void>;
  addStadium: (stadium: Omit<Stadium, 'id'>) => Promise<Stadium>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [incidents, setIncidents] = useState<IncidentEvent[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformMode, setPlatformMode] = useState<PlatformMode>('SANDBOX');

  // ── Auth operations ─────────────────────────────────────────────────────
  const { login, logout, signUp } = useAuth({ setUser });

  // ── Incident simulation engine ──────────────────────────────────────────
  const { triggerIncidentSimulation, resolveActiveIncident, updateActionItemStatus } =
    useIncidentSimulation({ activeMatch, playbooks, recommendations, setPlaybooks });

  // ── Firestore subscriptions & initial data load ─────────────────────────
  useRealtimeData({
    setUser, setStadiums, setMatches, setActiveMatch,
    setIncidents, setPlaybooks, setRecommendations,
    setLoading, setPlatformMode, activeMatch,
  });

  // ── Local helpers ───────────────────────────────────────────────────────

  const changeActiveMatch = useCallback(
    (matchId: string) => {
      const found = matches.find((m) => m.id === matchId);
      if (found) setActiveMatch(found);
    },
    [matches],
  );

  const reloadPlaybooks = useCallback(async () => {
    const pbs = await playbookService.getAllPlaybooks();
    setPlaybooks(pbs);
  }, [setPlaybooks]);

  const addStadium = useCallback(async (stadiumData: Omit<Stadium, 'id'>): Promise<Stadium> => {
    const newStadium = await stadiumService.createStadium(stadiumData);
    setStadiums((prev) => [...prev, newStadium]);
    return newStadium;
  }, []);

  // ── Memoised context value ──────────────────────────────────────────────

 const value = useMemo<AppContextType>(
  () => ({
    user,
    stadiums,
    matches,
    activeMatch,
    incidents,
    playbooks,
    recommendations,
    loading,
    platformMode,
    login,
    logout,
    signUp,
    changeActiveMatch,
    triggerIncidentSimulation,
    resolveActiveIncident,
    updateActionItemStatus,
    reloadPlaybooks,
    addStadium,
  }),
  [
    user,
    stadiums,
    matches,
    activeMatch,
    incidents,
    playbooks,
    recommendations,
    loading,
    platformMode,
    login,
    logout,
    signUp,
    changeActiveMatch,
    triggerIncidentSimulation,
    resolveActiveIncident,
    updateActionItemStatus,
    reloadPlaybooks,
    addStadium,
  ]
);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Access the application-wide context.
 *
 * Must be used inside an `<AppProvider>`.
 */
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
