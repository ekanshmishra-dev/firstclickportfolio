import { createClient, SupabaseClient } from "@supabase/supabase-js";

/* ── Types & Data Models ── */

export type UserRole = "super_admin" | "employee";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  password?: string;
  createdAt: string;
}

export type AttendanceStatus =
  | "FULL_DAY"
  | "HALF_DAY_LATE"
  | "HALF_DAY_EARLY"
  | "HALF_DAY_BOTH"
  | "ABSENT"
  | "PRESENT_ONLINE";

export interface AttendanceRecord {
  id: string;
  userId: string;
  email: string;
  name: string;
  date: string; // YYYY-MM-DD
  clockIn: string; // ISO string
  clockOut: string | null; // ISO string
  status: AttendanceStatus;
  totalHours: number; // calculated hours
  lateMinutes: number; // minutes after 10:00:00 AM
  earlyLogoutMinutes: number; // minutes before 18:00:00 PM
  notes?: string;
}

export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  assignedToEmail: string;
  assignedToName: string;
  assignedBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // ISO or date string
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Storage Keys & Initial Setup ── */

const SUPABASE_URL_KEY = "fc_supabase_url";
const SUPABASE_KEY_KEY = "fc_supabase_anon_key";
const PROFILES_STORAGE_KEY = "fc_employee_profiles_v1";
const ATTENDANCE_STORAGE_KEY = "fc_attendance_logs_v1";
const TASKS_STORAGE_KEY = "fc_tasks_v1";
const SYNC_EVENT_KEY = "fc_realtime_channel_event";

/* ── Default Seed Data ── */

const DEFAULT_SUPER_ADMIN: UserProfile = {
  id: "admin-ekansh-001",
  email: "ekansh@firstclick.com",
  name: "Ekansh (Super Admin)",
  role: "super_admin",
  department: "Management",
  createdAt: new Date().toISOString(),
};

const DEFAULT_EMPLOYEES: UserProfile[] = [
  DEFAULT_SUPER_ADMIN,
  {
    id: "emp-deepak-002",
    email: "deepak@firstclick.com",
    name: "Deepak",
    role: "employee",
    department: "Fullstack Development",
    createdAt: new Date().toISOString(),
  },
  {
    id: "emp-kuldeep-003",
    email: "kuldeep@firstclick.com",
    name: "Kuldeep",
    role: "employee",
    department: "UI/UX Design",
    createdAt: new Date().toISOString(),
  },
  {
    id: "emp-hitesh-004",
    email: "hitesh@firstclick.com",
    name: "Hitesh",
    role: "employee",
    department: "Meta Ads & Automation",
    createdAt: new Date().toISOString(),
  },
  {
    id: "emp-priya-006",
    email: "priya@firstclick.com",
    name: "Priya Verma",
    role: "employee",
    department: "Content & Strategy",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: "task-101",
    title: "Finalize Client Landing Page UI",
    description: "Complete dark-mode high-converting header and CTA section for OptiCore project.",
    assignedToEmail: "priya@firstclick.com",
    assignedToName: "Priya Verma",
    assignedBy: "ekansh@firstclick.com",
    priority: "High",
    status: "in_progress",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-102",
    title: "Meta Ads Campaign Pixel Audit",
    description: "Verify pixel event triggers on lead form submission and webhook routing.",
    assignedToEmail: "amit@firstclick.com",
    assignedToName: "Amit Patel",
    assignedBy: "ekansh@firstclick.com",
    priority: "Medium",
    status: "pending",
    dueDate: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* ── Supabase Client Initialization ── */

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseCredentials() {
  const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem(SUPABASE_URL_KEY) || "";
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem(SUPABASE_KEY_KEY) || "";
  return { url, key };
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (url) localStorage.setItem(SUPABASE_URL_KEY, url);
  if (key) localStorage.setItem(SUPABASE_KEY_KEY, key);
  initSupabase();
  notifyRealtimeSubscribers("CONFIG_UPDATED");
}

export function initSupabase(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (url && key && url.startsWith("http")) {
    try {
      supabaseClient = createClient(url, key);
      return supabaseClient;
    } catch (e) {
      console.warn("Failed to initialize Supabase client:", e);
    }
  }
  return null;
}

// Initial attempt
initSupabase();

/* ── BroadcastChannel Realtime Engine ── */

let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel("firstclick_portal_realtime");
} catch {
  // BroadcastChannel unavailable in some restricted environments
}

export function notifyRealtimeSubscribers(type: string, payload?: any) {
  const eventData = { type, payload, timestamp: Date.now() };
  if (broadcastChannel) {
    broadcastChannel.postMessage(eventData);
  }
  window.dispatchEvent(new CustomEvent(SYNC_EVENT_KEY, { detail: eventData }));
}

export function subscribeToPortalRealtime(callback: (event: { type: string; payload?: any }) => void) {
  const handler = (e: any) => {
    if (e.detail) callback(e.detail);
  };
  const bcHandler = (e: MessageEvent) => {
    callback(e.data);
  };

  window.addEventListener(SYNC_EVENT_KEY, handler);
  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", bcHandler);
  }

  return () => {
    window.removeEventListener(SYNC_EVENT_KEY, handler);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", bcHandler);
    }
  };
}

/* ── Profiles & Users API ── */

export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(DEFAULT_EMPLOYEES));
      return DEFAULT_EMPLOYEES;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Ensure default accounts (Deepak, Kuldeep, Hitesh, etc.) are present
      DEFAULT_EMPLOYEES.forEach((def) => {
        const found = parsed.find((p) => p.email.toLowerCase() === def.email.toLowerCase());
        if (!found) {
          parsed.push(def);
        } else if (def.email.toLowerCase() === "ekansh@firstclick.com") {
          found.role = "super_admin";
        }
      });
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(parsed));
      return parsed;
    }
  } catch (e) {
    console.error("Error reading profiles:", e);
  }
  return DEFAULT_EMPLOYEES;
}

export function saveProfile(profile: UserProfile): UserProfile[] {
  const profiles = getStoredProfiles();
  const existingIdx = profiles.findIndex((p) => p.email.toLowerCase() === profile.email.toLowerCase());
  let updated: UserProfile[];
  if (existingIdx >= 0) {
    updated = [...profiles];
    updated[existingIdx] = { ...updated[existingIdx], ...profile };
  } else {
    updated = [...profiles, profile];
  }
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updated));
  notifyRealtimeSubscribers("PROFILE_UPDATED", profile);
  return updated;
}

export function deleteProfile(email: string): UserProfile[] {
  if (email.toLowerCase() === "ekansh@firstclick.com") {
    throw new Error("Super Admin (ekansh@firstclick.com) cannot be deleted.");
  }
  const profiles = getStoredProfiles().filter((p) => p.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  notifyRealtimeSubscribers("PROFILE_DELETED", { email });
  return profiles;
}

/* ── Realtime User Registration & Authentication Engine ── */

export async function registerUserProfile(data: {
  email: string;
  name: string;
  password: string;
  role?: UserRole;
  department?: string;
}): Promise<UserProfile> {
  const cleanEmail = data.email.trim().toLowerCase();
  const profiles = getStoredProfiles();
  const existing = profiles.find((p) => p.email.toLowerCase() === cleanEmail);

  if (existing && existing.password) {
    throw new Error("An account with this email address already exists. Please log in.");
  }

  const isEkansh = cleanEmail === "ekansh@firstclick.com";

  const newProfile: UserProfile = {
    id: existing ? existing.id : `emp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    name: data.name.trim(),
    role: isEkansh ? "super_admin" : data.role || "employee",
    department: data.department || "General",
    password: data.password,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  // 1. Persist locally for instant fallback & multi-tab Broadcast sync
  saveProfile(newProfile);

  // 2. Persist to Supabase if client credentials exist
  const client = initSupabase();
  if (client) {
    try {
      await client.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            name: newProfile.name,
            role: newProfile.role,
            department: newProfile.department,
          },
        },
      });
    } catch (e) {
      console.warn("Supabase Auth signUp note:", e);
    }

    try {
      await client.from("profiles").upsert({
        id: newProfile.id,
        email: newProfile.email,
        name: newProfile.name,
        role: newProfile.role,
        department: newProfile.department,
        password: newProfile.password,
      });
    } catch (e) {
      console.warn("Supabase public.profiles upsert note:", e);
    }
  }

  notifyRealtimeSubscribers("PROFILE_REGISTERED", newProfile);
  return newProfile;
}

export async function authenticateUser(email: string, password: string): Promise<UserProfile> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  // Try Supabase auth first if initialized
  const client = initSupabase();
  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });
      if (!error && data?.user) {
        const { data: dbProfile } = await client
          .from("profiles")
          .select("*")
          .eq("email", cleanEmail)
          .maybeSingle();

        if (dbProfile) {
          const userProf: UserProfile = {
            id: dbProfile.id || data.user.id,
            email: dbProfile.email,
            name: dbProfile.name || cleanEmail.split("@")[0],
            role: dbProfile.role || "employee",
            department: dbProfile.department || "General",
            password: cleanPassword,
            createdAt: dbProfile.created_at || new Date().toISOString(),
          };
          saveProfile(userProf);
          return userProf;
        }
      }
    } catch (e) {
      console.warn("Supabase auth signIn error note:", e);
    }
  }

  // Fallback / standard profile lookup
  const profiles = getStoredProfiles();
  const user = profiles.find((p) => p.email.toLowerCase() === cleanEmail);

  if (!user) {
    throw new Error("No account found with this email address. Please register a new account first!");
  }

  // Check password against registered password or default password
  if (user.password) {
    if (user.password !== cleanPassword) {
      throw new Error("Invalid password. Please enter your correct registered password.");
    }
  } else {
    // Default account (pre-seeded) without custom registered password yet
    if (cleanPassword !== "login@firstclick" && cleanPassword !== "admin123") {
      throw new Error("Invalid password. For demo pre-seeded accounts, default password is 'login@firstclick' or register your account with a custom password.");
    }
  }

  return user;
}

/* ── Attendance Calculation & Storage API ── */

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates exact attendance status based on 10:00 AM login cutoff and 6:00 PM logout cutoff.
 * Rules:
 * - Shift start: 10:00:00 AM (10:00)
 * - Shift end: 18:00:00 PM (18:00)
 * - If login > 10:00:00 AM (even 1 sec late), lateFlag = true
 * - If logout < 18:00:00 PM, earlyLogoutFlag = true
 */
export function calculateAttendanceStatus(clockInIso: string, clockOutIso: string | null): {
  status: AttendanceStatus;
  lateMinutes: number;
  earlyLogoutMinutes: number;
  totalHours: number;
} {
  const clockInDate = new Date(clockInIso);
  
  // Calculate cutoff date for 10:00:00 AM on the same clock-in date
  const target10AM = new Date(clockInDate);
  target10AM.setHours(10, 0, 0, 0);

  const clockInMs = clockInDate.getTime();
  const target10AMMs = target10AM.getTime();

  let lateMinutes = 0;
  let isLate = false;
  if (clockInMs > target10AMMs) {
    isLate = true;
    lateMinutes = Math.ceil((clockInMs - target10AMMs) / (1000 * 60));
  }

  let earlyLogoutMinutes = 0;
  let isEarlyLogout = false;
  let totalHours = 0;

  if (clockOutIso) {
    const clockOutDate = new Date(clockOutIso);
    const clockOutMs = clockOutDate.getTime();

    // Target 6:00:00 PM (18:00:00) on the clock-out day
    const target6PM = new Date(clockOutDate);
    target6PM.setHours(18, 0, 0, 0);
    const target6PMMs = target6PM.getTime();

    if (clockOutMs < target6PMMs) {
      isEarlyLogout = true;
      earlyLogoutMinutes = Math.ceil((target6PMMs - clockOutMs) / (1000 * 60));
    }

    const durationMs = Math.max(0, clockOutMs - clockInMs);
    totalHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));
  }

  let status: AttendanceStatus = "FULL_DAY";

  if (!clockOutIso) {
    // Currently active / logged in
    status = isLate ? "HALF_DAY_LATE" : "PRESENT_ONLINE";
  } else if (isLate && isEarlyLogout) {
    status = "HALF_DAY_BOTH";
  } else if (isLate) {
    status = "HALF_DAY_LATE";
  } else if (isEarlyLogout) {
    status = "HALF_DAY_EARLY";
  } else {
    status = "FULL_DAY";
  }

  return { status, lateMinutes, earlyLogoutMinutes, totalHours };
}

export function getAllAttendanceLogs(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error reading attendance logs:", e);
    return [];
  }
}

export function getTodayAttendanceForUser(email: string): AttendanceRecord | null {
  const today = getTodayDateString();
  const logs = getAllAttendanceLogs();
  return logs.find((l) => l.email.toLowerCase() === email.toLowerCase() && l.date === today) || null;
}

export function clockInUser(user: UserProfile): AttendanceRecord {
  const today = getTodayDateString();
  const logs = getAllAttendanceLogs();
  const existing = logs.find((l) => l.email.toLowerCase() === user.email.toLowerCase() && l.date === today);

  if (existing) {
    return existing;
  }

  const nowIso = new Date().toISOString();
  const calc = calculateAttendanceStatus(nowIso, null);

  const newRecord: AttendanceRecord = {
    id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userId: user.id,
    email: user.email,
    name: user.name,
    date: today,
    clockIn: nowIso,
    clockOut: null,
    status: calc.status,
    totalHours: 0,
    lateMinutes: calc.lateMinutes,
    earlyLogoutMinutes: 0,
    notes: calc.lateMinutes > 0 ? `Late login by ${calc.lateMinutes} min (After 10:00 AM)` : "On time login",
  };

  const updatedLogs = [newRecord, ...logs];
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updatedLogs));
  notifyRealtimeSubscribers("CLOCK_IN", newRecord);
  return newRecord;
}

export function clockOutUser(email: string): AttendanceRecord {
  const today = getTodayDateString();
  const logs = getAllAttendanceLogs();
  const index = logs.findIndex((l) => l.email.toLowerCase() === email.toLowerCase() && l.date === today);

  if (index < 0) {
    throw new Error("No active clock-in found for today.");
  }

  const record = logs[index];
  const nowIso = new Date().toISOString();
  const calc = calculateAttendanceStatus(record.clockIn, nowIso);

  const updatedRecord: AttendanceRecord = {
    ...record,
    clockOut: nowIso,
    status: calc.status,
    totalHours: calc.totalHours,
    earlyLogoutMinutes: calc.earlyLogoutMinutes,
    notes:
      calc.status === "FULL_DAY"
        ? "Full day shift completed (On Time)"
        : `Shift ended. Status: ${calc.status.replace(/_/g, " ")}`,
  };

  logs[index] = updatedRecord;
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(logs));
  notifyRealtimeSubscribers("CLOCK_OUT", updatedRecord);
  return updatedRecord;
}

/* ── Tasks API ── */

export function getStoredTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_TASKS;
  } catch (e) {
    console.error("Error loading tasks:", e);
    return DEFAULT_TASKS;
  }
}

export function createNewTask(task: Omit<TaskItem, "id" | "createdAt" | "updatedAt">): TaskItem {
  const tasks = getStoredTasks();
  const newTask: TaskItem = {
    ...task,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newTask, ...tasks];
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
  notifyRealtimeSubscribers("TASK_CREATED", newTask);
  return newTask;
}

export function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  completionNotes?: string
): TaskItem[] {
  const tasks = getStoredTasks();
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx >= 0) {
    tasks[idx] = {
      ...tasks[idx],
      status,
      completionNotes: completionNotes !== undefined ? completionNotes : tasks[idx].completionNotes,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    notifyRealtimeSubscribers("TASK_UPDATED", tasks[idx]);
  }
  return tasks;
}

export function deleteTask(taskId: string): TaskItem[] {
  const tasks = getStoredTasks().filter((t) => t.id !== taskId);
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  notifyRealtimeSubscribers("TASK_DELETED", { taskId });
  return tasks;
}

/* ── Supabase SQL Schema Script for 1-Click Setup ── */

export const SUPABASE_SQL_SCRIPT = `-- =========================================================================
-- FIRST CLICK PORTAL - SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Copy & Run this entire script in your Supabase SQL Editor
-- =========================================================================

-- 1. Create Profiles / Employees Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee',
  department TEXT DEFAULT 'General',
  password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Attendance Table with 10:00 AM & 6:00 PM Logic Support
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  status TEXT NOT NULL, -- 'FULL_DAY', 'HALF_DAY_LATE', 'HALF_DAY_EARLY', 'HALF_DAY_BOTH', 'ABSENT'
  total_hours NUMERIC(4,2) DEFAULT 0.00,
  late_minutes INTEGER DEFAULT 0,
  early_logout_minutes INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_daily_attendance UNIQUE (email, date)
);

-- 3. Create Task Assignment Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to_email TEXT NOT NULL,
  assigned_to_name TEXT NOT NULL,
  assigned_by TEXT NOT NULL DEFAULT 'ekansh@firstclick.com',
  priority TEXT NOT NULL DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  due_date DATE,
  completion_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Grant Public Access for Quick Sync
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All Access to Profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow All Access to Attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow All Access to Tasks" ON public.tasks FOR ALL USING (true);

-- 5. Seed Super Admin (Ekansh) & Team Members
INSERT INTO public.profiles (email, name, role, department)
VALUES 
  ('ekansh@firstclick.com', 'Ekansh (Super Admin)', 'super_admin', 'Management'),
  ('deepak@firstclick.com', 'Deepak', 'employee', 'Fullstack Development'),
  ('kuldeep@firstclick.com', 'Kuldeep', 'employee', 'UI/UX Design'),
  ('hitesh@firstclick.com', 'Hitesh', 'employee', 'Meta Ads & Automation'),
  ('priya@firstclick.com', 'Priya Verma', 'employee', 'Content & Strategy')
ON CONFLICT (email) DO NOTHING;

-- 6. Enable Realtime Replication for Instant Live Sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
`;
