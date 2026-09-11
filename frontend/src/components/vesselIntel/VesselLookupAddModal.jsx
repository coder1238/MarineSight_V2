import React, { useState } from 'react';
import { X, Search, PlusCircle, Ship, Compass, CheckCircle2 } from 'lucide-react';

export default function VesselLookupAddModal({ isOpen, onClose, onAddVessel, existingCount }) {
  const [mmsi, setMmsi] = useState('');
  const [name, setName] = useState('');
  const [imo, setImo] = useState('');
  const [type, setType] = useState('Crude Oil Tanker');
  const [flag, setFlag] = useState('Panama 🇵🇦');
  const [speedKn, setSpeedKn] = useState('11.5');
  const [cpaNm, setCpaNm] = useState('3.2');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mmsi.trim()) return;

    const rankNumber = String(existingCount + 1).padStart(2, '0');
    const priorityScore = parseFloat((70 + Math.random() * 20).toFixed(1));

    const newVessel = {
      rank: rankNumber,
      name: name.trim(),
      mmsi: mmsi.trim(),
      imo: imo.trim() || String(Math.floor(9000000 + Math.random() * 900000)),
      type,
      flag,
      pos: { lat: 14.9500 + Math.random() * 0.4, lng: 68.3500 + Math.random() * 0.4 },
      heading: Math.floor(Math.random() * 360),
      speedKn: parseFloat(speedKn) || 12.0,
      lengthM: 228,
      beamM: 36,
      spatialMatch: Math.floor(75 + Math.random() * 20),
      temporalMatch: Math.floor(70 + Math.random() * 22),
      trajectoryMatch: Math.floor(65 + Math.random() * 25),
      behaviorMatch: Math.floor(60 + Math.random() * 30),
      aisGapScore: Math.floor(60 + Math.random() * 30),
      priorityScore,
      status: priorityScore >= 85 ? "HIGH PRIORITY" : priorityScore >= 70 ? "UNDER REVIEW" : "MODERATE",
      cpaNm: parseFloat(cpaNm) || 3.2,
      gapDuration: `${Math.floor(10 + Math.random() * 35)} min`,
      destination: "Mumbai IN BOM"
    };

    onAddVessel(newVessel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-ocean-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-border-marine rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-mono text-xs">
        {/* Header */}
        <div className="p-4 bg-ocean-light border-b border-border-marine flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-ocean text-white">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-ocean-navy font-sans">
                Lookup & Inject Suspect Vessel
              </h2>
              <p className="text-[10px] text-text-secondary font-sans">
                Query coastal AIS receiver cache and append to active case
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
              Vessel Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MT Atlantic Pioneer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs font-bold text-ocean-navy focus:outline-none focus:ring-1 focus:ring-ocean"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                MMSI (9 Digits) *
              </label>
              <input
                type="text"
                required
                placeholder="419003881"
                value={mmsi}
                onChange={(e) => setMmsi(e.target.value)}
                className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs font-bold text-ocean-navy focus:outline-none focus:ring-1 focus:ring-ocean"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                IMO Number
              </label>
              <input
                type="text"
                placeholder="9745120"
                value={imo}
                onChange={(e) => setImo(e.target.value)}
                className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs text-ocean-navy focus:outline-none focus:ring-1 focus:ring-ocean"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Vessel Classification
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs text-ocean-navy focus:outline-none"
              >
                <option value="Crude Oil Tanker">Crude Oil Tanker</option>
                <option value="Chemical Tanker">Chemical Tanker</option>
                <option value="Container Ship">Container Ship</option>
                <option value="Bulk Carrier">Bulk Carrier</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Flag State Registry
              </label>
              <select
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs text-ocean-navy focus:outline-none"
              >
                <option value="Panama 🇵🇦">Panama 🇵🇦</option>
                <option value="Liberia 🇱🇷">Liberia 🇱🇷</option>
                <option value="India 🇮🇳">India 🇮🇳</option>
                <option value="Marshall Islands 🇲🇭">Marshall Islands 🇲🇭</option>
                <option value="Singapore 🇸🇬">Singapore 🇸🇬</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Speed (knots)
              </label>
              <input
                type="number"
                step="0.1"
                value={speedKn}
                onChange={(e) => setSpeedKn(e.target.value)}
                className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs text-ocean-navy focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                CPA Offset (nm)
              </label>
              <input
                type="number"
                step="0.1"
                value={cpaNm}
                onChange={(e) => setCpaNm(e.target.value)}
                className="w-full p-2 bg-ocean-light border border-border-marine rounded-lg text-xs text-ocean-navy focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-marine">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-border-marine hover:bg-ocean-light text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Inject into Case</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

