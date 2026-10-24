"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:5000/api";

export default function AdminDashboard() {
  const [tab, setTab] = useState("hostels");
  const [hostels, setHostels] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Selected Hostel for Room Management
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [hostelRooms, setHostelRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  // Modals State
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // { type: 'hostel'|'room', item }

  // Forms
  const [addHostelForm, setAddHostelForm] = useState({
    name: "",
    code: "",
    genderAllowed: "Male",
    campusLocation: "LPU Campus Block E",
    totalCapacity: "360",
    availableCapacity: "120",
    description: "Modern university residential block with elevators and dining facilities.",
    amenities: "WiFi, AC, Laundry, Gym, Mess, Study Hall",
  });

  const [addRoomForm, setAddRoomForm] = useState({
    roomNumber: "101",
    floor: "1",
    roomType: "Double",
    acType: "AC",
    totalBeds: "2",
    rentPerSemester: "25000",
    isPwDAccessible: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [appStatusFilter, setAppStatusFilter] = useState("ALL");
  const [appSearch, setAppSearch] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [hRes, aRes, sRes] = await Promise.all([
      fetch(`${API}/hostels`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/applications`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/stats`).then((r) => r.json()).catch(() => ({ data: {} })),
    ]);

    if (hRes.success) {
      setHostels(hRes.data);
      if (!selectedHostel && hRes.data.length > 0) {
        selectHostel(hRes.data[0]);
      }
    }
    if (aRes.success) setApplications(aRes.data);
    if (sRes.success) setStats(sRes.data);
    setLoading(false);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Hostel Actions ──
  const handleAddHostel = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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

      const res = await fetch(`${API}/hostels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Hostel ${data.data.code} added successfully!`);
        setShowAddHostel(false);
        setAddHostelForm({
          name: "",
          code: "",
          genderAllowed: "Male",
          campusLocation: "LPU Campus Block E",
          totalCapacity: "360",
          availableCapacity: "120",
          description: "Modern university residential block with elevators and dining facilities.",
          amenities: "WiFi, AC, Laundry, Gym, Mess, Study Hall",
        });
        fetchAll();
      } else {
        showToast(data.message || "Failed to create hostel", "error");
      }
    } catch {
      showToast("Network error creating hostel", "error");
    }
    setSubmitting(false);
  };

  const confirmDeleteHostel = async (hostel) => {
    try {
      const res = await fetch(`${API}/hostels/${hostel._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`🗑️ Hostel ${hostel.code} deleted.`);
        setDeleteConfirmation(null);
        fetchAll();
        if (selectedHostel?._id === hostel._id) {
          setSelectedHostel(null);
          setHostelRooms([]);
        }
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Network error deleting hostel", "error");
    }
  };

  // ── Room Actions ──
  const selectHostel = async (hostel) => {
    setSelectedHostel(hostel);
    setRoomsLoading(true);
    try {
      const res = await fetch(`${API}/hostels/${hostel._id}/rooms`).then((r) => r.json());
      if (res.success) setHostelRooms(res.data);
    } catch {}
    setRoomsLoading(false);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        roomNumber: addRoomForm.roomNumber,
        floor: Number(addRoomForm.floor),
        roomType: addRoomForm.roomType,
        acType: addRoomForm.acType,
        totalBeds: Number(addRoomForm.totalBeds),
        rentPerSemester: Number(addRoomForm.rentPerSemester),
        isPwDAccessible: addRoomForm.isPwDAccessible,
      };

      const res = await fetch(`${API}/hostels/${selectedHostel._id}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Room ${addRoomForm.roomNumber} added to ${selectedHostel.code}!`);
        setShowAddRoom(false);
        selectHostel(selectedHostel);
        fetchAll();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Network error adding room", "error");
    }
    setSubmitting(false);
  };

  const confirmDeleteRoom = async (room) => {
    try {
      const res = await fetch(`${API}/rooms/${room._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`🗑️ Room ${room.roomNumber} deleted.`);
        setDeleteConfirmation(null);
        selectHostel(selectedHostel);
        fetchAll();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Network error deleting room", "error");
    }
  };

  // ── Application Status Actions ──
  const updateAppStatus = async (app, status) => {
    try {
      const res = await fetch(`${API}/applications/${app._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ ${app.studentName}'s application marked as ${status}`);
        fetchAll();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast("Network error updating status", "error");
    }
  };

  const filteredApps = applications.filter((app) => {
    if (appStatusFilter !== "ALL" && app.status !== appStatusFilter) return false;
    if (appSearch) {
      const q = appSearch.toLowerCase();
      return (
        app.studentName?.toLowerCase().includes(q) ||
        app.studentRollNumber?.toLowerCase().includes(q) ||
        app.applicationId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-[#070710] text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl animate-bounce ${
            toast.type === "error" ? "bg-red-500/90 text-white" : "bg-emerald-500/90 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Top Bar ── */}
      <nav className="sticky top-0 z-40 glass-dark border-b border-white/10 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
            🔐
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight">LPU Administrative Command Center</span>
            <p className="text-[11px] text-slate-400">Chief Warden Office • Residential Allotments</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Hostel Administrator</span>
          </div>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl glass border border-white/10 text-xs font-semibold hover:border-blue-500/40 hover:text-blue-300 transition-all"
          >
            ← Home
          </Link>
          <Link
            href="/admin/login"
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            Logout
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Metric Highlights ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Hostels", value: stats.totalHostels || hostels.length, sub: "12 Blocks Configured", icon: "🏢" },
            { label: "Total Rooms", value: (stats.totalRooms || 1080).toLocaleString(), sub: "Across all floors", icon: "🚪" },
            { label: "Available Beds", value: (stats.availableBeds || 4320).toLocaleString(), sub: "Vacant inventory", icon: "🛏️" },
            { label: "Student Queue", value: applications.length, sub: "Fall 2026 submissions", icon: "📋" },
          ].map((m, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 group hover:-translate-y-1 transition-transform">
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="text-3xl font-black text-white">{m.value}</div>
              <div className="text-xs font-bold text-blue-400 mt-0.5">{m.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Main Navigation Tabs ── */}
        <div className="flex gap-2 glass p-1.5 rounded-2xl w-fit mb-8">
          {[
            { id: "hostels", label: `🏢 Hostels Management (${hostels.length})` },
            { id: "rooms", label: "🚪 Room Allotments" },
            { id: "applications", label: `📋 Student Applications (${applications.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: HOSTELS CRUD ── */}
        {tab === "hostels" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Configured Hostel Blocks</h2>
                <p className="text-xs text-slate-400 mt-1">Manage residential buildings, add new blocks, or delete hostels.</p>
              </div>
              <button
                onClick={() => setShowAddHostel(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>+ Add New Hostel</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((h) => {
                const totalBeds = h.totalBeds || h.totalCapacity || 360;
                const availBeds = h.availableBeds || h.availableCapacity || 100;
                const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));

                return (
                  <div key={h._id} className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-white">{h.code}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${
                                h.genderAllowed === "Female"
                                  ? "bg-pink-500/10 text-pink-300 border-pink-500/20"
                                  : "bg-blue-500/10 text-blue-300 border-blue-500/20"
                              }`}
                            >
                              {h.genderAllowed}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-semibold mt-1">{h.name}</p>
                          <p className="text-[11px] text-slate-500">📍 {h.campusLocation || "LPU Campus"}</p>
                        </div>

                        <button
                          onClick={() => setDeleteConfirmation({ type: "hostel", item: h })}
                          title="Delete Hostel"
                          className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Capacity progress */}
                      <div className="my-4">
                        <div className="flex justify-between text-[11px] font-medium mb-1">
                          <span className="text-slate-400">Available Beds</span>
                          <span className="text-emerald-400 font-bold">{availBeds} Vacant</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                            style={{ width: `${occPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                          <span>{occPercent}% Occupied</span>
                          <span>{totalBeds} Total Beds</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        selectHostel(h);
                        setTab("rooms");
                      }}
                      className="w-full py-2.5 rounded-xl glass border border-white/10 hover:border-blue-500/40 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Manage Rooms ({h.totalRooms || 0})</span>
                      <span>→</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 2: ROOMS CRUD ── */}
        {tab === "rooms" && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Hostel Selector Sidebar */}
            <div className="lg:col-span-1 glass-card rounded-3xl p-5 border border-white/10 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Select Hostel</h3>
              <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {hostels.map((h) => (
                  <button
                    key={h._id}
                    onClick={() => selectHostel(h)}
                    className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-center justify-between ${
                      selectedHostel?._id === h._id
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "glass text-slate-300 hover:text-white border border-white/5"
                    }`}
                  >
                    <span>{h.code} • {h.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/20">
                      {h.genderAllowed === "Female" ? "GH" : "BH"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rooms Grid for Selected Hostel */}
            <div className="lg:col-span-3">
              {selectedHostel ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {selectedHostel.code} — Rooms Inventory
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        {selectedHostel.name} • {hostelRooms.length} rooms configured
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAddRoom(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span>+ Add Room to {selectedHostel.code}</span>
                    </button>
                  </div>

                  {roomsLoading ? (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="glass-card rounded-2xl h-36 animate-pulse" />
                      ))}
                    </div>
                  ) : hostelRooms.length === 0 ? (
                    <div className="text-center py-20 glass rounded-3xl border border-white/10">
                      <div className="text-5xl mb-3">🚪</div>
                      <h3 className="text-lg font-bold text-white">No Rooms Configured</h3>
                      <p className="text-xs text-slate-400 mt-1 mb-4">Click "Add Room" to create the first room for {selectedHostel.code}.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {hostelRooms.map((room) => (
                        <div key={room._id} className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-black text-lg text-white">Room {room.roomNumber}</span>
                                <p className="text-[11px] text-slate-400">Floor {room.floor}</p>
                              </div>

                              <button
                                onClick={() => setDeleteConfirmation({ type: "room", item: room })}
                                title="Delete Room"
                                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs flex items-center justify-center transition-colors"
                              >
                                🗑️
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1.5 my-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                                {room.roomType}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                  room.acType === "AC"
                                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                                    : "bg-slate-500/10 text-slate-300 border-slate-500/20"
                                }`}
                              >
                                {room.acType}
                              </span>
                              {room.isPwDAccessible && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                  ♿ Accessible
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-slate-400">
                              <strong className="text-emerald-400">{room.availableBeds}</strong> / {room.totalBeds} Beds Vacant
                            </span>
                            <span className="font-semibold text-slate-200">₹{room.rentPerSemester?.toLocaleString()}/sem</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400">Select a hostel from the left panel to manage its rooms.</div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: APPLICATIONS WORKFLOW ── */}
        {tab === "applications" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Student Room Applications Queue</h2>
                <p className="text-xs text-slate-400 mt-1">Review student profiles, verify CGPA score, and allocate rooms.</p>
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 glass p-1 rounded-2xl overflow-x-auto">
                {["ALL", "SUBMITTED", "UNDER_REVIEW", "ALLOCATED", "REJECTED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setAppStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      appStatusFilter === s
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {filteredApps.length === 0 ? (
              <div className="text-center py-20 glass rounded-3xl border border-white/10">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-white">No Applications Found</h3>
                <p className="text-xs text-slate-400 mt-1">There are no applications matching the status filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <div
                    key={app._id}
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
                              : app.status === "REJECTED"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">
                        Applicant: <strong className="text-white">{app.studentName}</strong> (Roll: {app.studentRollNumber}) •{" "}
                        {app.department} • Year {app.year} • CGPA: <strong className="text-emerald-400">{app.cgpa}</strong>
                      </p>

                      {app.preferences && app.preferences.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {app.preferences.map((p, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-300">
                              Target: <strong>{p.hostelCode || p.hostelName}</strong> ({p.roomType || "Room"} • {p.acPreference || "AC"})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Status Mutation Buttons */}
                    <div className="flex items-center gap-2">
                      {app.status !== "UNDER_REVIEW" && (
                        <button
                          onClick={() => updateAppStatus(app, "UNDER_REVIEW")}
                          className="px-3.5 py-2 rounded-xl glass border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs font-semibold transition-all"
                        >
                          🔍 Review
                        </button>
                      )}
                      {app.status !== "ALLOCATED" && (
                        <button
                          onClick={() => updateAppStatus(app, "ALLOCATED")}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:scale-105 transition-all"
                        >
                          ✅ Allocate Room
                        </button>
                      )}
                      {app.status !== "REJECTED" && (
                        <button
                          onClick={() => updateAppStatus(app, "REJECTED")}
                          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all"
                        >
                          ✕ Reject
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── MODAL: ADD HOSTEL ── */}
      {showAddHostel && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddHostel(false)}>
          <div className="glass-card rounded-3xl border border-blue-500/40 w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white">🏢 Add New Hostel Block</h3>
              <button onClick={() => setShowAddHostel(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddHostel} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Hostel Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Boys Hostel 10"
                    value={addHostelForm.name}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Hostel Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BH10"
                    value={addHostelForm.code}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, code: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-blue-500 transition-all uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Gender Allowed</label>
                  <select
                    value={addHostelForm.genderAllowed}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, genderAllowed: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-blue-500 transition-all"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Campus Location</label>
                  <input
                    type="text"
                    required
                    value={addHostelForm.campusLocation}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, campusLocation: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Total Bed Capacity</label>
                  <input
                    type="number"
                    required
                    value={addHostelForm.totalCapacity}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, totalCapacity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Initial Available Beds</label>
                  <input
                    type="number"
                    required
                    value={addHostelForm.availableCapacity}
                    onChange={(e) => setAddHostelForm({ ...addHostelForm, availableCapacity: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all mt-4"
              >
                {submitting ? "Creating Hostel Block..." : "Create Hostel Block"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD ROOM ── */}
      {showAddRoom && selectedHostel && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAddRoom(false)}>
          <div className="glass-card rounded-3xl border border-emerald-500/40 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h3 className="text-lg font-black text-white">🚪 Add Room to {selectedHostel.code}</h3>
              <button onClick={() => setShowAddRoom(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 201"
                    value={addRoomForm.roomNumber}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Floor (1-9)</label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    required
                    value={addRoomForm.floor}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, floor: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Sharing Type</label>
                  <select
                    value={addRoomForm.roomType}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, roomType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-emerald-500 transition-all"
                  >
                    <option>Single</option>
                    <option>Double</option>
                    <option>Triple</option>
                    <option>Quad</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">AC Type</label>
                  <select
                    value={addRoomForm.acType}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, acType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#121220] border border-white/10 text-white text-xs focus:border-emerald-500 transition-all"
                  >
                    <option>AC</option>
                    <option>Non-AC</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Total Beds</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    required
                    value={addRoomForm.totalBeds}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, totalBeds: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">Rent / Sem (₹)</label>
                  <input
                    type="number"
                    required
                    value={addRoomForm.rentPerSemester}
                    onChange={(e) => setAddRoomForm({ ...addRoomForm, rentPerSemester: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={addRoomForm.isPwDAccessible}
                  onChange={(e) => setAddRoomForm({ ...addRoomForm, isPwDAccessible: e.target.checked })}
                  className="rounded border-white/10 text-emerald-500"
                />
                <span className="text-xs text-slate-300">♿ PwD / Wheelchair Accessible Room</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all mt-4"
              >
                {submitting ? "Adding Room..." : "Add Room to Inventory"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CUSTOM DELETE CONFIRMATION ── */}
      {deleteConfirmation && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmation(null)}>
          <div
            className="glass-card rounded-3xl border border-red-500/40 w-full max-w-sm p-6 shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-2xl flex items-center justify-center mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-white mb-1">Confirm Deletion</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-white">
                {deleteConfirmation.type === "hostel"
                  ? deleteConfirmation.item.code
                  : `Room ${deleteConfirmation.item.roomNumber}`}
              </strong>
              ? This action cannot be reversed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirmation.type === "hostel") {
                    confirmDeleteHostel(deleteConfirmation.item);
                  } else {
                    confirmDeleteRoom(deleteConfirmation.item);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-500/25"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}