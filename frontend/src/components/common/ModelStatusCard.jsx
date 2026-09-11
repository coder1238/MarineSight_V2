import React from 'react';
import { Cpu, CheckCircle2, Clock, Layers, ArrowRight } from 'lucide-react';

export default function ModelStatusCard({ model, onInspect }) {
  return (
    <div className="bg-white border border-border-marine rounded-xl p-3.5 shadow-marine-sm hover:shadow-marine-md hover:border-ocean/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono bg-ocean-sky text-ocean-deep px-1.5 py-0.5 rounded font-bold">
                {model.id}
              </span>
              <span className="text-xs font-bold text-ocean-navy truncate">
                {model.name}
              </span>
            </div>
            <p className="text-[10px] font-mono text-text-muted mt-0.5">{model.architecture} · {model.version}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
            {model.status}
          </span>
        </div>

        <p className="text-[11px] text-text-secondary line-clamp-2 mb-3">
          {model.purpose}
        </p>
      </div>

      <div className="pt-2 border-t border-border-marine/60">
        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mb-2.5">
          <div className="bg-ocean-light p-1.5 rounded border border-border-marine/40">
            <span className="text-text-muted block text-[9px]">CONFIDENCE</span>
            <span className="font-bold text-ocean">{model.confidence}%</span>
          </div>
          <div className="bg-ocean-light p-1.5 rounded border border-border-marine/40">
            <span className="text-text-muted block text-[9px]">INFERENCE</span>
            <span className="font-bold text-text-primary">{model.latencySec}s</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap max-w-[180px]">
            {model.activePills?.slice(0, 1).map((pill, i) => (
              <span key={i} className="text-[9px] bg-ocean-sky/70 text-ocean-deep font-mono px-1.5 py-0.5 rounded truncate">
                {pill}
              </span>
            ))}
          </div>
          {onInspect && (
            <button 
              onClick={() => onInspect(model)}
              className="text-[11px] text-ocean hover:text-ocean-deep font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
