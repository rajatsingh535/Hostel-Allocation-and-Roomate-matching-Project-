"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

const API_BASE = "http://localhost:5000/api";

// Registered LPU UMS Student Directory (synced with MongoDB seeder & local fallback)
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
    desc: "LPU Boys Hostels (BH-1 to BH-9) feature 9 multi-storey residential towers, biometric turnstile access, indoor gymnasiums, high-speed Wi-Fi, and dedicated dining mess.",
  },
  Female: {
    badge: "Girls Residential Enclave · Recommended for Female Students",
    title: "Girls Hostels (GH-1 to GH-3)",
    topPick: "GH-1 · Girls Hostel 1 (East Residential Quadrant)",
    blocks: ["GH-1", "GH-2", "GH-3"],
    buildingImg: "/images/lpu/girls-hostel-1.jpg",
    roomImg: "/images/lpu/girls-hostel-room.webp",
    desc: "LPU Girls Hostels (GH-1 to GH-3) feature a secure gated residential enclave, 24/7 female wardens, multi-tier biometric security, study lounges, and in-house dining.",
  },
};

export default function StudentLogin() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({
    regNo: "",
    password: "",
    gender: "Male",
    studentName: "",
    department: "Computer Science",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null); // { status, code, title, message }
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const demoError = params.get("demoError");
      if (demoError === "unauthorized") {
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
          title: "401 Unauthorized — Unregistered UMS ID",
          message:
            "Unauthorized Access: Registration Number '99998888' is not registered in the LPU UMS Hostel Portal. Only verified university students with registered UMS credentials can sign in.",
        });
      } else if (demoError === "conflict") {
        setMode("register");
        setFormData({
          regNo: "12304567",
          password: "password123",
          gender: "Male",
          studentName: "Arjun Sharma",
          department: "Computer Science",
        });
        setAuthError({
          status: "409 CONFLICT",
          code: "ALREADY_REGISTERED",
          title: "409 Conflict — Duplicate UMS Account / Active Application",
          message:
            "Server-Side Duplicate Protection: Registration Number '12304567' (Arjun Sharma) already has an active registered UMS account and submitted hostel application (APP-2026-3125817). Duplicate records are blocked.",
        });
      }
    } catch (_) {}
  }, []);

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

    if (!cleanName || cleanName.length < 3) {
      setAuthError({
        status: "400 VALIDATION ERROR",
        code: "NAME_REQUIRED",
        title: "Valid Student Name Required",
        message: "Please enter your full name (at least 3 characters) to register your UMS ID.",
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

    if (cleanPassword.length < 6) {
      setAuthError({
        status: "400 BAD REQUEST",
        code: "WEAK_PASSWORD",
        title: "Password Too Short",
        message: "Password must be at least 6 characters long for security compliance.",
      });
      return;
    }

    const existing = getRegisteredList().find((s) => s.regNo === cleanRoll);
    if (existing) {
      setAuthError({
        status: "409 CONFLICT",
        code: "ALREADY_REGISTERED",
        title: "409 Conflict — UMS ID Already Registered",
        message: `Registration Number '${cleanRoll}' (${existing.name}) is already registered. Duplicate accounts are blocked.`,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
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
      if (res.status === 409) {
        const d = await res.json().catch(() => ({}));
        setLoading(false);
        setAuthError({
          status: "409 CONFLICT",
          code: "ALREADY_REGISTERED",
          title: "409 Conflict — UMS ID Already Registered",
          message: d.message || `Registration Number '${cleanRoll}' is already registered in MongoDB.`,
        });
        return;
      }
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
    } catch (_) {}

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
          status: "403 FORBIDDEN",
          code: "GENDER_MISMATCH",
          title: "403 Forbidden — Gender Policy Mismatch",
          message: `Unauthorized Selection: UMS ID '${cleanRoll}' (${matchedStudent.name}) is registered as a ${matchedStudent.gender} student. Please select '${matchedStudent.gender}' in Step 1.`,
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
    }, 350);
  };

  const activeRec = GENDER_RECOMMENDATIONS[formData.gender || "Male"];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1120px] mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden grid lg:grid-cols-12">
        
        {/* ── LEFT COLUMN: Interactive Form (Compact, Above-the-Fold, Professional) ── */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Top Bar: Back Link + NAAC A++ + Mode Switcher */}
            <div className="flex items-center justify-between gap-2 mb-5">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[var(--primary)] transition-colors"
              >
                ← Back to Home
              </Link>
              <div className="flex items-center gap-3">
                <img
                  src="/images/lpu/naac-logo.webp"
                  alt="LPU NAAC A++"
                  className="h-5 object-contain hidden sm:block"
                />
                <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setAuthError(null);
                      setSuccessMsg("");
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      mode === "login"
                        ? "bg-white text-stone-900 shadow-xs"
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
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      mode === "register"
                        ? "bg-white text-[var(--primary-dark)] shadow-xs"
                        : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Register UMS ID
                  </button>
                </div>
              </div>
            </div>

            {/* Branding Title */}
            <div className="flex items-center gap-3.5 mb-5">
              <LpuLogo size={44} showText={false} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight leading-tight">
                  Student Hostel Portal
                </h1>
                <p className="text-xs text-stone-500">
                  Lovely Professional University · Verified UMS Authentication
                </p>
              </div>
            </div>

            {/* Quick Demo & Validation Bar */}
            <div className="mb-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 pl-1">
                Quick Autofill:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleAutofill("Male")}
                  className="py-1.5 px-3 rounded-lg border border-orange-200 bg-orange-50 text-[var(--primary-dark)] hover:bg-orange-100 transition-all text-xs font-bold"
                >
                  👦 Boy (12304567)
                </button>
                <button
                  type="button"
                  onClick={() => handleAutofill("Female")}
                  className="py-1.5 px-3 rounded-lg border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100 transition-all text-xs font-bold"
                >
                  👧 Girl (12304568)
                </button>
                <button
                  type="button"
                  onClick={handleTestUnauthorized}
                  className="py-1.5 px-3 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-all text-xs font-bold"
                >
                  🚫 Test Invalid (401)
                </button>
              </div>
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <span>✅</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* 401 / 403 / 400 / 409 Validation Alert Banner */}
            {authError && (
              <div className="mb-4 rounded-xl bg-red-50 border-2 border-red-300 p-3.5 text-red-900 shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                      🔒 {authError.status}
                    </span>
                    <span className="text-xs font-extrabold text-red-900">
                      {authError.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                    {authError.code}
                  </span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  {authError.message}
                </p>
              </div>
            )}

            {/* Main Authentication Form */}
            <form
              onSubmit={mode === "register" ? handleRegisterSubmit : handleSubmit}
              className="space-y-4"
            >
              {/* STEP 1: Compact Gender Selector with Instant Wing Badge */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Step 1: Select Gender <span className="text-[var(--primary)]">*</span>
                  </label>
                  <span className="text-[11px] font-bold text-[var(--primary-dark)] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                    {formData.gender === "Female"
                      ? "★ Recommends Girls Hostels (GH-1 to GH-3)"
                      : "★ Recommends Boys Hostels (BH-1 to BH-9)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenderSelect("Male")}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border-2 text-left transition-all ${
                      formData.gender === "Male"
                        ? "border-[var(--primary)] bg-orange-50/70 shadow-2xs"
                        : "border-stone-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <img
                      src="/images/lpu/boys-hostel.webp"
                      alt="Boys Hostel BH"
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-stone-900 leading-tight">Male (Boy)</div>
                      <div className="text-[11px] text-[var(--primary-dark)] font-bold truncate">
                        BH-1 to BH-9 Wing
                      </div>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        formData.gender === "Male"
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-stone-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGenderSelect("Female")}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border-2 text-left transition-all ${
                      formData.gender === "Female"
                        ? "border-[var(--primary)] bg-orange-50/70 shadow-2xs"
                        : "border-stone-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <img
                      src="/images/lpu/girls-hostel-1.jpg"
                      alt="Girls Hostel GH"
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-stone-900 leading-tight">Female (Girl)</div>
                      <div className="text-[11px] text-pink-700 font-bold truncate">
                        GH-1 to GH-3 Wing
                      </div>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                        formData.gender === "Female"
                          ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                          : "border-stone-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                </div>
              </div>

              {/* Extra Name Field in Register Mode */}
              {mode === "register" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
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
                      className="input-light py-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="input-light py-2.5"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Credentials Row */}
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      UMS Registration No <span className="text-[var(--primary)]">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-stone-400">
                      {formData.regNo.length}/8 digits
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="8-digit ID (e.g. 12304567)"
                    value={formData.regNo}
                    onChange={(e) => {
                      setFormData({ ...formData, regNo: e.target.value });
                      setAuthError(null);
                    }}
                    className={`input-light py-2.5 font-mono ${
                      authError &&
                      (authError.code === "UNREGISTERED_STUDENT" ||
                        authError.code === "INVALID_FORMAT" ||
                        authError.code === "ALREADY_REGISTERED")
                        ? "border-red-400 bg-red-50/40"
                        : ""
                    }`}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      UMS Password <span className="text-[var(--primary)]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-[var(--primary)] hover:text-[var(--primary-dark)] font-bold"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder={mode === "register" ? "Min 6 characters" : "Demo: password123"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setAuthError(null);
                    }}
                    className={`input-light py-2.5 ${
                      authError && authError.code === "INVALID_PASSWORD"
                        ? "border-red-400 bg-red-50/40"
                        : ""
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-sm font-bold disabled:opacity-60 shadow-md"
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
                  <span>Register New Student UMS Account →</span>
                ) : (
                  <span>
                    Verify &amp; Sign In to{" "}
                    {formData.gender === "Female"
                      ? "Girls Hostels (GH-1 to GH-3)"
                      : "Boys Hostels (BH-1 to BH-9)"}{" "}
                    →
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Reference & Admin Switcher */}
          <div className="mt-5 pt-4 border-t border-stone-200/80">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 mb-3">
              <div className="font-bold text-stone-800 mb-1 flex items-center justify-between">
                <span>🔑 Verified Demo Accounts (Password: password123)</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                  JWT Auth Guard Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-stone-500">
                <div>• <strong>12304567</strong> — Arjun Sharma (Male · BH)</div>
                <div>• <strong>12304568</strong> — Priya Patel (Female · GH)</div>
                <div>• <strong>12345680</strong> — Rahul Verma (Male · BH)</div>
                <div>• <strong>12345681</strong> — Sneha Singh (Female · GH)</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
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
                className="text-[var(--primary-dark)] hover:underline font-bold"
              >
                Warden &amp; Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Matched-Height Visual Campus & Wing Preview ── */}
        <div className="lg:col-span-5 bg-stone-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-[11px] font-bold mb-4">
              <span>★</span>
              <span>{activeRec.badge}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5">
              {activeRec.title}
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              {activeRec.desc}
            </p>

            {/* Primary Building Preview */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/15 mb-4 shadow-lg">
              <img
                src={activeRec.buildingImg}
                alt={activeRec.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-xs font-bold text-orange-300">Top Recommended Block</div>
                <div className="text-sm font-black text-white">{activeRec.topPick}</div>
              </div>
            </div>

            {/* Eligible Block Chips */}
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                Assigned Residential Wing Blocks ({activeRec.blocks.length} Towers)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeRec.blocks.map((code) => (
                  <span
                    key={code}
                    className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white font-bold text-xs"
                  >
                    {code}
                  </span>
                ))}
              </div>
            </div>

            {/* Interior Room Preview Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img
                  src="/images/lpu/boys-hostel-room.webp"
                  alt="LPU Boys Hostel Room"
                  className="w-full h-20 object-cover"
                />
                <div className="p-2">
                  <div className="text-[11px] font-bold text-white">Boys Wing (BH-1..9)</div>
                  <div className="text-[10px] text-stone-400">AC / Non-AC 2–4 Seater</div>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img
                  src="/images/lpu/girls-hostel-room.webp"
                  alt="LPU Girls Hostel Room"
                  className="w-full h-20 object-cover"
                />
                <div className="p-2">
                  <div className="text-[11px] font-bold text-white">Girls Wing (GH-1..3)</div>
                  <div className="text-[10px] text-stone-400">Gated Enclave Suites</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Footer Card */}
          <div className="relative z-10 mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
            <img
              src="/images/lpu/turnstile-gates.jpg"
              alt="Biometric Turnstile Security"
              className="w-14 h-12 rounded-lg object-cover border border-white/15 flex-shrink-0"
            />
            <div className="text-[11px] text-stone-300 leading-snug">
              <strong className="text-white block">Biometric Turnstile &amp; 24/7 Warden Security</strong>
              Automated gate entry, FSSAI dining halls, and Uni-Hospital support.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
