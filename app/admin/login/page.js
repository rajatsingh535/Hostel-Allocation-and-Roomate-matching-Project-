"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

const API_BASE = "http://localhost:5000/api";

// Registered LPU Warden & Admin Directory (synced with MongoDB Atlas seeder & local fallback)
const REGISTERED_ADMINS = [
  {
    adminId: "admin_lpu",
    password: "adminpassword",
    role: "Chief Hostel Warden (BH & GH)",
  },
  {
    adminId: "admin@lpu.co.in",
    password: "adminpassword",
    role: "Central Residential Administrator",
  },
  {
    adminId: "warden_bh",
    password: "adminpassword",
    role: "Boys Hostels Warden (BH-1 to BH-9)",
  },
  {
    adminId: "warden_gh",
    password: "adminpassword",
    role: "Girls Hostels Warden (GH-1 to GH-3)",
  },
];

export default function AdminLogin() {
  const [formData, setFormData] = useState({ adminId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null); // { status, code, title, message }

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demoError") === "unauthorized") {
        setFormData({ adminId: "unregistered_warden", password: "wrongpassword123" });
        setAuthError({
          status: "401 UNAUTHORIZED",
          code: "UNREGISTERED_ADMIN",
          title: "401 Unauthorized — Unregistered Administrator",
          message:
            "Unauthorized Access: Administrator ID 'unregistered_warden' is not registered in the LPU Warden & Admin Directory. Access to the Warden Control Panel is strictly restricted.",
        });
      }
    } catch (_) {}
  }, []);

  const handleAutofill = () => {
    setFormData({ adminId: "admin_lpu", password: "adminpassword" });
    setAuthError(null);
  };

  const handleTestUnauthorized = () => {
    setFormData({ adminId: "unregistered_admin", password: "wrongpassword123" });
    setAuthError({
      status: "401 UNAUTHORIZED",
      code: "UNREGISTERED_ADMIN",
      title: "401 Unauthorized — Unregistered Administrator",
      message:
        "Unauthorized Access: Administrator ID 'unregistered_admin' is not registered in the LPU Warden & Admin Directory. Access to the Warden Control Panel is strictly restricted.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    const cleanId = formData.adminId.trim().toLowerCase();
    const cleanPassword = formData.password;

    if (!cleanId || !cleanPassword) {
      setAuthError({
        status: "400 BAD REQUEST",
        code: "MISSING_CREDENTIALS",
        title: "Missing Administrative Credentials",
        message: "Please enter both your Administrator ID and Password.",
      });
      return;
    }

    setLoading(true);

    // 1. Try verifying against live Backend API (/api/admin-auth/login)
    let apiSuccess = false;
    try {
      const res = await fetch(`${API_BASE}/admin-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: cleanId,
          email: cleanId,
          password: cleanPassword,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        apiSuccess = true;
        if (data.token) {
          localStorage.setItem("lpu_admin_token", data.token);
        }
      } else if (res.status === 401 || res.status === 403 || res.status === 400) {
        setLoading(false);
        setAuthError({
          status: `${res.status} UNAUTHORIZED`,
          code: data.code || "UNAUTHORIZED_ADMIN",
          title: data.error || "401 Unauthorized — Access Denied",
          message:
            data.message ||
            "Unauthorized Access: Invalid or unregistered Administrator credentials.",
        });
        return;
      }
    } catch (_) {
      // Backend offline -> use client-side verification against REGISTERED_ADMINS
    }

    // 2. Client-side verification against Registered Warden & Admin Directory
    if (!apiSuccess) {
      const matchedAdmin = REGISTERED_ADMINS.find((a) => a.adminId === cleanId);

      if (!matchedAdmin) {
        setLoading(false);
        setAuthError({
          status: "401 UNAUTHORIZED",
          code: "UNREGISTERED_ADMIN",
          title: "401 Unauthorized — Unregistered Administrator",
          message: `Unauthorized Access: Administrator ID '${cleanId}' is not registered in the LPU Warden & Admin Directory. Access Denied.`,
        });
        return;
      }

      if (matchedAdmin.password !== cleanPassword) {
        setLoading(false);
        setAuthError({
          status: "401 UNAUTHORIZED",
          code: "INVALID_ADMIN_PASSWORD",
          title: "401 Unauthorized — Wrong Admin Password",
          message: `Unauthorized Access: Invalid password entered for Administrator '${cleanId}'. Access to Warden Panel denied.`,
        });
        return;
      }
    }

    try {
      localStorage.setItem("lpu_admin_id", cleanId);
      localStorage.setItem("lpu_admin_authenticated", "true");
    } catch (_) {}

    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 500);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <div className="relative z-10 text-center text-white max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <LpuLogo size={52} showText={false} />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-semibold mb-6">
            Warden &amp; Admin Office
          </div>

          <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-4 text-white">
            Smart Hostel Allocation
            <br />
            <span className="text-orange-400">&amp; Roommate Matching</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Administrative control panel for hostel wardens. Manage allocations, approve applications, configure rooms, and run the smart allocation algorithm.
          </p>

          <div className="space-y-3 text-left">
            {[
              { label: "Manage 12 Hostel Blocks", sub: "Add, edit, configure all residential blocks" },
              { label: "Review Student Applications", sub: "CGPA-based priority queue management" },
              { label: "Smart Allocation Algorithm", sub: "Auto-assign rooms with preference matching" },
              { label: "Room Inventory Control", sub: "Floors, seater types, AC/Non-AC rooms" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <div className="text-white font-semibold text-sm">{f.label}</div>
                  <div className="text-stone-500 text-[11px] mt-0.5">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[420px]">
          <div className="flex justify-center mb-6 lg:hidden">
            <LpuLogo size={48} showText={true} subtitle="Admin Panel" />
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-400 hover:text-[var(--primary)] transition-colors mb-6"
          >
            ← Back to Home
          </Link>

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-1.5">
              Restricted Warden Access
            </p>
            <h2 className="text-2xl font-black text-stone-900">Warden &amp; Admin Panel</h2>
            <p className="text-sm text-stone-500 mt-1">
              Verified Administrator Authentication · LPU Hostels
            </p>
          </div>

          {/* 401 Unauthorized Alert Box */}
          {authError && (
            <div className="mb-5 rounded-xl bg-red-50 border-2 border-red-300 p-4 text-red-900 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🔒 {authError.status}
                  </span>
                  <span className="text-xs font-extrabold text-red-900">
                    {authError.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  {authError.code}
                </span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                {authError.message}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 mb-6">
            <button
              type="button"
              onClick={handleAutofill}
              className="py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/70 text-[var(--primary-dark)] hover:bg-orange-100/80 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>✅ Demo Admin Login</span>
            </button>
            <button
              type="button"
              onClick={handleTestUnauthorized}
              className="py-2.5 px-3 rounded-xl border border-red-200 bg-red-50/70 text-red-700 hover:bg-red-100/80 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>🚫 Test Unauthorized</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Administrator ID
                </label>
                <span className="text-[10px] text-stone-400 font-medium">
                  Valid: admin_lpu, warden_bh, warden_gh
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. admin_lpu"
                value={formData.adminId}
                onChange={(e) => {
                  setFormData({ ...formData, adminId: e.target.value });
                  setAuthError(null);
                }}
                className={`input-light ${
                  authError && authError.code === "UNREGISTERED_ADMIN"
                    ? "border-red-400 bg-red-50/30"
                    : ""
                }`}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter administrator password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setAuthError(null);
                }}
                className={`input-light ${
                  authError && authError.code === "INVALID_ADMIN_PASSWORD"
                    ? "border-red-400 bg-red-50/30"
                    : ""
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-[10px] text-[15px] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Verifying Warden Credentials…</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Access Admin Panel</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Registered Warden Credentials Reference */}
          <div className="mt-5 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
            <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
              <span>🛡️ Authorized Warden IDs (Password: adminpassword)</span>
              <span className="text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded">
                Protected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-stone-500">
              <div>• <strong>admin_lpu</strong> (Chief Warden)</div>
              <div>• <strong>admin@lpu.co.in</strong> (Admin)</div>
              <div>• <strong>warden_bh</strong> (BH Warden)</div>
              <div>• <strong>warden_gh</strong> (GH Warden)</div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center space-y-2">
            <p className="text-xs text-stone-400">
              Secured · Lovely Professional University · Session 2026-27
            </p>
            <p className="text-xs text-stone-400">
              Student?{" "}
              <Link
                href="/student/login"
                className="text-[var(--primary)] hover:underline font-medium"
              >
                Student Portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
