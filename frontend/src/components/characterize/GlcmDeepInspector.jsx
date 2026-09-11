import React, { useState, useMemo } from 'react';
import { Grid, Eye, Sliders, Info, Zap, HelpCircle } from 'lucide-react';

export default function GlcmDeepInspector({ baseContrast = 0.34, baseHomogeneity = 0.81, baseEnergy = 0.45, baseEntropy = 2.18 }) {
  const [windowSize, setWindowSize] = useState(7); // 3, 5, 7, 9, 11
  const [directionAngle, setDirectionAngle] = useState(0); // 0, 45, 90, 135
  const [pixelQuantization, setPixelQuantization] = useState(16); // 8, 16, 32 levels

  // Dynamic calculations based on window size and orientation angle
  const glcmMetrics = useMemo(() => {
    // Window size smoothing effect
    const scaleFactor = (windowSize - 3) * 0.035;
    const angleRad = (directionAngle * Math.PI) / 180;
    const dirBias = Math.sin(angleRad) * 0.04;

    const contrast = +(baseContrast + scaleFactor * 0.6 + dirBias).toFixed(3);
    const dissimilarity = +(contrast * 0.82).toFixed(3);
    const homogeneity = +(Math.max(0.4, baseHomogeneity - scaleFactor * 0.35 - Math.abs(dirBias))).toFixed(3);
    const energy = +(Math.max(0.1, baseEnergy - scaleFactor * 0.2)).toFixed(3);
    const asm = +(Math.pow(energy, 2)).toFixed(4);
    const entropy = +(baseEntropy + scaleFactor * 0.8 + Math.abs(dirBias) * 2).toFixed(2);
    const correlation = +(0.88 - scaleFactor * 0.15).toFixed(3);

    return {
      contrast,
      dissimilarity,
      homogeneity,
      energy,
      asm,
      entropy,
      correlation
    };
  }, [windowSize, directionAngle, baseContrast, baseHomogeneity, baseEnergy, baseEntropy]);

  // Generate 8x8 mini co-occurrence matrix heatmap preview
  const matrixGrid = useMemo(() => {
    const size = 8;
    const matrix = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        // Higher values near the diagonal for high homogeneity
        const dist = Math.abs(r - c);
        const intensity = Math.max(0, Math.exp(-dist * (glcmMetrics.homogeneity * 1.6)) * 0.9 + (Math.sin(r + c) * 0.05));
        row.push(+intensity.toFixed(2));
      }
      matrix.push(row);
    }
    return matrix;
  }, [glcmMetrics.homogeneity]);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
            GLCM SAR Texture Deep Inspector (Second-Order Statistics)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-status-success font-semibold">
          Haralick Descriptors Active
        </span>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 bg-ocean-light/50 rounded-xl border border-border-marine text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>KERNEL WINDOW</span>
            <span className="font-bold text-ocean-navy">{windowSize} × {windowSize} px</span>
          </div>
          <input
            type="range"
            min="3"
            max="11"
            step="2"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
            className="w-full h-1.5 bg-border-marine rounded appearance-none cursor-pointer accent-ocean"
          />
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>OFF-DIAGONAL ANGLE (θ)</span>
            <span className="font-bold text-ocean-navy">{directionAngle}° Azimuth</span>
          </div>
          <div className="flex gap-1">
            {[0, 45, 90, 135].map(deg => (
              <button
                key={deg}
                onClick={() => setDirectionAngle(deg)}
                className={`flex-1 py-0.5 rounded text-[10px] border transition-colors ${
                  directionAngle === deg 
                    ? 'bg-ocean text-white font-bold border-ocean' 
                    : 'bg-white hover:bg-ocean-sky text-ocean-navy border-border-marine'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-text-muted mb-1">
            <span>GRAY QUANTIZATION</span>
            <span className="font-bold text-ocean-navy">{pixelQuantization} Levels</span>
          </div>
          <div className="flex gap-1">
            {[8, 16, 32].map(lvl => (
              <button
                key={lvl}
                onClick={() => setPixelQuantization(lvl)}
                className={`flex-1 py-0.5 rounded text-[10px] border transition-colors ${
                  pixelQuantization === lvl 
                    ? 'bg-ocean text-white font-bold border-ocean' 
                    : 'bg-white hover:bg-ocean-sky text-ocean-navy border-border-marine'
                }`}
              >
                {lvl}L
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Layout: Computed Descriptors (Left) + Matrix Heatmap Preview (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Metric Cards (Col 8) */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine/60">
            <span className="text-[9px] text-text-muted block">CONTRAST</span>
            <span className="text-sm font-extrabold text-ocean-deep">{glcmMetrics.contrast}</span>
            <span className="text-[9px] text-text-secondary block">Low local intensity delta</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine/60">
            <span className="text-[9px] text-text-muted block">HOMOGENEITY (IDM)</span>
            <span className="text-sm font-extrabold text-status-success">{glcmMetrics.homogeneity}</span>
            <span className="text-[9px] text-text-secondary block">High capillary damping</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine/60">
            <span className="text-[9px] text-text-muted block">ENERGY (ASM)</span>
            <span className="text-sm font-extrabold text-ocean">{glcmMetrics.energy}</span>
            <span className="text-[9px] text-text-secondary block">ASM: {glcmMetrics.asm}</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine/60">
            <span className="text-[9px] text-text-muted block">ENTROPY</span>
            <span className="text-sm font-extrabold text-status-warning">{glcmMetrics.entropy}</span>
            <span className="text-[9px] text-text-secondary block">Disorder in slick area</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine/60">
            <span className="text-[9px] text-text-muted block">CORRELATION</span>
            <span className="text-sm font-extrabold text-ocean-navy">{glcmMetrics.correlation}</span>
            <span className="text-[9px] text-text-secondary block">Strong linear dependency</span>
          </div>

          <div className="p-2 bg-ocean-light rounded-lg border border-border-marine/60">
            <span className="text-[9px] text-text-muted block">DISSIMILARITY</span>
            <span className="text-sm font-extrabold text-text-primary">{glcmMetrics.dissimilarity}</span>
            <span className="text-[9px] text-text-secondary block">Uniform dark spot profile</span>
          </div>
        </div>

        {/* Co-occurrence Heatmap Grid (Col 4) */}
        <div className="md:col-span-4 p-2.5 bg-slate-900 rounded-xl text-white flex flex-col items-center">
          <div className="flex justify-between w-full text-[9px] font-mono text-slate-400 mb-1.5">
            <span>GLCM PROBABILITY P(i,j)</span>
            <span className="text-ocean-sky">8×8 MATRIX</span>
          </div>

          <div className="grid grid-cols-8 gap-0.5 p-1 bg-slate-950 rounded border border-slate-800">
            {matrixGrid.flat().map((val, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: `rgba(8, 126, 164, ${Math.max(0.08, val)})`,
                  opacity: Math.max(0.2, val)
                }}
                className="w-3.5 h-3.5 rounded-[1px] transition-all hover:ring-1 hover:ring-white"
                title={`P(i,j) = ${val}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between w-full text-[8px] font-mono text-slate-400 mt-1.5">
            <span>0.0 (Far Off-Diag)</span>
            <span className="text-ocean-bright">1.0 (Diagonal Core)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

