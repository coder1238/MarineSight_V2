import React from 'react';
import { 
  Layers, 
  Map as MapIcon, 
  Anchor, 
  Ship, 
  Wind, 
  ShieldAlert, 
  RotateCcw,
  Plus
} from 'lucide-react';

export default function TacticalGisOverlayControls({
  activeLayers,
  onToggleLayer,
  mapType,
  onChangeMapType,
  virtualBoomsCount,
  onResetVirtualBooms,
  onQuickAddBoom
}) {
  const layerButtons = [
    { key: 'booms', label: 'Containment Booms', icon: Anchor, activeColor: 'text-status-warning' },
    { key: 'vessels', label: 'Response Vessels', icon: Ship, activeColor: 'text-status-success' },
    { key: 'oilSpills', label: 'Slick Polygon', icon: Layers, activeColor: 'text-ocean' },
    { key: 'windVectors', label: 'Wind/Current Vectors', icon: Wind, activeColor: 'text-status-info' },
    { key: 'riskZones', label: 'Shoreline ESI Buffers', icon: ShieldAlert, activeColor: 'text-status-danger' }
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-border-marine rounded-xl p-2.5 shadow-marine-sm flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
      {/* Layer Toggles */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold text-text-muted mr-1 uppercase flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-ocean" /> Layers:
        </span>

        {layerButtons.map(btn => {
          const Icon = btn.icon;
          const isActive = activeLayers ? activeLayers[btn.key] : true;

          return (
            <button
              key={btn.key}
              onClick={() => onToggleLayer(btn.key)}
              className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-ocean-navy text-white border-ocean-navy shadow-sm'
                  : 'bg-white text-text-muted border-border-marine hover:border-ocean/40'
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-white' : btn.activeColor}`} />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Basemap & Virtual Booms Quick Actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <select
          value={mapType}
          onChange={(e) => onChangeMapType(e.target.value)}
          className="text-[10px] font-bold p-1 rounded-lg border border-border-marine bg-white text-ocean-navy focus:outline-none"
        >
          <option value="nautical">Nautical Chart (Dark)</option>
          <option value="satellite">Satellite Imagery</option>
          <option value="osm">OpenStreetMap</option>
        </select>

        {virtualBoomsCount > 0 && (
          <button
            onClick={onResetVirtualBooms}
            title="Reset Virtual Booms"
            className="px-2 py-1 rounded-lg border border-red-200 bg-red-50 text-status-danger text-[10px] font-bold flex items-center gap-1 hover:bg-red-100 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Clear Booms ({virtualBoomsCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}

