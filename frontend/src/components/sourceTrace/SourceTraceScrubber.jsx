import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, History } from 'lucide-react';

export default function SourceTraceScrubber({
  currentHour,
  maxHours = 72,
  isPlaying,
  playSpeed,
  onTogglePlay,
  onSpeedChange,
  onHourChange,
  onReset,
  estimatedSpillHour = 40,
  referenceDate = "2026-09-04 14:40 UTC"
}) {
  // Compute approximate UTC timestamp for current backward hour
  const getDisplayTime = (hoursAgo) => {
    try {
      const base = new Date("2026-09-04T14:40:00Z");
      const past = new Date(base.getTime() - hoursAgo * 3600 * 1000);
      return past.toUTCString().replace("GMT", "UTC");
    } catch {
      return `T-${hoursAgo.toFixed(1)}h`;
    }
  };

  const milestones = [
    { hour: 0, label: "T-0h (Detected)" },
    { hour: 12, label: "T-12h" },
    { hour: 24, label: "T-24h" },
    { hour: 40, label: "T-40h (Est. Release)" },
    { hour: 48, label: "T-48h" },
    { hour: 72, label: "T-72h (Boundary)" }
  ];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-ocean/10 text-ocean">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
                Backward Hindcast Timeline Scrubber
              </span>
              {Math.abs(currentHour - estimatedSpillHour) <= 2 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold animate-pulse">
                  ESTIMATED SPILL WINDOW
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-secondary font-mono">
              Rewind slick drift backward in time: <strong className="text-ocean-navy">T-{currentHour.toFixed(1)} Hours</strong> ({getDisplayTime(currentHour)})
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={onReset}
            title="Reset to T-0h"
            className="p-1.5 rounded-lg border border-border-marine hover:bg-ocean-light text-text-secondary transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-ocean hover:bg-ocean-deep text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play Reverse'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-ocean-light rounded-xl p-0.5 border border-border-marine text-[11px] font-mono font-bold">
            {['1x', '5x', '10x'].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  playSpeed === speed
                    ? 'bg-white text-ocean shadow-sm'
                    : 'text-text-muted hover:text-ocean-navy'
                }`}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrubber Range Input */}
      <div className="mt-3 space-y-2">
        <div className="relative pt-2 pb-1">
          <input
            type="range"
            min={0}
            max={maxHours}
            step={0.5}
            value={currentHour}
            onChange={(e) => onHourChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-ocean"
          />

          {/* Indicator marker for estimated release time */}
          <div
            className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${(estimatedSpillHour / maxHours) * 100}%` }}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-md"></span>
            <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-300 mt-1 whitespace-nowrap">
              T-{estimatedSpillHour}h Release
            </span>
          </div>
        </div>

        {/* Milestone Quick-Jump Badges */}
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1">
          {milestones.map((ms) => {
            const isActive = Math.abs(currentHour - ms.hour) < 1.0;
            return (
              <button
                key={ms.hour}
                onClick={() => onHourChange(ms.hour)}
                className={`transition-all hover:text-ocean cursor-pointer ${
                  isActive ? 'font-bold text-ocean underline underline-offset-2' : ''
                }`}
              >
                {ms.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

