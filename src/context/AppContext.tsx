'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  UserRole,
  Stadium, 
  Match, 
  IncidentEvent, 
  Playbook, 
  AIRecommendation,
  IncidentType,
  SeverityLevel
} from '../types';
import { 
  authService, 
  stadiumService, 
  matchService, 
  incidentService, 
  playbookService, 
  recommendationService,
  telemetryService,
  getPlatformMode
} from '../lib/firebase';
import { aiEngineService } from '../lib/gemini';

interface AppContextType {
  user: UserProfile | null;
  stadiums: Stadium[];
  matches: Match[];
  activeMatch: Match | null;
  incidents: IncidentEvent[];
  playbooks: Playbook[];
  recommendations: AIRecommendation[];
  loading: boolean;
  platformMode: 'LIVE' | 'SANDBOX';
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<boolean>;
  changeActiveMatch: (matchId: string) => void;
  triggerIncidentSimulation: (eventType: IncidentType, customDescription?: string) => Promise<void>;
  resolveActiveIncident: (incidentId: string) => Promise<void>;
  updateActionItemStatus: (recId: string, actionIndex: number, status: 'Pending' | 'In Progress' | 'Implemented') => Promise<void>;
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
  const [platformMode, setPlatformMode] = useState<'LIVE' | 'SANDBOX'>('SANDBOX');

  // Load initial static/dynamic meta details
  useEffect(() => {
    setPlatformMode(getPlatformMode());

    // Listen for Auth changes
    const unsubscribeAuth = authService.onAuthChanged(async (currentUser) => {
      setUser(currentUser);
      
      // If user logged in, load core database items
      try {
        const loadedStadiums = await stadiumService.getAllStadiums();
        const loadedMatches = await matchService.getAllMatches();
        const loadedPlaybooks = await playbookService.getAllPlaybooks();
        
        setStadiums(loadedStadiums);
        setMatches(loadedMatches);
        setPlaybooks(loadedPlaybooks);

        // Auto-select the first Live match, or first Scheduled match
        const liveMatch = loadedMatches.find(m => m.status === 'Live') || loadedMatches[0];
        if (liveMatch) {
          setActiveMatch(liveMatch);
        }
      } catch (err) {
        console.error("Failed to load initial data from DB", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, []);

  // Dynamically reflect incident impacts in stadium zone occupancy
  const updateStadiumZonesRealtime = useCallback((activeIncidents: IncidentEvent[]) => {
    if (!activeMatch) return;
    
    // Default zones
    const activeIncidentTypes = activeIncidents.filter(i => i.status === 'Active').map(i => i.type);
    
    setStadiums(prev => prev.map(s => {
      if (s.id !== activeMatch.stadiumId) return s;
      
      const updatedZones = s.zones.map(z => {
        let status = z.status;
        let occupancy = z.occupancy;
        
        if (activeIncidentTypes.includes('Heavy Rain') && z.id === 'z4') {
          // Food court gets congested
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
          // Clear up
          status = 'Normal';
          occupancy = Math.floor(Math.random() * 20) + 30; // Random baseline
        }
        return { ...z, status, occupancy };
      });
      
      return { ...s, zones: updatedZones };
    }));
  }, [activeMatch]);

  // Listen to incidents and recommendations when active match changes
  useEffect(() => {
    if (!activeMatch) return;

    // Real-time listener for incidents of this match
    const unsubscribeIncidents = incidentService.subscribeToIncidents(activeMatch.id, (loadedIncidents) => {
      setIncidents(loadedIncidents);
      
      // Side effect: update stadium zone status occupancy based on incident density
      updateStadiumZonesRealtime(loadedIncidents);
    });

    // Real-time listener for recommendations
    const unsubscribeRecommendations = recommendationService.subscribeToRecommendations(activeMatch.id, (loadedRecs) => {
      setRecommendations(loadedRecs);
    });

    return () => {
      if (unsubscribeIncidents) unsubscribeIncidents();
      if (unsubscribeRecommendations) unsubscribeRecommendations();
    };
  }, [activeMatch, updateStadiumZonesRealtime]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const profile = await authService.login(email, password);
      if (profile) {
        setUser(profile);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login failed', e);
      return false;
    }
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const signUp = useCallback(async (email: string, password: string, displayName: string, role: UserRole): Promise<boolean> => {
    try {
      const profile = await authService.signUp(email, password, displayName, role);
      if (profile) {
        setUser(profile);
        return true;
      }
      return false;
    } catch (e) {
      console.error('SignUp failed', e);
      return false;
    }
  }, []);

  const changeActiveMatch = (matchId: string) => {
    const found = matches.find(m => m.id === matchId);
    if (found) {
      setActiveMatch(found);
    }
  };

  const reloadPlaybooks = async () => {
    const pbs = await playbookService.getAllPlaybooks();
    setPlaybooks(pbs);
  };

  /**
   * The Simulator Engine Linkage
   */
  const triggerIncidentSimulation = async (eventType: IncidentType, customDescription?: string) => {
    if (!activeMatch) return;

    // 1. Establish Severity
    let severity: SeverityLevel = 'Medium';
    if (['Power Failure', 'Medical Emergency', 'Lost Child'].includes(eventType)) {
      severity = 'Critical';
    } else if (['Heavy Rain', 'Gate Closed', 'Large Crowd'].includes(eventType)) {
      severity = 'High';
    }

    const description = customDescription || `Simulated ${eventType} alert reported in active sector. Sensor logs indicate sudden surge.`;

    // 2. Create and Save Incident in DB
    const newIncident = await incidentService.createIncident({
      matchId: activeMatch.id,
      stadiumId: activeMatch.stadiumId,
      stadiumName: activeMatch.stadiumName,
      type: eventType,
      severity,
      description,
      status: 'Active',
      timestamp: new Date().toISOString()
    });

    // 3. Log Specific Telemetry Category (Firestore sub-tables)
    await logTelemetryCategory(eventType);

    // 4. Query Playbook Library for Similar Incidents
    let matchingPlaybook = playbooks.find(p => p.eventType === eventType);

    // 5. If no playbook exists in history, generate a new one via AI (Gemini or Mock)
    if (!matchingPlaybook) {
      matchingPlaybook = await aiEngineService.generatePlaybook(
        activeMatch.id,
        activeMatch.stadiumId,
        activeMatch.stadiumName,
        eventType,
        description
      );
      // Reload playbook library so it shows up
      await reloadPlaybooks();
    }

    // 6. Generate Live Advisor Recommendations pointing back to the playbook
    await aiEngineService.generateRecommendation(
      activeMatch.id,
      activeMatch.stadiumId,
      newIncident.id,
      eventType,
      description,
      matchingPlaybook
    );
  };

  // Helper to log corresponding category telemetries
  const logTelemetryCategory = async (eventType: IncidentType) => {
    if (!activeMatch) return;
    const common = { stadiumId: activeMatch.stadiumId, matchId: activeMatch.id };
    
    switch (eventType) {
      case 'Heavy Rain':
        await telemetryService.logTelemetry('weather', { ...common, temperature: 18, precipitation: 32, windSpeed: 25, condition: 'Heavy Rain' });
        break;
      case 'Large Crowd':
        await telemetryService.logTelemetry('crowd', { ...common, zone: 'Zone A', density: 95, flowRate: 350, gateId: 'Gate A' });
        break;
      case 'Food Queue':
        await telemetryService.logTelemetry('food', { ...common, outletId: 'food-2', outletName: 'Tacobar East', queueLength: 42, averageWaitTime: 2400, transactionRate: 15 });
        break;
      case 'Parking Jam':
        await telemetryService.logTelemetry('parking', { ...common, lotId: 'Lot C', capacity: 1500, occupied: 1490, status: 'Full' });
        break;
      case 'Volunteer Shortage':
        await telemetryService.logTelemetry('volunteers', { ...common, totalAssigned: 50, active: 30, checkedIn: 32, missingZones: ['Sector East', 'Gate D'] });
        break;
      case 'Metro Delay':
        await telemetryService.logTelemetry('transport', { ...common, shuttleStatus: 'Delayed', metroDelayMinutes: 35, rideShareWaitTime: 45, pedestrianFlowRate: 280 });
        break;
      case 'Power Failure':
        await telemetryService.logTelemetry('energy', { ...common, consumptionKW: 4200, generatorLoad: 88, gridStatus: 'Failing', gridUsagePercentage: 12 });
        break;
      case 'Gate Closed':
        await telemetryService.logTelemetry('crowd', { ...common, zone: 'Gate B Plaza', density: 98, flowRate: 10, gateId: 'Gate B' });
        break;
      default:
        break;
    }
  };

  const resolveActiveIncident = async (incidentId: string) => {
    await incidentService.resolveIncident(incidentId);
    // If the incident has active recommendations, mark their actions as Implemented
    const relatedRecs = recommendations.filter(r => r.incidentId === incidentId);
    for (const rec of relatedRecs) {
      for (let i = 0; i < rec.actions.length; i++) {
        await recommendationService.updateActionStatus(rec.id, i, 'Implemented');
      }
    }
  };

  const updateActionItemStatus = async (recId: string, actionIndex: number, status: 'Pending' | 'In Progress' | 'Implemented') => {
    await recommendationService.updateActionStatus(recId, actionIndex, status);
  };

  const addStadium = useCallback(async (stadiumData: Omit<Stadium, 'id'>): Promise<Stadium> => {
    const newStadium = await stadiumService.createStadium(stadiumData);
    setStadiums(prev => [...prev, newStadium]);
    return newStadium;
  }, []);

  return (
    <AppContext.Provider
      value={{
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
        addStadium
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
