import React from 'react';
import logoImg from '../../assets/logo.jpg';

/**
 * MarineSight Unified Logo Component
 * - 'full': Displays official MarineSight logo with optional tagline
 * - 'mark': Displays professional optical sight + oceanic wave badge (matching favicon)
 * - 'collapsed': Streamlined 40x40 icon mark for collapsed sidebar
 * - 'dark': Contrast badge for dark backgrounds (footer/panels)
 */
export default function MarineSightLogo({ 
  variant = "full", 
  collapsed = false, 
  className = "",
  showTagline = true,
  onClick 
}) {
  // Collapsed or Mark variant: Matches the new professional favicon design
  if (collapsed || variant === "mark") {
    return (
      <div 
        onClick={onClick}
        className={`w-10 h-10 rounded-xl bg-gradient-to-br from-[#081E34] via-[#051424] to-[#020912] border border-[#13385C] flex items-center justify-center text-white shadow-marine-md flex-shrink-0 relative select-none cursor-pointer group hover:border-[#00F5FF]/50 transition-all ${className}`}
        title="MarineSight Platform"
      >
        <svg 
          viewBox="0 0 64 64" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-7 h-7 transform group-hover:scale-105 transition-transform"
        >
          <defs>
            <linearGradient id="markWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#00B4D8" />
              <stop offset="100%" stopColor="#00F5FF" />
            </linearGradient>
            <linearGradient id="markScopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Outer Sight / Scope Ring */}
          <circle cx="32" cy="32" r="21" stroke="url(#markScopeGrad)" strokeWidth="2" strokeDasharray="28 5 28 5" strokeLinecap="round" />

          {/* Optical Reticle Ticks */}
          <line x1="32" y1="7" x2="32" y2="11.5" stroke="#00F5FF" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="32" y1="52.5" x2="32" y2="57" stroke="#00F5FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <line x1="7" y1="32" x2="11.5" y2="32" stroke="#00F5FF" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          <line x1="52.5" y1="32" x2="57" y2="32" stroke="#00F5FF" strokeWidth="2.2" strokeLinecap="round" />

          {/* Dynamic Marine Wave */}
          <path d="M11 44.5C17 37 23.5 44 32.5 38.5C39.5 34 45 35 53 28.5C49 41.5 42 47.5 32 47.5C22 47.5 15 46 11 44.5Z" fill="url(#markWaveGrad)" />
          <path d="M12 44C17.5 37.2 24 43.8 32.5 38C39.5 33.5 45.2 34.5 52.8 28.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.95" />

          {/* Sight Reticle Eye Core */}
          <circle cx="32" cy="22" r="5.5" stroke="#00F5FF" strokeWidth="1.8" fill="#061626" />
          <circle cx="32" cy="22" r="2.2" fill="#00F5FF" />
          <line x1="32" y1="13.5" x2="32" y2="15.5" stroke="#00F5FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="32" y1="28.5" x2="32" y2="30.5" stroke="#00F5FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="23.5" y1="22" x2="25.5" y2="22" stroke="#00F5FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="38.5" y1="22" x2="40.5" y2="22" stroke="#00F5FF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Live Operational Status Indicator */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-status-success rounded-full ring-2 ring-white animate-pulse"></span>
      </div>
    );
  }

  // Dark variant for dark footer or dark panels
  if (variant === "dark") {
    return (
      <div onClick={onClick} className={`flex items-center gap-3 select-none ${className}`}>
        <div className="bg-white/95 p-1 px-2 rounded-lg shadow-sm border border-white/20">
          <img 
            src={logoImg} 
            alt="MarineSight" 
            className="h-7 w-auto object-contain" 
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/logo.jpg";
            }}
          />
        </div>
        {showTagline && (
          <div>
            <p className="font-black text-sm tracking-wider text-white">MARINESIGHT PLATFORM</p>
            <p className="text-[11px] text-white/60">Detect. Trace. Attribute. Protect.</p>
          </div>
        )}
      </div>
    );
  }

  // Full default view (Light background)
  return (
    <div onClick={onClick} className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className="flex flex-col">
        <img 
          src={logoImg} 
          alt="MarineSight" 
          className="h-7 sm:h-8 w-auto object-contain" 
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/logo.jpg";
          }}
        />
        {showTagline && (
          <span className="text-[9px] text-text-muted font-medium tracking-tight truncate pl-0.5 mt-0.5">
            Detect. Trace. Attribute.
          </span>
        )}
      </div>
    </div>
  );
}

