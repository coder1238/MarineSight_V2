import React from 'react';
import { Check, CircleDot, Circle } from 'lucide-react';

export default function PipelineStepper({ currentStep = 6, onStepClick }) {
  const steps = [
    { id: 1, label: "Satellite Analysis", code: "SATELLITE", page: "satellite" },
    { id: 2, label: "Spill Classification", code: "CLASSIFY", page: "satellite" },
    { id: 3, label: "Characterization", code: "SEGMENT", page: "characterize" },
    { id: 4, label: "Backward Hindcast", code: "HINDCAST", page: "source-trace" },
    { id: 5, label: "AIS Traffic Search", code: "AIS_SEARCH", page: "vessel-intel" },
    { id: 6, label: "Trajectory Recon", code: "RECONSTRUCT", page: "trajectory" },
    { id: 7, label: "Vessel Attribution", code: "ATTRIBUTION", page: "attribution" },
    { id: 8, label: "Risk Assessment", code: "RISK", page: "evidence-risk" },
    { id: 9, label: "Response Planning", code: "RESPONSE", page: "response-plan" },
  ];

  return (
    <div className="bg-white border border-border-marine rounded-xl p-3 shadow-marine-sm overflow-x-auto">
      <div className="flex items-center min-w-[760px] justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border-marine -translate-y-1/2 z-0" />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isPending = step.id > currentStep;

          return (
            <button
              key={step.id}
              onClick={() => onStepClick && onStepClick(step.page)}
              className="relative z-10 flex flex-col items-center group focus:outline-none px-2"
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                  isCompleted 
                    ? 'bg-status-success text-white ring-2 ring-white' 
                    : isActive 
                    ? 'bg-ocean text-white ring-4 ring-ocean-sky animate-pulse' 
                    : 'bg-white border-2 border-border-marine text-text-muted group-hover:border-ocean'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className={`text-[11px] mt-1.5 whitespace-nowrap font-medium transition-colors ${
                isActive ? 'text-ocean font-bold' : isCompleted ? 'text-ocean-deep' : 'text-text-muted group-hover:text-ocean-deep'
              }`}>
                {step.label}
              </span>
              <span className="text-[9px] font-mono text-text-muted uppercase">
                {step.code}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
