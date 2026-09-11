import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plane, 
  Info,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export const DISPERSANT_PRODUCTS = [
  {
    name: 'Dasic Slickgone NS (Type 3)',
    dorRatio: 20, // 1:20
    biodegradability: '94% in 28 days',
    efficiencyRanking: 'High',
    toxicityScore: 'Low (LC50 > 100 ppm)'
  },
  {
    name: 'Corexit EC9500A (Hydrocarbon Blend)',
    dorRatio: 20,
    biodegradability: '88% in 28 days',
    efficiencyRanking: 'Very High',
    toxicityScore: 'Moderate (Standard NEBA)'
  },
  {
    name: 'Finasol OSR 52 (Type 2/3 Concentrate)',
    dorRatio: 25,
    biodegradability: '91% in 28 days',
    efficiencyRanking: 'High',
    toxicityScore: 'Low-Tox'
  }
];

export default function DispersantAdvisor({ caseData }) {
  const [waterDepthM, setWaterDepthM] = useState(38);
  const [distanceToShoreNm, setDistanceToShoreNm] = useState(14);
  const [windKnots, setWindKnots] = useState(caseData?.environment?.windSpeedKn || 14);
  const [oilToTreatM3, setOilToTreatM3] = useState(650);
  const [selectedProductIdx, setSelectedProductIdx] = useState(0);

  const product = DISPERSANT_PRODUCTS[selectedProductIdx];

  const assessment = useMemo(() => {
    const isDepthOk = waterDepthM >= 20;
    const isDistanceOk = distanceToShoreNm >= 5.0;
    const isWindOk = windKnots >= 5 && windKnots <= 25;

    let verdict = 'APPROVED';
    let verdictColor = 'bg-emerald-50 text-status-success border-emerald-300';
    let verdictIcon = CheckCircle2;
    let explanation = 'All NEBA criteria satisfied. High dispersal kinetic efficacy with minimal benthic ecotoxicity.';

    if (!isDepthOk || !isDistanceOk) {
      verdict = 'PROHIBITED';
      verdictColor = 'bg-red-50 text-status-danger border-red-300';
      verdictIcon = XCircle;
      explanation = 'Violation of statutory IMO / SPCB limits: Depth must exceed 20m and distance from shore must exceed 5 NM to shield coral & nursery grounds.';
    } else if (!isWindOk) {
      verdict = 'RESTRICTED / CONDITIONAL';
      verdictColor = 'bg-amber-50 text-status-warning border-amber-300';
      verdictIcon = AlertTriangle;
      explanation = windKnots < 5
        ? 'Insufficient surface wave mixing energy. Dispersant will fail to form micro-droplets without mechanical agitation.'
        : 'Wind speeds exceed 25 knots. Aerial spray drift creates severe atmospheric atomization blowback.';
    }

    // Dosage calculation: DOR 1:20 -> 1 m3 dispersant per 20 m3 oil
    const dispersantRequiredM3 = +(oilToTreatM3 / product.dorRatio).toFixed(1);
    const dispersantRequiredLitres = Math.round(dispersantRequiredM3 * 1000);
    const standardBarrels = Math.round(dispersantRequiredLitres / 208); // 208L drums
    // Dornier payload is 1500 litres per flight
    const sortiesRequired = Math.ceil(dispersantRequiredLitres / 1500);

    return {
      isDepthOk,
      isDistanceOk,
      isWindOk,
      verdict,
      verdictColor,
      verdictIcon,
      explanation,
      dispersantRequiredLitres,
      standardBarrels,
      sortiesRequired
    };
  }, [waterDepthM, distanceToShoreNm, windKnots, oilToTreatM3, product]);

  const VerdictIcon = assessment.verdictIcon;

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-status-info/10 text-status-info">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Chemical Dispersant Advisor & NEBA SIMA Matrix
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-ocean border border-sky-200">
                IMO / MARPOL ANNEX I
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Net Environmental Benefit Analysis to authorize aerial or vessel spray sorties.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ocean-light text-ocean font-bold">
          DOR 1:20
        </span>
      </div>

      {/* Decision Banner */}
      <div className={`p-3 rounded-xl border flex items-start gap-3 ${assessment.verdictColor}`}>
        <VerdictIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold font-mono uppercase tracking-wide">
              {assessment.verdict}: CHEMICAL DISPERSION APPLICATION
            </span>
          </div>
          <p className="text-[11px] mt-0.5 leading-relaxed font-sans">
            {assessment.explanation}
          </p>
        </div>
      </div>

      {/* Inputs & Criteria Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Inputs (Col 6) */}
        <div className="md:col-span-6 space-y-3 font-mono">
          <div>
            <label className="text-[10px] font-bold text-ocean-navy uppercase block mb-1">
              Select Approved Dispersant Formula
            </label>
            <select
              value={selectedProductIdx}
              onChange={(e) => setSelectedProductIdx(+e.target.value)}
              className="w-full text-xs font-medium p-2 rounded-xl border border-border-marine bg-white focus:outline-none focus:ring-2 focus:ring-ocean"
            >
              {DISPERSANT_PRODUCTS.map((p, idx) => (
                <option key={p.name} value={idx}>{p.name}</option>
              ))}
            </select>
            <span className="text-[10px] text-text-muted mt-0.5 block italic">
              Eco-profile: {product.toxicityScore}, {product.biodegradability}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Bathymetry Depth (Threshold &gt;20m):</span>
              <span className={`font-bold ${assessment.isDepthOk ? 'text-status-success' : 'text-status-danger'}`}>
                {waterDepthM} meters {assessment.isDepthOk ? '✓' : '✗'}
              </span>
            </div>
            <input 
              type="range"
              min="5"
              max="100"
              step="1"
              value={waterDepthM}
              onChange={(e) => setWaterDepthM(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Distance to Shoreline (Threshold &gt;5 NM):</span>
              <span className={`font-bold ${assessment.isDistanceOk ? 'text-status-success' : 'text-status-danger'}`}>
                {distanceToShoreNm} NM {assessment.isDistanceOk ? '✓' : '✗'}
              </span>
            </div>
            <input 
              type="range"
              min="1"
              max="40"
              step="1"
              value={distanceToShoreNm}
              onChange={(e) => setDistanceToShoreNm(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-text-secondary">Ambient Surface Wind (Window 5 - 25 kn):</span>
              <span className={`font-bold ${assessment.isWindOk ? 'text-status-success' : 'text-status-warning'}`}>
                {windKnots} knots {assessment.isWindOk ? '✓' : '⚠'}
              </span>
            </div>
            <input 
              type="range"
              min="2"
              max="35"
              step="1"
              value={windKnots}
              onChange={(e) => setWindKnots(+e.target.value)}
              className="w-full h-1.5 bg-border-marine rounded-lg appearance-none cursor-pointer accent-ocean"
            />
          </div>
        </div>

        {/* Right Computed Dosage & Aircraft Sorties (Col 6) */}
        <div className="md:col-span-6 bg-ocean-light/30 border border-border-marine rounded-xl p-3.5 flex flex-col justify-between space-y-3 font-mono">
          <div>
            <span className="text-[10px] text-text-muted uppercase block mb-1">OIL VOLUME TARGET</span>
            <div className="flex items-center gap-2 mb-3">
              <input 
                type="number"
                min="50"
                max="5000"
                value={oilToTreatM3}
                onChange={(e) => setOilToTreatM3(+e.target.value || 0)}
                className="w-24 text-xs font-bold p-1.5 rounded-lg border border-border-marine bg-white focus:outline-none focus:ring-1 focus:ring-ocean"
              />
              <span className="text-xs text-ocean-navy font-bold">m³ Target Oil Slick</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-border-marine">
                <span className="text-[8px] text-text-muted block">DISPERSANT REQ.</span>
                <span className="text-xs font-extrabold text-ocean">
                  {assessment.dispersantRequiredLitres.toLocaleString()} L
                </span>
                <span className="text-[8px] text-text-secondary block">1:20 DOR</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-border-marine">
                <span className="text-[8px] text-text-muted block">DRUMS (208L)</span>
                <span className="text-xs font-extrabold text-ocean-navy">
                  {assessment.standardBarrels} Drums
                </span>
                <span className="text-[8px] text-text-secondary block">Pre-staged</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-border-marine">
                <span className="text-[8px] text-text-muted block">AERIAL SORTIES</span>
                <span className="text-xs font-extrabold text-purple-700 flex items-center justify-center gap-1">
                  <Plane className="w-3 h-3" />
                  {assessment.sortiesRequired} Flights
                </span>
                <span className="text-[8px] text-text-secondary block">Dornier 228</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-border-marine text-[11px] font-sans flex items-center justify-between">
            <span className="text-text-secondary">Dispersant Stockpile Readiness (Mormugao Base):</span>
            <span className="font-bold font-mono text-status-success">12,000 L Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}

