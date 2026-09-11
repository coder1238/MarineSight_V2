import React, { useState } from 'react';
import { 
  Ship, 
  Radio, 
  Navigation, 
  BatteryMedium, 
  Users, 
  CheckCircle2, 
  RotateCw,
  Send,
  Anchor,
  Clock
} from 'lucide-react';

const INITIAL_FLEET = [
  {
    id: 'VES-01',
    name: 'ICGS Samudra Prahari',
    callsign: 'VWSP',
    type: 'Pollution Control Vessel (PCV)',
    status: 'On-Scene Skimming',
    statusColor: 'bg-emerald-100 text-status-success border-emerald-300',
    lat: 15.2000,
    lng: 73.1000,
    heading: 250,
    speedKn: 12.4,
    fuelEndurancePercent: 78,
    crewCount: 36,
    mission: 'Primary High-Capacity Weir Skimming & Flotilla Command',
    equipment: '2x 120m³/h Weir Skimmers, 1.2km Heavy Boom, Dispersant Boom Spray'
  },
  {
    id: 'VES-02',
    name: 'Skimmer Barge Alpha-2',
    callsign: 'SKM-A2',
    type: 'Dedicated Recovery Skimmer',
    status: 'Mobilizing (ETA 35m)',
    statusColor: 'bg-amber-100 text-status-warning border-amber-300',
    lat: 14.9500,
    lng: 73.3500,
    heading: 270,
    speedKn: 8.5,
    fuelEndurancePercent: 92,
    crewCount: 8,
    mission: 'Centroid Slick Interception & Pocket Skimming',
    equipment: 'Oleophilic Drum Skimmer (45m³/h), 400m Shoreline Barrier'
  },
  {
    id: 'VES-03',
    name: 'ICGS Interceptor C-401',
    callsign: 'CG-401',
    type: 'High-Speed Patrol Craft',
    status: 'Deploying Booms',
    statusColor: 'bg-blue-100 text-ocean border-blue-300',
    lat: 15.3800,
    lng: 73.7400,
    heading: 195,
    speedKn: 24.0,
    fuelEndurancePercent: 64,
    crewCount: 12,
    mission: 'Zuari Estuary Containment Boom Mooring & Traffic Exclusion',
    equipment: 'High-tension towing winch, FLIR night vision camera'
  },
  {
    id: 'VES-04',
    name: 'Ocean Tug Sagar Kanya',
    callsign: 'TUG-SK',
    type: 'Commercial Anchor-Handling Tug',
    status: 'Docked / Standby',
    statusColor: 'bg-gray-100 text-text-secondary border-gray-300',
    lat: 15.4100,
    lng: 73.8000,
    heading: 0,
    speedKn: 0.0,
    fuelEndurancePercent: 95,
    crewCount: 10,
    mission: 'Heavy Deflection Boom J-Towing & Offshore Mooring Anchor Rigging',
    equipment: '65-ton bollard pull winch, 2,000m tow hawser'
  },
  {
    id: 'VES-05',
    name: 'Dornier 228 (CG-751)',
    callsign: 'MAR-PATROL',
    type: 'Maritime Surveillance Recon Aircraft',
    status: 'Airborne (On Patrol)',
    statusColor: 'bg-purple-100 text-purple-700 border-purple-300',
    lat: 15.0000,
    lng: 73.2000,
    heading: 310,
    speedKn: 180.0,
    fuelEndurancePercent: 55,
    crewCount: 4,
    mission: 'SLAR / Thermal Slick Boundary Mapping & Dispersant Spray Guidance',
    equipment: 'Side-Looking Airborne Radar (SLAR), UV/IR Optical Sensors, 1,500L Tank'
  }
];

export const STATUS_OPTIONS = [
  'Docked / Standby',
  'Mobilizing (ETA 35m)',
  'On-Scene Skimming',
  'Deploying Booms',
  'Airborne (On Patrol)',
  'Refueling / Demob'
];

export default function VesselFleetDispatchBoard({ onUpdateFleet }) {
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [selectedVesselId, setSelectedVesselId] = useState('VES-01');
  const [actionNotice, setActionNotice] = useState('');

  const handleStatusChange = (vesselId, newStatus) => {
    const updated = fleet.map(v => {
      if (v.id === vesselId) {
        let statusColor = 'bg-gray-100 text-text-secondary border-gray-300';
        if (newStatus.includes('On-Scene') || newStatus.includes('Airborne')) {
          statusColor = 'bg-emerald-100 text-status-success border-emerald-300';
        } else if (newStatus.includes('Mobilizing')) {
          statusColor = 'bg-amber-100 text-status-warning border-amber-300';
        } else if (newStatus.includes('Deploying')) {
          statusColor = 'bg-blue-100 text-ocean border-blue-300';
        }
        return { ...v, status: newStatus, statusColor };
      }
      return v;
    });

    setFleet(updated);
    if (onUpdateFleet) onUpdateFleet(updated);

    const vessel = fleet.find(v => v.id === vesselId);
    setActionNotice(`Dispatch order transmitted to ${vessel?.name}: "${newStatus}"`);
    setTimeout(() => setActionNotice(''), 3500);
  };

  const activeVessel = fleet.find(v => v.id === selectedVesselId) || fleet[0];

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Ship className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Vessel Fleet Staging & Interactive Dispatch Board
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                {fleet.length} ASSETS LOGGED
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Real-time operational status, fuel endurance, and tactical task reassignment.
            </p>
          </div>
        </div>

        {actionNotice && (
          <div className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-50 text-status-success border border-emerald-200 animate-pulse font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3" />
            {actionNotice}
          </div>
        )}
      </div>

      {/* Grid: Vessel Roster (Col 7) + Selected Vessel Detail / Dispatch Orders (Col 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Vessel Table (Col 7) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-mono uppercase bg-ocean-light/50 text-text-secondary border-y border-border-marine">
                <tr>
                  <th className="py-2 px-2.5">Asset / Call</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Fuel</th>
                  <th className="py-2 px-2">Current Mission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-marine/60">
                {fleet.map((v) => {
                  const isSelected = v.id === selectedVesselId;
                  return (
                    <tr 
                      key={v.id}
                      onClick={() => setSelectedVesselId(v.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-ocean-light/70 font-semibold' : 'hover:bg-ocean-light/30'
                      }`}
                    >
                      <td className="py-2.5 px-2.5">
                        <div className="font-bold text-ocean-navy text-xs">{v.name}</div>
                        <span className="text-[10px] font-mono text-text-muted">{v.callsign}</span>
                      </td>
                      <td className="py-2.5 px-2 text-[11px] text-text-secondary font-mono">
                        {v.type}
                      </td>
                      <td className="py-2.5 px-2 text-xs font-mono">
                        <div className="flex items-center gap-1">
                          <span className={`font-bold ${v.fuelEndurancePercent < 60 ? 'text-status-warning' : 'text-status-success'}`}>
                            {v.fuelEndurancePercent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2">
                        <select
                          value={v.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(v.id, e.target.value)}
                          className={`text-[10px] font-mono font-bold px-2 py-1 rounded-md border shadow-sm focus:outline-none focus:ring-1 focus:ring-ocean ${v.statusColor}`}
                        >
                          {STATUS_OPTIONS.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vessel Detail Card & Quick Dispatch (Col 5) */}
        <div className="lg:col-span-5 bg-ocean-light/30 border border-border-marine rounded-xl p-3.5 flex flex-col justify-between space-y-3 font-mono">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border-marine">
              <div>
                <span className="text-[9px] text-text-muted uppercase block">SELECTED ASSET</span>
                <h4 className="text-xs font-bold text-ocean-navy">{activeVessel.name}</h4>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${activeVessel.statusColor}`}>
                {activeVessel.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="bg-white p-1.5 rounded border border-border-marine">
                <span className="text-[8px] text-text-muted block">SPEED</span>
                <span className="text-xs font-bold text-ocean">{activeVessel.speedKn} kn</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-border-marine">
                <span className="text-[8px] text-text-muted block">HEADING</span>
                <span className="text-xs font-bold text-ocean-navy">{activeVessel.heading}°</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-border-marine">
                <span className="text-[8px] text-text-muted block">CREW</span>
                <span className="text-xs font-bold text-status-success">{activeVessel.crewCount} Pers</span>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-[11px] font-sans">
              <div>
                <span className="text-[10px] font-mono font-bold text-ocean-navy block">Tactical Objective:</span>
                <p className="text-text-secondary text-[11px] leading-snug">{activeVessel.mission}</p>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-ocean-navy block">Onboard Equipment:</span>
                <p className="text-text-secondary text-[10px] font-mono leading-snug">{activeVessel.equipment}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-border-marine flex gap-2">
            <button
              onClick={() => handleStatusChange(activeVessel.id, 'On-Scene Skimming')}
              className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold font-mono transition-colors shadow-sm"
            >
              Order: Intercept & Skim
            </button>
            <button
              onClick={() => handleStatusChange(activeVessel.id, 'Deploying Booms')}
              className="flex-1 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[10px] font-bold font-mono transition-colors shadow-sm"
            >
              Order: Lay Booms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

