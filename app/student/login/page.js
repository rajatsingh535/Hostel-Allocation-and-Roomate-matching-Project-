"use client";
import { useState } from "react";
import Link from "next/link";
import LpuLogo from "../../components/LpuLogo";

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
    buildingImg: "/images/lpu/girls-hostel.webp",
    roomImg: "/images/lpu/girls-hostel-room.webp",
    desc: "System automatically recommends LPU Girls Hostels (GH-1 to GH-3) featuring a gated residential enclave, 24/7 female wardens, multi-tier biometric security, and in-house dining.",
  },
};

export default function StudentLogin() {
  const [formData, setFormData] = useState({
    regNo: "",
    password: "",
    gender: "", // Asks user if Male or Female at login time
    studentName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAutofill = (genderChoice = "Male") => {
    if (genderChoice === "Female") {
      setFormData({
        regNo: "12304568",
        password: "password123",
        gender: "Female",
        studentName: "Priya Patel",
      });
    } else {
      setFormData({
        regNo: "12304567",
        password: "password123",
        gender: "Male",
        studentName: "Arjun Sharma",
      });
    }
    setError("");
  };

  const handleGenderSelect = (selectedGender) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
      studentName:
        prev.studentName ||
        (selectedGender === "Female" ? "Priya Patel" : "Arjun Sharma"),
    }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.gender) {
      setError("Please select whether you are Male (Boy) or Female (Girl) so we can recommend the right hostel (BH or GH).");
      return;
    }
    if (!formData.regNo.trim() || !formData.password.trim()) {
      setError("Please fill in your Registration Number and Password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      localStorage.setItem("lpu_student_gender", formData.gender);
      localStorage.setItem("lpu_student_roll", formData.regNo.trim());
      localStorage.setItem(
        "lpu_student_name",
        formData.studentName ||
          (formData.gender === "Female" ? "Priya Patel" : "Arjun Sharma")
      );
    } catch (_) {}

    setTimeout(() => {
      window.location.href = `/student/dashboard?gender=${encodeURIComponent(formData.gender)}&roll=${encodeURIComponent(formData.regNo.trim())}`;
    }, 600);
  };

  const activeRec = formData.gender ? GENDER_RECOMMENDATIONS[formData.gender] : null;

  return (
    <div className="min-h-screen bg-[var(--bg-alt)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Login Form + Gender Selection */}
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

          <div className="flex items-center gap-3.5 mb-6">
            <LpuLogo size={48} showText={false} />
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Student Hostel Login
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Lovely Professional University · Smart Gender-Based BH / GH Recommendation
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Demo Autofill for Boys (BH) and Girls (GH) */}
          <div className="mb-6">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Quick Demo Autofill (Select Male or Female)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleAutofill("Male")}
                className="py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/70 text-[var(--primary-dark)] hover:bg-orange-100/80 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>👦 Demo Boy Login (BH)</span>
              </button>
              <button
                type="button"
                onClick={() => handleAutofill("Female")}
                className="py-2.5 px-3 rounded-xl border border-orange-200 bg-orange-50/70 text-[var(--primary-dark)] hover:bg-orange-100/80 transition-all text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>👧 Demo Girl Login (GH)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                      src="/images/lpu/girls-hostel.webp"
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

            {/* Registration Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                Registration Number (UMS ID)
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
                placeholder="Enter your UMS password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-light"
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
                    Loading {formData.gender === "Female" ? "Girls (GH)" : "Boys (BH)"} Recommendations…
                  </span>
                </>
              ) : (
                <>
                  <span>
                    Sign In &amp; View Recommended{" "}
                    {formData.gender === "Female"
                      ? "Girls Hostels (GH)"
                      : formData.gender === "Male"
                      ? "Boys Hostels (BH)"
                      : "Hostels"}
                  </span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>

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
