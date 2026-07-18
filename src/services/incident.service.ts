import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';
import { IncidentEvent } from '@/types';

/** Creates a new incident event in the `events` collection. */
async function createIncident(incident: Omit<IncidentEvent, 'id'>): Promise<IncidentEvent> {
  if (isFirebaseConfigured) {
    const ref = await addDoc(collection(db, 'events'), incident);
    return { id: ref.id, ...incident } as IncidentEvent;
  }
  return mockDb.add<IncidentEvent>('events', incident);
}

/** Fetches active incidents, optionally filtered by match ID. */
async function getActiveIncidents(matchId?: string): Promise<IncidentEvent[]> {
  if (isFirebaseConfigured) {
    const constraints: ReturnType<typeof where>[] = [where('status', '==', 'Active')];
    if (matchId) constraints.push(where('matchId', '==', matchId));
    const q = query(collection(db, 'events'), ...constraints, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as IncidentEvent);
  }

  return mockDb
    .query<IncidentEvent>('events', (item) =>
      item.status === 'Active' && (!matchId || item.matchId === matchId),
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/** Marks an incident as resolved with a timestamp. */
async function resolveIncident(incidentId: string): Promise<void> {
  const updateData = { status: 'Resolved', resolvedAt: new Date().toISOString() };
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, 'events', incidentId), updateData);
  } else {
    mockDb.update('events', incidentId, updateData);
  }
}

/**
 * Subscribes to real-time incident updates for a match.
 * Returns an unsubscribe function.
 */
function subscribeToIncidents(
  matchId: string,
  callback: (incidents: IncidentEvent[]) => void,
): (() => void) {
  if (isFirebaseConfigured) {
    const q = query(
      collection(db, 'events'),
      where('matchId', '==', matchId),
      orderBy('timestamp', 'desc'),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        callback(
          snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as IncidentEvent),
        );
      },
      () => {
        console.error('Incident subscription error');
      },
    );
  }

  const checkData = () => {
    const list = mockDb
      .query<IncidentEvent>('events', (item) => item.matchId === matchId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    callback(list);
  };
  checkData();
  const interval = setInterval(checkData, 2000);
  return () => clearInterval(interval);
}

/** Incident lifecycle operations (LIVE + SANDBOX). */
export const incidentService = {
  createIncident,
  getActiveIncidents,
  resolveIncident,
  subscribeToIncidents,
};
