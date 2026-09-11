/**
 * MARINESIGHT Extended Hydrodynamic & Chemical Dispersion Physics Engine
 * Powers 20 Advanced Frontend Features for Marine Oil Spill Simulation
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

// ==========================================
// FEATURE 1: PETROLEUM ASSAY MATRIX & OIL TYPES
// ==========================================
export const OIL_ASSAYS = {
  arabian_light: {
    id: "arabian_light",
    name: "Arabian Light Crude",
    origin: "Saudi Arabia (Ras Tanura)",
    apiGravity: 33.4,
    densityGcm3: 0.858,
    pourPointC: -18,
    viscosityAt20C: 14.2, // cSt
    asphalteneContent: 2.1, // %
    evaporationRateFactor: 1.0,
    emulsificationRateFactor: 1.0,
    colorTheme: "#C27803",
    description: "Standard Middle East benchmark; moderate volatility, rapid water uptake forming chocolate mousse within 24h."
  },
  brent_heavy: {
    id: "brent_heavy",
    name: "Brent Blend Heavy",
    origin: "North Sea (Sullom Voe)",
    apiGravity: 28.5,
    densityGcm3: 0.884,
    pourPointC: -6,
    viscosityAt20C: 38.5,
    asphalteneContent: 4.6,
    evaporationRateFactor: 0.82,
    emulsificationRateFactor: 1.35,
    colorTheme: "#8C4A00",
    description: "High aromatic content; forms stable high-viscosity emulsions resistant to natural dissipation."
  },
  bunker_ifo380: {
    id: "bunker_ifo380",
    name: "Heavy Bunker Fuel (IFO-380)",
    origin: "Marine Bunker Fuel Oil",
    apiGravity: 15.2,
    densityGcm3: 0.965,
    pourPointC: 12,
    viscosityAt20C: 380.0,
    asphalteneContent: 8.9,
    evaporationRateFactor: 0.28,
    emulsificationRateFactor: 1.8,
    colorTheme: "#1E1E1E",
    description: "Persistent residual fuel; minimal evaporation (<15%), highly viscous, high shoreline stranding persistence."
  },
  marine_gas_oil: {
    id: "marine_gas_oil",
    name: "Marine Gas Oil (MGO / Diesel)",
    origin: "Distillate Marine Grade",
    apiGravity: 38.0,
    densityGcm3: 0.835,
    pourPointC: -28,
    viscosityAt20C: 4.8,
    asphalteneContent: 0.1,
    evaporationRateFactor: 1.9,
    emulsificationRateFactor: 0.15,
    colorTheme: "#0284C7",
    description: "Light distillate; fast evaporation (>60% in 18h), low emulsion potential, highly flammable vapor hazard."
  },
  bonny_light: {
    id: "bonny_light",
    name: "Bonny Light Crude",
    origin: "Nigeria (Niger Delta)",
    apiGravity: 35.3,
    densityGcm3: 0.848,
    pourPointC: -15,
    viscosityAt20C: 9.8,
    asphalteneContent: 1.2,
    evaporationRateFactor: 1.25,
    emulsificationRateFactor: 0.7,
    colorTheme: "#D97706",
    description: "Low-sulfur sweet crude; high paraffinic content, rapid initial spreading with moderate emulsion tendency."
  },
  venezuelan_dilbit: {
    id: "venezuelan_dilbit",
    name: "Venezuelan Diluted Bitumen",
    origin: "Orinoco Belt (Hamaca)",
    apiGravity: 19.8,
    densityGcm3: 0.935,
    pourPointC: 7,
    viscosityAt20C: 220.0,
    asphalteneContent: 11.2,
    evaporationRateFactor: 0.45,
    emulsificationRateFactor: 1.6,
    colorTheme: "#331800",
    description: "Diluent evaporates leaving dense sinking tar-like residue prone to sub-surface column sinking."
  }
};

// ==========================================
// FEATURE 2: METOCEAN & BEAUFORT SEA-STATE PRESETS
// ==========================================
export const BEAUFORT_PRESETS = [
  {
    scale: 2,
    name: "Beaufort 2 · Light Breeze",
    windSpeedKn: 6.0,
    currentSpeedKn: 0.45,
    waveHeightM: 0.3,
    wavePeriodS: 3.5,
    diffusionKh: 1.2, // m2/s turbulent diffusion
    seaStateDesc: "Small wavelets, glassy crests, minimal wave breaking"
  },
  {
    scale: 4,
    name: "Beaufort 4 · Moderate Breeze",
    windSpeedKn: 14.5,
    currentSpeedKn: 0.95,
    waveHeightM: 1.2,
    wavePeriodS: 5.2,
    diffusionKh: 4.8,
    seaStateDesc: "Small waves with breaking crests, frequent white horses"
  },
  {
    scale: 7,
    name: "Beaufort 7 · Near Gale (Monsoon)",
    windSpeedKn: 32.0,
    currentSpeedKn: 2.1,
    waveHeightM: 4.5,
    wavePeriodS: 8.4,
    diffusionKh: 18.5,
    seaStateDesc: "Sea heaps up, white foam blown in streaks, severe wave breaking"
  },
  {
    scale: 9,
    name: "Beaufort 9 · Strong Gale (Cyclone)",
    windSpeedKn: 46.0,
    currentSpeedKn: 3.4,
    waveHeightM: 7.2,
    wavePeriodS: 11.0,
    diffusionKh: 38.0,
    seaStateDesc: "High waves with rolling crests, dense spray reduces visibility, extreme dispersion"
  }
];

// ==========================================
// FEATURE 3: VIRTUAL BOOM PHYSICS & CONTAINMENT EFFICIENCY
// ==========================================
export function calculateBoomEfficiency(boomLengthM, relativeCurrentKn, boomAngleDeg = 45) {
  // Critical entrainment failure velocity v_crit is ~0.70 knots normal to the boom
  const vNormal = relativeCurrentKn * Math.sin(boomAngleDeg * DEG2RAD);
  const vCrit = 0.70;

  let efficiency = 95;
  let status = "OPTIMAL CONTAINMENT";

  if (vNormal > vCrit) {
    const excess = vNormal - vCrit;
    efficiency = Math.max(10, Math.round(95 - excess * 65));
    status = "ENTRAINMENT DRAINAGE FAILURE";
  } else if (vNormal > 0.50) {
    efficiency = Math.round(95 - ((vNormal - 0.5) / 0.2) * 20);
    status = "SUB-CRITICAL DEFLECTION";
  }

  const estimatedHoldingCapBbls = Math.round((boomLengthM / 100) * 450 * (efficiency / 100));

  return {
    boomLengthM,
    vNormal: +vNormal.toFixed(2),
    vCrit,
    efficiency,
    status,
    holdingCapacityBbls: estimatedHoldingCapBbls
  };
}

// ==========================================
// FEATURE 4: CHEMICAL DISPERSANT APPLICATION SIMULATOR
// ==========================================
export function calculateDispersantEffectiveness(oilAssay, hoursElapsed, currentViscosityCst, waveHeightM) {
  const isViscosityPermissive = currentViscosityCst < 10000;
  const isEnergySufficient = waveHeightM >= 0.5;

  let efficiencyPercent = 0;
  let advisory = "";

  if (!isViscosityPermissive) {
    efficiencyPercent = 8;
    advisory = "VISCOSITY TOO HIGH: Oil has weathered past 10,000 cSt threshold. Chemical dispersion ineffective.";
  } else if (!isEnergySufficient) {
    efficiencyPercent = 35;
    advisory = "LOW WAVE ENERGY: Calm seas lack sufficient turbulence for micro-droplet shear. Mechanical agitation recommended.";
  } else {
    const baseEff = 78;
    const viscDeduction = Math.min(30, (currentViscosityCst / 10000) * 30);
    efficiencyPercent = Math.max(25, Math.round(baseEff - viscDeduction + (waveHeightM > 1.5 ? 10 : 0)));
    advisory = `HIGHLY EFFECTIVE: Ready for aerial sortie. Accelerated column entrainment reduces surface slick by ${efficiencyPercent}%.`;
  }

  return {
    viable: isViscosityPermissive && efficiencyPercent >= 30,
    efficiencyPercent,
    targetDOR: "1:20 (Dispersant:Oil)",
    advisory,
    treatedViscosityLimitCst: 10000
  };
}

// ==========================================
// FEATURE 5: IN-SITU CONTROLLED BURNING (ASTM F2152)
// ==========================================
export function evaluateInSituBurningViability(oilAssay, waterEmulsionPercent, slickThicknessMm = 2.0, windSpeedKn = 14) {
  const thicknessOk = slickThicknessMm >= 1.0;
  const emulsionOk = waterEmulsionPercent <= 25;
  const windOk = windSpeedKn <= 20;

  const viable = thicknessOk && emulsionOk && windOk;
  let status = "VIABLE FOR IN-SITU BURNING";
  let reason = "All ASTM F2152 criteria met. Rapid thermal degradation viable.";

  if (!thicknessOk) {
    status = "INHIBITED (TOO THIN)";
    reason = `Slick thickness (${slickThicknessMm} mm) below 1.0 mm thermal ignition threshold.`;
  } else if (!emulsionOk) {
    status = "INHIBITED (WATER EXTINCTION)";
    reason = `Water-in-oil emulsion (${waterEmulsionPercent}%) exceeds 25% quench limit. Steam generation quenches flame.`;
  } else if (!windOk) {
    status = "MARGINAL (EXCESSIVE WIND)";
    reason = `Wind speed (${windSpeedKn} kn) exceeds 20 kn fire boom towing safety limit.`;
  }

  const estBurnRateBblHr = viable ? Math.round(1100 * (slickThicknessMm / 2.0)) : 0;
  const particulateSootYieldPercent = 10;

  return {
    viable,
    status,
    reason,
    estBurnRateBblHr,
    sootYieldPercent: particulateSootYieldPercent,
    minThicknessMm: 1.0,
    maxWaterPercent: 25,
    maxWindKn: 20
  };
}

// ==========================================
// FEATURE 6: SHORELINE IMPACT & ESI SENSITIVITY
// ==========================================
export function predictShorelineImpact(centroidLat, centroidLng, advection, hoursElapsed) {
  const coastLng = 73.80; // Goa/Konkan coastline proxy
  const dLngToCoast = Math.max(0, coastLng - centroidLng);
  const distanceKmToCoast = +(dLngToCoast * 111.0 * Math.cos(centroidLat * DEG2RAD)).toFixed(1);
  const distanceNmToCoast = +(distanceKmToCoast / 1.852).toFixed(1);

  const rad = advection.headingDeg * DEG2RAD;
  const eastKnots = Math.max(0.1, advection.speedKn * Math.sin(rad));
  const etaHours = +(distanceNmToCoast / eastKnots).toFixed(1);

  let sectorName = "Goa Estuarine & Mangrove Belt";
  let esiRank = 9;
  let vulnerableFauna = "Olive Ridley Turtle Nesting Grounds, Estuarine Mangroves, Artisanal Fisheries";
  let priorityLevel = "CRITICAL";

  if (centroidLat > 15.5) {
    sectorName = "Ratnagiri Rocky Shores & Tidepools";
    esiRank = 6;
    vulnerableFauna = "Intertidal Biodiversity, Coastal Fishing Villages";
    priorityLevel = "HIGH";
  } else if (centroidLat < 14.5) {
    sectorName = "Karwar Coral Reef Atoll & Naval Base";
    esiRank = 10;
    vulnerableFauna = "Live Coral Formations, Netrani Marine Sanctuary, Dolphin Corridors";
    priorityLevel = "EXTREME";
  }

  return {
    distanceKmToCoast,
    distanceNmToCoast,
    etaHours,
    landfallTimeUTC: `T+${(+hoursElapsed + +etaHours).toFixed(0)}h Forecast`,
    sectorName,
    esiRank,
    vulnerableFauna,
    priorityLevel,
    impactedShorelineKm: +(12.5 + hoursElapsed * 0.45).toFixed(1)
  };
}

// ==========================================
// FEATURE 7: EKMAN SPIRAL & VERTICAL CURRENT PROFILE
// ==========================================
export function calculateEkmanProfile(surfaceCurrentSpeedKn, surfaceCurrentHeadingDeg) {
  const depths = [0, 5, 15, 30, 50];
  return depths.map(depthM => {
    const decayFactor = Math.exp(-depthM / 18);
    const speedKn = +(surfaceCurrentSpeedKn * decayFactor).toFixed(2);
    const deflectionDeg = Math.round((depthM / 50) * 45);
    const headingDeg = (surfaceCurrentHeadingDeg + deflectionDeg) % 360;

    return {
      depthM,
      speedKn,
      headingDeg,
      layerName: depthM === 0 ? "Surface Film (0m)" : depthM <= 5 ? "Stokes Pycnocline (5m)" : depthM <= 20 ? "Mixed Subsurface (15m)" : "Deep Ocean Thermocline (50m)",
      turbulenceLevel: depthM <= 5 ? "High Turbulent Shear" : "Laminar Stable Flow"
    };
  });
}

// ==========================================
// FEATURE 8: BONN AGREEMENT OIL THICKNESS & VOLUME PARTITION
// ==========================================
export function calculateBonnThicknessBreakdown(totalAreaKm2, totalVolumeBbls) {
  return [
    {
      code: "Bonn Code 1",
      name: "Barely Visible Sheen",
      thicknessRange: "0.04 - 0.30 µm",
      areaPercent: 55,
      volumePercent: 2,
      areaKm2: +(totalAreaKm2 * 0.55).toFixed(2),
      volumeBbls: Math.round(totalVolumeBbls * 0.02),
      color: "#67E8F9",
      appearance: "Silvery / grey translucent sheen"
    },
    {
      code: "Bonn Code 2",
      name: "Rainbow Film",
      thicknessRange: "0.30 - 5.0 µm",
      areaPercent: 25,
      volumePercent: 6,
      areaKm2: +(totalAreaKm2 * 0.25).toFixed(2),
      volumeBbls: Math.round(totalVolumeBbls * 0.06),
      color: "#F472B6",
      appearance: "Visible optical refraction interference colors"
    },
    {
      code: "Bonn Code 3",
      name: "Metallic Sheen",
      thicknessRange: "5.0 - 50.0 µm",
      areaPercent: 12,
      volumePercent: 14,
      areaKm2: +(totalAreaKm2 * 0.12).toFixed(2),
      volumeBbls: Math.round(totalVolumeBbls * 0.14),
      color: "#FBBF24",
      appearance: "True color of oil reflected with metallic sheen"
    },
    {
      code: "Bonn Code 4",
      name: "Discontinuous True Oil",
      thicknessRange: "50 - 200 µm",
      areaPercent: 5,
      volumePercent: 28,
      areaKm2: +(totalAreaKm2 * 0.05).toFixed(2),
      volumeBbls: Math.round(totalVolumeBbls * 0.28),
      color: "#EA580C",
      appearance: "Dark continuous patches separated by thinner oil"
    },
    {
      code: "Bonn Code 5",
      name: "Heavy Emulsion Core",
      thicknessRange: "> 200 µm",
      areaPercent: 3,
      volumePercent: 50,
      areaKm2: +(totalAreaKm2 * 0.03).toFixed(2),
      volumeBbls: Math.round(totalVolumeBbls * 0.50),
      color: "#7F1D1D",
      appearance: "Viscous brown/black continuous chocolate mousse"
    }
  ];
}

// ==========================================
// FEATURE 9: MONTE CARLO PROBABILISTIC TRAJECTORY ENSEMBLE
// ==========================================
export function generateMonteCarloEnsemble(originLat, originLng, advection, hoursElapsed, iterations = 100) {
  const endpoints = [];
  const baseSpeed = advection.speedKn;
  const baseHeading = advection.headingDeg;

  for (let i = 0; i < iterations; i++) {
    const u1 = Math.max(1e-6, Math.random());
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    const perturbedHeading = baseHeading + z0 * 12.0;
    const perturbedSpeed = Math.max(0.1, baseSpeed * (1.0 + z1 * 0.18));

    const distNm = perturbedSpeed * hoursElapsed;
    const rad = perturbedHeading * DEG2RAD;

    const dLat = (Math.cos(rad) * distNm) / 60;
    const dLng = (Math.sin(rad) * distNm) / (60 * Math.cos(originLat * DEG2RAD));

    endpoints.push({
      lat: +(originLat + dLat).toFixed(5),
      lng: +(originLng + dLng).toFixed(5),
      distNm: +distNm.toFixed(1)
    });
  }

  const centerLat = endpoints.reduce((a, b) => a + b.lat, 0) / iterations;
  const centerLng = endpoints.reduce((a, b) => a + b.lng, 0) / iterations;

  const sortedByDist = [...endpoints].sort((a, b) => a.distNm - b.distNm);
  const p50Dist = sortedByDist[Math.floor(iterations * 0.50)].distNm;
  const p75Dist = sortedByDist[Math.floor(iterations * 0.75)].distNm;
  const p95Dist = sortedByDist[Math.floor(iterations * 0.95)].distNm;

  function createConfidencePolygon(halfAngleDeg, distanceNm) {
    const radCenter = baseHeading * DEG2RAD;
    const radLeft = (baseHeading - halfAngleDeg) * DEG2RAD;
    const radRight = (baseHeading + halfAngleDeg) * DEG2RAD;

    const ptCenter = {
      lat: +(originLat + (Math.cos(radCenter) * distanceNm) / 60).toFixed(5),
      lng: +(originLng + (Math.sin(radCenter) * distanceNm) / (60 * Math.cos(originLat * DEG2RAD))).toFixed(5)
    };
    const ptLeft = {
      lat: +(originLat + (Math.cos(radLeft) * distanceNm) / 60).toFixed(5),
      lng: +(originLng + (Math.sin(radLeft) * distanceNm) / (60 * Math.cos(originLat * DEG2RAD))).toFixed(5)
    };
    const ptRight = {
      lat: +(originLat + (Math.cos(radRight) * distanceNm) / 60).toFixed(5),
      lng: +(originLng + (Math.sin(radRight) * distanceNm) / (60 * Math.cos(originLat * DEG2RAD))).toFixed(5)
    };

    return [
      [originLat, originLng],
      [ptLeft.lat, ptLeft.lng],
      [ptCenter.lat, ptCenter.lng],
      [ptRight.lat, ptRight.lng],
      [originLat, originLng]
    ];
  }

  return {
    iterations,
    samplePoints: endpoints.slice(0, 30),
    cone50: createConfidencePolygon(8, p50Dist),
    cone75: createConfidencePolygon(14, p75Dist),
    cone95: createConfidencePolygon(22, p95Dist),
    stats: {
      p50Dist,
      p75Dist,
      p95Dist,
      meanLat: +centerLat.toFixed(5),
      meanLng: +centerLng.toFixed(5)
    }
  };
}

// ==========================================
// FEATURE 10: MULTI-MILESTONE COMPARATIVE TABLE GENERATOR
// ==========================================
export function generateMilestonesComparison(caseData, getFullSimulationPhysicsState) {
  const milestoneKeys = ["T+0", "T+6", "T+12", "T+24", "T+48", "T+72"];
  return milestoneKeys.map(k => {
    const state = getFullSimulationPhysicsState(caseData, k);
    return {
      key: k,
      hours: state.hoursElapsed,
      lat: state.centroid.lat,
      lng: state.centroid.lng,
      distNm: state.centroid.distanceNm,
      areaKm2: state.morph.areaKm2,
      evaporated: state.weathering.evaporated,
      emulsified: state.weathering.emulsified,
      surface: state.weathering.surface,
      viscosityCst: state.weathering.viscosityCst,
      distToLeadVesselNm: state.distToLeadVesselNm,
      landfallRisk: state.landfallRiskPercent
    };
  });
}

// ==========================================
// FEATURE 11: MASS BALANCE TIMELINE KINETICS
// ==========================================
export function generateMassBalanceTimeline(totalSpillTons = 480, oilAssay = OIL_ASSAYS.arabian_light, dispersantActive = false) {
  const steps = [0, 3, 6, 12, 18, 24, 36, 48, 60, 72];
  return steps.map(h => {
    const evapFactor = oilAssay.evaporationRateFactor;
    const baseEvap = Math.min(45, (12 + (1 - Math.exp(-h / 16)) * 26) * evapFactor);
    const baseDisp = Math.min(25, (4 + (1 - Math.exp(-h / 28)) * 18));
    
    let chemDisp = 0;
    if (dispersantActive && h >= 12) {
      chemDisp = Math.min(32, Math.round((1 - Math.exp(-(h - 12) / 8)) * 32));
    }

    const evaporatedTons = Math.round(totalSpillTons * (baseEvap / 100));
    const dispersedTons = Math.round(totalSpillTons * (baseDisp / 100));
    const chemDispersedTons = Math.round(totalSpillTons * (chemDisp / 100));
    const surfaceTons = Math.max(20, totalSpillTons - evaporatedTons - dispersedTons - chemDispersedTons);
    const waterInEmulsionTons = Math.round(surfaceTons * (Math.min(70, (15 + (1 - Math.exp(-h / 20)) * 50) * oilAssay.emulsificationRateFactor) / 100));

    return {
      hour: h,
      label: `T+${h}h`,
      surfaceTons,
      evaporatedTons,
      dispersedTons,
      chemDispersedTons,
      waterInEmulsionTons,
      totalEmulsionTons: surfaceTons + waterInEmulsionTons
    };
  });
}

// ==========================================
// FEATURE 12: A/B SCENARIO COMPARATOR (UNMITIGATED VS MITIGATED)
// ==========================================
export function calculateScenarioComparison(currentState, unmitigatedState, activeCountermeasures) {
  const unmitigatedSurfaceTons = 310;
  let mitigatedSurfaceTons = unmitigatedSurfaceTons;
  let preventedShorelineTons = 0;
  let boomRecoveredTons = 0;
  let dispersantDegradedTons = 0;

  if (activeCountermeasures.boomsDeployed) {
    boomRecoveredTons = Math.round(unmitigatedSurfaceTons * 0.22);
    mitigatedSurfaceTons -= boomRecoveredTons;
  }
  if (activeCountermeasures.dispersantsApplied) {
    dispersantDegradedTons = Math.round(unmitigatedSurfaceTons * 0.38);
    mitigatedSurfaceTons -= dispersantDegradedTons;
  }

  preventedShorelineTons = boomRecoveredTons + dispersantDegradedTons;
  const reductionPercent = Math.round(((unmitigatedSurfaceTons - mitigatedSurfaceTons) / unmitigatedSurfaceTons) * 100);

  return {
    unmitigatedSurfaceTons,
    mitigatedSurfaceTons,
    boomRecoveredTons,
    dispersantDegradedTons,
    preventedShorelineTons,
    reductionPercent
  };
}

// ==========================================
// FEATURE 13: EMERGENCY FLEET DISPATCH OPTIMIZER
// ==========================================
export const RESPONSE_FLEET = [
  {
    id: "icgs_samudra_prahari",
    name: "ICGS Samudra Prahari (Pollution Control Vessel)",
    port: "Mormugao Port (Goa)",
    speedKn: 21.0,
    baseCoords: { lat: 15.41, lng: 73.80 },
    skimmerCapacityTonsHr: 300,
    boomLengthM: 1200,
    type: "Heavy Dedicated PCV"
  },
  {
    id: "fpv_kanaklata_barua",
    name: "ICGS Kanaklata Barua (Fast Patrol Vessel)",
    port: "Karwar Naval Base",
    speedKn: 32.0,
    baseCoords: { lat: 14.80, lng: 74.12 },
    skimmerCapacityTonsHr: 75,
    boomLengthM: 400,
    type: "Rapid Interceptor FPV"
  },
  {
    id: "osv_ocean_guardian",
    name: "OSV Ocean Guardian (Offshore Skimming Barge)",
    port: "Mumbai Offshore Base",
    speedKn: 12.5,
    baseCoords: { lat: 18.92, lng: 72.84 },
    skimmerCapacityTonsHr: 500,
    boomLengthM: 2500,
    type: "High-Capacity Skimming Barge"
  },
  {
    id: "aerial_c130_sortie",
    name: "Indian Coast Guard Dornier 228 (Aerosol Dispersant)",
    port: "Dabolim Air Station (Goa)",
    speedKn: 190.0,
    baseCoords: { lat: 15.38, lng: 73.83 },
    skimmerCapacityTonsHr: 0,
    dispersantPayloadLiters: 4000,
    type: "Aerial Dispersant Sortie"
  }
];

export function calculateFleetTransitTimes(centroidLat, centroidLng) {
  return RESPONSE_FLEET.map(vessel => {
    const dLat = (centroidLat - vessel.baseCoords.lat) * 60;
    const dLng = (centroidLng - vessel.baseCoords.lng) * 60 * Math.cos(centroidLat * DEG2RAD);
    const distNm = +(Math.sqrt(dLat * dLat + dLng * dLng)).toFixed(1);
    const transitHours = +(distNm / vessel.speedKn).toFixed(1);
    const etaMinutes = Math.round(transitHours * 60);

    return {
      ...vessel,
      distNm,
      transitHours,
      etaDesc: transitHours >= 1 ? `${Math.floor(transitHours)}h ${Math.round((transitHours % 1) * 60)}m` : `${etaMinutes}m`
    };
  });
}

// ==========================================
// FEATURE 14: IMO TIER 1/2/3 CLASSIFICATION & COMPLIANCE
// ==========================================
export function evaluateIMOTierCompliance(spillVolumeTons = 480) {
  let tier = "TIER 2";
  let tierLevel = 2;
  let responseJurisdiction = "National / Regional Maritime Board (Indian Coast Guard / MMD)";
  let notificationWindowHours = 2;

  if (spillVolumeTons < 50) {
    tier = "TIER 1 (LOCAL)";
    tierLevel = 1;
    responseJurisdiction = "Local Port Authority & Facility Operators";
    notificationWindowHours = 4;
  } else if (spillVolumeTons > 700) {
    tier = "TIER 3 (MAJOR INTERNATIONAL)";
    tierLevel = 3;
    responseJurisdiction = "National Disaster Management Authority (NDMA) + International ITOPF / IOPC Funds";
    notificationWindowHours = 1;
  }

  const checklist = [
    { rule: "MARPOL 73/78 Annex I Reg 37", item: "SOPEP (Shipboard Oil Pollution Emergency Plan) Activation", status: "MANDATORY - ACTIVE" },
    { rule: "OPRC 1990 Convention", item: "Immediate Coastal State Notification to DG Shipping & Coast Guard MRCC", status: "TRANSMITTED" },
    { rule: "Civil Liability Convention (CLC 1992)", item: "P&I Club Marine Insurance Liability Reserve Declaration", status: "FILED" },
    { rule: "ITOPF Rapid Assessment", item: "Aerial Surveillance Validation & Shoreline Defense Boom Plan", status: "DEPLOYED" }
  ];

  return {
    tier,
    tierLevel,
    responseJurisdiction,
    notificationWindowHours,
    checklist
  };
}

// ==========================================
// FEATURE 15: ATMOSPHERIC VOC TOXICITY & DOWNWIND VAPOR HAZARD
// ==========================================
export function calculateVOCHazardZone(centroidLat, centroidLng, windSpeedKn, windFromDeg, oilAssay) {
  const downwindHeading = (windFromDeg + 180) % 360;
  const rad = downwindHeading * DEG2RAD;

  const hazardLengthNm = +(3.2 * oilAssay.evaporationRateFactor * Math.sqrt(Math.max(1, windSpeedKn / 10))).toFixed(1);
  const hazardWidthNm = +(hazardLengthNm * 0.42).toFixed(1);

  const endLat = +(centroidLat + (Math.cos(rad) * hazardLengthNm) / 60).toFixed(5);
  const endLng = +(centroidLng + (Math.sin(rad) * hazardLengthNm) / (60 * Math.cos(centroidLat * DEG2RAD))).toFixed(5);

  return {
    downwindHeading,
    hazardLengthNm,
    hazardWidthNm,
    endLat,
    endLng,
    primaryToxicants: "Benzene, Toluene, Ethylbenzene, Xylene (BTEX) & Hydrogen Sulfide",
    idlhExclusionBufferNm: +(hazardLengthNm * 1.2).toFixed(1),
    respiratorySafetyStatus: "Respirator Mask / SCBA Mandatory for Response Vessels within 4 NM downwind"
  };
}

// ==========================================
// FEATURE 16: 3D WATER COLUMN DROPLET DISPERSION (DELVIGNE-SWEENEY)
// ==========================================
export function calculateDropletDynamics(waveHeightM, oilViscosityCst) {
  const d50Microns = Math.max(15, Math.round(180 * Math.pow(oilViscosityCst / 20, 0.4) / Math.pow(Math.max(0.2, waveHeightM), 1.2)));
  const buoyantRiseSpeedCmS = +(0.002 * Math.pow(d50Microns / 50, 2)).toFixed(3);

  let behavior = "Permament Suspension in Water Column";
  if (d50Microns > 250) {
    behavior = "Rapid Resurfacing to Slick (< 15 mins)";
  } else if (d50Microns > 70) {
    behavior = "Transient Entrainment (Dynamic Resurfacing)";
  }

  return {
    d50Microns,
    buoyantRiseSpeedCmS,
    behavior,
    entrainedFractionPercent: Math.min(85, Math.round(45 * (waveHeightM / 1.5)))
  };
}

// ==========================================
// FEATURE 19: GIS EXPORT (GeoJSON, CSV)
// ==========================================
export function exportSimulationGeoJSON(simState, caseData) {
  const geojson = {
    type: "FeatureCollection",
    metadata: {
      platform: "MarineSight AI Maritime Surveillance",
      incidentId: caseData.incidentId,
      timestamp: simState.timestampKey,
      exportedAt: new Date().toISOString(),
      advectionHeadingDeg: simState.advection.headingDeg,
      advectionSpeedKn: simState.advection.speedKn
    },
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [simState.centroid.lng, simState.centroid.lat]
        },
        properties: {
          name: "Slick Centroid",
          distanceNm: simState.centroid.distanceNm,
          hoursElapsed: simState.hoursElapsed
        }
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            simState.morph.outerPolygon.map(p => [p.lng, p.lat]).concat([[simState.morph.outerPolygon[0].lng, simState.morph.outerPolygon[0].lat]])
          ]
        },
        properties: {
          name: "Outer Slick Extent",
          areaKm2: simState.morph.areaKm2,
          perimeterKm: simState.morph.perimeterKm
        }
      }
    ]
  };

  simState.particles.slice(0, 300).forEach(p => {
    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [p.lng, p.lat]
      },
      properties: {
        id: p.id,
        type: p.type,
        color: p.color
      }
    });
  });

  return JSON.stringify(geojson, null, 2);
}

export function exportSimulationCSV(simState, caseData) {
  const rows = [
    ["Particle_ID", "Latitude", "Longitude", "Type", "Hours_Elapsed", "Advection_Heading_Deg", "Advection_Speed_Kn"]
  ];

  simState.particles.forEach((p, idx) => {
    rows.push([
      `P_${idx}`,
      p.lat,
      p.lng,
      p.type,
      simState.hoursElapsed,
      simState.advection.headingDeg.toFixed(1),
      simState.advection.speedKn.toFixed(2)
    ]);
  });

  return rows.map(r => r.join(",")).join("\n");
}

// ==========================================
// FEATURE 20: TACTICAL WEB AUDIO & VOICE SPEECH SYNTHESIS
// ==========================================
let audioCtx = null;

export function playTacticalPing(type = "radar") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === "radar") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === "alert") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.setValueAtTime(780, audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } else if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    }
  } catch (e) {
    // Audio Context blocked or not allowed
  }
}

export function speakVoiceAdvisory(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("SpeechSynthesis error:", e);
  }
}

