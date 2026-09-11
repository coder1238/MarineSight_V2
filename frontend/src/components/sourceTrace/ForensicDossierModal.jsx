import React from 'react';
import { FileText, Download, FileSpreadsheet, Printer, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function ForensicDossierModal({
  isOpen,
  onClose,
  caseData,
  hindcastData,
  suspectVessel,
  tuningParams
}) {
  if (!isOpen) return null;

  const incidentId = caseData?.id || "OF-2026-0912";
  const region = caseData?.region || "Arabian Sea (West Coast EEZ)";

  // Download JSON dossier
  const handleExportJSON = () => {
    const reportData = {
      reportType: "MARITIME_SOURCE_TRACE_HINDCAST_DOSSIER",
      generatedAt: new Date().toISOString(),
      incidentId,
      region,
      hydrodynamicModels: {
        oceanCurrent: "Copernicus Marine CMEMS Global Physics (0.083°)",
        windDrag: "ECMWF Integrated Forecasting System (IFS) 0.1°",
        waveStokes: "Copernicus Wave Model (WAV)"
      },
      tuningParameters: tuningParams,
      hindcastConvergence: {
        status: "CONVERGED_LAGRANGIAN_REVERSAL",
        estimatedReleaseTimeUTC: hindcastData.estimatedReleaseTimeUTC || "03 SEP 2026, 22:40 UTC",
        elapsedDriftHours: hindcastData.backwardDurationHours || 40.0,
        uncertaintyRadiusKm: hindcastData.uncertaintyRadiusKm || 8.7,
        primaryCentroidZoneA: hindcastData.originZoneA,
        secondaryZoneB: hindcastData.originZoneB,
        marginalZoneC: hindcastData.originZoneC
      },
      leadSuspectVessel: suspectVessel || caseData.topVessel,
      marpolJurisdiction: {
        eezJurisdiction: "Indian Exclusive Economic Zone (178 NM offshore)",
        marpolAnnex: "MARPOL Annex I - Prevention of Pollution by Oil (Reg 15/17)",
        enforcingAuthority: "Indian Coast Guard (Maritime Law Enforcement)"
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SOURCE_TRACE_DOSSIER_${incidentId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Download CSV of suspect vessel telemetry
  const handleExportCSV = () => {
    const csvContent = [
      "Vessel Name,MMSI,IMO,Flag,Type,Closest Approach (NM),Release Window Speed (kn),Speed Drop %,AIS Dark Gap (hrs),Suspicion Score %",
      "MV OCEAN STAR,419001248,9876543,India,Crude Oil Tanker (VLCC),1.4,6.2,56%,4.5,94%",
      "MT HORIZON GLORY,354128000,9451122,Panama,Chemical/Oil Products Tanker,3.8,8.1,37%,2.1,78%",
      "AL-JABER TANKER,470992000,9218811,UAE,Bunkering Tanker,6.4,7.5,31%,3.2,72%",
      "STENA POLARIS,636019988,9317987,Liberia,Product Tanker (MR2),5.6,12.0,11%,0.8,61%",
      "BALTIC MARINER,538008891,9612345,Marshall Islands,Capesize Bulk Carrier,7.2,11.8,2%,0.0,35%",
      "MSC ARIANE,255806000,9781234,Portugal,Ultra Large Container Vessel,8.9,19.4,0%,0.0,18%"
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SUSPECT_VESSELS_TRACE_${incidentId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-xs">
      <div className="bg-white border border-border-marine rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:max-w-none print:m-0 print:border-none print:shadow-none">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-ocean-navy text-white print:bg-white print:text-black print:border-b-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-ocean-sky print:text-black" />
            <div>
              <h3 className="font-bold text-sm">Forensic Origin Attribution & Hindcast Dossier</h3>
              <p className="text-[11px] text-slate-300 font-mono print:text-black">
                Official Maritime Intelligence Investigation Report #{incidentId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 font-mono text-xs flex-1">
          {/* Executive Summary */}
          <div className="p-3 bg-ocean-light/40 border border-border-marine rounded-xl space-y-1">
            <span className="font-bold text-ocean-navy uppercase block text-xs">
              Executive Incident Summary
            </span>
            <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
              Backward Lagrangian trajectory tracking utilizing Copernicus CMEMS currents (61%) and ECMWF atmospheric windage (39%) indicates an illicit hydrocarbon discharge occurred at approximately <strong>{hindcastData.estimatedReleaseTimeUTC || "03 SEP 2026, 22:40 UTC"}</strong> within Zone A centroid ({hindcastData.originZoneA?.coordinates || "14.6521°N, 67.9015°E"}).
            </p>
          </div>

          {/* Key Findings Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-border-marine rounded-xl bg-slate-50 space-y-1">
              <span className="text-[10px] text-text-muted block">ORIGIN CONVERGENCE</span>
              <div className="font-bold text-ocean-navy text-sm">Zone A: 72.4% Probability</div>
              <div className="text-[10px] text-text-secondary">Uncertainty Envelope: ±{hindcastData.uncertaintyRadiusKm || 8.7} km</div>
              <div className="text-[10px] text-text-secondary">Water Depth: 2,140m (Abyssal Plain)</div>
            </div>

            <div className="p-3 border border-border-marine rounded-xl bg-slate-50 space-y-1">
              <span className="text-[10px] text-text-muted block">LEAD SUSPECT CORROBORATION</span>
              <div className="font-bold text-rose-600 text-sm">MV OCEAN STAR (94% Match)</div>
              <div className="text-[10px] text-text-secondary">Closest Point of Approach: 1.4 NM</div>
              <div className="text-[10px] text-text-secondary">AIS Dark Gap: 4.5h during release</div>
            </div>
          </div>

          {/* Meteorological & Hydrodynamic Forcing Table */}
          <div className="space-y-1.5">
            <span className="font-bold text-ocean-navy uppercase block text-xs">
              Hydrodynamic Back-Calculation Parameters
            </span>
            <div className="border border-border-marine rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 text-text-muted">
                  <tr>
                    <th className="p-2">Forcing Agent</th>
                    <th className="p-2">Source Dataset</th>
                    <th className="p-2">Weight / Mult.</th>
                    <th className="p-2 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-marine/50">
                  <tr>
                    <td className="p-2 font-bold text-ocean-navy">Ocean Surface Current</td>
                    <td className="p-2">Copernicus CMEMS 1/12°</td>
                    <td className="p-2">{tuningParams?.currentMultiplier || 1.0}x</td>
                    <td className="p-2 text-right font-bold text-ocean">61%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-ocean-navy">Windage Leeway</td>
                    <td className="p-2">ECMWF IFS (10m Wind)</td>
                    <td className="p-2">{tuningParams?.windage || 3.2}%</td>
                    <td className="p-2 text-right font-bold text-ocean-deep">39%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-ocean-navy">Ekman Coriolis Angle</td>
                    <td className="p-2">Planetary Boundary Layer</td>
                    <td className="p-2">+{tuningParams?.ekmanAngle || 3}°</td>
                    <td className="p-2 text-right font-bold text-emerald-600">Active</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Suspect Vessel Excerpt */}
          <div className="space-y-1.5">
            <span className="font-bold text-ocean-navy uppercase block text-xs">
              Primary Vessel Attribution Profile
            </span>
            <div className="p-3 border border-rose-200 bg-rose-50/60 rounded-xl space-y-1 text-[11px]">
              <div className="flex justify-between font-bold text-ocean-navy">
                <span>MV OCEAN STAR (IMO 9876543 / MMSI 419001248)</span>
                <span className="text-rose-600">CRIMINAL SUSPICION: 94%</span>
              </div>
              <p className="text-text-secondary">
                Vessel was en route from Fujairah to Mumbai Port. Transmitted AIS telemetry went dark at 03 SEP 20:15 UTC while cruising at 14.2 kn. AIS re-established at 04 SEP 00:45 UTC with vessel speed decelerated to 6.2 kn directly inside the Zone A backward slick trajectory corridor.
              </p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-border-marine flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-ocean" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-border-marine bg-white hover:bg-ocean-light text-ocean-navy text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-ocean" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

