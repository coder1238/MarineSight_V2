import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  HardHat, 
  Activity 
} from 'lucide-react';

const INITIAL_ROSTER = [
  { role: 'HAZWOPER Level-A/B Specialists', active: 12, standby: 4, cert: 'OSHA 1910.120 / IMO Level 2', color: 'text-ocean' },
  { role: 'Offshore Boom Riggers & Handlers', active: 24, standby: 8, cert: 'BSEE Offshore Marine Rigging', color: 'text-status-warning' },
  { role: 'Thermal Drone Recon Pilots', active: 6, standby: 2, cert: 'DGCA Commercial RPAS Category', color: 'text-purple-600' },
  { role: 'Marine Biologists & Wildlife Vets', active: 8, standby: 4, cert: 'Oiled Wildlife Care Network (OWCN)', color: 'text-status-success' },
  { role: 'Fast Interceptor Coxswains & Sailors', active: 28, standby: 10, cert: 'Coast Guard Qualified Helmsmen', color: 'text-ocean-navy' }
];

export default function StrikeTeamRoster() {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [ppeLevel, setPpeLevel] = useState('Level C: Half-Mask APR Respirator + Nitrile Gloves + PFD');
  const [briefingSigned, setBriefingSigned] = useState(true);

  const totalActive = roster.reduce((sum, r) => sum + r.active, 0);
  const totalStandby = roster.reduce((sum, r) => sum + r.standby, 0);

  const handleAdjust = (idx, delta) => {
    setRoster(prev => prev.map((item, i) => {
      if (i === idx) {
        const nextActive = Math.max(0, item.active + delta);
        return { ...item, active: nextActive };
      }
      return item;
    }));
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Emergency Personnel & HAZWOPER Strike Team Roster
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                {totalActive} ACTIVE RESPONDERS
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Specialist manpower distribution, fatigue management, and mandatory PPE protocol.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-muted font-bold">RESERVE:</span>
          <span className="text-xs font-mono font-bold text-text-primary">{totalStandby} Standby</span>
        </div>
      </div>

      {/* Safety & Fatigue Protocol Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">SHIFT FATIGUE TRACKER</span>
          <span className="font-bold text-ocean-navy text-xs block mt-0.5">8-Hour Watch Rotation</span>
          <span className="text-[9px] text-status-success block">Next shift handoff: 02h 45m</span>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine flex flex-col justify-between">
          <span className="text-[9px] text-text-muted uppercase block">TAILGATE SAFETY BRIEFING</span>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[10px] font-bold ${briefingSigned ? 'text-status-success' : 'text-status-danger'}`}>
              {briefingSigned ? '✓ Sign-Off Completed' : '✗ Pending Sign-Off'}
            </span>
            <button
              onClick={() => setBriefingSigned(!briefingSigned)}
              className="text-[9px] px-2 py-0.5 rounded border border-border-marine bg-white hover:bg-ocean-light"
            >
              Toggle
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-ocean-light/30 border border-border-marine">
          <span className="text-[9px] text-text-muted uppercase block">PPE ENFORCEMENT LEVEL</span>
          <select
            value={ppeLevel}
            onChange={(e) => setPpeLevel(e.target.value)}
            className="w-full text-[10px] font-bold text-ocean-navy mt-1 p-1 rounded border border-border-marine bg-white focus:outline-none"
          >
            <option value="Level B: Full SCBA / Chemical Splash Suit">Level B: Full SCBA / Splash Suit</option>
            <option value="Level C: Half-Mask APR Respirator + Nitrile Gloves + PFD">Level C: Half-Mask APR + PFD</option>
            <option value="Level D: Standard Marine Workwear + Hardhat + Steel-toe">Level D: Marine Workwear + PFD</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase bg-ocean-light/50 text-text-secondary border-y border-border-marine">
            <tr>
              <th className="py-2 px-2.5">Tactical Role / Discipline</th>
              <th className="py-2 px-2">Certification Standards</th>
              <th className="py-2 px-2 text-center">Active On-Scene</th>
              <th className="py-2 px-2 text-center">Standby</th>
              <th className="py-2 px-2 text-right">Adjust Headcount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/60">
            {roster.map((r, idx) => (
              <tr key={idx} className="hover:bg-ocean-light/20 transition-colors">
                <td className="py-2.5 px-2.5 font-bold text-ocean-navy text-xs">
                  {r.role}
                </td>
                <td className="py-2.5 px-2 text-[11px] font-mono text-text-secondary">
                  {r.cert}
                </td>
                <td className="py-2.5 px-2 text-center">
                  <span className="font-mono font-extrabold text-xs text-status-success bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {r.active} Pers
                  </span>
                </td>
                <td className="py-2.5 px-2 text-center font-mono text-xs text-text-muted">
                  {r.standby}
                </td>
                <td className="py-2.5 px-2 text-right">
                  <div className="inline-flex items-center gap-1 font-mono">
                    <button
                      onClick={() => handleAdjust(idx, -1)}
                      className="w-5 h-5 rounded bg-ocean-light hover:bg-ocean-sky border border-border-marine text-ocean font-bold flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleAdjust(idx, 1)}
                      className="w-5 h-5 rounded bg-ocean text-white hover:bg-ocean-deep font-bold flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

