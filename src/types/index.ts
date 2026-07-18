export type UserRole = 'Admin' | 'Stadium Manager' | 'Operator';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  stadiumId?: string; // Optional reference if tied to a specific stadium
  createdAt: Date | string;
}

export interface StadiumZone {
  id: string;
  name: string;
  status: 'Normal' | 'Congested' | 'Warning' | 'Critical';
  occupancy: number; // percentage
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  latitude: number;
  longitude: number;
  climate: string;
  zones: StadiumZone[];
  status: 'Online' | 'Maintenance' | 'Offline';
}


export interface Match {
  id: string;
  stadiumId: string;
  stadiumName: string;
  teams: {
    home: string;
    away: string;
    homeFlag?: string;
    awayFlag?: string;
  };
  dateTime: string;
  attendance: number;
  status: 'Scheduled' | 'Live' | 'Completed';
  currentScore?: {
    home: number;
    away: number;
  };
}

export type IncidentType =
  | 'Heavy Rain'
  | 'Medical Emergency'
  | 'Food Queue'
  | 'Parking Jam'
  | 'Gate Closed'
  | 'Lost Child'
  | 'Volunteer Shortage'
  | 'Metro Delay'
  | 'Accessibility Request'
  | 'Power Failure'
  | 'Large Crowd';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IncidentEvent {
  id: string;
  matchId: string;
  stadiumId: string;
  stadiumName: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  timestamp: string;
  status: 'Active' | 'Resolved';
}

export interface Playbook {
  id: string;
  title: string;
  eventType: IncidentType;
  stadiumId: string;
  stadiumName: string;
  problem: string;
  rootCause: string;
  operationalRisk: string;
  recommendedActions: string[];
  expectedImpact: string;
  lessonsLearned: string;
  confidenceScore: number; // 0 to 100
  alternativeStrategy: string;
  createdAt: string;
  similarityScore?: number; // Calculated on-the-fly for comparison UI
}

export interface RecommendationAction {
  action: string;
  status: 'Pending' | 'In Progress' | 'Implemented';
}

export interface AIRecommendation {
  id: string;
  matchId: string;
  stadiumId: string;
  eventType: IncidentType;
  incidentId: string;
  playbookId: string;
  playbookTitle: string;
  title: string;
  description: string;
  actions: RecommendationAction[];
  explanation: string; // Dynamic AI explanation why this playbook fits the current situation
  createdAt: string;
}


