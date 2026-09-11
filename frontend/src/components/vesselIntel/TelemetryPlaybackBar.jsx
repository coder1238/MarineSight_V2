import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Compass, Activity, Gauge } from 'lucide-react';

export default function TelemetryPlaybackBar({ vessel, onHourChange }) {
  const [currentHour, setCurrentHour] = useState(24); // 0 to 24 (0 = T-24h, 24 = T+0)
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 5x

  // Blackout is situated around hours 18 to 21 (approx 22:24 to 23:02 UTC)
  const isBlackoutWindow = currentHour >= 18 && currentHour <= 21;

  // Compute interpolated telemetry based on scrubbed hour
  const baseLat = vessel.pos?.lat || 15.12;
  const baseLng = vessel.pos?.lng || 69.15;
  const progressRatio = currentHour / 24;

  // Reconstructed telemetry along transit corridor
  const simulatedLat = (baseLat - 0.35 + progressRatio * 0.35).toFixed(4);
  const simulatedLng = (baseLng - 0.70 + progressRatio * 0.70).toFixed(4);
  
  // Speed dips to ~3.8kn during blackout
  let simulatedSpeed = 13.2;
  if (currentHour >= 18 && currentHour <= 21) {
    simulatedSpeed = 3.8;
  } else if (currentHour === 17 || currentHour === 22) {
    simulatedSpeed = 8.5;
  } else if (currentHour > 22) {
    simulatedSpeed = vessel.speedKn || 12.4;
  }

  const simulatedHeading = isBlackoutWindow ? 278 : 284;
  const engineLoadPct = isBlackoutWindow ? 28 : 78;

  // Playback loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentHour((prev) => {
          if (prev >= 24) {
            setIsPlaying(false);
            return 24;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleJumpToBlackout = () => {
    setCurrentHour(19);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentHour(0);
    setIsPlaying(false);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono text-xs">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              24-Hour Telemetry Playback & Reconstruction Scrubber
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Dynamic time-series reconstruction of vessel trajectory across the incident window
            </p>
          </div>
        </div>

        {/* Play / Pause / Speed buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border-marine hover:bg-ocean-light text-text-muted hover:text-text-primary transition-colors"
            title="Rewind to T-24h"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              isPlaying 
                ? 'bg-status-warning text-white'
                : 'bg-ocean hover:bg-ocean-deep text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play 24h</span>
              </>
            )}
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 5 : 1))}
            className="px-2 py-1 rounded-lg bg-ocean-light border border-border-marine text-ocean-deep font-bold text-[10px] flex items-center gap-1"
          >
            <FastForward className="w-3 h-3 text-ocean" />
            <span>{playbackSpeed}x Speed</span>
          </button>

          {/* Jump to Blackout Button */}
          <button
            onClick={handleJumpToBlackout}
            className="px-2.5 py-1 rounded-lg bg-red-50 text-status-danger border border-red-200 text-[10px] font-bold hover:bg-red-100 transition-colors"
          >
            Jump to Blackout
          </button>
        </div>
      </div>

      {/* Scrubbing Slider & Time Ticks */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-text-muted">T-24h (00:00 UTC)</span>
          <span className={`px-2 py-0.5 rounded font-bold ${
            isBlackoutWindow ? 'bg-red-100 text-status-danger' : 'bg-ocean-sky text-ocean-deep'
          }`}>
            CURRENT: T-{24 - currentHour}h ({`${String(Math.floor(currentHour)).padStart(2, '0')}:00 UTC`})
            {isBlackoutWindow && ' [AIS BLACKOUT]'}
          </span>
          <span className="text-text-muted">T+0 (Now)</span>
        </div>

        <input
          type="range"
          min="0"
          max="24"
          step="1"
          value={currentHour}
          onChange={(e) => {
            setCurrentHour(parseInt(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full accent-ocean h-2 bg-ocean-light rounded-lg appearance-none cursor-pointer"
        />

        {/* Timeline Event Markers */}
        <div className="relative h-4 text-[8px] text-text-muted">
          <span className="absolute left-0">Corridor Entry</span>
          <span className="absolute left-[75%] -translate-x-1/2 text-status-danger font-bold">
            ▼ Spill Origin Intersection (3.8 kn)
          </span>
          <span className="absolute right-0">Current Pos</span>
        </div>
      </div>

      {/* Dynamic Telemetry Readout Grid at Current Timestamp */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">COORDINATES</span>
          <span className="font-bold text-ocean-navy block mt-0.5">
            {simulatedLat}°N, {simulatedLng}°E
          </span>
          <span className="text-[9px] text-text-muted">Corridor segment</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">SPEED OVER GROUND (SOG)</span>
          <span className={`font-bold block mt-0.5 ${simulatedSpeed <= 4.5 ? 'text-status-danger text-base' : 'text-ocean-deep text-base'}`}>
            {simulatedSpeed.toFixed(1)} kn
          </span>
          <span className="text-[9px] text-text-muted">
            {simulatedSpeed <= 4.5 ? 'Severe anomaly trough' : 'Standard cruising'}
          </span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">COURSE OVER GROUND (COG)</span>
          <span className="font-bold text-ocean-navy block mt-0.5">
            {simulatedHeading}° True
          </span>
          <span className="text-[9px] text-text-muted">Transit bearing</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <span className="text-[9px] text-text-muted block">PROPULSION LOAD</span>
          <span className={`font-bold block mt-0.5 ${engineLoadPct < 40 ? 'text-status-warning text-base' : 'text-text-primary text-base'}`}>
            {engineLoadPct}% MCR
          </span>
          <span className="text-[9px] text-text-muted">Shaft revolutions</span>
        </div>
      </div>
    </div>
  );
}

