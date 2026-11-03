"use client";
import { useState } from "react";

export default function LpuLogo({
  size = 42,
  showText = true,
  subtitle = "Hostel Allocation Portal",
  theme = "light",
}) {
  const [imgError, setImgError] = useState(false);
  const isDark = theme === "dark";

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          minWidth: `${size}px`,
          minHeight: `${size}px`,
        }}
        className={`rounded-xl bg-white p-0.5 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs transition-transform duration-200 hover:scale-105 ${
          isDark ? "border border-stone-700" : "border border-stone-200"
        }`}
      >
        {!imgError ? (
          <img
            src="/images/lpu/lpu-logo-media.png"
            alt="Lovely Professional University Official Logo"
            style={{ width: "100%", height: "100%" }}
            className="w-full h-full object-contain block"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
          >
            <defs>
              <linearGradient id="lpuGradBrand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id="goldGradBrand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#CA8A04" />
              </linearGradient>
            </defs>
            <rect width="240" height="240" rx="52" fill="url(#lpuGradBrand)" />
            <polygon points="120,62 82,88 158,88" fill="url(#goldGradBrand)" />
            <rect x="86" y="88" width="68" height="66" rx="4" fill="#FFFFFF" />
            <circle cx="120" cy="50" r="7" fill="url(#goldGradBrand)" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-extrabold text-[16px] tracking-tight ${
                isDark ? "text-white" : "text-stone-900"
              }`}
            >
              LPU <span className="text-[var(--primary)]">HOSTEL</span>
            </span>
          </div>
          <span
            className={`text-[11px] font-medium tracking-wide mt-1 leading-none ${
              isDark ? "text-stone-400" : "text-stone-500"
            }`}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
