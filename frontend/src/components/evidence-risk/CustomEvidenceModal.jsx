import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, FilePlus2 } from 'lucide-react';

export default function CustomEvidenceModal({ isOpen, onClose, onAddEvidence }) {
  const [formData, setFormData] = useState({
    name: "",
    value: "",
    strength: "HIGH",
    conf: 88,
    weight: "10%",
    source: "Field Patrol Report"
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.value.trim()) return;

    onAddEvidence({
      ...formData,
      conf: parseInt(formData.conf, 10),
      isCustom: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-border-marine rounded-2xl shadow-marine-lg max-w-lg w-full overflow-hidden flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-ocean-light border-b border-border-marine">
          <div className="flex items-center gap-2">
            <FilePlus2 className="w-5 h-5 text-ocean" />
            <h3 className="text-sm font-extrabold text-ocean-navy uppercase">
              Ingest Custom Forensic Observation
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-ocean-sky text-text-secondary">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
              Evidence Observation Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Shoreline Tarball GC-MS Chemical Fingerprint Match"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean"
            />
          </div>

          <div>
            <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
              Forensic Finding Summary
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g., Biomarker hopane/sterane ratios match tanker ballast fuel tank bunker sample #04."
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean font-sans"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Evidence Strength
              </label>
              <select
                value={formData.strength}
                onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean"
              >
                <option value="VERY HIGH">VERY HIGH</option>
                <option value="HIGH">HIGH</option>
                <option value="MODERATE">MODERATE</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Confidence Level ({formData.conf}%)
              </label>
              <input
                type="range"
                min="50"
                max="99"
                value={formData.conf}
                onChange={(e) => setFormData({ ...formData, conf: e.target.value })}
                className="w-full h-1.5 bg-ocean/20 rounded-lg appearance-none cursor-pointer accent-ocean mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Evidence Weight
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="e.g., 12%"
                className="w-full px-3 py-1.5 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">
                Sensor / Agency Source
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="e.g., Forensic Lab Goa / ICG"
                className="w-full px-3 py-1.5 rounded-xl border border-border-marine text-xs text-ocean-navy focus:outline-none focus:border-ocean"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-marine">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-border-marine hover:bg-ocean-light text-text-secondary font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Evidence Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

