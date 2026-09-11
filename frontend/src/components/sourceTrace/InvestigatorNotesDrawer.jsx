import React, { useState, useEffect } from 'react';
import { Edit3, Plus, Trash2, Tag, Clock, User, X, Check, FileText } from 'lucide-react';

export default function InvestigatorNotesDrawer({
  isOpen,
  onClose,
  incidentId = "OF-2026-0912"
}) {
  const storageKey = `source_trace_notes_${incidentId}`;

  const defaultNotes = [
    {
      id: "note-1",
      timestamp: "04 SEP 2026, 06:15 UTC",
      author: "Cmdr. K. Sharma (ICG OPS)",
      tag: "CORROBORATION",
      content: "Backward Lagrangian trajectory converges cleanly with MV OCEAN STAR AIS dark gap window (20:15 - 00:45 UTC). Closest Point of Approach was 1.4 NM from Zone A centroid."
    },
    {
      id: "note-2",
      timestamp: "04 SEP 2026, 08:30 UTC",
      author: "Forensic Analyst A. Sen",
      tag: "SATELLITE MATCH",
      content: "Sentinel-1 SAR VV-polarization image acquired at 01:22 UTC shows dark slick tail pointing exactly along 284° heading of MV OCEAN STAR."
    }
  ];

  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultNotes;
  });

  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('OBSERVATION');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes, storageKey]);

  if (!isOpen) return null;

  const handleAddNote = () => {
    if (!newContent.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toUTCString().replace("GMT", "UTC"),
      author: "Investigator (Maritime Intelligence Unit)",
      tag: newTag,
      content: newContent.trim()
    };
    setNotes([newNote, ...notes]);
    setNewContent('');
  };

  const handleDelete = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ocean-navy/60 backdrop-blur-xs">
      <div className="bg-white border border-border-marine rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-border-marine flex items-center justify-between bg-ocean-navy text-white">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-ocean-sky" />
            <div>
              <h3 className="font-bold text-sm">Forensic Case Notes & Evidence Annotation Log</h3>
              <p className="text-[11px] text-slate-300 font-mono">Incident #{incidentId} · Auto-saved to LocalStorage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Note Form */}
        <div className="p-4 border-b border-border-marine bg-slate-50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ocean-navy uppercase">Add New Log Entry</span>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <Tag className="w-3 h-3 text-text-muted" />
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-white border border-border-marine rounded px-2 py-0.5 text-xs font-bold text-ocean-navy focus:outline-none focus:border-ocean"
              >
                <option value="OBSERVATION">OBSERVATION</option>
                <option value="CORROBORATION">CORROBORATION</option>
                <option value="SATELLITE MATCH">SATELLITE MATCH</option>
                <option value="INTERCEPTION ORDER">INTERCEPTION ORDER</option>
                <option value="LAB ANALYSIS">LAB ANALYSIS</option>
              </select>
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Type forensic observation, suspect corroboration details, or interdiction orders..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="w-full text-xs font-mono p-2.5 rounded-xl border border-border-marine bg-white focus:outline-none focus:border-ocean text-ocean-navy resize-none"
          />

          <div className="flex justify-end">
            <button
              onClick={handleAddNote}
              disabled={!newContent.trim()}
              className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Entry</span>
            </button>
          </div>
        </div>

        {/* Existing Notes List */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-border-marine/50 flex-1">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-xs font-mono">
              No investigator notes recorded yet. Add one above.
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="font-bold text-ocean-navy flex items-center gap-1">
                      <User className="w-3 h-3 text-ocean" />
                      {note.author}
                    </span>
                    <span className="text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {note.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-ocean-sky/40 text-ocean-deep font-bold border border-ocean/30">
                      {note.tag}
                    </span>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-text-muted hover:text-rose-600 transition-colors p-0.5"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-secondary font-mono leading-relaxed bg-ocean-light/30 p-2.5 rounded-xl border border-border-marine/40">
                  {note.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-border-marine flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">
            {notes.length} notes stored locally in browser
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-ocean hover:bg-ocean-deep text-white text-xs font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

