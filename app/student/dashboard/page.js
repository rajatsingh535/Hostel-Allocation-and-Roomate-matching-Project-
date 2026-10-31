"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const HOSTEL_IMGS = {
  BH: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
  GH: "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=600&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
};

function getHostelImg(code) {
  if (!code) return HOSTEL_IMGS.DEFAULT;
  if (code.startsWith("BH")) return HOSTEL_IMGS.BH;
  if (code.startsWith("GH")) return HOSTEL_IMGS.GH;
  return HOSTEL_IMGS.DEFAULT;
}

// ── Status badge styling ──
function StatusBadge({ status }) {
  const cls = {
    ALLOCATED:    "status-allocated",
    UNDER_REVIEW: "status-review",
    REJECTED:     "status-rejected",
    SUBMITTED:    "status-submitted",
  }[status] || "status-submitted";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

export default function StudentDashboard() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("hostels");

  // Booking modal state
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
      .then((d) => { if (d.success) setHostels(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const fetchMyApplications = () => {
    fetch("http://localhost:5000/api/applications")
      .then((r) => r.json())
      .then((d) => { if (d.success) setMyApplications(d.data); })
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
        fetchHostels();
      } else {
        alert(data.message || "Submission failed.");
      }
    } catch {
      alert("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-alt)] text-stone-900">

      {/* ── Top Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[var(--border)] shadow-sm px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center font-black text-white text-sm">
            L
          </div>
          <div>
            <span className="font-bold text-[15px] text-stone-900">LPU Student Dashboard</span>
            <p className="text-[11px] text-stone-400 leading-none">Hostel Allocation Portal · Session 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Online indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-stone-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse inline-block" />
            Logged in: {bookingForm.studentRollNumber}
          </div>
          <Link href="/" className="btn-ghost text-xs px-3 py-2 rounded-lg border border-[var(--border)]">
            ← Home
          </Link>
          <Link
            href="/student/login"
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            Logout
          </Link>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-8">

        {/* ── Welcome Banner ── */}
        <div className="welcome-banner mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="badge-orange mb-3 inline-flex">
              🎓 Verified Student Account
            </div>
            <h1 className="text-[26px] font-black text-stone-900">
              Welcome back, {bookingForm.studentName} 👋
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Roll No:{" "}
              <span className="text-stone-700 font-mono font-bold">{bookingForm.studentRollNumber}</span>
              {" "}&nbsp;·&nbsp;{" "}
              Dept: <span className="text-stone-700 font-semibold">{bookingForm.department}</span>
              {" "}&nbsp;·&nbsp;{" "}
              CGPA: <span className="text-[var(--success)] font-bold">{bookingForm.cgpa}</span>
            </p>
          </div>

          {/* Tab switcher */}
          <div className="filter-bar">
            <button
              onClick={() => setActiveTab("hostels")}
              className={`filter-tab flex items-center gap-2 ${activeTab === "hostels" ? "active" : ""}`}
            >
              🏢 Available Hostels
              <span className="bg-white/30 px-1.5 py-0.5 rounded-full text-[10px]">{hostels.length}</span>
            </button>
            <button
              onClick={() => setActiveTab("my-applications")}
              className={`filter-tab flex items-center gap-2 ${activeTab === "my-applications" ? "active" : ""}`}
            >
              📋 My Applications
              <span className="bg-white/30 px-1.5 py-0.5 rounded-full text-[10px]">{myApplications.length}</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: AVAILABLE HOSTELS ── */}
        {activeTab === "hostels" && (
          <div>
            {/* Search & filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full sm:w-72">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search hostel name or code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-light pl-10"
                />
              </div>

              <div className="filter-bar">
                {["All", "Male", "Female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`filter-tab ${genderFilter === g ? "active" : ""}`}
                  >
                    {g === "All" ? "All Blocks" : g === "Male" ? "Boys (BH1-9)" : "Girls (GH1-3)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Skeleton loaders */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-stone-100 rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : hostels.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[var(--border)] rounded-2xl">
                <div className="text-5xl mb-3">🏢</div>
                <h3 className="text-lg font-bold text-stone-800">No Hostels Match Your Criteria</h3>
                <p className="text-sm text-stone-500 mt-1">Try resetting the filters or clearing the search.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostels.map((hostel) => {
                  const totalBeds = hostel.totalBeds || hostel.totalCapacity || 360;
                  const availBeds = hostel.availableBeds || hostel.availableCapacity || 100;
                  const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));

                  return (
                    <div key={hostel._id} className="card group flex flex-col overflow-hidden">
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getHostelImg(hostel.code)}
                          alt={hostel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Badges */}
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-stone-800 shadow-sm">
                          {hostel.code}
                        </span>
                        <span
                          className={`absolute top-3 right-3 text-[11px] font-bold ${
                            hostel.genderAllowed === "Female" ? "badge-pink" : "badge-blue"
                          }`}
                        >
                          {hostel.genderAllowed === "Female" ? "Girls Wing" : "Boys Wing"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-stone-900 text-[15px] leading-tight">{hostel.name}</h3>
                        <p className="text-xs text-stone-400 mt-0.5 mb-4">📍 {hostel.campusLocation || "LPU Campus"}</p>

                        {/* Occupancy */}
                        <div className="mb-4">
                          <div className="flex justify-between text-xs font-medium mb-1.5">
                            <span className="text-stone-500">Available Beds</span>
                            <span className="text-[var(--success)] font-semibold">{availBeds} Vacant</span>
                          </div>
                          <div className="progress-bar-track">
                            <div className="progress-bar-fill" style={{ width: `${occPercent}%` }} />
                          </div>
                          <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                            <span>{occPercent}% Filled</span>
                            <span>{totalBeds} Capacity</span>
                          </div>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-[var(--bg-alt)] rounded-xl p-2.5 border border-[var(--border)] text-center">
                            <div className="text-[11px] text-stone-400">Floors</div>
                            <div className="font-bold text-stone-800 text-sm">9 Floors</div>
                          </div>
                          <div className="bg-[var(--bg-alt)] rounded-xl p-2.5 border border-[var(--border)] text-center">
                            <div className="text-[11px] text-stone-400">Room Types</div>
                            <div className="font-bold text-[var(--primary)] text-sm">AC &amp; Non-AC</div>
                          </div>
                        </div>

                        {/* Book button */}
                        <button
                          onClick={() => openBooking(hostel)}
                          className="btn-primary w-full text-sm rounded-[10px] mt-auto"
                        >
                          Book {hostel.code} Now →
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
              <h2 className="text-xl font-bold text-stone-900">Your Submitted Room Applications</h2>
              <button
                onClick={() => setActiveTab("hostels")}
                className="btn-secondary text-sm px-4 py-2 rounded-[10px]"
              >
                + New Application
              </button>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[var(--border)] rounded-2xl">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-stone-800">No Applications Yet</h3>
                <p className="text-sm text-stone-500 mt-1 mb-5">
                  You haven't submitted any room allocation requests for the current semester.
                </p>
                <button
                  onClick={() => setActiveTab("hostels")}
                  className="btn-primary text-sm px-6 py-2.5 rounded-[10px]"
                >
                  Browse Available Hostels
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app._id || app.applicationId}
                    className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono font-black text-base text-stone-900">{app.applicationId}</span>
                        <StatusBadge status={app.status} />
                      </div>

                      <p className="text-sm text-stone-600">
                        Student:{" "}
                        <span className="font-semibold text-stone-900">{app.studentName}</span>{" "}
                        ({app.studentRollNumber}) · {app.department}
                      </p>

                      {app.preferences && app.preferences.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {app.preferences.map((p, idx) => (
                            <span key={idx} className="chip">
                              Choice {idx + 1}: <strong>{p.hostelCode || p.hostelName}</strong> ({p.roomType || "Room"} · {p.acPreference || "AC"})
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[11px] text-stone-400 mt-3">
                        Submitted: {new Date(app.submittedAt || Date.now()).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="text-xs text-stone-400">CGPA Verification</div>
                      <div className="text-xl font-black text-[var(--success)]">{app.cgpa} / 10.0</div>
                      <span className="text-[11px] text-stone-400">Processed by LPU Warden Office</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════
          BOOKING MODAL
          ══════════════════════════════════════════ */}
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
          <div className="modal-card w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <p className="section-label text-[11px] mb-0.5">Hostel Booking Form</p>
                <h2 className="text-lg font-black text-stone-900">Apply for {selectedHostel.code}</h2>
              </div>
              <button
                onClick={() => { setShowBooking(false); setConfirmation(null); }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Success receipt */}
            {confirmation ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--success-soft)] border border-green-200 text-[var(--success)] text-3xl flex items-center justify-center mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-1">Application Submitted!</h3>
                <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
                  Your hostel application is registered in the LPU allocation queue. Save your ID below.
                </p>

                <div className="bg-[var(--bg-alt)] rounded-2xl p-5 border border-[var(--border)] text-left mb-6 space-y-2.5">
                  {[
                    ["Application Number", confirmation.applicationId, "text-[var(--primary)] font-mono font-bold"],
                    ["Student Name", confirmation.studentName, "font-semibold text-stone-900"],
                    ["Roll Number", confirmation.studentRollNumber, "font-mono text-stone-900"],
                    ["Requested Hostel", `${selectedHostel.code} (${selectedHostel.name})`, "font-semibold text-stone-900"],
                    ["Room Tier", `${bookingForm.roomType} · ${bookingForm.acPreference}`, "text-[var(--success)] font-semibold"],
                  ].map(([label, val, cls]) => (
                    <div key={label} className="flex justify-between items-center text-sm">
                      <span className="text-stone-500">{label}:</span>
                      <span className={cls}>{val}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => { setShowBooking(false); setConfirmation(null); setActiveTab("my-applications"); }}
                  className="btn-primary w-full py-3.5 rounded-[10px]"
                >
                  View in My Applications →
                </button>
              </div>
            ) : (
              /* Booking form */
              <form onSubmit={handleBook} className="p-6 space-y-6">
                {/* Section 1: Student Info */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                    1. Student Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.studentName}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                        className="input-light"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Registration No. *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.studentRollNumber}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentRollNumber: e.target.value })}
                        className="input-light"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={bookingForm.studentEmail}
                        onChange={(e) => setBookingForm({ ...bookingForm, studentEmail: e.target.value })}
                        className="input-light"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Department *</label>
                      <input
                        type="text"
                        required
                        value={bookingForm.department}
                        onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
                        className="input-light"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Study Year</label>
                      <select
                        value={bookingForm.year}
                        onChange={(e) => setBookingForm({ ...bookingForm, year: e.target.value })}
                        className="input-light"
                      >
                        {[1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Gender</label>
                      <select
                        value={bookingForm.gender}
                        onChange={(e) => setBookingForm({ ...bookingForm, gender: e.target.value })}
                        className="input-light"
                      >
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Current CGPA</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={bookingForm.cgpa}
                        onChange={(e) => setBookingForm({ ...bookingForm, cgpa: e.target.value })}
                        className="input-light"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Room Config */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                    2. Room Configuration
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Room Sharing Type</label>
                      <select
                        value={bookingForm.roomType}
                        onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value })}
                        className="input-light"
                      >
                        <option>Single</option>
                        <option>Double</option>
                        <option>Triple</option>
                        <option>Quad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">AC Preference</label>
                      <select
                        value={bookingForm.acPreference}
                        onChange={(e) => setBookingForm({ ...bookingForm, acPreference: e.target.value })}
                        className="input-light"
                      >
                        <option>AC</option>
                        <option>Non-AC</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Accessibility / Special Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Ground floor request due to medical reason or mobility accommodation…"
                      value={bookingForm.specialAccommodations}
                      onChange={(e) => setBookingForm({ ...bookingForm, specialAccommodations: e.target.value })}
                      className="input-light resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3.5 rounded-[10px] text-[15px] disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Submitting Application…</span>
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
