"use client";
import { useState } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

const API_BASE = "http://localhost:5000/api";

// Registered LPU UMS Student Directory (synced with MongoDB Atlas seeder & local fallback)
const DEFAULT_REGISTERED_STUDENTS = [
  {
    regNo: "12304567",
    password: "password123",
    name: "Arjun Sharma",
    email: "arjun.sharma@student.lpu.co.in",
    gender: "Male",
    department: "Computer Science",
    year: 2,
    cgpa: 8.5,
  },
  {
    regNo: "12304568",
    password: "password123",
    name: "Priya Patel",
    email: "priya.patel@student.lpu.co.in",
    gender: "Female",
    department: "Electronics",
    year: 1,
    cgpa: 9.2,
  },
  {
    regNo: "12345678",
    password: "password123",
    name: "Arjun Sharma",
    email: "arjun.sharma@student.lpu.co.in",
    gender: "Male",
    department: "Computer Science",
    year: 2,
    cgpa: 8.5,
  },
  {
    regNo: "12345679",
    password: "password123",
    name: "Priya Patel",
    email: "priya.patel@student.lpu.co.in",
    gender: "Female",
    department: "Electronics",
    year: 1,
    cgpa: 9.2,
  },
  {
    regNo: "12345680",
    password: "password123",
    name: "Rahul Verma",
    email: "rahul.verma@student.lpu.co.in",
    gender: "Male",
    department: "Business Administration",
    year: 3,
    cgpa: 7.8,
  },
  {
    regNo: "12345681",
    password: "password123",
    name: "Sneha Singh",
    email: "sneha.singh@student.lpu.co.in",
    gender: "Female",
    department: "Information Technology",
    year: 2,
    cgpa: 8.9,
  },
  {
    regNo: "12345682",
    password: "password123",
    name: "Aditya Kumar",
    email: "aditya.kumar@student.lpu.co.in",
    gender: "Male",
    department: "Mechanical Engineering",
    year: 4,
    cgpa: 8.1,
  },
];

const GENDER_RECOMMENDATIONS = {
  Male: {
    badge: "Boys Residential Wing · Recommended for Male Students",
    title: "Boys Hostels (BH-1 to BH-9)",
    topPick: "BH-1 · Boys Hostel 1 (West Residential Zone)",
    blocks: ["BH-1", "BH-2", "BH-3", "BH-4", "BH-5", "BH-6", "BH-7", "BH-8", "BH-9"],
    buildingImg: "/images/lpu/boys-hostel.webp",
    roomImg: "/images/lpu/boys-hostel-room.webp",
    desc: "System automatically recommends LPU Boys Hostels (BH-1 to BH-9) featuring 9 multi-storey towers, biometric turnstile access, indoor gymnasiums, and dedicated dining mess.",
  },
  Female: {
    badge: "Girls Residential Enclave · Recommended for Female Students",
    title: "Girls Hostels (GH-1 to GH-3)",
    topPick: "GH-1 · Girls Hostel 1 (East Residential Quadrant)",
    blocks: ["GH-1", "GH-2", "GH-3"],
    buildingImg: "/images/lpu/girls-hostel-1.jpg",
    roomImg: "/images/lpu/girls-hostel-room.webp",
    desc: "System automatically recommends LPU Girls Hostels (GH-1 to GH-3) featuring a gated residential enclave, 24/7 female wardens, multi-tier biometric security, and in-house dining.",
  },
};

export default function StudentLogin() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({
    regNo: "",
    password: "",
    gender: "",
    studentName: "",
    department: "Computer Science",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null); // { status, code, title, message }
  const [successMsg, setSuccessMsg] = useState("");

  const getRegisteredList = () => {
    try {
      const custom = JSON.parse(localStorage.getItem("lpu_custom_registered_students") || "[]");
      return [...DEFAULT_REGISTERED_STUDENTS, ...custom];
    } catch (_) {
      return DEFAULT_REGISTERED_STUDENTS;
    }
  };

  const handleAutofill = (genderChoice = "Male") => {
    setMode("login");
    if (genderChoice === "Female") {
      setFormData({
        regNo: "12304568",
        password: "password123",
        gender: "Female",
        studentName: "Priya Patel",
        department: "Electronics",
      });
    } else {
      setFormData({
        regNo: "12304567",
        password: "password123",
        gender: "Male",
        studentName: "Arjun Sharma",
        department: "Computer Science",
      });
    }
    setAuthError(null);
    setSuccessMsg("");
  };

  const handleTestUnauthorized = () => {
    setMode("login");
    setFormData({
      regNo: "99998888",
      password: "wrongpassword",
      gender: "Male",
      studentName: "",
      department: "Computer Science",
    });
    setAuthError({
      status: "401 UNAUTHORIZED",
      code: "UNREGISTERED_STUDENT",
      title: "Unauthorized Access — Unregistered UMS ID",
      message:
        "Registration Number '99998888' is not registered in the LPU UMS Hostel Portal. Only verified university students with registered UMS credentials can sign in.",
    });
    setSuccessMsg("");
  };

  const handleGenderSelect = (selectedGender) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
    }));
    setAuthError(null);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMsg("");

    const cleanRoll = formData.regNo.trim();
    const cleanPassword = formData.password;
    const cleanName = formData.studentName.trim();

    if (!formData.gender) {
      setAuthError({
        status: "400 VALIDATION ERROR",
        code: "GENDER_REQUIRED",
        title: "Gender Selection Required",
        message: "Please select whether you are Male (Boy) or Female (Girl) to register your UMS account.",
      });
      return;
    }

    if (!cleanName) {
      setAuthError({
        status: "400 VALIDATION ERROR",
        code: "NAME_REQUIRED",
        title: "Student Name Required",
        message: "Please enter your full name to register your UMS ID.",
      });
      return;
    }

    if (!/^\d{8}$/.test(cleanRoll)) {
      setAuthError({
        status: "400 BAD REQUEST",
        code: "INVALID_FORMAT",
        title: "Invalid UMS Registration Number Format",
        message: `Registration Number '${cleanRoll || "(empty)"}' is invalid. LPU UMS ID must be an exact 8-digit number (e.g., 12304567).`,
      });
      return;
    }

    if (cleanPassword.length < 8) {
      setAuthError({
        status: "400 BAD REQUEST",
        code: "WEAK_PASSWORD",
        title: "Password Too Short",
        message: "Password must be at least 8 characters long for security compliance.",
      });
      return;
    }

    const existing = getRegisteredList().find((s) => s.regNo === cleanRoll);
    if (existing) {
      setAuthError({
        status: "409 CONFLICT",
        code: "ALREADY_REGISTERED",
        title: "UMS ID Already Registered",
        message: `Registration Number '${cleanRoll}' (${existing.name}) is already registered. Please switch to Sign In.`,
      });
      return;
    }

    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: cleanRoll,
          password: cleanPassword,
          name: cleanName,
          gender: formData.gender,
          department: formData.department || "Computer Science",
        }),
      });
    } catch (_) {}

    try {
      const custom = JSON.parse(localStorage.getItem("lpu_custom_registered_students") || "[]");
      custom.push({
        regNo: cleanRoll,
        password: cleanPassword,
        name: cleanName,
        email: `${cleanRoll}@student.lpu.co.in`,
        gender: formData.gender,
        department: formData.department || "Computer Science",
        year: 2,
        cgpa: 8.4,
      });
      localStorage.setItem("lpu_custom_registered_students", JSON.stringify(custom));
    } catch (_) {}

    setLoading(false);
    setMode("login");
    setSuccessMsg(`UMS ID ${cleanRoll} (${cleanName}) registered! You can now sign in below.`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMsg("");

    if (!formData.gender) {
      setAuthError({
        status: "400 VALIDATION ERROR",
        code: "GENDER_REQUIRED",
        title: "Step 1 Incomplete — Select Gender",
        message: "Please select whether you are Male (Boy) or Female (Girl) so we can verify your eligibility and recommend BH or GH hostels.",
      });
      return;
    }

    const cleanRoll = formData.regNo.trim();
    const cleanPassword = formData.password;

    if (!cleanRoll || !cleanPassword) {
      setAuthError({
        status: "400 BAD REQUEST",
        code: "MISSING_CREDENTIALS",
        title: "Missing Login Credentials",
        message: "Please enter both your 8-digit Registration Number (UMS ID) and Password.",
      });
      return;
    }

    // Validate 8-digit UMS ID format
    if (!/^\d{8}$/.test(cleanRoll)) {
      setAuthError({
        status: "400 BAD REQUEST",
        code: "INVALID_FORMAT",
        title: "Invalid UMS ID Format",
        message: `Registration Number '${cleanRoll}' is not valid. LPU UMS Registration Numbers must be an 8-digit numeric ID (e.g., 12304567).`,
      });
      return;
    }

    setLoading(true);

    // 1. Try verifying against live Backend API (/api/auth/login)
    let apiHandled = false;
    let verifiedStudent = null;

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: cleanRoll,
          password: cleanPassword,
          gender: formData.gender,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        apiHandled = true;
        verifiedStudent = data.student || {
          rollNumber: cleanRoll,
          name: formData.gender === "Female" ? "Priya Patel" : "Arjun Sharma",
          gender: formData.gender,
        };
        if (data.token) {
          localStorage.setItem("lpu_student_token", data.token);
        }
      } else if (res.status === 401 || res.status === 403 || res.status === 400) {
        // Also check if user registered locally in browser before rejecting
        const localCustom = getRegisteredList().find((s) => s.regNo === cleanRoll);
        if (!localCustom) {
          setLoading(false);
          setAuthError({
            status: `${res.status} UNAUTHORIZED`,
            code: data.code || "UNAUTHORIZED",
            title: data.error || "401 Unauthorized — Access Denied",
            message:
              data.message ||
              "Unauthorized Access: Invalid or unregistered Registration Number / Password.",
          });
          return;
        }
      }
    } catch (_) {
      // Backend unreachable -> fall back to client-side registered student verification
    }

    // 2. Client-side verification against Registered UMS Directory
    if (!apiHandled) {
      const registeredList = getRegisteredList();
      const matchedStudent = registeredList.find((s) => s.regNo === cleanRoll);

      if (!matchedStudent) {
        setLoading(false);
        setAuthError({
          status: "401 UNAUTHORIZED",
          code: "UNREGISTERED_STUDENT",
          title: "401 Unauthorized — Unregistered Student",
          message: `Unauthorized Access: Registration Number '${cleanRoll}' is not registered in the LPU UMS Hostel Portal. Please use a registered UMS ID or register a new account.`,
        });
        return;
      }

      if (matchedStudent.password !== cleanPassword) {
        setLoading(false);
        setAuthError({
          status: "401 UNAUTHORIZED",
          code: "INVALID_PASSWORD",
          title: "401 Unauthorized — Wrong Password",
          message: `Unauthorized Access: Incorrect password entered for Registration Number '${cleanRoll}' (${matchedStudent.name}). Please check your password and try again.`,
        });
        return;
      }

      if (matchedStudent.gender !== formData.gender) {
        setLoading(false);
        setAuthError({
          status: "403 UNAUTHORIZED",
          code: "GENDER_MISMATCH",
          title: "403 Unauthorized — Gender Policy Mismatch",
          message: `Unauthorized Selection: UMS ID '${cleanRoll}' (${matchedStudent.name}) is registered as a ${matchedStudent.gender} student. Please select '${matchedStudent.gender}' in Step 1 to access eligible hostels.`,
        });
        return;
      }

      verifiedStudent = {
        rollNumber: matchedStudent.regNo,
        name: matchedStudent.name,
        email: matchedStudent.email,
        gender: matchedStudent.gender,
        department: matchedStudent.department,
        year: matchedStudent.year,
        cgpa: matchedStudent.cgpa,
      };
    }

    try {
      localStorage.setItem("lpu_student_gender", verifiedStudent.gender);
      localStorage.setItem("lpu_student_roll", verifiedStudent.rollNumber);
      localStorage.setItem("lpu_student_name", verifiedStudent.name);
      localStorage.setItem("lpu_student_authenticated", "true");
    } catch (_) {}

    setTimeout(() => {
      window.location.href = `/student/dashboard?gender=${encodeURIComponent(
        verifiedStudent.gender
      )}&roll=${encodeURIComponent(verifiedStudent.rollNumber)}`;
    }, 500);
  };

  const activeRec = formData.gender ? GENDER_RECOMMENDATIONS[formData.gender] : null;

  return (
    <div className="min-h-screen bg-[var(--bg-alt)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Login / Register Form + Gender Selection */}
        <div className="lg:col-span-7 bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Top header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[var(--primary)] transition-colors"
            >
              ← Back to Home
            </Link>
            <img
              src="/images/lpu/naac-logo.webp"
              alt="LPU NAAC A++"
              className="h-6 object-contain"
            />
          </div>

          <div className="flex items-center justify-between gap-3.5 mb-5 flex-wrap">
            <div className="flex items-center gap-3.5">
              <LpuLogo size={48} showText={false} />
              <div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  Student Hostel Portal
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lovely Professional University · Verified UMS Authentication
                </p>
              </div>
            </div>

            {/* Sign In / Register Switcher */}
            <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setAuthError(null);
                  setSuccessMsg("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "login"
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setAuthError(null);
                  setSuccessMsg("");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mode === "register"
                    ? "bg-white text-[var(--primary-dark)] shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Register UMS ID
              </button>
            </div>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5">
              <span className="text-base">✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* 401 / 403 Unauthorized & Validation Alert Banner */}
          {authError && (
            <div className="mb-5 rounded-xl bg-red-50 border-2 border-red-300 p-4 text-red-900 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                    🔒 {authError.status}
                  </span>
                  <span className="text-xs font-extrabold text-red-900">
                    {authError.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  {authError.code}
                </span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed font-medium">
                {authError.message}
              </p>
            </div>
          )}

          {/* 1-Click Demo Autofill for Boys (BH), Girls (GH), and Unauthorized Test */}
          <div className="mb-6">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Quick Demo Autofill &amp; Validation Test
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAutofill("Male")}
                className="py-2 px-2.5 rounded-xl border border-orange-200 bg-orange-50/70 text-[var(--primary-dark)] hover:bg-orange-100/80 transition-all text-[11px] font-bold flex items-center justify-center gap-1"
              >
                <span>👦 Boy (12304567)</span>
              </button>
              <button
                type="button"
                onClick={() => handleAutofill("Female")}
                className="py-2 px-2.5 rounded-xl border border-orange-200 bg-orange-50/70 text-[var(--primary-dark)] hover:bg-orange-100/80 transition-all text-[11px] font-bold flex items-center justify-center gap-1"
              >
                <span>👧 Girl (12304568)</span>
              </button>
              <button
                type="button"
                onClick={handleTestUnauthorized}
                className="py-2 px-2.5 rounded-xl border border-red-200 bg-red-50/70 text-red-700 hover:bg-red-100/80 transition-all text-[11px] font-bold flex items-center justify-center gap-1"
              >
                <span>🚫 Test Invalid</span>
              </button>
            </div>
          </div>

          <form
            onSubmit={mode === "register" ? handleRegisterSubmit : handleSubmit}
            className="space-y-5"
          >
            {/* STEP 1: Ask User Male or Female to Recommend BH to Boys and GH to Girls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Step 1: Are you Male or Female? <span className="text-[var(--primary)]">*</span>
                </label>
                <span className="text-[11px] font-semibold text-[var(--primary)]">
                  Auto-recommends BH / GH
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Male / Boy Option */}
                <button
                  type="button"
                  onClick={() => handleGenderSelect("Male")}
                  className={`group relative text-left rounded-xl p-3 border-2 transition-all overflow-hidden ${
                    formData.gender === "Male"
                      ? "border-[var(--primary)] bg-orange-50/70 shadow-sm"
                      : "border-stone-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2.5 border border-stone-200">
                    <img
                      src="/images/lpu/boys-hostel.webp"
                      alt="LPU Boys Hostel BH"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-extrabold text-white bg-[var(--primary)] px-2 py-0.5 rounded-md">
                      Recommends BH-1 to BH-9
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-stone-900">Male (Boy)</div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        Boys Hostels (BH)
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        formData.gender === "Male"
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-stone-300 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                </button>

                {/* Female / Girl Option */}
                <button
                  type="button"
                  onClick={() => handleGenderSelect("Female")}
                  className={`group relative text-left rounded-xl p-3 border-2 transition-all overflow-hidden ${
                    formData.gender === "Female"
                      ? "border-[var(--primary)] bg-orange-50/70 shadow-sm"
                      : "border-stone-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className="relative h-20 w-full rounded-lg overflow-hidden mb-2.5 border border-stone-200">
                    <img
                      src="/images/lpu/girls-hostel-1.jpg"
                      alt="LPU Girls Hostel GH"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-1.5 left-2 text-[10px] font-extrabold text-white bg-[var(--primary)] px-2 py-0.5 rounded-md">
                      Recommends GH-1 to GH-3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black text-stone-900">Female (Girl)</div>
                      <div className="text-[11px] text-stone-500 font-medium">
                        Girls Hostels (GH)
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        formData.gender === "Female"
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-stone-300 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Instant Recommendation Banner inside Login Form when Gender is chosen */}
            {activeRec && (
              <div className="rounded-xl bg-orange-50/90 border border-orange-200 p-3.5 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-extrabold text-[var(--primary-dark)] uppercase tracking-wide text-[11px]">
                    ★ System Recommendation for {formData.gender === "Male" ? "Boys" : "Girls"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[var(--primary-dark)] font-bold text-[10px] border border-orange-200">
                    {formData.gender === "Male" ? "BH Wing Assigned" : "GH Wing Assigned"}
                  </span>
                </div>
                <p className="font-bold text-stone-900 text-sm mb-1">{activeRec.title}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {activeRec.blocks.map((code) => (
                    <span
                      key={code}
                      className="px-2 py-0.5 rounded-md bg-white border border-orange-200 text-stone-800 font-bold text-[11px]"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Name Field when Registering a New UMS ID */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Full Student Name <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Mehta"
                  value={formData.studentName}
                  onChange={(e) => {
                    setFormData({ ...formData, studentName: e.target.value });
                    setAuthError(null);
                  }}
                  className="input-light"
                />
              </div>
            )}

            {/* Registration Number */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Registration Number (8-Digit UMS ID)
                </label>
                <span className="text-[10px] text-stone-400 font-medium">
                  Registered IDs: 12304567, 12304568, 12345678–82
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. 12304567"
                value={formData.regNo}
                onChange={(e) => {
                  setFormData({ ...formData, regNo: e.target.value });
                  setAuthError(null);
                }}
                className={`input-light ${
                  authError &&
                  (authError.code === "UNREGISTERED_STUDENT" ||
                    authError.code === "INVALID_FORMAT")
                    ? "border-red-400 bg-red-50/30"
                    : ""
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder={
                  mode === "register"
                    ? "Create password (min 8 characters)"
                    : "Enter your UMS password (demo: password123)"
                }
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setAuthError(null);
                }}
                className={`input-light ${
                  authError && authError.code === "INVALID_PASSWORD"
                    ? "border-red-400 bg-red-50/30"
                    : ""
                }`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>
                    {mode === "register"
                      ? "Registering UMS Account…"
                      : "Verifying UMS Credentials…"}
                  </span>
                </>
              ) : mode === "register" ? (
                <>
                  <span>Register New Student UMS Account</span>
                  <span>→</span>
                </>
              ) : (
                <>
                  <span>
                    Verify &amp; Sign In to{" "}
                    {formData.gender === "Female"
                      ? "Girls Hostels (GH)"
                      : formData.gender === "Male"
                      ? "Boys Hostels (BH)"
                      : "Hostel Portal"}
                  </span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Registered UMS Accounts Reference Box */}
          <div className="mt-5 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
            <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
              <span>🔑 Verified Registered Student Credentials (Password: password123)</span>
              <span className="text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded">
                Auth Guard Active
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-1 text-stone-500">
              <div>• <strong>12304567</strong> — Arjun Sharma (Male · BH)</div>
              <div>• <strong>12304568</strong> — Priya Patel (Female · GH)</div>
              <div>• <strong>12345680</strong> — Rahul Verma (Male · BH)</div>
              <div>• <strong>12345681</strong> — Sneha Singh (Female · GH)</div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-stone-400">
            <span>
              Helpdesk:{" "}
              <a
                href="mailto:hostel@lpu.co.in"
                className="text-[var(--primary)] font-semibold hover:underline"
              >
                hostel@lpu.co.in
              </a>
            </span>
            <Link
              href="/admin/login"
              className="text-[var(--primary)] hover:underline font-semibold"
            >
              Warden Admin Panel →
            </Link>
          </div>
        </div>

        {/* Right Column: Real LPU Hostel Photos & Live Gender Recommendation Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-52 w-full">
              <img
                src={activeRec ? activeRec.buildingImg : "/images/lpu/hero-banner.webp"}
                alt="Official LPU Residential Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-[var(--primary)] text-white text-[11px] font-bold shadow-sm">
                  {activeRec ? activeRec.badge : "Real LPU Residential Campus"}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="text-lg font-black leading-tight">
                  {activeRec
                    ? activeRec.title
                    : "Select Male or Female to Preview Recommended Hostels"}
                </div>
                <p className="text-xs text-white/85 mt-0.5">
                  {activeRec
                    ? `Top Recommended Block: ${activeRec.topPick}`
                    : "Boys are recommended BH-1 to BH-9 · Girls are recommended GH-1 to GH-3"}
                </p>
              </div>
            </div>

            <div className="p-5">
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {activeRec
                  ? activeRec.desc
                  : "At LPU, residential zones are gender-segregated for safety and comfort. Select Male or Female on the login form to automatically filter and recommend Boys Hostels (BH) or Girls Hostels (GH)."}
              </p>

              {/* Real Room Interior Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                  <img
                    src="/images/lpu/boys-hostel-room.webp"
                    alt="Real LPU Boys Hostel Room"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-stone-900">
                      Boys Hostel (BH-1 to BH-9)
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Real LPU BH AC 4-Seater Room
                    </div>
                  </div>
                </div>

                <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                  <img
                    src="/images/lpu/girls-hostel-room.webp"
                    alt="Real LPU Girls Hostel Room"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <div className="text-[11px] font-bold text-stone-900">
                      Girls Hostel (GH-1 to GH-3)
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Real LPU GH AC Suite Room
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Mess & Security Mini Card */}
          <div className="bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
            <img
              src="/images/lpu/turnstile-gates.jpg"
              alt="LPU Biometric Turnstile Security"
              className="w-20 h-16 rounded-xl object-cover flex-shrink-0 border border-stone-200"
            />
            <div>
              <div className="text-xs font-bold text-stone-900">
                Biometric Turnstile &amp; 24/7 Warden Security
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                All BH and GH residential blocks feature automated biometric gates, FSSAI-certified dining halls, and Uni-Hospital support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
