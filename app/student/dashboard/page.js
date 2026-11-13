"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

const STATIC_HOSTELS = [
  { _id: "h1",  code: "BH-1", name: "Boys Hostel 1",  genderAllowed: "Male",   campusLocation: "West Residential Zone",      totalBeds: 360, availableBeds: 84,  floors: 9,  acAvailable: true,  roomTypes: ["Double", "Triple"], imageUrl: "/images/lpu/boys-hostel.webp",       roomImageUrl: "/images/lpu/boys-hostel-room.webp" },
  { _id: "h2",  code: "BH-2", name: "Boys Hostel 2",  genderAllowed: "Male",   campusLocation: "West Residential Zone",      totalBeds: 360, availableBeds: 42,  floors: 9,  acAvailable: true,  roomTypes: ["Single", "Double"], imageUrl: "/images/lpu/hero-banner.webp",       roomImageUrl: "/images/lpu/apartments-room-1.webp" },
  { _id: "h3",  code: "BH-3", name: "Boys Hostel 3",  genderAllowed: "Male",   campusLocation: "North Residential Quadrant", totalBeds: 400, availableBeds: 110, floors: 10, acAvailable: false, roomTypes: ["Triple", "Quad"],   imageUrl: "/images/lpu/slide-3-hostels.webp",   roomImageUrl: "/images/lpu/standard-room-1.webp" },
  { _id: "h4",  code: "BH-4", name: "Boys Hostel 4",  genderAllowed: "Male",   campusLocation: "North Residential Quadrant", totalBeds: 360, availableBeds: 55,  floors: 9,  acAvailable: true,  roomTypes: ["Double", "Triple"], imageUrl: "/images/lpu/hero-banner.webp",       roomImageUrl: "/images/lpu/boys-hostel-room.webp" },
  { _id: "h5",  code: "BH-5", name: "Boys Hostel 5",  genderAllowed: "Male",   campusLocation: "East Residential Block",     totalBeds: 400, availableBeds: 130, floors: 10, acAvailable: false, roomTypes: ["Triple", "Quad"],   imageUrl: "/images/lpu/boys-hostel.webp",       roomImageUrl: "/images/lpu/standard-room-2.webp" },
  { _id: "h6",  code: "BH-6", name: "Boys Hostel 6",  genderAllowed: "Male",   campusLocation: "East Residential Block",     totalBeds: 360, availableBeds: 68,  floors: 9,  acAvailable: true,  roomTypes: ["Single", "Double"], imageUrl: "/images/lpu/slide-3-hostels.webp",   roomImageUrl: "/images/lpu/apartments-room-2.webp" },
  { _id: "h7",  code: "BH-7", name: "Boys Hostel 7",  genderAllowed: "Male",   campusLocation: "South Residential Area",     totalBeds: 400, availableBeds: 95,  floors: 10, acAvailable: true,  roomTypes: ["Double", "Triple"], imageUrl: "/images/lpu/boys-hostel.webp",       roomImageUrl: "/images/lpu/standard-room-3.webp" },
  { _id: "h8",  code: "BH-8", name: "Boys Hostel 8",  genderAllowed: "Male",   campusLocation: "South Residential Area",     totalBeds: 360, availableBeds: 47,  floors: 9,  acAvailable: false, roomTypes: ["Triple", "Quad"],   imageUrl: "/images/lpu/hero-banner.webp",       roomImageUrl: "/images/lpu/standard-room-1.webp" },
  { _id: "h9",  code: "BH-9", name: "Boys Hostel 9",  genderAllowed: "Male",   campusLocation: "Central Residential Hub",    totalBeds: 400, availableBeds: 120, floors: 10, acAvailable: true,  roomTypes: ["Single", "Double"], imageUrl: "/images/lpu/slide-3-hostels.webp",   roomImageUrl: "/images/lpu/apartments-room-3.webp" },
  { _id: "h10", code: "GH-1", name: "Girls Hostel 1", genderAllowed: "Female", campusLocation: "Girls Residential Zone A",   totalBeds: 360, availableBeds: 78,  floors: 9,  acAvailable: true,  roomTypes: ["Double", "Triple"], imageUrl: "/images/lpu/girls-hostel-1.jpg",    roomImageUrl: "/images/lpu/girls-hostel-room.webp" },
  { _id: "h11", code: "GH-2", name: "Girls Hostel 2", genderAllowed: "Female", campusLocation: "Girls Residential Zone B",   totalBeds: 400, availableBeds: 102, floors: 10, acAvailable: true,  roomTypes: ["Single", "Double"], imageUrl: "/images/lpu/girls-hostel.webp",     roomImageUrl: "/images/lpu/slide-1-apartments.webp" },
  { _id: "h12", code: "GH-3", name: "Girls Hostel 3", genderAllowed: "Female", campusLocation: "Girls Residential Zone B",   totalBeds: 360, availableBeds: 56,  floors: 9,  acAvailable: false, roomTypes: ["Triple", "Quad"],   imageUrl: "/images/lpu/girls-hostel-3.jpg",    roomImageUrl: "/images/lpu/apartments-room-1.webp" },
];

const ROOM_CATEGORIES = [
  { id: "r1", label: "AC Double Seater",  type: "Double", ac: true,  desc: "Attached washroom, Wi-Fi, study table", image: "/images/lpu/apartments-room-2.webp" },
  { id: "r2", label: "AC Triple Seater",  type: "Triple", ac: true,  desc: "Attached washroom, Wi-Fi, wardrobe",    image: "/images/lpu/apartments-room-1.webp" },
  { id: "r3", label: "Non-AC Double",     type: "Double", ac: false, desc: "Common washroom, Wi-Fi, study table",   image: "/images/lpu/standard-room-3.webp" },
  { id: "r4", label: "Non-AC Triple",     type: "Triple", ac: false, desc: "Common washroom, Wi-Fi, wardrobe",      image: "/images/lpu/standard-room-1.webp" },
  { id: "r5", label: "AC Single Seater",  type: "Single", ac: true,  desc: "Attached washroom, Wi-Fi, mini kitchenette", image: "/images/lpu/slide-1-apartments.webp" },
  { id: "r6", label: "AC Quad Seater",    type: "Quad",   ac: true,  desc: "Spacious 4-bed suite, Wi-Fi, study desks",  image: "/images/lpu/boys-hostel-room.webp" },
];

const GH_IMAGE_MAP = {
  "GH-1": { imageUrl: "/images/lpu/girls-hostel-1.jpg", roomImageUrl: "/images/lpu/girls-hostel-room.webp" },
  "GH-2": { imageUrl: "/images/lpu/girls-hostel.webp",  roomImageUrl: "/images/lpu/slide-1-apartments.webp" },
  "GH-3": { imageUrl: "/images/lpu/girls-hostel-3.jpg", roomImageUrl: "/images/lpu/apartments-room-1.webp" },
};

function getFallbackImagesForHostel(h) {
  const isFemale = h.genderAllowed === "Female" || (h.code && h.code.startsWith("GH"));
  if (isFemale) {
    const mapped = GH_IMAGE_MAP[h.code];
    if (mapped) return mapped;
    return {
      imageUrl: h.imageUrl && h.imageUrl.startsWith("/images/lpu/") ? h.imageUrl : "/images/lpu/girls-hostel.webp",
      roomImageUrl: h.roomImageUrl || "/images/lpu/girls-hostel-room.webp",
    };
  }
  return {
    imageUrl: h.imageUrl && h.imageUrl.startsWith("/images/lpu/") ? h.imageUrl : "/images/lpu/boys-hostel.webp",
    roomImageUrl: h.roomImageUrl || "/images/lpu/boys-hostel-room.webp",
  };
}

function StatusBadge({ status }) {
  const map = {
    ALLOCATED: "bg-green-100 text-green-700",
    UNDER_REVIEW: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    SUBMITTED: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${map[status] || map.SUBMITTED}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function StudentDashboard() {
  const [allHostels, setAllHostels] = useState(STATIC_HOSTELS);
  const [activeTab, setActiveTab] = useState("book");
  const [bookingMode, setBookingMode] = useState("individual");
  const [studentGender, setStudentGender] = useState("Male");
  const [genderFilter, setGenderFilter] = useState("Male");
  const [search, setSearch] = useState("");
  const [myApplications, setMyApplications] = useState([]);

  // Booking state
  const [selectedCategory, setSelectedCategory] = useState(ROOM_CATEGORIES[0]);
  const [selectedHostel, setSelectedHostel] = useState(STATIC_HOSTELS[0]);
  const [consentGiven, setConsentGiven] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    studentName: "Arjun Sharma",
    studentRollNumber: "12304567",
    studentEmail: "arjun.sharma@student.lpu.co.in",
    department: "Computer Science",
    year: "2",
    gender: "Male",
    cgpa: "8.5",
    specialAccommodations: "",
    friendRollNumbers: ["", "", ""],
    roomPreferences: { floor: "", quietZone: false, studyFocused: false },
  });

  // Waitlist form
  const [waitlistForm, setWaitlistForm] = useState({ hostelCode: "", roomType: "Double", reason: "" });
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Apply gender from URL query param (?gender=Male|Female) or localStorage from Login page
  useEffect(() => {
    let detectedGender = "Male";
    let detectedRoll = "12304567";
    let detectedName = "";

    try {
      const params = new URLSearchParams(window.location.search);
      const urlGender = params.get("gender");
      const urlRoll = params.get("roll");
      const storedGender = localStorage.getItem("lpu_student_gender");
      const storedRoll = localStorage.getItem("lpu_student_roll");
      const storedName = localStorage.getItem("lpu_student_name");

      if (urlGender === "Male" || urlGender === "Female") {
        detectedGender = urlGender;
      } else if (storedGender === "Male" || storedGender === "Female") {
        detectedGender = storedGender;
      }

      if (urlRoll) detectedRoll = urlRoll;
      else if (storedRoll) detectedRoll = storedRoll;

      if (storedName) detectedName = storedName;
    } catch (_) {}

    const defaultName =
      detectedName || (detectedGender === "Female" ? "Priya Patel" : "Arjun Sharma");
    const defaultEmail =
      detectedGender === "Female"
        ? "priya.patel@student.lpu.co.in"
        : "arjun.sharma@student.lpu.co.in";

    setStudentGender(detectedGender);
    setGenderFilter(detectedGender); // Recommend BH to Boys and GH to Girls automatically!
    setBookingForm((prev) => ({
      ...prev,
      gender: detectedGender,
      studentName: defaultName,
      studentRollNumber: detectedRoll,
      studentEmail: defaultEmail,
    }));

    const firstRec = STATIC_HOSTELS.find((h) => h.genderAllowed === detectedGender);
    if (firstRec) {
      setSelectedHostel(firstRec);
      setWaitlistForm((prev) => ({ ...prev, hostelCode: firstRec.code }));
    }
  }, []);

  // Switch student gender on the fly and update recommendations (BH for Male, GH for Female)
  const handleSwitchStudentGender = (newGender) => {
    setStudentGender(newGender);
    setGenderFilter(newGender);
    try {
      localStorage.setItem("lpu_student_gender", newGender);
    } catch (_) {}
    setBookingForm((prev) => ({
      ...prev,
      gender: newGender,
      studentName: newGender === "Female" ? "Priya Patel" : "Arjun Sharma",
      studentEmail:
        newGender === "Female"
          ? "priya.patel@student.lpu.co.in"
          : "arjun.sharma@student.lpu.co.in",
    }));
    const recHostel = allHostels.find((h) => h.genderAllowed === newGender);
    if (recHostel) {
      setSelectedHostel(recHostel);
      setWaitlistForm((prev) => ({ ...prev, hostelCode: recHostel.code }));
    }
  };

  // Try live API; fall back to static
  useEffect(() => {
    let c = false;
    fetch("http://localhost:5000/api/hostels")
      .then((r) => r.json())
      .then((d) => {
        if (!c && d.success && d.data?.length > 0) {
          const enriched = d.data.map((h) => ({
            ...h,
            ...getFallbackImagesForHostel(h),
          }));
          setAllHostels(enriched);
        }
      })
      .catch(() => {});
    fetch("http://localhost:5000/api/applications")
      .then((r) => r.json())
      .then((d) => {
        if (!c && d.success) setMyApplications(d.data);
      })
      .catch(() => {});
    return () => {
      c = true;
    };
  }, []);

  // Recommended hostels for logged-in student's gender (BH for Boys, GH for Girls)
  const recommendedHostels = allHostels.filter((h) => h.genderAllowed === studentGender);

  const filteredHostels = allHostels.filter((h) => {
    if (genderFilter === "Male" && h.genderAllowed !== "Male") return false;
    if (genderFilter === "Female" && h.genderAllowed !== "Female") return false;
    if (search) {
      const q = search.toLowerCase();
      return h.name?.toLowerCase().includes(q) || h.code?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalVacant = filteredHostels.reduce((s, h) => s + (h.availableBeds || 0), 0);
  const allocatedCount = myApplications.filter((a) => a.status === "ALLOCATED").length;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedHostel || !consentGiven) {
      alert("Please select a room category, hostel, and agree to terms.");
      return;
    }
    setSubmitting(true);
    const payload = {
      studentName: bookingForm.studentName,
      studentRollNumber: bookingForm.studentRollNumber,
      studentEmail: bookingForm.studentEmail,
      department: bookingForm.department,
      year: Number(bookingForm.year),
      gender: bookingForm.gender,
      cgpa: Number(bookingForm.cgpa),
      specialAccommodations: bookingForm.specialAccommodations,
      bookingMode,
      friendRollNumbers: bookingMode === "group" ? bookingForm.friendRollNumbers.filter(Boolean) : [],
      preferences: [
        {
          hostelId: selectedHostel._id,
          hostelCode: selectedHostel.code,
          hostelName: selectedHostel.name,
          roomType: selectedCategory.type,
          acPreference: selectedCategory.ac ? "AC" : "Non-AC",
          priority: 1,
        },
      ],
    };
    let app = null;
    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) app = data.data;
    } catch (_) {}
    if (!app) {
      app = {
        _id: `local-${Date.now()}`,
        applicationId: `LPU-APP-${Date.now().toString().slice(-6)}`,
        ...payload,
        status: "SUBMITTED",
        submittedAt: new Date().toISOString(),
        cgpa: bookingForm.cgpa,
      };
    }
    setConfirmation(app);
    setMyApplications((prev) => [app, ...prev]);
    setSubmitting(false);
  };

  const handleWaitlist = (e) => {
    e.preventDefault();
    setWaitlistSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-alt)]">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[var(--border)] shadow-sm px-4 sm:px-6 h-16 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LpuLogo size={36} showText={true} subtitle="Residential Booking · 2026-27" />
        </Link>
        <div className="flex items-center gap-2">
          {/* Gender & Recommended Wing Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs text-[var(--primary-dark)] font-bold">
            <span>{studentGender === "Female" ? "👧 Female · GH Recommended" : "👦 Male · BH Recommended"}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-xs text-green-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            {bookingForm.studentRollNumber}
          </div>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--border)] text-stone-500 hover:text-stone-800 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/student/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-colors"
          >
            Logout
          </Link>
        </div>
      </nav>

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black text-stone-900">Residential Booking Portal</h1>
            <p className="text-xs text-stone-500">
              Session 2026-27 · Smart Gender-Based Hostel Recommendation ({studentGender === "Female" ? "GH for Girls" : "BH for Boys"})
            </p>
          </div>
          {/* Quick Gender Switcher to test Boys (BH) vs Girls (GH) recommendation */}
          <div className="inline-flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-stone-500 px-2">Student Gender:</span>
            <button
              type="button"
              onClick={() => handleSwitchStudentGender("Male")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studentGender === "Male"
                  ? "bg-[var(--primary)] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              👦 Male (Recommend BH)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchStudentGender("Female")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                studentGender === "Female"
                  ? "bg-[var(--primary)] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              👧 Female (Recommend GH)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        {/* ── Personalized Gender-Based Hostel Recommendation Banner (BH for Boys / GH for Girls) ── */}
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-5 mb-6 shadow-2xs">
          <div className="grid lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-4 relative h-44 rounded-xl overflow-hidden border border-stone-200">
              <img
                src={
                  studentGender === "Female"
                    ? "/images/lpu/girls-hostel.webp"
                    : "/images/lpu/boys-hostel.webp"
                }
                alt={studentGender === "Female" ? "LPU Girls Hostel GH" : "LPU Boys Hostel BH"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[var(--primary)] text-white text-[10px] font-extrabold uppercase tracking-wider">
                ★ Recommended for {studentGender === "Female" ? "Girls (Female)" : "Boys (Male)"}
              </span>
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <div className="font-black text-base">
                  {studentGender === "Female"
                    ? "Girls Hostels (GH-1 to GH-3)"
                    : "Boys Hostels (BH-1 to BH-9)"}
                </div>
                <div className="text-[11px] text-white/85">
                  Official LPU {studentGender === "Female" ? "East Girls Enclave" : "West & North Boys Zone"}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--primary)]">
                    Verified {studentGender} Student · Welcome, {bookingForm.studentName}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-stone-900">
                    {studentGender === "Female"
                      ? "Recommended Hostels for Girls: GH-1, GH-2 & GH-3"
                      : "Recommended Hostels for Boys: BH-1 to BH-9"}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5 text-center">
                    <div className="text-base font-black text-[var(--primary-dark)]">
                      {recommendedHostels.length} Blocks
                    </div>
                    <div className="text-[10px] text-stone-500 font-semibold">
                      {studentGender === "Female" ? "GH Wings" : "BH Wings"}
                    </div>
                  </div>
                  <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-center">
                    <div className="text-base font-black text-stone-900">{totalVacant}</div>
                    <div className="text-[10px] text-stone-500 font-semibold">Vacant Beds</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-3.5">
                Based on your login selection as a{" "}
                <strong className="text-stone-900">
                  {studentGender === "Female" ? "Female (Girl)" : "Male (Boy)"} student
                </strong>
                , our allocation engine automatically recommends{" "}
                <strong className="text-[var(--primary-dark)]">
                  {studentGender === "Female"
                    ? "LPU Girls Hostels (GH-1 to GH-3)"
                    : "LPU Boys Hostels (BH-1 to BH-9)"}
                </strong>
                . Click any recommended block below to select it for your room booking:
              </p>

              {/* Quick Select Pills for Recommended BH or GH Hostels */}
              <div className="flex flex-wrap gap-2">
                {recommendedHostels.map((h) => {
                  const isSel = selectedHostel?._id === h._id || selectedHostel?.code === h.code;
                  return (
                    <button
                      key={h._id || h.code}
                      type="button"
                      onClick={() => {
                        setSelectedHostel(h);
                        setGenderFilter(studentGender);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isSel
                          ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs"
                          : "bg-orange-50/70 text-stone-800 border-orange-200 hover:border-[var(--primary)]"
                      }`}
                    >
                      <span>★ {h.code}</span>
                      <span className={`text-[10px] ${isSel ? "text-white/90" : "text-stone-500"}`}>
                        ({h.availableBeds || 80} vacant)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar (like LPU UMS) ── */}
        <div className="flex border-b border-[var(--border)] mb-6 bg-white rounded-t-xl overflow-x-auto">
          {[
            { id: "book", label: "Individual Booking" },
            { id: "group", label: "Group Booking (With Friends)" },
            { id: "matchmaker", label: "🤝 Matchmaker Hub" },
            { id: "room-swap", label: "🔄 Room Swap" },
            { id: "waitlist", label: "Wait List" },
            { id: "my-applications", label: `My Applications (${myApplications.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                if (t.id === "group") setBookingMode("group");
                else if (t.id === "book") setBookingMode("individual");
              }}
              className={`px-4 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? "border-[var(--primary)] text-[var(--primary)] bg-orange-50"
                  : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            TAB: INDIVIDUAL & GROUP BOOKING
        ══════════════════════════════════════════ */}
        {(activeTab === "book" || activeTab === "group") && !confirmation && (
          <div>
            {/* Terms notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5 text-xs text-stone-600 leading-relaxed">
              <strong className="text-[var(--primary-dark)]">Terms &amp; Conditions:</strong> The hostel room/facility is allocated based on CGPA merit and gender wing eligibility ({studentGender === "Female" ? "GH blocks for Girls" : "BH blocks for Boys"}).
              {activeTab === "group" && (
                <span> For Group Booking, all members must apply and list each other&apos;s roll numbers to be allocated together.</span>
              )}
            </div>

            {/* Step 1: Seater Category with Real LPU Room Photos */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[var(--primary-dark)] mb-3 uppercase tracking-wide">
                Step 1 — Select Seater Category (Real LPU Room Interiors)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROOM_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left rounded-xl border-2 transition-all overflow-hidden bg-white ${
                      selectedCategory?.id === cat.id
                        ? "border-[var(--primary)] ring-2 ring-orange-200"
                        : "border-stone-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="relative h-32 w-full overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      <span
                        className={`absolute top-2.5 right-2.5 text-[10px] px-2.5 py-0.5 rounded-full font-bold shadow-xs ${
                          cat.ac ? "bg-[var(--primary)] text-white" : "bg-stone-800 text-white"
                        }`}
                      >
                        {cat.ac ? "AC Suite" : "Non-AC"}
                      </span>
                      <span className="absolute bottom-2 left-2.5 text-xs font-extrabold text-white">
                        {cat.type} Seater
                      </span>
                    </div>
                    <div className="p-3.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-black text-stone-900">{cat.label}</span>
                        {selectedCategory?.id === cat.id && (
                          <span className="text-xs font-bold text-[var(--primary)]">✓ Selected</span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500">{cat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Hostel (With Real LPU Hostel Photos & BH/GH Recommendation Badges) */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-bold text-[var(--primary-dark)] uppercase tracking-wide">
                  Step 2 — Select Hostel ({studentGender === "Female" ? "Recommended: Girls Hostels GH-1 to GH-3" : "Recommended: Boys Hostels BH-1 to BH-9"})
                </h3>
                <span className="text-xs font-semibold text-stone-500">
                  Showing {filteredHostels.length} Hostel Blocks
                </span>
              </div>

              {/* Consent notice */}
              <div className="bg-white border border-stone-200 rounded-xl p-4 mb-4 text-xs text-stone-600">
                In case my preferred seater configuration is not available in my preferred hostel, I give my consent to book the same seater configuration in any other recommended {studentGender === "Female" ? "GH" : "BH"} hostel.
                <div className="flex gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setConsentGiven(false)}
                    className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      !consentGiven
                        ? "border-[var(--primary)] bg-orange-50 text-[var(--primary-dark)]"
                        : "border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    Not Agree
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsentGiven(true)}
                    className={`px-4 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      consentGiven
                        ? "border-[var(--primary)] bg-orange-50 text-[var(--primary-dark)]"
                        : "border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    Agree
                  </button>
                </div>
              </div>

              {/* Search + gender filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search hostel name or code (e.g. BH-1, GH-1)…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-light flex-1 max-w-xs"
                />
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { key: "Male", label: "Boys Hostels (BH-1 to BH-9)" },
                    { key: "Female", label: "Girls Hostels (GH-1 to GH-3)" },
                    { key: "All", label: "Show All (12)" },
                  ].map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      onClick={() => setGenderFilter(g.key)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        genderFilter === g.key
                          ? "border-[var(--primary)] bg-orange-50 text-[var(--primary-dark)]"
                          : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      {g.label}
                      {g.key === studentGender && " ★ Recommended"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHostels.map((h) => {
                  const avail = h.availableBeds || 80;
                  const total = h.totalBeds || 360;
                  const pct = Math.min(100, Math.round(((total - avail) / total) * 100));
                  const isRecommended = h.genderAllowed === studentGender;
                  const isSelected = selectedHostel?._id === h._id || selectedHostel?.code === h.code;
                  const imgs = getFallbackImagesForHostel(h);

                  return (
                    <button
                      key={h._id || h.code}
                      type="button"
                      onClick={() => setSelectedHostel(h)}
                      className={`text-left rounded-xl border-2 transition-all overflow-hidden bg-white ${
                        isSelected
                          ? "border-[var(--primary)] ring-2 ring-orange-200 shadow-md"
                          : "border-stone-200 hover:border-orange-300"
                      }`}
                    >
                      {/* Real LPU Hostel Photo */}
                      <div className="relative h-36 w-full overflow-hidden">
                        <img
                          src={imgs.imageUrl}
                          alt={`${h.code} - ${h.name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-[var(--primary)] text-white"
                                : "bg-white/95 text-[var(--primary-dark)]"
                            }`}
                          >
                            {h.code}
                          </span>
                          {isRecommended ? (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[var(--primary)] text-white shadow-xs">
                              ★ Recommended for {studentGender === "Female" ? "Girls" : "Boys"}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-800/80 text-white">
                              {h.genderAllowed === "Female" ? "Girls Wing (GH)" : "Boys Wing (BH)"}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between text-white">
                          <div>
                            <div className="font-black text-sm leading-tight">{h.name}</div>
                            <div className="text-[10px] text-white/80">{h.campusLocation}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-400 to-[var(--primary)] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-stone-500 mt-1.5">
                          <span className="text-[var(--success)] font-bold">{avail} beds vacant</span>
                          <span>{pct}% occupied</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Group friends (group tab only) */}
            {activeTab === "group" && (
              <div className="mb-6 bg-white border border-[var(--border)] rounded-xl p-5">
                <h3 className="text-sm font-bold text-[var(--primary-dark)] mb-3 uppercase tracking-wide">
                  Step 3 — Friend Roll Numbers
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Enter your friends&apos; registration numbers. All must apply and list each other.
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {bookingForm.friendRollNumbers.map((rn, idx) => (
                    <div key={idx}>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        Friend {idx + 1} Roll No.
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12345679"
                        value={rn}
                        onChange={(e) => {
                          const nf = [...bookingForm.friendRollNumbers];
                          nf[idx] = e.target.value;
                          setBookingForm({ ...bookingForm, friendRollNumbers: nf });
                        }}
                        className="input-light"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Your Details + Submit */}
            <div className="bg-white border border-[var(--border)] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[var(--primary-dark)] mb-4 uppercase tracking-wide">
                {activeTab === "group" ? "Step 4" : "Step 3"} — Confirm Your Details &amp; Submit
              </h3>

              {/* Selection summary */}
              {(selectedCategory || selectedHostel) && (
                <div className="bg-[var(--bg-alt)] rounded-xl p-4 mb-4 text-xs space-y-1.5 border border-[var(--border)]">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Student Gender &amp; Recommended Wing</span>
                    <span className="font-bold text-[var(--primary-dark)]">
                      {studentGender} ({studentGender === "Female" ? "Girls Hostel GH" : "Boys Hostel BH"})
                    </span>
                  </div>
                  {selectedCategory && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Room Category</span>
                      <span className="font-semibold text-stone-900">{selectedCategory.label}</span>
                    </div>
                  )}
                  {selectedHostel && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Hostel Selected</span>
                      <span className="font-semibold text-stone-900">
                        {selectedHostel.code} — {selectedHostel.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-500">Booking Type</span>
                    <span className="font-semibold text-[var(--primary)]">
                      {bookingMode === "group" ? "Group Booking" : "Individual Booking"}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.studentName}
                      onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                      className="input-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingForm.studentRollNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, studentRollNumber: e.target.value })}
                      className="input-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.studentEmail}
                      onChange={(e) => setBookingForm({ ...bookingForm, studentEmail: e.target.value })}
                      className="input-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Gender (Auto-Recommends BH/GH) *
                    </label>
                    <select
                      value={studentGender}
                      onChange={(e) => handleSwitchStudentGender(e.target.value)}
                      className="input-light"
                    >
                      <option value="Male">Male (Boy — Recommends BH-1 to BH-9)</option>
                      <option value="Female">Female (Girl — Recommends GH-1 to GH-3)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">Department *</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.department}
                      onChange={(e) => setBookingForm({ ...bookingForm, department: e.target.value })}
                      className="input-light"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">Year</label>
                      <select
                        value={bookingForm.year}
                        onChange={(e) => setBookingForm({ ...bookingForm, year: e.target.value })}
                        className="input-light"
                      >
                        {[1, 2, 3, 4, 5].map((y) => (
                          <option key={y} value={y}>
                            Year {y}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1.5">CGPA</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        required
                        value={bookingForm.cgpa}
                        onChange={(e) => setBookingForm({ ...bookingForm, cgpa: e.target.value })}
                        className="input-light"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                    Special Accommodation (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Ground floor due to medical reason…"
                    value={bookingForm.specialAccommodations}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialAccommodations: e.target.value })}
                    className="input-light resize-none"
                  />
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    defaultChecked
                    className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-xs text-stone-600 leading-relaxed">
                    I understand that: (1) By submitting I am giving my consent for hostel booking for Session 2026-27. (2) The booking will be considered final as per hostel guidelines.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-3.5 rounded-[10px] text-sm font-bold disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Submitting…</span>
                    </>
                  ) : (
                    <span>
                      Submit {bookingMode === "group" ? "Group" : "Individual"} Booking for{" "}
                      {selectedHostel?.code || (studentGender === "Female" ? "GH" : "BH")} →
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Confirmation Screen ── */}
        {(activeTab === "book" || activeTab === "group") && confirmation && (
          <div className="bg-white border border-[var(--border)] rounded-2xl p-10 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-200 text-green-600 text-3xl flex items-center justify-center mx-auto mb-4">
              ✓
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-1">Booking Submitted!</h3>
            <p className="text-sm text-stone-500 mb-6">
              Your hostel application has been registered. Save your ID below.
            </p>
            <div className="bg-[var(--bg-alt)] rounded-xl p-5 border border-[var(--border)] text-left mb-6 space-y-2">
              {[
                ["Application ID", confirmation.applicationId, "font-mono font-bold text-[var(--primary)]"],
                ["Student Name", confirmation.studentName, "font-semibold text-stone-900"],
                ["Gender", confirmation.gender, "font-semibold text-stone-900"],
                ["Roll Number", confirmation.studentRollNumber, "font-mono text-stone-900"],
                ["Hostel Applied", `${selectedHostel?.code} — ${selectedHostel?.name}`, "font-semibold text-stone-900"],
                ["Room Category", selectedCategory?.label || "", "text-[var(--success)] font-semibold"],
                ["Booking Type", bookingMode === "group" ? "Group Booking" : "Individual Booking", "text-stone-700"],
              ].map(([l, v, c]) => (
                <div key={l} className="flex justify-between text-sm">
                  <span className="text-stone-500">{l}:</span>
                  <span className={c}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmation(null);
                }}
                className="btn-secondary flex-1 py-2.5 rounded-xl text-sm"
              >
                New Booking
              </button>
              <button
                onClick={() => {
                  setConfirmation(null);
                  setActiveTab("my-applications");
                }}
                className="btn-primary flex-1 py-2.5 rounded-xl text-sm"
              >
                View Applications →
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: WAIT LIST
        ══════════════════════════════════════════ */}
        {activeTab === "waitlist" && (
          <div className="max-w-xl mx-auto">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 mb-4">
              <h3 className="font-bold text-stone-900 mb-1">
                Wait List Registration ({studentGender === "Female" ? "Girls Hostels GH" : "Boys Hostels BH"})
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                If your preferred recommended {studentGender === "Female" ? "GH" : "BH"} hostel is fully occupied, register on the wait list.
              </p>

              {waitlistSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-[var(--primary)] text-2xl flex items-center justify-center mx-auto mb-4">
                    ✓
                  </div>
                  <h4 className="font-bold text-stone-900 mb-1">Added to Wait List</h4>
                  <p className="text-sm text-stone-500 mb-4">
                    You will be notified at <strong>{bookingForm.studentEmail}</strong> when a slot opens in{" "}
                    <strong>{waitlistForm.hostelCode}</strong>.
                  </p>
                  <button
                    onClick={() => setWaitlistSubmitted(false)}
                    className="btn-secondary text-sm px-5 py-2.5 rounded-xl"
                  >
                    Register for Another Hostel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Preferred Recommended Hostel ({studentGender === "Female" ? "GH-1 to GH-3" : "BH-1 to BH-9"})
                    </label>
                    <select
                      value={waitlistForm.hostelCode}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, hostelCode: e.target.value })}
                      className="input-light"
                      required
                    >
                      <option value="">— Select Recommended Hostel —</option>
                      {recommendedHostels.map((h) => (
                        <option key={h._id} value={h.code}>
                          ★ {h.code} — {h.name} (Recommended for {studentGender})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Room Type Preference
                    </label>
                    <select
                      value={waitlistForm.roomType}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, roomType: e.target.value })}
                      className="input-light"
                    >
                      <option>Single</option>
                      <option>Double</option>
                      <option>Triple</option>
                      <option>Quad</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                      Reason / Additional Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Preferred hostel due to proximity to department…"
                      value={waitlistForm.reason}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, reason: e.target.value })}
                      className="input-light resize-none"
                    />
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      defaultChecked
                      className="mt-0.5 w-4 h-4 rounded border-stone-300 text-[var(--primary)]"
                    />
                    <span className="text-xs text-stone-600">
                      I understand that the wait list request gives my consent to book the residential facility for Session 2026-27 subject to availability.
                    </span>
                  </label>
                  <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-bold">
                    Register on Wait List →
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            TAB: MATCHMAKER HUB
        ══════════════════════════════════════════ */}
        {activeTab === "matchmaker" && <MatchmakerHub studentRoll={bookingForm.studentRollNumber} studentGender={studentGender} />}

        {/* ══════════════════════════════════════════
            TAB: ROOM SWAP
        ══════════════════════════════════════════ */}
        {activeTab === "room-swap" && <RoomSwapTab studentRoll={bookingForm.studentRollNumber} studentName={bookingForm.studentName} studentGender={studentGender} />}

        {/* ══════════════════════════════════════════
            TAB: MY APPLICATIONS
        ══════════════════════════════════════════ */}
        {activeTab === "my-applications" && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-stone-900">Your Submitted Applications</h2>
              <button onClick={() => setActiveTab("book")} className="btn-secondary text-sm px-4 py-2 rounded-xl">
                + New Booking
              </button>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[var(--border)] rounded-2xl">
                <div className="text-5xl mb-3">📋</div>
                <h3 className="font-bold text-stone-800">No Applications Yet</h3>
                <p className="text-sm text-stone-500 mt-1 mb-5">
                  Submit an Individual or Group Booking to get started.
                </p>
                <button onClick={() => setActiveTab("book")} className="btn-primary text-sm px-6 py-2.5 rounded-xl">
                  Start Booking
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app._id || app.applicationId}
                    className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono font-black text-stone-900">{app.applicationId}</span>
                        <StatusBadge status={app.status} />
                        {app.bookingMode === "group" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            Group
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-600">
                        <strong className="text-stone-900">{app.studentName}</strong> ({app.studentRollNumber}) ·{" "}
                        {app.department} · {app.gender || studentGender}
                      </p>
                      {app.preferences?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {app.preferences.map((p, i) => (
                            <span key={i} className="chip">
                              {p.hostelCode || p.hostelName} · {p.roomType} · {p.acPreference}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-[11px] text-stone-400 mt-2">
                        Submitted: {new Date(app.submittedAt || Date.now()).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-stone-400">CGPA</div>
                      <div className="text-xl font-black text-[var(--success)]">{app.cgpa}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
//  MATCHMAKER HUB COMPONENT
// ═══════════════════════════════════════════════════════════════
function MatchmakerHub({ studentRoll, studentGender }) {
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    sleepSchedule: "11PM-7AM",
    wakeUpTime: "7AM",
    studyHabits: "Moderate",
    cleanliness: "Very Clean",
    guestFrequency: "Rarely",
    musicPreference: "Quiet",
    interests: [],
    bio: "",
    lookingForRoommate: true,
  });

  const INTEREST_OPTIONS = [
    "Sports", "Music", "Gaming", "Reading", "Movies", "Coding",
    "Art", "Travel", "Photography", "Fitness", "Cooking", "Dance"
  ];

  // Load existing profile
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/matchmaker/profiles?roll=${studentRoll}`)
      .then(r => r.json())
      .then(d => {
        setLoading(false);
        if (d.success && d.data?.length > 0) {
          const p = d.data[0];
          setProfile(p);
          setFormData({
            sleepSchedule: p.lifestyle?.sleepSchedule || "11PM-7AM",
            wakeUpTime: p.lifestyle?.wakeUpTime || "7AM",
            studyHabits: p.lifestyle?.studyHabits || "Moderate",
            cleanliness: p.lifestyle?.cleanliness || "Very Clean",
            guestFrequency: p.lifestyle?.guestFrequency || "Rarely",
            musicPreference: p.lifestyle?.musicPreference || "Quiet",
            interests: p.interests || [],
            bio: p.bio || "",
            lookingForRoommate: p.lookingForRoommate !== false,
          });
        }
      })
      .catch(() => setLoading(false));
  }, [studentRoll]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      studentRoll,
      gender: studentGender,
      lifestyle: {
        sleepSchedule: formData.sleepSchedule,
        wakeUpTime: formData.wakeUpTime,
        studyHabits: formData.studyHabits,
        cleanliness: formData.cleanliness,
        guestFrequency: formData.guestFrequency,
        musicPreference: formData.musicPreference,
      },
      interests: formData.interests,
      bio: formData.bio,
      lookingForRoommate: formData.lookingForRoommate,
    };

    try {
      const res = await fetch("http://localhost:5000/api/matchmaker/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        alert("✅ Profile saved successfully!");
      }
    } catch (err) {
      alert("Failed to save profile");
    }
    setSaving(false);
  };

  const handleFindMatches = async () => {
    if (!profile) {
      alert("Please save your profile first!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/matchmaker/find-matches/${studentRoll}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setMatches(data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6">
        <h2 className="text-2xl font-black mb-2">🤝 Matchmaker Hub</h2>
        <p className="text-sm text-white/90">
          Fill your lifestyle preferences and find compatible roommates with matching habits
        </p>
      </div>

      {/* Profile Form */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-stone-900 mb-4">Your Lifestyle Preferences</h3>
        
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Sleep Schedule */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Sleep Schedule
              </label>
              <select
                value={formData.sleepSchedule}
                onChange={(e) => setFormData({ ...formData, sleepSchedule: e.target.value })}
                className="input-light"
              >
                <option>9PM-5AM</option>
                <option>10PM-6AM</option>
                <option>11PM-7AM</option>
                <option>12AM-8AM</option>
                <option>1AM-9AM</option>
                <option>Night Owl (2AM+)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Wake Up Time
              </label>
              <select
                value={formData.wakeUpTime}
                onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })}
                className="input-light"
              >
                <option>5AM</option>
                <option>6AM</option>
                <option>7AM</option>
                <option>8AM</option>
                <option>9AM</option>
                <option>After 10AM</option>
              </select>
            </div>
          </div>

          {/* Study & Cleanliness */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Study Habits
              </label>
              <select
                value={formData.studyHabits}
                onChange={(e) => setFormData({ ...formData, studyHabits: e.target.value })}
                className="input-light"
              >
                <option>Light</option>
                <option>Moderate</option>
                <option>Intensive</option>
                <option>Night Study</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Cleanliness Level
              </label>
              <select
                value={formData.cleanliness}
                onChange={(e) => setFormData({ ...formData, cleanliness: e.target.value })}
                className="input-light"
              >
                <option>Very Clean</option>
                <option>Clean</option>
                <option>Moderate</option>
                <option>Relaxed</option>
              </select>
            </div>
          </div>

          {/* Music & Guests */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Music Preference
              </label>
              <select
                value={formData.musicPreference}
                onChange={(e) => setFormData({ ...formData, musicPreference: e.target.value })}
                className="input-light"
              >
                <option>Quiet</option>
                <option>Low Volume</option>
                <option>Moderate</option>
                <option>Loud</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Guest Frequency
              </label>
              <select
                value={formData.guestFrequency}
                onChange={(e) => setFormData({ ...formData, guestFrequency: e.target.value })}
                className="input-light"
              >
                <option>Rarely</option>
                <option>Occasionally</option>
                <option>Frequently</option>
                <option>Very Often</option>
              </select>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-3 uppercase">
              Your Interests (Select Multiple)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                    formData.interests.includes(interest)
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white text-stone-700 border-stone-300 hover:border-purple-400"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
              About You (Optional)
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell potential roommates about yourself..."
              className="input-light"
              rows={3}
            />
          </div>

          {/* Looking for roommate */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.lookingForRoommate}
              onChange={(e) => setFormData({ ...formData, lookingForRoommate: e.target.checked })}
              className="rounded border-stone-300 text-purple-500 w-4 h-4"
            />
            <label className="text-sm text-stone-700 font-semibold">
              I am actively looking for a roommate
            </label>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-3 rounded-xl disabled:opacity-60"
          >
            {saving ? "Saving..." : "💾 Save My Profile"}
          </button>
        </form>
      </div>

      {/* Find Matches */}
      {profile && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-900">Find Compatible Roommates</h3>
            <button
              onClick={handleFindMatches}
              disabled={loading}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm disabled:opacity-60"
            >
              {loading ? "Searching..." : "🔍 Find Matches"}
            </button>
          </div>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((match, idx) => (
                <div key={idx} className="border border-stone-200 rounded-xl p-5 hover:border-purple-300 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-stone-900">{match.studentRoll}</h4>
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                          {Math.round(match.compatibilityScore)}% Match
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">{match.gender} Student</p>
                    </div>
                  </div>

                  {match.bio && (
                    <p className="text-sm text-stone-600 mb-3 italic">"{match.bio}"</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-500">Sleep:</span>
                      <div className="font-semibold text-stone-900">{match.lifestyle?.sleepSchedule}</div>
                    </div>
                    <div>
                      <span className="text-stone-500">Study:</span>
                      <div className="font-semibold text-stone-900">{match.lifestyle?.studyHabits}</div>
                    </div>
                    <div>
                      <span className="text-stone-500">Cleanliness:</span>
                      <div className="font-semibold text-stone-900">{match.lifestyle?.cleanliness}</div>
                    </div>
                    <div>
                      <span className="text-stone-500">Music:</span>
                      <div className="font-semibold text-stone-900">{match.lifestyle?.musicPreference}</div>
                    </div>
                  </div>

                  {match.interests?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {match.interests.map((interest, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-stone-500">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-sm">Click "Find Matches" to discover compatible roommates</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOM SWAP COMPONENT
// ═══════════════════════════════════════════════════════════════
function RoomSwapTab({ studentRoll, studentName, studentGender }) {
  const [mySwaps, setMySwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    currentHostel: "",
    currentRoom: "",
    currentBedNumber: "",
    targetStudentRoll: "",
    reason: "",
  });

  // Load existing swap requests
  useEffect(() => {
    loadSwaps();
  }, [studentRoll]);

  const loadSwaps = () => {
    setLoading(true);
    fetch(`http://localhost:5000/api/room-swaps?roll=${studentRoll}`)
      .then(r => r.json())
      .then(d => {
        setLoading(false);
        if (d.success) {
          setMySwaps(d.data || []);
        }
      })
      .catch(() => setLoading(false));
  };

  const handleSubmitSwap = async (e) => {
    e.preventDefault();
    
    if (!formData.currentHostel || !formData.targetStudentRoll) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    const payload = {
      requestedByName: studentName,
      requestedByRoll: studentRoll,
      requestedByGender: studentGender,
      currentHostel: formData.currentHostel,
      currentRoom: formData.currentRoom,
      currentBedNumber: formData.currentBedNumber,
      targetStudentRoll: formData.targetStudentRoll,
      reason: formData.reason,
    };

    try {
      const res = await fetch("http://localhost:5000/api/room-swaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.success) {
        alert("✅ Room swap request submitted!");
        setShowForm(false);
        setFormData({
          currentHostel: "",
          currentRoom: "",
          currentBedNumber: "",
          targetStudentRoll: "",
          reason: "",
        });
        loadSwaps();
      } else {
        alert(data.message || "Failed to submit request");
      }
    } catch (err) {
      alert("Error submitting swap request");
    }
    setSubmitting(false);
  };

  const handleCancelSwap = async (swapId) => {
    if (!confirm("Are you sure you want to cancel this swap request?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/room-swaps/${swapId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        alert("✅ Swap request cancelled");
        loadSwaps();
      }
    } catch (err) {
      alert("Error cancelling request");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      PENDING: "bg-amber-100 text-amber-700 border-amber-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
      CANCELLED: "bg-stone-100 text-stone-600 border-stone-200",
    };
    return map[status] || map.PENDING;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-2">🔄 Room Swap</h2>
            <p className="text-sm text-white/90">
              Request to swap rooms with other students in same hostel wing
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all"
          >
            {showForm ? "Close Form" : "+ New Request"}
          </button>
        </div>
      </div>

      {/* Request Form */}
      {showForm && (
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-stone-900 mb-4">Create Swap Request</h3>
          
          <form onSubmit={handleSubmitSwap} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                  Current Hostel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., BH-1"
                  value={formData.currentHostel}
                  onChange={(e) => setFormData({ ...formData, currentHostel: e.target.value })}
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 305"
                  value={formData.currentRoom}
                  onChange={(e) => setFormData({ ...formData, currentRoom: e.target.value })}
                  className="input-light"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                  Bed Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., B2"
                  value={formData.currentBedNumber}
                  onChange={(e) => setFormData({ ...formData, currentBedNumber: e.target.value })}
                  className="input-light"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Target Student Roll Number *
              </label>
              <input
                type="text"
                required
                placeholder="Enter roll number of student you want to swap with"
                value={formData.targetStudentRoll}
                onChange={(e) => setFormData({ ...formData, targetStudentRoll: e.target.value })}
                className="input-light"
              />
              <p className="text-xs text-stone-500 mt-1">
                Must be same gender and both parties need to accept the swap
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">
                Reason for Swap
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Explain why you want to swap rooms..."
                className="input-light"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 rounded-xl disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "📤 Submit Swap Request"}
            </button>
          </form>
        </div>
      )}

      {/* My Swap Requests */}
      <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-stone-900 mb-4">My Swap Requests</h3>
        
        {loading ? (
          <div className="text-center py-10 text-stone-500">Loading...</div>
        ) : mySwaps.length === 0 ? (
          <div className="text-center py-10 text-stone-500">
            <div className="text-4xl mb-2">🔄</div>
            <p className="text-sm">No swap requests yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mySwaps.map((swap) => (
              <div key={swap._id} className="border border-stone-200 rounded-xl p-5 hover:border-blue-300 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-bold text-stone-900">#{swap._id.slice(-6)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(swap.status)}`}>
                        {swap.status}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Created {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {swap.status === "PENDING" && (
                    <button
                      onClick={() => handleCancelSwap(swap._id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-stone-500 text-xs">Your Location:</span>
                    <div className="font-semibold text-stone-900">
                      {swap.currentHostel} {swap.currentRoom && `· Room ${swap.currentRoom}`} {swap.currentBedNumber && `· Bed ${swap.currentBedNumber}`}
                    </div>
                  </div>
                  <div>
                    <span className="text-stone-500 text-xs">Target Student:</span>
                    <div className="font-semibold text-stone-900">{swap.targetStudentRoll}</div>
                  </div>
                </div>

                {swap.reason && (
                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <span className="text-xs text-stone-500">Reason:</span>
                    <p className="text-sm text-stone-700 mt-1">{swap.reason}</p>
                  </div>
                )}

                {swap.adminNotes && (
                  <div className="mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-xs font-bold text-amber-700">Admin Notes:</span>
                    <p className="text-sm text-amber-900 mt-1">{swap.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
