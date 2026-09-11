/**
 * Maritime Geospatial Calculation Utilities
 * High-precision spherical geodesy for CPA, distances, and bearings
 */

const EARTH_RADIUS_KM = 6371.0;
const NM_TO_KM = 1.852;

export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Calculates great-circle distance between two points via Haversine formula
 * @returns {number} Distance in kilometers
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const rLat1 = degreesToRadians(lat1);
  const rLat2 = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function haversineDistanceNm(lat1, lon1, lat2, lon2) {
  return haversineDistanceKm(lat1, lon1, lat2, lon2) / NM_TO_KM;
}

/**
 * Calculate forward initial bearing from point 1 to point 2
 * @returns {number} Bearing in degrees [0, 360)
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const rLat1 = degreesToRadians(lat1);
  const rLat2 = degreesToRadians(lat2);
  const dLon = degreesToRadians(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(rLat2);
  const x = Math.cos(rLat1) * Math.sin(rLat2) -
            Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLon);
  const brng = Math.atan2(y, x);
  return (radiansToDegrees(brng) + 360) % 360;
}

/**
 * Calculates destination point given distance (km) and bearing (degrees)
 */
export function destinationPoint(lat, lon, distanceKm, bearingDeg) {
  const rLat = degreesToRadians(lat);
  const rLon = degreesToRadians(lon);
  const rBearing = degreesToRadians(bearingDeg);
  const angularDist = distanceKm / EARTH_RADIUS_KM;

  const destLat = Math.asin(
    Math.sin(rLat) * Math.cos(angularDist) +
    Math.cos(rLat) * Math.sin(angularDist) * Math.cos(rBearing)
  );

  const destLon = rLon + Math.atan2(
    Math.sin(rBearing) * Math.sin(angularDist) * Math.cos(rLat),
    Math.cos(angularDist) - Math.sin(rLat) * Math.sin(destLat)
  );

  return {
    lat: Number(radiansToDegrees(destLat).toFixed(5)),
    lng: Number(radiansToDegrees(destLon).toFixed(5))
  };
}

/**
 * Calculate Closest Point of Approach (CPA) between target point and vessel trajectory
 */
export function calculateCpa(targetPoint, trajectoryPoints) {
  if (!trajectoryPoints || trajectoryPoints.length === 0) return { minDistanceNm: 999 };

  let minDistanceNm = Infinity;
  let closestPoint = null;

  for (const pt of trajectoryPoints) {
    const dist = haversineDistanceNm(targetPoint.lat, targetPoint.lng, pt.lat, pt.lng);
    if (dist < minDistanceNm) {
      minDistanceNm = dist;
      closestPoint = pt;
    }
  }

  return {
    minDistanceNm: Number(minDistanceNm.toFixed(2)),
    closestPoint
  };
}

