/**
 * Real-Time Event Broadcaster
 * Handles Server-Sent Events (SSE) connections for live maritime feeds,
 * AIS telemetry pulses, and tactical radar alerts.
 */

class EventStreamManager {
  constructor() {
    this.clients = new Set();
    this.pulseInterval = null;
    this.startHeartbeat();
  }

  addClient(res) {
    this.clients.add(res);

    // Send initial connection handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString(), activeClients: this.clients.size })}\n\n`);

    res.on('close', () => {
      this.clients.delete(res);
    });
  }

  broadcast(eventName, data) {
    const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(message);
      } catch (err) {
        this.clients.delete(client);
      }
    }
  }

  startHeartbeat() {
    // Pulse live telemetry update every 5 seconds
    this.pulseInterval = setInterval(() => {
      if (this.clients.size === 0) return;

      const randomJitter = (Math.random() - 0.5) * 0.002;
      const telemetryUpdate = {
        type: 'AIS_TELEMETRY_PULSE',
        timestamp: new Date().toISOString(),
        vessels: [
          {
            mmsi: "419001248",
            name: "MV OCEAN STAR",
            lat: Number((15.1200 + randomJitter).toFixed(5)),
            lng: Number((69.1500 + randomJitter).toFixed(5)),
            speedKn: Number((12.4 + (Math.random() - 0.5) * 0.2).toFixed(1)),
            headingDeg: 284
          },
          {
            mmsi: "352001890",
            name: "Blue Horizon",
            lat: Number((15.3500 + randomJitter).toFixed(5)),
            lng: Number((68.4200 + randomJitter).toFixed(5)),
            speedKn: 11.2,
            headingDeg: 45
          }
        ]
      };

      this.broadcast('telemetry', telemetryUpdate);
    }, 5000);
  }
}

export const eventStream = new EventStreamManager();

