import React, { useState } from 'react';
import { 
  Heart, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Radio, 
  Plus, 
  Minus 
} from 'lucide-react';

const SPECIES_MONITORED = [
  { name: 'Olive Ridley Sea Turtles', status: 'High Vulnerability', nestingSeason: 'Active Nesting Window', threat: 'Surface breathing aspiration' },
  { name: 'Mangrove Fiddler Crabs', status: 'Moderate', nestingSeason: 'Resident Colony', threat: 'Burrow smothering' },
  { name: 'Pelagic Tern & Seagulls', status: 'High Vulnerability', nestingSeason: 'Migratory Foraging', threat: 'Plumage hypothermia & ingestion' },
  { name: 'Indo-Pacific Humpback Dolphins', status: 'Critical / Protected', nestingSeason: 'Nearshore Pods', threat: 'Inhalation of volatile vapors' }
];

export default function WildlifeRescueModule() {
  const [animalsRescued, setAnimalsRescued] = useState(14);
  const [animalsCleaned, setAnimalsCleaned] = useState(11);
  const [animalsReleased, setAnimalsReleased] = useState(8);
  const [hazingActive, setHazingActive] = useState(true);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Wildlife Rescue & Ecological Rehabilitation Protocol
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                OWCN / IUCN RED LIST
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Search & collection flotillas, acoustic deterrence hazing, and wildlife stabilization hospital.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-muted font-bold">HAZING CANNONS:</span>
          <button
            onClick={() => setHazingActive(!hazingActive)}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
              hazingActive ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-gray-100 text-text-muted border-gray-300'
            }`}
          >
            {hazingActive ? 'ACTIVE (Acoustic)' : 'STANDBY'}
          </button>
        </div>
      </div>

      {/* Triage Live Counters */}
      <div className="grid grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-ocean-light/30 border border-border-marine text-center">
          <span className="text-[9px] text-text-muted uppercase block">ANIMALS RECOVERED</span>
          <span className="text-lg font-black text-status-warning block my-1">{animalsRescued}</span>
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => setAnimalsRescued(Math.max(0, animalsRescued - 1))}
              className="w-5 h-5 rounded bg-white border border-border-marine text-text-secondary hover:text-ocean flex items-center justify-center font-bold"
            >
              -
            </button>
            <button 
              onClick={() => setAnimalsRescued(animalsRescued + 1)}
              className="w-5 h-5 rounded bg-ocean text-white hover:bg-ocean-deep flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-ocean-light/30 border border-border-marine text-center">
          <span className="text-[9px] text-text-muted uppercase block">TRIAGED & CLEANED</span>
          <span className="text-lg font-black text-ocean block my-1">{animalsCleaned}</span>
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => setAnimalsCleaned(Math.max(0, animalsCleaned - 1))}
              className="w-5 h-5 rounded bg-white border border-border-marine text-text-secondary hover:text-ocean flex items-center justify-center font-bold"
            >
              -
            </button>
            <button 
              onClick={() => setAnimalsCleaned(animalsCleaned + 1)}
              className="w-5 h-5 rounded bg-ocean text-white hover:bg-ocean-deep flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-ocean-light/30 border border-border-marine text-center">
          <span className="text-[9px] text-text-muted uppercase block">RELEASED TO HABITAT</span>
          <span className="text-lg font-black text-status-success block my-1">{animalsReleased}</span>
          <div className="inline-flex items-center gap-1">
            <button 
              onClick={() => setAnimalsReleased(Math.max(0, animalsReleased - 1))}
              className="w-5 h-5 rounded bg-white border border-border-marine text-text-secondary hover:text-ocean flex items-center justify-center font-bold"
            >
              -
            </button>
            <button 
              onClick={() => setAnimalsReleased(animalsReleased + 1)}
              className="w-5 h-5 rounded bg-status-success text-white hover:bg-emerald-700 flex items-center justify-center font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Species Monitored List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {SPECIES_MONITORED.map((sp, idx) => (
          <div key={idx} className="p-2.5 rounded-xl border border-border-marine bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ocean-navy text-xs">{sp.name}</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-100 text-status-danger">
                {sp.status}
              </span>
            </div>
            <div className="mt-1 text-[11px] text-text-secondary font-sans">
              <span>Threat: {sp.threat}</span>
              <span className="block text-[10px] text-text-muted font-mono mt-0.5">{sp.nestingSeason}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

