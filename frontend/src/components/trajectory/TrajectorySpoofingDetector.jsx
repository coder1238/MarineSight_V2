import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Radio, CheckCircle2, Lock, Terminal } from 'lucide-react';
import { GNSS_INTEGRITY } from './trajectoryData';

export default function TrajectorySpoofingDetector() {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-status-warning" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            AIS Spoofing & GNSS Manipulation Integrity Sentry
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-warning font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          ● SPOOFING RISK: {GNSS_INTEGRITY.overallSpoofingRisk} / 100
        </span>
      </div>

      {/* 5 Indicator Checks */}
      <div className="space-y-2 font-mono text-xs">
        {GNSS_INTEGRITY.metrics.map((metric, idx) => (
          <div key={idx} className="p-2.5 bg-ocean-light/50 rounded-xl border border-border-marine/60">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="font-bold text-ocean-navy">{metric.name}</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                metric.status === 'CRITICAL' || metric.status === 'ALERT'
                  ? 'bg-red-50 text-status-danger border-red-200'
                  : metric.status === 'WARNING'
                    ? 'bg-amber-50 text-status-warning border-amber-200'
                    : 'bg-emerald-50 text-status-success border-emerald-200'
              }`}>
                {metric.status}
              </span>
            </div>
            <p className="text-[10px] text-text-secondary font-sans leading-tight">
              {metric.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Raw NMEA Sentence Audit Box */}
      <div className="p-2.5 bg-ocean-navy text-ocean-sky rounded-xl font-mono text-[10px] space-y-1">
        <div className="flex items-center justify-between text-text-muted pb-1 border-b border-white/10">
          <span className="flex items-center gap-1">
            <Terminal className="w-3 h-3 text-ocean" />
            Last Valid Raw AIS NMEA Sentence:
          </span>
          <span className="text-status-success text-[9px]">CHECKSUM VALID (*7D)</span>
        </div>
        <code className="block text-emerald-400 break-all select-all">
          {"!AIVDM,1,1,,B,16:3p`001@7P80<H1FwR0?vN0000,0*7D"}
        </code>
      </div>
    </div>
  );
}
