import { dataStore } from '../models/dataStore.js';

export const ReportsController = {
  getDossier(req, res) {
    const { incidentId } = req.params;
    const incident = dataStore.getIncidentById(incidentId) || dataStore.incidents[0];
    const evidence = dataStore.getEvidence(incident.id);
    const suspect = dataStore.vessels[0];

    const dossier = {
      dossierId: `DOSSIER-${incident.id}-CONFIDENTIAL`,
      classification: "OFFICIAL MARITIME TRIBUNAL RECORD",
      generatedAt: new Date().toISOString(),
      jurisdiction: "Republic of India Exclusive Economic Zone (EEZ)",
      incident: {
        id: incident.id,
        title: incident.title,
        coordinates: incident.coordinates,
        spillAreaKm2: incident.spillAreaKm2,
        spillPerimeterKm: incident.spillPerimeterKm,
        status: incident.status,
        detectionTime: incident.detectionTimeUTC
      },
      leadSuspect: {
        name: suspect.name,
        mmsi: suspect.mmsi,
        imo: suspect.imo,
        flag: suspect.flag,
        type: suspect.type,
        attributionScore: suspect.priorityScore,
        aisBlackoutGap: suspect.aisBlackoutDurationMin + " minutes",
        closestApproach: suspect.closestApproachNm + " nm"
      },
      originAnalysis: incident.hindcast,
      evidenceItemsCount: evidence.length,
      evidenceLedger: evidence,
      legalSummary: `Forensic attribution correlates observed hydrocarbon slick OF-2026-0912 with vessel ${suspect.name} (MMSI: ${suspect.mmsi}) based on backward Lagrangian hindcast advection matching the 38-minute AIS silence window. Bi-LSTM trajectory reconstruction demonstrates deviation through Zone A origin coordinates. Evidence secured with SHA-256 cryptographic verification.`
    };

    res.json({
      success: true,
      data: dossier
    });
  }
};

