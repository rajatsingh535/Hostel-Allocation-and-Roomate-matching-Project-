"use client";
import { useState } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

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
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left Panel - Dark with Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-16">
            <LpuLogo size={48} showText={true} theme="dark" />
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-3">
                Student Portal
              </h1>
              <p className="text-stone-400 text-lg">
                LPU Hostel Allocation & Roommate Matching
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Browse Hostels</h3>
                  <p className="text-stone-400 text-sm">
                    Gender-based recommendations (BH for Boys, GH for Girls)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Find Roommates</h3>
                  <p className="text-stone-400 text-sm">
                    Lifestyle-matched roommates with compatibility scores
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Smart Allocation</h3>
                  <p className="text-stone-400 text-sm">
                    Automated room & bed assignment based on preferences
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-400 text-lg font-bold">4</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Room Swap</h3>
                  <p className="text-stone-400 text-sm">
                    Request room swaps with other students
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-stone-500 text-sm">
            Secured · Lovely Professional University · Session 2026-27
          </p>
        </div>
      </div>

      {/* Right Panel - Original Login Form */}
      <div className="w-full lg:w-1/2 bg-[var(--bg-alt)] flex items-center justify-center p-6">
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
            <div className="flex justify-center mb-4"><LpuLogo size={56} showText={false} /></div>
            <h1 className="text-[28px] font-black text-stone-900 tracking-tight">Student Portal</h1>
            <p className="text-sm text-stone-500 mt-1">Lovely Professional University · Hostel Allocation</p>
          </div>
          {/* Card */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-8 shadow-sm">
            {/* Error */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <span>⚠</span>
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
    </div>
  );
}
