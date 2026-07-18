import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';
import { AIRecommendation } from '@/types';

/** Creates a new AI recommendation. */
async function createRecommendation(
  recommendation: Omit<AIRecommendation, 'id'>,
): Promise<AIRecommendation> {
  if (isFirebaseConfigured) {
    const ref = await addDoc(collection(db, 'recommendations'), recommendation);
    return { id: ref.id, ...recommendation } as AIRecommendation;
  }
  return mockDb.add<AIRecommendation>('recommendations', recommendation);
}

/** Fetches all recommendations for a match, ordered newest first. */
async function getRecommendationsForMatch(matchId: string): Promise<AIRecommendation[]> {
  if (isFirebaseConfigured) {
    const q = query(
      collection(db, 'recommendations'),
      where('matchId', '==', matchId),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AIRecommendation);
  }
  return mockDb
    .query<AIRecommendation>('recommendations', (item) => item.matchId === matchId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Updates the status of a single action item within a recommendation. */
async function updateActionStatus(
  recId: string,
  actionIndex: number,
  status: 'Pending' | 'In Progress' | 'Implemented',
): Promise<void> {
  if (isFirebaseConfigured) {
    const ref = doc(db, 'recommendations', recId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as AIRecommendation;
    const updatedActions = [...data.actions];
    updatedActions[actionIndex] = { ...updatedActions[actionIndex], status };
    await updateDoc(ref, { actions: updatedActions });
    return;
  }

  const list = mockDb.getAll<AIRecommendation>('recommendations');
  const idx = list.findIndex((r) => r.id === recId);
  if (idx === -1) return;
  const updatedActions = [...list[idx].actions];
  updatedActions[actionIndex] = { ...updatedActions[actionIndex], status };
  list[idx].actions = updatedActions;
  localStorage.setItem('skn_recommendations', JSON.stringify(list));
}

/**
 * Subscribes to real-time recommendation updates for a match.
 * Returns an unsubscribe function.
 */
function subscribeToRecommendations(
  matchId: string,
  callback: (recs: AIRecommendation[]) => void,
): (() => void) {
  if (isFirebaseConfigured) {
    const q = query(
      collection(db, 'recommendations'),
      where('matchId', '==', matchId),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, (snapshot) => {
      callback(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as AIRecommendation),
      );
    });
  }

  const checkData = () => {
    const list = mockDb
      .query<AIRecommendation>('recommendations', (item) => item.matchId === matchId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  };
  checkData();
  const interval = setInterval(checkData, 2000);
  return () => clearInterval(interval);
}

/** Recommendation lifecycle and subscription operations (LIVE + SANDBOX). */
export const recommendationService = {
  createRecommendation,
  getRecommendationsForMatch,
  updateActionStatus,
  subscribeToRecommendations,
};
