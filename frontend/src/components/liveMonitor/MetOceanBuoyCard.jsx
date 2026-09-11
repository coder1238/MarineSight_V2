import React, { useState } from 'react';
import { Wind, Waves, Thermometer, Gauge, Radio, ArrowUpRight, CloudRain, Droplets, RefreshCw } from 'lucide-react';

function getBeaufortScale(knots) {
  if (knots < 1) return { force: 0, desc: "Calm", sea: "Mirror flat" };
  if (knots <= 3) return { force: 1, desc: "Light Air", sea: "Ripples without crests" };
  if (knots <= 6) return { force: 2, desc: "Light Breeze", sea: "Small wavelets" };
  if (knots <= 10) return { force: 3, desc: "Gentle Breeze", sea: "Large wavelets, scattered whitecaps" };
  if (knots <= 16) return { force: 4, desc: "Moderate Breeze", sea: "Small waves, frequent whitecaps" };
  if (knots <= 21) return { force: 5, desc: "Fresh Breeze", sea: "Moderate waves, many whitecaps" };
  if (knots <= 27) return { force: 6, desc: "Strong Breeze", sea: "Large waves, white foam crests" };
  if (knots <= 33) return { force: 7, desc: "Near Gale", sea: "Sea heaps up, foam streaks" };
  return { force: 8, desc: "Gale", sea: "High waves, rolling breakers" };
}

export default function MetOceanBuoyCard({ activeIncident, simHour = 15.0 }) {
  const [selectedStation, setSelectedStation] = useState("MB-01");

  const stations = {
    "MB-01": {
      name: "MB-01 Deep Ocean Met Buoy",
      coords: "14.72°N, 68.05°E",
      status: "ONLINE · REAL-TIME",
      baseWind: activeIncident?.environment?.windSpeedKn || 14.2,
      baseWave: activeIncident?.environment?.waveHeightM || 1.8,
      baseSst: activeIncident?.environment?.seaSurfaceTempC || 28.4,
      pressure: 1012.4,
      salinity: 36.2,
      depth: "2,480 m"
    },
    "AD-04": {
      name: "AD-04 Karwar Coastal Buoy",
      coords: "14.88°N, 68.65°E",
      status: "ONLINE · 10 MIN CYCLE",
      baseWind: 12.8,
      baseWave: 1.5,
      baseSst: 29.1,
      pressure: 1013.1,
      salinity: 35.8,
      depth: "145 m"
    },
    "AWS-09": {
      name: "AWS-09 Sikka Rig Met Platform",
      coords: "15.15°N, 68.90°E",
      status: "ONLINE · DUAL SENSOR",
      baseWind: 16.5,
      baseWave: 2.2,
      baseSst: 28.0,
      pressure: 1011.8,
      salinity: 36.5,
      depth: "65 m"
    }
  };

  const currentSt = stations[selectedStation] || stations["MB-01"];

  // Varied slightly with simHour
  const timeOffset = Math.sin((simHour / 24) * Math.PI * 2);
  const currentWind = +(currentSt.baseWind + timeOffset * 2.1).toFixed(1);
  const currentGust = +(currentWind * 1.35).toFixed(1);
  const currentWave = +(currentSt.baseWave + timeOffset * 0.35).toFixed(2);
  const wavePeriod = +(6.2 + timeOffset * 0.8).toFixed(1);
  const beaufort = getBeaufortScale(currentWind);
  const currentPressure = +(currentSt.pressure - timeOffset * 1.8).toFixed(1);
  const pressureTrend = timeOffset > 0 ? "Falling (-0.6 hPa/3h)" : "Rising (+0.4 hPa/3h)";

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-3 shadow-marine-sm flex flex-col gap-2.5">
      {/* Header & Station Selector */}
      <div className="flex items-center justify-between pb-1.5 border-b border-border-marine">
        <div className="flex items-center gap-1.5">
          <Waves className="w-4 h-4 text-ocean" />
          <h3 className="font-bold text-xs text-ocean-navy uppercase">METOCEAN BUOY TELEMETRY</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-status-success">BUOY LIVE</span>
        </div>
      </div>

      {/* Station Pills */}
      <div className="flex items-center gap-1 bg-ocean-light/50 p-1 rounded-xl border border-border-marine">
        {Object.entries(stations).map(([id, st]) => (
          <button
            key={id}
            onClick={() => setSelectedStation(id)}
            className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition-all truncate ${
              selectedStation === id 
                ? 'bg-ocean text-white shadow-xs' 
                : 'text-text-secondary hover:bg-white/80'
            }`}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="text-[10px] font-mono text-text-muted flex items-center justify-between">
        <span className="font-bold text-ocean-navy truncate">{currentSt.name}</span>
        <span>{currentSt.coords}</span>
      </div>

      {/* Primary Atmospheric & Marine Sensor Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        {/* Wind Condition */}
        <div className="p-2 rounded-xl bg-slate-50 border border-border-marine flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-500" />
              <span>WIND SPEED</span>
            </span>
            <span className="text-[9px] font-bold text-ocean">310° NW</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-ocean-navy">{currentWind}</span>
            <span className="text-[10px] text-text-muted ml-1">kn (Gusts {currentGust} kn)</span>
          </div>
          <div className="mt-1 text-[9px] text-ocean font-bold truncate">
            Force {beaufort.force} · {beaufort.desc}
          </div>
        </div>

        {/* Sea State & Waves */}
        <div className="p-2 rounded-xl bg-slate-50 border border-border-marine flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-ocean" />
              <span>SIG WAVE (Hs)</span>
            </span>
            <span className="text-[9px] font-bold text-ocean">{wavePeriod}s Tp</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-ocean-navy">{currentWave}</span>
            <span className="text-[10px] text-text-muted ml-1">meters</span>
          </div>
          <div className="mt-1 text-[9px] text-text-secondary truncate">
            {beaufort.sea}
          </div>
        </div>

        {/* Sea Surface Temp & Salinity */}
        <div className="p-2 rounded-xl bg-slate-50 border border-border-marine flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-500" />
              <span>SST / TEMP</span>
            </span>
            <span className="text-[9px] text-text-muted">{currentSt.salinity} PSU</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-ocean-navy">{currentSt.baseSst}°C</span>
            <span className="text-[10px] text-text-muted ml-1">(28.4°F equ.)</span>
          </div>
          <div className="mt-1 text-[9px] text-emerald-600 font-semibold truncate">
            Normal Tropical Shelf
          </div>
        </div>

        {/* Barometric Pressure */}
        <div className="p-2 rounded-xl bg-slate-50 border border-border-marine flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted text-[10px]">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-purple-500" />
              <span>BAROMETER</span>
            </span>
            <span className="text-[9px] text-amber-600 font-bold">QNH</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-black text-ocean-navy">{currentPressure}</span>
            <span className="text-[10px] text-text-muted ml-1">hPa</span>
          </div>
          <div className="mt-1 text-[9px] text-text-muted truncate">
            Trend: {pressureTrend}
          </div>
        </div>
      </div>

      {/* Sensor Health Status */}
      <div className="pt-1.5 border-t border-border-marine/60 text-[9px] font-mono text-text-muted flex items-center justify-between">
        <span>MOORING DEPTH: {currentSt.depth}</span>
        <span className="text-status-success font-semibold">INMARSAT-C TELEMETRY OK</span>
      </div>
    </div>
  );
}

