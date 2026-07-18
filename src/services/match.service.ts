import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';
import { Match } from '@/types';

/** Returns all matches from Firestore or the local mock database. */
async function getAllMatches(): Promise<Match[]> {
  if (isFirebaseConfigured) {
    const snapshot = await getDocs(collection(db, 'matches'));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Match);
  }
  return mockDb.getAll<Match>('matches');
}

/** Updates the status (and optionally the score) of a match. */
async function updateMatchStatus(
  matchId: string,
  status: 'Scheduled' | 'Live' | 'Completed',
  score?: { home: number; away: number },
): Promise<void> {
  const updateData: Partial<Match> = { status };
  if (score) updateData.currentScore = score;

  if (isFirebaseConfigured) {
    await updateDoc(doc(db, 'matches', matchId), updateData);
  } else {
    mockDb.update<Match>('matches', matchId, updateData as Record<string, unknown>);
  }
}

/** Match read/write operations (LIVE + SANDBOX). */
export const matchService = { getAllMatches, updateMatchStatus };
