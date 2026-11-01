"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function StudentLogin() {
  const [formData, setFormData] = useState({ regNo: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAutofill = () => {
    setFormData({ regNo: "12304567", password: "password123" });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.regNo.trim() || !formData.password.trim()) {
      setError("Please fill in your Registration Number and Password.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      window.location.href = "/student/dashboard";
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

          {/* Logo icon */}
          <div className="w-16 h-16 mx-auto mb-4">
            <Image 
              src="/lpu-logo.ico" 
              alt="LPU" 
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-[28px] font-black text-stone-900 tracking-tight">Student Portal</h1>
          <p className="text-sm text-stone-500 mt-1">Lovely Professional University · Hostel Allocation</p>
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
            ✨ 1-Click Demo Credentials Autofill
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Registration Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Registration Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 12304567"
                value={formData.regNo}
                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
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
                placeholder="Enter your student password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-light"
              />
            </div>

            {/* Remember + forgot */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-stone-300 text-[var(--primary)]" />
                <span>Remember on this device</span>
              </label>
              <span className="text-stone-400 hover:text-stone-600 cursor-pointer">Forgot credentials?</span>
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
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Student Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
            <p className="text-xs text-stone-400">
              Need assistance? Contact{" "}
              <a href="mailto:hostel@lpu.co.in" className="text-[var(--primary)] font-medium hover:underline">
                hostel@lpu.co.in
              </a>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-stone-400 mt-5">
          Admin?{" "}
          <Link href="/admin/login" className="text-[var(--primary)] hover:underline font-medium">
            Sign in to Admin Panel →
          </Link>
        </p>
      </div>
    </div>
  );
}
