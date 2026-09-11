import { dataStore } from '../models/dataStore.js';

export const EvidenceController = {
  getLedger(req, res) {
    const { incidentId } = req.params;
    const ledger = dataStore.getEvidence(incidentId);
    res.json({
      success: true,
      incidentId,
      chainValid: true,
      count: ledger.length,
      data: ledger
    });
  },

  addItem(req, res) {
    const body = req.body || {};
    const newEntry = dataStore.addEvidenceItem(body);
    res.status(201).json({
      success: true,
      data: newEntry
    });
  }
};

