import { collection, doc, getDocs, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';
import { Stadium } from '@/types';

/** Returns every stadium from Firestore or the local mock database. */
async function getAllStadiums(): Promise<Stadium[]> {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'stadiums'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Stadium);
  }
  return mockDb.getAll<Stadium>('stadiums');
}

/** Creates a new stadium and returns the persisted document. */
async function createStadium(stadium: Omit<Stadium, 'id'>): Promise<Stadium> {
  if (isFirebaseConfigured) {
    const ref = await addDoc(collection(db, 'stadiums'), stadium);
    return { id: ref.id, ...stadium } as Stadium;
  }
  return mockDb.add<Stadium>('stadiums', stadium);
}

/** Updates a specific zone's status and occupancy within a stadium. */
async function updateStadiumZoneStatus(
  stadiumId: string,
  zoneId: string,
  status: 'Normal' | 'Congested' | 'Warning' | 'Critical',
  occupancy: number,
): Promise<void> {
  if (isFirebaseConfigured) {
    const ref = doc(db, 'stadiums', stadiumId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as Stadium;
    const updatedZones = data.zones.map((z) =>
      z.id === zoneId ? { ...z, status, occupancy } : z,
    );
    await updateDoc(ref, { zones: updatedZones });
    return;
  }

  const stadiums = mockDb.getAll<Stadium>('stadiums');
  const index = stadiums.findIndex((s) => s.id === stadiumId);
  if (index === -1) return;
  stadiums[index].zones = stadiums[index].zones.map((z) =>
    z.id === zoneId ? { ...z, status, occupancy } : z,
  );
  localStorage.setItem('skn_stadiums', JSON.stringify(stadiums));
}

/** Stadium CRUD operations (LIVE + SANDBOX). */
export const stadiumService = { getAllStadiums, createStadium, updateStadiumZoneStatus };
