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
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("hostels");

  // Booking Modal State
  const [showBooking, setShowBooking] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    studentName: "Arjun Sharma",
    studentRollNumber: "12345678",
    studentEmail: "arjun.sharma@student.lpu.co.in",
    department: "Computer Science",
    year: "2",
    gender: "Male",
    cgpa: "8.5",
    roomType: "Double",
    acPreference: "AC",
    specialAccommodations: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    fetchHostels();
    fetchMyApplications();
  }, [genderFilter, search]);

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
    fetch("http://localhost:5000/api/applications")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setMyApplications(d.data);
      })
      .catch(() => {});
  };

  const openBooking = (hostel) => {
    setSelectedHostel(hostel);
    setBookingForm((prev) => ({
      ...prev,
      gender: hostel.genderAllowed === "Female" ? "Female" : "Male",
    }));
    setShowBooking(true);
    setConfirmation(null);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        studentName: bookingForm.studentName,
        studentRollNumber: bookingForm.studentRollNumber,
        studentEmail: bookingForm.studentEmail,
        department: bookingForm.department,
        year: Number(bookingForm.year),
        gender: bookingForm.gender,
        cgpa: Number(bookingForm.cgpa),
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmation(data.data);
        setMyApplications((prev) => [data.data, ...prev]);
        fetchHostels(); // update available capacity
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-[#070710] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* ── Top Bar ── */}
      <nav className="sticky top-0 z-40 glass-dark border-b border-white/10 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-orange-500/25">
            L
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight">LPU Student Dashboard</span>
            <p className="text-[11px] text-slate-400">Hostel Allocation Portal • Session 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Logged in: 12345678</span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl glass border border-white/10 text-xs font-semibold hover:border-orange-500/40 hover:text-orange-300 transition-all"
          >
            ← Home
          </Link>
          <Link
            href="/student/login"
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            Logout
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Welcome Student Banner ── */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-2">
                🎓 Verified Student Account
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Welcome back, {bookingForm.studentName} 👋
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Roll No: <span className="text-slate-200 font-mono font-bold">{bookingForm.studentRollNumber}</span> • Dept:{" "}
                <span className="text-slate-200 font-semibold">{bookingForm.department}</span> • CGPA:{" "}
                <span className="text-emerald-400 font-bold">{bookingForm.cgpa}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("hostels")}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "hostels"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "glass text-slate-300 hover:text-white"
                }`}
              >
                <span>🏢 Available Hostels</span>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">{hostels.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("my-applications")}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "my-applications"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                    : "glass text-slate-300 hover:text-white"
                }`}
              >
                <span>📋 My Applications</span>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">{myApplications.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TAB 1: AVAILABLE HOSTELS & DIRECT BOOKING ── */}
        {activeTab === "hostels" && (
          <div>
            {/* Search & Filter Toolbar */}
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
                  const availBeds = hostel.availableBeds || hostel.availableCapacity || 100;
                  const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));

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
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <span>🏠 Book {hostel.code} Now</span>
                          <span>→</span>
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
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app._id || app.applicationId}
                    className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-black text-lg text-white">{app.applicationId}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            app.status === "ALLOCATED"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : app.status === "UNDER_REVIEW"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
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
                        <div className="text-xs text-slate-400">CGPA Verification</div>
                        <div className="text-lg font-black text-emerald-400">{app.cgpa} / 10.0</div>
                      </div>
                      <span className="text-[11px] text-slate-400">Processed by LPU Warden Office</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── BOOKING MODAL & RECEIPT ── */}
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
            {/* Modal Header */}
            <div className="sticky top-0 z-20 glass-dark border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-orange-400">Hostel Booking Form</span>
                <h2 className="text-xl font-black text-white">Apply for {selectedHostel.code}</h2>
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

            {confirmation ? (
              /* Success Receipt View */
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>

                <h3 className="text-2xl font-black text-white mb-1">Application Submitted Successfully!</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
                  Your hostel application is registered in the LPU allocation queue. Save your application ID for verification.
                </p>

                <div className="glass rounded-2xl p-5 border border-emerald-500/30 text-left mb-6 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Application Number:</span>
                    <span className="font-mono font-bold text-orange-400">{confirmation.applicationId}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Student Name:</span>
                    <span className="font-semibold text-white">{confirmation.studentName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Roll Number:</span>
                    <span className="font-mono text-white">{confirmation.studentRollNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Requested Hostel:</span>
                    <span className="font-semibold text-white">{selectedHostel.code} ({selectedHostel.name})</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Room Tier:</span>
                    <span className="font-semibold text-emerald-400">
                      {bookingForm.roomType} • {bookingForm.acPreference}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowBooking(false);
                    setConfirmation(null);
                    setActiveTab("my-applications");
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/25"
                >
                  View in My Applications →
                </button>
              </div>
            ) : (
              /* Booking Form View */
              <form onSubmit={handleBook} className="p-6 space-y-5">
                {/* Section 1: Student Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">1. Student Details</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.studentName}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Registration No. *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.studentRollNumber}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentRollNumber: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={bookingForm.studentEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentEmail: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Department *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.department}
                        onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Study Year</label>
                      <select
                        value={bookingForm.year}
                        onChange={(e) => setBookingForm({ ...bookingForm, year: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      >
                        {[1, 2, 3, 4, 5].map((y) => (
                          <option key={y} value={y}>Year {y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Gender</label>
                      <select
                        value={bookingForm.gender}
                        onChange={(e) => setBookingForm({ ...bookingForm, gender: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Current CGPA</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={bookingForm.cgpa}
                        onChange={(e) => setBookingForm({ ...bookingForm, cgpa: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Room Choice */}
                <div className="pt-2 border-t border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">2. Room Configuration</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">Room Sharing Type</label>
                      <select
                        value={bookingForm.roomType}
                        onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      >
                        <option>Single</option>
                        <option>Double</option>
                        <option>Triple</option>
                        <option>Quad</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">AC Preference</label>
                      <select
                        value={bookingForm.acPreference}
                        onChange={(e) => setBookingForm({ ...bookingForm, acPreference: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-orange-500 transition-all"
                      >
                        <option>AC</option>
                        <option>Non-AC</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Accessibility / Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Ground floor request due to medical reason or mobility accommodation..."
                      value={bookingForm.specialAccommodations}
                      onChange={(e) => setBookingForm({ ...bookingForm, specialAccommodations: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-orange-500 transition-all resize-none placeholder-slate-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Room Booking Application</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}