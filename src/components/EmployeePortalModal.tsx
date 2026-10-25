import React, { useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  AttendanceRecord,
  TaskItem,
  TaskPriority,
  TaskStatus,
  getStoredProfiles,
  saveProfile,
  deleteProfile,
  getAllAttendanceLogs,
  getTodayAttendanceForUser,
  clockInUser,
  clockOutUser,
  getStoredTasks,
  createNewTask,
  updateTaskStatus,
  deleteTask,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  subscribeToPortalRealtime,
  SUPABASE_SQL_SCRIPT,
  getTodayDateString,
  registerUserProfile,
  authenticateUser,
} from "../services/supabase";

interface EmployeePortalModalProps {
  onClose: () => void;
}

export const EmployeePortalModal: React.FC<EmployeePortalModalProps> = ({ onClose }) => {
  // Navigation & Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("fc_portal_current_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return null;
  });

  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "Fullstack Development",
    role: "employee" as UserRole,
  });

  // Live Clock & Timers
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Data states
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [myTodayAttendance, setMyTodayAttendance] = useState<AttendanceRecord | null>(null);

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<"attendance" | "tasks" | "team" | "supabase">("attendance");
  
  // Modals & Forms inside Portal
  const [showEarlyLogoutWarning, setShowEarlyLogoutWarning] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSqlCopiedToast, setShowSqlCopiedToast] = useState(false);
  const [selectedTaskForNotes, setSelectedTaskForNotes] = useState<TaskItem | null>(null);
  const [taskNotesInput, setTaskNotesInput] = useState("");

  // Form states
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    assignedToEmail: "",
    priority: "Medium" as TaskPriority,
    dueDate: getTodayDateString(),
  });

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    department: "Fullstack Development",
    password: "",
  });

  // Supabase Config state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState("");
  const [supabaseKeyInput, setSupabaseKeyInput] = useState("");
  const [supabaseSavedToast, setSupabaseSavedToast] = useState(false);

  // Load and subscribe to data
  const refreshData = () => {
    const p = getStoredProfiles();
    setProfiles(p);

    const logs = getAllAttendanceLogs();
    setAttendanceLogs(logs);

    const t = getStoredTasks();
    setTasks(t);

    if (currentUser) {
      const todayAtt = getTodayAttendanceForUser(currentUser.email);
      setMyTodayAttendance(todayAtt);
    }
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = subscribeToPortalRealtime(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setSupabaseUrlInput(creds.url);
    setSupabaseKeyInput(creds.key);
  }, []);

  // Authentication & Registration Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");

    if (!loginEmail.trim()) {
      setAuthError("Please enter your email address.");
      return;
    }

    if (!loginPassword.trim()) {
      setAuthError("Please enter your password.");
      return;
    }

    setIsAuthSubmitting(true);

    try {
      const user = await authenticateUser(loginEmail, loginPassword);
      setCurrentUser(user);
      localStorage.setItem("fc_portal_current_user", JSON.stringify(user));
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccessMsg("");

    if (!regForm.name.trim()) {
      setAuthError("Please enter your full name.");
      return;
    }

    if (!regForm.email.trim()) {
      setAuthError("Please enter a valid email address.");
      return;
    }

    if (!regForm.password || regForm.password.length < 4) {
      setAuthError("Password must be at least 4 characters long.");
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setAuthError("Passwords do not match. Please re-enter passwords.");
      return;
    }

    setIsAuthSubmitting(true);

    try {
      const newProfile = await registerUserProfile({
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
        department: regForm.department,
        role: regForm.role,
      });

      setAuthSuccessMsg("🎉 Account registered successfully! Logging you in...");
      setTimeout(() => {
        setCurrentUser(newProfile);
        localStorage.setItem("fc_portal_current_user", JSON.stringify(newProfile));
        setRegForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          department: "Fullstack Development",
          role: "employee",
        });
        setAuthSuccessMsg("");
      }, 1000);
    } catch (err: any) {
      setAuthError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSelectEmail = (email: string) => {
    setLoginEmail(email);
    setLoginPassword("login@firstclick");
    setAuthError("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("fc_portal_current_user");
  };

  // Clock In / Clock Out Handlers
  const handleClockIn = () => {
    if (!currentUser) return;
    const record = clockInUser(currentUser);
    setMyTodayAttendance(record);
    refreshData();
  };

  const handleClockOutClick = () => {
    // Check current hour: if before 18:00 (6:00 PM), warn user
    const now = new Date();
    if (now.getHours() < 18) {
      setShowEarlyLogoutWarning(true);
    } else {
      executeClockOut();
    }
  };

  const executeClockOut = () => {
    if (!currentUser) return;
    try {
      const record = clockOutUser(currentUser.email);
      setMyTodayAttendance(record);
      setShowEarlyLogoutWarning(false);
      refreshData();
    } catch (err: any) {
      alert(err.message || "Failed to clock out.");
    }
  };

  // Task Handlers
  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskForm.title || !newTaskForm.assignedToEmail) {
      alert("Please fill in task title and assign to an employee.");
      return;
    }

    const assignedUser = profiles.find((p) => p.email.toLowerCase() === newTaskForm.assignedToEmail.toLowerCase());
    const assignedName = assignedUser ? assignedUser.name : newTaskForm.assignedToEmail;

    createNewTask({
      title: newTaskForm.title,
      description: newTaskForm.description,
      assignedToEmail: newTaskForm.assignedToEmail,
      assignedToName: assignedName,
      assignedBy: currentUser?.email || "ekansh@firstclick.com",
      priority: newTaskForm.priority,
      status: "pending",
      dueDate: newTaskForm.dueDate,
    });

    setNewTaskForm({
      title: "",
      description: "",
      assignedToEmail: "",
      priority: "Medium",
      dueDate: getTodayDateString(),
    });
    setShowAddTaskModal(false);
    refreshData();
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
    refreshData();
  };

  const handleSaveTaskNotes = () => {
    if (!selectedTaskForNotes) return;
    updateTaskStatus(selectedTaskForNotes.id, "completed", taskNotesInput);
    setSelectedTaskForNotes(null);
    setTaskNotesInput("");
    refreshData();
  };

  // User Management Handlers
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.name) {
      alert("Please enter both name and email.");
      return;
    }

    const cleanEmail = newUserForm.email.trim().toLowerCase();
    const isSuper = cleanEmail === "ekansh@firstclick.com";

    const newProf: UserProfile = {
      id: `emp-${Date.now()}`,
      email: cleanEmail,
      name: newUserForm.name,
      role: isSuper ? "super_admin" : "employee",
      department: newUserForm.department,
      createdAt: new Date().toISOString(),
    };

    saveProfile(newProf);
    setNewUserForm({ name: "", email: "", department: "Fullstack Development", password: "" });
    setShowAddUserModal(false);
    refreshData();
  };

  const handleDeleteUser = (email: string) => {
    if (confirm(`Are you sure you want to delete employee ${email}?`)) {
      try {
        deleteProfile(email);
        refreshData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Supabase Config Save
  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseCredentials(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    setSupabaseSavedToast(true);
    setTimeout(() => setSupabaseSavedToast(false), 3000);
  };

  const handleCopySqlScript = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setShowSqlCopiedToast(true);
    setTimeout(() => setShowSqlCopiedToast(false), 3000);
  };

  // Realtime Live Stats Calculation
  const todayStr = getTodayDateString();
  const todayLogs = attendanceLogs.filter((l) => l.date === todayStr);
  const activeNowCount = todayLogs.filter((l) => !l.clockOut).length;
  const fullDayCount = todayLogs.filter((l) => l.status === "FULL_DAY").length;
  const halfDayCount = todayLogs.filter((l) => l.status.includes("HALF_DAY")).length;
  const totalEmployeesCount = profiles.length;

  // Helper formatting for Attendance Badges
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "FULL_DAY":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> FULL DAY (ON TIME)
          </span>
        );
      case "PRESENT_ONLINE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ONLINE / IN SHIFT
          </span>
        );
      case "HALF_DAY_LATE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> HALF DAY (LATE LOGIN)
          </span>
        );
      case "HALF_DAY_EARLY":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span> HALF DAY (EARLY LOGOUT)
          </span>
        );
      case "HALF_DAY_BOTH":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span> HALF DAY (LATE & EARLY)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-gray-500/15 text-gray-400 border border-gray-500/30">
            NOT LOGGED IN
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0c0c16] border border-purple-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white">
        
        {/* Top Bar Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#07070e]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-wide text-white">
                  FIRST CLICK REALTIME EMPLOYEE PORTAL
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
                  REALTIME v2.4
                </span>
              </div>
              <p className="text-xs text-purple-300/70 font-mono">
                Strict 10:00 AM Login & 6:00 PM Logout Attendance System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Realtime Live Clock Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/20 font-mono text-xs text-purple-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ════════════════════════════════════════════════════════════
             VIEW 1: LOGIN / UNAUTHENTICATED STATE
             ════════════════════════════════════════════════════════════ */}
          {!currentUser && (
            <div className="max-w-md mx-auto py-6 sm:py-8">
              <div className="bg-[#121222] border border-purple-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-900/30 text-purple-400 text-2xl border border-purple-500/30 mb-1">
                    {authTab === "login" ? "🔑" : "📝"}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {authTab === "login" ? "Employee & Admin Portal" : "Create New Account"}
                  </h3>
                  <p className="text-xs text-purple-300/70">
                    {authTab === "login"
                      ? "Sign in with your real credentials to log attendance & access tasks."
                      : "Register your email & set a custom password for Realtime portal access."}
                  </p>
                </div>

                {/* Auth Tab Switcher */}
                <div className="flex rounded-xl bg-[#090912] p-1 border border-purple-900/50">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab("login");
                      setAuthError("");
                      setAuthSuccessMsg("");
                    }}
                    className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                      authTab === "login"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-purple-300/60 hover:text-purple-200"
                    }`}
                  >
                    🔑 Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab("register");
                      setAuthError("");
                      setAuthSuccessMsg("");
                    }}
                    className={`flex-1 py-2 text-xs font-bold font-mono rounded-lg transition-all ${
                      authTab === "register"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-purple-300/60 hover:text-purple-200"
                    }`}
                  >
                    📝 Register
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
                    ⚠️ {authError}
                  </div>
                )}

                {authSuccessMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs text-center font-medium animate-pulse">
                    {authSuccessMsg}
                  </div>
                )}

                {/* LOGIN FORM */}
                {authTab === "login" && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Enter your registered email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isAuthSubmitting ? "Authenticating..." : "Login to Portal →"}
                    </button>

                    <div className="pt-4 border-t border-purple-900/30 space-y-3">
                      <p className="text-[11px] font-mono text-center text-purple-300/60 uppercase">
                        ⚡ Quick Select Admin Account
                      </p>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSelectEmail("ekansh@firstclick.com")}
                          className="w-full py-2.5 px-4 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/60 text-purple-200 text-xs font-bold text-center transition-colors cursor-pointer"
                        >
                          👑 Ekansh (Super Admin)
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* REGISTER FORM */}
                {authTab === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Priya Singh"
                        value={regForm.name}
                        onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. priya@firstclick.com"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                          Department
                        </label>
                        <select
                          value={regForm.department}
                          onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                          className="w-full px-3 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white text-xs outline-none focus:border-purple-500"
                        >
                          <option value="Fullstack Development">Fullstack Development</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Meta Ads & Automation">Meta Ads & Automation</option>
                          <option value="Content & Strategy">Content & Strategy</option>
                          <option value="Sales & Marketing">Sales & Marketing</option>
                          <option value="Management">Management</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                          Role
                        </label>
                        <select
                          value={regForm.role}
                          onChange={(e) => setRegForm({ ...regForm, role: e.target.value as UserRole })}
                          className="w-full px-3 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white text-xs outline-none focus:border-purple-500"
                        >
                          <option value="employee">Employee</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                        Set Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Set your password"
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1.5">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={regForm.confirmPassword}
                        onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#090912] border border-purple-900/50 text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isAuthSubmitting ? "Creating Account..." : "Register & Sign In →"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
             LOGGED IN HEADER USER SUMMARY BAR
             ════════════════════════════════════════════════════════════ */}
          {currentUser && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#131324] border border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-xl font-black text-purple-300">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-lg text-white">{currentUser.name}</h3>
                    {currentUser.role === "super_admin" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        👑 SUPER ADMIN
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        👤 TEAM MEMBER
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-purple-300/70">
                    {currentUser.email} • {currentUser.department || "General"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-white/5 border border-white/10 hover:bg-rose-950/40 hover:border-rose-500/40 hover:text-rose-300 transition-all cursor-pointer"
                >
                  Logout 🚪
                </button>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
             VIEW 2: SUPER ADMIN DASHBOARD (ekansh@firstclick.com)
             ════════════════════════════════════════════════════════════ */}
          {currentUser && currentUser.role === "super_admin" && (
            <div className="space-y-6">
              
              {/* Admin Navigation Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-purple-900/30 pb-3">
                <button
                  onClick={() => setAdminTab("attendance")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adminTab === "attendance"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  📊 Live Attendance Dashboard
                </button>

                <button
                  onClick={() => setAdminTab("tasks")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adminTab === "tasks"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  📋 Task Assignment Hub ({tasks.length})
                </button>

                <button
                  onClick={() => setAdminTab("team")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adminTab === "team"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  👥 Team Directory ({profiles.length})
                </button>

                <button
                  onClick={() => setAdminTab("supabase")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    adminTab === "supabase"
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-900/50"
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  }`}
                >
                  ⚡ Supabase Realtime Setup
                </button>
              </div>

              {/* ── ADMIN TAB 1: ATTENDANCE DASHBOARD ── */}
              {adminTab === "attendance" && (
                <div className="space-y-6">
                  {/* Realtime Overview Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-[#121222] border border-purple-900/40 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-purple-300/70">Total Team</span>
                      <div className="text-2xl font-black text-white">{totalEmployeesCount}</div>
                      <span className="text-[10px] text-gray-400">Registered Accounts</span>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-emerald-300">Active Right Now</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                      </div>
                      <div className="text-2xl font-black text-emerald-300">{activeNowCount}</div>
                      <span className="text-[10px] text-emerald-400/80">Logged in Today</span>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-blue-300">Full Day Today</span>
                      <div className="text-2xl font-black text-blue-300">{fullDayCount}</div>
                      <span className="text-[10px] text-blue-400/80">On Time & 6 PM Shift</span>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-amber-300">Half Day Flagged</span>
                      <div className="text-2xl font-black text-amber-300">{halfDayCount}</div>
                      <span className="text-[10px] text-amber-400/80">Late or Early Logout</span>
                    </div>
                  </div>

                  {/* Attendance Live Log Table */}
                  <div className="bg-[#121222] border border-purple-900/40 rounded-xl overflow-hidden space-y-4 p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-purple-900/30">
                      <div>
                        <h4 className="font-bold text-base text-white flex items-center gap-2">
                          <span>Realtime Today's Attendance Logs</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                            {todayStr}
                          </span>
                        </h4>
                        <p className="text-xs text-purple-300/70">
                          Automated calculation: Cutoff 10:00:00 AM (Login) & 06:00:00 PM (Logout).
                        </p>
                      </div>

                      <button
                        onClick={refreshData}
                        className="px-3 py-1.5 rounded-lg bg-purple-900/30 border border-purple-500/30 hover:bg-purple-900/50 text-xs font-mono text-purple-200 transition-colors"
                      >
                        🔄 Refresh Realtime
                      </button>
                    </div>

                    {todayLogs.length === 0 ? (
                      <div className="text-center py-10 space-y-2">
                        <span className="text-3xl">⏰</span>
                        <p className="text-sm text-gray-400 font-medium">No clock-in records yet for today.</p>
                        <p className="text-xs text-gray-500">
                          Employees clocking in will instantly appear here in real-time.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-purple-900/40 bg-purple-950/30 text-purple-300 uppercase font-mono text-[10px]">
                              <th className="p-3">Employee</th>
                              <th className="p-3">Clock In Time</th>
                              <th className="p-3">Clock Out Time</th>
                              <th className="p-3">Hours</th>
                              <th className="p-3">Attendance Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-900/20">
                            {todayLogs.map((log) => {
                              const inTime = new Date(log.clockIn).toLocaleTimeString();
                              const outTime = log.clockOut ? new Date(log.clockOut).toLocaleTimeString() : "ACTIVE 🟢";
                              return (
                                <tr key={log.id} className="hover:bg-purple-900/10 transition-colors">
                                  <td className="p-3">
                                    <div className="font-bold text-white text-xs">{log.name}</div>
                                    <div className="text-[10px] text-gray-400 font-mono">{log.email}</div>
                                  </td>
                                  <td className="p-3 font-mono">
                                    <div className="text-xs text-purple-200">{inTime}</div>
                                    {log.lateMinutes > 0 ? (
                                      <span className="text-[10px] text-amber-400 font-bold">
                                        ⚠️ Late by {log.lateMinutes} min
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-emerald-400">On Time (≤10:00 AM)</span>
                                    )}
                                  </td>
                                  <td className="p-3 font-mono">
                                    <div className="text-xs text-purple-200">{outTime}</div>
                                    {log.earlyLogoutMinutes > 0 ? (
                                      <span className="text-[10px] text-orange-400 font-bold">
                                        ⚠️ Early by {log.earlyLogoutMinutes} min
                                      </span>
                                    ) : log.clockOut ? (
                                      <span className="text-[10px] text-emerald-400">Full Shift (≥6:00 PM)</span>
                                    ) : (
                                      <span className="text-[10px] text-emerald-300 font-bold">In Progress...</span>
                                    )}
                                  </td>
                                  <td className="p-3 font-mono text-xs font-bold text-white">
                                    {log.totalHours > 0 ? `${log.totalHours} hrs` : "--"}
                                  </td>
                                  <td className="p-3">{renderStatusBadge(log.status)}</td>
                                  <td className="p-3 text-right">
                                    <button
                                      onClick={() => {
                                        setNewTaskForm((p) => ({ ...p, assignedToEmail: log.email }));
                                        setAdminTab("tasks");
                                        setShowAddTaskModal(true);
                                      }}
                                      className="px-2.5 py-1 rounded bg-purple-900/40 border border-purple-500/30 hover:bg-purple-800/50 text-purple-200 font-mono text-[10px] uppercase transition-colors"
                                    >
                                      Assign Task +
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── ADMIN TAB 2: TASK COMMAND CENTER ── */}
              {adminTab === "tasks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-white">Task Command Center</h4>
                      <p className="text-xs text-purple-300/70">
                        Assign tasks directly to employees & track progress live.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddTaskModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer flex items-center gap-1.5"
                    >
                      <span>+ Create New Task</span>
                    </button>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="p-8 rounded-xl bg-[#121222] border border-purple-900/40 text-center space-y-2">
                      <span className="text-3xl">📝</span>
                      <p className="text-sm font-medium text-gray-300">No tasks created yet.</p>
                      <button
                        onClick={() => setShowAddTaskModal(true)}
                        className="text-xs text-purple-400 underline"
                      >
                        Create your first task now
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(["pending", "in_progress", "completed"] as TaskStatus[]).map((colStatus) => {
                        const colTasks = tasks.filter((t) => t.status === colStatus);
                        const statusTitle =
                          colStatus === "pending"
                            ? "⏳ Pending"
                            : colStatus === "in_progress"
                            ? "⚡ In Progress"
                            : "✅ Completed";

                        return (
                          <div
                            key={colStatus}
                            className="bg-[#121222] border border-purple-900/40 rounded-xl p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
                              <h5 className="font-bold text-xs uppercase text-purple-200">{statusTitle}</h5>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300">
                                {colTasks.length}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {colTasks.map((t) => (
                                <div
                                  key={t.id}
                                  className="p-3.5 rounded-xl bg-[#090912] border border-purple-900/50 hover:border-purple-500/40 transition-all space-y-2"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <h6 className="font-bold text-xs text-white leading-snug">{t.title}</h6>
                                    <span
                                      className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                                        t.priority === "High"
                                          ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                          : t.priority === "Medium"
                                          ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                          : "bg-blue-950 text-blue-300 border border-blue-500/40"
                                      }`}
                                    >
                                      {t.priority}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-purple-300/80 line-clamp-2">{t.description}</p>

                                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
                                    <span>Assigned to: <strong className="text-purple-300">{t.assignedToName}</strong></span>
                                    <button
                                      onClick={() => {
                                        deleteTask(t.id);
                                        refreshData();
                                      }}
                                      className="text-rose-400 hover:text-rose-300 transition-colors"
                                    >
                                      Delete
                                    </button>
                                  </div>

                                  {t.completionNotes && (
                                    <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                                      💬 Notes: {t.completionNotes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── ADMIN TAB 3: TEAM DIRECTORY ── */}
              {adminTab === "team" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-white">Team Directory</h4>
                      <p className="text-xs text-purple-300/70">
                        Manage employee accounts & access credentials.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddUserModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                    >
                      + Add New Employee
                    </button>
                  </div>

                  <div className="bg-[#121222] border border-purple-900/40 rounded-xl overflow-hidden p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-purple-900/40 bg-purple-950/30 text-purple-300 uppercase font-mono text-[10px]">
                            <th className="p-3">Name</th>
                            <th className="p-3">Email Address</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Department</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-900/20">
                          {profiles.map((p) => (
                            <tr key={p.id} className="hover:bg-purple-900/10 transition-colors">
                              <td className="p-3 font-bold text-white text-xs">{p.name}</td>
                              <td className="p-3 font-mono text-purple-200 text-xs">{p.email}</td>
                              <td className="p-3">
                                {p.role === "super_admin" ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    SUPER ADMIN
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                    EMPLOYEE
                                  </span>
                                )}
                              </td>
                              <td className="p-3 font-mono text-gray-400 text-xs">{p.department || "General"}</td>
                              <td className="p-3 text-right">
                                {p.email.toLowerCase() !== "ekansh@firstclick.com" && (
                                  <button
                                    onClick={() => handleDeleteUser(p.email)}
                                    className="px-2.5 py-1 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/60 font-mono text-[10px] uppercase transition-colors"
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ADMIN TAB 4: SUPABASE SETUP ── */}
              {adminTab === "supabase" && (
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-[#121222] border border-purple-900/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                          <span>⚡ Supabase Database Credentials</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            SUPABASE JS LOADED
                          </span>
                        </h4>
                        <p className="text-xs text-purple-300/70">
                          Connect your live Supabase project URL and anon public key for persistent cloud synchronization.
                        </p>
                      </div>

                      <button
                        onClick={handleCopySqlScript}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer"
                      >
                        📋 Copy 1-Click SQL Script
                      </button>
                    </div>

                    {showSqlCopiedToast && (
                      <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center">
                        ✅ SQL Schema script copied to clipboard! Paste and run in your Supabase SQL Editor.
                      </div>
                    )}

                    <form onSubmit={handleSaveSupabaseConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1">
                          VITE_SUPABASE_URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://your-project.supabase.co"
                          value={supabaseUrlInput}
                          onChange={(e) => setSupabaseUrlInput(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090912] border border-purple-900/50 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-purple-300 uppercase tracking-wider mb-1">
                          VITE_SUPABASE_ANON_KEY
                        </label>
                        <input
                          type="password"
                          placeholder="eyJhbGciOi..."
                          value={supabaseKeyInput}
                          onChange={(e) => setSupabaseKeyInput(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#090912] border border-purple-900/50 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center justify-between pt-2">
                        {supabaseSavedToast ? (
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            ✅ Credentials Saved Successfully!
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-gray-400">
                            * BroadcastChannel & local engine active for fallback offline sync.
                          </span>
                        )}

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer shadow-lg"
                        >
                          Save Credentials →
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Copyable SQL Box */}
                  <div className="p-4 rounded-xl bg-[#080811] border border-purple-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-300 font-bold uppercase">
                        Supabase SQL Script Preview:
                      </span>
                      <button
                        onClick={handleCopySqlScript}
                        className="text-xs text-purple-400 underline font-mono"
                      >
                        Copy All SQL
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-black text-[11px] font-mono text-purple-200/90 overflow-x-auto max-h-52 border border-purple-900/30">
                      {SUPABASE_SQL_SCRIPT}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
             VIEW 3: EMPLOYEE DASHBOARD (Regular Staff View)
             ════════════════════════════════════════════════════════════ */}
          {currentUser && currentUser.role === "employee" && (
            <div className="space-y-6">

              {/* Attendance Shift Clock Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#131326] to-[#0d0d1b] border border-purple-900/50 shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-purple-400 font-semibold tracking-wider">
                      Today's Shift Tracker (10:00 AM - 06:00 PM)
                    </span>
                    <h4 className="text-xl font-black text-white flex items-center gap-2">
                      <span>Live Clock:</span>
                      <span className="font-mono text-purple-300">{currentTime.toLocaleTimeString()}</span>
                    </h4>
                  </div>

                  <div>
                    {myTodayAttendance
                      ? renderStatusBadge(myTodayAttendance.status)
                      : renderStatusBadge("ABSENT")}
                  </div>
                </div>

                {/* Clock In / Out Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {!myTodayAttendance ? (
                    <button
                      onClick={handleClockIn}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">⏱️</span>
                      <span>PUNCH IN TODAY (CLOCK IN)</span>
                    </button>
                  ) : !myTodayAttendance.clockOut ? (
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                        ✅ Logged in at {new Date(myTodayAttendance.clockIn).toLocaleTimeString()}
                        {myTodayAttendance.lateMinutes > 0 && (
                          <span className="block text-amber-400 font-bold mt-0.5">
                            ⚠️ Late Login Flagged (+{myTodayAttendance.lateMinutes} min after 10:00 AM)
                          </span>
                        )}
                      </div>

                      <button
                        onClick={handleClockOutClick}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-950/50 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>PUNCH OUT (CLOCK OUT) 🚪</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200 text-xs font-mono w-full flex items-center justify-between">
                      <div>
                        <span>PUNCH IN: {new Date(myTodayAttendance.clockIn).toLocaleTimeString()}</span>
                        <span className="mx-2">•</span>
                        <span>PUNCH OUT: {new Date(myTodayAttendance.clockOut).toLocaleTimeString()}</span>
                      </div>
                      <span className="font-bold text-white">TOTAL: {myTodayAttendance.totalHours} hrs</span>
                    </div>
                  )}
                </div>

                {/* Attendance Rule Banner */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30 text-[11px] text-purple-300/80 font-mono space-y-1">
                  <div className="font-bold text-purple-200 flex items-center gap-1.5">
                    <span>📌 Official Shift Rules:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 pl-1">
                    <li>Logins after <strong>10:00:00 AM</strong> are automatically marked as <strong>HALF DAY (Late Login)</strong>.</li>
                    <li>Logouts before <strong>06:00:00 PM</strong> are automatically marked as <strong>HALF DAY (Early Logout)</strong>.</li>
                    <li>Full day status requires clock-in on or before 10:00 AM and clock-out at or after 6:00 PM.</li>
                  </ul>
                </div>
              </div>

              {/* My Assigned Tasks Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                    <span>📋 My Assigned Tasks</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                      {tasks.filter((t) => t.assignedToEmail.toLowerCase() === currentUser.email.toLowerCase()).length}
                    </span>
                  </h4>
                  <span className="text-xs text-purple-300/70">Assigned by Super Admin (Ekansh)</span>
                </div>

                {tasks.filter((t) => t.assignedToEmail.toLowerCase() === currentUser.email.toLowerCase()).length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#121222] border border-purple-900/40 text-center space-y-1">
                    <span className="text-2xl">🎉</span>
                    <p className="text-xs font-medium text-gray-300">No pending tasks assigned to you right now.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks
                      .filter((t) => t.assignedToEmail.toLowerCase() === currentUser.email.toLowerCase())
                      .map((t) => (
                        <div
                          key={t.id}
                          className="p-4 rounded-xl bg-[#121222] border border-purple-900/40 space-y-3 flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-sm text-white">{t.title}</h5>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold ${
                                  t.priority === "High"
                                    ? "bg-rose-950 text-rose-300 border border-rose-500/40"
                                    : t.priority === "Medium"
                                    ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                                    : "bg-blue-950 text-blue-300 border border-blue-500/40"
                                }`}
                              >
                                {t.priority}
                              </span>
                            </div>

                            <p className="text-xs text-purple-300/80">{t.description}</p>

                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                              <span>Due: {t.dueDate}</span>
                              <span>•</span>
                              <span>By: {t.assignedBy}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-purple-300">
                              Status: <strong className="text-white">{t.status.replace("_", " ")}</strong>
                            </span>

                            {t.status === "pending" && (
                              <button
                                onClick={() => handleUpdateTaskStatus(t.id, "in_progress")}
                                className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase hover:bg-amber-900/60 transition-colors cursor-pointer"
                              >
                                Start Task ⚡
                              </button>
                            )}

                            {t.status === "in_progress" && (
                              <button
                                onClick={() => {
                                  setSelectedTaskForNotes(t);
                                  setTaskNotesInput("");
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase hover:bg-emerald-900/60 transition-colors cursor-pointer"
                              >
                                Mark Done ✅
                              </button>
                            )}

                            {t.status === "completed" && (
                              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                                ✅ Completed
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
         MODAL 1: EARLY LOGOUT WARNING MODAL
         ════════════════════════════════════════════════════════════ */}
      {showEarlyLogoutWarning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141428] border border-rose-500/50 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="text-3xl">⚠️</span>
              <h3 className="font-extrabold text-lg text-white">Early Logout Warning</h3>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed font-mono">
              It is currently before <strong>06:00:00 PM</strong>. Logging out now will automatically mark your attendance for today as <strong>HALF DAY (Early Logout)</strong>.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowEarlyLogoutWarning(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/10"
              >
                Cancel & Stay Logged In
              </button>
              <button
                onClick={executeClockOut}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg"
              >
                Confirm Early Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
         MODAL 2: CREATE TASK MODAL (ADMIN)
         ════════════════════════════════════════════════════════════ */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141428] border border-purple-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
              <h3 className="font-extrabold text-base text-white">Assign New Task</h3>
              <button onClick={() => setShowAddTaskModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Landing Page Banner"
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Assign to Employee</label>
                <select
                  required
                  value={newTaskForm.assignedToEmail}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedToEmail: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                >
                  <option value="">Select Employee...</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.email}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Task instructions and requirements..."
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Priority</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as TaskPriority })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskForm.dueDate}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg"
                >
                  Create & Assign Task →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
         MODAL 3: ADD NEW EMPLOYEE MODAL (ADMIN)
         ════════════════════════════════════════════════════════════ */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141428] border border-purple-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-purple-900/30">
              <h3 className="font-extrabold text-base text-white">Add New Employee Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikas Gupta"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. vikas@firstclick.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Department</label>
                <select
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
                >
                  <option value="Fullstack Development">Fullstack Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Meta Ads & Growth">Meta Ads & Growth</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Management">Management</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg"
                >
                  Create Employee Account →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
         MODAL 4: COMPLETE TASK NOTES MODAL (EMPLOYEE)
         ════════════════════════════════════════════════════════════ */}
      {selectedTaskForNotes && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141428] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-white">Mark Task Completed ✅</h3>
            <p className="text-xs text-purple-300/80 font-mono">
              Task: <strong>{selectedTaskForNotes.title}</strong>
            </p>

            <div>
              <label className="block text-xs font-mono text-purple-300 uppercase mb-1">Completion Notes / Link</label>
              <textarea
                rows={3}
                placeholder="Describe what was completed or paste preview URL..."
                value={taskNotesInput}
                onChange={(e) => setTaskNotesInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#080812] border border-purple-900/50 text-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedTaskForNotes(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTaskNotes}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg"
              >
                Submit & Complete →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
