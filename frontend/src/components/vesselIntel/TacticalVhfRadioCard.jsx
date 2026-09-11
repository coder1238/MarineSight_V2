import React, { useState, useRef } from 'react';
import { Radio, Volume2, VolumeX, Play, Pause, Disc, AlertTriangle } from 'lucide-react';

export default function TacticalVhfRadioCard({ vessel }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioContextRef = useRef(null);

  const vhfTranscript = [
    {
      time: "22:26 UTC",
      sender: "INDIAN COAST GUARD SENTRY 21",
      callsign: "VWF-21",
      channel: "VHF CH 16 (156.8 MHz)",
      msg: `All stations, all stations. Motor Vessel ${vessel.name.toUpperCase()}, MMSI ${vessel.mmsi}, this is Coast Guard Sentry 21 on VHF Channel 16. We note sudden AIS transmission interruption at position 14°50'N, 068°12'E. Please confirm your transponder operational status, over.`
    },
    {
      time: "22:29 UTC",
      sender: `${vessel.name.toUpperCase()} (BRIDGE WATCH)`,
      callsign: "OFFICER OF THE WATCH",
      channel: "VHF CH 16 → CH 06",
      msg: `Coast Guard Sentry 21, this is ${vessel.name}. We experienced a temporary auxiliary generator bus breaker trip causing electronic navigational reboot. Transponder is being reset. We are proceeding on passage at 4 knots for fuel filtration check. Over.`
    },
    {
      time: "22:34 UTC",
      sender: "INDIAN COAST GUARD SENTRY 21",
      callsign: "VWF-21",
      channel: "VHF CH 06",
      msg: `Roger ${vessel.name}. Be advised satellite radar observes a surface slick directly trailing your stern quarter. You are instructed to preserve all engine logbooks, oily water separator records, and remain on VHF 16 continuous watch. Out.`
    }
  ];

  // Synthesize authentic tactical radio sound using Web Audio API
  const handlePlayRadioSimulation = () => {
    if (isPlayingAudio) {
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch(e) {}
        audioContextRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      // Create radio static squelch
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15; // white noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;

      // Beep tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(ctx.destination);
      whiteNoise.start();

      setIsPlayingAudio(true);

      // Speech synthesis simulation
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Motor Vessel ${vessel.name}. This is Coast Guard Sentry 21 on VHF Channel 16. State reason for AIS transponder blackout.`
        );
        utterance.rate = 1.05;
        utterance.pitch = 0.95;
        utterance.onend = () => {
          setIsPlayingAudio(false);
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    } catch (e) {
      console.warn("Web audio playback not supported", e);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-status-danger border border-red-200">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Tactical VHF Radio Intercept & Bridge Voice Log
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Recorded Channel 16 / Working Channel 06 communications during transponder blackout
            </p>
          </div>
        </div>

        {/* Radio Playback Trigger */}
        <button
          onClick={handlePlayRadioSimulation}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
            isPlayingAudio
              ? 'bg-status-danger text-white animate-pulse'
              : 'bg-ocean hover:bg-ocean-deep text-white'
          }`}
        >
          {isPlayingAudio ? (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Radio Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Simulate VHF Radio Call</span>
            </>
          )}
        </button>
      </div>

      {/* Waveform Visualization */}
      <div className="p-2.5 bg-ocean-navy text-white rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Disc className={`w-4 h-4 text-ocean-bright ${isPlayingAudio ? 'animate-spin' : ''}`} />
          <span className="text-[10px] font-bold text-ocean-sky">
            {isPlayingAudio ? 'VHF CARRIER AUDIO STREAM ACTIVE' : 'VHF FREQUENCY STANDBY: 156.800 MHz'}
          </span>
        </div>

        {/* Animated Audio Equalizer Bars */}
        <div className="flex items-center gap-1 h-5">
          {[12, 18, 10, 22, 14, 20, 8, 16, 24, 12, 18, 6, 15].map((h, i) => (
            <div
              key={i}
              style={{ height: isPlayingAudio ? `${Math.max(4, (h * Math.random() * 1.5).toFixed(0))}px` : '4px' }}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlayingAudio ? 'bg-ocean-bright' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Transcript Log Stream */}
      <div className="space-y-2">
        {vhfTranscript.map((t, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-border-marine/70 bg-ocean-light/50 space-y-1 font-sans"
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="font-bold text-ocean-deep">{t.sender}</span>
              <div className="flex items-center gap-2 text-text-muted">
                <span>{t.channel}</span>
                <span>{t.time}</span>
              </div>
            </div>

            <p className="text-[11px] text-text-primary leading-relaxed pl-2 border-l-2 border-ocean">
              "{t.msg}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

