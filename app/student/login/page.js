"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function StudentLogin() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({ regNo: "", password: "" });
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
      color: Math.random() > 0.5 ? "249, 115, 22" : "56, 189, 248",
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
    setFormData({ regNo: "12345678", password: "password123" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.regNo.trim() || !formData.password.trim()) {
      setError("Please fill in your Registration Number and Password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: formData.regNo.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem("student_token", data.token);
        if (data.student) {
          localStorage.setItem("student_user", JSON.stringify(data.student));
        }
        window.location.href = "/student/dashboard";
      } else {
        setError(data.message || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      setError("Backend connection error. Please ensure the API server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070710] text-slate-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed -top-32 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-[120px] animate-orb" />
      <div className="pointer-events-none fixed -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[120px] animate-orb-reverse" />

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

          <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-orange-500/30 mb-4">
            L
            <span className="absolute -inset-1 rounded-2xl bg-orange-400 opacity-20 blur" />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">Student Portal</h1>
          <p className="text-sm text-slate-400 mt-1">Lovely Professional University Hostel Allocation</p>
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
            className="w-full mb-6 py-2.5 px-4 rounded-xl glass border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 transition-all text-xs font-semibold flex items-center justify-center gap-2"
          >
            <span>✨ 1-Click Demo Credentials Autofill (Roll: 12345678)</span>
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Registration Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">🎓</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12345678"
                  value={formData.regNo}
                  onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-500">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your student password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-white/10 text-orange-500" />
                <span>Remember on this device</span>
              </label>
              <span className="text-slate-500 hover:text-slate-400 cursor-pointer">Forgot credentials?</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Verifying Credentials with MongoDB...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Student Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              Need assistance? Contact{" "}
              <span className="text-orange-400 font-medium">hostel@lpu.co.in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
