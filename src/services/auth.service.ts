import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/services/firebase';
import { mockDb } from '@/services/mock-database';
import { UserProfile, UserRole } from '@/types';

/**
 * Creates a new Firebase Auth user and writes their profile to Firestore.
 * In SANDBOX mode, stores the user in localStorage.
 */
async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
): Promise<UserProfile> {
  if (isFirebaseConfigured) {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const createdAt = new Date().toISOString();
    await setDoc(doc(db, 'users', userCred.user.uid), {
      uid: userCred.user.uid,
      email,
      displayName,
      role,
      createdAt,
    });
    return { uid: userCred.user.uid, email, displayName, role, createdAt };
  }

  const mockUsers = mockDb.getAll<UserProfile>('users');
  const newUser: UserProfile = {
    uid: Math.random().toString(),
    email,
    displayName,
    role,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  localStorage.setItem('skn_users', JSON.stringify(mockUsers));
  localStorage.setItem('skn_current_user', JSON.stringify(newUser));
  return newUser;
}

/**
 * Authenticates with Firebase and fetches the user profile from Firestore.
 * In SANDBOX mode, looks up the local mock user database.
 */
async function login(email: string, password: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured) {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const profileDoc = await getDoc(doc(db, 'users', userCred.user.uid));
    return profileDoc.exists() ? (profileDoc.data() as UserProfile) : null;
  }

  const mockUsers = mockDb.getAll<UserProfile>('users');
  const found = mockUsers.find((u) => u.email === email);
  if (found) {
    localStorage.setItem('skn_current_user', JSON.stringify(found));
    return found;
  }

  const defaultUser: UserProfile = {
    uid: 'demo-user-1',
    email,
    displayName: 'Demo Controller',
    role: 'Admin',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem('skn_current_user', JSON.stringify(defaultUser));
  return defaultUser;
}

/** Signs out the current user from Firebase or clears the SANDBOX session. */
async function logout(): Promise<void> {
  if (isFirebaseConfigured) {
    await signOut(auth);
  } else {
    localStorage.removeItem('skn_current_user');
  }
}

/** Returns the currently authenticated user from localStorage (SANDBOX only). */
function getCurrentUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('skn_current_user');
  return raw ? JSON.parse(raw) : null;
}

/**
 * Subscribes to Firebase Auth state changes and resolves the full user profile.
 * In SANDBOX mode, listens to the `storage` event for cross-tab sync.
 */
function onAuthChanged(callback: (user: UserProfile | null) => void): (() => void) | undefined {
  if (isFirebaseConfigured) {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }
      const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      callback(profileDoc.exists() ? (profileDoc.data() as UserProfile) : null);
    });
  }

  const checkAuth = () => callback(getCurrentUser());
  checkAuth();
  window.addEventListener('storage', checkAuth);
  return () => window.removeEventListener('storage', checkAuth);
}

/** Authentication and user-profile service (LIVE + SANDBOX). */
export const authService = { signUp, login, logout, getCurrentUser, onAuthChanged };
