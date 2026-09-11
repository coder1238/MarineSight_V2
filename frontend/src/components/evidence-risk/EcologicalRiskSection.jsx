import React, { useState } from 'react';
import { ShieldAlert, Fish, Trees, AlertTriangle, Info, Compass, Anchor, AlertOctagon } from 'lucide-react';

export const ESI_ZONES = [
  {
    id: "mangroves",
    name: "Cabo de Rama & Zuari Mangrove Estuary",
    esi: 10,
    type: "Intertidal Mangrove Complex",
    vulnerability: "EXTREME (ESI 10)",
    persistence: "5 - 10+ Years",
    cleanupDifficulty: "HIGHLY SENSITIVE - NO MECHANICAL DIGGING",
    description: "Dense Rhizophora & Avicennia roots trap heavy fuel oil. High natural mortality risk for benthic crab nurseries and juvenile shrimp.",
    recommendedAction: "Deflection Booming at river mouth prior to T+12h tide flood."
  },
  {
    id: "corals",
    name: "Netrani Island Coral Sanctuary",
    esi: 9,
    type: "Subtidal Coral Reef & Fish Nursery",
    vulnerability: "VERY HIGH (ESI 9)",
    persistence: "2 - 5 Years",
    cleanupDifficulty: "RESTRICTED (Chemical dispersants strictly prohibited within 5 nm)",
    description: "Pristine Acropora corals and sea anemone fields. High risk of smothering if oil emulsifies into dense chocolate mousse.",
    recommendedAction: "Stationary offshore curtain containment boom; skimming only."
  },
  {
    id: "beaches",
    name: "Benaulim & Colva Tourist Shoreline",
    esi: 3,
    type: "Fine to Medium Grain Sandy Beaches",
    vulnerability: "MODERATE (ESI 3)",
    persistence: "1 - 3 Months",
    cleanupDifficulty: "MODERATE (Manual scraping & vacuum skimmers viable)",
    description: "High socio-economic footprint. Major turtle nesting corridor during monsoon season.",
    recommendedAction: "Pre-emptive shore-line absorbent sweepers and beach access closures."
  },
  {
    id: "port",
    name: "Mormugao Port Approach & Ore Berths",
    esi: 2,
    type: "Artificial Concrete Seawalls & Deep Berths",
    vulnerability: "LOW ECOLOGICAL / HIGH ECONOMIC (ESI 2)",
    persistence: "Weeks",
    cleanupDifficulty: "LOW (High-pressure sea washing & suction units)",
    description: "Deep-draft navigation channel. Oil sheen risks fouling cooling water intakes of bulk ore carriers.",
    recommendedAction: "Harbor gate pneumatic bubble barrier + rapid gate closure."
  }
];

export const VULNERABLE_SPECIES = [
  {
    commonName: "Olive Ridley Sea Turtle",
    scientificName: "Lepidochelys olivacea",
    iucn: "VULNERABLE (Schedule I)",
    hazardLevel: "CRITICAL",
    impactMechanism: "Surface breathing inhalation of toxic VOCs, eye irritation, nesting beach oil fouling",
    seasonality: "Active Breeding Season (Sept - March)",
    mitigation: "Deploy shore patrols, establish rescue rehab pools, boom nesting sandbars"
  },
  {
    commonName: "Indian Ocean Humpback Dolphin",
    scientificName: "Sousa chinensis",
    iucn: "ENDANGERED (Schedule I)",
    hazardLevel: "HIGH",
    impactMechanism: "Blowhole inhalation of volatile aromatic hydrocarbons, acoustic disturbance during response",
    seasonality: "Resident Coastal Population (Zuari / Mandovi mouth)",
    mitigation: "Enforce 5-knot vessel speed restrictions for response fleet; acoustic deterrent pingers"
  },
  {
    commonName: "Staghorn & Brain Corals",
    scientificName: "Acropora & Favia spp.",
    iucn: "NEAR THREATENED",
    hazardLevel: "HIGH",
    impactMechanism: "Polyps smothering by weathered heavy emulsion, toxic water-soluble fraction (WSF)",
    seasonality: "Spawning cycle active",
    mitigation: "Strict zero-dispersant exclusion zone within 10 km radius of Netrani"
  },
  {
    commonName: "Mud Crab & Penaeid Shrimp",
    scientificName: "Scylla serrata & Penaeus monodon",
    iucn: "COMMERCIALLY CRITICAL",
    hazardLevel: "VERY HIGH",
    impactMechanism: "Total loss of intertidal benthic larvae in estuary mud flats; severe fishery collapse",
    seasonality: "Peak harvesting season",
    mitigation: "Temporary fisheries closure; tidal gate deployment at creek entrances"
  }
];

export default function EcologicalRiskSection() {
  const [selectedZone, setSelectedZone] = useState(ESI_ZONES[0]);
  const [activeTab, setActiveTab] = useState("esi"); // 'esi' or 'species'

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-status-danger" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase font-mono">
            Environmental Sensitivity Index (ESI) & Biodiversity Risk
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-ocean-light p-1 rounded-xl border border-border-marine text-xs font-mono">
          <button
            onClick={() => setActiveTab("esi")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === "esi" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Shoreline ESI Matrix
          </button>
          <button
            onClick={() => setActiveTab("species")}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeTab === "species" ? "bg-ocean text-white shadow-sm" : "text-text-secondary hover:text-ocean-navy"
            }`}
          >
            Marine Biodiversity Vulnerability
          </button>
        </div>
      </div>

      {/* Tab 1: ESI Shoreline Matrix (Feature 5) */}
      {activeTab === "esi" && (
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ESI_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-ocean-sky/40 border-ocean ring-2 ring-ocean/30 shadow-sm"
                      : "bg-white hover:bg-ocean-light/50 border-border-marine"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-bold">ESI {zone.esi}/10</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      zone.esi >= 9 ? "bg-red-100 text-status-danger" : zone.esi >= 7 ? "bg-amber-100 text-status-warning" : "bg-emerald-100 text-status-success"
                    }`}>
                      {zone.esi >= 9 ? "EXTREME" : zone.esi >= 7 ? "HIGH" : "MODERATE"}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-ocean-navy mt-1 truncate">{zone.name}</h4>
                  <span className="text-[10px] text-text-secondary truncate block mt-0.5">{zone.type}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Zone Card */}
          <div className="bg-ocean-light/60 border border-border-marine rounded-xl p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-marine pb-2">
              <div>
                <span className="text-[10px] text-text-muted uppercase block">SELECTED SHORELINE SECTOR</span>
                <h4 className="text-sm font-extrabold text-ocean-navy">{selectedZone.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-status-danger px-2.5 py-1 rounded bg-red-50 border border-red-200">
                  {selectedZone.vulnerability}
                </span>
                <span className="text-[11px] text-text-muted font-sans">
                  Oil Persistence: <strong>{selectedZone.persistence}</strong>
                </span>
              </div>
            </div>

            <p className="text-text-primary text-xs font-sans leading-relaxed">
              {selectedZone.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-border-marine">
                <span className="text-[10px] text-text-muted uppercase block font-bold">CLEANUP COMPLEXITY:</span>
                <span className="text-status-warning font-semibold">{selectedZone.cleanupDifficulty}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-border-marine">
                <span className="text-[10px] text-ocean-deep uppercase block font-bold">RECOMMENDED CONTAINMENT:</span>
                <span className="text-ocean-navy font-semibold">{selectedZone.recommendedAction}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Marine Biodiversity & Species Vulnerability (Feature 7) */}
      {activeTab === "species" && (
        <div className="space-y-3 font-mono text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono">
              <thead className="bg-ocean-light border-b border-border-marine text-[9px] text-text-muted uppercase">
                <tr>
                  <th className="px-3 py-2">SPECIES & TAXONOMY</th>
                  <th className="px-3 py-2">IUCN CONSERVATION STATUS</th>
                  <th className="px-3 py-2">MORTALITY THREAT & MECHANISM</th>
                  <th className="px-3 py-2">ACTIVE BREEDING SEASON</th>
                  <th className="px-3 py-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/50">
                {VULNERABLE_SPECIES.map((spec, i) => (
                  <tr key={i} className="hover:bg-ocean-sky/20">
                    <td className="px-3 py-2.5">
                      <div className="font-bold text-ocean-navy">{spec.commonName}</div>
                      <div className="text-[10px] text-text-muted italic font-serif">{spec.scientificName}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-status-warning border border-amber-200">
                        {spec.iucn}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-text-secondary max-w-xs">
                      {spec.impactMechanism}
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-ocean-navy font-semibold">
                      {spec.seasonality}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="px-2 py-1 rounded bg-ocean-sky text-ocean text-[10px] font-bold border border-ocean/30">
                        Shield Protocol
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

