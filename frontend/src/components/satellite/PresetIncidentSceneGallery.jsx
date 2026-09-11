import React from 'react';
import { Layers, BookmarkCheck, ArrowRight, Satellite } from 'lucide-react';

export const BENCHMARK_SCENES = [
  {
    id: "mumbai-high",
    title: "Mumbai High Basin Spill (2024)",
    location: "19.412°N, 71.340°E",
    constellation: "Sentinel-1A SAR IW",
    spillAreaKm2: 18.4,
    spillsCount: 2,
    vesselsCount: 4,
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&q=80",
    desc: "Heavy crude offshore platform discharge with prominent 14.8 km drift plume."
  },
  {
    id: "persian-gulf",
    title: "Strait of Hormuz Tanker Flare",
    location: "26.340°N, 56.241°E",
    constellation: "Sentinel-1B Dual Pol",
    spillAreaKm2: 24.6,
    spillsCount: 1,
    vesselsCount: 6,
    imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1000&q=80",
    desc: "High density commercial shipping corridor with persistent dark vessel AIS spoofing."
  },
  {
    id: "red-sea",
    title: "Red Sea Southern Bilge Discharge",
    location: "14.821°N, 42.610°E",
    constellation: "Sentinel-2 MSI Optical",
    spillAreaKm2: 11.2,
    spillsCount: 1,
    vesselsCount: 2,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80",
    desc: "Linear discharge trail extending 32 km along primary Red Sea commercial lane."
  },
  {
    id: "bay-of-bengal",
    title: "Bay of Bengal Monsoon Drift",
    location: "17.201°N, 85.129°E",
    constellation: "RADARSAT Constellation",
    spillAreaKm2: 29.8,
    spillsCount: 3,
    vesselsCount: 3,
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80",
    desc: "Monsoon wind-driven emulsified slick spreading towards sensitive mangrove estuary."
  }
];

export default function PresetIncidentSceneGallery({
  activeSceneId = "mumbai-high",
  onSelectScene
}) {
  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 18 · Preset Maritime SAR Incident Benchmark Library
          </h3>
        </div>
        <span className="text-[10px] bg-ocean-light text-ocean px-2 py-0.5 rounded font-bold border border-border-marine">
          4 Benchmark Datasets
        </span>
      </div>

      {/* Grid of Benchmark Scenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {BENCHMARK_SCENES.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelectScene && onSelectScene(scene)}
            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
              activeSceneId === scene.id
                ? 'border-ocean bg-ocean-sky/40 ring-2 ring-ocean/30 shadow-xs'
                : 'border-border-marine bg-white hover:bg-ocean-light/30'
            }`}
          >
            <div>
              <div className="flex items-center justify-between font-bold text-ocean-navy text-[11px] mb-1">
                <span className="truncate">{scene.title.split(' ')[0]} {scene.title.split(' ')[1]}</span>
                <span className="text-ocean text-[10px]">{scene.spillAreaKm2} km&sup2;</span>
              </div>
              <p className="text-[10px] text-text-muted mb-2">{scene.location}</p>
              <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">
                {scene.desc}
              </p>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border-marine/50 flex items-center justify-between text-[9.5px]">
              <span className="text-text-muted">{scene.constellation}</span>
              <span className="font-bold text-ocean flex items-center gap-0.5">
                Load Scene &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

