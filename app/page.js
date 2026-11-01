"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LpuLogo from "./components/LpuLogo";
import HostelAiBot from "./components/HostelAiBot";
import {
  BuildingIcon,
  BedIcon,
  DoorIcon,
  UsersIcon,
  ShieldIcon,
  ScaleIcon,
  WindIcon,
  FileTextIcon,
  WifiIcon,
  UtensilsIcon,
  ActivityIcon,
  SparklesIcon,
  SearchIcon,
  CheckIcon,
  ChevronRightIcon,
} from "./components/Icons";

// ── Fallback 12 LPU Hostel Blocks ──
const INITIAL_HOSTELS = [
  { _id: "h1", code: "BH-1", name: "Boys Hostel 1", genderAllowed: "Male", campusLocation: "West Residential Zone", totalBeds: 360, availableBeds: 84, floors: 9, acAvailable: true, roomTypes: ["Double", "Triple"] },
  { _id: "h2", code: "BH-2", name: "Boys Hostel 2", genderAllowed: "Male", campusLocation: "West Residential Zone", totalBeds: 360, availableBeds: 42, floors: 9, acAvailable: true, roomTypes: ["Single", "Double"] },
  { _id: "h3", code: "BH-3", name: "Boys Hostel 3", genderAllowed: "Male", campusLocation: "North Residential Quadrant", totalBeds: 400, availableBeds: 110, floors: 10, acAvailable: false, roomTypes: ["Triple", "Quad"] },
  { _id: "h4", code: "BH-4", name: "Boys Hostel 4", genderAllowed: "Male", campusLocation: "West Residential Zone", totalBeds: 380, availableBeds: 65, floors: 9, acAvailable: true, roomTypes: ["Single", "Double"] },
  { _id: "h5", code: "BH-5", name: "Boys Hostel 5", genderAllowed: "Male", campusLocation: "West Residential Zone", totalBeds: 360, availableBeds: 92, floors: 9, acAvailable: true, roomTypes: ["Double", "Triple"] },
  { _id: "h6", code: "BH-6", name: "Boys Hostel 6", genderAllowed: "Male", campusLocation: "North Residential Quadrant", totalBeds: 360, availableBeds: 78, floors: 9, acAvailable: false, roomTypes: ["Triple", "Quad"] },
  { _id: "h7", code: "BH-7", name: "Boys Hostel 7", genderAllowed: "Male", campusLocation: "West Residential Zone", totalBeds: 380, availableBeds: 50, floors: 9, acAvailable: true, roomTypes: ["Single", "Double"] },
  { _id: "h8", code: "BH-8", name: "Boys Hostel 8", genderAllowed: "Male", campusLocation: "North Residential Quadrant", totalBeds: 360, availableBeds: 115, floors: 9, acAvailable: false, roomTypes: ["Double", "Triple"] },
  { _id: "h9", code: "BH-9", name: "Boys Hostel 9", genderAllowed: "Male", campusLocation: "West Residential Zone", totalBeds: 420, availableBeds: 80, floors: 10, acAvailable: true, roomTypes: ["Double", "Quad"] },
  { _id: "h10", code: "GH-1", name: "Girls Hostel 1", genderAllowed: "Female", campusLocation: "East Residential Quadrant", totalBeds: 360, availableBeds: 60, floors: 9, acAvailable: true, roomTypes: ["Single", "Double"] },
  { _id: "h11", code: "GH-2", name: "Girls Hostel 2", genderAllowed: "Female", campusLocation: "East Residential Quadrant", totalBeds: 380, availableBeds: 74, floors: 9, acAvailable: true, roomTypes: ["Double", "Triple"] },
  { _id: "h12", code: "GH-3", name: "Girls Hostel 3", genderAllowed: "Female", campusLocation: "East Residential Quadrant", totalBeds: 400, availableBeds: 95, floors: 10, acAvailable: true, roomTypes: ["Triple", "Quad"] },
];

// ── Campus Facilities (Vector Architecture - Zero AI Images) ──
const CAMPUS_FACILITIES = [
  {
    title: "Boys Residential Towers",
    code: "BH 1 - BH 9",
    desc: "9 multi-storey residential blocks with high-speed elevators, reading rooms, indoor gymnasiums, and sports arenas.",
    badge: "Boys Hostels",
    tag: "9 Blocks Configured",
  },
  {
    title: "Girls Residential Complexes",
    code: "GH 1 - GH 3",
    desc: "Gated residential enclave with multi-tier biometric access, round-the-clock female wardens, in-house salon, and cafeteria.",
    badge: "Girls Hostels",
    tag: "Dedicated Security",
  },
  {
    title: "Climate-Controlled AC Suites",
    code: "Single & Double",
    desc: "Equipped with split inverter cooling units, 24/7 dedicated heavy-load diesel power backup, and study stations.",
    badge: "AC Suites",
    tag: "Continuous Backup",
  },
  {
    title: "Central Dining Commons",
    code: "Mess 1 to 4",
    desc: "FSSAI-certified hygienic campus dining serving 4 balanced meals daily with dedicated pure vegetarian and Jain counters.",
    badge: "Dining & Mess",
    tag: "4 Meals Daily",
  },
  {
    title: "Sports & Fitness Arenas",
    code: "Gym & Sports",
    desc: "Multi-station ground floor gymnasiums, floodlit outdoor badminton, basketball courts, and table tennis arenas.",
    badge: "Fitness Complex",
    tag: "Indoor & Outdoor",
  },
  {
    title: "Quiet Study Pods & Library",
    code: "Study Hub",
    desc: "Soundproof academic study lounges with high-speed fiber connectivity, power charging docks, and digital catalog access.",
    badge: "Academic Pods",
    tag: "High-Speed Wi-Fi",
  },
];

// ── FAQ data (Zero Price Mentions) ──
const FAQS = [
  {
    q: "How does the hostel allocation policy operate?",
    a: "Allocations are computed dynamically based on a student's preference list, verified CGPA merit score, and timestamp of application. High-CGPA students receive earliest priority for single and double room preferences.",
  },
  {
    q: "Can I choose my specific roommate or friend group?",
    a: "Yes! In the student portal, select 'Book with Friends' and specify your preferred roommate's university registration number. When both students enter matching registration numbers, our algorithm automatically places you in the same room.",
  },
  {
    q: "What is the difference between AC and Non-AC room configurations?",
    a: "AC rooms are equipped with split inverter air conditioners, remote climate control regulation, and dedicated heavy-load power backup. Non-AC rooms provide energy-efficient ceiling fans and wide cross-ventilation windows.",
  },
  {
    q: "What accommodations are provided for medical or PwD students?",
    a: "Ground-floor accessible rooms equipped with ramp accessibility, wider door frames, and attached barrier-free washrooms are prioritized for PwD applicants and students with approved medical requirements.",
  },
  {
    q: "What documents and items are needed on check-in day?",
    a: "Students should bring their digital hostel allotment slip downloaded from the portal, university ID card or provisional admission slip, government photo ID (Aadhaar or Passport), and personal bedding essentials.",
  },
  {
    q: "Can I submit multiple hostel preferences?",
    a: "Yes. Students can rank their preferred hostel blocks (BH 1-9 or GH 1-3) and preferred room configurations (Single, Double, Triple, Quad) in order of choice during the application window.",
  },
];

// ── Policy Features (Pure Vector Icons - Zero Color Emojis) ──
const FEATURES = [
  {
    icon: ScaleIcon,
    title: "Merit-Based Allocation Engine",
    desc: "Transparent room allotment computed directly from academic CGPA and verified application timestamps.",
  },
  {
    icon: UsersIcon,
    title: "Intelligent Roommate Matcher",
    desc: "Pair with compatible study partners based on program of study, sleep schedules, and lifestyle preferences.",
  },
  {
    icon: WindIcon,
    title: "Flexible AC & Bed Configurations",
    desc: "Select single, double, triple, or quad-sharing configurations with guaranteed power backup.",
  },
  {
    icon: ShieldIcon,
    title: "Biometric Campus Safety",
    desc: "24/7 campus security, automated turnstiles with facial recognition, and dedicated resident hostel wardens.",
  },
  {
    icon: FileTextIcon,
    title: "Instant Digital Allotment Slip",
    desc: "Receive an immediate digital allotment document with room number, block allocation, and gate clearance.",
  },
  {
    icon: WifiIcon,
    title: "High-Speed University Fiber",
    desc: "Uncapped high-speed university Wi-Fi network throughout all residential towers and quiet study pods.",
  },
];

// ── Amenity tab data (Unified Theme - Zero Color Emojis) ──
const AMENITY_TABS = {
  rooms: [
    { title: "Split Climate Control", desc: "Energy-efficient split air conditioners with scheduled university maintenance and remote climate regulation." },
    { title: "Ergonomic Study Station", desc: "Dedicated wooden study desk, ergonomic chair, personal steel almirah, bookshelf, and orthopedic mattress." },
    { title: "Housekeeping & Sanitization", desc: "Daily cleaning of common corridors, sanitized washrooms, and mechanized automated laundry pick-up." },
  ],
  dining: [
    { title: "4 Balanced Daily Meals", desc: "Fresh breakfast, hot lunch, evening high-tea with snacks, and wholesome dinner planned by certified nutritionists." },
    { title: "Separate Pure Veg & Jain Counters", desc: "Dedicated Pure Vegetarian and Jain meal sections alongside standard north and south Indian campus menus." },
    { title: "Night Study Canteens", desc: "Hostel floor tuck-shops and night cafeterias open till 1:00 AM during examination schedules." },
  ],
  sports: [
    { title: "Indoor Multi-Station Gyms", desc: "Modern fitness equipment, cardio machines, and free weights on the ground floor of every residential block." },
    { title: "Badminton & Table Tennis", desc: "Floodlit outdoor badminton courts and indoor table tennis arenas in the central residential recreation hall." },
    { title: "Yoga & Wellness Lawns", desc: "Quiet open lawns and terrace spaces reserved for morning yoga sessions and fitness activities." },
  ],
  safety: [
    { title: "Biometric Turnstile Entry", desc: "Facial recognition and fingerprint verification at all entry points ensuring zero unauthorized entry." },
    { title: "24/7 University Hospital", desc: "Full-fledged on-campus hospital with resident doctors, round-the-clock pharmacy, and ambulance service." },
    { title: "Resident Female Warden Care", desc: "Senior resident female wardens, professional counselors, and dedicated security across all GH blocks." },
  ],
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const [stats, setStats] = useState({
    totalHostels: 12,
    totalRooms: 1080,
    totalBeds: 4320,
    totalApplications: 148,
  });

  const [hostels, setHostels] = useState(INITIAL_HOSTELS);
  const [filterGender, setFilterGender] = useState("All");
  const [filterAcOnly, setFilterAcOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeAmenityTab, setActiveAmenityTab] = useState("rooms");

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch live stats & hostels with graceful fallback
  useEffect(() => {
    fetch("http://localhost:5000/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) setStats(d.data);
      })
      .catch(() => {});

    fetch("http://localhost:5000/api/hostels")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length > 0) {
          setHostels(d.data);
        }
      })
      .catch(() => {});
  }, []);

  // Filter hostels based on gender, search, and AC options
  const filteredHostels = hostels.filter((h) => {
    const matchesGender = filterGender === "All" ? true : h.genderAllowed === filterGender;
    const matchesAc = filterAcOnly ? h.acAvailable : true;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      h.name?.toLowerCase().includes(q) ||
      h.code?.toLowerCase().includes(q) ||
      h.campusLocation?.toLowerCase().includes(q);
    return matchesGender && matchesAc && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-stone-900 selection:bg-[var(--primary)] selection:text-white">
      {/* ══════════════════════════════════════════
          STICKY NAVBAR (Full Width & Clean)
          ══════════════════════════════════════════ */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200" : "bg-white border-b border-stone-200"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo with 100% Reliable Scalable SVG */}
          <Link href="/" className="flex items-center gap-2 group">
            <LpuLogo size={42} showText={true} subtitle="Hostel Allocation Portal" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-semibold text-stone-600">
            <a href="#hostels" className="hover:text-[var(--primary)] transition-colors">
              Hostel Blocks
            </a>
            <a href="#facilities" className="hover:text-[var(--primary)] transition-colors">
              Campus Facilities
            </a>
            <a href="#policy" className="hover:text-[var(--primary)] transition-colors">
              Allocation Policy
            </a>
            <a href="#amenities" className="hover:text-[var(--primary)] transition-colors">
              Amenities
            </a>
            <a href="#faqs" className="hover:text-[var(--primary)] transition-colors">
              FAQs
            </a>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/student/login"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-sm shadow-sm transition-all"
            >
              <span>Student Portal</span>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-700 font-semibold text-sm transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full">
        {/* ══════════════════════════════════════════
            HERO SECTION (Clean, Expansive, Vector Design)
            ══════════════════════════════════════════ */}
        <section className="relative w-full pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-stone-50/60 border-b border-stone-200">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)] pointer-events-none" />

          <div
            className={`relative z-10 w-full max-w-7xl mx-auto text-center transition-all duration-700 ${
              heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-stone-800 text-xs font-semibold mb-6 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              <span>Official Residential Portal · Academic Session 2026-27</span>
              <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px] text-[var(--primary-dark)] font-bold">
                Merit Driven
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6">
              Smart Hostel Allocation &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)]">
                Roommate Matching
              </span>
            </h1>

            {/* Clear Subtitle (No Price Mention) */}
            <p className="text-base sm:text-lg lg:text-xl text-stone-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              Experience seamless residential life at Lovely Professional University. Explore{" "}
              <strong className="text-stone-900 font-semibold">12 official hostel blocks</strong>, submit room configurations,
              and pair with mutual roommates through our automated merit policy engine.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
              <Link
                href="/student/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-bold text-base shadow-md hover:shadow-lg transition-all"
              >
                <span>Apply for Room Allocation</span>
                <ChevronRightIcon className="w-5 h-5" />
              </Link>
              <a
                href="#hostels"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-stone-300 hover:border-stone-400 text-stone-800 font-semibold text-base shadow-2xs hover:bg-stone-50 transition-all"
              >
                <BuildingIcon className="w-5 h-5 text-stone-500" />
                <span>Explore 12 Hostels</span>
              </a>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-base transition-colors"
              >
                <ShieldIcon className="w-5 h-5 text-stone-500" />
                <span>Chief Warden Office</span>
              </Link>
            </div>

            {/* Cohesive Metric Cards (Unified Theme - Zero Color Emojis, Zero Blue/Red/Green Icons) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                {
                  icon: BuildingIcon,
                  value: `${stats.totalHostels || 12} Towers`,
                  label: "Residential Blocks",
                  detail: "BH 1-9 & GH 1-3",
                },
                {
                  icon: BedIcon,
                  value: `${(stats.totalBeds || 4320).toLocaleString()}+`,
                  label: "Total Bed Capacity",
                  detail: "Single to Quad Sharing",
                },
                {
                  icon: UsersIcon,
                  value: "Mutual Pairing",
                  label: "Roommate Matching",
                  detail: "Book With Friends",
                },
                {
                  icon: ScaleIcon,
                  value: "CGPA Merit",
                  label: "Allocation Engine",
                  detail: "100% Policy Compliant",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 rounded-2xl p-5 text-left shadow-2xs hover:border-[var(--primary)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--primary)] mb-3 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold text-stone-700 mt-1">{stat.label}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS FACILITIES (Pure Architectural Vectors - Zero AI Images)
            ══════════════════════════════════════════ */}
        <section id="facilities" className="w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-stone-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                  Campus Living Architecture
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                  LPU Residential Infrastructure
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md">
                Modern university living designed with safety, comfort, academic focus, and balanced nutrition.
              </p>
            </div>

            {/* Facility Blueprint Cards (Vector Architecture) */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAMPUS_FACILITIES.map((facility, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-[var(--primary-dark)] border border-orange-100">
                        {facility.badge}
                      </span>
                      <span className="text-xs font-medium text-stone-400">{facility.code}</span>
                    </div>

                    <h3 className="font-bold text-lg text-stone-900 mb-2">{facility.title}</h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">{facility.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
                    <span className="inline-flex items-center gap-1.5 text-stone-700">
                      <CheckIcon className="w-3.5 h-3.5 text-[var(--primary)]" />
                      {facility.tag}
                    </span>
                    <span className="text-[var(--primary)] font-bold">Standard Spec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HOSTEL CARDS GRID (Full Width & Rich Features)
            ══════════════════════════════════════════ */}
        <section id="hostels" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header + Search + Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Official Blocks
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Hostels Available for Allocation
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
                Browse official residential blocks. Filter by gender wing, AC configuration, or search by block code.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="relative min-w-[200px] flex-1 sm:flex-initial">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search block (e.g. BH-1)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-[var(--primary)] transition-all"
                />
              </div>

              {/* Gender Segmented Filter */}
              <div className="inline-flex p-1 rounded-xl bg-stone-100 border border-stone-200">
                {["All", "Male", "Female"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterGender(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterGender === tab
                        ? "bg-white text-stone-900 shadow-2xs"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    {tab === "All" ? "All (12)" : tab === "Male" ? "Boys (BH)" : "Girls (GH)"}
                  </button>
                ))}
              </div>

              {/* AC Toggle */}
              <button
                onClick={() => setFilterAcOnly(!filterAcOnly)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterAcOnly
                    ? "bg-orange-50 border-[var(--primary)] text-[var(--primary-dark)]"
                    : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                }`}
              >
                {filterAcOnly ? "✓ AC Only" : "+ AC Only"}
              </button>
            </div>
          </div>

          {/* Hostels Grid (Pure Vector Blueprint Header - Zero AI Images) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHostels.map((h) => {
              const totalBeds = h.totalBeds || 360;
              const availBeds = h.availableBeds || 80;
              const occPercent = Math.min(100, Math.round(((totalBeds - availBeds) / totalBeds) * 100));

              return (
                <div
                  key={h._id || h.code}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg hover:border-orange-300 transition-all flex flex-col group"
                >
                  {/* Vector Blueprint Block Header */}
                  <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-5 text-white relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold tracking-wider">
                        <BuildingIcon className="w-3.5 h-3.5 text-orange-400" />
                        <span>{h.code}</span>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-stone-900">
                        {h.genderAllowed === "Female" ? "Girls Wing" : "Boys Wing"}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-tight mb-1">{h.name ? h.name.replace(/\s*\([^)]*\)/g, "") : h.code}</h3>
                    <p className="text-xs text-stone-300">{h.campusLocation || "Main University Campus"}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-semibold text-stone-300">
                      <span className="px-2 py-0.5 rounded bg-white/10">{h.floors || 9} Floors</span>
                      <span className="px-2 py-0.5 rounded bg-white/10">Elevator Service</span>
                      {h.acAvailable && (
                        <span className="px-2 py-0.5 rounded bg-orange-500/30 text-orange-200 border border-orange-400/30">
                          AC Units Available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    {/* Vacancy Progress */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-stone-500">Live Vacancy Status</span>
                        <span className="text-emerald-600 font-bold">{availBeds} Beds Vacant</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-[var(--primary)] rounded-full transition-all duration-500"
                          style={{ width: `${occPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-stone-400 mt-1 font-medium">
                        <span>{occPercent}% Occupied</span>
                        <span>{totalBeds} Total Beds</span>
                      </div>
                    </div>

                    {/* Room Configurations Available */}
                    <div className="mb-5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                        Supported Room Types
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(h.roomTypes || ["Double", "Triple"]).map((type, idx) => (
                          <span
                            key={idx}
                            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700"
                          >
                            {type} Seater
                          </span>
                        ))}
                        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                          Wi-Fi
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      href="/student/login"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-xs font-bold transition-all shadow-2xs"
                    >
                      <span>Apply For {h.code}</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredHostels.length === 0 && (
            <div className="text-center py-16 bg-stone-50 border border-stone-200 rounded-2xl">
              <BuildingIcon className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h3 className="font-bold text-stone-800 text-base">No Hostels Match Your Criteria</h3>
              <p className="text-xs text-stone-500 mt-1">Try resetting the filters or clearing the search query.</p>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════
            POLICY FEATURES SECTION (Vector Icons - Zero Emojis)
            ══════════════════════════════════════════ */}
        <section id="policy" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-stone-50 border-t border-b border-stone-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Policy-Driven Engine
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Transparent Allocation Architecture
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Automated algorithmic allocation for Lovely Professional University to ensure 100% fair, transparent, and merit-compliant allotments.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:border-[var(--primary)] transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[var(--primary)] mb-4 group-hover:bg-[var(--primary)] group-hover:text-white transition-all">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-base mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CAMPUS LIVING / AMENITIES TABS (Unified Theme - Zero Color Emojis)
            ══════════════════════════════════════════ */}
        <section id="amenities" className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-2xs">
            <div className="text-center max-w-xl mx-auto mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Residential Standards
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Campus Living &amp; Infrastructure
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Verified specifications guaranteed across all 12 residential towers.
              </p>
            </div>

            {/* Tab Controls */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: "rooms", label: "Rooms & Climate", icon: BedIcon },
                { id: "dining", label: "Dining & Nutrition", icon: UtensilsIcon },
                { id: "sports", label: "Fitness & Recreation", icon: ActivityIcon },
                { id: "safety", label: "Safety & Medical", icon: ShieldIcon },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveAmenityTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    activeAmenityTab === t.id
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                      : "bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {(AMENITY_TABS[activeAmenityTab] || []).map((item, i) => (
                <div
                  key={i}
                  className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm mb-2">{item.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--primary-dark)]">
                    <CheckIcon className="w-3.5 h-3.5" />
                    <span>Included in Residence</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FAQ ACCORDION (Zero Price Mentions)
            ══════════════════════════════════════════ */}
        <section id="faqs" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-stone-50 border-t border-stone-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
                Common Queries
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Frequently Asked Questions
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                Official guidance on room preference submission, merit priority, and roommate pairing.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-orange-50/50 transition-colors"
                  >
                    <span className="font-bold text-stone-800 text-sm sm:text-base">{faq.q}</span>
                    <span
                      className="text-stone-400 font-bold text-lg flex-shrink-0 transition-transform duration-200"
                      style={{ transform: activeFaq === idx ? "rotate(45deg)" : "rotate(0)" }}
                    >
                      +
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CALL TO ACTION BANNER
            ══════════════════════════════════════════ */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500 to-[var(--primary-dark)] text-white rounded-3xl p-8 sm:p-14 shadow-lg">
            <h2 className="text-2xl sm:text-4xl font-black mb-3">
              Ready to Reserve Your Hostel Room?
            </h2>
            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
              Log in with your university registration credentials to configure your preferred block, roommate preferences, and receive your digital allotment slip.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/student/login"
                className="px-8 py-3.5 rounded-xl bg-white text-[var(--primary-dark)] font-bold text-sm shadow-md hover:bg-stone-50 transition-all"
              >
                Sign In as Student
              </Link>
              <Link
                href="/admin/login"
                className="px-7 py-3.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-semibold text-sm border border-white/20 transition-all"
              >
                Warden Administration
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════
          FOOTER (With Scalable Logo & Contact Specs)
          ══════════════════════════════════════════ */}
      <footer className="w-full bg-stone-900 text-stone-400 border-t border-stone-800 py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <LpuLogo size={38} showText={true} subtitle="Residential Portal" />
            <p className="text-xs text-stone-400 leading-relaxed pt-2">
              Automated hostel allocation, preference processing, and roommate matching system for Lovely Professional University.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/student/login" className="hover:text-white transition-colors">
                  Student Login
                </Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Warden Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Residential Blocks */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Campus Residences</h4>
            <ul className="space-y-2 text-xs">
              <li>Boys Hostels: BH-1 to BH-9 (9 Blocks)</li>
              <li>Girls Hostels: GH-1 to GH-3 (3 Blocks)</li>
              <li>Room Configs: Single, Double, Triple, Quad</li>
              <li>Split AC &amp; Regular Suites</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Help Desk</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Lovely Professional University<br />
              Jalandhar-Delhi G.T. Road, Phagwara, Punjab 144411<br />
              Email:{" "}
              <a href="mailto:hostel@lpu.co.in" className="text-orange-400 hover:underline">
                hostel@lpu.co.in
              </a>
              <br />
              Helpline: +91 1824 517000
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 Lovely Professional University. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Hostel Regulations</span>
            <span className="hover:text-stone-300 cursor-pointer transition-colors">Terms of Accommodation</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════
          AI BOT COMPONENT (Interactive General Queries)
          ══════════════════════════════════════════ */}
      <HostelAiBot />
    </div>
  );
}
