import React from 'react';
import { Crosshair, MapPin, Compass, Waves, Check, Trash2 } from 'lucide-react';

export default function PinpointGeolocationTool({
  activePins = [],
  onClearPins,
  onSelectPin,
  selectedPinId
}) {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 16 · Interactive Pinpoint Geolocation &amp; Sounding Tool
          </h3>
        </div>
        {activePins.length > 0 && (
          <button
            onClick={onClearPins}
            className="text-[10px] text-text-muted hover:text-status-danger flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Pins ({activePins.length})</span>
          </button>
        )}
      </div>

      {activePins.length === 0 ? (
        <div className="p-3 text-center text-xs text-text-muted bg-ocean-light/20 rounded-xl border border-dashed border-border-marine">
          Click anywhere on the Satellite SAR Viewer to drop inspection pins with instant Lat/Long coordinates, bathymetric depth, and backscatter dB reading.
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {activePins.map((pin, i) => (
            <div
              key={pin.id || i}
              onClick={() => onSelectPin && onSelectPin(pin.id)}
              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                selectedPinId === pin.id
                  ? 'border-ocean bg-ocean-sky/40'
                  : 'border-border-marine bg-white hover:bg-ocean-light/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ocean flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-ocean-navy text-[11px]">{pin.label || `Point #${i + 1}`}</span>
                    <span className="text-[9.5px] text-ocean font-bold">{pin.lat}°N, {pin.lng}°E</span>
                  </div>
                  <div className="text-[9.5px] text-text-secondary mt-0.5 flex gap-2">
                    <span>Depth: {pin.depthM || 184}m</span>
                    <span>·</span>
                    <span>Shore: {pin.shoreDistNm || 42.6} nm</span>
                    <span>·</span>
                    <span>&sigma;&sup0;: {pin.sigmaDb || -14.2} dB</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

