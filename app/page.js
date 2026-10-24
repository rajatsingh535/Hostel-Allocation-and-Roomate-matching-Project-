"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── LPU Campus & Hostel Showcase Imagery ──
const CAMPUS_SLIDES = [
  {
    title: "Boys Hostel Block (BH 1-9)",
    desc: "Modern 9-storey towers with elevators, reading halls & gyms",
    tag: "Boys Hostels",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Girls Hostel Wing (GH 1-3)",
    desc: "High-security residential complexes with in-house salon & dining",
    tag: "Girls Hostels",
    img: "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Air-Conditioned Premium Suites",
    desc: "Climate-controlled rooms with personal study desks & storage",
    tag: "AC Suites",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Multicuisine Campus Dining",
    desc: "Nutritious multi-cuisine meal plans serving fresh 4 times a day",
    tag: "Mess & Dining",
    img: "https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Recreation & Gymnasium",
    desc: "Indoor sports, table tennis, badminton & 24/7 fitness centers",
    tag: "Sports Complex",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Central Library & Study Pods",
    desc: "Soundproof study zones and high-speed fiber internet coverage",
    tag: "Study Pods",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
  }
];

export default function Home() {
  const canvasRef = useRef(null);
  const scrollRef = useRef(null);
  const isHoveringScroll = useRef(false);

  const [stats, setStats] = useState({ totalHostels: 12, totalRooms: 1080, totalBeds: 4320, totalApplications: 5 });
  const [hostels, setHostels] = useState([]);
  const [filterGender, setFilterGender] = useState("All");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeAmenityTab, setActiveAmenityTab] = useState("rooms");

  // ── Interactive 3D Particle Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? "249, 115, 22" : "56, 189, 248",
      alpha: Math.random() * 0.5 + 0.2
    }));

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Distance to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 3;
          p.y -= (dy / dist) * force * 3;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(249, 115, 22, ${0.12 * (1 - d / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ── Auto-scroll Showcase Loop ──
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let anim;
    const scrollStep = () => {
      if (!isHoveringScroll.current) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      anim = requestAnimationFrame(scrollStep);
    };

    anim = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(anim);
  }, []);

  // ── Fetch Live Stats & Hostels ──
  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.data);
      })
      .catch(() => {});

    fetch("http://localhost:5000/api/hostels")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHostels(d.data);
      })
      .catch(() => {});
  }, []);

  const filteredHostels = hostels.filter((h) => {
    if (filterGender === "All") return true;
    return h.genderAllowed === filterGender;
  });

  return (
    <div className="relative min-h-screen bg-[#070710] text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* ── Ambient Background Glow Orbs ── */}
      <div className="pointer-events-none fixed -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/0 blur-[130px] animate-orb" />
      <div className="pointer-events-none fixed top-1/2 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/0 blur-[130px] animate-orb-reverse" />

      {/* ── 3D Interactive Canvas ── */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* ── Sticky Top Navigation ── */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 text-white font-black text-xl shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform duration-300">
              L
              <span className="absolute -inset-0.5 rounded-2xl bg-orange-400 opacity-0 group-hover:opacity-40 blur transition-opacity" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight flex items-center gap-2">
                <span>LPU Hostel Portal</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Lovely Professional University</p>
            </div>
          </Link>

          {/* Quick links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#hostels" className="hover:text-orange-400 transition-colors">
              Available Hostels
            </a>
            <a href="#campus" className="hover:text-orange-400 transition-colors">
              Campus Life
            </a>
            <a href="#features" className="hover:text-orange-400 transition-colors">
              Allocation Policy
            </a>
            <a href="#faqs" className="hover:text-orange-400 transition-colors">
              Help &amp; FAQs
            </a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/student/login"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              🎓 Student Login
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2.5 rounded-xl glass border border-white/10 text-slate-200 font-semibold text-sm hover:border-blue-500/50 hover:text-blue-300 transition-all duration-200"
            >
              🔐 Admin
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ── 3D Hero Section ── */}
        <section className="pt-16 pb-24 px-6 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-orange-500/30 text-xs font-semibold text-orange-300 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
            Smart Allocation &amp; Roommate Matching Engine
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto">
            Find Your Ideal <span className="shimmer-text">Hostel Room</span>
            <br />
            at Lovely Professional University
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Automated allocation for <strong>BH1–BH9</strong> and <strong>GH1–GH3</strong>. Choose your favorite floor, AC or
            Non-AC comfort, and find compatible roommates based on academic interests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href="/student/login"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-base shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-3"
            >
              <span>Book Your Room Now</span>
              <span className="text-lg">→</span>
            </Link>
            <a
              href="#hostels"
              className="px-8 py-4 rounded-2xl glass border border-white/15 text-slate-200 font-bold text-base hover:border-orange-500/40 hover:text-white transition-all duration-200"
            >
              Explore Hostels
            </a>
          </div>

          {/* ── Live Database Metrics ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Hostel Blocks", value: stats.totalHostels || 12, sub: "BH1-9 & GH1-3", icon: "🏢" },
              { label: "Total Rooms", value: (stats.totalRooms || 1080).toLocaleString(), sub: "AC & Non-AC", icon: "🚪" },
              { label: "Total Beds", value: (stats.totalBeds || 4320).toLocaleString(), sub: "Single to Quad", icon: "🛏️" },
              { label: "Active Submissions", value: stats.totalApplications || 5, sub: "Fall 2026 Batch", icon: "📋" }
            ].map((m, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 text-center group hover:-translate-y-1 transition-transform">
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="text-3xl font-black text-white tracking-tight">{m.value}</div>
                <div className="text-sm font-semibold text-orange-400 mt-0.5">{m.label}</div>
                <div className="text-[11px] text-slate-400 mt-1">{m.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Continuous Scrolling Campus Showcase ── */}
        <section id="campus" className="py-12 bg-black/40 border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Campus Facilities</span>
              <h2 className="text-3xl font-extrabold text-white mt-1">LPU Residential Experience</h2>
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline-block">↔ Auto-scrolling gallery (hover to pause)</span>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-hidden select-none py-2 px-6"
            onMouseEnter={() => (isHoveringScroll.current = true)}
            onMouseLeave={() => (isHoveringScroll.current = false)}
            style={{ cursor: "grab" }}
          >
            {[...CAMPUS_SLIDES, ...CAMPUS_SLIDES].map((slide, idx) => (
              <div
                key={idx}
                className="relative flex-shrink-0 w-80 md:w-96 h-60 rounded-3xl overflow-hidden glass border border-white/10 group shadow-lg"
              >
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/80 text-white backdrop-blur-md">
                    {slide.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white text-base leading-tight mb-1">{slide.title}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{slide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Live Hostel Preview Grid ── */}
        <section id="hostels" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Available Accommodations</span>
              <h2 className="text-4xl font-extrabold text-white mt-1">Hostels Available for Allocation</h2>
              <p className="text-slate-400 text-sm mt-2 max-w-xl">
                Browse official residential blocks. Sign in to submit your room preferences or view allocation status.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 glass p-1.5 rounded-2xl w-fit">
              {["All", "Male", "Female"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterGender(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterGender === tab
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab === "All" ? "🏢 All (12)" : tab === "Male" ? "👦 Boys (BH1-9)" : "👧 Girls (GH1-3)"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((h) => {
              const totalBeds = h.totalBeds || h.totalCapacity || 360;
              const availBeds = h.availableBeds || h.availableCapacity || 100;
              const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));

              return (
                <div
                  key={h._id}
                  className="glass-card rounded-3xl overflow-hidden border border-white/10 group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        h.genderAllowed === "Female"
                          ? "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=600&q=80"
                          : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a16] via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {h.code}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-xl text-xs font-bold border backdrop-blur-md ${
                          h.genderAllowed === "Female"
                            ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        }`}
                      >
                        {h.genderAllowed === "Female" ? "👧 Girls" : "👦 Boys"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-xl font-black text-white">{h.name}</h3>
                      <p className="text-xs text-slate-300">📍 {h.campusLocation || "LPU Campus"}</p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Occupancy bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-400">Bed Availability</span>
                          <span className="text-emerald-400">{availBeds} Available</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500 rounded-full"
                            style={{ width: `${occPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                          <span>{occPercent}% Occupied</span>
                          <span>{totalBeds} Total Beds</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {["WiFi", "AC / Non-AC", "Laundry", "Mess"].map((amen, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/5 text-slate-300">
                            ✓ {amen}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href="/student/login"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-center text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Apply For {h.code}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Key Engine Features ── */}
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Algorithmic Precision</span>
            <h2 className="text-4xl font-extrabold text-white mt-1">Smart Policy-Driven Features</h2>
            <p className="text-slate-400 text-sm mt-3">
              Designed specifically for Lovely Professional University to ensure 100% fair, transparent, and prompt room allotments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚖️",
                title: "Merit-Based Preference Engine",
                desc: "Prioritizes allotments transparently according to academic CGPA and early application timestamps."
              },
              {
                icon: "🤝",
                title: "Intelligent Roommate Matcher",
                desc: "Find compatible study partners by matching program of study, sleep schedules, and lifestyle choices."
              },
              {
                icon: "❄️",
                title: "Flexible AC & Bed Configurations",
                desc: "Choose between single, double, triple, or quad-sharing configurations with guaranteed power backup."
              },
              {
                icon: "🛡️",
                title: "Bio-metric Campus Safety",
                desc: "24/7 round-the-clock security, automated turnstile entry, and dedicated hostel wardens."
              },
              {
                icon: "🧾",
                title: "Digital Allotment Slip",
                desc: "Receive an immediate digital allotment slip with fee breakdown, gate pass, and room key details."
              },
              {
                icon: "⚡",
                title: "High-Speed Fiber Network",
                desc: "Uncapped high-speed university Wi-Fi in all residential wings and quiet individual study pods."
              }
            ].map((f, i) => (
              <div key={i} className="glass-card rounded-3xl p-7 border border-white/10 hover:border-orange-500/40 group transition-all">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Interactive Amenities Tab ── */}
        <section className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl font-extrabold text-white">Campus Living Experience</h2>
              <p className="text-slate-400 text-sm mt-2">Everything you need for a comfortable collegiate stay.</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center flex-wrap gap-2 mb-10">
              {[
                { id: "rooms", label: "🛏️ Rooms & Comfort" },
                { id: "dining", label: "🍽️ Dining & Food" },
                { id: "sports", label: "💪 Fitness & Sports" },
                { id: "safety", label: "🛡️ Safety & Health" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveAmenityTab(t.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeAmenityTab === t.id
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                      : "glass text-slate-300 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="grid md:grid-cols-3 gap-6">
              {activeAmenityTab === "rooms" && (
                <>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Air Conditioning</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Energy-efficient split ACs with scheduled maintenance and remote climate regulation in all AC rooms.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Ergonomic Furniture</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Personal steel almirah, dedicated wooden study desk, bookshelf, and orthopedic mattress.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Housekeeping &amp; Laundry</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Daily cleaning of common corridors, sanitized washrooms, and mechanized automated laundry pick-up.
                    </p>
                  </div>
                </>
              )}

              {activeAmenityTab === "dining" && (
                <>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">4 Meals Daily</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Breakfast, hot lunch, evening high-tea with snacks, and wholesome dinner planned by nutritionists.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Dietary Variations</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Dedicated Pure Vegetarian and Jain meal counters alongside standard north/south Indian menus.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Night Canteens</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Hostel floor tuck-shops and night cafeterias open till 1:00 AM during examination schedules.
                    </p>
                  </div>
                </>
              )}

              {activeAmenityTab === "sports" && (
                <>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Indoor Gyms</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Fully equipped multi-station gymnasium on the ground floor of every hostel block.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Badminton &amp; TT</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Floodlit outdoor badminton courts and indoor table tennis arenas in the common recreation hall.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Yoga &amp; Meditation</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Quiet rooftop and lawn spaces reserved for morning yoga sessions and fitness activities.
                    </p>
                  </div>
                </>
              )}

              {activeAmenityTab === "safety" && (
                <>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Biometric Entry</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Facial recognition and fingerprint scanners at all entry points to ensure zero unauthorized access.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">24/7 Uni-Hospital</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Full-fledged on-campus hospital with resident doctors, pharmacy, and dedicated ambulance service.
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-6 border border-white/10">
                    <div className="text-orange-400 font-bold mb-2">Female Warden Care</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Dedicated senior female wardens, resident counselors, and female guards across all GH blocks.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ── FAQs Accordion ── */}
        <section id="faqs" className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Common Queries</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the hostel allocation policy work?",
                a: "Allocations are computed dynamically based on a student's preference list, CGPA score, and timestamp of application. High CGPA students receive first priority for single and AC double rooms."
              },
              {
                q: "Can I choose my specific roommate?",
                a: "Yes! In your student dashboard, you can specify preferred roommate registration numbers. When mutual requests match, our algorithm assigns you to the same room automatically."
              },
              {
                q: "What is the difference between AC and Non-AC fees?",
                a: "AC rooms have a subsidized utility fee included per semester with power backup, whereas Non-AC rooms provide ceiling fans and natural airflow at a standard fee tier."
              },
              {
                q: "What if I require medical or PwD accommodations?",
                a: "You can specify accessibility accommodations during application. Ground floor rooms equipped with wider door frames and ramp access are reserved for PwD applicants."
              }
            ].map((faq, idx) => (
              <div key={idx} className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold flex items-center justify-between text-white hover:text-orange-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-xl transition-transform duration-200" style={{ transform: activeFaq === idx ? "rotate(45deg)" : "rotate(0deg)" }}>
                    +
                  </span>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Ready to Apply CTA ── */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-10 md:p-16 border border-orange-500/30 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Ready to Reserve Your Hostel Room?
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 font-normal">
                Join thousands of LPU students who find their ideal accommodation each semester in just a few clicks.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/student/login"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                >
                  Sign in as Student
                </Link>
                <Link
                  href="/admin/login"
                  className="px-8 py-4 rounded-xl glass border border-white/20 text-white font-bold text-base hover:border-blue-500/50 hover:text-blue-300 transition-all"
                >
                  Admin Control Panel
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Professional Footer ── */}
      <footer className="border-t border-white/10 bg-black/70 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-white text-base">L</div>
              <span className="font-extrabold text-white text-base">LPU Hostel Portal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official automated hostel allocation and residential roommate matching platform of Lovely Professional University.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/student/login" className="hover:text-orange-400">Student Login</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-orange-400">Student Dashboard</Link></li>
              <li><Link href="/admin/login" className="hover:text-orange-400">Admin Login</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-orange-400">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Residential Hostels</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Boys Hostels: BH1 to BH9 (9 Blocks)</li>
              <li>Girls Hostels: GH1 to GH3 (3 Blocks)</li>
              <li>Single, Double, Triple, Quad Rooms</li>
              <li>AC and Non-AC Options</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Campus Help Desk</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lovely Professional University<br />
              Jalandhar-Delhi G.T. Road, Phagwara, Punjab 144411<br />
              Email: <span className="text-orange-400">hostel@lpu.co.in</span><br />
              Helpline: +91 1824 517000
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Lovely Professional University. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Hostel Code of Conduct</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}