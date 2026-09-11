import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Compass, 
  Satellite, 
  Map as MapIcon, 
  AlertTriangle,
  RefreshCw,
  Ship,
  Info,
  Eye,
  EyeOff,
  Radio,
  Anchor,
  ShieldAlert
} from 'lucide-react';
import { CASE_OF_2026_0912 } from '../../data/mockData';
import { getFullSimulationPhysicsState } from '../../utils/simulationPhysics';

// Vector arrow SVG generator for atmospheric wind and ocean current streamlines
function createVectorSvgIcon(heading = 0, color = "#00E5FF", lengthPx = 22) {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${lengthPx}" height="${lengthPx}" viewBox="0 0 24 24" style="transform: rotate(${heading}deg);">
      <path d="M12 3 L12 21 M12 3 L6 10 M12 3 L18 10" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
  return `data:image/svg+xml;utf-8,${encodeURIComponent(svgString)}`;
}

// Ship hull SVG generator with rotation
function createShipSvgIcon(heading = 0, color = "#1597C7", isSuspect = false, lengthPx = 28) {
  const widthPx = Math.round(lengthPx * 0.45);
  const stroke = isSuspect ? "#FF3B30" : "#FFFFFF";
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${lengthPx}" height="${lengthPx}" viewBox="0 0 40 40" style="transform: rotate(${heading}deg);">
      <path d="M 20,4 L 28,14 L 26,34 L 14,34 L 12,14 Z" fill="${color}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round" />
      <circle cx="20" cy="18" r="3" fill="#FFFFFF" />
      ${isSuspect ? '<circle cx="20" cy="20" r="14" fill="none" stroke="#FF3B30" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8"/>' : ''}
    </svg>
  `;
  return `data:image/svg+xml;utf-8,${encodeURIComponent(svgString)}`;
}

export default function GISRealMap({
  mode = "general", // "general", "live", "simulation", "source-trace", "vessel-intel", "trajectory", "attribution", "evidence-risk", "response", "characterize", "workspace", "satellite"
  caseData = null,
  activeLayers = null,
  onSelectVessel,
  onSelectSpill,
  showControls = true,
  height = "h-[540px]",
  spillPolygon = null,
  sarVessels = null,
  simulationTimestamp = null, // "T+0", "T+6", etc.
  simulationState = null,
  physicsOptions = null,
  initialMapType = "nautical",
  interceptorData = null,
  focusLocation = null,
  alerts = null,
  onSelectAlert = null,
  monteCarloEnsemble = null,
  virtualBooms = null,
  deployedFleet = null,
  vocHazardZone = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const seaMarksLayerRef = useRef(null);
  const overlayGroupRef = useRef(null);

  // Active case resolution
  const activeCase = caseData || CASE_OF_2026_0912;
  const centerLat = activeCase.coordinates?.lat || 14.8214;
  const centerLng = activeCase.coordinates?.lng || 68.2108;
  const initialZoom = activeCase.coordinates?.zoom || (mode === "satellite" ? 9 : 8);

  const [mapType, setMapType] = useState(initialMapType); // "nautical", "satellite", "hybrid", "osm"
  const [cursorCoords, setCursorCoords] = useState(`${centerLat.toFixed(4)}°N, ${centerLng.toFixed(4)}°E`);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const [layers, setLayers] = useState(() => ({
    satellite: true,
    oilSpills: true,
    vessels: true,
    aisTracks: true,
    particles: mode === "simulation",
    windVectors: mode === "simulation",
    currentVectors: mode === "simulation",
    sourceZone: mode === "source-trace" || mode === "workspace" || mode === "general",
    booms: mode === "response-plan" || mode === "response",
    coastalRadar: mode === "live",
    riskZones: true,
    ...activeLayers
  }));

  useEffect(() => {
    if (activeLayers) {
      setLayers(prev => ({ ...prev, ...activeLayers }));
    }
  }, [activeLayers]);

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    let map = null;
    let timer = null;

    function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (typeof window === 'undefined' || !window.L) {
        // Retry shortly if CDN script is still downloading
        timer = setTimeout(initLeaflet, 200);
        return;
      }

      const L = window.L;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: initialZoom,
          zoomControl: false,
          attributionControl: false
        });

        // Layer group for all vector overlays
        const overlayGroup = L.layerGroup().addTo(map);
        overlayGroupRef.current = overlayGroup;

        // Base tile layer (Zero API Key, High-Performance GIS Tiles)
        const tileUrl = mapType === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : mapType === 'osm'
          ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';

        const baseLayer = L.tileLayer(tileUrl, {
          maxZoom: 18,
          maxNativeZoom: mapType === 'osm' ? 18 : 16,
          subdomains: 'abc'
        }).addTo(map);
        tileLayerRef.current = baseLayer;

        // OpenSeaMap seamarks layer for nautical mode
        if (mapType === 'nautical') {
          const seaMarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
            maxZoom: 18,
            opacity: 0.85
          }).addTo(map);
          seaMarksLayerRef.current = seaMarks;
        }

        // Track mouse position
        map.on('mousemove', (e) => {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          const latStr = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}`;
          const lngStr = `${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`;
          setCursorCoords(`${latStr}, ${lngStr}`);
        });

        mapInstanceRef.current = map;
        setMapReady(true);
      } catch (err) {
        console.warn("Leaflet Map init error:", err);
      }
    }

    initLeaflet();

    return () => {
      if (timer) clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Center/Zoom update when activeCase changes
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;
    map.flyTo([centerLat, centerLng], initialZoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [centerLat, centerLng, initialZoom, activeCase.incidentId]);

  // 3. Switch Base Map Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const map = mapInstanceRef.current;
    const L = window.L;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    if (seaMarksLayerRef.current) {
      map.removeLayer(seaMarksLayerRef.current);
      seaMarksLayerRef.current = null;
    }

    // Default nautical: High-contrast Dark Gray Tactical Base with OpenSeaMap seamarks (Zero API Key)
    let tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    let subdomains = 'abc';
    let maxNativeZoom = 16;

    if (mapType === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = 'abc';
      maxNativeZoom = 18;
    } else if (mapType === 'osm') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      subdomains = 'abc';
      maxNativeZoom = 18;
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 18,
      maxNativeZoom,
      subdomains
    }).addTo(map);

    // Bring base tile layer below overlays
    tileLayerRef.current.bringToBack();

    // Add nautical seamarks on nautical/hybrid
    if (mapType === 'nautical') {
      seaMarksLayerRef.current = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        maxZoom: 18,
        opacity: 0.85
      }).addTo(map);
    }
  }, [mapType]);

  // 4. Render GIS Overlays (Spills, Vessels, Particles, Hindcast, Risk, Booms)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !overlayGroupRef.current || !window.L) return;
    const map = mapInstanceRef.current;
    const overlayGroup = overlayGroupRef.current;
    const L = window.L;

    // Clear previous overlays
    overlayGroup.clearLayers();

    // Custom Popup Styling Function
    function createPopupHtml(title, items, isDanger = false) {
      return `
        <div style="font-family: monospace; font-size: 11px; color: #0B2942; min-width: 190px; padding: 2px;">
          <div style="font-weight: bold; border-bottom: 1px solid #D9EAF0; padding-bottom: 4px; margin-bottom: 4px; color: ${isDanger ? '#D9534F' : '#087EA4'}; font-size: 12px;">
            ${title}
          </div>
          ${items.map(it => `
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span style="color: #627F94;">${it.label}:</span>
              <strong style="color: ${it.color || '#0B2942'};">${it.value}</strong>
            </div>
          `).join('')}
        </div>
      `;
    }

    const isSimMode = mode === "simulation";
    const isLiveSim = mode === "live" && Boolean(simulationTimestamp);
    const simPhysics = (isSimMode || isLiveSim || layers.particles || layers.windVectors || layers.currentVectors)
      ? (simulationState || getFullSimulationPhysicsState(activeCase, simulationTimestamp || (isSimMode ? "T+72" : "T+0"), physicsOptions || {}))
      : null;

    // A. AIR DRIFT (ATMOSPHERIC WIND STREAMLINES)
    if (layers.windVectors && simPhysics && simPhysics.windField) {
      simPhysics.windField.forEach((w) => {
        // 1. Animated flowing wind streamline
        if (w.streamline) {
          L.polyline(w.streamline, {
            color: '#38BDF8',
            weight: 2,
            opacity: 0.8,
            className: 'flowing-wind-stream'
          }).addTo(overlayGroup);
        }

        // 2. Vector arrow marker
        const iconUrl = createVectorSvgIcon(w.heading, "#38BDF8", 18);
        const icon = L.icon({
          iconUrl,
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        const wMarker = L.marker([w.endLat || w.lat, w.endLng || w.lng], { icon, opacity: 0.85 }).addTo(overlayGroup);
        wMarker.bindTooltip(`Air Drift (Wind): ${w.speedKn} kn @ ${w.heading}° (ECMWF)`, {
          direction: 'top',
          className: 'text-[9px] font-mono'
        });
      });
    }

    // B. OCEAN SURFACE CURRENTS (CMEMS / HYCOM FLOW FIELD)
    if (layers.currentVectors && simPhysics && simPhysics.currentField) {
      simPhysics.currentField.forEach((c) => {
        // 1. Animated flowing ocean current streamline
        if (c.streamline) {
          L.polyline(c.streamline, {
            color: '#0D9488',
            weight: 2.5,
            opacity: 0.85,
            className: 'flowing-current-stream'
          }).addTo(overlayGroup);
        }

        // 2. Vector arrow marker
        const iconUrl = createVectorSvgIcon(c.heading, "#0D9488", 16);
        const icon = L.icon({
          iconUrl,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });
        const cMarker = L.marker([c.endLat || c.lat, c.endLng || c.lng], { icon, opacity: 0.85 }).addTo(overlayGroup);
        cMarker.bindTooltip(`Ocean Current: ${c.speedKn} kn @ ${c.heading}° (CMEMS)`, {
          direction: 'top',
          className: 'text-[9px] font-mono'
        });
      });
    }

    // C. OIL SPILL POLYGONS (Roboflow AI Segmentation & Dynamic Physical Dispersion)
    if (layers.oilSpills) {
      const coords = (isSimMode && simPhysics?.morph?.outerPolygon)
        ? simPhysics.morph.outerPolygon
        : (spillPolygon || activeCase.geoCoordinates);

      if (coords && Array.isArray(coords) && coords.length >= 3) {
        const latLngs = coords.map(c => [c.lat, c.lng]);

        // 1. Primary Outer Spill Polygon (Expanding with Fay's Theory)
        const spillPolygonLayer = L.polygon(latLngs, {
          color: '#00E5FF',
          weight: 3,
          opacity: 0.95,
          fillColor: '#087EA4',
          fillOpacity: 0.45,
          dashArray: null
        }).addTo(overlayGroup);

        spillPolygonLayer.on('click', () => {
          if (onSelectSpill) onSelectSpill(activeCase.incidentId);
        });

        const activeArea = (isSimMode && simPhysics?.morph?.areaKm2) ? simPhysics.morph.areaKm2 : activeCase.spillAreaKm2;
        const activePerimeter = (isSimMode && simPhysics?.morph?.perimeterKm) ? simPhysics.morph.perimeterKm : activeCase.spillPerimeterKm;

        spillPolygonLayer.bindPopup(createPopupHtml(
          isSimMode ? `SIMULATED SLICK (${simulationTimestamp || 'T+72'})` : `AI SPILL MASK · ${activeCase.incidentId}`,
          [
            { label: "Surface Area", value: `${activeArea} km²`, color: "#087EA4" },
            { label: "Perimeter", value: `${activePerimeter} km` },
            { label: "Evaporated", value: `${simPhysics?.weathering?.evaporated || 24}%` },
            { label: "Emulsified", value: `${simPhysics?.weathering?.emulsified || 41}%` },
            { label: "Sensor / Model", value: isSimMode ? "OpenDrift + HYCOM" : "Sentinel-1 SAR VV" }
          ]
        ));

        // 2. High-Density Inner Core Emulsion Polygon
        const coreCoords = (isSimMode && simPhysics?.morph?.innerCore)
          ? simPhysics.morph.innerCore
          : coords.map(c => {
              const avgLat = coords.reduce((acc, p) => acc + p.lat, 0) / coords.length;
              const avgLng = coords.reduce((acc, p) => acc + p.lng, 0) / coords.length;
              return {
                lat: avgLat + (c.lat - avgLat) * 0.52,
                lng: avgLng + (c.lng - avgLng) * 0.52
              };
            });

        L.polygon(coreCoords.map(c => [c.lat, c.lng]), {
          color: '#D9534F',
          weight: 1.5,
          opacity: 0.85,
          fillColor: '#0B2942',
          fillOpacity: 0.65,
          dashArray: '4, 4'
        }).addTo(overlayGroup);

        // 3. Centroid Radar Beacon & Trajectory Vector
        const currentCentroid = (isSimMode && simPhysics?.centroid)
          ? simPhysics.centroid
          : {
              lat: coords.reduce((acc, c) => acc + c.lat, 0) / coords.length,
              lng: coords.reduce((acc, c) => acc + c.lng, 0) / coords.length
            };

        const beaconIcon = L.divIcon({
          className: 'custom-beacon',
          html: `<div style="width: 15px; height: 15px; background: #FF9800; border: 2.5px solid #FFFFFF; border-radius: 50%; box-shadow: 0 0 12px #FF9800;"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7.5, 7.5]
        });

        const centroidMarker = L.marker([currentCentroid.lat, currentCentroid.lng], { icon: beaconIcon }).addTo(overlayGroup);
        centroidMarker.bindPopup(createPopupHtml(
          `SLICK CENTROID (${simulationTimestamp || 'T+72'})`,
          [
            { label: "Position", value: `${currentCentroid.lat.toFixed(4)}°N, ${currentCentroid.lng.toFixed(4)}°E` },
            { label: "Total Drift", value: `+${currentCentroid.distanceNm || 0} nm` },
            { label: "Advection Speed", value: `${simPhysics?.advection?.speedKn?.toFixed(2) || '1.14'} kn` },
            { label: "Heading", value: `${simPhysics?.advection?.headingDeg?.toFixed(0) || '075'}° Azimuth` },
            { label: "Risk Level", value: activeCase.riskLevel, color: "#D9534F" }
          ],
          true
        ));

        // Draw dashed drift track from T+0 origin to current centroid
        if (isSimMode && simPhysics?.centroid) {
          const originLat = activeCase.coordinates?.lat || 14.8214;
          const originLng = activeCase.coordinates?.lng || 68.2108;
          L.polyline([[originLat, originLng], [simPhysics.centroid.lat, simPhysics.centroid.lng]], {
            color: '#FF9800',
            weight: 3,
            dashArray: '5, 5',
            opacity: 0.85
          }).addTo(overlayGroup);
        }

        // 4. Tactical Exclusion Boundary (5 NM & 10 NM Maritime Exclusion Rings)
        if (layers.exclusionRing) {
          L.circle([currentCentroid.lat, currentCentroid.lng], {
            radius: 9260, // 5 Nautical Miles
            color: '#F4A62A',
            weight: 2,
            dashArray: '6, 6',
            fillColor: '#F4A62A',
            fillOpacity: 0.08
          }).addTo(overlayGroup).bindTooltip("5 NM Tactical Exclusion Zone", { permanent: false });

          L.circle([currentCentroid.lat, currentCentroid.lng], {
            radius: 18520, // 10 Nautical Miles
            color: '#D9534F',
            weight: 1.5,
            dashArray: '4, 8',
            fillColor: '#D9534F',
            fillOpacity: 0.04
          }).addTo(overlayGroup).bindTooltip("10 NM Traffic Advisory Boundary", { permanent: false });
        }
      }
    }

    // D. HIGH-DENSITY LAGRANGIAN SIMULATION PARTICLES
    if (layers.particles || isSimMode) {
      const particleList = simPhysics?.particles || [];
      if (particleList.length > 0) {
        particleList.forEach((p) => {
          L.circleMarker([p.lat, p.lng], {
            radius: p.size || 2.0,
            color: p.color || '#FF8A65',
            weight: 0.5,
            fillColor: p.color || '#00E5FF',
            fillOpacity: p.opacity || 0.75
          }).addTo(overlayGroup);
        });
      }
    }

    // E. HINDCAST ORIGIN ZONES (Backward Origin Trace)
    if (layers.sourceZone && activeCase.hindcast) {
      const hc = activeCase.hindcast;

      // Reverse drift track line
      if (hc.reverseTrack && Array.isArray(hc.reverseTrack)) {
        L.polyline(hc.reverseTrack.map(p => [p.lat, p.lng]), {
          color: '#198FD1',
          weight: 3,
          dashArray: '6, 6',
          opacity: 0.85
        }).addTo(overlayGroup);
      }

      // Zone A (Primary)
      if (hc.originZoneA && hc.originZoneA.lat) {
        L.circle([hc.originZoneA.lat, hc.originZoneA.lng], {
          radius: (hc.originZoneA.radiusKm || 4.2) * 1000,
          color: '#198FD1',
          weight: 2,
          fillColor: '#087EA4',
          fillOpacity: 0.28
        }).addTo(overlayGroup);

        const zoneAIcon = L.divIcon({
          className: 'zone-a-icon',
          html: `<div style="width: 14px; height: 14px; background: #198FD1; border: 2px solid #FFFFFF; border-radius: 50%;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });

        const zoneAMarker = L.marker([hc.originZoneA.lat, hc.originZoneA.lng], { icon: zoneAIcon }).addTo(overlayGroup);
        zoneAMarker.bindPopup(createPopupHtml(
          hc.originZoneA.name || "PROBABLE ORIGIN (ZONE A)",
          [
            { label: "Confidence", value: `${hc.originZoneA.confidence}%`, color: "#198FD1" },
            { label: "Est. Release", value: hc.estimatedReleaseTimeUTC || "03 SEP 22:40 UTC" },
            { label: "Uncertainty", value: `±${hc.uncertaintyRadiusKm || 8.7} km` }
          ]
        ));
      }

      // Zone B (Secondary)
      if (hc.originZoneB && hc.originZoneB.lat) {
        L.circle([hc.originZoneB.lat, hc.originZoneB.lng], {
          radius: (hc.originZoneB.radiusKm || 6.5) * 1000,
          color: '#8295A3',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: '#8295A3',
          fillOpacity: 0.15
        }).addTo(overlayGroup);
      }
    }

    // F. AIS TRACKS (Observed, Blackout Gap & Bi-LSTM Reconstructed)
    if (layers.aisTracks && activeCase.topVessel && activeCase.topVessel.aisTrack) {
      const trk = activeCase.topVessel.aisTrack;

      // 1. Observed Pre-Gap
      if (trk.preGap) {
        L.polyline(trk.preGap.map(p => [p.lat, p.lng]), {
          color: '#8295A3',
          weight: 3,
          opacity: 0.85
        }).addTo(overlayGroup);
      }

      // 2. AIS Blackout Gap (dashed red)
      if (trk.blackoutGap) {
        L.polyline(trk.blackoutGap.map(p => [p.lat, p.lng]), {
          color: '#D9534F',
          weight: 3,
          dashArray: '6, 6',
          opacity: 0.95
        }).addTo(overlayGroup);
      }

      // 3. Bi-LSTM Reconstructed trajectory
      if (trk.reconstructed) {
        L.polyline(trk.reconstructed.map(p => [p.lat, p.lng]), {
          color: '#00E5FF',
          weight: 4,
          opacity: 0.95
        }).addTo(overlayGroup);
      }

      // 4. Observed Post-Gap
      if (trk.postGap) {
        L.polyline(trk.postGap.map(p => [p.lat, p.lng]), {
          color: '#087EA4',
          weight: 3,
          opacity: 0.85
        }).addTo(overlayGroup);
      }
    }

    // G. CANDIDATE VESSELS WITH DYNAMIC MOVEMENT & WAKES
    if (layers.vessels) {
      const vesselList = ((isSimMode || isLiveSim) && simPhysics?.vessels)
        ? simPhysics.vessels
        : (sarVessels || activeCase.candidateVessels || [activeCase.topVessel]);

      vesselList.forEach((v) => {
        const vPos = v.currentPos || (v.pos && typeof v.pos === 'object' ? v.pos : { lat: centerLat + 0.3, lng: centerLng + 0.9 });
        if (!vPos || vPos.lat === undefined) return;

        const isSuspect = v.rank === "01" || v.status === "HIGH PRIORITY" || v.highPriority;
        const vesselColor = isSuspect ? "#D9534F" : v.rank === "02" ? "#F4A62A" : "#1597C7";
        const heading = v.dynamicHeadingDeg || v.heading || v.headingDeg || 284;
        const speed = v.dynamicSpeedKn || v.speedKn || v.currentSpeedKn || 12;

        // Render animated V-shaped wake pattern
        if (v.wakeWings) {
          if (v.wakeWings.port) {
            L.polyline(v.wakeWings.port, {
              color: isSuspect ? '#FF5252' : '#38BDF8',
              weight: 2,
              opacity: 0.7,
              className: 'pulsing-wake'
            }).addTo(overlayGroup);
          }
          if (v.wakeWings.starboard) {
            L.polyline(v.wakeWings.starboard, {
              color: isSuspect ? '#FF5252' : '#38BDF8',
              weight: 2,
              opacity: 0.7,
              className: 'pulsing-wake'
            }).addTo(overlayGroup);
          }
        } else if (v.wakePoints && Array.isArray(v.wakePoints) && v.wakePoints.length >= 2) {
          L.polyline(v.wakePoints.map(p => [p.lat, p.lng]), {
            color: isSuspect ? '#FF5252' : '#38BDF8',
            weight: 2.5,
            opacity: 0.7,
            className: 'pulsing-wake'
          }).addTo(overlayGroup);
        }

        const shipIconUrl = createShipSvgIcon(heading, vesselColor, isSuspect, isSuspect ? 34 : 26);
        const icon = L.icon({
          iconUrl: shipIconUrl,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -14]
        });

        const marker = L.marker([vPos.lat, vPos.lng], { icon }).addTo(overlayGroup);

        marker.on('click', () => {
          if (onSelectVessel) onSelectVessel(v);
        });

        marker.bindPopup(createPopupHtml(
          v.name || v.id,
          [
            { label: "MMSI / IMO", value: `${v.mmsi || 'N/A'} · ${v.imo || 'N/A'}` },
            { label: "Status", value: isSuspect ? "LEAD SUSPECT" : "CANDIDATE", color: isSuspect ? "#D9534F" : "#087EA4" },
            { label: "Speed / Course", value: `${speed} kn · ${heading}°` },
            { label: "Current Position", value: `${vPos.lat.toFixed(3)}°N, ${vPos.lng.toFixed(3)}°E` },
            { label: "Investigation Score", value: `${v.priorityScore || 91}/100`, color: isSuspect ? "#D9534F" : "#F4A62A" }
          ],
          isSuspect
        ));
      });
    }

    // F. MARINE PROTECTED AREAS & RISK ZONES
    if ((layers.riskZones || layers.ecoSanctuary) && activeCase.riskZones) {
      activeCase.riskZones.forEach((rz) => {
        if (rz.polygon && Array.isArray(rz.polygon)) {
          const rzPolygon = L.polygon(rz.polygon.map(p => [p.lat, p.lng]), {
            color: '#F4A62A',
            weight: 2,
            opacity: 0.85,
            fillColor: '#F4A62A',
            fillOpacity: 0.2
          }).addTo(overlayGroup);

          rzPolygon.bindPopup(createPopupHtml(
            `RISK ZONE: ${rz.name}`,
            [
              { label: "Type", value: rz.type },
              { label: "Vulnerability", value: `${rz.vulnerabilityScore}/100`, color: "#D9534F" },
              { label: "Impact Window", value: rz.impactWindow },
              { label: "Context", value: rz.desc }
            ]
          ));
        }
      });
    }

    // G. RESPONSE BOOMS & PATROL VESSELS
    if (layers.booms && activeCase.responsePlan) {
      const rp = activeCase.responsePlan;

      // Containment Boom Polylines
      if (rp.booms && Array.isArray(rp.booms)) {
        rp.booms.forEach((bm) => {
          if (bm.coords && bm.coords.length >= 2) {
            const boomLine = L.polyline(bm.coords.map(p => [p.lat, p.lng]), {
              color: '#F4A62A',
              weight: 5,
              opacity: 1.0
            }).addTo(overlayGroup);

            boomLine.bindPopup(createPopupHtml(
              bm.label || "Containment Boom",
              [
                { label: "Length", value: `${bm.lengthKm} km` },
                { label: "Type", value: bm.type || "Ocean Barrier" }
              ]
            ));
          }
        });
      }

      // Response Vessels
      if (rp.vessels && Array.isArray(rp.vessels)) {
        rp.vessels.forEach((rv) => {
          const rvIconUrl = createShipSvgIcon(rv.heading || 0, "#198754", false, 28);
          const icon = L.icon({
            iconUrl: rvIconUrl,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const rvMarker = L.marker([rv.lat, rv.lng], { icon }).addTo(overlayGroup);
          rvMarker.bindPopup(createPopupHtml(
            rv.name,
            [
              { label: "Type", value: rv.type },
              { label: "Mission", value: rv.mission },
              { label: "Status", value: rv.status, color: "#198754" }
            ]
          ));
        });
      }
    }

    // H. COASTAL RADAR SURVEILLANCE COVERAGE (Rings & Station)
    if (layers.coastalRadar || mode === "live") {
      const radarLat = activeCase.coordinates?.lat ? activeCase.coordinates.lat - 0.2 : 14.62;
      const radarLng = activeCase.coordinates?.lng ? activeCase.coordinates.lng + 0.6 : 68.81;
      const stationName = `${activeCase.regionShort?.toUpperCase() || 'COASTAL'} RADAR STATION`;

      // 24 NM (~44.4 km) Inner Tactical Range Ring
      L.circle([radarLat, radarLng], {
        radius: 44448,
        color: '#00E5FF',
        weight: 1.5,
        dashArray: '6, 6',
        fillColor: '#00E5FF',
        fillOpacity: 0.03
      }).addTo(overlayGroup);

      // 48 NM (~88.8 km) Maximum Coastal Radar Detection Ring
      L.circle([radarLat, radarLng], {
        radius: 88896,
        color: '#087EA4',
        weight: 1,
        dashArray: '4, 8',
        fillColor: '#087EA4',
        fillOpacity: 0.02
      }).addTo(overlayGroup);

      // Radar Station Beacon
      const radarIcon = L.divIcon({
        className: 'radar-station-beacon',
        html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;background:#0A2540;border:2px solid #00E5FF;border-radius:50%;color:#00E5FF;font-size:11px;box-shadow:0 0 10px rgba(0,229,255,0.7);cursor:pointer;">📡</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const radarMarker = L.marker([radarLat, radarLng], { icon: radarIcon }).addTo(overlayGroup);
      radarMarker.bindPopup(createPopupHtml(
        stationName,
        [
          { label: "Surveillance Status", value: "ACTIVE · 100% OPERATIONAL", color: "#10B981" },
          { label: "Transceiver", value: "X-Band Marine VTS Radar" },
          { label: "Range Coverage", value: "48 NM (88.9 km) Radial" },
          { label: "VHF Channels", value: "Ch 16 / 70 DSC Monitored" },
          { label: "Grid Coordinates", value: `${radarLat.toFixed(3)}°N, ${radarLng.toFixed(3)}°E` }
        ],
        false
      ));
    }

    // I. COAST GUARD INTERCEPTOR (ICGS VARAHA - FPV 242)
    if (interceptorData && interceptorData.dispatched) {
      const baseLat = (activeCase.coordinates?.lat || 14.82) - 0.22;
      const baseLng = (activeCase.coordinates?.lng || 68.21) + 0.62;
      
      const targetV = interceptorData.targetVessel || activeCase.topVessel;
      const targetPos = targetV?.currentPos || targetV?.pos || { lat: centerLat + 0.25, lng: centerLng + 0.85 };
      const targetLat = targetPos.lat;
      const targetLng = targetPos.lng;

      const totalEta = 1365;
      const currentEta = interceptorData.etaSec !== undefined ? interceptorData.etaSec : 1200;
      const progress = Math.min(0.98, Math.max(0.04, (totalEta - currentEta) / totalEta));

      const interLat = baseLat + (targetLat - baseLat) * progress;
      const interLng = baseLng + (targetLng - baseLng) * progress;

      // Heading towards target
      const dy = targetLat - interLat;
      const dx = (targetLng - interLng) * Math.cos(interLat * (Math.PI / 180));
      let interHeading = Math.round((Math.atan2(dx, dy) * (180 / Math.PI) + 360) % 360);

      // Trajectory vector line
      L.polyline([[baseLat, baseLng], [interLat, interLng]], {
        color: '#10B981',
        weight: 2.5,
        opacity: 0.9
      }).addTo(overlayGroup);

      // Dash to target
      L.polyline([[interLat, interLng], [targetLat, targetLng]], {
        color: '#10B981',
        weight: 1.5,
        dashArray: '4, 4',
        opacity: 0.6
      }).addTo(overlayGroup);

      // Fast Patrol Cutter ship icon
      const interceptorIconUrl = createShipSvgIcon(interHeading, "#10B981", false, 30);
      const interIcon = L.icon({
        iconUrl: interceptorIconUrl,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -14]
      });

      const interMarker = L.marker([interLat, interLng], { icon: interIcon }).addTo(overlayGroup);
      interMarker.bindPopup(createPopupHtml(
        "ICGS VARAHA (FPV 242)",
        [
          { label: "Status", value: "INTERCEPTION UNDERWAY", color: "#10B981" },
          { label: "Target", value: targetV?.name || "M/V OCEAN STAR" },
          { label: "Speed", value: "34.2 kn (Max Transit)" },
          { label: "Bearing", value: `${interHeading}° Azimuth` },
          { label: "ETA to Intercept", value: `${Math.floor(currentEta / 60)}m ${currentEta % 60}s`, color: "#10B981" },
          { label: "VHF Comm", value: "Channel 16 Monitoring" }
        ],
        false
      ));
    }

    // J. ACTIVE MARITIME ANOMALIES & ALERTS PINGS
    if (alerts && Array.isArray(alerts)) {
      alerts.filter(a => !a.acknowledged && a.lat && a.lng).forEach((alt) => {
        const isCritical = alt.severity === "CRITICAL";
        const pingIcon = L.divIcon({
          className: 'tactical-alert-pin',
          html: `<div style="position:relative; width:24px; height:24px; cursor:pointer;">
            <div style="position:absolute; inset:0; border-radius:50%; background:${isCritical ? '#EF4444' : '#F59E0B'}; opacity:0.4; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute; inset:3px; border-radius:50%; background:${isCritical ? '#DC2626' : '#D97706'}; border:2px solid #FFFFFF; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:10px; font-weight:bold; box-shadow:0 0 10px rgba(0,0,0,0.5);">!</div>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const aMarker = L.marker([alt.lat, alt.lng], { icon: pingIcon }).addTo(overlayGroup);
        aMarker.on('click', () => {
          if (onSelectAlert) onSelectAlert(alt);
        });
        aMarker.bindPopup(createPopupHtml(
          alt.title,
          [
            { label: "Severity", value: alt.severity, color: isCritical ? "#DC2626" : "#D97706" },
            { label: "Alert ID", value: alt.id },
            { label: "Location", value: `${alt.lat.toFixed(3)}°N, ${alt.lng.toFixed(3)}°E` },
            { label: "Time", value: alt.timestamp || "Active" },
            { label: "Details", value: alt.desc }
          ],
          isCritical
        ));
      });
    }

    // K. MONTE CARLO PROBABILISTIC TRAJECTORY CONFIDENCE CONES
    if (monteCarloEnsemble) {
      if (monteCarloEnsemble.cone95) {
        L.polygon(monteCarloEnsemble.cone95, {
          color: '#9333EA',
          weight: 1.5,
          dashArray: '5, 5',
          fillColor: '#9333EA',
          fillOpacity: 0.12
        }).addTo(overlayGroup).bindTooltip("95% Monte Carlo Confidence Envelope", { permanent: false });
      }
      if (monteCarloEnsemble.cone75) {
        L.polygon(monteCarloEnsemble.cone75, {
          color: '#A855F7',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: '#A855F7',
          fillOpacity: 0.18
        }).addTo(overlayGroup).bindTooltip("75% Monte Carlo Confidence Envelope", { permanent: false });
      }
      if (monteCarloEnsemble.cone50) {
        L.polygon(monteCarloEnsemble.cone50, {
          color: '#C084FC',
          weight: 2,
          fillColor: '#C084FC',
          fillOpacity: 0.25
        }).addTo(overlayGroup).bindTooltip("50% Core Trajectory Probability Cone", { permanent: false });
      }
      if (monteCarloEnsemble.samplePoints && Array.isArray(monteCarloEnsemble.samplePoints)) {
        monteCarloEnsemble.samplePoints.forEach(sp => {
          L.circleMarker([sp.lat, sp.lng], {
            radius: 2,
            color: '#E9D5FF',
            fillColor: '#A855F7',
            fillOpacity: 0.6,
            weight: 0.5
          }).addTo(overlayGroup);
        });
      }
    }

    // L. VIRTUAL CONTAINMENT BOOMS
    if (virtualBooms && Array.isArray(virtualBooms)) {
      virtualBooms.forEach(vb => {
        if (vb.coords && vb.coords.length >= 2) {
          L.polyline(vb.coords, {
            color: vb.efficiency >= 70 ? '#10B981' : '#F59E0B',
            weight: 6,
            opacity: 0.95
          }).addTo(overlayGroup).bindPopup(createPopupHtml(
            `VIRTUAL BOOM (${vb.lengthM}m)`,
            [
              { label: "Efficiency", value: `${vb.efficiency}%`, color: vb.efficiency >= 70 ? "#10B981" : "#F59E0B" },
              { label: "Status", value: vb.status },
              { label: "Capacity", value: `${vb.holdingCapacityBbls} bbls` }
            ]
          ));
        }
      });
    }

    // M. VOC VAPOR DOWNWIND HAZARD PLUME
    if (vocHazardZone && vocHazardZone.endLat) {
      const startPt = simPhysics?.centroid || { lat: centerLat, lng: centerLng };
      L.polyline([[startPt.lat, startPt.lng], [vocHazardZone.endLat, vocHazardZone.endLng]], {
        color: '#EF4444',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.85
      }).addTo(overlayGroup);

      L.circle([vocHazardZone.endLat, vocHazardZone.endLng], {
        radius: (vocHazardZone.hazardWidthNm || 1.2) * 1852,
        color: '#EF4444',
        weight: 1.5,
        dashArray: '3, 6',
        fillColor: '#EF4444',
        fillOpacity: 0.12
      }).addTo(overlayGroup).bindTooltip(`Downwind VOC IDLH Vapor Zone (${vocHazardZone.hazardLengthNm} NM)`, { permanent: false });
    }

    // N. DEPLOYED EMERGENCY RESPONSE FLEET
    if (deployedFleet && Array.isArray(deployedFleet)) {
      deployedFleet.forEach(df => {
        const dfIconUrl = createShipSvgIcon(0, "#10B981", false, 28);
        const icon = L.icon({
          iconUrl: dfIconUrl,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        const marker = L.marker([df.baseCoords.lat, df.baseCoords.lng], { icon }).addTo(overlayGroup);
        marker.bindPopup(createPopupHtml(
          df.name,
          [
            { label: "Type", value: df.type },
            { label: "Transit Distance", value: `${df.distNm} NM` },
            { label: "Transit ETA", value: df.etaDesc, color: "#10B981" },
            { label: "Base Port", value: df.port }
          ]
        ));
      });
    }
  }, [mapReady, layers, mode, activeCase, spillPolygon, sarVessels, simulationTimestamp, simulationState, interceptorData, alerts, monteCarloEnsemble, virtualBooms, vocHazardZone, deployedFleet]);

  // Handle FlyTo and Focus Anomaly Ping
  useEffect(() => {
    if (!mapInstanceRef.current || !focusLocation || focusLocation.lat === undefined) return;
    const map = mapInstanceRef.current;
    map.flyTo([focusLocation.lat, focusLocation.lng], focusLocation.zoom || 10, {
      duration: 1.0,
      easeLinearity: 0.25
    });
  }, [focusLocation]);

  // Reset View to Center of Active Case
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([centerLat, centerLng], initialZoom, { duration: 0.8 });
  };

  return (
    <div className={`relative ${height} w-full rounded-xl overflow-hidden border border-border-marine bg-[#0A1E2F] shadow-inner select-none isolate z-0`}>
      {/* Real Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full relative z-0"
        style={{ minHeight: '340px' }}
      />

      {/* Top Left Floating Header: Coordinates & Active Incident */}
      <div className="absolute top-3 left-3 bg-[#0B2942]/90 backdrop-blur-sm border border-border-marine/40 text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-3 shadow-md z-10">
        <div className="flex items-center gap-1.5 text-[#1597C7]">
          <Crosshair className="w-3.5 h-3.5" />
          <span>{cursorCoords}</span>
        </div>
        <span className="text-border-marine/40">|</span>
        <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{activeCase.regionShort || "Arabian Sea"}</span>
          <span className="text-white/60">({activeCase.incidentId})</span>
        </span>
      </div>

      {/* Top Center: Base Map Switcher */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-[#0B2942]/90 backdrop-blur-sm border border-border-marine/40 p-1 rounded-xl shadow-md z-10 flex items-center gap-1">
        <button
          onClick={() => setMapType('nautical')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
            mapType === 'nautical' ? 'bg-ocean text-white shadow-sm' : 'text-text-muted hover:text-white'
          }`}
          title="Nautical Dark Tactical Map"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Nautical</span>
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
            mapType === 'satellite' ? 'bg-ocean text-white shadow-sm' : 'text-text-muted hover:text-white'
          }`}
          title="High-Resolution Orbital Satellite"
        >
          <Satellite className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
        <button
          onClick={() => setMapType('osm')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 ${
            mapType === 'osm' ? 'bg-ocean text-white shadow-sm' : 'text-text-muted hover:text-white'
          }`}
          title="OpenStreetMap Standard Cartography"
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>OSM</span>
        </button>
      </div>

      {/* Floating Map Controls on Top Right */}
      {showControls && (
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.zoomIn();
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-ocean-navy border border-border-marine flex items-center justify-center shadow-sm transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.zoomOut();
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-ocean-navy border border-border-marine flex items-center justify-center shadow-sm transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-ocean-navy border border-border-marine flex items-center justify-center shadow-sm transition-colors text-[10px] font-mono font-bold"
            title={`Reset View to ${activeCase.regionShort}`}
          >
            1x
          </button>
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm transition-colors ${
              showLayerMenu ? 'bg-ocean text-white border-ocean' : 'bg-white/95 hover:bg-white text-ocean-navy border-border-marine'
            }`}
            title="Toggle GIS Layers"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* GIS Layer Menu Dropdown */}
      {showLayerMenu && (
        <div className="absolute top-12 right-12 w-56 bg-white border border-border-marine rounded-xl shadow-marine-lg p-2.5 z-20 text-xs animate-fade-in">
          <div className="font-bold text-ocean-navy text-[11px] mb-2 pb-1 border-b border-border-marine flex items-center justify-between">
            <span>REAL GIS LAYERS</span>
            <span className="text-[10px] font-mono text-ocean">LEAFLET GIS</span>
          </div>
          <div className="space-y-1">
            {Object.entries(layers).map(([k, v]) => (
              <button
                key={k}
                onClick={() => toggleLayer(k)}
                className="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-ocean-sky transition-colors text-left"
              >
                <span className="capitalize text-text-secondary font-medium">
                  {k.replace(/([A-Z])/g, ' $1')}
                </span>
                {v ? (
                  <span className="text-status-success font-bold text-[10px] flex items-center gap-1">
                    <Eye className="w-3 h-3" /> ON
                  </span>
                ) : (
                  <span className="text-text-muted text-[10px] flex items-center gap-1">
                    <EyeOff className="w-3 h-3" /> OFF
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom GIS Map Legend Bar */}
      <div className="absolute bottom-2 left-2 right-2 bg-[#0B2942]/90 backdrop-blur-sm border border-border-marine/30 rounded-lg px-3 py-1.5 text-[10px] font-mono text-white flex items-center justify-between flex-wrap gap-2 z-10">
        <div className="flex items-center gap-3.5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#087EA4] border border-[#00E5FF]"></span>
            <span>Oil Slick ({activeCase.spillAreaKm2} km²)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#198FD1]"></span>
            <span>Zone A ({activeCase.hindcast?.originZoneA?.confidence || 72}%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#8295A3]"></span>
            <span>Observed AIS</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#D9534F] border-b border-dashed"></span>
            <span>Blackout Gap</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#00E5FF]"></span>
            <span>Bi-LSTM Recon</span>
          </span>
          {mode === "live" && (
            <span className="flex items-center gap-1.5 text-[#00E5FF]">
              <span className="w-2.5 h-2.5 rounded-full border border-[#00E5FF] border-dashed"></span>
              <span>Coastal Radar (48 NM)</span>
            </span>
          )}
          {mode === "simulation" && (
            <>
              <span className="flex items-center gap-1 text-[#38BDF8]">
                <span>↗</span>
                <span>Air Drift (Wind)</span>
              </span>
              <span className="flex items-center gap-1 text-[#0D9488]">
                <span>→</span>
                <span>Ocean Currents</span>
              </span>
              <span className="flex items-center gap-1 text-[#FF5252]">
                <span className="w-2.5 h-0.5 bg-[#FF5252]"></span>
                <span>Vessel Wakes</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#FF9800]">
                <span className="w-2 h-2 rounded-full bg-[#FF9800] animate-ping"></span>
                <span>Lagrangian Cloud ({simulationTimestamp || "T+72"})</span>
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-[#8295A3]">
          <span>Esri & CartoDB</span>
          <span>·</span>
          <span>OpenSeaMap</span>
          <span>·</span>
          <span>WGS84</span>
        </div>
      </div>
    </div>
  );
}
