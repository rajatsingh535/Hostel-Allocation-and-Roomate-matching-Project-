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
    setTimeout(() => {
      window.location.href = "/admin/dashboard";
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-alt)] flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">

        {/* Back link */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-stone-500 hover:text-[var(--primary)] transition-colors mb-7"
          >
            ← Back to Home
          </Link>

          {/* Shield icon box (orange, consistent) */}
          <div className="flex justify-center mb-4"><LpuLogo size={56} showText={false} /></div>
          <h1 className="text-[28px] font-black text-stone-900 tracking-tight">Warden &amp; Admin Panel</h1>
          <p className="text-sm text-stone-500 mt-1">Authorized University Personnel Authentication</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Demo autofill */}
          <button
            type="button"
            onClick={handleAutofill}
            className="w-full mb-6 py-2.5 px-4 rounded-xl border border-[var(--border)] bg-[var(--primary-soft)] text-[var(--primary-dark)] hover:border-orange-300 transition-all text-sm font-semibold flex items-center justify-center gap-2"
          >
            ✨ 1-Click Demo Admin Autofill
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin ID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Administrator ID / Username
              </label>
              <input
                type="text"
                required
                placeholder="e.g. admin_lpu"
                value={formData.adminId}
                onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                className="input-light"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">Password</label>
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
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-light"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-[10px] text-[15px] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Verifying Authorization…</span>
                </>
              ) : (
                <>
                  <span>Access Control Panel</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
            <p className="text-xs text-stone-400">
              Session secured with TLS 1.3 · Lovely Professional University
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mt-5">
          Student?{" "}
          <Link href="/student/login" className="text-[var(--primary)] hover:underline font-medium">
            Sign in to Student Portal →
          </Link>
        </p>
      </div>
    </div>
  );
}
