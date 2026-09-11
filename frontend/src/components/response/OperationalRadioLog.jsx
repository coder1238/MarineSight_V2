import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  Clock, 
  Volume2, 
  Filter, 
  User, 
  Plus 
} from 'lucide-react';

const INITIAL_LOGS = [
  { id: '1', time: '14:35:10 IST', channel: 'VHF CH 16', callsign: 'MRCC MUMBAI', message: 'All ships in area 14°45\'N, 068°15\'E: Hydrocarbon discharge reported. Exercise caution and maintain 3 NM clearance.' },
  { id: '2', time: '14:48:22 IST', channel: 'VHF CH 73 (Ops)', callsign: 'DORNIER-751', message: 'Command, this is Dornier-751 on scene. Visual confirmation of dark slick trailing 037 degrees, length 8.4 km. Relaying FLIR coordinates now.' },
  { id: '3', time: '15:10:05 IST', channel: 'VHF CH 73 (Ops)', callsign: 'ICGS SAMUDRA PRAHARI', message: 'Samudra Prahari to Command: On scene at south centroid. Commencing deployment of 400m heavy sweep boom in J-formation.' },
  { id: '4', time: '15:32:40 IST', channel: 'VHF CH 73 (Ops)', callsign: 'SKIMMER ALPHA-2', message: 'Weir skimmer suction pump primed. Recovering medium grade bunker fuel at estimated 42 cubic meters per hour.' }
];

export default function OperationalRadioLog() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [callsign, setCallsign] = useState('COMMAND POST ALPHA');
  const [channel, setChannel] = useState('VHF CH 73 (Ops)');
  const [message, setMessage] = useState('');

  const handleSendLog = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newLog = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      channel,
      callsign,
      message: message.trim()
    };

    setLogs([newLog, ...logs]);
    setMessage('');
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              Tactical Radio Logbook & VHF Comms Feed
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                VHF CH 16 / 73 ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Live chronological communications stream between Incident Command, Vessels, and Airborne Recon.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-status-success font-bold border border-emerald-200">
          ● MONITORING
        </span>
      </div>

      {/* Log Message Input Form */}
      <form onSubmit={handleSendLog} className="p-3 bg-ocean-light/40 border border-border-marine rounded-xl space-y-2 text-xs font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-text-muted uppercase block mb-0.5">Operator Callsign</label>
            <input 
              type="text"
              value={callsign}
              onChange={(e) => setCallsign(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-border-marine bg-white text-xs font-bold text-ocean-navy"
            />
          </div>
          <div>
            <label className="text-[10px] text-text-muted uppercase block mb-0.5">Radio Frequency Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full p-1.5 rounded-lg border border-border-marine bg-white text-xs font-bold text-ocean-navy"
            >
              <option value="VHF CH 73 (Ops)">VHF CH 73 (Tactical Ops)</option>
              <option value="VHF CH 16">VHF CH 16 (International Distress)</option>
              <option value="HF DSC 2182 kHz">HF DSC 2182 kHz (Long Range)</option>
              <option value="SATCOM Alpha">Inmarsat SATCOM Alpha</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <input 
            type="text"
            placeholder="Enter transmission log message (e.g. Booms anchored at Zuari mouth)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-border-marine bg-white text-xs font-sans focus:outline-none focus:ring-1 focus:ring-ocean"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-ocean hover:bg-ocean-deep text-white font-bold text-xs font-mono shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Transmit Log</span>
          </button>
        </div>
      </form>

      {/* Log Feed */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div key={log.id} className="p-2.5 rounded-xl border border-border-marine bg-white text-xs space-y-1 hover:bg-ocean-light/20 transition-colors">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-ocean">{log.callsign}</span>
                <span className="px-1.5 py-0.2 rounded bg-ocean-light text-text-secondary border border-border-marine/50">
                  {log.channel}
                </span>
              </div>
              <span className="text-text-muted">{log.time}</span>
            </div>
            <p className="text-[11px] text-text-primary font-sans leading-relaxed">
              "{log.message}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

