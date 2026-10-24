"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function AdminLogin() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ adminId: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.6,
      dy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.5 ? "99, 102, 241" : "56, 189, 248",
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
    <div className="relative min-h-screen bg-[#070710] text-slate-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed -top-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[120px] animate-orb" />
      <div className="pointer-events-none fixed -bottom-32 -left-32 w-96 h-96 rounded-full bg-cyan-600/20 blur-[120px] animate-orb-reverse" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 glass px-3.5 py-1.5 rounded-full"
          >
            ← Back to Home
          </Link>

          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/30 mb-4">
            🔐
            <span className="absolute -inset-1 rounded-2xl bg-indigo-400 opacity-20 blur" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">Warden &amp; Admin Panel</h1>
          <p className="text-sm text-slate-400 mt-1">Authorized University Personnel Authentication</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo Autofill Pill */}
          <button
            type="button"
            onClick={handleAutofill}
            className="w-full mb-6 py-2.5 px-4 rounded-xl glass border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 transition-all text-xs font-semibold flex items-center justify-center gap-2"
          >
            <span>✨ 1-Click Demo Admin Autofill</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Administrator ID / Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">🛡️</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin_lpu"
                  value={formData.adminId}
                  onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Access Control Panel</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Session secured with TLS 1.3 • Lovely Professional University
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}