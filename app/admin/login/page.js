"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

const API_BASE = "http://localhost:5000/api";

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
  const [authError, setAuthError] = useState(null);

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

  const handleAutofill = (adminId = "admin_lpu") => {
    setFormData({ adminId, password: "adminpassword" });
    setAuthError(null);
  };

  const handleTestUnauthorized = () => {
    setFormData({ adminId: "unregistered_warden", password: "wrongpassword123" });
    setAuthError({
      status: "401 UNAUTHORIZED",
      code: "UNREGISTERED_ADMIN",
      title: "401 Unauthorized — Unregistered Administrator",
      message:
        "Unauthorized Access: Administrator ID 'unregistered_warden' is not registered in the LPU Warden & Admin Directory. Access to the Warden Control Panel is strictly restricted.",
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
    } catch (_) {}

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
    }, 350);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1080px] mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden grid lg:grid-cols-12">
        
        {/* ── Left Panel: Branding & Capabilities ── */}
        <div className="lg:col-span-5 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 p-7 sm:p-9 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <LpuLogo size={34} showText={false} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Warden &amp; Admin Office
                </div>
                <div className="text-sm font-bold text-white">
                  LPU Residential Services
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black leading-tight mb-3 text-white">
              Smart Hostel Allocation{" "}
              <span className="text-orange-400">&amp; Roommate Matching</span>
            </h1>
            <p className="text-stone-300 text-xs leading-relaxed mb-6">
              Administrative control center for Chief Warden and Block Wardens. Manage 12 hostel blocks, verify applications, run the 8-tier allocation engine, inspect floor heatmaps, and monitor system health.
            </p>

            <div className="space-y-2.5">
              {[
                { label: "Manage 12 Hostel Blocks (BH-1..9 & GH-1..3)", sub: "Real-time bed inventory across 1,080 rooms & 4,320 beds" },
                { label: "8-Tier Smart Allocation & QR Allotment Slips", sub: "CGPA priority, gender verification & roommate pairing" },
                { label: "Floor-Wise Occupancy Heatmap & CSV Export", sub: "Interactive Floors 1–6 demand grid and 1-click reports" },
                { label: "Operational Health & Security Telemetry", sub: "JWT RBAC, NoSQL/XSS sanitizer & API latency metrics" },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500/40 flex items-center justify-center text-orange-300 font-bold text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-white font-bold text-xs">{f.label}</div>
                    <div className="text-stone-400 text-[11px]">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
            <span>Role-Based JWT Guard Active</span>
            <span>Session 2026-27</span>
          </div>
        </div>

        {/* ── Right Panel: Compact Login Form ── */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between mb-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[var(--primary)] transition-colors"
              >
                ← Back to Home
              </Link>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-bold text-stone-600">
                🛡️ Restricted Warden Access
              </span>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-black text-stone-900">Warden &amp; Admin Sign In</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Verified Administrator Authentication · LPU Division of Residential Services
              </p>
            </div>

            {/* Quick Autofill & Negative Validation Bar */}
            <div className="mb-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 pl-1">
                Quick Autofill:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleAutofill("admin_lpu")}
                  className="py-1.5 px-3 rounded-lg border border-orange-200 bg-orange-50 text-[var(--primary-dark)] hover:bg-orange-100 transition-all text-xs font-bold"
                >
                  ✅ Chief Warden (admin_lpu)
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill("warden_gh")}
                  className="py-1.5 px-3 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-all text-xs font-bold"
                >
                  👩 GH Warden (warden_gh)
                </button>
                <button
                  type="button"
                  onClick={handleTestUnauthorized}
                  className="py-1.5 px-3 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all text-xs font-bold"
                >
                  🚫 Test Invalid (401)
                </button>
              </div>
            </div>

            {/* 401 Unauthorized Alert Box */}
            {authError && (
              <div className="mb-4 rounded-xl bg-red-50 border-2 border-red-300 p-3.5 text-red-900 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                      🔒 {authError.status}
                    </span>
                    <span className="text-xs font-extrabold text-red-900">
                      {authError.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    {authError.code}
                  </span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  {authError.message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Administrator / Warden ID <span className="text-[var(--primary)]">*</span>
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
                  className={`input-light py-2.5 ${
                    authError && authError.code === "UNREGISTERED_ADMIN"
                      ? "border-red-400 bg-red-50/40"
                      : ""
                  }`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Administrator Password <span className="text-[var(--primary)]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-bold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter warden password (demo: adminpassword)"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setAuthError(null);
                  }}
                  className={`input-light py-2.5 ${
                    authError && authError.code === "INVALID_ADMIN_PASSWORD"
                      ? "border-red-400 bg-red-50/40"
                      : ""
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-sm font-bold disabled:opacity-60 shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Verifying Warden Credentials…</span>
                  </>
                ) : (
                  <span>Verify &amp; Access Warden Control Panel →</span>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200/80">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 mb-3">
              <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
                <span>🛡️ Authorized Warden Accounts (Password: adminpassword)</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  RBAC Protected
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-stone-500">
                <div>• <strong>admin_lpu</strong> (Chief Warden)</div>
                <div>• <strong>admin@lpu.co.in</strong> (Central Admin)</div>
                <div>• <strong>warden_bh</strong> (Boys Wing BH)</div>
                <div>• <strong>warden_gh</strong> (Girls Wing GH)</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Secured · Lovely Professional University</span>
              <Link
                href="/student/login"
                className="text-[var(--primary-dark)] hover:underline font-bold"
              >
                Student Hostel Portal →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
