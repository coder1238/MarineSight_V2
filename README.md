# Maritime Intelligence & Geospatial Analysis Platform

<p align="center">
  <a href="https://marinesight.onrender.com/">
    <img src="frontend/public/logo.jpg" alt="MarineSight" width="180">
  </a>
</p>

<p align="center">
  <b>Maritime scene analysis, vessel intelligence, movement modelling, and evidence correlation in one operational workspace.</b>
</p>

<p align="center">
  <a href="https://marinesight.onrender.com/">🚀 Live Demo</a>
  &nbsp;•&nbsp;
  <a href="https://marinesight.onrender.com/">Open Platform</a>
</p>

> Prototype implementation for research, engineering demonstration, and technical evaluation.

---

## Preview

### Live Platform

<a href="https://marinesight.onrender.com/">
  <img src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Fmarinesight.onrender.com%2F?w=1280&h=800" alt="Live platform preview" width="100%">
</a>

### Attribution Workspace

<a href="https://marinesight.onrender.com/#/attribution">
  <img src="https://s.wordpress.com/mshots/v1/https%3A%2F%2Fmarinesight.onrender.com%2F%23%2Fattribution?w=1280&h=800" alt="Attribution workspace preview" width="100%">
</a>

> The preview images above are generated from the deployed application. For the latest interface, open the live demo.

---

## Overview

This repository contains a modular maritime intelligence workspace built around a multi-stage investigation workflow.

The application brings together:

- Geospatial visualization
- Satellite-derived scene analysis
- Vessel intelligence
- Vessel trajectory analysis
- Environmental movement modelling
- Source reconstruction
- Evidence correlation
- Candidate scoring
- Risk visualization
- Response planning
- Report generation

The architecture is intentionally modular so that demonstration data and external services can be replaced by operational feeds as the system evolves.

---

## Core Workflow

```text
                 Incident
                    │
                    ▼
          ┌──────────────────┐
          │ Scene Observation│
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Characterization │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Movement Analysis│
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Source Analysis  │
          └────────┬─────────┘
                   │
                   ▼
          ┌───────────────────┐
          │ Vessel Correlation│
          └────────┬──────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Evidence Scoring │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ Response View    │
          └──────────────────┘
```

---

## System Architecture

```text
┌──────────────────────────────────────────────┐
│                 Web Client                   │
│                                              │
│ React + Vite + Tailwind + GIS Components    │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / REST
                       ▼
┌──────────────────────────────────────────────┐
│                  API Server                  │
│                                              │
│ Node.js                                      │
│ ├── Incident Services                        │
│ ├── Vessel Services                          │
│ ├── Simulation Engine                        │
│ ├── Geospatial Services                      │
│ ├── Evidence Services                        │
│ ├── Attribution Engine                       │
│ └── Remote Inference Integration             │
└──────────────────────┬───────────────────────┘
                       │
              ┌────────┼────────┐
              ▼        ▼        ▼
           GIS Data  Models  External APIs
```

---

## Repository Structure

```text
.
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   ├── test/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

---

## Frontend

The frontend is implemented using:

- React
- Vite
- Tailwind CSS
- Lucide icons
- Custom GIS components
- REST API integration

The interface is divided into focused operational workspaces.

Major areas include:

```text
Command
Monitoring
Incidents
Investigation
Satellite Analysis
Characterization
Simulation
Source Analysis
Vessel Intelligence
Trajectory Analysis
Attribution
Evidence
Risk
Response
Reports
```

---

## Backend

The backend is implemented using Node.js with a lightweight REST interface.

The implementation separates controllers, routes, domain services, and data access.

```text
backend/
│
├── controllers/
│   ├── incidents
│   ├── vessels
│   ├── satellite
│   ├── simulation
│   ├── attribution
│   ├── evidence
│   ├── response
│   └── reports
│
├── services/
│   ├── geoService
│   ├── simulationEngine
│   ├── attributionEngine
│   ├── roboflowService
│   └── eventStream
│
└── routes/
    └── index.js
```

---

## Geospatial Processing

Reusable geographic calculations are used for:

- Distance between coordinates
- Bearing calculation
- Destination coordinates
- Spatial proximity
- Track comparison
- Movement reconstruction

Typical analysis:

```text
Observed Location
       │
       ▼
Environmental Movement
       │
       ▼
Candidate Origin
       │
       ▼
Historical Vessel Tracks
       │
       ▼
Spatial / Temporal Correlation
```

---

## Movement Simulation

The simulation engine uses a particle-based approach to represent environmental movement.

Each particle is propagated through discrete time steps.

```text
Particle(t)
     │
     ├── Current contribution
     ├── Wind contribution
     ├── Drift contribution
     └── Diffusion
            │
            ▼
       Particle(t+1)
```

The simulation produces:

- Particle trajectories
- Centroid movement
- Drift direction
- Movement envelope
- Estimated affected region
- Time-dependent positions

The simulation layer is modular and can later be replaced by a dedicated oceanographic model or external environmental service.

---

## Candidate Analysis

Candidate vessels are evaluated using multiple independent signals.

```text
Spatial Relationship
        +
Temporal Relationship
        +
Trajectory Relationship
        +
Behavioural Signals
        +
Tracking Gaps
        │
        ▼
  Composite Evidence
        │
        ▼
 Candidate Ordering
```

The resulting score is intended as an **investigative prioritization signal**, not standalone proof of responsibility.

---

## Satellite Analysis

The satellite-analysis interface is designed around image-derived scene observations.

The current implementation supports integration with an external inference service.

Processing path:

```text
Input Scene
     │
     ▼
Pre-processing
     │
     ▼
Remote Inference
     │
     ▼
Segmentation Result
     │
     ▼
Geospatial Projection
     │
     ▼
Map Visualization
```

Fallback behaviour is included so that the demonstration interface can remain usable when an external inference service is unavailable.

---

## Vessel Intelligence

Vessel records are used throughout the investigation workspace.

Typical fields include:

- Vessel identifier
- Vessel name
- Vessel type
- Flag
- Position
- Heading
- Speed
- Dimensions
- Track history
- Observation time

Historical positions can be reconstructed and visualized on the map.

---

## Evidence Correlation

The evidence layer combines independent observations instead of relying on a single signal.

```text
                  ┌───────────────┐
                  │ Scene Evidence│
                  └──────┬────────┘
                         │
┌──────────────┐         │
│ Movement Data│─────────┤
└──────────────┘         │
                         ▼
┌──────────────┐   ┌───────────────┐
│ Vessel Track │──►│ Evidence Layer│
└──────────────┘   └───────┬───────┘
                           │
┌──────────────┐           │
│ Time Context │───────────┤
└──────────────┘           │
                           ▼
                    Candidate Analysis
```

This structure allows new evidence sources to be added without rewriting the whole application.

---

## Demo Mode

The repository includes demonstration data for operating the platform without requiring every external data provider to be continuously available.

This is useful for:

- Local development
- UI demonstrations
- Integration testing
- Reproducible presentations
- API testing

Demo data should not be interpreted as a live operational feed.

---

## Running Locally

### Requirements

- Node.js 18+
- npm
- Git

### Backend

```bash
cd backend
npm install
npm start
```

Development mode:

```bash
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will print the local URL.

---

## Configuration

External services can be configured through environment variables.

Create:

```text
backend/.env
```

Example:

```env
PORT=3000

# Optional external inference configuration
INFERENCE_API_KEY=
INFERENCE_ENDPOINT=
```

**Never commit real credentials.**

---

## API

The backend exposes endpoints for the main application modules.

### System

```http
GET /api/health
```

### Incidents

```http
GET /api/incidents
GET /api/incidents/:id
POST /api/incidents
PATCH /api/incidents/:id
```

### Vessels

```http
GET /api/vessels
GET /api/vessels/:id/tracks
```

### Satellite

```http
GET /api/satellite/scenes

POST /api/satellite/segment/oil-spill
POST /api/satellite/segment/vessel
```

### Simulation

```http
POST /api/simulation/run
```

### Attribution

```http
GET /api/attribution/ranking
POST /api/attribution/recalculate
```

### Evidence

```http
GET /api/evidence/:incidentId
```

### Response

```http
GET /api/response-plan/:incidentId
```

### Reports

```http
GET /api/reports/:incidentId/dossier
```

---

## Example Investigation Flow

```text
1. Select an incident
        ↓
2. Inspect the detected scene
        ↓
3. Characterize the observed region
        ↓
4. Run movement simulation
        ↓
5. Inspect reconstructed source region
        ↓
6. Load vessel trajectories
        ↓
7. Compare vessel/time relationships
        ↓
8. Calculate candidate evidence scores
        ↓
9. Inspect evidence and risk layers
        ↓
10. Generate investigation report
```

---

## Implementation Status

| Component | Status |
|---|---|
| Web interface | Implemented |
| Incident management | Implemented |
| GIS visualization | Implemented |
| Vessel intelligence | Implemented |
| Vessel trajectories | Implemented |
| Movement simulation | Implemented |
| Candidate scoring | Implemented |
| Evidence workspace | Implemented |
| Response planning UI | Implemented |
| Report workflow | Implemented |
| External image inference | Integrated |
| Live external data feeds | Deployment-dependent |
| Production data infrastructure | Future deployment layer |

---

## Design Philosophy

### Modular

Each analytical capability is isolated behind a service boundary.

### Explainable

The system exposes the evidence contributing to candidate scores rather than presenting an unexplained final output.

### Replaceable

Prototype data sources can be replaced by operational feeds without requiring a complete frontend rewrite.

### Uncertainty-Aware

Environmental modelling, tracking gaps, and image interpretation are treated as sources of uncertainty.

The system therefore presents candidate evidence and confidence rather than claiming certainty from a single observation.

---

## Production Extension

The current architecture can be extended with:

```text
Live Satellite Ingestion
        +
Live Vessel Telemetry
        +
Oceanographic Feeds
        +
Meteorological Feeds
        ↓
Persistent Geospatial Data Layer
        ↓
Scalable Analysis Services
        ↓
Operational Dashboard
```

Potential production components include:

- PostGIS
- TimescaleDB
- Redis
- Object storage
- Containerized services
- Dedicated ML inference services
- Real-time event processing

These components are architectural extensions rather than requirements for running the current prototype.

---

## Security

Never commit:

```text
.env
API keys
Access tokens
Private credentials
Service-account files
```

Recommended local configuration:

```text
.env
.env.local
*.pem
*.key
credentials/
```

Use environment variables or a dedicated secrets manager for deployment.

---

## Disclaimer

This repository is a research and demonstration prototype.

Outputs from the system should be interpreted as analytical assistance and candidate evidence rather than definitive attribution.

Real-world deployment would require validated data sources, domain-specific calibration, operational security controls, and appropriate human review.

---

## Development

Contributions should preserve the separation between:

```text
UI
 ↓
API
 ↓
Domain Service
 ↓
Data / External Service
```

New analytical modules should preferably be implemented as independent services rather than embedded directly into UI components.

---

## License

Add the project license here.
