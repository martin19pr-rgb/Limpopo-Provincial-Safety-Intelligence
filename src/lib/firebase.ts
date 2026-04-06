import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (_) {}
}

export { analytics };
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

export { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, limit, ref, onValue, set, push };

export type FirebaseAlert = {
  id?: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  lat: number;
  lng: number;
  timestamp: any;
  eta: string;
  status: 'active' | 'dispatched' | 'resolved';
  responders: string[];
  department: string;
  aiConfidence?: number;
  blockchainHash?: string;
  bodycamActive?: boolean;
  droneDeployed?: boolean;
  lprMatch?: string;
};

export type FirebaseOfficer = {
  id?: string;
  name: string;
  department: string;
  role: string;
  status: 'online' | 'standby' | 'offline' | 'responding';
  lat: number;
  lng: number;
  powScore: number;
  blockchainHash: string;
  bodycamActive: boolean;
  vitalSign: 'normal' | 'elevated' | 'critical';
  compliance: number;
};
