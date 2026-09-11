// High-resolution forensic telemetry and vessel profiles for Page 11 Trajectory Reconstruction

export const SUSPECT_VESSELS = [
  {
    id: "v1",
    name: "MT Ocean Pioneer",
    mmsi: "419001248",
    imo: "9876543",
    callsign: "3FFA9",
    flag: "Panama",
    type: "Crude Oil Tanker (Aframax)",
    dwt: 114800,
    lengthM: 249,
    beamM: 44,
    draftM: 14.8,
    cargo: "Basrah Heavy Crude (98,400 MT)",
    status: "HIGH PRIORITY SUSPECT",
    riskScore: 87,
    anomalyColor: "#D9534F",
    blackoutDurationMin: 38,
    missingPings: 174,
    spillCpaNm: 1.4,
    interceptionUtc: "22:42 UTC",
    speedDropPercent: 67,
    reconstructionConfidence: 94.2,
    meanErrorNm: 0.18,
    aisClass: "Class A (ITU-R M.1371-5)",
    destination: "Vadinar Terminal",
    operator: "Titan Maritime Holdings Ltd."
  },
  {
    id: "v2",
    name: "MV Sea Horizon",
    mmsi: "352001928",
    imo: "9741258",
    callsign: "ELXR4",
    flag: "Liberia",
    type: "Capesize Bulk Carrier",
    dwt: 178500,
    lengthM: 292,
    beamM: 45,
    draftM: 12.2,
    cargo: "Iron Ore Pellets",
    status: "SECONDARY INTEREST",
    riskScore: 64,
    anomalyColor: "#F4A62A",
    blackoutDurationMin: 14,
    missingPings: 62,
    spillCpaNm: 4.8,
    interceptionUtc: "23:15 UTC",
    speedDropPercent: 24,
    reconstructionConfidence: 86.8,
    meanErrorNm: 0.35,
    aisClass: "Class A",
    destination: "Jawaharlal Nehru Port (JNPT)",
    operator: "Horizon Pacific Bulk Corp."
  },
  {
    id: "v3",
    name: "Pacific Voyager",
    mmsi: "636019822",
    imo: "9632587",
    callsign: "V7AZ3",
    flag: "Marshall Islands",
    type: "VLCC (Very Large Crude Carrier)",
    dwt: 318000,
    lengthM: 333,
    beamM: 60,
    draftM: 21.4,
    cargo: "Arabian Light Crude (Full Ballast)",
    status: "LOW RISK MONITOR",
    riskScore: 32,
    anomalyColor: "#1597C7",
    blackoutDurationMin: 0,
    missingPings: 0,
    spillCpaNm: 11.2,
    interceptionUtc: "N/A",
    speedDropPercent: 4,
    reconstructionConfidence: 98.9,
    meanErrorNm: 0.05,
    aisClass: "Class A",
    destination: "Sikka Terminal",
    operator: "TransGlobal VLCC Lines"
  },
  {
    id: "v4",
    name: "Chem Star",
    mmsi: "211084930",
    imo: "9541236",
    callsign: "DLYH",
    flag: "Germany",
    type: "Chemical / Products Tanker",
    dwt: 49990,
    lengthM: 182,
    beamM: 32,
    draftM: 11.0,
    cargo: "Industrial Methanol",
    status: "CLEAR / LOW RISK",
    riskScore: 18,
    anomalyColor: "#198754",
    blackoutDurationMin: 0,
    missingPings: 0,
    spillCpaNm: 18.6,
    interceptionUtc: "N/A",
    speedDropPercent: 2,
    reconstructionConfidence: 99.4,
    meanErrorNm: 0.03,
    aisClass: "Class A",
    destination: "Kandla Port",
    operator: "Baltic Chemical Logistics"
  }
];

// Chronological forensic telemetry waypoints for MT Ocean Pioneer
export const TELEMETRY_POINTS = [
  { index: 1, time: "22:00:00 UTC", lat: 14.982, lng: 67.890, sog: 13.4, cog: 284, rot: 0.0, acc: 0.0, source: "Shore AIS (Goa Coastal Radar)", status: "observed", anomaly: "none" },
  { index: 2, time: "22:05:00 UTC", lat: 14.968, lng: 67.940, sog: 13.3, cog: 285, rot: 0.2, acc: -0.02, source: "Shore AIS", status: "observed", anomaly: "none" },
  { index: 3, time: "22:10:00 UTC", lat: 14.954, lng: 67.992, sog: 13.2, cog: 284, rot: -0.1, acc: -0.03, source: "Shore AIS", status: "observed", anomaly: "none" },
  { index: 4, time: "22:15:00 UTC", lat: 14.940, lng: 68.044, sog: 13.0, cog: 284, rot: 0.0, acc: -0.05, source: "Satellite AIS (Spire)", status: "observed", anomaly: "none" },
  { index: 5, time: "22:18:00 UTC", lat: 14.931, lng: 68.075, sog: 11.8, cog: 280, rot: -1.8, acc: -0.32, source: "Satellite AIS (Spire)", status: "observed", anomaly: "mild_decel" },
  { index: 6, time: "22:20:00 UTC", lat: 14.922, lng: 68.098, sog: 8.4, cog: 272, rot: -4.2, acc: -0.95, source: "Shore AIS", status: "observed", anomaly: "abrupt_deceleration" },
  { index: 7, time: "22:22:00 UTC", lat: 14.912, lng: 68.115, sog: 5.6, cog: 258, rot: -7.5, acc: -0.88, source: "Shore AIS", status: "observed", anomaly: "course_alteration" },
  { index: 8, time: "22:24:00 UTC", lat: 14.904, lng: 68.125, sog: 4.2, cog: 245, rot: -8.0, acc: -0.55, source: "Shore AIS (LAST CONTACT)", status: "blackout_start", anomaly: "ais_transponder_shutoff" },
  
  // 38-minute blackout gap: Bi-LSTM reconstructed points
  { index: 9, time: "22:28:00 UTC", lat: 14.891, lng: 68.140, sog: 3.9, cog: 236, rot: -2.1, acc: -0.08, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "blackout_transit" },
  { index: 10, time: "22:32:00 UTC", lat: 14.876, lng: 68.158, sog: 3.7, cog: 228, rot: -1.5, acc: -0.04, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "blackout_transit" },
  { index: 11, time: "22:36:00 UTC", lat: 14.860, lng: 68.175, sog: 3.6, cog: 220, rot: -1.8, acc: -0.02, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "loitering_in_gap" },
  { index: 12, time: "22:38:00 UTC", lat: 14.852, lng: 68.184, sog: 3.6, cog: 215, rot: -1.2, acc: 0.00, source: "Bi-LSTM + Sentinel-1 SAR Sync", status: "reconstructed", anomaly: "sar_kelvin_wake_match" },
  { index: 13, time: "22:42:00 UTC", lat: 14.835, lng: 68.201, sog: 3.8, cog: 210, rot: -0.5, acc: 0.05, source: "Bi-LSTM DeepRecon", status: "spill_intersection", anomaly: "spill_origin_cpa_1_4nm" },
  { index: 14, time: "22:46:00 UTC", lat: 14.819, lng: 68.219, sog: 4.1, cog: 218, rot: 2.0, acc: 0.08, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "discharge_plume_trail" },
  { index: 15, time: "22:50:00 UTC", lat: 14.805, lng: 68.240, sog: 4.8, cog: 235, rot: 4.5, acc: 0.18, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "evasive_turn" },
  { index: 16, time: "22:54:00 UTC", lat: 14.795, lng: 68.268, sog: 6.2, cog: 252, rot: 5.2, acc: 0.38, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "throttle_acceleration" },
  { index: 17, time: "22:58:00 UTC", lat: 14.788, lng: 68.305, sog: 9.1, cog: 270, rot: 4.1, acc: 0.72, source: "Bi-LSTM DeepRecon", status: "reconstructed", anomaly: "rapid_dash_recovery" },
  { index: 18, time: "23:02:00 UTC", lat: 14.781, lng: 68.348, sog: 12.4, cog: 282, rot: 1.2, acc: 0.65, source: "Shore AIS (SIGNAL RESTORED)", status: "blackout_end", anomaly: "ais_restored" },
  
  // Post-blackout observed transit
  { index: 19, time: "23:06:00 UTC", lat: 14.770, lng: 68.402, sog: 12.9, cog: 284, rot: 0.2, acc: 0.12, source: "Shore AIS", status: "observed", anomaly: "none" },
  { index: 20, time: "23:10:00 UTC", lat: 14.758, lng: 68.459, sog: 13.1, cog: 284, rot: 0.0, acc: 0.04, source: "Shore AIS", status: "observed", anomaly: "none" },
  { index: 21, time: "23:15:00 UTC", lat: 14.743, lng: 68.529, sog: 13.2, cog: 285, rot: 0.1, acc: 0.02, source: "Satellite AIS (Spire)", status: "observed", anomaly: "none" },
  { index: 22, time: "23:20:00 UTC", lat: 14.729, lng: 68.601, sog: 13.3, cog: 285, rot: 0.0, acc: 0.01, source: "Satellite AIS (Spire)", status: "observed", anomaly: "none" },
  { index: 23, time: "23:30:00 UTC", lat: 14.700, lng: 68.745, sog: 13.4, cog: 286, rot: 0.0, acc: 0.02, source: "Shore AIS", status: "observed", anomaly: "none" },

  // RNN forward predictions
  { index: 24, time: "23:45:00 UTC", lat: 14.656, lng: 68.961, sog: 13.5, cog: 286, rot: 0.0, acc: 0.00, source: "RNN Horizon T+15m", status: "forecast", anomaly: "predicted_track" },
  { index: 25, time: "00:00:00 UTC", lat: 14.612, lng: 69.177, sog: 13.5, cog: 286, rot: 0.0, acc: 0.00, source: "RNN Horizon T+30m", status: "forecast", anomaly: "predicted_track" },
  { index: 26, time: "00:30:00 UTC", lat: 14.524, lng: 69.609, sog: 13.4, cog: 287, rot: 0.1, acc: -0.01, source: "RNN Horizon T+1h", status: "forecast", anomaly: "predicted_track" },
  { index: 27, time: "01:30:00 UTC", lat: 14.348, lng: 70.473, sog: 13.4, cog: 287, rot: 0.0, acc: 0.00, source: "RNN Horizon T+2h", status: "forecast", anomaly: "predicted_track" },
  { index: 28, time: "05:30:00 UTC", lat: 13.644, lng: 73.929, sog: 13.2, cog: 288, rot: 0.0, acc: -0.02, source: "RNN Horizon T+6h", status: "forecast", anomaly: "predicted_track" },
  { index: 29, time: "11:30:00 UTC", lat: 12.588, lng: 79.113, sog: 13.0, cog: 290, rot: 0.0, acc: 0.00, source: "RNN Horizon T+12h", status: "forecast", anomaly: "eez_boundary_crossing" }
];

// Models for Gap Interpolation
export const INTERPOLATION_MODELS = [
  {
    id: "bilstm",
    name: "BF-BiLSTM + Ocean Stokes Drift",
    confidence: 94.2,
    meanRmseNm: 0.18,
    hausdorffNm: 0.32,
    fdeNm: 0.21,
    convergenceEpochs: 48,
    type: "Deep Recurrent Bidirectional Neural Network",
    physicsCoupled: true,
    recommendation: "Recommended for Court Evidence"
  },
  {
    id: "ekf",
    name: "Extended Kalman Filter (Kinematic-Constrained)",
    confidence: 88.4,
    meanRmseNm: 0.41,
    hausdorffNm: 0.65,
    fdeNm: 0.49,
    convergenceEpochs: "N/A (Analytical)",
    type: "Nonlinear State-Space Filter",
    physicsCoupled: false,
    recommendation: "Acceptable for Baseline Comparison"
  },
  {
    id: "spline",
    name: "Cubic Hermite Spline (PCHIP)",
    confidence: 82.1,
    meanRmseNm: 0.72,
    hausdorffNm: 1.14,
    fdeNm: 0.88,
    convergenceEpochs: "N/A (Geometric)",
    type: "Shape-Preserving Geometric Interpolant",
    physicsCoupled: false,
    recommendation: "Oversmooths turning maneuvers"
  },
  {
    id: "deadreckon",
    name: "Dead Reckoning with Surface Leeway",
    confidence: 76.8,
    meanRmseNm: 1.25,
    hausdorffNm: 1.89,
    fdeNm: 1.62,
    convergenceEpochs: "N/A (Kinematic)",
    type: "Constant Velocity + Wind Vector Integration",
    physicsCoupled: true,
    recommendation: "Drift accumulation too high (>1nm)"
  }
];

// Sister vessel corridor historical distribution (148 vessels in past 12 months)
export const FLEET_BENCHMARK = {
  totalVessels: 148,
  corridorName: "Arabian Sea Western Bound TSS Corridor",
  meanSpeedKn: 13.1,
  stdDevSpeedKn: 0.74,
  suspectSpeedDuringBlackoutKn: 3.8,
  zScore: -12.56,
  percentile: "< 0.01% (3.8 kn is extreme outlier)",
  blackoutOccurrencesInCorridor: "1 in 1,200 voyages (99.92% maintain uninterrupted AIS)",
  averageDriftOffLaneNm: 0.32,
  suspectDriftOffLaneNm: 2.85
};

// SAR Satellite Verification
export const SAR_VERIFICATION = {
  satellite: "Sentinel-1B C-SAR",
  acquisitionUtc: "22:38:14 UTC",
  polarization: "VV + VH Interferometric Wide Swath",
  resolutionM: 10,
  kelvinWakeAngleDeg: 19.47,
  cuspWaveLengthM: 42.5,
  inferredSpeedKn: 3.75,
  actualReportedAisSpeedKn: "N/A (Transponder Offline)",
  bilstmReconSpeedKn: 3.65,
  kelvinVariancePercent: 2.7,
  conclusion: "Kelvin wake hydrodynamics confirm vessel was moving under mechanical propulsion at 3.75 kn during blackout."
};

// MARPOL Discharge estimation constants
export const DISCHARGE_ESTIMATE = {
  slickLengthKm: 14.2,
  slickWidthAvgM: 380,
  slickAreaKm2: 5.396,
  nominalThicknessUm: 0.85,
  oilDensityKgM3: 890,
  vesselSpeedDuringReleaseKn: 3.8,
  vesselSpeedMs: 1.95,
  releaseDurationMin: 38,
  estimatedVolumeM3: 4.58,
  estimatedVolumeLiters: 4580,
  estimatedVolumeMetricTons: 4.08,
  dischargeRateLitersPerMin: 120.5,
  dischargeRateM3PerHour: 7.23,
  standardOwsPumpCapacityM3PerHour: "5 - 10 m³/h (Typical for 115k DWT Aframax)",
  marpolLegalLimitPpm: 15,
  measuredConcentrationPpm: 63000,
  violationRatio: "4,200x legal limit"
};

// GNSS Integrity check factors
export const GNSS_INTEGRITY = {
  integrityStatus: "COMPROMISED SIGNATURE DETECTED",
  overallSpoofingRisk: 79,
  metrics: [
    { name: "Kinematic Jump Teleportation", score: 85, status: "WARNING", detail: "Jump from 12.8 kn to 4.2 kn within 4 mins violates natural tanker inertia" },
    { name: "Doppler Carrier Drift Consistency", score: 92, status: "ALERT", detail: "Abrupt oscillator silence; no graceful power-down handshake logged" },
    { name: "MMSI Collision / Ghost Identity", score: 15, status: "NORMAL", detail: "No duplicate MMSI 419001248 transmissions detected across Indian Ocean stations" },
    { name: "Altitude & Constellation Lock Jitter", score: 22, status: "NORMAL", detail: "Antenna height reported stably at 28.5m prior to transponder disconnect" },
    { name: "Timestamp Retro-Dating / Replay", score: 88, status: "CRITICAL", detail: "Re-emergence timestamp (23:02) displayed out-of-sequence sequence ID #4092" }
  ]
};

