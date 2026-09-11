import React, { useState } from 'react';
import { X, Navigation, Shield, Plane, Ship, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WorkspaceResponseDispatcherModal({ caseData, onClose }) {
  const [selectedAssets, setSelectedAssets] = useState(['pcv-1', 'air-1']);
  const [dispatched, setDispatched] = useState(false);

  const assets = [
    {
      id: 'pcv-1',
      name: 'ICGS Samudra Prahari',
      type: 'Pollution Control Vessel (PCV)',
      station: 'Mormugao Port (Goa)',
      distanceNm: 36,
      speedKn: 21,
      capabilities: '2000m Heavy Ocean Boom, 2× 150m³/h Sweeping Arms, Dispersant Spray 4000L',
      icon: Ship
    },
    {
      id: 'air-1',
      name: 'ICG Dornier 228 (CG-764)',
      type: 'Maritime Surveillance Aircraft',
      station: 'INS Hansa / Dabolim Air Station',
      distanceNm: 42,
      speedKn: 190,
      capabilities: 'SLAR Radar, Optical FLIR Camera, Aerial Dispersant Spray Pods (1000L)',
      icon: Plane
    },
    {
      id: 'ic-1',
      name: 'ICGS C-441',
      type: 'Fast Interceptor Craft',
      station: 'Karwar Coast Guard Station',
      distanceNm: 48,
      speedKn: 42,
      capabilities: 'Armed Boarding Team, Evidence Seizure, Rapid Interdiction',
      icon: Ship
    },
    {
      id: 'tug-1',
      name: 'Ocean Salvage Tug Orion',
      type: 'Commercial Emergency Towing Vessel',
      station: 'Mangalore Anchorage',
      distanceNm: 84,
      speedKn: 13,
      capabilities: '120 Ton Bollard Pull, Skimmer Barge Towing',
      icon: Ship
    }
  ];

  const toggleAsset = (id) => {
    setSelectedAssets(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-ocean text-white shadow-sm">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Emergency Response Asset Tasking Dispatcher
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ocean-light text-ocean font-bold">
                  NATIONAL OIL SPILL CONTINGENCY PLAN
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                Calculate live transit ETA to slick centroid ({caseData.coordinates?.display}) and assign response assets.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset Selection List */}
        <div className="p-5 overflow-y-auto space-y-3">
          {assets.map((a) => {
            const Icon = a.icon;
            const isSelected = selectedAssets.includes(a.id);
            const etaHours = +(a.distanceNm / a.speedKn).toFixed(1);
            const etaMinutes = Math.round(etaHours * 60);

            return (
              <div
                key={a.id}
                onClick={() => toggleAsset(a.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-ocean-sky/40 border-ocean shadow-xs' : 'bg-white border-border-marine hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-ocean text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs text-ocean-navy font-bold">{a.name}</strong>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-text-muted font-medium">
                        {a.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-text-secondary mt-0.5 font-mono">
                      Homeport: {a.station} · Distance: {a.distanceNm} NM @ {a.speedKn} kn
                    </div>
                    <p className="text-[11px] text-ocean-deep mt-1 font-sans">
                      Payload: {a.capabilities}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <span className="text-[10px] text-text-muted block uppercase">TRANSIT ETA</span>
                  <span className="text-sm font-black text-ocean">
                    {etaMinutes < 60 ? `${etaMinutes} mins` : `${etaHours} hrs`}
                  </span>
                  <div className="mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-100 text-status-success' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isSelected ? 'TASKED' : 'STANDBY'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispatch Summary */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <div className="text-xs font-mono text-text-secondary">
            <span>Selected Assets: </span>
            <strong className="text-ocean-navy font-bold">{selectedAssets.length} units</strong>
            <span> · Est. First On-Scene Arrival: </span>
            <strong className="text-status-success font-bold">13 mins (Air Sortie)</strong>
          </div>

          <button
            onClick={handleDispatch}
            disabled={selectedAssets.length === 0 || dispatched}
            className="px-5 py-2 rounded-xl bg-status-danger hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            {dispatched ? <CheckCircle2 className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
            <span>{dispatched ? 'Orders Transmitted!' : 'Transmit Deployment Directive'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

