import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { getDatabase, ref, onValue, set, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY ?? "AIzaSyDXB6eNiNJEU0RdGTwMSwWSBXiJ8kWiNOk",
  authDomain: "provincial-safety-dashboard.firebaseapp.com",
  projectId: "provincial-safety-dashboard",
  storageBucket: "provincial-safety-dashboard.firebasestorage.app",
  messagingSenderId: "782632363879",
  appId: "1:782632363879:web:f9758ef4c5b274a601b1c2",
  measurementId: "G-DTN0SVCZES",
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
