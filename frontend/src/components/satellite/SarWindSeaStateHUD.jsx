import React, { useState } from 'react';
import { Wind, Waves, Compass, Activity, ArrowUp } from 'lucide-react';

export default function SarWindSeaStateHUD({
  radarLookAngleDeg = 78,
  windHeadingDeg = 240
}) {
  const [retrievedWindMs, setRetrievedWindMs] = useState(6.8); // 6.8 m/s ~ 13.2 knots

  const windKnots = (retrievedWindMs * 1.94384).toFixed(1);

  // Sea State calculations based on World Meteorological Organization / Douglas Sea Scale
  let douglasCode = 3;
  let seaStateName = "State 3 (Slight Seas)";
  let waveHeightM = "0.5 - 1.25 m";
  let beaufortForce = "Force 4 (Moderate Breeze)";

  if (retrievedWindMs < 1.5) {
    douglasCode = 0;
    seaStateName = "State 0 (Calm Glassy)";
    waveHeightM = "0.0 m";
    beaufortForce = "Force 0-1 (Light Air)";
  } else if (retrievedWindMs < 3.3) {
    douglasCode = 1;
    seaStateName = "State 1 (Rippled)";
    waveHeightM = "0.1 m";
    beaufortForce = "Force 2 (Light Breeze)";
  } else if (retrievedWindMs < 5.5) {
    douglasCode = 2;
    seaStateName = "State 2 (Smooth Wavelets)";
    waveHeightM = "0.2 - 0.5 m";
    beaufortForce = "Force 3 (Gentle Breeze)";
  } else if (retrievedWindMs < 8.0) {
    douglasCode = 3;
    seaStateName = "State 3 (Slight Seas)";
    waveHeightM = "0.5 - 1.25 m";
    beaufortForce = "Force 4 (Moderate Breeze)";
  } else if (retrievedWindMs < 10.8) {
    douglasCode = 4;
    seaStateName = "State 4 (Moderate Sea)";
    waveHeightM = "1.25 - 2.5 m";
    beaufortForce = "Force 5 (Fresh Breeze)";
  } else {
    douglasCode = 5;
    seaStateName = "State 5 (Rough Seas)";
    waveHeightM = "2.5 - 4.0 m";
    beaufortForce = "Force 6+ (Strong Breeze / Gale)";
  }

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 13 · SAR Wind Field Retrieval &amp; Sea State (CMOD5.N)
          </h3>
        </div>
        <span className="text-[10px] bg-ocean-light text-ocean px-2 py-0.5 rounded font-bold border border-border-marine">
          Empirical C-Band GMF
        </span>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">INVERTED 10M WIND</span>
          <span className="text-base font-bold text-ocean-navy">{retrievedWindMs} m/s</span>
          <span className="text-[9px] text-text-secondary block">({windKnots} knots)</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">WIND DIRECTION</span>
          <span className="text-base font-bold text-ocean">{windHeadingDeg}&deg; (WSW)</span>
          <span className="text-[9px] text-text-secondary block">SAR Streaks Azimuth</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">DOUGLAS SEA STATE</span>
          <span className="text-base font-bold text-status-success">{seaStateName.split(' ')[0]} {seaStateName.split(' ')[1]}</span>
          <span className="text-[9px] text-text-secondary block">Hs: {waveHeightM}</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40">
          <span className="text-[9px] text-text-muted block">BEAUFORT FORCE</span>
          <span className="text-base font-bold text-ocean-navy">{beaufortForce.split(' ')[0]} {beaufortForce.split(' ')[1]}</span>
          <span className="text-[9px] text-text-secondary block">{beaufortForce.split('(')[1]?.replace(')', '') || ''}</span>
        </div>
      </div>

      {/* Wind Speed Tuning Bar */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-border-marine text-xs space-y-1.5">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-text-muted font-bold">CMOD5.N RETRIEVED WIND SPEED ADJUSTMENT</span>
          <span className="text-ocean font-bold">{retrievedWindMs} m/s &rarr; {seaStateName}</span>
        </div>
        <input
          type="range"
          min="1.0"
          max="15.0"
          step="0.2"
          value={retrievedWindMs}
          onChange={(e) => setRetrievedWindMs(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-border-marine rounded accent-ocean cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-text-muted">
          <span>1.0 m/s (Calm Slick False Positive Risk)</span>
          <span>7.0 m/s (Optimal Damping Window)</span>
          <span>15.0 m/s (Wave Breaking)</span>
        </div>
      </div>
    </div>
  );
}

