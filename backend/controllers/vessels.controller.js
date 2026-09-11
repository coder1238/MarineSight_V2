import { dataStore } from '../models/dataStore.js';
import { calculateCpa } from '../services/geoService.js';

export const VesselsController = {
  getAll(req, res) {
    const vessels = dataStore.getAllVessels();
    res.json({
      success: true,
      count: vessels.length,
      data: vessels
    });
  },

  getByMmsi(req, res) {
    const { mmsi } = req.params;
    const vessel = dataStore.getVesselByMmsi(mmsi);
    if (!vessel) {
      return res.status(404).json({ success: false, error: `Vessel with MMSI ${mmsi} not found` });
    }
    res.json({ success: true, data: vessel });
  },

  getTracks(req, res) {
    const { mmsi } = req.params;
    const vessel = dataStore.getVesselByMmsi(mmsi);
    if (!vessel || !vessel.tracks) {
      return res.status(404).json({ success: false, error: `Tracks for MMSI ${mmsi} not found` });
    }
    res.json({
      success: true,
      mmsi,
      name: vessel.name,
      tracks: vessel.tracks
    });
  },

  calculateCpaToTarget(req, res) {
    const { mmsi } = req.params;
    const { targetLat, targetLng } = req.body || {};
    const vessel = dataStore.getVesselByMmsi(mmsi);

    if (!vessel) {
      return res.status(404).json({ success: false, error: `Vessel ${mmsi} not found` });
    }

    const allPoints = [
      ...(vessel.tracks?.preGap || []),
      ...(vessel.tracks?.reconstructed || []),
      ...(vessel.tracks?.postGap || [])
    ];

    const cpaResult = calculateCpa(
      { lat: Number(targetLat) || 14.6521, lng: Number(targetLng) || 67.9015 },
      allPoints
    );

    res.json({
      success: true,
      mmsi,
      name: vessel.name,
      cpa: cpaResult
    });
  }
};

