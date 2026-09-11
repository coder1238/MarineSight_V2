import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Bell, Play, ShieldAlert, Check } from 'lucide-react';

// Exportable helper for speaking tactical alerts
export function announceVoiceMessage(text, enabled = true, volume = 1.0) {
  if (!enabled || typeof window === 'undefined') return;

  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.volume = volume;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('UK') || v.name.includes('US')));
      if (englishVoice) utterance.voice = englishVoice;

      window.speechSynthesis.speak(utterance);
    }
  } catch (err) {
    console.warn("SpeechSynthesis error:", err);
  }
}

export default function TacticalVoiceAnnunciator({ voiceEnabled, setVoiceEnabled, voiceVolume, setVoiceVolume }) {
  const [testing, setTesting] = useState(false);

  const handleTestVoice = () => {
    setTesting(true);
    announceVoiceMessage("MRCC Watchstander: Tactical Audio Annunciator operational on Channel 16.", true, voiceVolume);
    setTimeout(() => setTesting(false), 2500);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white border border-border-marine px-2 py-1 rounded-xl shadow-marine-sm text-xs font-mono">
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        className={`p-1 rounded-lg transition-colors flex items-center gap-1 ${
          voiceEnabled 
            ? 'bg-ocean-light text-ocean font-bold' 
            : 'bg-slate-100 text-text-muted hover:text-text-secondary'
        }`}
        title={voiceEnabled ? "Mute Spoken Voice Annunciator" : "Enable Spoken Voice Annunciator"}
      >
        {voiceEnabled ? <Volume2 className="w-3.5 h-3.5 text-ocean" /> : <VolumeX className="w-3.5 h-3.5" />}
        <span className="text-[10px] hidden sm:inline">{voiceEnabled ? "VOICE ON" : "VOICE OFF"}</span>
      </button>

      {voiceEnabled && (
        <button
          onClick={handleTestVoice}
          disabled={testing}
          className="px-1.5 py-0.5 rounded bg-ocean-sky hover:bg-ocean text-ocean hover:text-white font-bold text-[9px] transition-colors"
          title="Test Speech Synthesis"
        >
          {testing ? "Testing..." : "Test Voice"}
        </button>
      )}
    </div>
  );
}

