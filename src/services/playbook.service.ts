import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';
import { Playbook } from '@/types';

/** Creates a new playbook entry. */
async function createPlaybook(playbook: Omit<Playbook, 'id'>): Promise<Playbook> {
  if (isFirebaseConfigured) {
    const ref = await addDoc(collection(db, 'playbooks'), playbook);
    return { id: ref.id, ...playbook } as Playbook;
  }
  return mockDb.add<Playbook>('playbooks', playbook);
}

/** Returns all playbooks ordered by creation date (newest first). */
async function getAllPlaybooks(): Promise<Playbook[]> {
  if (isFirebaseConfigured) {
    const q = query(collection(db, 'playbooks'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Playbook);
  }
  return mockDb
    .getAll<Playbook>('playbooks')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Searches playbooks by text match on title, problem, or recommended actions. */
async function searchPlaybooks(search: string, eventType?: string): Promise<Playbook[]> {
  const all = await getAllPlaybooks();
  const lowerSearch = search.toLowerCase();
  return all.filter((item) => {
    const matchesText =
      item.title.toLowerCase().includes(lowerSearch) ||
      item.problem.toLowerCase().includes(lowerSearch) ||
      item.recommendedActions.some((a) => a.toLowerCase().includes(lowerSearch));
    const matchesType = !eventType || item.eventType === eventType;
    return matchesText && matchesType;
  });
}

/** Playbook CRUD and search operations (LIVE + SANDBOX). */
export const playbookService = { createPlaybook, getAllPlaybooks, searchPlaybooks };
