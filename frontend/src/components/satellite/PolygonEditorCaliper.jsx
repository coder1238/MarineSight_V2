import React, { useState } from 'react';
import { Edit3, Check, RotateCcw, Plus, Trash2, Maximize, Move } from 'lucide-react';

export default function PolygonEditorCaliper({
  points = [],
  onUpdatePoints,
  activeSpillId = "SPILL-01",
  onReset
}) {
  const [selectedPointIndex, setSelectedPointIndex] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Shoelace area calculation in pixel area mapped to km2
  const computedArea = (points.length > 2 ? Math.abs(
    points.reduce((acc, p, i) => {
      const next = points[(i + 1) % points.length];
      return acc + (p.x * next.y - next.x * p.y);
    }, 0) / 2
  ) * 0.000085 : 0).toFixed(2);

  // Perimeter in km
  const computedPerimeter = (points.length > 2 ? points.reduce((acc, p, i) => {
    const next = points[(i + 1) % points.length];
    const dx = next.x - p.x;
    const dy = next.y - p.y;
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0) * 0.024 : 0).toFixed(1);

  const handleCoordinateChange = (idx, axis, val) => {
    const newPts = [...points];
    newPts[idx] = {
      ...newPts[idx],
      [axis]: Math.max(0, Math.min(1000, parseInt(val) || 0))
    };
    onUpdatePoints(newPts);
  };

  const handleAddVertex = () => {
    if (points.length === 0) return;
    const last = points[points.length - 1];
    const first = points[0];
    const midPoint = {
      x: Math.round((last.x + first.x) / 2 + 20),
      y: Math.round((last.y + first.y) / 2 + 20)
    };
    onUpdatePoints([...points, midPoint]);
  };

  const handleDeleteVertex = (idx) => {
    if (points.length <= 3) return; // Keep minimum 3 vertices for polygon
    const newPts = points.filter((_, i) => i !== idx);
    onUpdatePoints(newPts);
    if (selectedPointIndex === idx) setSelectedPointIndex(null);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            Feature 6 · Polygon Delineation & Vertex Caliper
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              editMode ? 'bg-status-success text-white' : 'bg-ocean text-white hover:bg-ocean-deep'
            }`}
          >
            {editMode ? 'Editing Active' : 'Enable Polygon Editor'}
          </button>
        </div>
      </div>

      {/* Geodesic Metrics Computed Live */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">SHOELACE AREA</span>
          <span className="text-sm font-bold text-ocean">{computedArea} km&sup2;</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">GEODESIC PERIMETER</span>
          <span className="text-sm font-bold text-ocean-navy">{computedPerimeter} km</span>
        </div>
        <div className="p-2 bg-ocean-light/50 rounded-lg border border-border-marine/40 text-center">
          <span className="text-[9px] text-text-muted block">ACTIVE VERTICES</span>
          <span className="text-sm font-bold text-status-success">{points.length} Nodes</span>
        </div>
      </div>

      {/* Vertex List / Controls */}
      {editMode && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-muted font-bold">POLYGON VERTEX COORDINATES (X, Y in Canvas px)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddVertex}
                className="px-2 py-0.5 rounded bg-ocean-sky hover:bg-ocean text-ocean-deep hover:text-white text-[10.5px] font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Vertex</span>
              </button>
              <button
                onClick={onReset}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-text-secondary text-[10.5px] font-bold flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default</span>
              </button>
            </div>
          </div>

          <div className="max-h-36 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
            {points.map((pt, idx) => (
              <div
                key={idx}
                className={`p-1.5 rounded-lg border flex items-center justify-between gap-1 transition-all ${
                  selectedPointIndex === idx ? 'border-ocean bg-ocean-sky/40' : 'border-border-marine bg-white'
                }`}
              >
                <span className="font-bold text-[10.5px] text-ocean">P{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={pt.x}
                    onChange={(e) => handleCoordinateChange(idx, 'x', e.target.value)}
                    className="w-10 px-1 py-0.5 text-center rounded border border-border-marine text-[10px]"
                    title="X coordinate"
                  />
                  <input
                    type="number"
                    value={pt.y}
                    onChange={(e) => handleCoordinateChange(idx, 'y', e.target.value)}
                    className="w-10 px-1 py-0.5 text-center rounded border border-border-marine text-[10px]"
                    title="Y coordinate"
                  />
                  {points.length > 3 && (
                    <button
                      onClick={() => handleDeleteVertex(idx)}
                      className="text-slate-400 hover:text-status-danger p-0.5 transition-colors"
                      title="Remove vertex"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

