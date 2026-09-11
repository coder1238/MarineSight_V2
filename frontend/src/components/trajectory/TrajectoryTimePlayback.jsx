import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Clock, 
  Compass, 
  Navigation, 
  Gauge, 
  AlertTriangle,
  Flame,
  Radio
} from 'lucide-react';
import { TELEMETRY_POINTS } from './trajectoryData';

export default function TrajectoryTimePlayback({ 
  currentPointIndex, 
  onPointChange,
  isPlaying,
  onTogglePlay,
  playSpeed,
  onChangeSpeed
}) {
  const currentPoint = TELEMETRY_POINTS[currentPointIndex] || TELEMETRY_POINTS[0];
  const totalPoints = TELEMETRY_POINTS.length;

  const keyEvents = [
    { index: 2, label: "Baseline (22:10)", desc: "13.2 kn cruise" },
    { index: 5, label: "Decel (22:20)", desc: "Speed drop to 8.4 kn" },
    { index: 7, label: "Blackout (22:24)", desc: "Transponder cut" },
    { index: 12, label: "Spill Zone (22:42)", desc: "CPA 1.4 nm" },
    { index: 17, label: "AIS Online (23:02)", desc: "Signal restored" },
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Top Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Time-Warp 4D Trajectory Scrubber & Kinematic HUD
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-sky text-ocean font-bold">
            POINT {currentPointIndex + 1} / {totalPoints}
          </span>
        </div>

        {/* Playback Button Group */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => onPointChange(0)}
            title="Rewind to Start"
            className="p-1.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-status-warning text-white hover:bg-amber-600'
                : 'bg-ocean text-white hover:bg-ocean-deep'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play 4D Track</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-ocean-light rounded-lg border border-border-marine p-0.5 text-[10px]">
            {["1x", "2x", "5x", "10x"].map((spd) => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded font-bold transition-colors ${
                  playSpeed === spd
                    ? 'bg-ocean text-white shadow-xs'
                    : 'text-text-secondary hover:text-ocean-navy'
                }`}
              >
                {spd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-text-muted text-[10px]">22:00:00 UTC (T-42m)</span>
          <span className="font-bold text-ocean-navy text-[11px] bg-ocean-sky/60 px-2 py-0.5 rounded border border-ocean/20">
            Current Scrubber Time: {currentPoint.time}
          </span>
          <span className="text-text-muted text-[10px]">11:30:00 UTC (T+12h)</span>
        </div>

        <input 
          type="range"
          min="0"
          max={totalPoints - 1}
          value={currentPointIndex}
          onChange={(e) => onPointChange(parseInt(e.target.value))}
          className="w-full h-2 bg-ocean-light rounded-lg appearance-none cursor-pointer accent-ocean focus:outline-none"
        />

        {/* Quick Jump Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
          {keyEvents.map((evt) => {
            const isActive = currentPointIndex === evt.index;
            return (
              <button
                key={evt.index}
                onClick={() => onPointChange(evt.index)}
                className={`p-1.5 rounded-lg text-left transition-all border font-mono ${
                  isActive 
                    ? 'bg-ocean-sky border-ocean text-ocean-navy shadow-xs ring-1 ring-ocean/30' 
                    : 'bg-ocean-light/50 border-border-marine/60 text-text-secondary hover:bg-white hover:border-ocean/40'
                }`}
              >
                <span className="text-[9px] font-bold block text-ocean truncate">{evt.label}</span>
                <span className="text-[8px] text-text-muted block truncate">{evt.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Kinematic HUD Readout */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-border-marine font-mono text-xs">
        <div className="p-2 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <Compass className="w-3 h-3 text-ocean" />
            COORDINATES
          </span>
          <span className="font-bold text-ocean-navy text-[11px] block mt-0.5">
            {currentPoint.lat.toFixed(3)}°N, {currentPoint.lng.toFixed(3)}°E
          </span>
        </div>

        <div className="p-2 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <Gauge className="w-3 h-3 text-ocean" />
            SPEED OVER GROUND
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[11px] font-bold ${currentPoint.sog < 6 ? 'text-status-danger' : 'text-ocean-navy'}`}>
              {currentPoint.sog} kn
            </span>
            {currentPoint.sog < 6 && (
              <span className="text-[8px] text-status-danger font-bold uppercase">(Loitering)</span>
            )}
          </div>
        </div>

        <div className="p-2 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <Navigation className="w-3 h-3 text-ocean" />
            COURSE OVER GROUND
          </span>
          <span className="font-bold text-ocean-navy text-[11px] block mt-0.5">
            {currentPoint.cog}° T
          </span>
        </div>

        <div className="p-2 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <RotateCcw className="w-3 h-3 text-ocean" />
            RATE OF TURN
          </span>
          <span className={`font-bold text-[11px] block mt-0.5 ${Math.abs(currentPoint.rot) > 4 ? 'text-status-warning' : 'text-ocean-navy'}`}>
            {currentPoint.rot > 0 ? `+${currentPoint.rot}` : currentPoint.rot}°/min
          </span>
        </div>

        <div className="p-2 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <Radio className="w-3 h-3 text-ocean" />
            DATA SOURCE
          </span>
          <span className="font-bold text-ocean text-[10px] block mt-0.5 truncate">
            {currentPoint.source}
          </span>
        </div>

        <div className="p-2 bg-ocean-light rounded-xl border border-border-marine">
          <span className="text-[9px] text-text-muted flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-ocean" />
            SEGMENT STATUS
          </span>
          <span className={`text-[10px] font-bold block mt-0.5 uppercase ${
            currentPoint.status === 'spill_intersection' 
              ? 'text-status-danger' 
              : currentPoint.status === 'blackout_start' || currentPoint.status === 'reconstructed'
                ? 'text-status-warning'
                : 'text-status-success'
          }`}>
            {currentPoint.status.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );
}

