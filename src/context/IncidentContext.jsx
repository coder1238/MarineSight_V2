import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INCIDENTS_REGISTRY, getIncidentData } from '../data/mockData';

const IncidentContext = createContext(null);

export const SIMULATION_TIMESTAMPS = ["T+0", "T+6", "T+12", "T+24", "T+48", "T+72"];

export function IncidentProvider({ children }) {
  const [activeIncidentId, setActiveIncidentId] = useState("OF-2026-0912");
  const [activeTimestamp, setActiveTimestamp] = useState("T+72");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState("1x");

  // Get active case data
  const activeIncident = useMemo(() => {
    return getIncidentData(activeIncidentId);
  }, [activeIncidentId]);

  // Simulation playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = playSpeed === "10x" ? 800 : playSpeed === "5x" ? 1500 : 2500;
    const timer = setInterval(() => {
      setActiveTimestamp((current) => {
        const idx = SIMULATION_TIMESTAMPS.indexOf(current);
        if (idx === -1 || idx === SIMULATION_TIMESTAMPS.length - 1) {
          return SIMULATION_TIMESTAMPS[0];
        }
        return SIMULATION_TIMESTAMPS[idx + 1];
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, playSpeed]);

  const selectIncident = (id) => {
    if (getIncidentData(id)) {
      setActiveIncidentId(id);
      setActiveTimestamp("T+72");
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const value = {
    activeIncidentId,
    activeIncident,
    selectIncident,
    allIncidents: INCIDENTS_REGISTRY,
    activeTimestamp,
    setActiveTimestamp,
    isPlaying,
    setIsPlaying,
    togglePlay,
    playSpeed,
    setPlaySpeed,
    simulationTimestamps: SIMULATION_TIMESTAMPS
  };

  return (
    <IncidentContext.Provider value={value}>
      {children}
    </IncidentContext.Provider>
  );
}

export function useIncident() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error("useIncident must be used within an IncidentProvider");
  }
  return context;
}

export default IncidentContext;

