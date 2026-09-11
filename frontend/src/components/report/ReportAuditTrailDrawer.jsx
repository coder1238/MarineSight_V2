import React, { useState } from 'react';
import { History, X, Download, Trash2, ShieldCheck, Clock } from 'lucide-react';

export default function ReportAuditTrailDrawer({ logs, onClearLogs, isOpen, onClose }) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExportAudit = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.action}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensic-session-audit-${new Date().toISOString().slice(0, 10)}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="bg-white border-l border-border-marine w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-ocean" />
            <h3 className="font-bold text-sm text-ocean-navy font-mono uppercase">
              Forensic Session Audit Trail
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-ocean-light text-text-muted hover:text-ocean-navy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-3 bg-ocean-light/50 border-b border-border-marine flex items-center justify-between gap-2 text-xs font-mono">
          <span className="text-[10px] text-text-muted">Total Events: {logs.length}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAudit}
              className="px-2 py-1 rounded bg-white hover:bg-ocean-sky border border-border-marine text-ocean font-bold flex items-center gap-1 shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>{downloadSuccess ? 'Exported!' : 'Export Log'}</span>
            </button>
            <button
              onClick={onClearLogs}
              className="px-2 py-1 rounded bg-white hover:bg-red-50 border border-border-marine text-status-danger font-bold flex items-center gap-1 shadow-xs"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 font-mono text-xs divide-y divide-border-marine/40">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-text-muted">
              No session actions recorded yet.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="pt-2 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-ocean" />
                    {log.timestamp}
                  </span>
                  <span className="text-emerald-700 font-semibold">✓ Logged</span>
                </div>
                <div className="text-ocean-navy font-sans text-xs">
                  {log.action}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

