import React, { useState } from 'react';
import { ShieldAlert, Bell, BellOff, Navigation, Radio, CheckCircle2, Siren } from 'lucide-react';

export default function WatchlistSentryBanner({ vessel, isWatchlisted, onToggleWatchlist }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [interceptorDispatched, setInterceptorDispatched] = useState(false);

  const playRadarPing = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      console.warn("Radar audio error", e);
    }
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      playRadarPing();
    }
  };

  const handleDispatch = () => {
    setInterceptorDispatched(true);
    playRadarPing();
    setTimeout(() => {
      // Keep state or reset after some time
    }, 5000);
  };

  return (
    <div className={`p-3.5 rounded-2xl border transition-all duration-300 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm ${
      isWatchlisted
        ? 'bg-red-50/90 border-status-danger/40 text-status-danger'
        : 'bg-ocean-sky/40 border-border-marine text-ocean-navy'
    }`}>
      {/* Left Details */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${
          isWatchlisted ? 'bg-status-danger text-white animate-pulse' : 'bg-ocean/10 text-ocean'
        }`}>
          <Siren className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs uppercase tracking-wider">
              {isWatchlisted ? 'TACTICAL INTERCEPTION WATCHLIST // ACTIVE TARGET' : 'TACTICAL SENTRY & WATCHLIST DISPATCH'}
            </span>
            <span className={`px-2 py-0.2 rounded-full text-[9px] font-bold ${
              isWatchlisted ? 'bg-status-danger text-white' : 'bg-ocean text-white'
            }`}>
              {isWatchlisted ? 'PINNED' : 'STANDBY'}
            </span>
          </div>
          <p className="text-[11px] text-text-secondary font-sans mt-0.5">
            Target: <strong>{vessel.name}</strong> (MMSI: {vessel.mmsi}) · Status: {interceptorDispatched ? 'FAST INTERCEPTOR ICGS-VARUNA UNDERWAY' : 'Coast Guard Fast Patrol Vessel on 15-min standby'}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Audio Ping Toggle */}
        <button
          onClick={handleToggleSound}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundEnabled 
              ? 'bg-ocean-navy text-white border-ocean-navy' 
              : 'bg-white text-text-muted border-border-marine hover:text-text-primary'
          }`}
          title="Toggle Radar Ping Audio Feedback"
        >
          {soundEnabled ? <Bell className="w-4 h-4 text-ocean-bright" /> : <BellOff className="w-4 h-4" />}
        </button>

        {/* Pin to Watchlist */}
        <button
          onClick={() => {
            onToggleWatchlist();
            if (!isWatchlisted) playRadarPing();
          }}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs border ${
            isWatchlisted
              ? 'bg-white text-status-danger border-status-danger/40 hover:bg-red-50'
              : 'bg-white text-ocean-navy border-border-marine hover:bg-ocean-light'
          }`}
        >
          {isWatchlisted ? 'Unpin Watchlist' : 'Pin to Watchlist'}
        </button>

        {/* Dispatch Interceptor */}
        <button
          onClick={handleDispatch}
          disabled={interceptorDispatched}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
            interceptorDispatched
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-status-danger hover:bg-red-700 text-white'
          }`}
        >
          {interceptorDispatched ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Interceptor Dispatched</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5" />
              <span>Dispatch ICGS Interceptor</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

