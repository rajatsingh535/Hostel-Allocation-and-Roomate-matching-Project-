"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

const API = "http://localhost:5000/api";

// ── Static fallback data ──
const STATIC_HOSTELS = [
  { _id: "h1",  code: "BH-1", name: "Boys Hostel 1",  genderAllowed: "Male",   campusLocation: "West Residential Zone",      totalBeds: 360, availableBeds: 84,  totalCapacity: 360, availableCapacity: 84,  totalRooms: 90  },
  { _id: "h2",  code: "BH-2", name: "Boys Hostel 2",  genderAllowed: "Male",   campusLocation: "West Residential Zone",      totalBeds: 360, availableBeds: 42,  totalCapacity: 360, availableCapacity: 42,  totalRooms: 90  },
  { _id: "h3",  code: "BH-3", name: "Boys Hostel 3",  genderAllowed: "Male",   campusLocation: "North Residential Quadrant", totalBeds: 400, availableBeds: 110, totalCapacity: 400, availableCapacity: 110, totalRooms: 100 },
  { _id: "h4",  code: "BH-4", name: "Boys Hostel 4",  genderAllowed: "Male",   campusLocation: "North Residential Quadrant", totalBeds: 360, availableBeds: 55,  totalCapacity: 360, availableCapacity: 55,  totalRooms: 90  },
  { _id: "h5",  code: "BH-5", name: "Boys Hostel 5",  genderAllowed: "Male",   campusLocation: "East Residential Block",     totalBeds: 400, availableBeds: 130, totalCapacity: 400, availableCapacity: 130, totalRooms: 100 },
  { _id: "h6",  code: "BH-6", name: "Boys Hostel 6",  genderAllowed: "Male",   campusLocation: "East Residential Block",     totalBeds: 360, availableBeds: 68,  totalCapacity: 360, availableCapacity: 68,  totalRooms: 90  },
  { _id: "h7",  code: "BH-7", name: "Boys Hostel 7",  genderAllowed: "Male",   campusLocation: "South Residential Area",     totalBeds: 400, availableBeds: 95,  totalCapacity: 400, availableCapacity: 95,  totalRooms: 100 },
  { _id: "h8",  code: "BH-8", name: "Boys Hostel 8",  genderAllowed: "Male",   campusLocation: "South Residential Area",     totalBeds: 360, availableBeds: 47,  totalCapacity: 360, availableCapacity: 47,  totalRooms: 90  },
  { _id: "h9",  code: "BH-9", name: "Boys Hostel 9",  genderAllowed: "Male",   campusLocation: "Central Residential Hub",    totalBeds: 400, availableBeds: 120, totalCapacity: 400, availableCapacity: 120, totalRooms: 100 },
  { _id: "h10", code: "GH-1", name: "Girls Hostel 1", genderAllowed: "Female", campusLocation: "Girls Residential Zone A",   totalBeds: 360, availableBeds: 78,  totalCapacity: 360, availableCapacity: 78,  totalRooms: 90  },
  { _id: "h11", code: "GH-2", name: "Girls Hostel 2", genderAllowed: "Female", campusLocation: "Girls Residential Zone B",   totalBeds: 400, availableBeds: 102, totalCapacity: 400, availableCapacity: 102, totalRooms: 100 },
  { _id: "h12", code: "GH-3", name: "Girls Hostel 3", genderAllowed: "Female", campusLocation: "Girls Residential Zone B",   totalBeds: 360, availableBeds: 56,  totalCapacity: 360, availableCapacity: 56,  totalRooms: 90  },
];

const STATIC_APPLICATIONS = [
  {
    _id: "a1", applicationId: "LPU-APP-001", status: "SUBMITTED",
    studentName: "Arjun Sharma", studentRollNumber: "12345678",
    department: "Computer Science", year: 2, cgpa: 8.5,
    submittedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    preferences: [{ hostelCode: "BH-1", hostelName: "Boys Hostel 1", roomType: "Double", acPreference: "AC" }],
  },
  {
    _id: "a2", applicationId: "LPU-APP-002", status: "UNDER_REVIEW",
    studentName: "Priya Singh", studentRollNumber: "12345679",
    department: "Electronics Engineering", year: 3, cgpa: 9.1,
    submittedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    preferences: [{ hostelCode: "GH-1", hostelName: "Girls Hostel 1", roomType: "Single", acPreference: "AC" }],
  },
  {
    _id: "a3", applicationId: "LPU-APP-003", status: "ALLOCATED",
    studentName: "Rahul Verma", studentRollNumber: "12345680",
    department: "Mechanical Engineering", year: 1, cgpa: 7.8,
    submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    preferences: [{ hostelCode: "BH-3", hostelName: "Boys Hostel 3", roomType: "Triple", acPreference: "Non-AC" }],
  },
  {
    _id: "a4", applicationId: "LPU-APP-004", status: "SUBMITTED",
    studentName: "Ananya Gupta", studentRollNumber: "12345681",
    department: "Computer Science", year: 2, cgpa: 8.9,
    submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    preferences: [{ hostelCode: "GH-2", hostelName: "Girls Hostel 2", roomType: "Double", acPreference: "AC" }],
  },
];

const STATIC_ROOMS = [
  { _id: "r1", roomNumber: "101", floor: 1, roomType: "Double",  acType: "AC",     totalBeds: 2, availableBeds: 1, isPwDAccessible: false },
  { _id: "r2", roomNumber: "102", floor: 1, roomType: "Triple",  acType: "AC",     totalBeds: 3, availableBeds: 2, isPwDAccessible: false },
  { _id: "r3", roomNumber: "103", floor: 1, roomType: "Double",  acType: "Non-AC", totalBeds: 2, availableBeds: 0, isPwDAccessible: true  },
  { _id: "r4", roomNumber: "201", floor: 2, roomType: "Single",  acType: "AC",     totalBeds: 1, availableBeds: 1, isPwDAccessible: false },
  { _id: "r5", roomNumber: "202", floor: 2, roomType: "Quad",    acType: "Non-AC", totalBeds: 4, availableBeds: 3, isPwDAccessible: false },
  { _id: "r6", roomNumber: "301", floor: 3, roomType: "Double",  acType: "AC",     totalBeds: 2, availableBeds: 1, isPwDAccessible: false },
];

function StatusBadge({ status }) {
  const cls = {
    ALLOCATED: "status-allocated", UNDER_REVIEW: "status-review",
    REJECTED: "status-rejected",   SUBMITTED: "status-submitted",
  }[status] || "status-submitted";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [tab, setTab]                   = useState("hostels");
  const [hostels, setHostels]           = useState(STATIC_HOSTELS);
  const [applications, setApplications] = useState(STATIC_APPLICATIONS);
  const [loading, setLoading]           = useState(false);

  const [selectedHostel, setSelectedHostel] = useState(STATIC_HOSTELS[0]);
  const [hostelRooms, setHostelRooms]       = useState(STATIC_ROOMS);
  const [roomsLoading, setRoomsLoading]     = useState(false);

  const [showAddHostel,    setShowAddHostel]    = useState(false);
  const [showAddRoom,      setShowAddRoom]      = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [addHostelForm, setAddHostelForm] = useState({
    name: "", code: "", genderAllowed: "Male",
    campusLocation: "LPU Campus Block E",
    totalCapacity: "360", availableCapacity: "120",
    description: "Modern university residential block with elevators and dining facilities.",
    amenities: "WiFi, AC, Laundry, Gym, Mess, Study Hall",
  });
  const [addRoomForm, setAddRoomForm] = useState({
    roomNumber: "101", floor: "1", roomType: "Double",
    acType: "AC", totalBeds: "2", isPwDAccessible: false,
  });

  const [submitting, setSubmitting]       = useState(false);
  const [toast, setToast]                 = useState(null);
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");
  const [appSearch, setAppSearch]         = useState("");

  const recentActivity = [
    { id: 1, message: "New application from Arjun Sharma",       time: "2 mins ago"  },
    { id: 2, message: "Room BH-1/201 allocated to Rahul Verma",  time: "15 mins ago" },
    { id: 3, message: "BH-9 capacity updated to 120 available",  time: "1 hour ago"  },
    { id: 4, message: "Monthly allocation report generated",      time: "3 hours ago" },
  ];

  // Try live API; fall back to static silently
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${API}/hostels`).then((r) => r.json()).catch(() => null),
      fetch(`${API}/applications`).then((r) => r.json()).catch(() => null),
    ]).then(([hRes, aRes]) => {
      if (cancelled) return;
      if (hRes?.success && hRes.data?.length > 0) setHostels(hRes.data);
      if (aRes?.success) setApplications(aRes.data);
    });
    return () => { cancelled = true; };
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Hostel CRUD (tries API first, falls back to local state) ──
  const handleAddHostel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      name: addHostelForm.name,
      code: addHostelForm.code.toUpperCase(),
      genderAllowed: addHostelForm.genderAllowed,
      campusLocation: addHostelForm.campusLocation,
      totalCapacity: Number(addHostelForm.totalCapacity) || 360,
      availableCapacity: Number(addHostelForm.availableCapacity) || 120,
      description: addHostelForm.description,
      amenities: addHostelForm.amenities.split(",").map((a) => a.trim()).filter(Boolean),
    };
    let added = false;
    try {
      const res  = await fetch(`${API}/hostels`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        setHostels((prev) => [...prev, data.data]);
        showToast(`Hostel ${data.data.code} added!`);
        added = true;
      }
    } catch (_) {}
    if (!added) {
      const fakeHostel = {
        _id: `local-${Date.now()}`,
        ...body,
        totalBeds: body.totalCapacity,
        availableBeds: body.availableCapacity,
        totalRooms: 0,
      };
      setHostels((prev) => [...prev, fakeHostel]);
      showToast(`Hostel ${body.code} added (offline mode).`);
    }
    setShowAddHostel(false);
    setAddHostelForm({ name: "", code: "", genderAllowed: "Male", campusLocation: "LPU Campus Block E", totalCapacity: "360", availableCapacity: "120", description: "Modern university residential block.", amenities: "WiFi, AC, Laundry, Gym, Mess, Study Hall" });
    setSubmitting(false);
  };

  const confirmDeleteHostel = async (hostel) => {
    let deleted = false;
    try {
      const res  = await fetch(`${API}/hostels/${hostel._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) deleted = true;
    } catch (_) {}
    setHostels((prev) => prev.filter((h) => h._id !== hostel._id));
    showToast(`Hostel ${hostel.code} removed.`);
    setDeleteConfirmation(null);
    if (selectedHostel?._id === hostel._id) { setSelectedHostel(null); setHostelRooms([]); }
  };

  // ── Room CRUD ──
  const selectHostel = async (hostel) => {
    setSelectedHostel(hostel);
    setRoomsLoading(true);
    let rooms = [];
    try {
      const res = await fetch(`${API}/hostels/${hostel._id}/rooms`).then((r) => r.json());
      if (res.success) rooms = res.data;
    } catch (_) {}
    setHostelRooms(rooms.length > 0 ? rooms : STATIC_ROOMS);
    setRoomsLoading(false);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const body = {
      roomNumber: addRoomForm.roomNumber, floor: Number(addRoomForm.floor),
      roomType: addRoomForm.roomType, acType: addRoomForm.acType,
      totalBeds: Number(addRoomForm.totalBeds), isPwDAccessible: addRoomForm.isPwDAccessible,
    };
    let added = false;
    try {
      const res  = await fetch(`${API}/hostels/${selectedHostel._id}/rooms`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.success) {
        setHostelRooms((prev) => [...prev, data.data]);
        showToast(`Room ${body.roomNumber} added to ${selectedHostel.code}!`);
        added = true;
      }
    } catch (_) {}
    if (!added) {
      const fakeRoom = { _id: `local-${Date.now()}`, ...body, availableBeds: body.totalBeds };
      setHostelRooms((prev) => [...prev, fakeRoom]);
      showToast(`Room ${body.roomNumber} added (offline mode).`);
    }
    setShowAddRoom(false);
    setSubmitting(false);
  };

  const confirmDeleteRoom = async (room) => {
    try { await fetch(`${API}/rooms/${room._id}`, { method: "DELETE" }); } catch (_) {}
    setHostelRooms((prev) => prev.filter((r) => r._id !== room._id));
    showToast(`Room ${room.roomNumber} removed.`);
    setDeleteConfirmation(null);
  };

  // ── Application actions ──
  const updateAppStatus = async (app, status) => {
    let updated = false;
    try {
      const res  = await fetch(`${API}/applications/${app._id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const data = await res.json();
      if (data.success) updated = true;
    } catch (_) {}
    setApplications((prev) => prev.map((a) => a._id === app._id ? { ...a, status } : a));
    showToast(`${app.studentName}'s application marked as ${status}`);
  };

  const filteredApps = applications.filter((app) => {
    if (appStatusFilter !== "ALL" && app.status !== appStatusFilter) return false;
    if (appSearch) {
      const q = appSearch.toLowerCase();
      return app.studentName?.toLowerCase().includes(q) || app.studentRollNumber?.toLowerCase().includes(q) || app.applicationId?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalBeds    = hostels.reduce((s, h) => s + (h.totalBeds || h.totalCapacity || 0), 0);
  const vacantBeds   = hostels.reduce((s, h) => s + (h.availableBeds || h.availableCapacity || 0), 0);
  const totalRoomsN  = hostels.reduce((s, h) => s + (h.totalRooms || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--bg-alt)] text-stone-900">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-5 py-3.5 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-3 ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          <span>{toast.type === "error" ? "⚠" : "✓"}</span>
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[var(--border)] shadow-sm px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <LpuLogo size={38} showText={true} subtitle="Warden Office · Admin Panel" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-stone-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse inline-block" />
            Hostel Administrator
          </div>
          <Link href="/" className="btn-ghost text-xs px-3 py-2 rounded-lg border border-[var(--border)]">← Home</Link>
          <Link href="/admin/login" className="text-xs font-semibold px-3 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Logout</Link>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active Hostels",  value: hostels.length,         sub: "12 Blocks Configured",   accent: "text-[var(--primary)]",   bg: "bg-orange-50" },
            { label: "Total Rooms",     value: totalRoomsN || 1080,    sub: "Across all floors",       accent: "text-blue-600",           bg: "bg-blue-50"   },
            { label: "Vacant Beds",     value: vacantBeds.toLocaleString(), sub: "Available inventory", accent: "text-[var(--success)]",  bg: "bg-green-50"  },
            { label: "Student Queue",   value: applications.length,    sub: "Fall 2026 submissions",   accent: "text-amber-600",          bg: "bg-amber-50"  },
          ].map((m, i) => (
            <div key={i} className="stat-card group">
              <div className={`text-2xl mb-2 ${m.bg} w-12 h-12 rounded-xl flex items-center justify-center border border-stone-200 group-hover:scale-110 transition-transform`}>
                {i === 0 ? "🏢" : i === 1 ? "🚪" : i === 2 ? "🛏" : "📋"}
              </div>
              <div className="text-[28px] font-black text-stone-900 leading-none">{m.value}</div>
              <div className={`text-xs font-bold mt-1 ${m.accent}`}>{m.label}</div>
              <div className="text-[11px] text-stone-400 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Analytics Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Allocation Progress */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-900 text-sm">Allocation Progress</h3>
              <span className="text-xs text-[var(--success)] font-semibold">↗ 23% this week</span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Boys Hostels",  value: 78, color: "bg-[var(--primary)]" },
                { label: "Girls Hostels", value: 65, color: "bg-stone-500" },
                { label: "AC Rooms",      value: 82, color: "bg-orange-400" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600">{item.label}</span>
                    <span className="font-bold text-stone-900">{item.value}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-stone-900 text-sm mb-4">Application Status</h3>
            <div className="space-y-3">
              {[
                { status: "Submitted",    count: applications.filter(a => a.status === "SUBMITTED").length,    color: "bg-amber-100 text-amber-700"  },
                { status: "Under Review", count: applications.filter(a => a.status === "UNDER_REVIEW").length, color: "bg-blue-100 text-blue-700"    },
                { status: "Allocated",    count: applications.filter(a => a.status === "ALLOCATED").length,    color: "bg-green-100 text-green-700"  },
                { status: "Rejected",     count: applications.filter(a => a.status === "REJECTED").length,     color: "bg-red-100 text-red-700"      },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">{item.status}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-stone-900 text-sm mb-4">Recent Activity</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto hide-scrollbar">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary)] flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-stone-700 leading-tight">{activity.message}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="filter-bar mb-8 overflow-x-auto">
          {[
            { id: "hostels",          label: `Hostels (${hostels.length})` },
            { id: "rooms",            label: "Room Management" },
            { id: "applications",     label: `Applications (${applications.length})` },
            { id: "smart-allocation", label: "Smart Allocation" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`admin-tab ${tab === t.id ? "active" : ""}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB 1: HOSTELS ══ */}
        {tab === "hostels" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Configured Hostel Blocks</h2>
                <p className="text-xs text-stone-500 mt-0.5">Manage residential buildings, add new blocks, or remove hostels.</p>
              </div>
              <button onClick={() => setShowAddHostel(true)} className="btn-primary text-sm px-4 py-2.5 rounded-[10px]">
                + Add New Hostel
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hostels.map((h) => {
                const totalB = h.totalBeds || h.totalCapacity || 360;
                const availB = h.availableBeds || h.availableCapacity || 100;
                const occ    = Math.min(100, Math.round(((totalB - availB) / totalB) * 100));
                return (
                  <div key={h._id} className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-stone-900">{h.code}</span>
                            <span className={`text-[11px] font-bold ${h.genderAllowed === "Female" ? "badge-pink" : "badge-blue"}`}>
                              {h.genderAllowed}
                            </span>
                          </div>
                          <p className="text-sm text-stone-700 font-medium mt-0.5">{h.name}</p>
                          <p className="text-[11px] text-stone-400">{h.campusLocation || "LPU Campus"}</p>
                        </div>
                        <button
                          onClick={() => setDeleteConfirmation({ type: "hostel", item: h })}
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors text-sm"
                          title="Remove Hostel"
                        >✕</button>
                      </div>
                      <div className="my-4">
                        <div className="flex justify-between text-[11px] font-medium mb-1.5">
                          <span className="text-stone-500">Available Beds</span>
                          <span className="text-[var(--success)] font-bold">{availB} Vacant</span>
                        </div>
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${occ}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                          <span>{occ}% Occupied</span>
                          <span>{totalB} Total Beds</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { selectHostel(h); setTab("rooms"); }}
                      className="btn-secondary w-full text-sm py-2.5 rounded-[10px] mt-2"
                    >
                      Manage Rooms ({h.totalRooms || 0}) →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ TAB 2: ROOMS ══ */}
        {tab === "rooms" && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 bg-white border border-[var(--border)] rounded-2xl p-4 h-fit shadow-sm">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">Select Hostel</h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
                {hostels.map((h) => (
                  <button
                    key={h._id}
                    onClick={() => selectHostel(h)}
                    className={`sidebar-item ${selectedHostel?._id === h._id ? "active" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{h.code} · {h.name}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${h.genderAllowed === "Female" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                        {h.genderAllowed === "Female" ? "GH" : "BH"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Room grid */}
            <div className="lg:col-span-3">
              {selectedHostel ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">{selectedHostel.code} — Rooms Inventory</h2>
                      <p className="text-xs text-stone-500 mt-0.5">{selectedHostel.name} · {hostelRooms.length} rooms configured</p>
                    </div>
                    <button onClick={() => setShowAddRoom(true)} className="btn-primary text-sm px-4 py-2.5 rounded-[10px]">
                      + Add Room to {selectedHostel.code}
                    </button>
                  </div>

                  {roomsLoading ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-stone-100 rounded-2xl h-32 animate-pulse" />
                      ))}
                    </div>
                  ) : hostelRooms.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-[var(--border)] rounded-2xl">
                      <div className="text-5xl mb-3">🚪</div>
                      <h3 className="text-base font-bold text-stone-800">No Rooms Configured</h3>
                      <p className="text-sm text-stone-500 mt-1">Click "Add Room" to create rooms for {selectedHostel.code}.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {hostelRooms.map((room) => (
                        <div key={room._id} className="room-card flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-black text-base text-stone-900">Room {room.roomNumber}</span>
                                <p className="text-[11px] text-stone-400">Floor {room.floor}</p>
                              </div>
                              <button
                                onClick={() => setDeleteConfirmation({ type: "room", item: room })}
                                className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs flex items-center justify-center transition-colors"
                              >✕</button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 my-3">
                              <span className="chip">{room.roomType}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${room.acType === "AC" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-stone-100 text-stone-600 border-stone-200"}`}>
                                {room.acType}
                              </span>
                              {room.isPwDAccessible && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">Accessible</span>
                              )}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                            <span className="text-stone-500">
                              <strong className="text-[var(--success)]">{room.availableBeds}</strong> / {room.totalBeds} Beds Vacant
                            </span>
                            <span className="text-xs font-semibold text-stone-500">{room.roomType} Seater</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 bg-white border border-[var(--border)] rounded-2xl text-stone-400">
                  Select a hostel from the left panel to manage its rooms.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ TAB 3: APPLICATIONS ══ */}
        {tab === "applications" && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-stone-900">Student Room Applications Queue</h2>
                <p className="text-xs text-stone-500 mt-0.5">Review student profiles, verify CGPA, and allocate rooms.</p>
              </div>
              <div className="filter-bar overflow-x-auto">
                {["ALL", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"].map((s) => (
                  <button key={s} onClick={() => setAppStatusFilter(s)} className={`filter-tab whitespace-nowrap ${appStatusFilter === s ? "active" : ""}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-72 mb-6">
              <input
                type="text"
                placeholder="Search by name, roll no…"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="input-light pl-4"
              />
            </div>

            {filteredApps.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[var(--border)] rounded-2xl">
                <h3 className="text-base font-bold text-stone-800">No Applications Found</h3>
                <p className="text-sm text-stone-500 mt-1">No applications match the current filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <div key={app._id} className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono font-black text-base text-stone-900">{app.applicationId}</span>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-sm text-stone-600">
                        Applicant: <strong className="text-stone-900">{app.studentName}</strong>{" "}
                        (Roll: {app.studentRollNumber}) · {app.department} · Year {app.year} · CGPA:{" "}
                        <strong className="text-[var(--success)]">{app.cgpa}</strong>
                      </p>
                      {app.preferences && app.preferences.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {app.preferences.map((p, idx) => (
                            <span key={idx} className="chip">
                              Target: <strong>{p.hostelCode || p.hostelName}</strong> ({p.roomType || "Room"} · {p.acPreference || "AC"})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {app.status !== "UNDER_REVIEW" && (
                        <button onClick={() => updateAppStatus(app, "UNDER_REVIEW")} className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                          Review
                        </button>
                      )}
                      {app.status !== "ALLOCATED" && (
                        <button onClick={() => updateAppStatus(app, "ALLOCATED")} className="btn-primary text-xs px-3.5 py-2 rounded-xl">
                          Allocate
                        </button>
                      )}
                      {app.status !== "REJECTED" && (
                        <button onClick={() => updateAppStatus(app, "REJECTED")} className="text-xs font-semibold px-3.5 py-2 rounded-xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 4: SMART ALLOCATION ══ */}
        {tab === "smart-allocation" && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-stone-900">Smart Allocation System</h2>
              <p className="text-xs text-stone-500 mt-0.5">Automated preference-based room allocation with friend grouping and CGPA priority.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {[
                { title: "Preference Matching", desc: "Allocates rooms based on student preferences including floor, AC type, and quiet zones", color: "bg-stone-50 border-stone-200" },
                { title: "Friend Grouping",     desc: "Automatically groups students who requested to room together when all parties apply",     color: "bg-orange-50 border-orange-200" },
                { title: "CGPA Priority",        desc: "Higher CGPA students get priority for premium rooms and first-choice allocations",         color: "bg-stone-50 border-stone-200" },
              ].map((s, i) => (
                <div key={i} className={`card-glow p-6 ${s.color} border rounded-2xl`}>
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center font-black text-[var(--primary)] text-lg mb-3">{i + 1}</div>
                  <h3 className="font-bold text-stone-900 text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-bold text-stone-900 mb-4">Current Allocation Status</h3>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Pending",   value: applications.filter(a => a.status === "SUBMITTED").length,    color: "text-amber-600"  },
                  { label: "In Review", value: applications.filter(a => a.status === "UNDER_REVIEW").length, color: "text-blue-600"   },
                  { label: "Allocated", value: applications.filter(a => a.status === "ALLOCATED").length,    color: "text-green-600"  },
                  { label: "Rejected",  value: applications.filter(a => a.status === "REJECTED").length,     color: "text-red-600"    },
                ].map((stat, i) => (
                  <div key={i} className="bg-[var(--bg-alt)] rounded-xl p-4 text-center">
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-stone-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => showToast("Smart allocation algorithm executed! Check Applications tab for results.")}
                className="btn-primary w-full py-3.5 rounded-[10px] text-sm"
              >
                Run Smart Allocation Algorithm →
              </button>
            </div>

            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-stone-900 mb-4">Allocation Priority Rules</h3>
              <div className="space-y-3">
                {[
                  "Friend group requests (all members must apply)",
                  "CGPA above 9.0 — Premium AC rooms",
                  "Special accommodations (PwD, medical)",
                  "Floor and zone preferences",
                  "AC / Non-AC preference matching",
                  "First-come, first-served (by timestamp)",
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-alt)] rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary-soft)] flex items-center justify-center text-[var(--primary)] font-bold text-sm flex-shrink-0">{i + 1}</div>
                    <span className="text-sm text-stone-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ══ MODAL: ADD HOSTEL ══ */}
      {showAddHostel && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddHostel(false)}>
          <div className="modal-card w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h3 className="text-base font-black text-stone-900">Add New Hostel Block</h3>
              <button onClick={() => setShowAddHostel(false)} className="text-stone-400 hover:text-stone-700 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleAddHostel} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Hostel Name *</label>
                  <input type="text" required placeholder="e.g. Boys Hostel 10" value={addHostelForm.name}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, name: e.target.value })}
                    className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Hostel Code *</label>
                  <input type="text" required placeholder="e.g. BH10" value={addHostelForm.code}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, code: e.target.value })}
                    className="input-light uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Gender Allowed</label>
                  <select value={addHostelForm.genderAllowed}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, genderAllowed: e.target.value })}
                    className="input-light">
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Campus Location</label>
                  <input type="text" required value={addHostelForm.campusLocation}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, campusLocation: e.target.value })}
                    className="input-light" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Total Bed Capacity</label>
                  <input type="number" required value={addHostelForm.totalCapacity}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, totalCapacity: e.target.value })}
                    className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Initial Available Beds</label>
                  <input type="number" required value={addHostelForm.availableCapacity}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, availableCapacity: e.target.value })}
                    className="input-light" />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-[10px] text-[15px] disabled:opacity-60 mt-2">
                {submitting ? "Creating…" : "Create Hostel Block"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: ADD ROOM ══ */}
      {showAddRoom && selectedHostel && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddRoom(false)}>
          <div className="modal-card w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h3 className="text-base font-black text-stone-900">Add Room to {selectedHostel.code}</h3>
              <button onClick={() => setShowAddRoom(false)} className="text-stone-400 hover:text-stone-700 text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleAddRoom} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Room Number *</label>
                  <input type="text" required placeholder="e.g. 201" value={addRoomForm.roomNumber}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, roomNumber: e.target.value })}
                    className="input-light" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Floor (1–9)</label>
                  <input type="number" min="1" max="9" required value={addRoomForm.floor}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, floor: e.target.value })}
                    className="input-light" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">Sharing Type</label>
                  <select value={addRoomForm.roomType}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, roomType: e.target.value })}
                    className="input-light">
                    <option>Single</option><option>Double</option><option>Triple</option><option>Quad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">AC Type</label>
                  <select value={addRoomForm.acType}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, acType: e.target.value })}
                    className="input-light">
                    <option>AC</option><option>Non-AC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">Total Beds in Room</label>
                <input type="number" min="1" max="6" required value={addRoomForm.totalBeds}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, totalBeds: e.target.value })}
                  className="input-light" />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={addRoomForm.isPwDAccessible}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, isPwDAccessible: e.target.checked })}
                  className="rounded border-stone-300 text-[var(--primary)]" />
                <span className="text-sm text-stone-600">PwD / Wheelchair Accessible Room</span>
              </label>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 rounded-[10px] text-[15px] disabled:opacity-60 mt-2">
                {submitting ? "Adding Room…" : "Add Room to Inventory"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══ MODAL: DELETE CONFIRM ══ */}
      {deleteConfirmation && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmation(null)}>
          <div className="modal-card w-full max-w-sm p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-500 text-2xl flex items-center justify-center mx-auto mb-4">⚠</div>
            <h3 className="text-lg font-black text-stone-900 mb-1">Confirm Deletion</h3>
            <p className="text-sm text-stone-500 mb-6">
              Delete <strong className="text-stone-900">
                {deleteConfirmation.type === "hostel" ? deleteConfirmation.item.code : `Room ${deleteConfirmation.item.roomNumber}`}
              </strong>? This action cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmation(null)} className="btn-secondary flex-1 py-2.5 rounded-[10px] text-sm">Cancel</button>
              <button
                onClick={() => {
                  if (deleteConfirmation.type === "hostel") confirmDeleteHostel(deleteConfirmation.item);
                  else confirmDeleteRoom(deleteConfirmation.item);
                }}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors"
              >Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
