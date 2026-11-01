"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Campus & Hostel Showcase Slides ──
const CAMPUS_SLIDES = [
  {
    title: "Boys Hostel Block (BH 1-9)",
    desc: "Modern 9-storey towers with elevators, reading halls & gyms",
    tag: "Boys Hostels",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  },
  {
    title: "Girls Hostel Wing (GH 1-3)",
    desc: "High-security residential complexes with in-house salon & dining",
    tag: "Girls Hostels",
    img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
  },
  {
    title: "Air-Conditioned Premium Suites",
    desc: "Climate-controlled rooms with personal study desks & storage",
    tag: "AC Suites",
    img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
  },
  {
    title: "Multicuisine Campus Dining",
    desc: "Nutritious multi-cuisine meal plans serving fresh 4 times a day",
    tag: "Mess & Dining",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  },
  {
    title: "Recreation & Gymnasium",
    desc: "Indoor sports, table tennis, badminton & 24/7 fitness centers",
    tag: "Sports Complex",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  },
  {
    title: "Central Library & Study Pods",
    desc: "Soundproof study zones and high-speed fiber internet coverage",
    tag: "Study Pods",
    img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80",
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
  const [heroLoaded, setHeroLoaded] = useState(false);

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
  
  // Enhanced animation trigger
  useEffect(() => {
    setTimeout(() => setHeroLoaded(true), 100);
  }, []);

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
            <img 
              src="/logos/lpu-logo.svg" 
              alt="LPU Logo" 
              className="h-9 w-9 group-hover:scale-105 transition-transform"
            />
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
        {/* ══════════════════════════════════════════
            HERO SECTION WITH VIDEO BACKGROUND
            ══════════════════════════════════════════ */}
        <section className="relative pt-20 pb-24 px-6 text-center overflow-hidden min-h-[85vh] flex items-center">
          {/* Video Background */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            >
              <source src="/videos/lpu_hostel_facilities_face_free.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/95" />
          </div>
          
          {/* Enhanced gradient background */}
          <div className="hero-glow" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(234,88,12,0.08),transparent_50%)]" />

          <div className={`relative z-10 max-w-[1200px] mx-auto w-full transition-all duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {/* Enhanced pill badge */}
            <div className="inline-flex items-center gap-2 badge-gradient mb-6 fade-up hover:scale-105 transition-transform cursor-default shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
              LPU Smart Allocation System
              <span className="text-[10px] ml-1 px-2 py-0.5 rounded-full bg-white/30">AI-Powered</span>
            </div>

            {/* Enhanced H1 with gradient text */}
            <h1 className="text-5xl md:text-[64px] font-black leading-[1.05] tracking-tight text-stone-900 max-w-4xl mx-auto mb-6 fade-up delay-1">
              Your Perfect{" "}
              <span className="gradient-text">Hostel Home</span>
              <br />
              Awaits at LPU
            </h1>

            <p className="text-[18px] md:text-[20px] text-stone-600 max-w-2xl mx-auto mb-12 leading-[1.7] fade-up delay-2 font-medium">
              Experience world-class accommodation with <strong className="text-[var(--primary)]">AI-powered roommate matching</strong>, 
              preference-based allocation, and <strong className="text-[var(--primary)]">book rooms with friends</strong> feature.
            </p>

            {/* Enhanced CTA buttons */}
            <div className="flex flex-wrap items-center justify-center gap-5 mb-14 fade-up delay-3">
              <Link href="/student/login" className="btn-primary ripple text-[16px] px-9 py-4 rounded-[12px] transform hover:scale-105 transition-all shadow-2xl">
                🎓 Book Your Room Now →
              </Link>
              <a href="#hostels" className="btn-secondary text-[16px] px-9 py-4 rounded-[12px] transform hover:scale-105 transition-all">
                🏢 Explore Hostels
              </a>
              <Link href="/admin/login" className="glass-card text-[16px] px-9 py-4 rounded-[12px] transform hover:scale-105 transition-all font-bold text-stone-700 hover:text-[var(--primary)]">
                🔐 Admin Portal
              </Link>
            </div>

            {/* Enhanced stat chips with animations */}
            <div className="flex flex-wrap items-center justify-center gap-4 fade-up delay-4">
              {[
                { icon: "🏢", label: `${stats.totalHostels || 12} Hostels`, desc: "BH1-9 & GH1-3", color: "bg-blue-50 border-blue-200" },
                { icon: "🛏️", label: `${(stats.totalBeds || 4320).toLocaleString()}+ Beds`, desc: "Total capacity", color: "bg-green-50 border-green-200" },
                { icon: "🚪", label: `${(stats.totalRooms || 1080).toLocaleString()} Rooms`, desc: "AC & Non-AC", color: "bg-purple-50 border-purple-200" },
                { icon: "🤝", label: "Friend Booking", desc: "Book together", color: "bg-orange-50 border-orange-200" },
                { icon: "🛡️", label: "24/7 Security", desc: "Biometric access", color: "bg-red-50 border-red-200" },
              ].map((s, i) => (
                <div key={i} className={`stat-chip group hover:scale-110 hover:shadow-xl transition-all cursor-default ${s.color} border px-5 py-3`} title={s.desc}>
                  <span className="group-hover:scale-125 transition-transform inline-block text-xl">{s.icon}</span>
                  <div className="flex flex-col items-start ml-2">
                    <span className="font-bold text-sm">{s.label}</span>
                    <span className="text-[10px] text-stone-500">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            INTERACTIVE FEATURES SHOWCASE
            ══════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-gradient-to-br from-orange-50 via-white to-blue-50">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 badge-gradient mb-4 px-6 py-2">
                ✨ Revolutionary Features
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-stone-900 mb-4">
                Why Choose <span className="gradient-text">LPU Hostels</span>?
              </h2>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                Experience next-generation hostel living with AI-powered features and world-class amenities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  icon: "🤝",
                  title: "Book with Friends",
                  desc: "Form your perfect squad! Book rooms together with up to 3 friends",
                  color: "from-orange-500 to-red-500",
                  image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
                },
                {
                  icon: "🎯",
                  title: "Smart Preferences",
                  desc: "Choose your floor, quiet zones, AC type, and study-focused rooms",
                  color: "from-blue-500 to-purple-500",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80"
                },
                {
                  icon: "🤖",
                  title: "AI Allocation",
                  desc: "Advanced algorithm matches you with compatible roommates",
                  color: "from-green-500 to-teal-500",
                  image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80"
                },
                {
                  icon: "⚡",
                  title: "Instant Booking",
                  desc: "Get confirmed in minutes with real-time availability updates",
                  color: "from-yellow-500 to-orange-500",
                  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
                },
              ].map((feature, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  {/* Background Image */}
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative p-8">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-xl text-stone-900 mb-2">{feature.title}</h3>
                    <p className="text-stone-600 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                  
                  {/* Gradient Border on Hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${feature.color} blur-xl -z-10`} />
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-12 text-center">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCw0LTRzNCwyIDQgNGMwIDItMiA0LTQgNHMtNC0yLTQtNHptMTAgMTBjMC0yIDItNCA0LTRzNCwyIDQgNGMwIDItMiA0LTQgNHMtNC0yLTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                  🎉 Limited Seats Available!
                </h3>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  Over <strong>1,200 students</strong> have already booked their rooms. Don't miss out on your perfect hostel home!
                </p>
                <Link href="/student/login" className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transform transition-all shadow-xl">
                  Book Your Room Now 🚀
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS FACILITIES GALLERY
            ══════════════════════════════════════════ */}
        <section id="campus" className="py-16 border-t border-b border-[var(--border)] overflow-hidden bg-gradient-to-b from-[var(--bg-alt)] to-white">
          <div className="max-w-[1200px] mx-auto px-6 mb-8 flex items-end justify-between">
            <div>
              <p className="section-label mb-1">Campus Facilities</p>
              <h2 className="text-[32px] font-bold text-stone-900">🏛️ LPU Residential Experience</h2>
            </div>
            <span className="text-xs text-stone-400 hidden sm:block">↔ Hover to pause · Auto-scroll</span>
          </div>

          {/* Auto-scrolling strip with enhanced cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-hidden select-none py-2 px-6 hide-scrollbar"
            onMouseEnter={() => (isHoveringScroll.current = true)}
            onMouseLeave={() => (isHoveringScroll.current = false)}
            style={{ cursor: "grab" }}
          >
            {[...CAMPUS_SLIDES, ...CAMPUS_SLIDES].map((slide, idx) => (
              <div
                key={idx}
                className="image-zoom-container relative flex-shrink-0 w-72 md:w-80 h-52 rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl border border-[var(--border)] transition-all"
              >
                {/* Image with zoom effect */}
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="image-zoom w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/800x600/f97316/white?text=" + slide.tag;
                  }}
                />
                
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all" />

                {/* Orange pill tag with glow */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[var(--primary)] text-white shadow-lg glow-border">
                    {slide.tag}
                  </span>
                </div>

                {/* Enhanced text with better readability */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-white text-base leading-tight mb-1 drop-shadow-lg">{slide.title}</h3>
                  <p className="text-[12px] text-white/90 line-clamp-2 drop-shadow-md">{slide.desc}</p>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <span className="text-white text-2xl">👁️</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            LIVE STATS COUNTER
            ══════════════════════════════════════════ */}
        <section className="py-16 px-6 bg-gradient-to-r from-[var(--primary)] to-orange-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-[1200px] mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-3">LPU Hostel Stats 2026</h2>
              <p className="text-white/90">Real-time accommodation statistics</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: stats.totalHostels || 12, label: "Active Hostels", suffix: "", icon: "🏢" },
                { number: stats.totalRooms || 1080, label: "Total Rooms", suffix: "", icon: "🚪" },
                { number: stats.totalBeds || 4320, label: "Bed Capacity", suffix: "+", icon: "🛏️" },
                { number: 98, label: "Satisfaction", suffix: "%", icon: "😊" },
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="text-5xl mb-2 group-hover:scale-125 transition-transform">
                    {stat.icon}
                  </div>
                  <div className="text-5xl md:text-6xl font-black mb-2 count-up">
                    {stat.number.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-white/80 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
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
            {filteredHostels.map((h, idx) => {
              const totalBeds = h.totalBeds || h.totalCapacity || 360;
              const availBeds = h.availableBeds || h.availableCapacity || 100;
              const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));
              const isPopular = occPercent > 70;

              return (
                <div key={h._id} className="card-glow flex flex-col overflow-hidden transform transition-all hover:scale-[1.02]" style={{ animationDelay: `${idx * 0.05}s` }}>
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={
                        h.genderAllowed === "Female"
                          ? "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
                          : "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                      }
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/800x600/f97316/white?text=" + h.code;
                      }}
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
                    
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[var(--primary)] text-white shadow-lg">
                        🔥 High Demand
                      </div>
                    )}
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

                    {/* Apply button with enhanced styling */}
                    <Link
                      href="/student/login"
                      className="btn-primary ripple w-full text-sm rounded-[10px] mt-auto group-hover:shadow-lg transition-shadow"
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
            STUDENT TESTIMONIALS
            ══════════════════════════════════════════ */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <p className="section-label mb-2">Student Reviews</p>
              <h2 className="text-[32px] font-bold text-stone-900">What Students Say</h2>
              <p className="text-stone-500 text-sm mt-2">Real experiences from LPU hostel residents</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  course: "B.Tech CSE, 3rd Year",
                  hostel: "GH-2",
                  image: "https://i.pravatar.cc/150?img=1",
                  rating: 5,
                  text: "The friend booking feature is amazing! I got to room with my best friends and the smart allocation put us in a quiet zone perfect for studying. Highly recommend! 🎓",
                },
                {
                  name: "Arjun Kumar",
                  course: "MBA, 2nd Year",
                  hostel: "BH-5",
                  image: "https://i.pravatar.cc/150?img=12",
                  rating: 5,
                  text: "AC rooms are top-notch and the preference-based system actually works! Got my first choice hostel and floor. The gym and mess facilities are excellent too! 💪",
                },
                {
                  name: "Neha Patel",
                  course: "B.Com, 1st Year",
                  hostel: "GH-1",
                  image: "https://i.pravatar.cc/150?img=5",
                  rating: 5,
                  text: "As a first-year student, I was nervous about hostel life. But LPU's system made booking so easy! The security is great and wardens are very supportive. 🏠",
                },
              ].map((review, i) => (
                <div key={i} className="card-glow p-6 stagger-item hover:shadow-2xl transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[var(--primary)]"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900">{review.name}</h4>
                      <p className="text-xs text-stone-500">{review.course}</p>
                      <p className="text-xs text-[var(--primary)] font-semibold">{review.hostel}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-lg">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-stone-600 leading-relaxed italic">"{review.text}"</p>
                </div>
              ))}
            </div>
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
                <div key={i} className="card-glow p-6 group hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
                  {/* Icon box with enhanced hover effect */}
                  <div className="icon-box mb-4 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-300">
                    <span className="inline-block group-hover:rotate-12 transition-transform">{f.icon}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-[15px] mb-2 group-hover:text-[var(--primary)] transition-colors">{f.title}</h3>
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

      {/* ══════════════════════════════════════════
          FLOATING ACTION BUTTON
          ══════════════════════════════════════════ */}
      <Link href="/student/login" className="fab group" title="Quick Book">
        <span className="text-2xl group-hover:rotate-12 transition-transform">🎓</span>
      </Link>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-stone-800 text-white flex items-center justify-center shadow-lg hover:bg-stone-700 transition-all hover:scale-110 z-50"
        title="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}
