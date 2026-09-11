import crypto from 'node:crypto';

export class MaritimeDataStore {
  constructor() {
    this.incidents = [
      {
        id: "OF-2026-0912",
        internalId: "INC-0921",
        title: "Arabian Sea Hydrocarbon Discharge & Offshore Forensic Attribution",
        region: "Arabian Sea (Offshore Goa / Karnataka EEZ)",
        detectionTimeUTC: "05 SEP 2026, 14:32:10 UTC",
        detectionTimestamp: "2026-09-05T14:32:10Z",
        coordinates: {
          lat: 14.8214,
          lng: 68.2108,
          display: "14.82°N, 68.21°E"
        },
        polygon: [
          { lat: 14.8450, lng: 68.1800 },
          { lat: 14.8620, lng: 68.2150 },
          { lat: 14.8390, lng: 68.2520 },
          { lat: 14.7980, lng: 68.2380 },
          { lat: 14.8050, lng: 68.1920 }
        ],
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
        pipelineStep: 6,
        notes: "Confirmed hydrocarbon signature via dual-polarization SAR backscatter ratio. Bi-LSTM AIS reconstruction correlates with MV Ocean Star blackout period.",
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
            radiusKm: 6.5
          },
          originZoneC: {
            name: "ZONE C (Dispersed)",
            confidence: 9.5,
            coordinates: "14.5800°N, 68.0400°E",
            lat: 14.5800,
            lng: 68.0400,
            radiusKm: 8.0
          },
          estimatedReleaseTimeUTC: "03 SEP 2026, 22:40 UTC",
          backwardDurationHours: 40.0,
          uncertaintyRadiusKm: 8.7,
          currentContribution: 61,
          windContribution: 39,
          stokesContribution: 2
        },
        topVesselMmsi: "419001248"
      },
      {
        id: "OF-2026-0918",
        internalId: "INC-0925",
        title: "Bay of Bengal Commercial Shipping Lane Discharge",
        region: "Bay of Bengal",
        detectionTimeUTC: "03 SEP 2026, 08:15 UTC",
        detectionTimestamp: "2026-09-03T08:15:00Z",
        coordinates: { lat: 11.4500, lng: 84.1000, display: "11.45°N, 84.10°E" },
        polygon: [
          { lat: 11.47, lng: 84.08 },
          { lat: 11.48, lng: 84.12 },
          { lat: 11.44, lng: 84.14 },
          { lat: 11.43, lng: 84.09 }
        ],
        spillAreaKm2: 8.2,
        spillPerimeterKm: 14.1,
        detectionConfidence: 94.2,
        riskLevel: "HIGH",
        status: "Active Drift",
        topCandidate: "Golden Apex",
        candidateCount: 8,
        highPriorityCount: 2
      },
      {
        id: "OF-2026-0915",
        internalId: "INC-0919",
        title: "Northern Arabian Sea Emulsion Patch",
        region: "Arabian Sea",
        detectionTimeUTC: "01 SEP 2026, 19:40 UTC",
        detectionTimestamp: "2026-09-01T19:40:00Z",
        coordinates: { lat: 16.1200, lng: 71.3000, display: "16.12°N, 71.30°E" },
        polygon: [
          { lat: 16.14, lng: 71.28 },
          { lat: 16.15, lng: 71.32 },
          { lat: 16.10, lng: 71.31 }
        ],
        spillAreaKm2: 3.8,
        spillPerimeterKm: 9.6,
        detectionConfidence: 91.5,
        riskLevel: "MEDIUM",
        status: "Monitoring",
        topCandidate: "Sea Venture",
        candidateCount: 5,
        highPriorityCount: 1
      },
      {
        id: "OF-2026-0909",
        internalId: "INC-0912",
        title: "Laccadive Sea Coastal Fuel Sheen",
        region: "Laccadive Sea",
        detectionTimeUTC: "29 AUG 2026, 11:20 UTC",
        detectionTimestamp: "2026-08-29T11:20:00Z",
        coordinates: { lat: 9.3000, lng: 75.8000, display: "09.30°N, 75.80°E" },
        spillAreaKm2: 1.9,
        spillPerimeterKm: 4.8,
        detectionConfidence: 89.1,
        riskLevel: "LOW",
        status: "Resolved",
        topCandidate: "Kochi Trader",
        candidateCount: 2,
        highPriorityCount: 0
      },
      {
        id: "OF-2026-0904",
        internalId: "INC-0905",
        title: "Northern Bay Heavy Crude Slick",
        region: "Northern Bay",
        detectionTimeUTC: "26 AUG 2026, 04:55 UTC",
        detectionTimestamp: "2026-08-26T04:55:00Z",
        coordinates: { lat: 19.4500, lng: 86.2000, display: "19.45°N, 86.20°E" },
        spillAreaKm2: 6.4,
        spillPerimeterKm: 11.2,
        detectionConfidence: 95.3,
        riskLevel: "HIGH",
        status: "Resolved",
        topCandidate: "Eastern Wave",
        candidateCount: 7,
        highPriorityCount: 1
      }
    ];

    this.vessels = [
      {
        rank: "01",
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
        currentPos: { lat: 15.1200, lng: 69.1500 },
        currentSpeedKn: 12.4,
        headingDeg: 284,
        destination: "Mumbai Port (INBOM)",
        eta: "07 SEP 2026 06:00 UTC",
        status: "HIGH PRIORITY",
        priorityScore: 91.4,
        spatialMatch: 94,
        temporalMatch: 91,
        trajectoryMatch: 88,
        behaviorMatch: 86,
        aisGapScore: 92,
        closestApproachNm: 1.4,
        closestApproachTime: "03 SEP 22:42 UTC",
        aisBlackoutDurationMin: 38,
        aisBlackoutRange: "03 SEP 22:24 - 23:02 UTC",
        anomalyScore: 87,
        speedDropKn: "13.2 → 3.8 kn",
        trajectorySimilarity: 93.4,
        tracks: {
          // Observed pre-blackout
          preGap: [
            { lat: 14.3000, lng: 66.8000, time: "21:30 UTC", speed: 13.4 },
            { lat: 14.4200, lng: 67.2000, time: "22:00 UTC", speed: 13.2 },
            { lat: 14.5300, lng: 67.5500, time: "22:24 UTC", speed: 13.0 }
          ],
          // Blackout gap (unobserved direct line)
          gap: [
            { lat: 14.5300, lng: 67.5500, time: "22:24 UTC", speed: 13.0 },
            { lat: 14.7200, lng: 68.1000, time: "23:02 UTC", speed: 8.5 }
          ],
          // Reconstructed Bi-LSTM path (curving near Zone A at 14.6521, 67.9015)
          reconstructed: [
            { lat: 14.5300, lng: 67.5500, time: "22:24 UTC", speed: 13.0, est: false },
            { lat: 14.5800, lng: 67.7200, time: "22:35 UTC", speed: 8.2, est: true },
            { lat: 14.6515, lng: 67.9010, time: "22:42 UTC", speed: 3.8, est: true, notes: "Near Zone A discharge center" },
            { lat: 14.6900, lng: 68.0100, time: "22:52 UTC", speed: 5.4, est: true },
            { lat: 14.7200, lng: 68.1000, time: "23:02 UTC", speed: 8.5, est: false }
          ],
          // Post-gap observed
          postGap: [
            { lat: 14.7200, lng: 68.1000, time: "23:02 UTC", speed: 8.5 },
            { lat: 14.8800, lng: 68.5000, time: "00:15 UTC", speed: 12.2 },
            { lat: 15.0100, lng: 68.8500, time: "01:30 UTC", speed: 12.4 },
            { lat: 15.1200, lng: 69.1500, time: "03:00 UTC", speed: 12.4 }
          ],
          // Future predicted route
          predicted: [
            { lat: 15.1200, lng: 69.1500, time: "03:00 UTC", speed: 12.4 },
            { lat: 15.4500, lng: 69.7500, time: "06:00 UTC", speed: 12.5 },
            { lat: 16.1000, lng: 70.8000, time: "12:00 UTC", speed: 12.6 },
            { lat: 18.9000, lng: 72.8000, time: "07 SEP", speed: 8.0 }
          ]
        }
      },
      {
        rank: "02",
        name: "Blue Horizon",
        mmsi: "352001890",
        imo: "9641120",
        type: "Chemical Tanker",
        flag: "Panama",
        flagEmoji: "🇵🇦",
        currentPos: { lat: 15.3500, lng: 68.4200 },
        currentSpeedKn: 11.2,
        headingDeg: 45,
        priorityScore: 76.8,
        spatialMatch: 81,
        temporalMatch: 76,
        trajectoryMatch: 72,
        behaviorMatch: 68,
        aisGapScore: 70,
        status: "UNDER REVIEW",
        cpaNm: 4.8,
        gapDuration: "14 min",
        tracks: {
          observed: [
            { lat: 14.10, lng: 67.20 },
            { lat: 14.80, lng: 67.90 },
            { lat: 15.35, lng: 68.42 }
          ]
        }
      },
      {
        rank: "03",
        name: "Sea Carrier",
        mmsi: "211849000",
        imo: "9452291",
        type: "Container Ship",
        flag: "Liberia",
        flagEmoji: "🇱🇷",
        currentPos: { lat: 14.2000, lng: 67.9500 },
        currentSpeedKn: 16.8,
        headingDeg: 160,
        priorityScore: 64.2,
        spatialMatch: 72,
        temporalMatch: 65,
        trajectoryMatch: 61,
        behaviorMatch: 64,
        aisGapScore: 58,
        status: "MODERATE",
        cpaNm: 8.2,
        gapDuration: "None",
        tracks: {
          observed: [
            { lat: 14.90, lng: 67.60 },
            { lat: 14.50, lng: 67.80 },
            { lat: 14.20, lng: 67.95 }
          ]
        }
      },
      {
        rank: "04",
        name: "Asian Pearl",
        mmsi: "563002140",
        imo: "9312284",
        type: "Bulk Carrier",
        flag: "Singapore",
        flagEmoji: "🇸🇬",
        currentPos: { lat: 13.9000, lng: 68.6000 },
        currentSpeedKn: 10.5,
        headingDeg: 210,
        priorityScore: 40.6,
        spatialMatch: 54,
        temporalMatch: 48,
        trajectoryMatch: 42,
        behaviorMatch: 39,
        aisGapScore: 20,
        status: "LOW",
        cpaNm: 14.5,
        gapDuration: "None"
      },
      {
        rank: "05",
        name: "Nordic Spirit",
        mmsi: "257008120",
        imo: "9781190",
        type: "Product Tanker",
        flag: "Norway",
        flagEmoji: "🇳🇴",
        currentPos: { lat: 13.4000, lng: 69.1000 },
        currentSpeedKn: 13.0,
        headingDeg: 240,
        priorityScore: 34.1,
        spatialMatch: 42,
        temporalMatch: 38,
        trajectoryMatch: 35,
        behaviorMatch: 32,
        aisGapScore: 15,
        status: "LOW",
        cpaNm: 19.8,
        gapDuration: "None"
      },
      {
        rank: "00",
        name: "ICGS Samudra Prahari",
        mmsi: "419000888",
        imo: "9568914",
        type: "Pollution Control Vessel (Indian Coast Guard)",
        flag: "India",
        flagEmoji: "🇮🇳",
        currentPos: { lat: 15.2000, lng: 73.1000 },
        currentSpeedKn: 18.0,
        headingDeg: 250,
        status: "DEPLOYED",
        priorityScore: 0,
        mission: "Emergency Containment Boom Mobilization"
      }
    ];

    this.aiModels = [
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

    this.evidenceLedger = [
      {
        id: "EV-01",
        name: "Sentinel-1A SAR Level-1 GRD Raw Telemetry",
        type: "Satellite SAR File",
        timestamp: "2026-09-05T14:32:10Z",
        sha256: "8e7c10b42f5da621b71e1f76d90a42f65b822d86144e55e0a6d0df876cb4101e",
        status: "VERIFIED",
        custody: "Copernicus Hub -> INCOIS Relay -> MarineSight Node"
      },
      {
        id: "EV-02",
        name: "AIS Transponder Transmission Log (MMSI 419001248)",
        type: "AIS Log Stream",
        timestamp: "2026-09-05T15:10:00Z",
        sha256: "4a28f73ec1209b5501d6718d098e21ba57fc109867011d87e0294e756184bf42",
        status: "VERIFIED",
        custody: "Directorate General of Lighthouses & Lightships (DGLL)"
      },
      {
        id: "EV-03",
        name: "BF-BiLSTM Interpolated Trajectory Vector Matrix",
        type: "AI Inferred Model Output",
        timestamp: "2026-09-05T15:45:22Z",
        sha256: "31f98d4ec0911da2b8921cf026788b14e390d45388c1b5a86d267891e4f923ca",
        status: "SEALED",
        custody: "MarineSight Neural Engine (v4.1)"
      },
      {
        id: "EV-04",
        name: "OpenDrift Lagrangian Backward Particle Advection Log",
        type: "Hydrodynamic Simulation Archive",
        timestamp: "2026-09-05T16:00:15Z",
        sha256: "9b3c4f721a8b0d1e56342f90ac89e1b238475d6092134e7a8f90c1283e54b678",
        status: "SEALED",
        custody: "MarineSight Simulation Worker cluster-04"
      }
    ];

    this.responseAssets = {
      incidentId: "OF-2026-0912",
      containmentBooms: [
        {
          id: "BOOM-1",
          name: "Mormugao Bay Outer Barrier",
          lengthM: 1200,
          type: "Heavy Offshore Curtain Boom",
          status: "DEPLOYED",
          coords: [
            { lat: 15.3900, lng: 73.7800 },
            { lat: 15.4200, lng: 73.8100 }
          ]
        },
        {
          id: "BOOM-2",
          name: "Karwar Ecological Sanctuary Deflector",
          lengthM: 1500,
          type: "Shore-Sealing Sorbent Boom",
          status: "EN ROUTE",
          coords: [
            { lat: 14.8100, lng: 74.1200 },
            { lat: 14.8500, lng: 74.1500 }
          ]
        }
      ],
      skimmerVessels: [
        { id: "SKM-01", vessel: "ICGS Samudra Prahari", recoveryRateM3h: 300, status: "EN ROUTE" },
        { id: "SKM-02", vessel: "Port Tug Mormugao-4", recoveryRateM3h: 120, status: "STANDBY" }
      ],
      dispersantAvailableL: 25000,
      protectionPriority: [
        { zone: "Netrani Coral Reef & Marine Sanctuary", priority: "CRITICAL", etaHours: 24.5 },
        { zone: "Goa Estuarine Fisheries", priority: "HIGH", etaHours: 36.0 },
        { zone: "Karwar Commercial Port Approach", priority: "MODERATE", etaHours: 52.0 }
      ]
    };
  }

  // Incidents
  getAllIncidents(query = {}) {
    let result = [...this.incidents];
    if (query.status && query.status !== "All") {
      result = result.filter(i => i.status.toLowerCase() === query.status.toLowerCase());
    }
    if (query.risk && query.risk !== "All") {
      result = result.filter(i => i.riskLevel.toLowerCase() === query.risk.toLowerCase());
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(i => 
        i.id.toLowerCase().includes(q) || 
        i.title.toLowerCase().includes(q) || 
        i.region.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getIncidentById(id) {
    return this.incidents.find(i => i.id === id || i.internalId === id) || null;
  }

  createIncident(data) {
    const newId = `OF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInc = {
      id: newId,
      internalId: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title || "Unclassified Marine Spill",
      region: data.region || "Arabian Sea",
      detectionTimeUTC: new Date().toUTCString(),
      detectionTimestamp: new Date().toISOString(),
      coordinates: data.coordinates || { lat: 14.8, lng: 68.2, display: "14.8°N, 68.2°E" },
      spillAreaKm2: parseFloat(data.spillAreaKm2) || 5.0,
      spillPerimeterKm: parseFloat(data.spillPerimeterKm) || 12.0,
      detectionConfidence: 92.0,
      riskLevel: data.riskLevel || "HIGH",
      status: "Investigating",
      pipelineStep: 1,
      assignedAnalyst: data.assignedAnalyst || "Duty Officer"
    };
    this.incidents.unshift(newInc);
    return newInc;
  }

  updateIncident(id, updates) {
    const idx = this.incidents.findIndex(i => i.id === id || i.internalId === id);
    if (idx === -1) return null;
    this.incidents[idx] = { ...this.incidents[idx], ...updates };
    return this.incidents[idx];
  }

  // Vessels
  getAllVessels() {
    return this.vessels;
  }

  getVesselByMmsi(mmsi) {
    return this.vessels.find(v => v.mmsi === mmsi) || null;
  }

  // AI Models
  getAiModels() {
    return this.aiModels;
  }

  // Evidence
  getEvidence(incidentId) {
    return this.evidenceLedger;
  }

  addEvidenceItem(item) {
    const sha = crypto.createHash('sha256').update(JSON.stringify(item) + Date.now()).digest('hex');
    const newEntry = {
      id: `EV-0${this.evidenceLedger.length + 1}`,
      name: item.name || "Digital Forensic Artifact",
      type: item.type || "Evidence File",
      timestamp: new Date().toISOString(),
      sha256: sha,
      status: "VERIFIED",
      custody: item.custody || "MarineSight Ledger Node"
    };
    this.evidenceLedger.push(newEntry);
    return newEntry;
  }

  // Response
  getResponsePlan(incidentId) {
    return this.responseAssets;
  }

  addContainmentBoom(boom) {
    const newBoom = {
      id: `BOOM-${this.responseAssets.containmentBooms.length + 1}`,
      name: boom.name || "Dynamic Barrier",
      lengthM: boom.lengthM || 1000,
      type: boom.type || "Offshore Curtain Boom",
      status: "DEPLOYED",
      coords: boom.coords || [
        { lat: 15.10, lng: 73.50 },
        { lat: 15.14, lng: 73.55 }
      ]
    };
    this.responseAssets.containmentBooms.push(newBoom);
    return newBoom;
  }
}

export const dataStore = new MaritimeDataStore();

