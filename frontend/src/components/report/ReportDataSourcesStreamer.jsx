import React, { useState, useEffect } from 'react';
import { Database, Radio, RefreshCw, CheckCircle2, Wifi, Zap, Activity } from 'lucide-react';

export default function ReportDataSourcesStreamer({ sources, onLogAudit }) {
  const [isStreaming, setIsStreaming] = useState(true);
  const [packetCount, setPacketCount] = useState(14829);
  const [lastSync, setLastSync] = useState('Just now');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setPacketCount(prev => prev + Math.floor(Math.random() * 8) + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  const handleForceResync = () => {
    setLastSync('Just now');
    setPacketCount(prev => prev + 120);
    if (onLogAudit) onLogAudit('Triggered manual resynchronization of all 7 satellite and oceanographic feeds');
  };

  const filteredSources = sources.filter(s => {
    if (filter === 'ALL') return true;
    return s.status.toLowerCase().includes(filter.toLowerCase()) || s.type.toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <div className="space-y-3 font-mono">
      <div className="bg-white border border-border-marine rounded-xl p-3 shadow-marine-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="w-4 h-4 text-emerald-600" />
            {isStreaming && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <span className="font-bold text-ocean-navy">Telemetry Ingestion Engine:</span>
            <span className="text-emerald-600 font-bold ml-1.5">{isStreaming ? '● STREAMING ACTIVE' : '○ PAUSED'}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-text-muted">Packets: <strong>{packetCount.toLocaleString()}</strong></span>
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className="px-2.5 py-1 rounded-lg border border-border-marine bg-white hover:bg-ocean-sky text-ocean-navy text-[11px] font-bold shadow-sm"
          >
            {isStreaming ? 'Pause Stream' : 'Resume Stream'}
          </button>
          <button
            onClick={handleForceResync}
            className="px-2.5 py-1 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[11px] font-bold shadow-sm flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Force Resync</span>
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 text-[10px]">
        <span className="text-text-muted">Type Filter:</span>
        {['ALL', 'Satellite', 'Ocean', 'AIS', 'Meteo'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-0.5 rounded border transition-all ${
              filter === f
                ? 'bg-ocean text-white border-ocean'
                : 'bg-white text-text-secondary border-border-marine hover:bg-ocean-sky'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sources List */}
      <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm divide-y divide-border-marine/50">
        {filteredSources.map((src, idx) => (
          <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-ocean" />
                <span className="font-bold text-ocean-navy">{src.name}</span>
                <span className="px-1.5 py-0.2 rounded bg-ocean-light border border-ocean/20 text-ocean text-[9px] font-bold">
                  {src.type}
                </span>
              </div>
              <div className="text-[10px] text-text-muted font-sans pl-5.5">
                Coverage: {src.coverage} · Ingestion Quality: <strong className="text-emerald-700">{src.quality || '99.8%'}</strong>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:text-right pl-5.5 sm:pl-0">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-status-success border border-emerald-200 text-[10px] font-bold inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {src.status}
                </span>
                <div className="text-[10px] text-text-muted mt-0.5">Sync: {src.update}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

