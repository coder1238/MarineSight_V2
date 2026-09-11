import React, { useState, useMemo } from 'react';
import { 
  Wind, 
  Waves, 
  Eye, 
  Thermometer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Gauge 
} from 'lucide-react';

export default function MetoceanSafetyMatrix({ caseData }) {
  const [windKn, setWindKn] = useState(caseData?.environment?.windSpeedKn || 14.2);
  const [waveHeightM, setWaveHeightM] = useState(caseData?.environment?.waveHeightM || 1.8);
  const [currentKn, setCurrentKn] = useState(0.8);
  const [visibilityNm, setVisibilityNm] = useState(8.5);

  const operations = useMemo(() => {
    // 1. Boom deployment: wave < 1.5m, current < 1.0kn
    const boomPass = waveHeightM <= 1.5 && currentKn <= 0.9;
    const boomCaution = !boomPass && waveHeightM <= 2.2 && currentKn <= 1.3;

    // 2. Skimming: wave < 2.0m, wind < 22kn
    const skimPass = waveHeightM <= 2.0 && windKn <= 20;
    const skimCaution = !skimPass && waveHeightM <= 2.8 && windKn <= 25;

    // 3. Air Recon: vis > 3 NM, wind < 32kn
    const airPass = visibilityNm >= 3 && windKn <= 28;
    const airCaution = !airPass && visibilityNm >= 1.5 && windKn <= 35;

    // 4. Chemical Dispersant: wind between 5 and 25 kn, vis > 2 NM
    const dispersantPass = windKn >= 5 && windKn <= 25 && visibilityNm >= 2;
    const dispersantCaution = !dispersantPass && (windKn < 5 || windKn <= 28);

    // 5. In-Situ Burning: wave < 1.0m, wind < 15kn
    const isbPass = waveHeightM <= 1.0 && windKn <= 14;
    const isbCaution = !isbPass && waveHeightM <= 1.4 && windKn <= 18;

    const list = [
      {
        name: 'Boom Barrier Containment',
        status: boomPass ? 'GO (Optimal)' : boomCaution ? 'CAUTION (High Current / Swell)' : 'NO-GO (Severe Underflow)',
        badge: boomPass ? 'bg-emerald-100 text-status-success' : boomCaution ? 'bg-amber-100 text-status-warning' : 'bg-red-100 text-status-danger',
        limit: 'Hs < 1.5m, V < 0.9 kn'
      },
      {
        name: 'Mechanical Offshore Skimming',
        status: skimPass ? 'GO (High Efficiency)' : skimCaution ? 'CAUTION (Wave Splashover)' : 'NO-GO (Rough Sea State)',
        badge: skimPass ? 'bg-emerald-100 text-status-success' : skimCaution ? 'bg-amber-100 text-status-warning' : 'bg-red-100 text-status-danger',
        limit: 'Hs < 2.0m, Wind < 20 kn'
      },
      {
        name: 'Aerial Drone / Patrol Flight',
        status: airPass ? 'GO (Clear Flight Path)' : airCaution ? 'CAUTION (Turbulence)' : 'NO-GO (Gale Gusts / Fog)',
        badge: airPass ? 'bg-emerald-100 text-status-success' : airCaution ? 'bg-amber-100 text-status-warning' : 'bg-red-100 text-status-danger',
        limit: 'Vis > 3 NM, Wind < 28 kn'
      },
      {
        name: 'Chemical Dispersant Spraying',
        status: dispersantPass ? 'GO (Turbulence Mixing)' : dispersantCaution ? 'CAUTION (Low Energy)' : 'NO-GO (Atomization Drift)',
        badge: dispersantPass ? 'bg-emerald-100 text-status-success' : dispersantCaution ? 'bg-amber-100 text-status-warning' : 'bg-red-100 text-status-danger',
        limit: 'Wind 5 - 25 kn'
      },
      {
        name: 'In-Situ Controlled Burn (ISB)',
        status: isbPass ? 'GO (Sustained Flame)' : isbCaution ? 'CAUTION (Flame Splatter)' : 'NO-GO (Chop Quenches Fire)',
        badge: isbPass ? 'bg-emerald-100 text-status-success' : isbCaution ? 'bg-amber-100 text-status-warning' : 'bg-red-100 text-status-danger',
        limit: 'Hs < 1.0m, Wind < 14 kn'
      }
    ];

    return list;
  }, [windKn, waveHeightM, currentKn, visibilityNm]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              MetOcean Tactical Operational Limits & "Go / No-Go" Matrix
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                COAST GUARD MET-STATION
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Real-time sea-state and atmospheric thresholds for safe emergency deployments.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-status-success font-bold border border-emerald-200">
          ● REAL-TIME TELEMETRY
        </span>
      </div>

      {/* Interactive MetOcean Sliders */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-ocean-light/30 p-3 rounded-xl border border-border-marine font-mono text-xs">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-muted flex items-center gap-1">
              <Wind className="w-3 h-3 text-ocean" /> Wind Speed:
            </span>
            <span className="font-bold text-ocean-navy">{windKn} kn</span>
          </div>
          <input 
            type="range"
            min="2"
            max="40"
            step="0.5"
            value={windKn}
            onChange={(e) => setWindKn(+e.target.value)}
            className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-muted flex items-center gap-1">
              <Waves className="w-3 h-3 text-ocean" /> Wave Hs:
            </span>
            <span className="font-bold text-ocean-navy">{waveHeightM} m</span>
          </div>
          <input 
            type="range"
            min="0.2"
            max="4.5"
            step="0.1"
            value={waveHeightM}
            onChange={(e) => setWaveHeightM(+e.target.value)}
            className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-muted flex items-center gap-1">
              <Gauge className="w-3 h-3 text-ocean" /> Drift Current:
            </span>
            <span className="font-bold text-ocean-navy">{currentKn} kn</span>
          </div>
          <input 
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={currentKn}
            onChange={(e) => setCurrentKn(+e.target.value)}
            className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-text-muted flex items-center gap-1">
              <Eye className="w-3 h-3 text-ocean" /> Visibility:
            </span>
            <span className="font-bold text-ocean-navy">{visibilityNm} NM</span>
          </div>
          <input 
            type="range"
            min="0.5"
            max="15"
            step="0.5"
            value={visibilityNm}
            onChange={(e) => setVisibilityNm(+e.target.value)}
            className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
          />
        </div>
      </div>

      {/* Decision Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] font-mono uppercase bg-ocean-light/50 text-text-secondary border-y border-border-marine">
            <tr>
              <th className="py-2 px-2.5">Tactical Deployment Domain</th>
              <th className="py-2 px-2">Threshold Limits</th>
              <th className="py-2 px-2 text-right">Operational Safety Verdict</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-marine/60">
            {operations.map((op, idx) => (
              <tr key={idx} className="hover:bg-ocean-light/20 transition-colors">
                <td className="py-2 px-2.5 font-bold text-ocean-navy text-xs">
                  {op.name}
                </td>
                <td className="py-2 px-2 text-[11px] font-mono text-text-secondary">
                  {op.limit}
                </td>
                <td className="py-2 px-2 text-right">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${op.badge}`}>
                    {op.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

