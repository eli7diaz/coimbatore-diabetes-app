"use client";

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

// LocalStorage Database implementation (Dependency Agnostic Interface)
export class AppDatabase {
    private static KEYS = {
        VITALS: "indiametabolic_vitals",
        DEVICES: "indiametabolic_devices",
        MEALS: "indiametabolic_meals",
        INSULIN: "indiametabolic_insulin",
    };

    // Helper to run safe client-side operations
    private static isClient(): boolean {
        return typeof window !== "undefined";
    }

    private static get<T>(key: string, defaultValue: T): T {
        if (!this.isClient()) return defaultValue;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error("Database read error for key", key, e);
            return defaultValue;
        }
    }

    private static set<T>(key: string, value: T): void {
        if (!this.isClient()) return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("Database write error for key", key, e);
        }
    }

    // --- Vitals API ---
    public static async saveVital(reading: Omit<VitalReading, "id" | "timestamp">): Promise<VitalReading> {
        const vitals = this.get<VitalReading[]>(this.KEYS.VITALS, []);
        const newReading: VitalReading = {
            ...reading,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
        };
        this.set(this.KEYS.VITALS, [newReading, ...vitals]);
        return newReading;
    }

    public static async getVitals(metricType?: "glucose" | "heartRate" | "activeBurn" | "sleep"): Promise<VitalReading[]> {
        const vitals = this.get<VitalReading[]>(this.KEYS.VITALS, []);
        if (metricType) {
            return vitals.filter(v => v.metricType === metricType);
        }
        return vitals;
    }

    // --- Devices API ---
    public static async saveDeviceStatus(deviceId: "cgm" | "watch" | "fitbit", connected: boolean): Promise<DeviceStatus> {
        const devices = this.get<Record<string, DeviceStatus>>(this.KEYS.DEVICES, {});
        const status: DeviceStatus = {
            deviceId,
            connected,
            lastSync: Date.now(),
        };
        devices[deviceId] = status;
        this.set(this.KEYS.DEVICES, devices);
        return status;
    }

    public static async getDeviceStatuses(): Promise<Record<string, DeviceStatus>> {
        const defaultStatuses: Record<string, DeviceStatus> = {
            cgm: { deviceId: "cgm", connected: true, lastSync: Date.now() },
            watch: { deviceId: "watch", connected: false, lastSync: Date.now() },
            fitbit: { deviceId: "fitbit", connected: false, lastSync: Date.now() },
        };
        return this.get<Record<string, DeviceStatus>>(this.KEYS.DEVICES, defaultStatuses);
    }

    // --- Meals API ---
    public static async saveMealLog(meal: Omit<MealLog, "id" | "timestamp">): Promise<MealLog> {
        const meals = this.get<MealLog[]>(this.KEYS.MEALS, []);
        const newMeal: MealLog = {
            ...meal,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
        };
        this.set(this.KEYS.MEALS, [newMeal, ...meals]);
        return newMeal;
    }

    public static async getMealLogs(): Promise<MealLog[]> {
        return this.get<MealLog[]>(this.KEYS.MEALS, []);
    }

    // --- Insulin API ---
    public static async saveInsulinLog(log: Omit<InsulinLog, "id" | "timestamp">): Promise<InsulinLog> {
        const logs = this.get<InsulinLog[]>(this.KEYS.INSULIN, []);
        const newLog: InsulinLog = {
            ...log,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
        };
        this.set(this.KEYS.INSULIN, [newLog, ...logs]);
        return newLog;
    }

    public static async getInsulinLogs(): Promise<InsulinLog[]> {
        return this.get<InsulinLog[]>(this.KEYS.INSULIN, []);
    }

    // --- Global Utility ---
    public static async clearAll(): Promise<void> {
        if (!this.isClient()) return;
        localStorage.removeItem(this.KEYS.VITALS);
        localStorage.removeItem(this.KEYS.DEVICES);
        localStorage.removeItem(this.KEYS.MEALS);
        localStorage.removeItem(this.KEYS.INSULIN);
    }
}
