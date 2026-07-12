import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  setDoc,
  getDoc,
  Firestore
} from 'firebase/firestore';
import { 
  UserProfile, 
  UserRole,
  Stadium, 
  Match, 
  IncidentEvent, 
  Playbook, 
  AIRecommendation
} from '../types';

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if firebase configuration variables are present
const isFirebaseConfigured = 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app: FirebaseApp = null as unknown as FirebaseApp;
let auth: Auth = null as unknown as Auth;
let db: Firestore = null as unknown as Firestore;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase Live Mode initialized successfully.");
  } catch (error) {
    console.error("Firebase failed to initialize. Falling back to Sandbox Mode.", error);
  }
}

// ----------------------------------------------------
// LOCAL STORAGE MOCK FIREBASE DB (FALLBACK WORKFLOWS)
// ----------------------------------------------------
class MockDatabase {
  private getStore<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    const val = localStorage.getItem(`skn_${key}`);
    return val ? JSON.parse(val) : [];
  }

  private setStore<T>(key: string, data: T[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`skn_${key}`, JSON.stringify(data));
    }
  }

  constructor() {
    this.initDefaultData();
  }

  private initDefaultData() {
    if (typeof window === 'undefined') return;
    
    // Seed Stadiums
    if (!localStorage.getItem('skn_stadiums')) {
      const defaultStadiums: Stadium[] = [
        {
          id: 'mexico-cdmx',
          name: 'Estadio Azteca',
          city: 'Mexico City',
          country: 'Mexico',
          capacity: 87523,
          latitude: 19.3029,
          longitude: -99.1505,
          climate: 'Subtropical Highland',
          status: 'Online',
          zones: [
            { id: 'z1', name: 'West Concourse', status: 'Normal', occupancy: 42 },
            { id: 'z2', name: 'East Concourse', status: 'Normal', occupancy: 38 },
            { id: 'z3', name: 'North Gates', status: 'Normal', occupancy: 45 },
            { id: 'z4', name: 'South Food Court', status: 'Congested', occupancy: 78 }
          ]
        },
        {
          id: 'canada-toronto',
          name: 'BMO Field',
          city: 'Toronto',
          country: 'Canada',
          capacity: 30000,
          latitude: 43.6328,
          longitude: -79.4186,
          climate: 'Humid Continental',
          status: 'Online',
          zones: [
            { id: 'z1', name: 'North Fan Zone', status: 'Normal', occupancy: 25 },
            { id: 'z2', name: 'South Concourse', status: 'Normal', occupancy: 30 },
            { id: 'z3', name: 'Main Gate A', status: 'Normal', occupancy: 35 },
            { id: 'z4', name: 'West Food Hall', status: 'Normal', occupancy: 40 }
          ]
        },
        {
          id: 'usa-los-angeles',
          name: 'SoFi Stadium',
          city: 'Los Angeles',
          country: 'USA',
          capacity: 70240,
          latitude: 33.9534,
          longitude: -118.3390,
          climate: 'Mediterranean',
          status: 'Online',
          zones: [
            { id: 'z1', name: 'Plaza Entry North', status: 'Normal', occupancy: 50 },
            { id: 'z2', name: 'Canyon Concourse', status: 'Normal', occupancy: 48 },
            { id: 'z3', name: 'Sponsor Boulevard', status: 'Normal', occupancy: 55 },
            { id: 'z4', name: 'VIP Concessions', status: 'Normal', occupancy: 32 }
          ]
        }
      ];
      this.setStore('stadiums', defaultStadiums);
    }

    // Seed Matches
    if (!localStorage.getItem('skn_matches')) {
      const defaultMatches: Match[] = [
        {
          id: 'match-1',
          stadiumId: 'mexico-cdmx',
          stadiumName: 'Estadio Azteca',
          teams: { home: 'Mexico', away: 'Argentina' },
          dateTime: new Date(Date.now() + 86400000).toISOString(),
          attendance: 85000,
          status: 'Live',
          currentScore: { home: 1, away: 1 }
        },
        {
          id: 'match-2',
          stadiumId: 'canada-toronto',
          stadiumName: 'BMO Field',
          teams: { home: 'Canada', away: 'Germany' },
          dateTime: new Date(Date.now() + 172800000).toISOString(),
          attendance: 28500,
          status: 'Scheduled'
        },
        {
          id: 'match-3',
          stadiumId: 'usa-los-angeles',
          stadiumName: 'SoFi Stadium',
          teams: { home: 'USA', away: 'England' },
          dateTime: new Date(Date.now() - 172800000).toISOString(),
          attendance: 69800,
          status: 'Completed',
          currentScore: { home: 2, away: 1 }
        }
      ];
      this.setStore('matches', defaultMatches);
    }

    // Seed Initial Playbooks
    if (!localStorage.getItem('skn_playbooks')) {
      const defaultPlaybooks: Playbook[] = [
        {
          id: 'pb-1',
          title: 'Tropical Downpour Crowd Congestion Strategy',
          eventType: 'Heavy Rain',
          stadiumId: 'mexico-cdmx',
          stadiumName: 'Estadio Azteca',
          problem: 'Sudden high-intensity rainfall caused fans in open areas to flood the East and West covered concourses, resulting in dangerous crowd bottlenecks near the main food courts.',
          rootCause: 'Lack of adequate covered external staging and failure to pre-warn fans of shifting weather cell.',
          operationalRisk: 'Stampede risk at food court intersections, delayed exit times, food queue delays exceeding 40 minutes.',
          recommendedActions: [
            'Instruct concession stalls in concourses to transition to quick-serve items only to clear queues faster.',
            'Open auxiliary gate corridors on the lower ring to redirect pedestrian flow out of high-density zones.',
            'Push weather emergency alerts to stadium mobile apps encouraging fans to stay in their seats until rain intensity drops.'
          ],
          expectedImpact: 'Reduces food court lobby density by 35% within 12 minutes and drops food wait time down to 15 minutes.',
          lessonsLearned: 'Pre-emptive weather monitoring must trigger gate and concessions operational adjustments 20 minutes before rain begins.',
          confidenceScore: 92,
          alternativeStrategy: 'Deploy mobile shelter canopies in external plazas to distribute crowd outside concourse arches.',
          createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
          id: 'pb-2',
          title: 'Gate Malfunction Crowd Distribution Flow',
          eventType: 'Gate Closed',
          stadiumId: 'usa-los-angeles',
          stadiumName: 'SoFi Stadium',
          problem: 'Scanner system hardware failure at Gate A caused a backup of 4,000 incoming fans, blocking nearby rideshare drop-off zones.',
          rootCause: 'Local network switch outage disrupting cloud-connected ticket validation terminals.',
          operationalRisk: 'Crowd crushing at security barricades, kickoff delay, and pedestrian-vehicular collisions in drop-off areas.',
          recommendedActions: [
            'Switch all validation terminals to offline cached mode immediately.',
            'Redirect incoming queues at Gate A to Gates B and C using LED boards and mobile volunteers.',
            'Coordinate with rideshare providers to shift drop-off zones 100 meters north during the incident.'
          ],
          expectedImpact: 'Reduces Gate A queue length by 60% in 10 minutes and prevents kickoff delays.',
          lessonsLearned: 'Always keep local caches of ticket databases on entry terminals to ensure offline resilience.',
          confidenceScore: 89,
          alternativeStrategy: 'Implement visual ticket verification with manual wristbands at secondary check points.',
          createdAt: new Date(Date.now() - 604800000).toISOString()
        }
      ];
      this.setStore('playbooks', defaultPlaybooks);
    }
  }

  // Generic DB operations
  getAll<T>(collectionName: string): T[] {
    return this.getStore<T>(collectionName);
  }

  add<T>(collectionName: string, docData: Record<string, unknown>): T {
    const list = this.getStore<unknown>(collectionName);
    const newDoc = { id: Math.random().toString(36).substring(2, 11), ...docData, createdAt: new Date().toISOString() };
    list.push(newDoc);
    this.setStore(collectionName, list);
    return newDoc as unknown as T;
  }

  update<T>(collectionName: string, id: string, docData: Record<string, unknown>): T | null {
    const list = this.getStore<Record<string, unknown>>(collectionName);
    const index = list.findIndex(item => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...docData, updatedAt: new Date().toISOString() };
      this.setStore(collectionName, list);
      return list[index] as unknown as T;
    }
    return null;
  }

  query<T>(collectionName: string, filterFn: (item: T) => boolean): T[] {
    return this.getStore<T>(collectionName).filter(filterFn);
  }
}

export const mockDb = new MockDatabase();

// ----------------------------------------------------
// SYSTEM EXPORTED SERVICES (HYBRID DUAL-MODE LAYER)
// ----------------------------------------------------

export const getPlatformMode = (): 'LIVE' | 'SANDBOX' => {
  return isFirebaseConfigured ? 'LIVE' : 'SANDBOX';
};

// --- AUTH SERVICES ---
export const authService = {
  signUp: async (email: string, password: string, displayName: string, role: UserRole): Promise<UserProfile> => {
    if (isFirebaseConfigured) {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const createdAt = new Date().toISOString();
      // Save profile in Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        uid: userCred.user.uid,
        email,
        displayName,
        role,
        createdAt
      });
      return { uid: userCred.user.uid, email, displayName, role, createdAt };
    } else {
      // Mock SignUp
      const mockUsers = mockDb.getAll<UserProfile>('users');
      const newUser = { uid: Math.random().toString(), email, displayName, role, createdAt: new Date().toISOString() };
      mockUsers.push(newUser);
      localStorage.setItem('skn_users', JSON.stringify(mockUsers));
      localStorage.setItem('skn_current_user', JSON.stringify(newUser));
      return newUser;
    }
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    if (isFirebaseConfigured) {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const profileDoc = await getDoc(doc(db, 'users', userCred.user.uid));
      return profileDoc.exists() ? profileDoc.data() as UserProfile : null;
    } else {
      const mockUsers = mockDb.getAll<UserProfile>('users');
      const found = mockUsers.find(u => u.email === email);
      if (found) {
        localStorage.setItem('skn_current_user', JSON.stringify(found));
        return found;
      }
      // Simple default mock user if database is empty
      const defaultUser = { uid: 'demo-user-1', email, displayName: 'Demo Controller', role: 'Admin' as UserRole, createdAt: new Date().toISOString() };
      localStorage.setItem('skn_current_user', JSON.stringify(defaultUser));
      return defaultUser;
    }
  },

  logout: async () => {
    if (isFirebaseConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem('skn_current_user');
    }
  },

  getCurrentUser: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('skn_current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  onAuthChanged: (callback: (user: UserProfile | null) => void) => {
    if (isFirebaseConfigured) {
      return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (profileDoc.exists()) {
            callback(profileDoc.data() as UserProfile);
          } else {
            callback(null);
          }
        } else {
          callback(null);
        }
      });
    } else {
      // Mock implementation
      const checkAuth = () => {
        const user = authService.getCurrentUser();
        callback(user);
      };
      checkAuth();
      window.addEventListener('storage', checkAuth);
      return () => window.removeEventListener('storage', checkAuth);
    }
  }
};

// --- STADIUM SERVICES ---
export const stadiumService = {
  getAllStadiums: async (): Promise<Stadium[]> => {
    if (isFirebaseConfigured) {
      const querySnapshot = await getDocs(collection(db, 'stadiums'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Stadium);
    } else {
      return mockDb.getAll<Stadium>('stadiums');
    }
  },

  createStadium: async (stadium: Omit<Stadium, 'id'>): Promise<Stadium> => {
    if (isFirebaseConfigured) {
      const docRef = await addDoc(collection(db, 'stadiums'), stadium);
      return { id: docRef.id, ...stadium } as Stadium;
    } else {
      return mockDb.add<Stadium>('stadiums', stadium);
    }
  },

  updateStadiumZoneStatus: async (stadiumId: string, zoneId: string, status: 'Normal' | 'Congested' | 'Warning' | 'Critical', occupancy: number) => {
    if (isFirebaseConfigured) {
      const stadiumRef = doc(db, 'stadiums', stadiumId);
      const stadiumDoc = await getDoc(stadiumRef);
      if (stadiumDoc.exists()) {
        const data = stadiumDoc.data() as Stadium;
        const updatedZones = data.zones.map(z => z.id === zoneId ? { ...z, status, occupancy } : z);
        await updateDoc(stadiumRef, { zones: updatedZones });
      }
    } else {
      const stadiums = mockDb.getAll<Stadium>('stadiums');
      const index = stadiums.findIndex(s => s.id === stadiumId);
      if (index > -1) {
        stadiums[index].zones = stadiums[index].zones.map(z => z.id === zoneId ? { ...z, status, occupancy } : z);
        localStorage.setItem('skn_stadiums', JSON.stringify(stadiums));
      }
    }
  }
};

// --- MATCH SERVICES ---
export const matchService = {
  getAllMatches: async (): Promise<Match[]> => {
    if (isFirebaseConfigured) {
      const querySnapshot = await getDocs(collection(db, 'matches'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Match);
    } else {
      return mockDb.getAll<Match>('matches');
    }
  },

  updateMatchStatus: async (matchId: string, status: 'Scheduled' | 'Live' | 'Completed', score?: { home: number, away: number }) => {
    const updateData: Partial<Match> = { status };
    if (score) updateData.currentScore = score;

    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'matches', matchId), updateData);
    } else {
      mockDb.update<Match>('matches', matchId, updateData as Record<string, unknown>);
    }
  }
};

// --- INCIDENT SERVICES ---
export const incidentService = {
  createIncident: async (incident: Omit<IncidentEvent, 'id'>): Promise<IncidentEvent> => {
    if (isFirebaseConfigured) {
      const docRef = await addDoc(collection(db, 'events'), incident);
      return { id: docRef.id, ...incident } as IncidentEvent;
    } else {
      return mockDb.add('events', incident) as IncidentEvent;
    }
  },

  getActiveIncidents: async (matchId?: string): Promise<IncidentEvent[]> => {
    if (isFirebaseConfigured) {
      let q = query(collection(db, 'events'), where('status', '==', 'Active'), orderBy('timestamp', 'desc'));
      if (matchId) {
        q = query(collection(db, 'events'), where('status', '==', 'Active'), where('matchId', '==', matchId), orderBy('timestamp', 'desc'));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as IncidentEvent);
    } else {
      return mockDb.query<IncidentEvent>('events', (item) => {
        return item.status === 'Active' && (!matchId || item.matchId === matchId);
      }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  },

  resolveIncident: async (incidentId: string) => {
    const updateData = { status: 'Resolved', resolvedAt: new Date().toISOString() };
    if (isFirebaseConfigured) {
      await updateDoc(doc(db, 'events', incidentId), updateData);
    } else {
      mockDb.update('events', incidentId, updateData);
    }
  },

  subscribeToIncidents: (matchId: string, callback: (incidents: IncidentEvent[]) => void) => {
    if (isFirebaseConfigured) {
      const q = query(
        collection(db, 'events'), 
        where('matchId', '==', matchId),
        orderBy('timestamp', 'desc')
      );
      return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as IncidentEvent);
        callback(list);
      });
    } else {
      // Setup simple polling for local storage updates
      const checkData = () => {
        const list = mockDb.query<IncidentEvent>('events', (item) => item.matchId === matchId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callback(list);
      };
      checkData();
      const interval = setInterval(checkData, 2000);
      return () => clearInterval(interval);
    }
  }
};

// --- PLAYBOOK SERVICES ---
export const playbookService = {
  createPlaybook: async (playbook: Omit<Playbook, 'id'>): Promise<Playbook> => {
    if (isFirebaseConfigured) {
      const docRef = await addDoc(collection(db, 'playbooks'), playbook);
      return { id: docRef.id, ...playbook } as Playbook;
    } else {
      return mockDb.add('playbooks', playbook) as Playbook;
    }
  },

  getAllPlaybooks: async (): Promise<Playbook[]> => {
    if (isFirebaseConfigured) {
      const q = query(collection(db, 'playbooks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Playbook);
    } else {
      return mockDb.getAll<Playbook>('playbooks').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  searchPlaybooks: async (search: string, eventType?: string): Promise<Playbook[]> => {
    const list = await playbookService.getAllPlaybooks();
    return list.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(search.toLowerCase()) || 
        item.problem.toLowerCase().includes(search.toLowerCase()) ||
        item.recommendedActions.some(action => action.toLowerCase().includes(search.toLowerCase()));
      const matchesType = !eventType || item.eventType === eventType;
      return matchesSearch && matchesType;
    });
  }
};

// --- RECOMMENDATION SERVICES ---
export const recommendationService = {
  createRecommendation: async (recommendation: Omit<AIRecommendation, 'id'>): Promise<AIRecommendation> => {
    if (isFirebaseConfigured) {
      const docRef = await addDoc(collection(db, 'recommendations'), recommendation);
      return { id: docRef.id, ...recommendation } as AIRecommendation;
    } else {
      return mockDb.add('recommendations', recommendation) as AIRecommendation;
    }
  },

  getRecommendationsForMatch: async (matchId: string): Promise<AIRecommendation[]> => {
    if (isFirebaseConfigured) {
      const q = query(collection(db, 'recommendations'), where('matchId', '==', matchId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AIRecommendation);
    } else {
      return mockDb.query<AIRecommendation>('recommendations', (item) => item.matchId === matchId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  updateActionStatus: async (recId: string, actionIndex: number, status: 'Pending' | 'In Progress' | 'Implemented') => {
    if (isFirebaseConfigured) {
      const ref = doc(db, 'recommendations', recId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as AIRecommendation;
        const updatedActions = [...data.actions];
        updatedActions[actionIndex] = { ...updatedActions[actionIndex], status };
        await updateDoc(ref, { actions: updatedActions });
      }
    } else {
      const list = mockDb.getAll<AIRecommendation>('recommendations');
      const idx = list.findIndex(r => r.id === recId);
      if (idx > -1) {
        const updatedActions = [...list[idx].actions];
        updatedActions[actionIndex] = { ...updatedActions[actionIndex], status };
        list[idx].actions = updatedActions;
        localStorage.setItem('skn_recommendations', JSON.stringify(list));
      }
    }
  },

  subscribeToRecommendations: (matchId: string, callback: (recs: AIRecommendation[]) => void) => {
    if (isFirebaseConfigured) {
      const q = query(
        collection(db, 'recommendations'), 
        where('matchId', '==', matchId),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as AIRecommendation);
        callback(list);
      });
    } else {
      const checkData = () => {
        const list = mockDb.query<AIRecommendation>('recommendations', (item) => item.matchId === matchId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list);
      };
      checkData();
      const interval = setInterval(checkData, 2000);
      return () => clearInterval(interval);
    }
  }
};

// --- TELEMETRY SERVICE ---
export const telemetryService = {
  logTelemetry: async (category: string, telemetryData: Record<string, unknown>) => {
    if (isFirebaseConfigured) {
      await addDoc(collection(db, category), {
        ...telemetryData,
        timestamp: new Date().toISOString()
      });
    } else {
      mockDb.add<unknown>(category, {
        ...telemetryData,
        timestamp: new Date().toISOString()
      });
    }
  },

  getLatestTelemetry: async <T>(category: string, matchId: string, limitCount = 20): Promise<T[]> => {
    if (isFirebaseConfigured) {
      const q = query(
        collection(db, category), 
        where('matchId', '==', matchId),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as unknown as T).slice(0, limitCount);
    } else {
      return mockDb.query<T>(category, (item) => (item as Record<string, unknown>).matchId === matchId)
        .sort((a, b) => {
          const aTime = String((a as Record<string, unknown>).timestamp || '');
          const bTime = String((b as Record<string, unknown>).timestamp || '');
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        })
        .slice(0, limitCount);
    }
  }
};
