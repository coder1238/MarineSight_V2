import React, { useState } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Activity, Cpu, WifiOff, Zap } from 'lucide-react';

export default function AISTransponderCard({ vessel }) {
  const [selectedChannel, setSelectedChannel] = useState('AIS1'); // AIS1 (161.975 MHz) vs AIS2 (162.025 MHz)
  
  const hasGap = vessel.gapDuration && vessel.gapDuration !== "None";
  const gapMins = parseInt(vessel.gapDuration) || (hasGap ? 38 : 0);
  const packetLossPct = hasGap ? Math.min(99.4, (gapMins * 2.3).toFixed(1)) : 1.2;
  const signalRssi = hasGap ? -118 : -72; // dBm

  // Simulated RSSI signal samples over the critical window
  const rssiSamples = hasGap
    ? [-74, -76, -82, -94, -120, -120, -120, -120, -118, -88, -75, -73]
    : [-72, -73, -71, -74, -72, -73, -71, -72, -74, -73, -72, -71];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-status-danger border border-red-200">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              AIS Transponder Packet & Signal Integrity
            </h3>
            <p className="text-[10px] text-text-secondary">
              VHF Class-A SOTDMA Telemetry & Transponder Health
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
            hasGap 
              ? 'bg-red-50 text-status-danger border-red-200 animate-pulse'
              : 'bg-emerald-50 text-status-success border-emerald-200'
          }`}>
            {hasGap ? '● SOTDMA TRANSMISSION ANOMALY' : '● NOMINAL STREAM'}
          </span>
        </div>
      </div>

      {/* Primary Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span>BLACKOUT WINDOW</span>
            <WifiOff className="w-3 h-3 text-status-danger" />
          </div>
          <span className={`text-base font-bold mt-1 block ${hasGap ? 'text-status-danger' : 'text-status-success'}`}>
            {vessel.gapDuration || "38 min"}
          </span>
          <span className="text-[9px] text-text-muted">
            {hasGap ? '174 missed sync frames' : '0 dropped sync frames'}
          </span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span>PACKET LOSS RATE</span>
            <Activity className="w-3 h-3 text-status-warning" />
          </div>
          <span className={`text-base font-bold mt-1 block ${packetLossPct > 20 ? 'text-status-danger' : 'text-status-success'}`}>
            {packetLossPct}%
          </span>
          <span className="text-[9px] text-text-muted">Expected 6s ping cadence</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span>MEAN RSSI LEVEL</span>
            <Zap className="w-3 h-3 text-ocean" />
          </div>
          <span className={`text-base font-bold mt-1 block ${signalRssi < -100 ? 'text-status-danger' : 'text-ocean-deep'}`}>
            {signalRssi} dBm
          </span>
          <span className="text-[9px] text-text-muted">Carrier SNR: 8.4 dB</span>
        </div>

        <div className="p-2.5 bg-ocean-light rounded-xl border border-border-marine/50">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span>SLOT COLLISION</span>
            <AlertTriangle className="w-3 h-3 text-status-warning" />
          </div>
          <span className="text-base font-bold mt-1 text-text-primary block">
            {hasGap ? '14.2%' : '0.4%'}
          </span>
          <span className="text-[9px] text-text-muted">Channel contention index</span>
        </div>
      </div>

      {/* RSSI Signal-to-Noise Fade Waveform */}
      <div className="bg-ocean-light/80 p-3 rounded-xl border border-border-marine space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-text-secondary font-medium">RSSI Signal Attenuation Curve (Transit Window)</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedChannel('AIS1')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedChannel === 'AIS1' ? 'bg-ocean text-white' : 'bg-white text-text-muted border border-border-marine'
              }`}
            >
              161.975 MHz (CH 87B)
            </button>
            <button
              onClick={() => setSelectedChannel('AIS2')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedChannel === 'AIS2' ? 'bg-ocean text-white' : 'bg-white text-text-muted border border-border-marine'
              }`}
            >
              162.025 MHz (CH 88B)
            </button>
          </div>
        </div>

        {/* Waveform Bars */}
        <div className="h-16 w-full flex items-end justify-between gap-1 pt-2 relative">
          <div className="absolute top-0 left-0 right-0 border-b border-dashed border-status-danger/40 text-[9px] font-mono text-status-danger pl-1">
            -110 dBm Threshold (Receiver Sensitivity Cutoff)
          </div>

          {rssiSamples.map((dbm, i) => {
            // map -130 to -60 into 0..100%
            const heightPct = Math.max(5, Math.min(100, ((dbm + 130) / 70) * 100));
            const isCritical = dbm <= -110;
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isCritical ? 'bg-status-danger' : 'bg-ocean'
                  }`}
                />
                <span className="text-[8px] font-mono text-text-muted mt-1 opacity-70 group-hover:opacity-100">
                  {i * 10}m
                </span>
                {/* Tooltip on hover */}
                <div className="absolute -top-7 hidden group-hover:block bg-ocean-navy text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10">
                  {dbm} dBm
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-text-muted pt-1">
          <span>T-60m: Normal Handshake</span>
          <span className="text-status-danger font-bold">T-24m to +14m: Complete RF Silence</span>
          <span>T+30m: Signal Re-acquired</span>
        </div>
      </div>

      {/* Forensic Verdict Box */}
      <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
        hasGap
          ? 'bg-red-50/70 border-status-danger/30 text-status-danger'
          : 'bg-emerald-50/70 border-emerald-300 text-emerald-800'
      }`}>
        {hasGap ? (
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-status-danger" />
        ) : (
          <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-status-success" />
        )}
        <div className="space-y-0.5">
          <span className="font-bold font-mono text-[11px] block">
            {hasGap ? 'SOTDMA ANOMALY VERDICT: DELIBERATE TRANSPONDER DEACTIVATION' : 'TRANSPONDER VERDICT: UNBROKEN SOLAS BROADCAST'}
          </span>
          <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
            {hasGap
              ? 'Abrupt signal drop from -74 dBm to floor noise without gradual tropospheric attenuation strongly indicates manual power-down of the main VHF transceiver unit rather than geographical antenna shadowing.'
              : 'Continuous uninhibited packet reception across both coastal basestations and satellite constellation receivers with zero unaccounted transmission latency.'}
          </p>
        </div>
      </div>

      {/* Transponder Hardware Spec Footer */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border-marine text-[10px] font-mono text-text-secondary">
        <div>
          <span className="text-text-muted block">EQUIPMENT:</span>
          <span className="font-semibold text-ocean-navy">Furuno FA-170 Class A</span>
        </div>
        <div>
          <span className="text-text-muted block">TX POWER / GPS:</span>
          <span className="font-semibold text-ocean-navy">12.5 Watts · SBAS DGPS</span>
        </div>
        <div>
          <span className="text-text-muted block">IMO CONVENTION:</span>
          <span className="font-semibold text-status-success">SOLAS Ch.V Reg.19</span>
        </div>
      </div>
    </div>
  );
}

