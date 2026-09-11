import React, { useState } from 'react';
import { Clock, Satellite, Calendar, AlertCircle, Compass, CheckCircle2 } from 'lucide-react';

export const ORBITAL_PASSES = [
  {
    satellite: "Sentinel-1A (ESA)",
    orbitType: "Sun-Synchronous Polar",
    passType: "Ascending",
    sensorMode: "Interferometric Wide (IW)",
    polarization: "VV + VH",
    incidenceAngle: "34.8°",
    etaHours: 3.8,
    passTime: "Today at 04:18 UTC",
    swathWidth: "250 km",
    resolution: "10 m",
    readiness: "Optimal (Radar Night-capable)"
  },
  {
    satellite: "Sentinel-2B (ESA Optical)",
    orbitType: "Sun-Synchronous Polar",
    passType: "Descending",
    sensorMode: "Multi-Spectral Instrument (MSI)",
    polarization: "Bands 1-12",
    incidenceAngle: "0.0° (Nadir)",
    etaHours: 11.2,
    passTime: "Today at 11:42 UTC",
    swathWidth: "290 km",
    resolution: "10-20 m",
    readiness: "Daylight Dependent (Cloud cover ~18%)"
  },
  {
    satellite: "RADARSAT Constellation-1 (CSA)",
    orbitType: "Dawn-Dusk Orbit",
    passType: "Descending",
    sensorMode: "Medium Resolution 50m SAR",
    polarization: "Compact Pol (Circular)",
    incidenceAngle: "38.2°",
    etaHours: 16.5,
    passTime: "Tomorrow at 17:00 UTC",
    swathWidth: "350 km",
    resolution: "30 m",
    readiness: "Standby Re-tasking"
  },
  {
    satellite: "TerraSAR-X (DLR/Airbus)",
    orbitType: "Sun-Synchronous Polar",
    passType: "Ascending",
    sensorMode: "StripMap X-Band SAR (9.65 GHz)",
    polarization: "HH / VV Dual",
    incidenceAngle: "41.5°",
    etaHours: 24.1,
    passTime: "Tomorrow at 00:36 UTC",
    swathWidth: "30 km",
    resolution: "3 m (High-Res)",
    readiness: "Commercial On-Demand"
  }
];

export default function SatelliteRevisitPredictor() {
  const [selectedPass, setSelectedPass] = useState(ORBITAL_PASSES[0]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 7 · Satellite Orbital Pass & Constellation Re-visit Schedule
          </h3>
        </div>
        <span className="text-[10px] bg-emerald-50 text-status-success border border-emerald-200 px-2 py-0.5 rounded font-bold">
          Next Pass in 3h 48m
        </span>
      </div>

      {/* Orbit Passes Timeline */}
      <div className="space-y-2">
        {ORBITAL_PASSES.map((pass, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPass(pass)}
            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
              selectedPass.satellite === pass.satellite
                ? 'border-ocean bg-ocean-sky/40 shadow-xs'
                : 'border-border-marine bg-ocean-light/20 hover:bg-ocean-light/50'
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <Satellite className={`w-3.5 h-3.5 ${selectedPass.satellite === pass.satellite ? 'text-ocean' : 'text-text-muted'}`} />
                <span className="text-ocean-navy">{pass.satellite}</span>
              </div>
              <span className="text-ocean font-bold">T - {pass.etaHours} hrs</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mt-1.5 text-[10px] text-text-secondary">
              <div><span className="text-text-muted">PASS:</span> {pass.passTime}</div>
              <div><span className="text-text-muted">NODE:</span> {pass.passType}</div>
              <div><span className="text-text-muted">INCIDENCE:</span> {pass.incidenceAngle}</div>
              <div><span className="text-text-muted">RES:</span> {pass.resolution}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Pass Detailed Telemetry Callout */}
      <div className="p-2.5 bg-[#0B2545] rounded-xl border border-cyan-400/30 text-white text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-cyan-300">{selectedPass.satellite} Acquisition Window</span>
          <span className="text-[10px] text-emerald-400 font-bold">{selectedPass.readiness}</span>
        </div>
        <p className="text-[11px] text-slate-300">
          Sensor Mode: <span className="text-white font-semibold">{selectedPass.sensorMode}</span> · Swath: <span className="text-white font-semibold">{selectedPass.swathWidth}</span> · Orbit: <span className="text-white font-semibold">{selectedPass.orbitType}</span>
        </p>
      </div>
    </div>
  );
}

