"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const HOSTEL_IMGS = {
  BH: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
  GH: "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=600&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
};

function getHostelImg(code) {
  if (!code) return HOSTEL_IMGS.DEFAULT;
  if (code.startsWith("BH")) return HOSTEL_IMGS.BH;
  if (code.startsWith("GH")) return HOSTEL_IMGS.GH;
  return HOSTEL_IMGS.DEFAULT;
}

export default function StudentDashboard() {
  const [token, setToken] = useState(null);
  const [currentStudent, setCurrentStudent] = useState({
    name: "Arjun Sharma",
    rollNumber: "12345678",
    email: "arjun.sharma@student.lpu.co.in",
    department: "Computer Science",
    year: 2,
    gender: "Male",
    cgpa: 8.5,
  });

  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("hostels"); // hostels | my-applications | roommates | preferences

  // Booking Modal State
  const [showBooking, setShowBooking] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    roomType: "Quad",
    acPreference: "AC",
    specialAccommodations: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [myApplications, setMyApplications] = useState([]);

  // Roommate & Compatibility State
  const [roommateData, setRoommateData] = useState(null);
  const [roommateLoading, setRoommateLoading] = useState(false);

  // Roommate Preferences State
  const [prefForm, setPrefForm] = useState({
    sleepSchedule: "Night Owl",
    foodPreference: "Vegetarian",
    cleanliness: "Very Clean",
    studyHabits: "Quiet",
    socialHabits: "Ambivert",
    noiseTolerance: "Low",
  });
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check local storage for session
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("student_token");
      const storedUser = localStorage.getItem("student_user");

      if (storedToken) setToken(storedToken);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setCurrentStudent(parsed);
          if (parsed.roommatePreferences) {
            setPrefForm(parsed.roommatePreferences);
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    fetchHostels();
    fetchMyApplications();
  }, [genderFilter, search, token]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchHostels = () => {
    setLoading(true);
    let url = "http://localhost:5000/api/hostels?";
    if (genderFilter !== "All") url += `gender=${genderFilter}&`;
    if (search) url += `search=${search}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHostels(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchMyApplications = () => {
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
    fetch("http://localhost:5000/api/applications/my", {
      headers: authHeader,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setMyApplications(d.data);
          const allocated = d.data.find((a) => a.status === "ALLOCATED");
          if (allocated && token) {
            fetchRoommates(allocated.studentRollNumber);
          }
        }
      })
      .catch(() => {});
  };

  const fetchRoommates = (roll) => {
    if (!token) return;
    setRoommateLoading(true);
    fetch(`http://localhost:5000/api/allocations/roommates/${roll || currentStudent.rollNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRoommateData(d.data);
      })
      .catch(() => {})
      .finally(() => setRoommateLoading(false));
  };

  const openBooking = (hostel) => {
    if (hostel.genderAllowed !== "Co-ed" && hostel.genderAllowed !== currentStudent.gender) {
      alert(`⚠️ Gender Mismatch: ${hostel.name} is reserved for ${hostel.genderAllowed} students.`);
      return;
    }
    setSelectedHostel(hostel);
    setShowBooking(true);
    setConfirmation(null);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login first to submit a room allocation request.");
      window.location.href = "/student/login";
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        specialAccommodations: bookingForm.specialAccommodations,
        preferences: [
          {
            hostelId: selectedHostel._id,
            hostelCode: selectedHostel.code,
            hostelName: selectedHostel.name,
            roomType: bookingForm.roomType,
            acPreference: bookingForm.acPreference,
            priority: 1,
          },
        ],
      };

      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmation(data.data);
        setMyApplications((prev) => [data.data, ...prev]);
        fetchHostels();
        showToast("✅ Application submitted & persisted to MongoDB!");
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch {
      alert("Network error. Please make sure backend is running on port 5000.");
    }
    setSubmitting(false);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login first.");
      return;
    }
    setSavingPrefs(true);
    try {
      const res = await fetch(`http://localhost:5000/api/students/${currentStudent.rollNumber}/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prefForm),
      });
      const data = await res.json();
      if (data.success) {
        showToast("✅ Roommate matching preferences updated!");
        if (roommateData) {
          fetchRoommates(currentStudent.rollNumber);
        }
      } else {
        alert(data.message || "Failed to update preferences.");
      }
    } catch {
      alert("Network error updating preferences.");
    }
    setSavingPrefs(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_user");
    window.location.href = "/student/login";
  };

  return (
    <div className="relative min-h-screen bg-[#070710] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl animate-bounce ${
            toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Top Bar ── */}
      <nav className="sticky top-0 z-40 glass-dark border-b border-white/10 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-500/25">
            L
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight">LPU Student Residential Portal</span>
            <p className="text-[11px] text-slate-400">Lovely Professional University • Room Allocation System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">
              {currentStudent.name} ({currentStudent.rollNumber})
            </span>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl glass border border-white/10 text-xs font-semibold hover:border-orange-500/40 hover:text-orange-300 transition-all"
          >
            ← Home
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/student/login"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold shadow-md shadow-orange-500/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Student Quick Bio Card */}
        <div className="glass-card rounded-3xl p-6 border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-orange-500/30">
              {currentStudent.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white">{currentStudent.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  {currentStudent.gender}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Year {currentStudent.year}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Roll No: <strong className="text-slate-200">{currentStudent.rollNumber}</strong> • {currentStudent.department} • CGPA:{" "}
                <strong className="text-emerald-400 font-bold">{currentStudent.cgpa} / 10.0</strong>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 glass p-1.5 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab("hostels")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "hostels"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🏢 Hostels Catalog
            </button>
            <button
              onClick={() => setActiveTab("my-applications")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "my-applications"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📋 My Applications</span>
              <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">{myApplications.length}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("roommates");
                fetchRoommates(currentStudent.rollNumber);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "roommates"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>👥 Roommates Matching</span>
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "preferences"
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ⚙️ Habits & Preferences
            </button>
          </div>
        </div>

        {/* ── TAB 1: HOSTELS CATALOG & BOOKING ── */}
        {activeTab === "hostels" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full sm:w-80">
                <span className="absolute left-4 top-3 text-slate-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search hostel name or code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:border-orange-500 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 glass p-1 rounded-2xl w-full sm:w-auto overflow-x-auto">
                {["All", "Male", "Female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      genderFilter === g
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {g === "All" ? "🏢 All Blocks" : g === "Male" ? "👦 Boys (BH1-9)" : "👧 Girls (GH1-3)"}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-3xl h-80 animate-pulse" />
                ))}
              </div>
            ) : hostels.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border border-white/10">
                <div className="text-5xl mb-3">🏢</div>
                <h3 className="text-lg font-bold text-white">No Hostels Match Your Criteria</h3>
                <p className="text-xs text-slate-400 mt-1">Try resetting the filters or clearing the search query.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => {
                  const totalBeds = hostel.totalBeds || hostel.totalCapacity || 360;
                  const availBeds = hostel.availableBeds !== undefined ? hostel.availableBeds : hostel.availableCapacity || 360;
                  const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));
                  const isEligibleGender = hostel.genderAllowed === "Co-ed" || hostel.genderAllowed === currentStudent.gender;

                  return (
                    <div
                      key={hostel._id}
                      className="glass-card rounded-3xl overflow-hidden border border-white/10 group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={getHostelImg(hostel.code)}
                          alt={hostel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-black/60 backdrop-blur-md text-white border border-white/10">
                            {hostel.code}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold border backdrop-blur-md ${
                              hostel.genderAllowed === "Female"
                                ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            }`}
                          >
                            {hostel.genderAllowed === "Female" ? "👧 Girls Wing" : "👦 Boys Wing"}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4">
                          <h3 className="text-xl font-black text-white">{hostel.name}</h3>
                          <p className="text-xs text-slate-300">📍 {hostel.campusLocation || "LPU Campus"}</p>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Occupancy bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-slate-400">Available Beds</span>
                              <span className="text-emerald-400 font-bold">{availBeds} Vacant</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                                style={{ width: `${occPercent}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                              <span>{occPercent}% Filled</span>
                              <span>{totalBeds} Capacity</span>
                            </div>
                          </div>

                          {/* Quick specs */}
                          <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                            <div className="glass rounded-xl p-2 border border-white/5">
                              <div className="text-xs text-slate-400">Floors</div>
                              <div className="font-bold text-white text-sm">9 Floors</div>
                            </div>
                            <div className="glass rounded-xl p-2 border border-white/5">
                              <div className="text-xs text-slate-400">Room Types</div>
                              <div className="font-bold text-orange-400 text-sm">AC &amp; Non-AC</div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => openBooking(hostel)}
                          disabled={!isEligibleGender}
                          className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                            isEligibleGender
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 hover:scale-[1.02] active:scale-95"
                              : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/5"
                          }`}
                        >
                          {isEligibleGender ? (
                            <>
                              <span>🏠 Book {hostel.code} Now</span>
                              <span>→</span>
                            </>
                          ) : (
                            <span>⚠️ {hostel.genderAllowed} Wing Only</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: MY APPLICATIONS ── */}
        {activeTab === "my-applications" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Your Submitted Room Applications</h2>
              <button
                onClick={() => setActiveTab("hostels")}
                className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold hover:bg-orange-500/20 transition-all"
              >
                + New Application
              </button>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border border-white/10">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-white">No Applications Yet</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  You haven't submitted any room allocation requests for the current semester.
                </p>
                <button
                  onClick={() => setActiveTab("hostels")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25"
                >
                  Browse Available Hostels
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {myApplications.map((app) => {
                  const isAllocated = app.status === "ALLOCATED";

                  return (
                    <div
                      key={app._id || app.applicationId}
                      className={`glass-card rounded-3xl p-6 border transition-all ${
                        isAllocated ? "border-emerald-500/40 bg-emerald-500/5" : "border-white/10"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono font-black text-lg text-white">{app.applicationId}</span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                isAllocated
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : app.status === "UNDER_REVIEW"
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                  : app.status === "REJECTED"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-300">
                            Student: <span className="font-semibold text-white">{app.studentName}</span> ({app.studentRollNumber}) •{" "}
                            {app.department}
                          </p>

                          {app.preferences && app.preferences.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {app.preferences.map((p, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300">
                                  Choice {idx + 1}: <strong>{p.hostelCode || p.hostelName}</strong> ({p.roomType || "Room"} •{" "}
                                  {p.acPreference || "AC"})
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="text-[11px] text-slate-500 mt-3">
                            Submitted on: {new Date(app.submittedAt || Date.now()).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end justify-center gap-2">
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Academic Score</div>
                            <div className="text-lg font-black text-emerald-400">{app.cgpa} / 10.0</div>
                          </div>
                          <span className="text-[11px] text-slate-400">Processed by Chief Warden Office</span>
                        </div>
                      </div>

                      {/* Highlighted Allocation Details */}
                      {isAllocated && (
                        <div className="mt-5 pt-5 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">
                              🛏️
                            </div>
                            <div>
                              <div className="text-xs font-bold text-emerald-400">CONFIRMED ROOM ALLOTMENT</div>
                              <div className="text-sm font-black text-white">
                                {app.assignedHostelName} • Room {app.assignedRoomNumber} • Bed Slot #{app.assignedBedNumber}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab("roommates");
                              fetchRoommates(app.studentRollNumber);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
                          >
                            👥 View Roommates & Compatibility Score →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: ROOMMATES & COMPATIBILITY MATCHING ── */}
        {activeTab === "roommates" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">Roommate Compatibility & Algorithmic Matching</h2>
              <p className="text-xs text-slate-400 mt-1">
                Calculated based on sleep schedules, study habits, cleanliness, and lifestyle preferences.
              </p>
            </div>

            {roommateLoading ? (
              <div className="glass-card rounded-3xl p-12 text-center animate-pulse">Loading roommate data...</div>
            ) : !roommateData ? (
              <div className="text-center py-20 glass rounded-3xl border border-white/10">
                <div className="text-5xl mb-3">🚪</div>
                <h3 className="text-lg font-bold text-white">No Room Allotted Yet</h3>
                <p className="text-xs text-slate-400 mt-1 mb-5">
                  Roommates and compatibility scores appear automatically once your application is approved and a bed is allocated.
                </p>
                <button
                  onClick={() => setActiveTab("my-applications")}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25"
                >
                  Check Application Status
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Room Info Header */}
                <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">🏨</div>
                    <div>
                      <h3 className="text-lg font-black text-white">{roommateData.hostel}</h3>
                      <p className="text-xs text-slate-300">
                        Room <strong className="text-emerald-400">{roommateData.roomNumber}</strong> • Bed Slot: #{roommateData.bedNumber}
                      </p>
                    </div>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Occupancy Verified
                  </span>
                </div>

                {/* Roommate Cards */}
                {roommateData.roommates && roommateData.roommates.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {roommateData.roommates.map((rm, idx) => (
                      <div key={idx} className="glass-card rounded-3xl p-6 border border-white/10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white text-lg">
                              {rm.name[0]}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-base">{rm.name}</h4>
                              <p className="text-xs text-slate-400">
                                {rm.department} • Year {rm.year} • Roll: {rm.rollNumber}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-2xl font-black text-emerald-400">{rm.compatibility?.score}%</span>
                            <div className="text-[10px] font-bold text-slate-400">{rm.compatibility?.category} Match</div>
                          </div>
                        </div>

                        {/* Compatibility Breakdown */}
                        {rm.compatibility?.breakdown && (
                          <div className="space-y-2 pt-3 border-t border-white/5">
                            {Object.entries(rm.compatibility.breakdown).map(([trait, info]) => (
                              <div key={trait} className="flex items-center justify-between text-xs">
                                <span className="capitalize text-slate-400">
                                  {trait.replace(/([A-Z])/g, " $1")}:
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-300 font-medium">{info.student2}</span>
                                  {info.match ? (
                                    <span className="text-emerald-400 text-xs">✓ Match</span>
                                  ) : (
                                    <span className="text-slate-500 text-xs">~ Diff</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass rounded-3xl border border-white/10 text-slate-400 text-xs">
                    You are currently the first student allocated to this room. Other matched roommates will appear here as they are allocated.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: ROOMMATE HABITS & PREFERENCES ── */}
        {activeTab === "preferences" && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">Roommate Compatibility Preferences</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust your lifestyle habits to help the allocation engine match you with compatible peers.
                </p>
              </div>

              <form onSubmit={handleSavePreferences} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Sleep Schedule</label>
                    <select
                      value={prefForm.sleepSchedule}
                      onChange={(e) => setPrefForm({ ...prefForm, sleepSchedule: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                    >
                      <option>Early Bird</option>
                      <option>Night Owl</option>
                      <option>Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Food Preference</label>
                    <select
                      value={prefForm.foodPreference}
                      onChange={(e) => setPrefForm({ ...prefForm, foodPreference: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                    >
                      <option>Vegetarian</option>
                      <option>Non-Vegetarian</option>
                      <option>Eggetarian</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Cleanliness</label>
                    <select
                      value={prefForm.cleanliness}
                      onChange={(e) => setPrefForm({ ...prefForm, cleanliness: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                    >
                      <option>Very Clean</option>
                      <option>Moderate</option>
                      <option>Relaxed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Study Habits</label>
                    <select
                      value={prefForm.studyHabits}
                      onChange={(e) => setPrefForm({ ...prefForm, studyHabits: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                    >
                      <option>Quiet</option>
                      <option>Group Study</option>
                      <option>Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Social Habits</label>
                    <select
                      value={prefForm.socialHabits}
                      onChange={(e) => setPrefForm({ ...prefForm, socialHabits: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                    >
                      <option>Introvert</option>
                      <option>Ambivert</option>
                      <option>Extrovert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">Noise Tolerance</label>
                    <select
                      value={prefForm.noiseTolerance}
                      onChange={(e) => setPrefForm({ ...prefForm, noiseTolerance: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                    >
                      <option>Low</option>
                      <option>Moderate</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingPrefs}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {savingPrefs ? "Saving to Database..." : "Save Preferences to MongoDB"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── BOOKING MODAL ── */}
      {showBooking && selectedHostel && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowBooking(false);
              setConfirmation(null);
            }
          }}
        >
          <div className="glass-card rounded-3xl border border-orange-500/40 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 z-20 glass-dark border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-orange-400">Hostel Allocation Form</span>
                <h2 className="text-xl font-black text-white">Apply for {selectedHostel.name} ({selectedHostel.code})</h2>
              </div>
              <button
                onClick={() => {
                  setShowBooking(false);
                  setConfirmation(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {confirmation ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                    ✓
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">Application Persisted in Database!</h3>
                  <p className="text-xs text-slate-300 mb-6">
                    Your allocation request has reached the backend API and is saved in MongoDB.
                  </p>

                  <div className="glass rounded-2xl p-4 text-left border border-white/10 mb-6 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Application ID:</span>
                      <strong className="font-mono text-orange-400">{confirmation.applicationId}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Target Hostel:</span>
                      <strong className="text-white">{selectedHostel.name}</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Status:</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        {confirmation.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowBooking(false);
                        setConfirmation(null);
                        setActiveTab("my-applications");
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20"
                    >
                      View in My Applications
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBook} className="space-y-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    Applying as: <strong className="text-white">{currentStudent.name}</strong> (Roll: {currentStudent.rollNumber}) •{" "}
                    {currentStudent.department} • CGPA: <strong className="text-emerald-400">{currentStudent.cgpa}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Room Type</label>
                      <select
                        value={bookingForm.roomType}
                        onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      >
                        <option value="Quad">Quad (4 Sharing)</option>
                        <option value="Double">Double (2 Sharing)</option>
                        <option value="Triple">Triple (3 Sharing)</option>
                        <option value="Single">Single (1 Student)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Climate Control</label>
                      <select
                        value={bookingForm.acPreference}
                        onChange={(e) => setBookingForm({ ...bookingForm, acPreference: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      >
                        <option value="AC">Air Conditioned (AC)</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Either">Either Available</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Special Accommodations / Accessibility (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Ground floor preference due to mobility or medical condition..."
                      value={bookingForm.specialAccommodations}
                      onChange={(e) => setBookingForm({ ...bookingForm, specialAccommodations: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all mt-4"
                  >
                    {submitting ? "Submitting Application to Database..." : "Confirm & Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
