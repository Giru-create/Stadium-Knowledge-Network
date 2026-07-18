import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';

/** Logs a telemetry reading to a category-specific Firestore collection. */
async function logTelemetry(
  category: string,
  telemetryData: Record<string, unknown>,
): Promise<void> {
  const entry = { ...telemetryData, timestamp: new Date().toISOString() };
  if (isFirebaseConfigured) {
    await addDoc(collection(db, category), entry);
  } else {
    mockDb.add(category, entry);
  }
}

/**
 * Fetches the most recent telemetry entries for a given category and match.
 * @param category - The telemetry sub-collection name (e.g. "crowd", "weather").
 * @param matchId - The match to filter by.
 * @param limitCount - Maximum number of records to return.
 */
async function getLatestTelemetry<T>(
  category: string,
  matchId: string,
  limitCount = 20,
): Promise<T[]> {
  if (isFirebaseConfigured) {
    const q = query(
      collection(db, category),
      where('matchId', '==', matchId),
      orderBy('timestamp', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }) as unknown as T)
      .slice(0, limitCount);
  }

  return mockDb
    .query<T>(category, (item) => (item as Record<string, unknown>).matchId === matchId)
    .sort((a, b) => {
      const aTime = String((a as Record<string, unknown>).timestamp || '');
      const bTime = String((b as Record<string, unknown>).timestamp || '');
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    })
    .slice(0, limitCount);
}

/** Telemetry logging and retrieval operations (LIVE + SANDBOX). */
export const telemetryService = { logTelemetry, getLatestTelemetry };
