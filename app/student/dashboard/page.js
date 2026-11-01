"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const HOSTEL_IMGS = {
  BH: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  GH: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
};

function getHostelImg(code) {
  if (!code) return HOSTEL_IMGS.DEFAULT;
  if (code.startsWith("BH")) return HOSTEL_IMGS.BH;
  if (code.startsWith("GH")) return HOSTEL_IMGS.GH;
  return HOSTEL_IMGS.DEFAULT;
}

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
  const [dashboardStats, setDashboardStats] = useState({
    totalHostels: 0,
    availableRooms: 0,
    pendingApplications: 0,
    approvedApplications: 0,
  });

  // Friend Requests State
  const [friendRequests, setFriendRequests] = useState({
    received: [],
    sent: [],
  });
  const [showFriendRequestModal, setShowFriendRequestModal] = useState(false);
  const [friendRequestForm, setFriendRequestForm] = useState({
    toRollNumber: "",
    message: "",
  });

  // Group Booking State
  const [myGroups, setMyGroups] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

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
    bookWithFriends: false,
    friendRollNumbers: ["", "", ""],
    roomPreferences: {
      floor: "",
      quietZone: false,
      studyFocused: false,
    },
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [myApplications, setMyApplications] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchHostels();
    fetchMyApplications();
    fetchFriendRequests();
    fetchMyGroups();
    calculateDashboardStats();
  }, [genderFilter, search]);
  
  const calculateDashboardStats = () => {
    const stats = {
      totalHostels: hostels.length,
      availableRooms: hostels.reduce((sum, h) => sum + (h.availableBeds || 0), 0),
      pendingApplications: myApplications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length,
      approvedApplications: myApplications.filter(a => a.status === 'ALLOCATED').length,
    };
    setDashboardStats(stats);
  };

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

  const fetchFriendRequests = () => {
    const rollNumber = bookingForm.studentRollNumber;
    
    Promise.all([
      fetch(`http://localhost:5000/api/friend-requests/received/${rollNumber}`).then(r => r.json()),
      fetch(`http://localhost:5000/api/friend-requests/sent/${rollNumber}`).then(r => r.json()),
    ]).then(([receivedRes, sentRes]) => {
      setFriendRequests({
        received: receivedRes.success ? receivedRes.data : [],
        sent: sentRes.success ? sentRes.data : [],
      });
    }).catch(() => {});
  };

  const fetchMyGroups = () => {
    const rollNumber = bookingForm.studentRollNumber;
    fetch(`http://localhost:5000/api/friend-requests/groups/${rollNumber}`)
      .then(r => r.json())
      .then(d => { if (d.success) setMyGroups(d.data); })
      .catch(() => {});
  };

  const sendFriendRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/friend-requests/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromStudent: {
            rollNumber: bookingForm.studentRollNumber,
            name: bookingForm.studentName,
            department: bookingForm.department,
          },
          toStudent: {
            rollNumber: friendRequestForm.toRollNumber,
          },
          message: friendRequestForm.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Friend request sent successfully!", "success");
        setShowFriendRequestModal(false);
        setFriendRequestForm({ toRollNumber: "", message: "" });
        fetchFriendRequests();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Error sending request", "error");
    }
  };

  const handleFriendRequest = async (requestId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/friend-requests/${requestId}/${action}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Request ${action}ed!`, "success");
        fetchFriendRequests();
        fetchMyGroups();
      }
    } catch {
      showToast("Error processing request", "error");
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
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
            floorPreference: bookingForm.roomPreferences.floor,
            quietZone: bookingForm.roomPreferences.quietZone,
            studyFocused: bookingForm.roomPreferences.studyFocused,
          },
        ],
        friendRollNumbers: bookingForm.bookWithFriends ? bookingForm.friendRollNumbers.filter(f => f) : [],
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
        showToast("Application submitted successfully!", "success");
      } else {
        showToast(data.message || "Submission failed.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-alt)] text-stone-900">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-3 toast-enter ${
          toast.type === "error" ? "toast-error" : "toast-success"
        }`}>
          <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Navbar */}
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
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-stone-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse inline-block" />
            {bookingForm.studentRollNumber}
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

        {/* Welcome Banner */}
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
              {" "}·{" "}
              Dept: <span className="text-stone-700 font-semibold">{bookingForm.department}</span>
              {" "}·{" "}
              CGPA: <span className="text-[var(--success)] font-bold">{bookingForm.cgpa}</span>
            </p>
          </div>

          {/* Tab switcher */}
          <div className="filter-bar">
            <button
              onClick={() => setActiveTab("hostels")}
              className={`filter-tab flex items-center gap-2 ${activeTab === "hostels" ? "active" : ""}`}
            >
              🏢 Hostels
            </button>
            <button
              onClick={() => setActiveTab("my-applications")}
              className={`filter-tab flex items-center gap-2 ${activeTab === "my-applications" ? "active" : ""}`}
            >
              📋 Applications
              {myApplications.length > 0 && (
                <span className="bg-white/30 px-1.5 py-0.5 rounded-full text-[10px]">{myApplications.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("friends")}
              className={`filter-tab flex items-center gap-2 ${activeTab === "friends" ? "active" : ""}`}
            >
              🤝 Friends
              {friendRequests.received.length > 0 && (
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">{friendRequests.received.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`filter-tab flex items-center gap-2 ${activeTab === "groups" ? "active" : ""}`}
            >
              👥 Groups
              {myGroups.length > 0 && (
                <span className="bg-white/30 px-1.5 py-0.5 rounded-full text-[10px]">{myGroups.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: "Available Hostels", 
              value: hostels.length, 
              icon: "🏢", 
              color: "bg-blue-50 text-blue-600 border-blue-100",
              change: "+2 this week"
            },
            { 
              label: "Open Rooms", 
              value: hostels.reduce((sum, h) => sum + (h.availableBeds || 0), 0), 
              icon: "🚪", 
              color: "bg-green-50 text-green-600 border-green-100",
              change: "168 vacant beds"
            },
            { 
              label: "My Applications", 
              value: myApplications.length, 
              icon: "📋", 
              color: "bg-orange-50 text-orange-600 border-orange-100",
              change: myApplications.filter(a => a.status === 'UNDER_REVIEW').length + " in review"
            },
            { 
              label: "Friend Requests", 
              value: friendRequests.received.length, 
              icon: "👥", 
              color: "bg-purple-50 text-purple-600 border-purple-100",
              change: "Pending requests"
            },
          ].map((stat, i) => (
            <div key={i} className="card-glow bg-white border border-[var(--border)] rounded-2xl p-5 scale-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-10 h-10 rounded-xl ${stat.color} border flex items-center justify-center text-xl mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-black text-stone-900 mb-1 count-up">{stat.value}</div>
              <div className="text-xs font-bold text-stone-500 mb-1">{stat.label}</div>
              <div className="text-[10px] text-stone-400">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* TAB 1: AVAILABLE HOSTELS */}
        {activeTab === "hostels" && (
          <div>
            {/* Search & filter toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="relative w-full sm:w-72 group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm group-focus-within:text-[var(--primary)] transition-colors">🔍</span>
                <input
                  type="text"
                  placeholder="Search hostel name or code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-light input-glow pl-10 w-full"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-xs text-stone-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="filter-bar">
                {["All", "Male", "Female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenderFilter(g)}
                    className={`filter-tab transition-all ${genderFilter === g ? "active" : ""}`}
                  >
                    {g === "All" ? "All Blocks" : g === "Male" ? "Boys (BH1-9)" : "Girls (GH1-3)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Skeleton loaders with stagger animation */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="skeleton h-44 rounded-none" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton h-5 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="skeleton h-16 w-full" />
                      <div className="skeleton h-10 w-full rounded-lg" />
                    </div>
                  </div>
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
                  const isLowAvailability = availBeds < 50;

                  return (
                    <div key={hostel._id} className="card-glow group flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={getHostelImg(hostel.code)}
                          alt={hostel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/800x600/f97316/white?text=" + hostel.code;
                          }}
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
                        
                        {/* Low availability warning */}
                        {isLowAvailability && (
                          <div className="absolute bottom-3 left-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg text-center">
                            ⚡ Limited Availability - Book Soon!
                          </div>
                        )}
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

        {/* TAB 2: MY APPLICATIONS */}
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

        {/* TAB 3: FRIEND REQUESTS */}
        {activeTab === "friends" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">🤝 Friend Requests</h2>
              <button
                onClick={() => setShowFriendRequestModal(true)}
                className="btn-primary text-sm px-4 py-2.5 rounded-[10px]"
              >
                + Send Friend Request
              </button>
            </div>

            {/* Received Requests */}
            <div className="mb-8">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                📬 Received Requests
                {friendRequests.received.length > 0 && (
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {friendRequests.received.length}
                  </span>
                )}
              </h3>
              
              {friendRequests.received.length === 0 ? (
                <div className="text-center py-12 bg-white border border-[var(--border)] rounded-2xl">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm text-stone-500">No pending friend requests</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {friendRequests.received.map((req) => (
                    <div key={req.id} className="bg-white border border-[var(--border)] rounded-2xl p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-stone-900">{req.fromStudent.name}</h4>
                          <p className="text-xs text-stone-500">Roll: {req.fromStudent.rollNumber}</p>
                          <p className="text-xs text-stone-400">{req.fromStudent.department}</p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          Pending
                        </span>
                      </div>
                      
                      <p className="text-sm text-stone-600 mb-4 italic">"{req.message}"</p>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFriendRequest(req.id, "accept")}
                          className="btn-primary text-xs px-4 py-2 rounded-lg flex-1"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleFriendRequest(req.id, "reject")}
                          className="text-xs px-4 py-2 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 flex-1"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div>
              <h3 className="font-bold text-stone-800 mb-4">📤 Sent Requests</h3>
              {friendRequests.sent.length === 0 ? (
                <div className="text-center py-12 bg-white border border-[var(--border)] rounded-2xl">
                  <div className="text-4xl mb-2">📮</div>
                  <p className="text-sm text-stone-500">You haven't sent any requests yet</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {friendRequests.sent.map((req) => (
                    <div key={req.id} className="bg-white border border-[var(--border)] rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-stone-900">To: {req.toStudent.rollNumber}</h4>
                          <p className="text-xs text-stone-500">Sent: {new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          req.status === "accepted" ? "bg-green-100 text-green-700" :
                          req.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 italic">"{req.message}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MY GROUPS */}
        {activeTab === "groups" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-stone-900">👥 My Roommate Groups</h2>
            </div>

            {myGroups.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[var(--border)] rounded-2xl">
                <div className="text-5xl mb-3">👥</div>
                <h3 className="text-lg font-bold text-stone-800">No Groups Yet</h3>
                <p className="text-sm text-stone-500 mt-1 mb-5">
                  Accept friend requests to form roommate groups!
                </p>
                <button
                  onClick={() => setActiveTab("friends")}
                  className="btn-primary text-sm px-6 py-2.5 rounded-[10px]"
                >
                  View Friend Requests
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {myGroups.map((group) => (
                  <div key={group.id} className="bg-gradient-to-br from-orange-50 to-white border-2 border-[var(--primary)] rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                        👥
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900">Roommate Group</h3>
                        <p className="text-xs text-stone-500">{group.students.length} members</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {group.students.map((student, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-[var(--border)]">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {student.name?.charAt(0) || "?"}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-stone-900 text-sm">{student.name}</p>
                            <p className="text-xs text-stone-500">{student.rollNumber}</p>
                          </div>
                          {student.rollNumber === bookingForm.studentRollNumber && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                              You
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-[var(--border)]">
                      <p className="text-xs text-stone-500 mb-1">Status</p>
                      <p className="text-sm font-bold text-[var(--primary)]">
                        {group.status === "active" ? "✓ Active - Ready to book together!" : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Friend Request Modal */}
      {showFriendRequestModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowFriendRequestModal(false)}>
          <div className="modal-card w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h3 className="text-base font-black text-stone-900">Send Friend Request</h3>
              <button onClick={() => setShowFriendRequestModal(false)} className="text-stone-400 hover:text-stone-700 text-xl">✕</button>
            </div>

            <form onSubmit={sendFriendRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Friend's Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 12345679"
                  value={friendRequestForm.toRollNumber}
                  onChange={(e) => setFriendRequestForm({ ...friendRequestForm, toRollNumber: e.target.value })}
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Message (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Hey! Want to be roommates?"
                  value={friendRequestForm.message}
                  onChange={(e) => setFriendRequestForm({ ...friendRequestForm, message: e.target.value })}
                  className="input-light resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 rounded-[10px]">
                Send Request →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
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

                {/* Section 3: Book with Friends (NEW FEATURE) */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      3. 🤝 Book with Friends (Optional)
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingForm.bookWithFriends}
                        onChange={(e) => setBookingForm({ ...bookingForm, bookWithFriends: e.target.checked })}
                        className="w-4 h-4 rounded border-stone-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-xs font-semibold text-stone-700">Enable Friend Booking</span>
                    </label>
                  </div>

                  {bookingForm.bookWithFriends && (
                    <div className="bg-[var(--primary-soft)] border border-orange-200 rounded-xl p-4 space-y-3">
                      <p className="text-xs text-stone-600 leading-relaxed">
                        <strong>🎉 Book together!</strong> Enter your friends' roll numbers below. All students must apply 
                        and list each other to be allocated together.
                      </p>
                      {bookingForm.friendRollNumbers.map((rollNo, idx) => (
                        <div key={idx}>
                          <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                            Friend {idx + 1} Roll Number
                          </label>
                          <input
                            type="text"
                            placeholder={`Enter roll number (e.g., 12345679)`}
                            value={rollNo}
                            onChange={(e) => {
                              const newFriends = [...bookingForm.friendRollNumbers];
                              newFriends[idx] = e.target.value;
                              setBookingForm({ ...bookingForm, friendRollNumbers: newFriends });
                            }}
                            className="input-light"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 4: Room Preferences (NEW FEATURE) */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                    4. 🎯 Additional Preferences
                  </h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Preferred Floor</label>
                      <select
                        value={bookingForm.roomPreferences.floor}
                        onChange={(e) => setBookingForm({ 
                          ...bookingForm, 
                          roomPreferences: { ...bookingForm.roomPreferences, floor: e.target.value }
                        })}
                        className="input-light"
                      >
                        <option value="">No Preference</option>
                        <option value="ground">Ground Floor</option>
                        <option value="1-3">Floors 1-3 (Lower)</option>
                        <option value="4-6">Floors 4-6 (Middle)</option>
                        <option value="7-9">Floors 7-9 (Higher)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingForm.roomPreferences.quietZone}
                          onChange={(e) => setBookingForm({ 
                            ...bookingForm, 
                            roomPreferences: { ...bookingForm.roomPreferences, quietZone: e.target.checked }
                          })}
                          className="w-4 h-4 rounded border-stone-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span className="text-xs text-stone-700">🤫 Quiet Zone</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={bookingForm.roomPreferences.studyFocused}
                          onChange={(e) => setBookingForm({ 
                            ...bookingForm, 
                            roomPreferences: { ...bookingForm.roomPreferences, studyFocused: e.target.checked }
                          })}
                          className="w-4 h-4 rounded border-stone-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                        />
                        <span className="text-xs text-stone-700">📚 Study Focused</span>
                      </label>
                    </div>
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
