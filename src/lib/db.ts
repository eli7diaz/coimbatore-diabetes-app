"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  setDoc,
  doc,
  getDoc,
  query,
  orderBy,
  where,
  deleteDoc
} from "firebase/firestore";

// Firebase credentials
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase (Singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export interface VitalReading {
  id: string;
  timestamp: number;
  metricType: "glucose" | "heartRate" | "activeBurn" | "sleep";
  value: number;
  sourceDevice: string;
}

export interface DeviceStatus {
  deviceId: "cgm" | "watch" | "fitbit";
  connected: boolean;
  lastSync: number;
}

export interface MealLog {
  id: string;
  timestamp: number;
  food: string;
  carbs: number;
  calories: number;
  image: string | null;
}

export interface InsulinLog {
  id: string;
  timestamp: number;
  carbs: number;
  dose: number;
}

export class AppDatabase {
  // --- Vitals API ---
  public static async saveVital(reading: Omit<VitalReading, "id" | "timestamp">): Promise<VitalReading> {
    const timestamp = Date.now();
    const data = { ...reading, timestamp };
    const docRef = await addDoc(collection(db, "vitals"), data);
    return {
      id: docRef.id,
      ...data
    };
  }

  public static async getVitals(metricType?: "glucose" | "heartRate" | "activeBurn" | "sleep"): Promise<VitalReading[]> {
    const vitalsRef = collection(db, "vitals");
    let q = query(vitalsRef, orderBy("timestamp", "desc"));
    
    if (metricType) {
      q = query(vitalsRef, where("metricType", "==", metricType), orderBy("timestamp", "desc"));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as VitalReading));
  }

  // --- Devices API ---
  public static async saveDeviceStatus(deviceId: "cgm" | "watch" | "fitbit", connected: boolean): Promise<DeviceStatus> {
    const lastSync = Date.now();
    const status: DeviceStatus = { deviceId, connected, lastSync };
    await setDoc(doc(db, "devices", deviceId), status);
    return status;
  }

  public static async getDeviceStatuses(): Promise<Record<string, DeviceStatus>> {
    const statuses: Record<string, DeviceStatus> = {
      cgm: { deviceId: "cgm", connected: true, lastSync: Date.now() },
      watch: { deviceId: "watch", connected: false, lastSync: Date.now() },
      fitbit: { deviceId: "fitbit", connected: false, lastSync: Date.now() }
    };
    const snapshot = await getDocs(collection(db, "devices"));
    snapshot.docs.forEach(doc => {
      const data = doc.data() as DeviceStatus;
      statuses[data.deviceId] = data;
    });
    return statuses;
  }

  // --- Meals API ---
  public static async saveMealLog(meal: Omit<MealLog, "id" | "timestamp">): Promise<MealLog> {
    const timestamp = Date.now();
    const data = { ...meal, timestamp };
    const docRef = await addDoc(collection(db, "meals"), data);
    return {
      id: docRef.id,
      ...data
    };
  }

  public static async getMealLogs(): Promise<MealLog[]> {
    const mealsRef = collection(db, "meals");
    const q = query(mealsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MealLog));
  }

  // --- Insulin API ---
  public static async saveInsulinLog(log: Omit<InsulinLog, "id" | "timestamp">): Promise<InsulinLog> {
    const timestamp = Date.now();
    const data = { ...log, timestamp };
    const docRef = await addDoc(collection(db, "insulin"), data);
    return {
      id: docRef.id,
      ...data
    };
  }

  public static async getInsulinLogs(): Promise<InsulinLog[]> {
    const insulinRef = collection(db, "insulin");
    const q = query(insulinRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as InsulinLog));
  }

  // --- Global Utility ---
  public static async clearAll(): Promise<void> {
    // Warning: This only clears local client state representations if needed.
    // For security, mass deletions should be handled carefully via backend or Admin console.
  }
}
