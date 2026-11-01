"use client";
import { useState } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

export default function AdminLogin() {
  const [formData, setFormData] = useState({ adminId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAutofill = () => {
    setFormData({ adminId: "admin_lpu", password: "adminpassword" });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.adminId.trim() || !formData.password.trim()) {
      setError("Please enter your Administrative Credentials.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => { window.location.href = "/admin/dashboard"; }, 700);
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
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
            Smart Hostel Allocation<br />
            <span className="text-orange-400">&amp; Roommate Matching</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Administrative control panel for hostel wardens. Manage allocations, approve applications, configure rooms, and run the smart allocation algorithm.
          </p>

          <div className="space-y-3 text-left">
            {[
              { label: "Manage 12 Hostel Blocks",        sub: "Add, edit, configure all residential blocks" },
              { label: "Review Student Applications",     sub: "CGPA-based priority queue management" },
              { label: "Smart Allocation Algorithm",      sub: "Auto-assign rooms with preference matching" },
              { label: "Room Inventory Control",          sub: "Floors, seater types, AC/Non-AC rooms" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/30 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
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
        <div className="w-full max-w-[400px]">

          <div className="flex justify-center mb-6 lg:hidden">
            <LpuLogo size={48} showText={true} subtitle="Admin Panel" />
          </div>

          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-400 hover:text-[var(--primary)] transition-colors mb-8">
            ← Back to Home
          </Link>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2">Restricted Access</p>
            <h2 className="text-2xl font-black text-stone-900">Warden &amp; Admin Panel</h2>
            <p className="text-sm text-stone-500 mt-1">Smart Hostel Allocation &amp; Roommate Matching</p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          <button type="button" onClick={handleAutofill}
            className="w-full mb-6 py-2.5 px-4 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 transition-all text-sm font-semibold flex items-center justify-center gap-2">
            Use Demo Admin Credentials
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">Administrator ID</label>
              <input type="text" required placeholder="e.g. admin_lpu"
                value={formData.adminId}
                onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                className="input-light" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-medium">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input type={showPassword ? "text" : "password"} required placeholder="Enter administrator password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-light" />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 rounded-[10px] text-[15px] disabled:opacity-60">
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>Verifying…</span></>
              ) : (
                <><span>Access Admin Panel</span><span>→</span></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-100 text-center space-y-2">
            <p className="text-xs text-stone-400">Secured · Lovely Professional University · Session 2026-27</p>
            <p className="text-xs text-stone-400">
              Student?{" "}
              <Link href="/student/login" className="text-[var(--primary)] hover:underline font-medium">Student Portal →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
