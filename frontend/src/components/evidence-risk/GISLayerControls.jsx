import React from 'react';
import { Layers, Eye, EyeOff, CheckSquare, Square } from 'lucide-react';

export default function GISLayerControls({ layers, onToggleLayer }) {
  const layerList = [
    { key: "slickExtent", label: "Oil Slick Perimeter", color: "text-status-danger" },
    { key: "aisBreadcrumbs", label: "Suspect AIS Track", color: "text-ocean" },
    { key: "esiShoreline", label: "Shoreline ESI Zones", color: "text-amber-500" },
    { key: "marineSanctuary", label: "Netrani MPA Sanctuary", color: "text-status-success" },
    { key: "shippingFairway", label: "Navigation Fairways", color: "text-purple-500" },
    { key: "virtualBooms", label: "Containment Booms", color: "text-indigo-500" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-ocean-light/70 border border-border-marine rounded-xl text-[11px] font-mono">
      <div className="flex items-center gap-1 text-ocean-navy font-bold mr-1">
        <Layers className="w-3.5 h-3.5 text-ocean" />
        <span>GIS Overlays:</span>
      </div>

      {layerList.map((l) => {
        const isActive = layers[l.key];
        return (
          <button
            key={l.key}
            onClick={() => onToggleLayer(l.key)}
            className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-all ${
              isActive
                ? "bg-white border-ocean/40 text-ocean-navy shadow-sm"
                : "bg-transparent border-transparent text-text-muted hover:bg-white/60"
            }`}
          >
            {isActive ? (
              <Eye className={`w-3 h-3 ${l.color}`} />
            ) : (
              <EyeOff className="w-3 h-3 text-text-muted" />
            )}
            <span>{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}

