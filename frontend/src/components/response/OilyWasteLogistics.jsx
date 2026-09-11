import React, { useState } from 'react';
import { 
  Trash2, 
  Droplets, 
  Truck, 
  Ship, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';

const INITIAL_STORAGE_ASSETS = [
  { id: 'AST-01', name: 'Offshore Floating Towable Bladder Alpha', type: 'Offshore Bladder', capacityM3: 200, currentM3: 135, location: 'Towed by ICGS Samudra Prahari' },
  { id: 'AST-02', name: 'Offshore Floating Towable Bladder Bravo', type: 'Offshore Bladder', capacityM3: 200, currentM3: 45, location: 'Staged at Mormugao Bay' },
  { id: 'AST-03', name: 'Port Vacuum Tanker Trucks Fleet (4 units)', type: 'Vacuum Trucks', capacityM3: 80, currentM3: 65, location: 'Berth 9 Riprap Loading Bay' },
  { id: 'AST-04', name: 'CPCB Authorized Slop Decanting Reservoir', type: 'Shore Pit', capacityM3: 500, currentM3: 210, location: 'Mormugao Port Trust Refinery' }
];

export default function OilyWasteLogistics() {
  const [assets, setAssets] = useState(INITIAL_STORAGE_ASSETS);
  const [manifestId, setManifestId] = useState('HAZ-2026-GOA-0892');
  const [emulsionFactor, setEmulsionFactor] = useState(2.5); // 2.5x volume due to water in oil

  const totalCapacity = assets.reduce((sum, a) => sum + a.capacityM3, 0);
  const totalCurrent = assets.reduce((sum, a) => sum + a.currentM3, 0);
  const percentFilled = Math.round((totalCurrent / totalCapacity) * 100);
  const remainingUllage = totalCapacity - totalCurrent;

  const handleDrainAsset = (id) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, currentM3: Math.max(0, a.currentM3 - 40) };
      }
      return a;
    }));
  };

  const handleGenerateNewManifest = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setManifestId(`HAZ-2026-GOA-${randomSuffix}`);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-warning/10 text-status-warning">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Recovered Oily Waste & Temporary Logistics Planner
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-status-warning border border-amber-200">
                CPCB / MARPOL ANNEX I
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Track floating storage bladders, vacuum trucks, emulsion expansion, and hazardous waste manifests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-muted">MANIFEST:</span>
          <span className="text-xs font-mono font-extrabold text-ocean">{manifestId}</span>
          <button 
            onClick={handleGenerateNewManifest}
            title="Generate New Manifest"
            className="p-1 rounded hover:bg-ocean-light text-text-muted hover:text-ocean transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Storage Capacity Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">TOTAL CAPACITY</span>
          <span className="text-base font-extrabold text-ocean-navy">{totalCapacity} m³</span>
          <span className="text-[9px] text-text-secondary block">Combined storage fleet</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">CURRENT WASTE STORED</span>
          <span className="text-base font-extrabold text-status-warning">{totalCurrent} m³</span>
          <span className="text-[9px] text-text-secondary block">~{(totalCurrent * 6.2898).toFixed(0)} Barrels</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">REMAINING ULLAGE</span>
          <span className="text-base font-extrabold text-status-success">{remainingUllage} m³</span>
          <span className="text-[9px] text-text-secondary block">Free capacity buffer</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-text-muted uppercase">FLEET ULLAGE LEVEL</span>
            <span className="font-extrabold text-ocean">{percentFilled}% FULL</span>
          </div>
          <div className="w-full bg-border-marine/60 h-2 rounded-full overflow-hidden mt-1">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentFilled >= 80 ? 'bg-status-danger' : percentFilled >= 50 ? 'bg-status-warning' : 'bg-status-success'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>
      </div>

      {/* Storage Assets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase bg-ocean-light/50 text-text-secondary border-y border-border-marine">
            <tr>
              <th className="py-2 px-2.5">Storage Asset / Unit</th>
              <th className="py-2 px-2">Type</th>
              <th className="py-2 px-2">Fill Status</th>
              <th className="py-2 px-2">Current Location</th>
              <th className="py-2 px-2 text-right">Decant / Transfer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/60">
            {assets.map((ast) => {
              const fillPct = Math.round((ast.currentM3 / ast.capacityM3) * 100);
              return (
                <tr key={ast.id} className="hover:bg-ocean-light/20 transition-colors">
                  <td className="py-2.5 px-2.5 font-bold text-ocean-navy text-xs">
                    {ast.name}
                  </td>
                  <td className="py-2.5 px-2 text-[11px] font-mono text-text-secondary">
                    {ast.type}
                  </td>
                  <td className="py-2.5 px-2 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ocean-navy">{ast.currentM3}/{ast.capacityM3} m³</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        fillPct > 80 ? 'bg-red-100 text-status-danger' : 'bg-emerald-100 text-status-success'
                      }`}>
                        {fillPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-[11px] font-sans text-text-secondary">
                    {ast.location}
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      onClick={() => handleDrainAsset(ast.id)}
                      disabled={ast.currentM3 === 0}
                      className="text-[10px] font-mono font-bold py-1 px-2.5 rounded-lg border border-border-marine bg-white hover:bg-ocean-light disabled:opacity-40 text-ocean transition-all shadow-sm"
                    >
                      Decant 40 m³
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

