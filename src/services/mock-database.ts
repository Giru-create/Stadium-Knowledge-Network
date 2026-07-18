import { Stadium, Match, Playbook } from '@/types';

/** Prefix used for all localStorage keys. */
const STORAGE_PREFIX = 'skn_';

function getStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  return raw ? JSON.parse(raw) : [];
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(data));
  }
}

// ─── Seed Data ──────────────────────────────────────────────────────────────

const DEFAULT_STADIUMS: Stadium[] = [
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
      { id: 'z4', name: 'South Food Court', status: 'Congested', occupancy: 78 },
    ],
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
      { id: 'z4', name: 'West Food Hall', status: 'Normal', occupancy: 40 },
    ],
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
      { id: 'z4', name: 'VIP Concessions', status: 'Normal', occupancy: 32 },
    ],
  },
];

const DEFAULT_MATCHES: Match[] = [
  {
    id: 'match-1',
    stadiumId: 'mexico-cdmx',
    stadiumName: 'Estadio Azteca',
    teams: { home: 'Mexico', away: 'Argentina' },
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    attendance: 85000,
    status: 'Live',
    currentScore: { home: 1, away: 1 },
  },
  {
    id: 'match-2',
    stadiumId: 'canada-toronto',
    stadiumName: 'BMO Field',
    teams: { home: 'Canada', away: 'Germany' },
    dateTime: new Date(Date.now() + 172800000).toISOString(),
    attendance: 28500,
    status: 'Scheduled',
  },
  {
    id: 'match-3',
    stadiumId: 'usa-los-angeles',
    stadiumName: 'SoFi Stadium',
    teams: { home: 'USA', away: 'England' },
    dateTime: new Date(Date.now() - 172800000).toISOString(),
    attendance: 69800,
    status: 'Completed',
    currentScore: { home: 2, away: 1 },
  },
];

const DEFAULT_PLAYBOOKS: Playbook[] = [
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
      'Push weather emergency alerts to stadium mobile apps encouraging fans to stay in their seats until rain intensity drops.',
    ],
    expectedImpact: 'Reduces food court lobby density by 35% within 12 minutes and drops food wait time down to 15 minutes.',
    lessonsLearned: 'Pre-emptive weather monitoring must trigger gate and concessions operational adjustments 20 minutes before rain begins.',
    confidenceScore: 92,
    alternativeStrategy: 'Deploy mobile shelter canopies in external plazas to distribute crowd outside concourse arches.',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
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
      'Coordinate with rideshare providers to shift drop-off zones 100 meters north during the incident.',
    ],
    expectedImpact: 'Reduces Gate A queue length by 60% in 10 minutes and prevents kickoff delays.',
    lessonsLearned: 'Always keep local caches of ticket databases on entry terminals to ensure offline resilience.',
    confidenceScore: 89,
    alternativeStrategy: 'Implement visual ticket verification with manual wristbands at secondary check points.',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

// ─── Seed Initial Data ──────────────────────────────────────────────────────

function seedDefaults(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(`${STORAGE_PREFIX}stadiums`)) setStore('stadiums', DEFAULT_STADIUMS);
  if (!localStorage.getItem(`${STORAGE_PREFIX}matches`)) setStore('matches', DEFAULT_MATCHES);
  if (!localStorage.getItem(`${STORAGE_PREFIX}playbooks`)) setStore('playbooks', DEFAULT_PLAYBOOKS);
}

seedDefaults();

// ─── MockDatabase ───────────────────────────────────────────────────────────

/**
 * localStorage-backed mock of Firestore for SANDBOX mode.
 * Provides generic CRUD and query operations.
 */
export const mockDb = {
  /** Returns all documents in a collection. */
  getAll<T>(collectionName: string): T[] {
    return getStore<T>(collectionName);
  },

  /** Adds a document with an auto-generated ID and `createdAt` timestamp. */
  add<T>(collectionName: string, docData: Record<string, unknown>): T {
    const list = getStore<unknown>(collectionName);
    const newDoc = {
      id: Math.random().toString(36).substring(2, 11),
      ...docData,
      createdAt: new Date().toISOString(),
    };
    list.push(newDoc);
    setStore(collectionName, list);
    return newDoc as unknown as T;
  },

  /** Updates a document by ID, merging new fields. */
  update<T>(collectionName: string, id: string, docData: Record<string, unknown>): T | null {
    const list = getStore<Record<string, unknown>>(collectionName);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...docData, updatedAt: new Date().toISOString() };
    setStore(collectionName, list);
    return list[index] as unknown as T;
  },

  /** Filters documents by a predicate function. */
  query<T>(collectionName: string, filterFn: (item: T) => boolean): T[] {
    return getStore<T>(collectionName).filter(filterFn);
  },
};
