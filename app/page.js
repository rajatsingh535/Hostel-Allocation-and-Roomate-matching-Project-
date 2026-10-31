"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Campus & Hostel Showcase Slides ──
// Each image URL is carefully matched to its title for accuracy
const CAMPUS_SLIDES = [
  {
    title: "Boys Hostel Block (BH 1-9)",
    desc: "Modern 9-storey towers with elevators, reading halls & gyms",
    tag: "Boys Hostels",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Girls Hostel Wing (GH 1-3)",
    desc: "High-security residential complexes with in-house salon & dining",
    tag: "Girls Hostels",
    img: "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Air-Conditioned Premium Suites",
    desc: "Climate-controlled rooms with personal study desks & storage",
    tag: "AC Suites",
    // hostel bedroom image
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Multicuisine Campus Dining",
    desc: "Nutritious multi-cuisine meal plans serving fresh 4 times a day",
    tag: "Mess & Dining",
    // food hall / cafeteria
    img: "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Recreation & Gymnasium",
    desc: "Indoor sports, table tennis, badminton & 24/7 fitness centers",
    tag: "Sports Complex",
    // gym equipment
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Central Library & Study Pods",
    desc: "Soundproof study zones and high-speed fiber internet coverage",
    tag: "Study Pods",
    // library / study area — fixed fallback
    img: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80",
  },
];

// ── FAQ data ──
const FAQS = [
  {
    q: "How does the hostel allocation policy work?",
    a: "Allocations are computed dynamically based on a student's preference list, CGPA score, and timestamp of application. High CGPA students receive first priority for single and AC double rooms.",
  },
  {
    q: "Can I choose my specific roommate?",
    a: "Yes! In your student dashboard, you can specify preferred roommate registration numbers. When mutual requests match, our algorithm assigns you to the same room automatically.",
  },
  {
    q: "What is the difference between AC and Non-AC fees?",
    a: "AC rooms have a subsidized utility fee included per semester with power backup, whereas Non-AC rooms provide ceiling fans and natural airflow at a standard fee tier.",
  },
  {
    q: "What if I require medical or PwD accommodations?",
    a: "You can specify accessibility accommodations during application. Ground floor rooms equipped with wider door frames and ramp access are reserved for PwD applicants.",
  },
];

// ── Feature cards ──
const FEATURES = [
  {
    icon: "⚖️",
    title: "Merit-Based Preference Engine",
    desc: "Prioritizes allotments transparently according to academic CGPA and early application timestamps.",
  },
  {
    icon: "🤝",
    title: "Intelligent Roommate Matcher",
    desc: "Find compatible study partners by matching program of study, sleep schedules, and lifestyle choices.",
  },
  {
    icon: "❄️",
    title: "Flexible AC & Bed Configurations",
    desc: "Choose between single, double, triple, or quad-sharing configurations with guaranteed power backup.",
  },
  {
    icon: "🛡️",
    title: "Bio-metric Campus Safety",
    desc: "24/7 round-the-clock security, automated turnstile entry, and dedicated hostel wardens.",
  },
  {
    icon: "🧾",
    title: "Digital Allotment Slip",
    desc: "Receive an immediate digital allotment slip with fee breakdown, gate pass, and room key details.",
  },
  {
    icon: "⚡",
    title: "High-Speed Fiber Network",
    desc: "Uncapped high-speed university Wi-Fi in all residential wings and quiet individual study pods.",
  },
];

// ── Amenity tab data ──
const AMENITY_TABS = {
  rooms: [
    { title: "Air Conditioning", desc: "Energy-efficient split ACs with scheduled maintenance and remote climate regulation in all AC rooms." },
    { title: "Ergonomic Furniture", desc: "Personal steel almirah, dedicated wooden study desk, bookshelf, and orthopedic mattress." },
    { title: "Housekeeping & Laundry", desc: "Daily cleaning of common corridors, sanitized washrooms, and mechanized automated laundry pick-up." },
  ],
  dining: [
    { title: "4 Meals Daily", desc: "Breakfast, hot lunch, evening high-tea with snacks, and wholesome dinner planned by nutritionists." },
    { title: "Dietary Variations", desc: "Dedicated Pure Vegetarian and Jain meal counters alongside standard north/south Indian menus." },
    { title: "Night Canteens", desc: "Hostel floor tuck-shops and night cafeterias open till 1:00 AM during examination schedules." },
  ],
  sports: [
    { title: "Indoor Gyms", desc: "Fully equipped multi-station gymnasium on the ground floor of every hostel block." },
    { title: "Badminton & TT", desc: "Floodlit outdoor badminton courts and indoor table tennis arenas in the common recreation hall." },
    { title: "Yoga & Meditation", desc: "Quiet rooftop and lawn spaces reserved for morning yoga sessions and fitness activities." },
  ],
  safety: [
    { title: "Biometric Entry", desc: "Facial recognition and fingerprint scanners at all entry points to ensure zero unauthorized access." },
    { title: "24/7 Uni-Hospital", desc: "Full-fledged on-campus hospital with resident doctors, pharmacy, and dedicated ambulance service." },
    { title: "Female Warden Care", desc: "Dedicated senior female wardens, resident counselors, and female guards across all GH blocks." },
  ],
};

export default function Home() {
  const scrollRef = useRef(null);
  const isHoveringScroll = useRef(false);
  const [scrolled, setScrolled] = useState(false);

  const [stats, setStats] = useState({
    totalHostels: 12,
    totalRooms: 1080,
    totalBeds: 4320,
    totalApplications: 5,
  });
  const [hostels, setHostels] = useState([]);
  const [filterGender, setFilterGender] = useState("All");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeAmenityTab, setActiveAmenityTab] = useState("rooms");

  // ── Navbar scroll shadow ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Auto-scroll campus gallery ──
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let anim;
    const step = () => {
      if (!isHoveringScroll.current) {
        el.scrollLeft += 0.7;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim);
  }, []);

  // ── Fetch live stats & hostels ──
  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((r) => r.json())
      .then((d) => { if (d.success) setStats(d.data); })
      .catch(() => {});

    fetch("http://localhost:5000/api/hostels")
      .then((r) => r.json())
      .then((d) => { if (d.success) setHostels(d.data); })
      .catch(() => {});
  }, []);

  const filteredHostels = hostels.filter((h) =>
    filterGender === "All" ? true : h.genderAllowed === filterGender
  );

  return (
    <div className="min-h-screen bg-white text-stone-900">

      {/* ══════════════════════════════════════════
          STICKY NAVBAR — white, blur on scroll
          ══════════════════════════════════════════ */}
      <nav
        className={`sticky top-0 z-50 transition-shadow duration-300 ${
          scrolled ? "nav-glass shadow-sm" : "bg-white border-b border-[var(--border)]"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:bg-[var(--primary-dark)] transition-colors">
              L
            </div>
            <div>
              <div className="font-bold text-[15px] text-stone-900 flex items-center gap-2 leading-tight">
                LPU Hostel Portal
                {/* Live badge */}
                <span className="badge-green">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse inline-block" />
                  Live 2026
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">Lovely Professional University</p>
            </div>
          </Link>

          {/* Nav links — desktop */}
          <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-stone-500">
            {[
              { href: "#hostels", label: "Available Hostels" },
              { href: "#campus",  label: "Campus Life" },
              { href: "#features",label: "Allocation Policy" },
              { href: "#faqs",    label: "Help & FAQs" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hover:text-[var(--primary)] transition-colors relative group"
              >
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[var(--primary)] rounded group-hover:w-full transition-all duration-200" />
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/student/login"
              className="btn-primary text-sm px-4 py-2 rounded-[10px]"
            >
              Student Login
            </Link>
            <Link
              href="/admin/login"
              className="btn-secondary text-sm px-4 py-2 rounded-[10px]"
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ══════════════════════════════════════════
            HERO SECTION
            ══════════════════════════════════════════ */}
        <section className="relative pt-20 pb-24 px-6 text-center overflow-hidden">
          {/* Warm radial glow */}
          <div className="hero-glow" />

          <div className="relative z-10 max-w-[1200px] mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 badge-orange mb-6 fade-up">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse inline-block" />
              Smart Allocation &amp; Roommate Matching Engine
            </div>

            {/* H1 — only "Hostel Room" is orange */}
            <h1 className="text-4xl md:text-[56px] font-black leading-[1.1] tracking-tight text-stone-900 max-w-4xl mx-auto mb-5 fade-up delay-1">
              Find Your Ideal{" "}
              <span className="text-highlight">Hostel Room</span>
              <br />
              at Lovely Professional University
            </h1>

            <p className="text-[17px] md:text-[18px] text-stone-500 max-w-2xl mx-auto mb-10 leading-[1.65] fade-up delay-2">
              Automated allocation for <strong className="text-stone-700">BH1–BH9</strong> and{" "}
              <strong className="text-stone-700">GH1–GH3</strong>. Choose your floor, AC or Non-AC
              comfort, and find compatible roommates based on academic interests.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12 fade-up delay-3">
              <Link href="/student/login" className="btn-primary text-[15px] px-7 py-3.5 rounded-[10px]">
                Book Your Room Now →
              </Link>
              <a href="#hostels" className="btn-secondary text-[15px] px-7 py-3.5 rounded-[10px]">
                Explore Hostels
              </a>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap items-center justify-center gap-3 fade-up delay-4">
              {[
                { icon: "🏢", label: `${stats.totalHostels || 12} Hostels` },
                { icon: "🛏️", label: `${(stats.totalBeds || 4320).toLocaleString()}+ Beds` },
                { icon: "🚪", label: `${(stats.totalRooms || 1080).toLocaleString()} Rooms` },
                { icon: "🛡️", label: "24/7 Security" },
              ].map((s, i) => (
                <span key={i} className="stat-chip">
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS FACILITIES GALLERY
            ══════════════════════════════════════════ */}
        <section id="campus" className="py-16 border-t border-b border-[var(--border)] overflow-hidden bg-[var(--bg-alt)]">
          <div className="max-w-[1200px] mx-auto px-6 mb-8 flex items-end justify-between">
            <div>
              <p className="section-label mb-1">Campus Facilities</p>
              <h2 className="text-[32px] font-bold text-stone-900">LPU Residential Experience</h2>
            </div>
            <span className="text-xs text-stone-400 hidden sm:block">↔ Hover to pause</span>
          </div>

          {/* Auto-scrolling strip */}
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
                className="relative flex-shrink-0 w-72 md:w-80 h-52 rounded-2xl overflow-hidden group shadow-sm border border-[var(--border)]"
              >
                {/* Image */}
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Orange pill tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--primary)] text-white">
                    {slide.tag}
                  </span>
                </div>

                {/* Text */}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-bold text-white text-sm leading-tight mb-0.5">{slide.title}</h3>
                  <p className="text-[11px] text-white/80 line-clamp-2">{slide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOSTEL CARDS GRID
            ══════════════════════════════════════════ */}
        <section id="hostels" className="section-pad px-6 max-w-[1200px] mx-auto">
          {/* Header + filter */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="section-label mb-1">Available Accommodations</p>
              <h2 className="text-[32px] font-bold text-stone-900">Hostels Available for Allocation</h2>
              <p className="text-stone-500 text-sm mt-2 max-w-xl">
                Browse official residential blocks. Sign in to submit your room preferences or view allocation status.
              </p>
            </div>

            {/* Segmented filter */}
            <div className="filter-bar">
              {["All", "Male", "Female"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterGender(tab)}
                  className={`filter-tab ${filterGender === tab ? "active" : ""}`}
                >
                  {tab === "All" ? "All (12)" : tab === "Male" ? "Boys (BH1-9)" : "Girls (GH1-3)"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((h) => {
              const totalBeds = h.totalBeds || h.totalCapacity || 360;
              const availBeds = h.availableBeds || h.availableCapacity || 100;
              const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));

              return (
                <div key={h._id} className="card flex flex-col overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={
                        h.genderAllowed === "Female"
                          ? "https://images.unsplash.com/photo-1596516109370-65d1f33bd24e?auto=format&fit=crop&w=600&q=80"
                          : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Code badge — top left */}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white text-stone-800 shadow-sm">
                      {h.code}
                    </span>
                    {/* Gender badge — top right */}
                    <span
                      className={`absolute top-3 right-3 text-[11px] font-bold ${
                        h.genderAllowed === "Female" ? "badge-pink" : "badge-blue"
                      }`}
                    >
                      {h.genderAllowed === "Female" ? "Girls" : "Boys"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-stone-900 text-base leading-tight">{h.name}</h3>
                    <p className="text-xs text-stone-400 mt-0.5 mb-4">📍 {h.campusLocation || "LPU Campus"}</p>

                    {/* Occupancy bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-medium mb-1.5">
                        <span className="text-stone-500">Bed Availability</span>
                        <span className="text-[var(--success)] font-semibold">{availBeds} Available</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${occPercent}%` }} />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                        <span>{occPercent}% Occupied</span>
                        <span>{totalBeds} Total Beds</span>
                      </div>
                    </div>

                    {/* Amenity chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {["WiFi", "AC / Non-AC", "Laundry", "Mess"].map((a, i) => (
                        <span key={i} className="chip">✓ {a}</span>
                      ))}
                    </div>

                    {/* Apply button */}
                    <Link
                      href="/student/login"
                      className="btn-primary w-full text-sm rounded-[10px] mt-auto"
                    >
                      Apply For {h.code} →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FEATURES SECTION
            ══════════════════════════════════════════ */}
        <section id="features" className="section-pad px-6 bg-[var(--bg-alt)] border-t border-[var(--border)]">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="section-label mb-2">Algorithmic Precision</p>
              <h2 className="text-[32px] font-bold text-stone-900">Smart Policy-Driven Features</h2>
              <p className="text-stone-500 text-[15px] mt-3 leading-relaxed">
                Designed for Lovely Professional University to ensure 100% fair, transparent, and prompt room allotments.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className="card p-6 group">
                  {/* Icon box with orange tint */}
                  <div className="icon-box mb-4 group-hover:bg-orange-100 transition-colors">
                    <span>{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-[15px] mb-2">{f.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS LIVING / AMENITIES TABS
            ══════════════════════════════════════════ */}
        <section className="section-pad px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-8 md:p-12 shadow-sm">
              <div className="text-center max-w-xl mx-auto mb-8">
                <h2 className="text-[28px] font-bold text-stone-900">Campus Living Experience</h2>
                <p className="text-stone-500 text-sm mt-2">Everything you need for a comfortable collegiate stay.</p>
              </div>

              {/* Tab buttons */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: "rooms",  label: "🛏️ Rooms & Comfort" },
                  { id: "dining", label: "🍽️ Dining & Food" },
                  { id: "sports", label: "💪 Fitness & Sports" },
                  { id: "safety", label: "🛡️ Safety & Health" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveAmenityTab(t.id)}
                    className={`filter-tab ${activeAmenityTab === t.id ? "active" : ""}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="grid md:grid-cols-3 gap-5">
                {(AMENITY_TABS[activeAmenityTab] || []).map((item, i) => (
                  <div key={i} className="bg-[var(--bg-alt)] rounded-xl p-5 border border-[var(--border)]">
                    <div className="font-semibold text-[var(--primary-dark)] mb-2 text-sm">{item.title}</div>
                    <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ ACCORDION
            ══════════════════════════════════════════ */}
        <section id="faqs" className="section-pad px-6 bg-[var(--bg-alt)] border-t border-[var(--border)]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="section-label mb-2">Common Queries</p>
              <h2 className="text-[32px] font-bold text-stone-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-[var(--primary-soft)] transition-colors"
                  >
                    <span className="font-semibold text-stone-800 text-[15px]">{faq.q}</span>
                    <span
                      className="text-xl font-light text-stone-400 flex-shrink-0 transition-transform duration-200"
                      style={{ transform: activeFaq === idx ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      +
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-5 pt-1 text-sm text-stone-500 leading-relaxed border-t border-[var(--border)]">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            READY TO APPLY CTA SECTION
            ══════════════════════════════════════════ */}
        <section className="section-pad px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-[var(--primary-soft)] border border-orange-200 rounded-2xl p-10 md:p-14">
              <h2 className="text-[32px] md:text-[40px] font-black text-stone-900 mb-4">
                Ready to Reserve Your Hostel Room?
              </h2>
              <p className="text-stone-600 text-[16px] max-w-xl mx-auto mb-8 leading-relaxed">
                Join thousands of LPU students who find their ideal accommodation each semester in just a few clicks.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/student/login" className="btn-primary text-[15px] px-8 py-4 rounded-[10px]">
                  Sign in as Student
                </Link>
                <Link href="/admin/login" className="btn-secondary text-[15px] px-8 py-4 rounded-[10px]">
                  Admin Control Panel
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer className="bg-[var(--bg-alt)] border-t border-[var(--border)] py-14 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center font-black text-white text-sm">
                L
              </div>
              <span className="font-bold text-stone-900 text-sm">LPU Hostel Portal</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Official automated hostel allocation and residential roommate matching platform of Lovely Professional University.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-semibold text-stone-800 text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li><Link href="/student/login" className="hover:text-[var(--primary)] transition-colors">Student Login</Link></li>
              <li><Link href="/student/dashboard" className="hover:text-[var(--primary)] transition-colors">Student Dashboard</Link></li>
              <li><Link href="/admin/login" className="hover:text-[var(--primary)] transition-colors">Admin Login</Link></li>
              <li><Link href="/admin/dashboard" className="hover:text-[var(--primary)] transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Hostels */}
          <div>
            <h4 className="font-semibold text-stone-800 text-sm mb-3">Residential Hostels</h4>
            <ul className="space-y-2 text-xs text-stone-500">
              <li>Boys Hostels: BH1 to BH9 (9 Blocks)</li>
              <li>Girls Hostels: GH1 to GH3 (3 Blocks)</li>
              <li>Single, Double, Triple, Quad Rooms</li>
              <li>AC and Non-AC Options</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-stone-800 text-sm mb-3">Campus Help Desk</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Lovely Professional University<br />
              Jalandhar-Delhi G.T. Road, Phagwara,<br />
              Punjab 144411<br />
              Email:{" "}
              <a href="mailto:hostel@lpu.co.in" className="text-[var(--primary)] hover:underline">
                hostel@lpu.co.in
              </a>
              <br />
              Helpline: +91 1824 517000
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 Lovely Professional University. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-stone-600 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-stone-600 transition-colors">Hostel Code of Conduct</span>
            <span className="cursor-pointer hover:text-stone-600 transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
