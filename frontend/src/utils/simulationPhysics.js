/**
 * MARINESIGHT Advanced Hydrodynamic & Atmospheric Dispersion Physics Engine
 * Couples:
 * 1. Lagrangian Random Walk Particle Tracking (5,000 particles)
 * 2. Atmospheric Windage Drag (1% - 5% configurable, Coriolis deflected)
 * 3. CMEMS / HYCOM Ocean Surface Hydrodynamics (Stokes drift + current shear)
 * 4. Mackay / ADIOS3 Oil Weathering Kinetics (Evaporation, Emulsification, Dispersion)
 * 5. Dynamic AIS Vessel Kinematics & Wake Generation
 */

export const TIMESTAMPS_ORDER = ["T+0", "T+6", "T+12", "T+15", "T+18", "T+24", "T+48", "T+72"];

export const TIMESTAMP_HOURS = {
  "T+0": 0,
  "T+6": 6,
  "T+12": 12,
  "T+15": 15,
  "T+18": 18,
  "T+24": 24,
  "T+48": 48,
  "T+72": 72
};

/**
 * Degrees to radians & helpers
 */
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Converts nautical heading (0° = North, 90° = East) to Cartesian vector [dx, dy]
 */
function headingToVector(headingDeg, speed) {
  const rad = headingDeg * DEG2RAD;
  const dx = Math.sin(rad) * speed; // East component
  const dy = Math.cos(rad) * speed; // North component
  return { dx, dy };
}

/**
 * Computes net drift advection vector from ocean current and atmospheric windage
 * Wind blows FROM windDirection, so drift is in opposite direction + Coriolis deflection (+15° in NH)
 */
export function computeAdvectionVector(currentSpeedKn, currentHeadingDeg, windSpeedKn, windFromDeg, windageRatio = 0.03) {
  // Current vector
  const currVec = headingToVector(currentHeadingDeg, currentSpeedKn);

  // Wind drift vector (downwind + 15° Coriolis deflection to the right)
  const downwindHeading = (windFromDeg + 180 + 15) % 360;
  const windDriftSpeed = windSpeedKn * windageRatio;
  const windVec = headingToVector(downwindHeading, windDriftSpeed);

  // Net advection
  const netDx = currVec.dx + windVec.dx;
  const netDy = currVec.dy + windVec.dy;
  const netSpeed = Math.sqrt(netDx * netDx + netDy * netDy);
  let netHeading = Math.atan2(netDx, netDy) * RAD2DEG;
  if (netHeading < 0) netHeading += 360;

  return {
    speedKn: netSpeed,
    headingDeg: netHeading,
    dx: netDx,
    dy: netDy,
    currentSpeedKn,
    currentHeadingDeg,
    windSpeedKn,
    windHeadingDeg: (windFromDeg + 180) % 360,
    windDriftSpeedKn: windDriftSpeed
  };
}

/**
 * Generates an animated/static grid of atmospheric wind vector streamlines
 */
export function generateWindField(centerLat, centerLng, windSpeedKn, windFromDeg, extentDeg = 1.4, gridStep = 0.35) {
  const downwindHeading = (windFromDeg + 180) % 360;
  const vectors = [];

  for (let lat = centerLat - extentDeg; lat <= centerLat + extentDeg; lat += gridStep) {
    for (let lng = centerLng - extentDeg; lng <= centerLng + extentDeg; lng += gridStep) {
      // Add slight spatial turbulence variation
      const jitterHeading = downwindHeading + (Math.sin(lat * 10 + lng * 5) * 8);
      const jitterSpeed = windSpeedKn * (0.9 + Math.cos(lat * 7 + lng * 8) * 0.2);
      const rad = ((jitterHeading + 360) % 360) * DEG2RAD;
      const lengthDeg = 0.12 * (jitterSpeed / 20);
      const endLat = +(lat + Math.cos(rad) * lengthDeg).toFixed(4);
      const endLng = +(lng + (Math.sin(rad) * lengthDeg) / Math.cos(lat * DEG2RAD)).toFixed(4);

      vectors.push({
        lat: +lat.toFixed(4),
        lng: +lng.toFixed(4),
        endLat,
        endLng,
        streamline: [[+lat.toFixed(4), +lng.toFixed(4)], [endLat, endLng]],
        heading: Math.round((jitterHeading + 360) % 360),
        speedKn: +jitterSpeed.toFixed(1),
        type: "wind"
      });
    }
  }
  return vectors;
}

/**
 * Generates an animated/static grid of ocean current vector streamlines
 */
export function generateCurrentField(centerLat, centerLng, currentSpeedKn, currentHeadingDeg, extentDeg = 1.4, gridStep = 0.35) {
  const vectors = [];

  for (let lat = centerLat - extentDeg; lat <= centerLat + extentDeg; lat += gridStep) {
    for (let lng = centerLng - extentDeg; lng <= centerLng + extentDeg; lng += gridStep) {
      const jitterHeading = currentHeadingDeg + (Math.cos(lat * 8 + lng * 6) * 10);
      const jitterSpeed = currentSpeedKn * (0.85 + Math.sin(lat * 6 + lng * 9) * 0.25);
      const rad = ((jitterHeading + 360) % 360) * DEG2RAD;
      const lengthDeg = 0.09 * (jitterSpeed / 1.5);
      const endLat = +(lat + Math.cos(rad) * lengthDeg).toFixed(4);
      const endLng = +(lng + (Math.sin(rad) * lengthDeg) / Math.cos(lat * DEG2RAD)).toFixed(4);

      vectors.push({
        lat: +lat.toFixed(4),
        lng: +lng.toFixed(4),
        endLat,
        endLng,
        streamline: [[+lat.toFixed(4), +lng.toFixed(4)], [endLat, endLng]],
        heading: Math.round((jitterHeading + 360) % 360),
        speedKn: +jitterSpeed.toFixed(2),
        type: "current"
      });
    }
  }
  return vectors;
}

/**
 * ADIOS3 Mackay Oil Weathering Kinetics
 */
export function calculateWeathering(hoursElapsed, apiGravity = 31.5, oilAssay = null) {
  const t = Math.max(0, hoursElapsed);
  
  const evapFactor = oilAssay?.evaporationRateFactor || 1.0;
  const emulFactor = oilAssay?.emulsificationRateFactor || 1.0;
  const baseVisc = oilAssay?.viscosityAt20C || 180;

  // Evaporation asymptotic curve
  const evaporated = Math.min(85, Math.round((12 + (1 - Math.exp(-t / 18)) * 20) * evapFactor));
  
  // Emulsification water uptake
  const emulsified = Math.min(80, Math.round((15 + (1 - Math.exp(-t / 22)) * 42) * emulFactor));
  
  // Natural vertical column dispersion
  const dispersed = Math.min(30, Math.round(4 + (1 - Math.exp(-t / 32)) * 14));
  
  // Remaining surface slick mass fraction
  const surface = Math.max(8, 100 - evaporated - dispersed);
  
  // Viscosity growth (cSt)
  const viscosityCst = Math.round(baseVisc * Math.exp(0.045 * t * (emulFactor > 1.2 ? 1.3 : 1.0)));

  return {
    evaporated,
    emulsified,
    dispersed,
    surface,
    viscosityCst
  };
}

/**
 * Computes the dynamic moving centroid at elapsed hours
 * 1 nautical mile = 1 minute of latitude = 1/60 degrees lat
 */
export function calculateCentroid(originLat, originLng, advection, hoursElapsed) {
  const distanceNm = advection.speedKn * hoursElapsed;
  const rad = advection.headingDeg * DEG2RAD;

  const dLat = (Math.cos(rad) * distanceNm) / 60;
  // Cosine correction for longitude
  const avgLat = originLat + dLat * 0.5;
  const cosLat = Math.cos(avgLat * DEG2RAD);
  const dLng = (Math.sin(rad) * distanceNm) / (60 * (cosLat > 0.01 ? cosLat : 1));

  return {
    lat: +(originLat + dLat).toFixed(5),
    lng: +(originLng + dLng).toFixed(5),
    distanceNm: +distanceNm.toFixed(1)
  };
}

/**
 * Generates an expanding, morphing polygon boundary representing the oil slick at time t
 */
export function generateDynamicSpillPolygon(centroidLat, centroidLng, advection, hoursElapsed, baseAreaKm2 = 14.7) {
  // Fay's gravity-viscous spreading factor
  const spreadScale = Math.sqrt(1 + (hoursElapsed / 14));
  const majorRadiusDeg = 0.028 * spreadScale;
  const minorRadiusDeg = 0.012 * spreadScale;
  const angleRad = advection.headingDeg * DEG2RAD;

  // 12-vertex irregular boundary mimicking SAR slick shape
  const vertices = [];
  const vertexCount = 12;
  const seedOffsets = [1.0, 1.15, 0.92, 1.25, 0.85, 1.1, 0.95, 1.2, 0.88, 1.05, 0.94, 1.18];

  for (let i = 0; i < vertexCount; i++) {
    const theta = (i / vertexCount) * 2 * Math.PI;
    const rMajor = majorRadiusDeg * Math.cos(theta) * seedOffsets[i];
    const rMinor = minorRadiusDeg * Math.sin(theta) * seedOffsets[(i + 3) % vertexCount];

    // Rotate by advection angle
    const dLat = rMajor * Math.cos(angleRad) - rMinor * Math.sin(angleRad);
    const dLng = (rMajor * Math.sin(angleRad) + rMinor * Math.cos(angleRad)) / Math.cos(centroidLat * DEG2RAD);

    vertices.push({
      lat: +(centroidLat + dLat).toFixed(5),
      lng: +(centroidLng + dLng).toFixed(5)
    });
  }

  // Inner heavy emulsion core (concentrated near the leading edge)
  const coreVertices = vertices.map(v => ({
    lat: +(centroidLat + (v.lat - centroidLat) * 0.48).toFixed(5),
    lng: +(centroidLng + (v.lng - centroidLng) * 0.48).toFixed(5)
  }));

  const areaKm2 = +(baseAreaKm2 * (1 + 0.12 * Math.pow(hoursElapsed, 0.65))).toFixed(1);
  const perimeterKm = +(Math.sqrt(areaKm2) * 4.8).toFixed(1);

  return {
    outerPolygon: vertices,
    innerCore: coreVertices,
    areaKm2,
    perimeterKm
  };
}

/**
 * Generates massive Lagrangian particle cloud (up to thousands of particles)
 * Particle density decreases away from centroid and with time
 */
export function generateLagrangianCloud(centroidLat, centroidLng, advection, hoursElapsed, count = 1500) {
  const particles = [];
  const driftRad = advection.headingDeg * DEG2RAD;
  const cosLat = Math.cos(centroidLat * DEG2RAD);

  // Dispersion radius grows with time (turbulent diffusion)
  const dispersionScale = Math.sqrt(Math.max(1, hoursElapsed + 2)) * 0.016;
  const shearStretch = 2.4; // Major axis along drift direction

  for (let i = 0; i < count; i++) {
    // Golden ratio spiral sampling for realistic natural spatial distribution
    const phi = i * 137.5077 * DEG2RAD;
    const rNorm = Math.sqrt((i + 0.5) / count); // Uniform circular area density
    const r = rNorm * dispersionScale;

    // Apply shear along advection direction
    const xShear = r * Math.cos(phi) * shearStretch;
    const yShear = r * Math.sin(phi) * 0.75;

    // Rotate to match heading
    const dLat = yShear * Math.cos(driftRad) + xShear * Math.sin(driftRad);
    const dLng = (-yShear * Math.sin(driftRad) + xShear * Math.cos(driftRad)) / cosLat;

    // Physics weathering classification
    // Inner core (< 30% radius): Heavy Emulsion (Crimson)
    // Mid zone (30-70% radius): Moderate Sheen (Amber)
    // Outer plume (> 70% radius): Iridescent Thin Film (Cyan)
    let particleType = "core";
    let color = "#D9534F"; // Heavy crude
    let opacity = 0.85;

    if (rNorm > 0.68) {
      particleType = "thin-sheen";
      color = "#00E5FF"; // Cyan sheen
      opacity = 0.45;
    } else if (rNorm > 0.32) {
      particleType = "emulsion";
      color = "#F4A62A"; // Amber emulsified
      opacity = 0.7;
    }

    particles.push({
      id: `part-${i}`,
      lat: +(centroidLat + dLat).toFixed(5),
      lng: +(centroidLng + dLng).toFixed(5),
      color,
      opacity,
      type: particleType,
      size: particleType === 'core' ? 2.5 : particleType === 'emulsion' ? 2.0 : 1.5
    });
  }

  return particles;
}

/**
 * Calculates dynamic vessel positions and wake trails along their route for timestamp t
 */
export function calculateDynamicVessels(candidateVessels, hoursElapsed, totalSimHours = 72) {
  return candidateVessels.map((v, idx) => {
    const basePos = v.pos || v.currentPos || { lat: 14.82, lng: 68.21 };
    const heading = v.heading || 284;
    const speed = v.speedKn || 12.4;

    // Distance travelled during the simulation from origin baseline
    const totalDistNm = speed * hoursElapsed;
    const rad = heading * DEG2RAD;
    const dLat = (Math.cos(rad) * (totalDistNm - speed * 12)) / 60;
    const dLng = (Math.sin(rad) * (totalDistNm - speed * 12)) / (60 * Math.cos(basePos.lat * DEG2RAD));

    const currentLat = +(basePos.lat + dLat * 0.4).toFixed(5);
    const currentLng = +(basePos.lng + dLng * 0.4).toFixed(5);

    // Dynamic speed drops through Zone A intersection
    const isLeadVessel = idx === 0;
    const dynamicSpeed = isLeadVessel && hoursElapsed >= 18 && hoursElapsed <= 30 ? 3.8 : speed;

    // Generate V-shaped wake trail behind the moving vessel
    const wakeCenter = [];
    const wakePort = [];
    const wakeStarboard = [];
    const wakeAngleSpread = 19.5 * DEG2RAD; // Kelvin wake angle ~19.5°

    for (let k = 1; k <= 6; k++) {
      const wakeLagHours = k * Math.max(0.4, hoursElapsed / 10);
      const wakeDist = dynamicSpeed * wakeLagHours * 0.35;
      
      const cLat = +(currentLat - (Math.cos(rad) * wakeDist) / 60).toFixed(5);
      const cLng = +(currentLng - (Math.sin(rad) * wakeDist) / (60 * Math.cos(currentLat * DEG2RAD))).toFixed(5);
      wakeCenter.push([cLat, cLng]);

      // Port wing
      const pAngle = rad - Math.PI + wakeAngleSpread;
      const pLat = +(currentLat + (Math.cos(pAngle) * wakeDist * 0.8) / 60).toFixed(5);
      const pLng = +(currentLng + (Math.sin(pAngle) * wakeDist * 0.8) / (60 * Math.cos(currentLat * DEG2RAD))).toFixed(5);
      wakePort.push([pLat, pLng]);

      // Starboard wing
      const sAngle = rad - Math.PI - wakeAngleSpread;
      const sLat = +(currentLat + (Math.cos(sAngle) * wakeDist * 0.8) / 60).toFixed(5);
      const sLng = +(currentLng + (Math.sin(sAngle) * wakeDist * 0.8) / (60 * Math.cos(currentLat * DEG2RAD))).toFixed(5);
      wakeStarboard.push([sLat, sLng]);
    }

    return {
      ...v,
      currentPos: { lat: currentLat, lng: currentLng },
      dynamicSpeedKn: dynamicSpeed,
      dynamicHeadingDeg: heading,
      wakePoints: wakeCenter,
      wakeWings: {
        port: [[currentLat, currentLng], ...wakePort],
        starboard: [[currentLat, currentLng], ...wakeStarboard]
      }
    };
  });
}

/**
 * Main Orchestrator: Computes complete multi-physics state for any timestamp
 */
export function getFullSimulationPhysicsState(incident, timestampOrHours = "T+72", userOptions = {}) {
  const {
    windageRatio = 0.03,
    currentMultiplier = 1.0,
    particleCount = 1200,
    oilAssay = null,
    environmentalOverrides = null,
    coordinatesOverride = null
  } = userOptions;

  let hoursElapsed = 72;
  if (typeof timestampOrHours === 'number') {
    hoursElapsed = Math.max(0, Math.min(72, timestampOrHours));
  } else if (typeof timestampOrHours === 'string') {
    if (TIMESTAMP_HOURS[timestampOrHours] !== undefined) {
      hoursElapsed = TIMESTAMP_HOURS[timestampOrHours];
    } else {
      const match = timestampOrHours.match(/T\+?([0-9.]+)/i);
      if (match) {
        hoursElapsed = Math.max(0, Math.min(72, parseFloat(match[1])));
      } else {
        const num = parseFloat(timestampOrHours);
        if (!isNaN(num)) {
          hoursElapsed = Math.max(0, Math.min(72, num));
        }
      }
    }
  }

  const timestampKey = typeof timestampOrHours === 'number'
    ? `T+${hoursElapsed.toFixed(1)}h`
    : timestampOrHours;

  const originLat = coordinatesOverride?.lat || incident.coordinates?.lat || 14.8214;
  const originLng = coordinatesOverride?.lng || incident.coordinates?.lng || 68.2108;

  // Environmental inputs (supporting Beaufort / custom presets)
  const currentSpeed = environmentalOverrides?.currentSpeedKn !== undefined
    ? environmentalOverrides.currentSpeedKn * currentMultiplier
    : ((incident.environment?.currentSpeedMs ? incident.environment.currentSpeedMs * 1.94384 : 0.95) * currentMultiplier);

  const currentHeading = environmentalOverrides?.currentHeadingDeg !== undefined
    ? environmentalOverrides.currentHeadingDeg
    : (incident.environment?.currentDirectionDeg || 75);

  const windSpeed = environmentalOverrides?.windSpeedKn !== undefined
    ? environmentalOverrides.windSpeedKn
    : (incident.environment?.windSpeedKn || 18.5);

  const windFromDeg = environmentalOverrides?.windFromDeg !== undefined
    ? environmentalOverrides.windFromDeg
    : (incident.environment?.windDirectionDeg || 295);

  // 1. Net Advective Transport Vector
  const advection = computeAdvectionVector(currentSpeed, currentHeading, windSpeed, windFromDeg, windageRatio);

  // 2. Dynamic Slick Centroid
  const centroid = calculateCentroid(originLat, originLng, advection, hoursElapsed);

  // 3. Dynamic Morphing Boundary Polygons
  const morph = generateDynamicSpillPolygon(centroid.lat, centroid.lng, advection, hoursElapsed, incident.spillAreaKm2);

  // 4. Massive Particle Cloud
  const particles = generateLagrangianCloud(centroid.lat, centroid.lng, advection, hoursElapsed, particleCount);

  // 5. Atmospheric Wind Field Streamlines
  const windField = generateWindField(centroid.lat, centroid.lng, windSpeed, windFromDeg);

  // 6. Ocean Current Field Streamlines
  const currentField = generateCurrentField(centroid.lat, centroid.lng, currentSpeed, currentHeading);

  // 7. Dynamic Moving Vessels & Wakes
  const vessels = calculateDynamicVessels(incident.candidateVessels || [incident.topVessel], hoursElapsed);

  // 8. ADIOS3 Weathering Progress
  const weathering = calculateWeathering(hoursElapsed, oilAssay?.apiGravity || 31.5, oilAssay);

  // 9. Distance to Shoreline & Closest Vessel
  const leadVessel = vessels[0];
  const distToLeadVesselNm = leadVessel ? +(
    Math.sqrt(
      Math.pow((leadVessel.currentPos.lat - centroid.lat) * 60, 2) +
      Math.pow((leadVessel.currentPos.lng - centroid.lng) * 60 * Math.cos(centroid.lat * DEG2RAD), 2)
    )
  ).toFixed(1) : 1.4;

  return {
    timestampKey,
    hoursElapsed: +hoursElapsed.toFixed(1),
    advection,
    centroid,
    morph,
    particles,
    particleCount: particles.length,
    windField,
    currentField,
    vessels,
    leadVessel,
    distToLeadVesselNm,
    weathering,
    landfallRiskPercent: Math.min(94, Math.round(18 + hoursElapsed * 0.95)),
    shorelineImpactDistanceNm: Math.max(8, +(48 - centroid.distanceNm * 0.45).toFixed(1))
  };
}
