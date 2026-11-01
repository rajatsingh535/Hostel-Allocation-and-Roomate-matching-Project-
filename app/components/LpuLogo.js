"use client";
import { useState } from "react";

export default function LpuLogo({ size = 42, showText = true, subtitle = "Hostel Allocation Portal" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 select-none">
      {!imgError ? (
        <img
          src="/favicon.ico"
          alt="LPU Logo"
          width={size}
          height={size}
          className="rounded-xl object-contain drop-shadow-sm flex-shrink-0 transition-transform duration-200 hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
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

          {/* Outer rounded brand badge */}
          <rect width="240" height="240" rx="52" fill="url(#lpuGradBrand)" />

          {/* Shield outline */}
          <path
            d="M120 32C150 48 185 52 185 52V124C185 168 152 198 120 208C88 198 55 168 55 124V52C55 52 90 48 120 32Z"
            fill="#FFFFFF"
            fillOpacity="0.12"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Campus tower pediment */}
          <polygon points="120,62 82,88 158,88" fill="url(#goldGradBrand)" />

          {/* Central building */}
          <rect x="86" y="88" width="68" height="66" rx="4" fill="#FFFFFF" />

          {/* Windows */}
          <rect x="94" y="96" width="10" height="22" rx="5" fill="#C2410C" />
          <rect x="115" y="96" width="10" height="22" rx="5" fill="#C2410C" />
          <rect x="136" y="96" width="10" height="22" rx="5" fill="#C2410C" />

          {/* Arch */}
          <path d="M110 154V134C110 128.5 114.5 124 120 124C125.5 124 130 128.5 130 134V154H110Z" fill="#C2410C" />

          {/* Star */}
          <circle cx="120" cy="50" r="7" fill="url(#goldGradBrand)" />

          {/* Monogram ribbon */}
          <rect x="74" y="162" width="92" height="22" rx="11" fill="url(#goldGradBrand)" />
          <text
            x="120"
            y="178"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="13"
            fill="#7C2D12"
            letterSpacing="2.5"
          >
            LPU
          </text>
        </svg>
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-2 leading-none">
            <span className="font-extrabold text-[16px] tracking-tight text-stone-900">
              LPU <span className="text-[var(--primary)]">HOSTEL</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-stone-500 tracking-wide mt-1 leading-none">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
