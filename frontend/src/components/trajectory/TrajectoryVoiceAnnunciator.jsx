import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { SUSPECT_VESSELS } from './trajectoryData';

export default function TrajectoryVoiceAnnunciator({ vesselId = "v1" }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  const vessel = SUSPECT_VESSELS.find(v => v.id === vesselId) || SUSPECT_VESSELS[0];

  const briefText = `Tactical Forensic Trajectory Alert. Primary suspect vessel ${vessel.name}, MMSI ${vessel.mmsi}, executed an abrupt sixty-seven percent deceleration prior to cutting its AIS transponder at 22:24 UTC. The vessel maintained thirty-eight minutes of transponder blackout, with neural Bi-LSTM reconstruction establishing closest approach of 1.4 nautical miles to the oil slick origin at 22:42 UTC. Satellite Kelvin wake verification confirms active mechanical propulsion during the unobserved gap. Composite anomaly risk score is ${vessel.riskScore} out of 100.`;

  const speakBrief = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    if (isMuted) return;

    // Optional: play tactical beep tone with Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // AudioContext might require user gesture
    }

    const utterance = new SpeechSynthesisUtterance(briefText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-ocean" />
          <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider font-mono">
            Tactical Voice Annunciator & Audio Intelligence
          </h3>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMuted 
                ? 'bg-red-50 border-red-200 text-status-danger' 
                : 'bg-white border-border-marine text-text-secondary hover:bg-ocean-light'
            }`}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={speakBrief}
            disabled={isMuted}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isSpeaking
                ? 'bg-status-warning text-white'
                : 'bg-ocean text-white hover:bg-ocean-deep disabled:opacity-50'
            }`}
          >
            {isSpeaking ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Stop Broadcast</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Tactical Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Brief Transcript Text Box */}
      <div className="p-3 bg-ocean-light/50 rounded-xl border border-border-marine/70 font-mono text-xs space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-text-muted">
          <span>SPOKEN AUDIO TRANSCRIPT:</span>
          {isSpeaking && (
            <span className="text-status-success font-bold flex items-center gap-1 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-status-success"></span>
              BROADCASTING AUDIO...
            </span>
          )}
        </div>
        <p className="text-[11px] text-text-secondary font-sans leading-relaxed">
          "{briefText}"
        </p>
      </div>
    </div>
  );
}

