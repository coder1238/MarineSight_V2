import React, { useState } from 'react';
import { X, Radio, Volume2, Copy, Check, Shield, AlertTriangle, Play, Square } from 'lucide-react';

export default function WorkspaceVhfScriptModal({ caseData, onClose }) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const vesselName = (caseData.topVessel?.name || 'MV OCEAN STAR').toUpperCase();
  const vesselMmsi = caseData.topVessel?.mmsi || '419001248';
  const vesselCallsign = caseData.topVessel?.callSign || 'VT8891';

  const vhfHailScript = `ALL STATIONS, ALL STATIONS, ALL STATIONS.
THIS IS INDIAN COAST GUARD DISTRICT HEADQUARTERS POLLUTION COMMAND CALLING ON VHF CHANNEL 16.

M/T ${vesselName}, M/T ${vesselName}, M/T ${vesselName}.
THIS IS INDIAN COAST GUARD SHIP SAMUDRA PRAHARI, CALLSIGN 8TLK.
MMSI ${vesselMmsi}, CALL SIGN ${vesselCallsign}, FLAG ${caseData.topVessel?.flag?.toUpperCase() || 'INDIA'}.

YOUR PRESENT POSITION IS VICINITY OF COORDINATES ${caseData.coordinates?.display}.
YOU ARE DIRECTED TO SWITCH WORKING FREQUENCY TO VHF CHANNEL 06 IMMEDIATELY. OVER.

[SWITCHED TO CHANNEL 06 // TACTICAL DIRECTIVE]

CAPTAIN, BE ADVISED:
SATELLITE SYNTHETIC APERTURE RADAR AND MARITIME DRONE RECONNAISSANCE HAVE DETECTED A MASSIVE HYDROCARBON DISCHARGE SLICK MEASURING ${caseData.spillAreaKm2} SQUARE KILOMETRES EXTENDING FROM YOUR TRACK CORRIDOR.

EVIDENCE CONFIRMS AN AIS TRANSPONDER SHUTDOWN OF ${caseData.topVessel?.aisBlackoutDurationMin || 38} MINUTES CORRESPONDING WITH DECELERATION TO ${caseData.topVessel?.speedDropKn || '3.8 KNOTS'}.

BY AUTHORITY OF THE GOVERNMENT OF INDIA UNDER THE MERCHANT SHIPPING ACT SECTION 356 AND MARPOL 73/78:
1. YOU ARE ORDERED TO MAINTAIN PRESENT COURSE AND SPEED UNTIL DIRECTED.
2. DO NOT COMMENCE ANY BILGE STRIPPING, TANK WASHING, OR BALLAST DISCHARGE.
3. PREPARE SHIP'S OIL RECORD BOOK (PART I & PART II) AND ENGINE LOG BOOK FOR IMMEDIATE COAST GUARD ARMED BOARDING INSPECTION.
4. STAND BY YOUR PILOT LADDER ON LEEWARD SIDE.

ACKNOWLEDGE THIS TRANSMISSION IMMEDIATELY WITH YOUR SOULS ON BOARD AND MASTER'S FULL NAME. OVER.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(vhfHailScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeechToggle = () => {
    if (!('speechSynthesis' in window)) {
      alert("Browser does not support Web Speech API");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Indian Coast Guard Ship Samudra Prahari calling tanker ${vesselName}. Switch to VHF channel 06 immediately. Satellite SAR has detected a hydrocarbon discharge slick along your track corridor. Prepare for boarding inspection.`
    );
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-border-marine shadow-2xl flex flex-col max-h-[90vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white shadow-sm">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ocean-navy text-base flex items-center gap-2">
                Tactical VHF Channel 16 Hail & Intercept Directive
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-status-danger font-bold">
                  IMO SMCP COMPLIANT
                </span>
              </h3>
              <p className="text-xs text-text-secondary">
                Standardized maritime enforcement protocol for immediate ship-to-shore interdiction.
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (isPlayingAudio && 'speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 rounded-lg text-text-muted hover:text-ocean-navy hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tactical Info Banner */}
        <div className="px-5 py-3 bg-ocean-light border-b border-border-marine flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span>TARGET: <strong className="text-ocean-navy">{vesselName}</strong></span>
            <span>MMSI: <strong className="text-ocean-deep">{vesselMmsi}</strong></span>
            <span>FREQ: <strong className="text-status-danger">CH 16 / 156.8 MHz</strong></span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-status-danger animate-pulse">
            LIVE TACTICAL LINK
          </span>
        </div>

        {/* Script Content */}
        <div className="relative flex-1 p-5 bg-slate-950 overflow-y-auto font-mono text-xs text-amber-300 select-all leading-relaxed whitespace-pre-wrap">
          {vhfHailScript}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-marine bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleSpeechToggle}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
              isPlayingAudio 
                ? 'bg-status-danger text-white shadow-md' 
                : 'border border-border-marine bg-white hover:bg-slate-100 text-ocean-navy'
            }`}
          >
            {isPlayingAudio ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-ocean" />}
            <span>{isPlayingAudio ? 'Stop Radio Transmission' : 'Simulate VHF Radio Hail'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg border border-border-marine bg-white hover:bg-slate-100 text-ocean-navy text-xs font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-ocean" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full Hail Script'}</span>
            </button>

            <button
              onClick={() => {
                if (isPlayingAudio && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

