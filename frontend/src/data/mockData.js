/**
 * MARINESIGHT Comprehensive Maritime Intelligence Datasets
 * Multi-Region Simulation Data covering 6 Strategic Maritime Zones:
 * 1. Arabian Sea (Goa / Karnataka EEZ) - Lead Case OF-2026-0912
 * 2. Bay of Bengal (Visakhapatnam / Paradip Coast) - Case OF-2026-0918
 * 3. Gulf of Kutch (Sikka / Kandla Oil Terminals) - Case OF-2026-0925
 * 4. Gulf of Mannar & Palk Strait (Coral Biosphere) - Case OF-2026-0922
 * 5. Strait of Malacca / Great Nicobar (Six Degree Channel) - Case OF-2026-0930
 * 6. Laccadive Sea / Minicoy (Nine Degree Channel) - Case OF-2026-0909
 */

// Helper to generate particle clouds around a moving centroid
function generateParticleCloud(centerLat, centerLng, radiusDeg, count, seed = 1) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    // Pseudo-random deterministic distribution based on index and seed
    const angle = ((i * 137.5 + seed * 23) % 360) * (Math.PI / 180);
    const r = Math.sqrt((i + 0.5) / count) * radiusDeg;
    // Add elliptical stretch along drift direction
    const latOffset = Math.sin(angle) * r * 0.75;
    const lngOffset = Math.cos(angle) * r * 1.35;
    particles.push({
      lat: +(centerLat + latOffset).toFixed(5),
      lng: +(centerLng + lngOffset).toFixed(5),
      density: +(Math.max(0.2, 1 - (r / radiusDeg) * 0.8)).toFixed(2),
      id: `p-${seed}-${i}`
    });
  }
  return particles;
}

// -------------------------------------------------------------
// 1. REGION: Arabian Sea (Offshore Goa / Karnataka EEZ)
// -------------------------------------------------------------
export const CASE_OF_2026_0912 = {
  incidentId: "OF-2026-0912",
  internalId: "INC-0921",
  title: "Arabian Sea Hydrocarbon Discharge & Offshore Forensic Attribution",
  region: "Arabian Sea (Goa / Karnataka EEZ)",
  regionShort: "Arabian Sea",
  flagEmoji: "🇮🇳",
  detectionTimeUTC: "05 SEP 2026, 14:32:10 UTC",
  detectionTimestamp: "2026-09-05T14:32:10Z",
  coordinates: {
    lat: 14.8214,
    lng: 68.2108,
    zoom: 8,
    display: "14.82°N, 68.21°E"
  },
  spillAreaKm2: 14.7,
  spillPerimeterKm: 22.4,
  lengthKm: 8.4,
  widthKm: 2.1,
  orientationDeg: 37,
  compactness: 0.38,
  estimatedAgeHours: 38.4,
  detectionConfidence: 96.8,
  probableSourceConfidence: 72.4,
  riskLevel: "CRITICAL",
  status: "Investigating",
  assignedAnalyst: "Dr. E. Vance (Lead Maritime Forensics)",
  candidateCount: 12,
  highPriorityCount: 3,

  // Roboflow / GIS Polygon Coordinates
  geoCoordinates: [
    { lat: 14.8480, lng: 68.1750 },
    { lat: 14.8620, lng: 68.2050 },
    { lat: 14.8580, lng: 68.2320 },
    { lat: 14.8410, lng: 68.2540 },
    { lat: 14.8150, lng: 68.2490 },
    { lat: 14.7950, lng: 68.2360 },
    { lat: 14.8010, lng: 68.2050 },
    { lat: 14.8090, lng: 68.1880 },
    { lat: 14.8290, lng: 68.1710 }
  ],

  // Coupled Ocean & Atmosphere
  environment: {
    windSpeedKn: 14.2,
    windDirectionDeg: 310,
    windDirectionText: "310° (NW)",
    currentSpeedMs: 0.42,
    currentDirectionDeg: 128,
    currentDirectionText: "128° (SE)",
    waveHeightM: 1.8,
    wavePeriodSec: 6.4,
    seaSurfaceTempC: 28.4,
    salinityPsu: 36.2,
    atmosphericPressureHpa: 1012.4
  },

  // Forward Drift Simulation Particle Clouds across Timestamps
  simulation: {
    mode: "forward",
    engine: "Lagrangian Particle Dispersion (OpenDrift / HYCOM)",
    totalParticles: 5000,
    displayParticlesCount: 50,
    timeSteps: {
      "T+0": {
        timeLabel: "T+0 (Detection)",
        elapsedHours: 0,
        centroid: { lat: 14.8214, lng: 68.2108 },
        areaKm2: 14.7,
        dispersionRadiusKm: 4.2,
        weathering: { emulsified: 18, evaporated: 12, surface: 62, dispersed: 8 },
        particles: generateParticleCloud(14.8214, 68.2108, 0.045, 45, 1)
      },
      "T+6": {
        timeLabel: "T+6h (+6 Hours)",
        elapsedHours: 6,
        centroid: { lat: 14.8720, lng: 68.3450 },
        areaKm2: 16.4,
        dispersionRadiusKm: 5.1,
        weathering: { emulsified: 24, evaporated: 16, surface: 51, dispersed: 9 },
        particles: generateParticleCloud(14.8720, 68.3450, 0.055, 45, 2)
      },
      "T+12": {
        timeLabel: "T+12h (+12 Hours)",
        elapsedHours: 12,
        centroid: { lat: 14.9250, lng: 68.4900 },
        areaKm2: 18.2,
        dispersionRadiusKm: 6.2,
        weathering: { emulsified: 31, evaporated: 19, surface: 40, dispersed: 10 },
        particles: generateParticleCloud(14.9250, 68.4900, 0.068, 45, 3)
      },
      "T+24": {
        timeLabel: "T+24h (+24 Hours)",
        elapsedHours: 24,
        centroid: { lat: 15.0350, lng: 68.7900 },
        areaKm2: 21.0,
        dispersionRadiusKm: 8.0,
        weathering: { emulsified: 36, evaporated: 22, surface: 31, dispersed: 11 },
        particles: generateParticleCloud(15.0350, 68.7900, 0.088, 45, 4)
      },
      "T+48": {
        timeLabel: "T+48h (+48 Hours)",
        elapsedHours: 48,
        centroid: { lat: 15.2200, lng: 69.3100 },
        areaKm2: 23.5,
        dispersionRadiusKm: 11.2,
        weathering: { emulsified: 39, evaporated: 23, surface: 26, dispersed: 12 },
        particles: generateParticleCloud(15.2200, 69.3100, 0.115, 45, 5)
      },
      "T+72": {
        timeLabel: "T+72h (+72 Hours)",
        elapsedHours: 72,
        centroid: { lat: 15.4100, lng: 69.8200 },
        areaKm2: 24.8,
        dispersionRadiusKm: 14.5,
        weathering: { emulsified: 41, evaporated: 24, surface: 23, dispersed: 12 },
        particles: generateParticleCloud(15.4100, 69.8200, 0.145, 45, 6)
      }
    }
  },

  // Origin Hindcast
  hindcast: {
    originZoneA: {
      name: "ZONE A (Primary Target)",
      confidence: 72.4,
      coordinates: "14.6521°N, 67.9015°E",
      lat: 14.6521,
      lng: 67.9015,
      radiusKm: 4.2,
      depthM: 2140
    },
    originZoneB: {
      name: "ZONE B (Secondary)",
      confidence: 18.1,
      coordinates: "14.7180°N, 67.7540°E",
      lat: 14.7180,
      lng: 67.7540,
      radiusKm: 6.8,
      depthM: 2280
    },
    originZoneC: {
      name: "ZONE C (Dispersed)",
      confidence: 9.5,
      coordinates: "14.5800°N, 68.0400°E",
      lat: 14.5800,
      lng: 68.0400,
      radiusKm: 8.5,
      depthM: 1980
    },
    estimatedReleaseTimeUTC: "03 SEP 2026, 22:40 UTC",
    backwardDurationHours: 40.0,
    uncertaintyRadiusKm: 8.7,
    currentContribution: 61,
    windContribution: 39,
    stokesContribution: 2,
    reverseTrack: [
      { lat: 14.8214, lng: 68.2108 },
      { lat: 14.7850, lng: 68.1300 },
      { lat: 14.7400, lng: 68.0450 },
      { lat: 14.6950, lng: 67.9600 },
      { lat: 14.6521, lng: 67.9015 }
    ]
  },

  // Lead Suspect Vessel
  topVessel: {
    name: "MV OCEAN STAR",
    mmsi: "419001248",
    imo: "9876543",
    callSign: "VTS-209",
    type: "Crude Oil Tanker (VLCC)",
    flag: "India",
    flagEmoji: "🇮🇳",
    lengthM: 274,
    beamM: 48,
    draughtM: 16.2,
    grossTonnage: 84200,
    currentSpeedKn: 12.4,
    headingDeg: 284,
    destination: "Mumbai Port (INBOM)",
    eta: "07 SEP 2026 06:00 UTC",
    status: "HIGH PRIORITY",
    priorityScore: 91.4,
    closestApproachNm: 1.4,
    closestApproachTime: "03 SEP 22:42 UTC",
    aisBlackoutDurationMin: 38,
    aisBlackoutRange: "03 SEP 22:24 - 23:02 UTC",
    anomalyScore: 87,
    speedDropKn: "13.2 → 3.8 kn",
    trajectorySimilarity: 93.4,
    currentPos: { lat: 15.1200, lng: 69.1500 },
    aisTrack: {
      preGap: [
        { lat: 14.3000, lng: 66.8000 },
        { lat: 14.4200, lng: 67.2000 },
        { lat: 14.5300, lng: 67.5500 }
      ],
      blackoutGap: [
        { lat: 14.5300, lng: 67.5500 },
        { lat: 14.7200, lng: 68.1000 }
      ],
      reconstructed: [
        { lat: 14.5300, lng: 67.5500 },
        { lat: 14.5800, lng: 67.7200 },
        { lat: 14.6515, lng: 67.9010 },
        { lat: 14.6900, lng: 68.0100 },
        { lat: 14.7200, lng: 68.1000 }
      ],
      postGap: [
        { lat: 14.7200, lng: 68.1000 },
        { lat: 14.8800, lng: 68.5000 },
        { lat: 15.0100, lng: 68.8500 },
        { lat: 15.1200, lng: 69.1500 }
      ]
    }
  },

  // Regional Candidate Vessels
  candidateVessels: [
    {
      rank: "01",
      name: "MV Ocean Star",
      mmsi: "419001248",
      imo: "9876543",
      type: "Crude Oil Tanker",
      flag: "India 🇮🇳",
      pos: { lat: 15.1200, lng: 69.1500 },
      heading: 284,
      speedKn: 12.4,
      lengthM: 274,
      beamM: 48,
      spatialMatch: 94,
      temporalMatch: 91,
      trajectoryMatch: 88,
      behaviorMatch: 86,
      aisGapScore: 92,
      priorityScore: 91.4,
      status: "HIGH PRIORITY",
      cpaNm: 1.4,
      gapDuration: "38 min"
    },
    {
      rank: "02",
      name: "Blue Horizon",
      mmsi: "352001890",
      imo: "9641120",
      type: "Chemical Tanker",
      flag: "Panama 🇵🇦",
      pos: { lat: 15.3500, lng: 68.4200 },
      heading: 45,
      speedKn: 11.2,
      lengthM: 182,
      beamM: 32,
      spatialMatch: 81,
      temporalMatch: 76,
      trajectoryMatch: 72,
      behaviorMatch: 68,
      aisGapScore: 70,
      priorityScore: 76.8,
      status: "UNDER REVIEW",
      cpaNm: 4.8,
      gapDuration: "14 min"
    },
    {
      rank: "03",
      name: "Sea Carrier",
      mmsi: "211849000",
      imo: "9452291",
      type: "Container Ship",
      flag: "Liberia 🇱🇷",
      pos: { lat: 14.2000, lng: 67.9500 },
      heading: 160,
      speedKn: 16.8,
      lengthM: 295,
      beamM: 40,
      spatialMatch: 72,
      temporalMatch: 65,
      trajectoryMatch: 61,
      behaviorMatch: 64,
      aisGapScore: 58,
      priorityScore: 64.2,
      status: "MODERATE",
      cpaNm: 8.2,
      gapDuration: "None"
    },
    {
      rank: "04",
      name: "Asian Pearl",
      mmsi: "563002140",
      imo: "9312284",
      type: "Bulk Carrier",
      flag: "Singapore 🇸🇬",
      pos: { lat: 14.0500, lng: 67.5000 },
      heading: 135,
      speedKn: 13.5,
      lengthM: 225,
      beamM: 32,
      spatialMatch: 54,
      temporalMatch: 48,
      trajectoryMatch: 42,
      behaviorMatch: 39,
      aisGapScore: 20,
      priorityScore: 40.6,
      status: "LOW",
      cpaNm: 14.5,
      gapDuration: "None"
    }
  ],

  // Vulnerable Coastal Assets & Risk Zones
  riskZones: [
    {
      id: "RZ-1",
      name: "Netrani Coral Sanctuary",
      type: "Marine Protected Area",
      coordinates: { lat: 14.0150, lng: 74.3250 },
      polygon: [
        { lat: 14.01, lng: 74.30 },
        { lat: 14.04, lng: 74.35 },
        { lat: 13.98, lng: 74.38 },
        { lat: 13.96, lng: 74.32 }
      ],
      vulnerabilityScore: 84,
      impactWindow: "T+78h",
      desc: "Coral reef haven, protected sea turtles and pelagic biodiversity"
    },
    {
      id: "RZ-2",
      name: "Zuari Estuary & Mangrove Basin",
      type: "Mangrove Breeding Zone",
      coordinates: { lat: 15.4200, lng: 73.8100 },
      polygon: [
        { lat: 15.38, lng: 73.75 },
        { lat: 15.45, lng: 73.82 },
        { lat: 15.43, lng: 73.88 },
        { lat: 15.35, lng: 73.80 }
      ],
      vulnerabilityScore: 88,
      impactWindow: "T+64h",
      desc: "Critical artisanal fishing grounds and estuarine mangrove nursery"
    }
  ],

  // Tactical Response Assets
  responsePlan: {
    tier: "Tier 2 Offshore Mobilization",
    booms: [
      {
        id: "BM-01",
        label: "Zuari Estuary Curtain Boom",
        coords: [{ lat: 15.3900, lng: 73.7800 }, { lat: 15.4200, lng: 73.8100 }],
        lengthKm: 2.4,
        type: "Ocean Fence Curtain Boom"
      },
      {
        id: "BM-02",
        label: "Karwar Bay Deflection Barrier",
        coords: [{ lat: 14.8050, lng: 74.1100 }, { lat: 14.8350, lng: 74.1300 }],
        lengthKm: 1.8,
        type: "Pneumatic Bubble Barrier"
      }
    ],
    vessels: [
      { name: "ICGS Samudra Prahari", type: "Pollution Control Vessel", lat: 15.2000, lng: 73.1000, heading: 250, status: "Deployed", mission: "Containment Boom Mobilization" },
      { name: "Skimmer Alpha 2", type: "Weir High-Capacity Skimmer", lat: 14.9500, lng: 73.3500, heading: 270, status: "En Route", mission: "Oil Recovery" }
    ],
    directives: [
      { num: "01", title: "Deploy Containment Booms", priority: "CRITICAL", badge: "bg-red-100 text-status-danger", desc: "Deploy 2.4 km ocean curtain boom across Zuari Estuary and Karwar Bay to shield mangrove breeding zones." },
      { num: "02", title: "Monitor Coastal Shoreline Sector", priority: "HIGH", badge: "bg-amber-100 text-status-warning", desc: "Deploy shore-based rapid response teams and thermal drone monitoring along 42 km vulnerable coastline." },
      { num: "03", title: "Dispatch Specialized Response Vessels", priority: "HIGH", badge: "bg-amber-100 text-status-warning", desc: "Mobilize ICGS Samudra Prahari and 2 high-capacity weir skimmer vessels from Mormugao Base Alpha." },
      { num: "04", title: "Notify Maritime & Port Authorities", priority: "HIGH", badge: "bg-amber-100 text-status-warning", desc: "Transmit forensic attribution dossier to DG Shipping, Coast Guard MRCC, and State Pollution Board." }
    ]
  }
};

// -------------------------------------------------------------
// 2. REGION: Bay of Bengal (Visakhapatnam / Paradip Coast)
// -------------------------------------------------------------
export const CASE_OF_2026_0918 = {
  incidentId: "OF-2026-0918",
  internalId: "INC-0928",
  title: "Bay of Bengal Heavy Fuel Oil Spill & Gahirmatha Ecological Threat",
  region: "Bay of Bengal (Visakhapatnam / Paradip)",
  regionShort: "Bay of Bengal",
  flagEmoji: "🇮🇳",
  detectionTimeUTC: "03 SEP 2026, 08:15:20 UTC",
  detectionTimestamp: "2026-09-03T08:15:20Z",
  coordinates: {
    lat: 17.4500,
    lng: 83.8500,
    zoom: 8,
    display: "17.45°N, 83.85°E"
  },
  spillAreaKm2: 8.2,
  spillPerimeterKm: 14.1,
  lengthKm: 6.2,
  widthKm: 1.8,
  orientationDeg: 45,
  compactness: 0.42,
  estimatedAgeHours: 24.5,
  detectionConfidence: 94.2,
  probableSourceConfidence: 68.9,
  riskLevel: "HIGH",
  status: "Active Drift",
  assignedAnalyst: "Cdr. A. Sharma (Coast Guard Maritime Forensics)",
  candidateCount: 8,
  highPriorityCount: 2,

  geoCoordinates: [
    { lat: 17.4720, lng: 83.8150 },
    { lat: 17.4880, lng: 83.8420 },
    { lat: 17.4790, lng: 83.8750 },
    { lat: 17.4550, lng: 83.8920 },
    { lat: 17.4320, lng: 83.8780 },
    { lat: 17.4210, lng: 83.8450 },
    { lat: 17.4380, lng: 83.8200 }
  ],

  environment: {
    windSpeedKn: 18.5,
    windDirectionDeg: 220,
    windDirectionText: "220° (SW)",
    currentSpeedMs: 0.58,
    currentDirectionDeg: 45,
    currentDirectionText: "045° (NE)",
    waveHeightM: 2.3,
    wavePeriodSec: 7.1,
    seaSurfaceTempC: 29.1,
    salinityPsu: 32.8,
    atmosphericPressureHpa: 1008.2
  },

  simulation: {
    mode: "forward",
    engine: "Lagrangian Particle Dispersion (OpenDrift / HYCOM)",
    totalParticles: 4000,
    displayParticlesCount: 45,
    timeSteps: {
      "T+0": {
        timeLabel: "T+0 (Detection)",
        elapsedHours: 0,
        centroid: { lat: 17.4500, lng: 83.8500 },
        areaKm2: 8.2,
        dispersionRadiusKm: 3.5,
        weathering: { emulsified: 15, evaporated: 18, surface: 59, dispersed: 8 },
        particles: generateParticleCloud(17.4500, 83.8500, 0.040, 40, 11)
      },
      "T+6": {
        timeLabel: "T+6h (+6 Hours)",
        elapsedHours: 6,
        centroid: { lat: 17.5250, lng: 83.9400 },
        areaKm2: 9.6,
        dispersionRadiusKm: 4.4,
        weathering: { emulsified: 21, evaporated: 22, surface: 48, dispersed: 9 },
        particles: generateParticleCloud(17.5250, 83.9400, 0.050, 40, 12)
      },
      "T+12": {
        timeLabel: "T+12h (+12 Hours)",
        elapsedHours: 12,
        centroid: { lat: 17.6100, lng: 84.0450 },
        areaKm2: 11.2,
        dispersionRadiusKm: 5.6,
        weathering: { emulsified: 28, evaporated: 25, surface: 37, dispersed: 10 },
        particles: generateParticleCloud(17.6100, 84.0450, 0.062, 40, 13)
      },
      "T+24": {
        timeLabel: "T+24h (+24 Hours)",
        elapsedHours: 24,
        centroid: { lat: 17.7800, lng: 84.2800 },
        areaKm2: 13.8,
        dispersionRadiusKm: 7.4,
        weathering: { emulsified: 34, evaporated: 28, surface: 27, dispersed: 11 },
        particles: generateParticleCloud(17.7800, 84.2800, 0.080, 40, 14)
      },
      "T+48": {
        timeLabel: "T+48h (+48 Hours)",
        elapsedHours: 48,
        centroid: { lat: 18.1200, lng: 84.7200 },
        areaKm2: 16.5,
        dispersionRadiusKm: 9.8,
        weathering: { emulsified: 38, evaporated: 29, surface: 21, dispersed: 12 },
        particles: generateParticleCloud(18.1200, 84.7200, 0.105, 40, 15)
      },
      "T+72": {
        timeLabel: "T+72h (+72 Hours)",
        elapsedHours: 72,
        centroid: { lat: 18.4500, lng: 85.1800 },
        areaKm2: 18.4,
        dispersionRadiusKm: 12.2,
        weathering: { emulsified: 40, evaporated: 30, surface: 18, dispersed: 12 },
        particles: generateParticleCloud(18.4500, 85.1800, 0.130, 40, 16)
      }
    }
  },

  hindcast: {
    originZoneA: {
      name: "ZONE A (Primary Target)",
      confidence: 68.9,
      coordinates: "17.2100°N, 83.5200°E",
      lat: 17.2100,
      lng: 83.5200,
      radiusKm: 3.8,
      depthM: 1450
    },
    originZoneB: {
      name: "ZONE B (Secondary)",
      confidence: 21.4,
      coordinates: "17.2800°N, 83.4200°E",
      lat: 17.2800,
      lng: 83.4200,
      radiusKm: 5.5,
      depthM: 1600
    },
    originZoneC: {
      name: "ZONE C (Dispersed)",
      confidence: 9.7,
      coordinates: "17.1500°N, 83.6200°E",
      lat: 17.1500,
      lng: 83.6200,
      radiusKm: 7.2,
      depthM: 1320
    },
    estimatedReleaseTimeUTC: "02 SEP 2026, 06:10 UTC",
    backwardDurationHours: 26.0,
    uncertaintyRadiusKm: 6.5,
    currentContribution: 68,
    windContribution: 32,
    stokesContribution: 3,
    reverseTrack: [
      { lat: 17.4500, lng: 83.8500 },
      { lat: 17.3900, lng: 83.7600 },
      { lat: 17.3200, lng: 83.6700 },
      { lat: 17.2600, lng: 83.5800 },
      { lat: 17.2100, lng: 83.5200 }
    ]
  },

  topVessel: {
    name: "GOLDEN APEX",
    mmsi: "352001991",
    imo: "9512348",
    callSign: "3FAP8",
    type: "Capesize Bulk Carrier",
    flag: "Panama",
    flagEmoji: "🇵🇦",
    lengthM: 289,
    beamM: 45,
    draughtM: 17.8,
    grossTonnage: 92000,
    currentSpeedKn: 13.8,
    headingDeg: 42,
    destination: "Paradip Port (INPRT)",
    eta: "04 SEP 2026 12:00 UTC",
    status: "HIGH PRIORITY",
    priorityScore: 88.2,
    closestApproachNm: 2.1,
    closestApproachTime: "02 SEP 06:15 UTC",
    aisBlackoutDurationMin: 24,
    aisBlackoutRange: "02 SEP 06:00 - 06:24 UTC",
    anomalyScore: 82,
    speedDropKn: "14.1 → 5.2 kn",
    trajectorySimilarity: 89.6,
    currentPos: { lat: 17.9500, lng: 84.4500 },
    aisTrack: {
      preGap: [
        { lat: 16.8000, lng: 82.9000 },
        { lat: 17.0200, lng: 83.2200 },
        { lat: 17.1500, lng: 83.4200 }
      ],
      blackoutGap: [
        { lat: 17.1500, lng: 83.4200 },
        { lat: 17.3000, lng: 83.6500 }
      ],
      reconstructed: [
        { lat: 17.1500, lng: 83.4200 },
        { lat: 17.2050, lng: 83.5180 },
        { lat: 17.2500, lng: 83.5800 },
        { lat: 17.3000, lng: 83.6500 }
      ],
      postGap: [
        { lat: 17.3000, lng: 83.6500 },
        { lat: 17.5500, lng: 83.9500 },
        { lat: 17.7500, lng: 84.2200 },
        { lat: 17.9500, lng: 84.4500 }
      ]
    }
  },

  candidateVessels: [
    {
      rank: "01",
      name: "Golden Apex",
      mmsi: "352001991",
      imo: "9512348",
      type: "Capesize Bulk Carrier",
      flag: "Panama 🇵🇦",
      pos: { lat: 17.9500, lng: 84.4500 },
      heading: 42,
      speedKn: 13.8,
      lengthM: 289,
      beamM: 45,
      spatialMatch: 92,
      temporalMatch: 88,
      trajectoryMatch: 86,
      behaviorMatch: 81,
      aisGapScore: 84,
      priorityScore: 88.2,
      status: "HIGH PRIORITY",
      cpaNm: 2.1,
      gapDuration: "24 min"
    },
    {
      rank: "02",
      name: "Bengal Voyager",
      mmsi: "419000882",
      imo: "9488310",
      type: "Product Tanker",
      flag: "India 🇮🇳",
      pos: { lat: 17.7500, lng: 83.9500 },
      heading: 195,
      speedKn: 12.0,
      lengthM: 175,
      beamM: 28,
      spatialMatch: 76,
      temporalMatch: 70,
      trajectoryMatch: 68,
      behaviorMatch: 62,
      aisGapScore: 40,
      priorityScore: 68.4,
      status: "UNDER REVIEW",
      cpaNm: 6.4,
      gapDuration: "None"
    }
  ],

  riskZones: [
    {
      id: "RZ-BOB-1",
      name: "Gahirmatha Marine Sanctuary",
      type: "Sea Turtle Nesting Biosphere",
      coordinates: { lat: 20.7200, lng: 87.0500 },
      polygon: [
        { lat: 20.65, lng: 86.95 },
        { lat: 20.80, lng: 87.12 },
        { lat: 20.75, lng: 87.20 },
        { lat: 20.60, lng: 87.02 }
      ],
      vulnerabilityScore: 92,
      impactWindow: "T+48h",
      desc: "World's largest Olive Ridley sea turtle mass nesting sanctuary"
    }
  ],

  responsePlan: {
    tier: "Tier 2 Coastal Containment",
    booms: [
      {
        id: "BM-BOB-1",
        label: "Rushikulya Nesting Beach Deflection Barrier",
        coords: [{ lat: 19.3500, lng: 85.0500 }, { lat: 19.3900, lng: 85.0900 }],
        lengthKm: 3.2,
        type: "Rapid Shoreline Barrier"
      }
    ],
    vessels: [
      { name: "ICGS Varad", type: "Offshore Patrol Vessel", lat: 17.6500, lng: 84.1000, heading: 45, status: "Patrolling", mission: "Drift Monitoring" }
    ],
    directives: [
      { num: "01", title: "Deploy Deflection Booms at Turtle Beaches", priority: "CRITICAL", badge: "bg-red-100 text-status-danger", desc: "Prioritize containment along Gahirmatha and Rushikulya estuaries ahead of seasonal breeding." },
      { num: "02", title: "Notify Paradip Port Authorities", priority: "HIGH", badge: "bg-amber-100 text-status-warning", desc: "Coordinate vessel intercept and inspection for Golden Apex on port arrival." }
    ]
  }
};

// -------------------------------------------------------------
// 3. REGION: Gulf of Kutch (Sikka / Kandla Oil Terminals)
// -------------------------------------------------------------
export const CASE_OF_2026_0925 = {
  incidentId: "OF-2026-0925",
  internalId: "INC-0935",
  title: "Gulf of Kutch Crude Manifold Discharge & Marine National Park Risk",
  region: "Gulf of Kutch (Sikka / Kandla)",
  regionShort: "Gulf of Kutch",
  flagEmoji: "🇮🇳",
  detectionTimeUTC: "04 SEP 2026, 11:24:00 UTC",
  detectionTimestamp: "2026-09-04T11:24:00Z",
  coordinates: {
    lat: 22.5200,
    lng: 69.1800,
    zoom: 9,
    display: "22.52°N, 69.18°E"
  },
  spillAreaKm2: 11.3,
  spillPerimeterKm: 18.6,
  lengthKm: 7.1,
  widthKm: 1.9,
  orientationDeg: 82,
  compactness: 0.35,
  estimatedAgeHours: 19.2,
  detectionConfidence: 95.8,
  probableSourceConfidence: 81.2,
  riskLevel: "CRITICAL",
  status: "Investigating",
  assignedAnalyst: "Dr. E. Vance / Capt. K. Rawat",
  candidateCount: 6,
  highPriorityCount: 2,

  geoCoordinates: [
    { lat: 22.5450, lng: 69.1300 },
    { lat: 22.5580, lng: 69.1750 },
    { lat: 22.5490, lng: 69.2250 },
    { lat: 22.5280, lng: 69.2450 },
    { lat: 22.5050, lng: 69.2150 },
    { lat: 22.5080, lng: 69.1550 },
    { lat: 22.5260, lng: 69.1200 }
  ],

  environment: {
    windSpeedKn: 12.0,
    windDirectionDeg: 290,
    windDirectionText: "290° (WNW)",
    currentSpeedMs: 1.45,
    currentDirectionDeg: 85,
    currentDirectionText: "085° (E) Macro-Tidal",
    waveHeightM: 1.1,
    wavePeriodSec: 4.8,
    seaSurfaceTempC: 30.2,
    salinityPsu: 38.5,
    atmosphericPressureHpa: 1010.8
  },

  simulation: {
    mode: "forward",
    engine: "Lagrangian Particle Dispersion (Tidal Oscillating Engine)",
    totalParticles: 4500,
    displayParticlesCount: 45,
    timeSteps: {
      "T+0": {
        timeLabel: "T+0 (Detection)",
        elapsedHours: 0,
        centroid: { lat: 22.5200, lng: 69.1800 },
        areaKm2: 11.3,
        dispersionRadiusKm: 3.8,
        weathering: { emulsified: 22, evaporated: 25, surface: 45, dispersed: 8 },
        particles: generateParticleCloud(22.5200, 69.1800, 0.038, 40, 21)
      },
      "T+6": {
        timeLabel: "T+6h (+6 Hours - Flood Tide)",
        elapsedHours: 6,
        centroid: { lat: 22.5650, lng: 69.3100 },
        areaKm2: 13.5,
        dispersionRadiusKm: 4.9,
        weathering: { emulsified: 29, evaporated: 28, surface: 34, dispersed: 9 },
        particles: generateParticleCloud(22.5650, 69.3100, 0.048, 40, 22)
      },
      "T+12": {
        timeLabel: "T+12h (+12 Hours - Ebb/Flood Cycle)",
        elapsedHours: 12,
        centroid: { lat: 22.5800, lng: 69.4400 },
        areaKm2: 15.8,
        dispersionRadiusKm: 6.2,
        weathering: { emulsified: 35, evaporated: 31, surface: 24, dispersed: 10 },
        particles: generateParticleCloud(22.5800, 69.4400, 0.060, 40, 23)
      },
      "T+24": {
        timeLabel: "T+24h (+24 Hours)",
        elapsedHours: 24,
        centroid: { lat: 22.6200, lng: 69.6200 },
        areaKm2: 18.2,
        dispersionRadiusKm: 8.0,
        weathering: { emulsified: 41, evaporated: 33, surface: 16, dispersed: 10 },
        particles: generateParticleCloud(22.6200, 69.6200, 0.078, 40, 24)
      },
      "T+48": {
        timeLabel: "T+48h (+48 Hours)",
        elapsedHours: 48,
        centroid: { lat: 22.6700, lng: 69.8500 },
        areaKm2: 20.4,
        dispersionRadiusKm: 10.2,
        weathering: { emulsified: 44, evaporated: 34, surface: 12, dispersed: 10 },
        particles: generateParticleCloud(22.6700, 69.8500, 0.098, 40, 25)
      },
      "T+72": {
        timeLabel: "T+72h (+72 Hours)",
        elapsedHours: 72,
        centroid: { lat: 22.7100, lng: 70.0800 },
        areaKm2: 21.8,
        dispersionRadiusKm: 12.5,
        weathering: { emulsified: 46, evaporated: 35, surface: 9, dispersed: 10 },
        particles: generateParticleCloud(22.7100, 70.0800, 0.120, 40, 26)
      }
    }
  },

  hindcast: {
    originZoneA: {
      name: "ZONE A (SPM Sikka Terminal Approach)",
      confidence: 81.2,
      coordinates: "22.4600°N, 69.0400°E",
      lat: 22.4600,
      lng: 69.0400,
      radiusKm: 2.8,
      depthM: 32
    },
    originZoneB: {
      name: "ZONE B (Anchor Staging Area)",
      confidence: 14.5,
      coordinates: "22.4900°N, 68.9600°E",
      lat: 22.4900,
      lng: 68.9600,
      radiusKm: 4.2,
      depthM: 28
    },
    originZoneC: {
      name: "ZONE C (Offshore Channel)",
      confidence: 4.3,
      coordinates: "22.4200°N, 69.1200°E",
      lat: 22.4200,
      lng: 69.1200,
      radiusKm: 5.8,
      depthM: 36
    },
    estimatedReleaseTimeUTC: "03 SEP 2026, 20:15 UTC",
    backwardDurationHours: 15.0,
    uncertaintyRadiusKm: 4.2,
    currentContribution: 78,
    windContribution: 22,
    stokesContribution: 1,
    reverseTrack: [
      { lat: 22.5200, lng: 69.1800 },
      { lat: 22.5000, lng: 69.1300 },
      { lat: 22.4800, lng: 69.0850 },
      { lat: 22.4600, lng: 69.0400 }
    ]
  },

  topVessel: {
    name: "AL-BARAKA",
    mmsi: "636019821",
    imo: "9745562",
    callSign: "ELRR4",
    type: "Suezmax Crude Tanker",
    flag: "Liberia",
    flagEmoji: "🇱🇷",
    lengthM: 274,
    beamM: 48,
    draughtM: 15.8,
    grossTonnage: 81500,
    currentSpeedKn: 9.4,
    headingDeg: 78,
    destination: "Sikka SPM 3 (INSIK)",
    eta: "04 SEP 2026 18:00 UTC",
    status: "HIGH PRIORITY",
    priorityScore: 93.8,
    closestApproachNm: 0.8,
    closestApproachTime: "03 SEP 20:18 UTC",
    aisBlackoutDurationMin: 42,
    aisBlackoutRange: "03 SEP 19:55 - 20:37 UTC",
    anomalyScore: 91,
    speedDropKn: "12.8 → 2.1 kn",
    trajectorySimilarity: 94.8,
    currentPos: { lat: 22.5800, lng: 69.3200 },
    aisTrack: {
      preGap: [
        { lat: 22.3500, lng: 68.8000 },
        { lat: 22.4100, lng: 68.9500 }
      ],
      blackoutGap: [
        { lat: 22.4100, lng: 68.9500 },
        { lat: 22.5100, lng: 69.1800 }
      ],
      reconstructed: [
        { lat: 22.4100, lng: 68.9500 },
        { lat: 22.4580, lng: 69.0420 },
        { lat: 22.5100, lng: 69.1800 }
      ],
      postGap: [
        { lat: 22.5100, lng: 69.1800 },
        { lat: 22.5800, lng: 69.3200 }
      ]
    }
  },

  candidateVessels: [
    {
      rank: "01",
      name: "Al-Baraka",
      mmsi: "636019821",
      imo: "9745562",
      type: "Suezmax Crude Tanker",
      flag: "Liberia 🇱🇷",
      pos: { lat: 22.5800, lng: 69.3200 },
      heading: 78,
      speedKn: 9.4,
      lengthM: 274,
      beamM: 48,
      spatialMatch: 96,
      temporalMatch: 94,
      trajectoryMatch: 93,
      behaviorMatch: 91,
      aisGapScore: 95,
      priorityScore: 93.8,
      status: "HIGH PRIORITY",
      cpaNm: 0.8,
      gapDuration: "42 min"
    },
    {
      rank: "02",
      name: "Kandla Pioneer",
      mmsi: "419000910",
      imo: "9382100",
      type: "Chemical Tanker",
      flag: "India 🇮🇳",
      pos: { lat: 22.6500, lng: 69.4800 },
      heading: 260,
      speedKn: 10.5,
      lengthM: 145,
      beamM: 24,
      spatialMatch: 72,
      temporalMatch: 68,
      trajectoryMatch: 64,
      behaviorMatch: 59,
      aisGapScore: 25,
      priorityScore: 61.2,
      status: "MODERATE",
      cpaNm: 5.2,
      gapDuration: "None"
    }
  ],

  riskZones: [
    {
      id: "RZ-KUTCH-1",
      name: "Marine National Park & Sanctuary",
      type: "Coral Reef & Mangrove Biosphere",
      coordinates: { lat: 22.4500, lng: 69.5800 },
      polygon: [
        { lat: 22.40, lng: 69.45 },
        { lat: 22.52, lng: 69.65 },
        { lat: 22.48, lng: 69.75 },
        { lat: 22.36, lng: 69.55 }
      ],
      vulnerabilityScore: 96,
      impactWindow: "T+18h",
      desc: "India's first Marine National Park with 42 islands, coral reefs and mangrove creeks"
    }
  ],

  responsePlan: {
    tier: "Tier 1 High-Tidal Emergency Response",
    booms: [
      {
        id: "BM-KUTCH-1",
        label: "Pirotan Island Sanctuary Protection Boom",
        coords: [{ lat: 22.4800, lng: 69.5200 }, { lat: 22.5100, lng: 69.5600 }],
        lengthKm: 3.6,
        type: "Tidal Deflection Skirt Boom"
      }
    ],
    vessels: [
      { name: "ICGS Ankit", type: "Fast Patrol Vessel", lat: 22.5300, lng: 69.2800, heading: 90, status: "Stationed", mission: "Containment Intercept" }
    ],
    directives: [
      { num: "01", title: "Deflect Oil from Pirotan Coral Reefs", priority: "CRITICAL", badge: "bg-red-100 text-status-danger", desc: "Deploy fast-response booms before the next 1.4 m/s flood tide enters Marine National Park creeks." },
      { num: "02", title: "Audit Sikka Single Point Mooring Terminal", priority: "HIGH", badge: "bg-amber-100 text-status-warning", desc: "Shut down offshore manifold line pending structural pressure testing." }
    ]
  }
};

// -------------------------------------------------------------
// 4. REGION: Gulf of Mannar & Palk Strait (Coral Biosphere)
// -------------------------------------------------------------
export const CASE_OF_2026_0922 = {
  incidentId: "OF-2026-0922",
  internalId: "INC-0932",
  title: "Gulf of Mannar Chemical Slick & Dugong Habitat Protection",
  region: "Gulf of Mannar (Palk Strait)",
  regionShort: "Gulf of Mannar",
  flagEmoji: "🇱🇰",
  detectionTimeUTC: "02 SEP 2026, 17:40:00 UTC",
  detectionTimestamp: "2026-09-02T17:40:00Z",
  coordinates: {
    lat: 9.1800,
    lng: 79.3200,
    zoom: 9,
    display: "09.18°N, 79.32°E"
  },
  spillAreaKm2: 4.6,
  spillPerimeterKm: 8.9,
  lengthKm: 4.2,
  widthKm: 1.1,
  orientationDeg: 60,
  compactness: 0.44,
  estimatedAgeHours: 16.8,
  detectionConfidence: 93.4,
  probableSourceConfidence: 74.6,
  riskLevel: "HIGH",
  status: "Active Drift",
  assignedAnalyst: "Dr. S. Ramanathan",
  candidateCount: 5,
  highPriorityCount: 1,

  geoCoordinates: [
    { lat: 9.1950, lng: 79.2950 },
    { lat: 9.2080, lng: 79.3250 },
    { lat: 9.1980, lng: 79.3520 },
    { lat: 9.1750, lng: 79.3580 },
    { lat: 9.1600, lng: 79.3300 },
    { lat: 9.1720, lng: 79.2980 }
  ],

  environment: {
    windSpeedKn: 16.0,
    windDirectionDeg: 240,
    windDirectionText: "240° (WSW)",
    currentSpeedMs: 0.35,
    currentDirectionDeg: 60,
    currentDirectionText: "060° (ENE)",
    waveHeightM: 0.9,
    wavePeriodSec: 4.2,
    seaSurfaceTempC: 30.5,
    salinityPsu: 35.1,
    atmosphericPressureHpa: 1011.5
  },

  simulation: {
    mode: "forward",
    engine: "Lagrangian Particle Dispersion (Shallow Channel Model)",
    totalParticles: 3500,
    displayParticlesCount: 40,
    timeSteps: {
      "T+0": {
        timeLabel: "T+0 (Detection)",
        elapsedHours: 0,
        centroid: { lat: 9.1800, lng: 79.3200 },
        areaKm2: 4.6,
        dispersionRadiusKm: 2.4,
        weathering: { emulsified: 12, evaporated: 32, surface: 48, dispersed: 8 },
        particles: generateParticleCloud(9.1800, 79.3200, 0.030, 35, 31)
      },
      "T+6": {
        timeLabel: "T+6h (+6 Hours)",
        elapsedHours: 6,
        centroid: { lat: 9.2250, lng: 79.3900 },
        areaKm2: 5.4,
        dispersionRadiusKm: 3.1,
        weathering: { emulsified: 18, evaporated: 38, surface: 35, dispersed: 9 },
        particles: generateParticleCloud(9.2250, 79.3900, 0.038, 35, 32)
      },
      "T+12": {
        timeLabel: "T+12h (+12 Hours)",
        elapsedHours: 12,
        centroid: { lat: 9.2700, lng: 79.4600 },
        areaKm2: 6.2,
        dispersionRadiusKm: 3.9,
        weathering: { emulsified: 24, evaporated: 42, surface: 25, dispersed: 9 },
        particles: generateParticleCloud(9.2700, 79.4600, 0.048, 35, 33)
      },
      "T+24": {
        timeLabel: "T+24h (+24 Hours)",
        elapsedHours: 24,
        centroid: { lat: 9.3600, lng: 79.6000 },
        areaKm2: 7.5,
        dispersionRadiusKm: 5.2,
        weathering: { emulsified: 28, evaporated: 45, surface: 17, dispersed: 10 },
        particles: generateParticleCloud(9.3600, 79.6000, 0.062, 35, 34)
      },
      "T+48": {
        timeLabel: "T+48h (+48 Hours)",
        elapsedHours: 48,
        centroid: { lat: 9.5200, lng: 79.8500 },
        areaKm2: 8.8,
        dispersionRadiusKm: 7.1,
        weathering: { emulsified: 30, evaporated: 48, surface: 12, dispersed: 10 },
        particles: generateParticleCloud(9.5200, 79.8500, 0.080, 35, 35)
      },
      "T+72": {
        timeLabel: "T+72h (+72 Hours)",
        elapsedHours: 72,
        centroid: { lat: 9.6800, lng: 80.1200 },
        areaKm2: 9.6,
        dispersionRadiusKm: 9.0,
        weathering: { emulsified: 32, evaporated: 50, surface: 8, dispersed: 10 },
        particles: generateParticleCloud(9.6800, 80.1200, 0.100, 35, 36)
      }
    }
  },

  hindcast: {
    originZoneA: {
      name: "ZONE A (Palk Strait International Boundary)",
      confidence: 74.6,
      coordinates: "09.0500°N, 79.1800°E",
      lat: 9.0500,
      lng: 79.1800,
      radiusKm: 3.2,
      depthM: 14
    },
    originZoneB: {
      name: "ZONE B (Rameshwaram Outer Channel)",
      confidence: 18.2,
      coordinates: "09.0900°N, 79.1200°E",
      lat: 9.0900,
      lng: 79.1200,
      radiusKm: 4.5,
      depthM: 16
    },
    originZoneC: {
      name: "ZONE C (Mannar Bay Entrance)",
      confidence: 7.2,
      coordinates: "09.0100°N, 79.2500°E",
      lat: 9.0100,
      lng: 79.2500,
      radiusKm: 5.6,
      depthM: 18
    },
    estimatedReleaseTimeUTC: "02 SEP 2026, 04:30 UTC",
    backwardDurationHours: 13.2,
    uncertaintyRadiusKm: 4.8,
    currentContribution: 64,
    windContribution: 36,
    stokesContribution: 2,
    reverseTrack: [
      { lat: 9.1800, lng: 79.3200 },
      { lat: 9.1300, lng: 79.2650 },
      { lat: 9.0850, lng: 79.2150 },
      { lat: 9.0500, lng: 79.1800 }
    ]
  },

  topVessel: {
    name: "LANKA PIONEER",
    mmsi: "417002310",
    imo: "9398814",
    callSign: "4RPA",
    type: "Chemical/Products Tanker",
    flag: "Sri Lanka",
    flagEmoji: "🇱🇰",
    lengthM: 142,
    beamM: 22,
    draughtM: 8.4,
    grossTonnage: 12400,
    currentSpeedKn: 10.8,
    headingDeg: 55,
    destination: "Colombo Port (LKCMB)",
    eta: "03 SEP 2026 22:00 UTC",
    status: "HIGH PRIORITY",
    priorityScore: 86.4,
    closestApproachNm: 1.2,
    closestApproachTime: "02 SEP 04:32 UTC",
    aisBlackoutDurationMin: 28,
    aisBlackoutRange: "02 SEP 04:15 - 04:43 UTC",
    anomalyScore: 84,
    speedDropKn: "12.0 → 4.5 kn",
    trajectorySimilarity: 88.9,
    currentPos: { lat: 9.4500, lng: 79.7500 },
    aisTrack: {
      preGap: [
        { lat: 8.8500, lng: 78.9500 },
        { lat: 8.9800, lng: 79.1000 }
      ],
      blackoutGap: [
        { lat: 8.9800, lng: 79.1000 },
        { lat: 9.1500, lng: 79.2800 }
      ],
      reconstructed: [
        { lat: 8.9800, lng: 79.1000 },
        { lat: 9.0520, lng: 79.1820 },
        { lat: 9.1500, lng: 79.2800 }
      ],
      postGap: [
        { lat: 9.1500, lng: 79.2800 },
        { lat: 9.3200, lng: 79.5200 },
        { lat: 9.4500, lng: 79.7500 }
      ]
    }
  },

  candidateVessels: [
    {
      rank: "01",
      name: "Lanka Pioneer",
      mmsi: "417002310",
      imo: "9398814",
      type: "Chemical/Products Tanker",
      flag: "Sri Lanka 🇱🇰",
      pos: { lat: 9.4500, lng: 79.7500 },
      heading: 55,
      speedKn: 10.8,
      lengthM: 142,
      beamM: 22,
      spatialMatch: 90,
      temporalMatch: 86,
      trajectoryMatch: 85,
      behaviorMatch: 82,
      aisGapScore: 88,
      priorityScore: 86.4,
      status: "HIGH PRIORITY",
      cpaNm: 1.2,
      gapDuration: "28 min"
    }
  ],

  riskZones: [
    {
      id: "RZ-MANNAR-1",
      name: "Gulf of Mannar Biosphere Reserve",
      type: "Dugong & Seagrass Habitat",
      coordinates: { lat: 9.1200, lng: 79.2200 },
      polygon: [
        { lat: 9.05, lng: 79.15 },
        { lat: 9.18, lng: 79.25 },
        { lat: 9.12, lng: 79.35 },
        { lat: 9.00, lng: 79.20 }
      ],
      vulnerabilityScore: 94,
      impactWindow: "T+22h",
      desc: "Protected seagrass meadows harboring endangered Dugong dugon and 21 offshore coral islands"
    }
  ],

  responsePlan: {
    tier: "Tier 1 Eco-Sensitive Containment",
    booms: [
      {
        id: "BM-MANNAR-1",
        label: "Mandapam Island Chain Barrier",
        coords: [{ lat: 9.1500, lng: 79.2500 }, { lat: 9.1800, lng: 79.2800 }],
        lengthKm: 2.1,
        type: "Absorbent Eco-Boom"
      }
    ],
    vessels: [
      { name: "ICGS Rajdhwaj", type: "Inshore Patrol Vessel", lat: 9.2200, lng: 79.3800, heading: 60, status: "Active", mission: "Eco Barrier Deployment" }
    ],
    directives: [
      { num: "01", title: "Shield Endangered Dugong Seagrass Beds", priority: "CRITICAL", badge: "bg-red-100 text-status-danger", desc: "Position chemical-absorbent boom barriers to prevent volatile solvent absorption in shallow beds." }
    ]
  }
};

// -------------------------------------------------------------
// 5. REGION: Strait of Malacca / Great Nicobar (Six Degree Channel)
// -------------------------------------------------------------
export const CASE_OF_2026_0930 = {
  incidentId: "OF-2026-0930",
  internalId: "INC-0941",
  title: "Six Degree Channel Dark Fleet Ship-to-Ship Hydrocarbon Dumping",
  region: "Strait of Malacca (Six Degree Channel)",
  regionShort: "Strait of Malacca",
  flagEmoji: "🇮🇳",
  detectionTimeUTC: "01 SEP 2026, 03:10:00 UTC",
  detectionTimestamp: "2026-09-01T03:10:00Z",
  coordinates: {
    lat: 6.8500,
    lng: 93.9500,
    zoom: 8,
    display: "06.85°N, 93.95°E"
  },
  spillAreaKm2: 19.8,
  spillPerimeterKm: 28.5,
  lengthKm: 11.2,
  widthKm: 2.4,
  orientationDeg: 95,
  compactness: 0.32,
  estimatedAgeHours: 44.0,
  detectionConfidence: 97.4,
  probableSourceConfidence: 88.4,
  riskLevel: "CRITICAL",
  status: "Investigating",
  assignedAnalyst: "Dr. E. Vance / Naval Intelligence Liaison",
  candidateCount: 16,
  highPriorityCount: 4,

  geoCoordinates: [
    { lat: 6.8850, lng: 93.8800 },
    { lat: 6.9100, lng: 93.9400 },
    { lat: 6.8950, lng: 94.0200 },
    { lat: 6.8650, lng: 94.0700 },
    { lat: 6.8250, lng: 94.0400 },
    { lat: 6.8150, lng: 93.9600 },
    { lat: 6.8400, lng: 93.8900 }
  ],

  environment: {
    windSpeedKn: 20.1,
    windDirectionDeg: 260,
    windDirectionText: "260° (W)",
    currentSpeedMs: 0.72,
    currentDirectionDeg: 95,
    currentDirectionText: "095° (E) Equatorial Jet",
    waveHeightM: 2.6,
    wavePeriodSec: 7.8,
    seaSurfaceTempC: 28.8,
    salinityPsu: 34.2,
    atmosphericPressureHpa: 1007.4
  },

  simulation: {
    mode: "forward",
    engine: "Lagrangian Particle Dispersion (Deep Oceanic Jet)",
    totalParticles: 6000,
    displayParticlesCount: 50,
    timeSteps: {
      "T+0": {
        timeLabel: "T+0 (Detection)",
        elapsedHours: 0,
        centroid: { lat: 6.8500, lng: 93.9500 },
        areaKm2: 19.8,
        dispersionRadiusKm: 5.2,
        weathering: { emulsified: 24, evaporated: 18, surface: 50, dispersed: 8 },
        particles: generateParticleCloud(6.8500, 93.9500, 0.055, 48, 41)
      },
      "T+6": {
        timeLabel: "T+6h (+6 Hours)",
        elapsedHours: 6,
        centroid: { lat: 6.8600, lng: 94.1200 },
        areaKm2: 22.4,
        dispersionRadiusKm: 6.5,
        weathering: { emulsified: 31, evaporated: 21, surface: 39, dispersed: 9 },
        particles: generateParticleCloud(6.8600, 94.1200, 0.068, 48, 42)
      },
      "T+12": {
        timeLabel: "T+12h (+12 Hours)",
        elapsedHours: 12,
        centroid: { lat: 6.8700, lng: 94.3100 },
        areaKm2: 25.1,
        dispersionRadiusKm: 7.8,
        weathering: { emulsified: 36, evaporated: 24, surface: 30, dispersed: 10 },
        particles: generateParticleCloud(6.8700, 94.3100, 0.082, 48, 43)
      },
      "T+24": {
        timeLabel: "T+24h (+24 Hours)",
        elapsedHours: 24,
        centroid: { lat: 6.8900, lng: 94.6800 },
        areaKm2: 28.6,
        dispersionRadiusKm: 10.4,
        weathering: { emulsified: 41, evaporated: 26, surface: 22, dispersed: 11 },
        particles: generateParticleCloud(6.8900, 94.6800, 0.108, 48, 44)
      },
      "T+48": {
        timeLabel: "T+48h (+48 Hours)",
        elapsedHours: 48,
        centroid: { lat: 6.9200, lng: 95.3500 },
        areaKm2: 32.4,
        dispersionRadiusKm: 13.8,
        weathering: { emulsified: 45, evaporated: 27, surface: 16, dispersed: 12 },
        particles: generateParticleCloud(6.9200, 95.3500, 0.138, 48, 45)
      },
      "T+72": {
        timeLabel: "T+72h (+72 Hours)",
        elapsedHours: 72,
        centroid: { lat: 6.9500, lng: 96.0200 },
        areaKm2: 35.1,
        dispersionRadiusKm: 17.2,
        weathering: { emulsified: 48, evaporated: 28, surface: 12, dispersed: 12 },
        particles: generateParticleCloud(6.9500, 96.0200, 0.170, 48, 46)
      }
    }
  },

  hindcast: {
    originZoneA: {
      name: "ZONE A (STS Transshipment Coordinates)",
      confidence: 88.4,
      coordinates: "06.6500°N, 93.7000°E",
      lat: 6.6500,
      lng: 93.7000,
      radiusKm: 5.2,
      depthM: 3200
    },
    originZoneB: {
      name: "ZONE B (Alternate Rendezvous Zone)",
      confidence: 8.6,
      coordinates: "06.7200°N, 93.6000°E",
      lat: 6.7200,
      lng: 93.6000,
      radiusKm: 6.8,
      depthM: 3400
    },
    originZoneC: {
      name: "ZONE C (Off-track Drifting)",
      confidence: 3.0,
      coordinates: "06.5800°N, 93.8200°E",
      lat: 6.5800,
      lng: 93.8200,
      radiusKm: 8.0,
      depthM: 3100
    },
    estimatedReleaseTimeUTC: "30 AUG 2026, 18:40 UTC",
    backwardDurationHours: 42.0,
    uncertaintyRadiusKm: 7.2,
    currentContribution: 71,
    windContribution: 29,
    stokesContribution: 2,
    reverseTrack: [
      { lat: 6.8500, lng: 93.9500 },
      { lat: 6.7800, lng: 93.8700 },
      { lat: 6.7100, lng: 93.7900 },
      { lat: 6.6500, lng: 93.7000 }
    ]
  },

  topVessel: {
    name: "PACIFIC VANGUARD",
    mmsi: "312004551",
    imo: "9218902",
    callSign: "V3XZ",
    type: "Dark Fleet Crude VLCC",
    flag: "Gabon",
    flagEmoji: "🇬🇦",
    lengthM: 333,
    beamM: 60,
    draughtM: 21.2,
    grossTonnage: 162000,
    currentSpeedKn: 14.2,
    headingDeg: 105,
    destination: "Singapore Outer Anchorage",
    eta: "03 SEP 2026 04:00 UTC",
    status: "CRITICAL TARGET",
    priorityScore: 96.2,
    closestApproachNm: 0.9,
    closestApproachTime: "30 AUG 18:45 UTC",
    aisBlackoutDurationMin: 180,
    aisBlackoutRange: "30 AUG 17:30 - 20:30 UTC",
    anomalyScore: 96,
    speedDropKn: "15.4 → 1.8 kn (STS loiter)",
    trajectorySimilarity: 95.8,
    currentPos: { lat: 7.1500, lng: 95.4500 },
    aisTrack: {
      preGap: [
        { lat: 6.3000, lng: 93.1000 },
        { lat: 6.4800, lng: 93.4200 }
      ],
      blackoutGap: [
        { lat: 6.4800, lng: 93.4200 },
        { lat: 6.9000, lng: 94.3000 }
      ],
      reconstructed: [
        { lat: 6.4800, lng: 93.4200 },
        { lat: 6.6480, lng: 93.6980 },
        { lat: 6.7500, lng: 93.9500 },
        { lat: 6.9000, lng: 94.3000 }
      ],
      postGap: [
        { lat: 6.9000, lng: 94.3000 },
        { lat: 7.0200, lng: 94.8500 },
        { lat: 7.1500, lng: 95.4500 }
      ]
    }
  },

  candidateVessels: [
    {
      rank: "01",
      name: "Pacific Vanguard",
      mmsi: "312004551",
      imo: "9218902",
      type: "Dark Fleet VLCC",
      flag: "Gabon 🇬🇦",
      pos: { lat: 7.1500, lng: 95.4500 },
      heading: 105,
      speedKn: 14.2,
      lengthM: 333,
      beamM: 60,
      spatialMatch: 98,
      temporalMatch: 95,
      trajectoryMatch: 96,
      behaviorMatch: 97,
      aisGapScore: 99,
      priorityScore: 96.2,
      status: "CRITICAL TARGET",
      cpaNm: 0.9,
      gapDuration: "180 min (3 hours)"
    }
  ],

  riskZones: [
    {
      id: "RZ-MALACCA-1",
      name: "Great Nicobar Biosphere Reserve",
      type: "UNESCO Biosphere Sanctuary",
      coordinates: { lat: 7.0500, lng: 93.8500 },
      polygon: [
        { lat: 6.95, lng: 93.75 },
        { lat: 7.15, lng: 93.90 },
        { lat: 7.08, lng: 94.02 },
        { lat: 6.90, lng: 93.88 }
      ],
      vulnerabilityScore: 98,
      impactWindow: "T+14h",
      desc: "Prime nesting grounds for Giant Leatherback Turtles and pristine coral reefs"
    }
  ],

  responsePlan: {
    tier: "Tier 3 International Maritime Emergency",
    booms: [
      {
        id: "BM-MALACCA-1",
        label: "Campbell Bay Strategic Ocean Boom",
        coords: [{ lat: 7.0000, lng: 93.9200 }, { lat: 7.0400, lng: 93.9600 }],
        lengthKm: 4.8,
        type: "Heavy Weather Offshore Boom"
      }
    ],
    vessels: [
      { name: "ICGS Vijit", type: "Offshore Patrol Vessel", lat: 6.9500, lng: 94.2000, heading: 95, status: "Intercepting", mission: "Dark Fleet Interception" }
    ],
    directives: [
      { num: "01", title: "Interception & Port Detention Notice", priority: "CRITICAL", badge: "bg-red-100 text-status-danger", desc: "Issue INTERPOL Purple Notice and alert MPA Singapore for Pacific Vanguard inspection." }
    ]
  }
};

// -------------------------------------------------------------
// 6. REGION: Laccadive Sea / Minicoy (Nine Degree Channel)
// -------------------------------------------------------------
export const CASE_OF_2026_0909 = {
  incidentId: "OF-2026-0909",
  internalId: "INC-0919",
  title: "Nine Degree Channel Bunker Discharge & Minicoy Coral Atoll Risk",
  region: "Laccadive Sea (Minicoy Nine Degree Channel)",
  regionShort: "Laccadive Sea",
  flagEmoji: "🇮🇳",
  detectionTimeUTC: "29 AUG 2026, 11:20:00 UTC",
  detectionTimestamp: "2026-08-29T11:20:00Z",
  coordinates: {
    lat: 8.3500,
    lng: 73.1500,
    zoom: 9,
    display: "08.35°N, 73.15°E"
  },
  spillAreaKm2: 6.5,
  spillPerimeterKm: 12.4,
  lengthKm: 5.4,
  widthKm: 1.4,
  orientationDeg: 140,
  compactness: 0.40,
  estimatedAgeHours: 32.0,
  detectionConfidence: 91.5,
  probableSourceConfidence: 70.1,
  riskLevel: "MEDIUM",
  status: "Monitoring",
  assignedAnalyst: "Lt. V. Nair",
  candidateCount: 4,
  highPriorityCount: 1,

  geoCoordinates: [
    { lat: 8.3750, lng: 73.1250 },
    { lat: 8.3880, lng: 73.1500 },
    { lat: 8.3680, lng: 73.1820 },
    { lat: 8.3400, lng: 73.1750 },
    { lat: 8.3220, lng: 73.1480 },
    { lat: 8.3420, lng: 73.1200 }
  ],

  environment: {
    windSpeedKn: 11.5,
    windDirectionDeg: 320,
    windDirectionText: "320° (NW)",
    currentSpeedMs: 0.38,
    currentDirectionDeg: 140,
    currentDirectionText: "140° (SE)",
    waveHeightM: 1.4,
    wavePeriodSec: 5.8,
    seaSurfaceTempC: 29.8,
    salinityPsu: 35.8,
    atmosphericPressureHpa: 1012.0
  },

  simulation: {
    mode: "forward",
    engine: "Lagrangian Particle Dispersion (Atoll Lagoon Forcing)",
    totalParticles: 3500,
    displayParticlesCount: 35,
    timeSteps: {
      "T+0": {
        timeLabel: "T+0 (Detection)",
        elapsedHours: 0,
        centroid: { lat: 8.3500, lng: 73.1500 },
        areaKm2: 6.5,
        dispersionRadiusKm: 2.8,
        weathering: { emulsified: 19, evaporated: 20, surface: 52, dispersed: 9 },
        particles: generateParticleCloud(8.3500, 73.1500, 0.035, 35, 51)
      },
      "T+6": {
        timeLabel: "T+6h (+6 Hours)",
        elapsedHours: 6,
        centroid: { lat: 8.3150, lng: 73.1900 },
        areaKm2: 7.4,
        dispersionRadiusKm: 3.5,
        weathering: { emulsified: 26, evaporated: 23, surface: 41, dispersed: 10 },
        particles: generateParticleCloud(8.3150, 73.1900, 0.042, 35, 52)
      },
      "T+12": {
        timeLabel: "T+12h (+12 Hours)",
        elapsedHours: 12,
        centroid: { lat: 8.2800, lng: 73.2350 },
        areaKm2: 8.6,
        dispersionRadiusKm: 4.4,
        weathering: { emulsified: 32, evaporated: 26, surface: 31, dispersed: 11 },
        particles: generateParticleCloud(8.2800, 73.2350, 0.052, 35, 53)
      },
      "T+24": {
        timeLabel: "T+24h (+24 Hours)",
        elapsedHours: 24,
        centroid: { lat: 8.2100, lng: 73.3200 },
        areaKm2: 10.2,
        dispersionRadiusKm: 5.9,
        weathering: { emulsified: 38, evaporated: 29, surface: 22, dispersed: 11 },
        particles: generateParticleCloud(8.2100, 73.3200, 0.068, 35, 54)
      },
      "T+48": {
        timeLabel: "T+48h (+48 Hours)",
        elapsedHours: 48,
        centroid: { lat: 8.0800, lng: 73.4900 },
        areaKm2: 12.0,
        dispersionRadiusKm: 8.1,
        weathering: { emulsified: 42, evaporated: 31, surface: 15, dispersed: 12 },
        particles: generateParticleCloud(8.0800, 73.4900, 0.090, 35, 55)
      },
      "T+72": {
        timeLabel: "T+72h (+72 Hours)",
        elapsedHours: 72,
        centroid: { lat: 7.9500, lng: 73.6600 },
        areaKm2: 13.5,
        dispersionRadiusKm: 10.5,
        weathering: { emulsified: 45, evaporated: 32, surface: 11, dispersed: 12 },
        particles: generateParticleCloud(7.9500, 73.6600, 0.115, 35, 56)
      }
    }
  },

  hindcast: {
    originZoneA: {
      name: "ZONE A (Nine Degree Channel TSS)",
      confidence: 70.1,
      coordinates: "08.1800°N, 72.9500°E",
      lat: 8.1800,
      lng: 72.9500,
      radiusKm: 3.5,
      depthM: 1800
    },
    originZoneB: {
      name: "ZONE B (Western Approach)",
      confidence: 20.4,
      coordinates: "08.2400°N, 72.8800°E",
      lat: 8.2400,
      lng: 72.8800,
      radiusKm: 4.8,
      depthM: 1950
    },
    originZoneC: {
      name: "ZONE C (Southern Channel)",
      confidence: 9.5,
      coordinates: "08.1200°N, 73.0400°E",
      lat: 8.1200,
      lng: 73.0400,
      radiusKm: 6.2,
      depthM: 1720
    },
    estimatedReleaseTimeUTC: "28 AUG 2026, 03:20 UTC",
    backwardDurationHours: 32.0,
    uncertaintyRadiusKm: 6.0,
    currentContribution: 66,
    windContribution: 34,
    stokesContribution: 2,
    reverseTrack: [
      { lat: 8.3500, lng: 73.1500 },
      { lat: 8.2900, lng: 73.0800 },
      { lat: 8.2350, lng: 73.0150 },
      { lat: 8.1800, lng: 72.9500 }
    ]
  },

  topVessel: {
    name: "POSEIDON TRADER",
    mmsi: "538008129",
    imo: "9419980",
    callSign: "V7A29",
    type: "Container Ship (14,000 TEU)",
    flag: "Marshall Islands",
    flagEmoji: "🇲🇭",
    lengthM: 366,
    beamM: 51,
    draughtM: 15.2,
    grossTonnage: 141000,
    currentSpeedKn: 17.5,
    headingDeg: 125,
    destination: "Port Klang (MYPKG)",
    eta: "02 SEP 2026 10:00 UTC",
    status: "UNDER REVIEW",
    priorityScore: 78.4,
    closestApproachNm: 1.8,
    closestApproachTime: "28 AUG 03:25 UTC",
    aisBlackoutDurationMin: 18,
    aisBlackoutRange: "28 AUG 03:15 - 03:33 UTC",
    anomalyScore: 74,
    speedDropKn: "18.2 → 11.4 kn",
    trajectorySimilarity: 82.5,
    currentPos: { lat: 8.5500, lng: 73.7200 },
    aisTrack: {
      preGap: [
        { lat: 7.9500, lng: 72.6000 },
        { lat: 8.1200, lng: 72.8500 }
      ],
      blackoutGap: [
        { lat: 8.1200, lng: 72.8500 },
        { lat: 8.2800, lng: 73.1000 }
      ],
      reconstructed: [
        { lat: 8.1200, lng: 72.8500 },
        { lat: 8.1820, lng: 72.9520 },
        { lat: 8.2800, lng: 73.1000 }
      ],
      postGap: [
        { lat: 8.2800, lng: 73.1000 },
        { lat: 8.4200, lng: 73.4200 },
        { lat: 8.5500, lng: 73.7200 }
      ]
    }
  },

  candidateVessels: [
    {
      rank: "01",
      name: "Poseidon Trader",
      mmsi: "538008129",
      imo: "9419980",
      type: "Container Ship",
      flag: "Marshall Islands 🇲🇭",
      pos: { lat: 8.5500, lng: 73.7200 },
      heading: 125,
      speedKn: 17.5,
      lengthM: 366,
      beamM: 51,
      spatialMatch: 85,
      temporalMatch: 81,
      trajectoryMatch: 79,
      behaviorMatch: 74,
      aisGapScore: 76,
      priorityScore: 78.4,
      status: "UNDER REVIEW",
      cpaNm: 1.8,
      gapDuration: "18 min"
    }
  ],

  riskZones: [
    {
      id: "RZ-MINICOY-1",
      name: "Minicoy Atoll Coral Lagoon",
      type: "Coral Atoll Biosphere",
      coordinates: { lat: 8.2800, lng: 73.0500 },
      polygon: [
        { lat: 8.22, lng: 72.98 },
        { lat: 8.35, lng: 73.10 },
        { lat: 8.30, lng: 73.15 },
        { lat: 8.18, lng: 73.02 }
      ],
      vulnerabilityScore: 89,
      impactWindow: "T+34h",
      desc: "Pristine oceanic coral atoll and live-bait tuna fishery lagoon"
    }
  ],

  responsePlan: {
    tier: "Tier 1 Island Defense",
    booms: [
      {
        id: "BM-MINICOY-1",
        label: "Minicoy Lagoon Entrance Protective Boom",
        coords: [{ lat: 8.2900, lng: 73.0600 }, { lat: 8.3200, lng: 73.0900 }],
        lengthKm: 2.2,
        type: "Rapid Inflatable Shore Boom"
      }
    ],
    vessels: [
      { name: "ICGS C-428", type: "Interceptor Boat", lat: 8.3000, lng: 73.1200, heading: 140, status: "Active", mission: "Lagoon Patrol" }
    ],
    directives: [
      { num: "01", title: "Protect Minicoy Lagoon Entrance", priority: "HIGH", badge: "bg-red-100 text-status-danger", desc: "Deploy barrier before South-East drift pushes slick toward the inner atoll channel." }
    ]
  }
};

// -------------------------------------------------------------
// CATALOG OF ALL 6 REGIONAL INCIDENTS
// -------------------------------------------------------------
export const INCIDENTS_REGISTRY = [
  {
    id: "OF-2026-0912",
    internalId: "INC-0921",
    time: "05 SEP 2026, 14:32 UTC",
    location: "14.82°N, 68.21°E",
    region: "Arabian Sea (Goa / Karnataka EEZ)",
    regionShort: "Arabian Sea",
    flagEmoji: "🇮🇳",
    areaKm2: 14.7,
    perimeterKm: 22.4,
    confidence: 96.8,
    vesselsCount: 12,
    risk: "CRITICAL",
    riskColor: "text-status-danger bg-red-50 border-red-200",
    status: "Investigating",
    satellite: "Sentinel-1 SAR",
    topCandidate: "MV Ocean Star",
    caseRef: CASE_OF_2026_0912
  },
  {
    id: "OF-2026-0918",
    internalId: "INC-0928",
    time: "03 SEP 2026, 08:15 UTC",
    location: "17.45°N, 83.85°E",
    region: "Bay of Bengal (Visakhapatnam / Paradip)",
    regionShort: "Bay of Bengal",
    flagEmoji: "🇮🇳",
    areaKm2: 8.2,
    perimeterKm: 14.1,
    confidence: 94.2,
    vesselsCount: 8,
    risk: "HIGH",
    riskColor: "text-status-warning bg-amber-50 border-amber-200",
    status: "Active Drift",
    satellite: "Sentinel-1 SAR",
    topCandidate: "Golden Apex",
    caseRef: CASE_OF_2026_0918
  },
  {
    id: "OF-2026-0925",
    internalId: "INC-0935",
    time: "04 SEP 2026, 11:24 UTC",
    location: "22.52°N, 69.18°E",
    region: "Gulf of Kutch (Sikka / Kandla)",
    regionShort: "Gulf of Kutch",
    flagEmoji: "🇮🇳",
    areaKm2: 11.3,
    perimeterKm: 18.6,
    confidence: 95.8,
    vesselsCount: 6,
    risk: "CRITICAL",
    riskColor: "text-status-danger bg-red-50 border-red-200",
    status: "Investigating",
    satellite: "Sentinel-1 SAR",
    topCandidate: "Al-Baraka",
    caseRef: CASE_OF_2026_0925
  },
  {
    id: "OF-2026-0922",
    internalId: "INC-0932",
    time: "02 SEP 2026, 17:40 UTC",
    location: "09.18°N, 79.32°E",
    region: "Gulf of Mannar (Palk Strait)",
    regionShort: "Gulf of Mannar",
    flagEmoji: "🇱🇰",
    areaKm2: 4.6,
    perimeterKm: 8.9,
    confidence: 93.4,
    vesselsCount: 5,
    risk: "HIGH",
    riskColor: "text-status-warning bg-amber-50 border-amber-200",
    status: "Active Drift",
    satellite: "Sentinel-2 MSI",
    topCandidate: "Lanka Pioneer",
    caseRef: CASE_OF_2026_0922
  },
  {
    id: "OF-2026-0930",
    internalId: "INC-0941",
    time: "01 SEP 2026, 03:10 UTC",
    location: "06.85°N, 93.95°E",
    region: "Strait of Malacca (Six Degree Channel)",
    regionShort: "Strait of Malacca",
    flagEmoji: "🇮🇳",
    areaKm2: 19.8,
    perimeterKm: 28.5,
    confidence: 97.4,
    vesselsCount: 16,
    risk: "CRITICAL",
    riskColor: "text-status-danger bg-red-50 border-red-200",
    status: "Investigating",
    satellite: "Sentinel-1 SAR",
    topCandidate: "Pacific Vanguard",
    caseRef: CASE_OF_2026_0930
  },
  {
    id: "OF-2026-0909",
    internalId: "INC-0919",
    time: "29 AUG 2026, 11:20 UTC",
    location: "08.35°N, 73.15°E",
    region: "Laccadive Sea (Minicoy Nine Degree Channel)",
    regionShort: "Laccadive Sea",
    flagEmoji: "🇮🇳",
    areaKm2: 6.5,
    perimeterKm: 12.4,
    confidence: 91.5,
    vesselsCount: 4,
    risk: "MEDIUM",
    riskColor: "text-status-info bg-blue-50 border-blue-200",
    status: "Monitoring",
    satellite: "Landsat-8",
    topCandidate: "Poseidon Trader",
    caseRef: CASE_OF_2026_0909
  }
];

// Region lookup dictionary
export const REGIONAL_CASES_MAP = {
  "OF-2026-0912": CASE_OF_2026_0912,
  "OF-2026-0918": CASE_OF_2026_0918,
  "OF-2026-0925": CASE_OF_2026_0925,
  "OF-2026-0922": CASE_OF_2026_0922,
  "OF-2026-0930": CASE_OF_2026_0930,
  "OF-2026-0909": CASE_OF_2026_0909
};

export function getIncidentData(id) {
  return REGIONAL_CASES_MAP[id] || CASE_OF_2026_0912;
}

// Default Candidate Vessels (for backwards compatibility)
export const CANDIDATE_VESSELS = CASE_OF_2026_0912.candidateVessels;

// AI Models Status
export const AI_MODELS = [
  {
    id: "M01",
    name: "Oil Spill Classification",
    architecture: "Dual-Pol ResNet-50",
    version: "v3.2",
    purpose: "Distinguishes mineral hydrocarbons from biogenic films and sea clutter.",
    status: "READY",
    confidence: 96.8,
    latencySec: 1.20,
    dataSources: ["Sentinel-1 SAR", "Dual-Pol VV/VH"],
    inputDim: "10m/px GRD",
    activePills: ["Hydrocarbon: 96.8%", "Look-alike: 2.1%"]
  },
  {
    id: "M02",
    name: "Oil Spill Segmentation",
    architecture: "Attention U-Net + ResNeXt",
    version: "v4.0",
    purpose: "Delineates high-resolution slick boundaries, thickness gradients and area.",
    status: "READY",
    confidence: 96.8,
    latencySec: 1.82,
    dataSources: ["Sentinel-1 SAR VV", "Sentinel-2 MSI"],
    inputDim: "2048x2048 tiles",
    activePills: ["Area: 14.7 km²", "Perimeter: 22.4 km"]
  },
  {
    id: "M03",
    name: "SAR Vessel Detection",
    architecture: "YOLOv9-SAR Dual-Backbone",
    version: "v2.5",
    purpose: "Detects dark and AIS-reporting vessels from SAR radar backscatter signatures.",
    status: "READY",
    confidence: 95.1,
    latencySec: 0.65,
    dataSources: ["Sentinel-1 SAR", "AIS Cross-correlation"],
    inputDim: "Full Scene IW",
    activePills: ["3 Vessels Detected", "RCS Correlation: 95.1%"]
  },
  {
    id: "M04",
    name: "Oil Drift Simulation Engine",
    architecture: "Lagrangian Particle Tracker (OpenDrift/GNOME)",
    version: "v2.1",
    purpose: "Couples hydrodynamic and atmospheric physics for backward and forward drift.",
    status: "READY",
    confidence: 94.8,
    latencySec: 4.20,
    dataSources: ["HYCOM Currents", "ECMWF Wind", "WaveWatch III"],
    inputDim: "5,000 Particles",
    activePills: ["72h Forward", "40h Hindcast"]
  },
  {
    id: "M05",
    name: "AIS Trajectory Reconstruction",
    architecture: "Bidirectional Forward-Backward LSTM (BF-BiLSTM)",
    version: "v4.1",
    purpose: "Reconstructs unobserved vessel trajectories during AIS transmission blackout gaps.",
    status: "READY",
    confidence: 94.2,
    latencySec: 0.88,
    dataSources: ["Terrestrial & Satellite AIS"],
    inputDim: "Multi-variate Kinematics",
    activePills: ["38-min Gap Solved", "Error: ±0.18 nm"]
  },
  {
    id: "M06",
    name: "AIS Trajectory RNN",
    architecture: "GRU Multi-Horizon Predictor",
    version: "v3.0",
    purpose: "Forecasts probable vessel routes across 10m, 30m, 60m and 2-hour horizons.",
    status: "READY",
    confidence: 91.8,
    latencySec: 0.45,
    dataSources: ["AIS Historical Sequences"],
    inputDim: "Sequence Length 128",
    activePills: ["T+10m: 98.4%", "T+2h: 82.3%"]
  },
  {
    id: "M07",
    name: "Vessel Anomaly Detector",
    architecture: "Spatial-Temporal Autoencoder + Isolation Forest",
    version: "v2.8",
    purpose: "Flags anomalous speed drops, abrupt course alterations, and transponder shutoffs.",
    status: "READY",
    confidence: 89.4,
    latencySec: 0.32,
    dataSources: ["AIS Dynamic Telemetry"],
    inputDim: "Speed, Heading, Course",
    activePills: ["Anomaly Score: 87/100", "High Severity"]
  },
  {
    id: "M08",
    name: "Siamese Trajectory Similarity Network",
    architecture: "Deep Trajectory Metric Learning (STSN)",
    version: "v2.8",
    purpose: "Computes topological and temporal Fréchet similarity between drift and ship routes.",
    status: "READY",
    confidence: 93.4,
    latencySec: 0.76,
    dataSources: ["Hindcast Tracks", "Vessel AIS Tracks"],
    inputDim: "Dual Trajectory Embeddings",
    activePills: ["Similarity: 93.4%", "DTW: 0.12"]
  },
  {
    id: "M09",
    name: "XGBoost Vessel Attribution Model",
    architecture: "Gradient-Boosted Decision Trees (24 Features)",
    version: "v3.4",
    purpose: "Fuses multi-modal evidence into normalized Investigation Priority Scores.",
    status: "READY",
    confidence: 92.6,
    latencySec: 0.28,
    dataSources: ["All Prior Model Outputs", "Vessel DB"],
    inputDim: "24 Engineered Features",
    activePills: ["Top Rank: 91.4/100", "3 Priority Targets"]
  },
  {
    id: "M10",
    name: "Environmental Risk Prediction Model",
    architecture: "Spatial Graph Neural Network (Geo-GNN)",
    version: "v2.4",
    purpose: "Quantifies shoreline vulnerability, fisheries exposure, and ecosystem impact.",
    status: "READY",
    confidence: 91.2,
    latencySec: 1.10,
    dataSources: ["Marine Atlas", "Bathymetry", "Protected Areas DB"],
    inputDim: "Coastline Graph Nodes",
    activePills: ["Risk Score: 78/100", "42 km Coastline"]
  }
];

export const PIPELINE_STEPS = [
  { id: 1, label: "Satellite Analysis", status: "completed", code: "SATELLITE" },
  { id: 2, label: "Spill Detection", status: "completed", code: "CLASSIFY" },
  { id: 3, label: "Spill Characterization", status: "completed", code: "SEGMENT" },
  { id: 4, label: "Backward Hindcast", status: "completed", code: "HINDCAST" },
  { id: 5, label: "AIS Search", status: "completed", code: "AIS_SEARCH" },
  { id: 6, label: "Trajectory Reconstruction", status: "active", code: "RECONSTRUCT" },
  { id: 7, label: "Vessel Attribution", status: "pending", code: "ATTRIBUTION" },
  { id: 8, label: "Risk Assessment", status: "pending", code: "RISK" },
  { id: 9, label: "Response Planning", status: "pending", code: "RESPONSE" },
];

export const DATA_SOURCES = [
  { name: "Sentinel-1 SAR (Copernicus)", type: "C-Band Synthetic Aperture Radar", status: "CONNECTED", update: "12m ago", quality: "99.8%", coverage: "Global EEZ" },
  { name: "Sentinel-2 MSI", type: "Multispectral Optical Imagery", status: "CONNECTED", update: "1h ago", quality: "100%", coverage: "Cloud Filtered" },
  { name: "Terrestrial & Satellite AIS", type: "Vessel Transponder Stream", status: "CONNECTED", update: "Real-time (1.4k msg/s)", quality: "99.4%", coverage: "Global Maritime" },
  { name: "Copernicus CMEMS", type: "Ocean Surface Currents (HYCOM 1/12°)", status: "CONNECTED", update: "3h ago", quality: "100%", coverage: "Global Ocean" },
  { name: "ECMWF ERA5 / IFS", type: "10m Atmospheric Wind Field", status: "CONNECTED", update: "2h ago", quality: "100%", coverage: "Atmospheric Coupler" },
  { name: "WaveWatch III (NOAA)", type: "Significant Wave Height & Stokes Drift", status: "CONNECTED", update: "4h ago", quality: "99.1%", coverage: "Ocean Wave Grids" },
  { name: "GHRSST Sea Surface Temp", type: "High-Resolution SST Analysis", status: "CONNECTED", update: "6h ago", quality: "99.7%", coverage: "0.05° Global Grid" }
];

export const SYSTEM_HEALTH = {
  apiLatencyMs: 42,
  gpuUtilization: 42,
  gpuName: "NVIDIA A100 Tensor Core 80GB",
  cpuUtilization: 28,
  cpuName: "AMD EPYC 7763 64-Core",
  memoryUsedGb: 48,
  memoryTotalGb: 128,
  storageUsedTb: 1.8,
  storageTotalTb: 8.0,
  processingQueue: 0,
  inferenceQueue: 0,
  ingestionStatus: "HEALTHY"
};
