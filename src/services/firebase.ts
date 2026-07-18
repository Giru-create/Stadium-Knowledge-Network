import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

/** Firebase project configuration from environment variables. */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Whether required Firebase env vars are present. */
export const isFirebaseConfigured: boolean =
  Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) &&
  Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

let app: FirebaseApp = null as unknown as FirebaseApp;
let auth: Auth = null as unknown as Auth;
let db: Firestore = null as unknown as Firestore;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase Live Mode initialized successfully.');
  } catch (error) {
    console.error('Firebase failed to initialize. Falling back to Sandbox Mode.', error);
  }
}

/** Firebase Auth instance (null when running in SANDBOX mode). */
export { auth };

/** Cloud Firestore instance (null when running in SANDBOX mode). */
export { db };

/** Returns whether the platform is running against live Firebase or the local mock. */
export const getPlatformMode = (): 'LIVE' | 'SANDBOX' => (isFirebaseConfigured ? 'LIVE' : 'SANDBOX');
