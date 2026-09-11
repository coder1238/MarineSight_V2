import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Tag, Clock, Check, AlertCircle } from 'lucide-react';

const DEFAULT_NOTES = [
  {
    id: 'NOTE-1',
    author: 'Dr. E. Vance',
    tag: 'CRITICAL',
    timestamp: '05 SEP 2026, 16:10 UTC',
    content: 'Master of suspect vessel claimed transponder failure was due to antenna feeder coaxial cable short-circuit during squall. Requesting engine room maintenance logbook and voyage data recorder (VDR) freeze.'
  },
  {
    id: 'NOTE-2',
    author: 'Insp. K. Nair (PSC)',
    tag: 'ADVISORY',
    timestamp: '05 SEP 2026, 16:45 UTC',
    content: 'Port State Control in Mormugao notified. Vessel scheduled to anchor at outer anchorage tomorrow 06:00 IST. Boarding party team Alpha assembled for oil-water separator (OWS) sampling.'
  }
];

export default function ReportInvestigatorNotes({ incidentId, onLogAudit }) {
  const storageKey = `marine_notes_${incidentId}`;
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_NOTES;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('CRITICAL');
  const [newAuthor, setNewAuthor] = useState('Duty Forensics Officer');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const note = {
      id: `NOTE-${Date.now()}`,
      author: newAuthor,
      tag: newTag,
      timestamp: new Date().toUTCString(),
      content: newContent.trim()
    };

    const updated = [note, ...notes];
    setNotes(updated);
    setNewContent('');
    setIsAdding(false);
    if (onLogAudit) onLogAudit(`Added investigator note [${newTag}]: "${note.content.slice(0, 30)}..."`);
  };

  const handleDeleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (onLogAudit) onLogAudit(`Deleted investigator note ${id}`);
  };

  const getTagColor = (tag) => {
    switch (tag) {
      case 'CRITICAL': return 'bg-red-50 text-status-danger border-red-200';
      case 'ADVISORY': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white border border-border-marine rounded-xl p-4 shadow-marine-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ocean-navy uppercase font-mono tracking-wider">
              Investigator Annotations & Field Intelligence Notes
            </h4>
            <p className="text-[10px] text-text-muted">
              Official investigator remarks, verbal interview transcripts, and boarding inspection coordination.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2.5 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Cancel' : 'Add Field Note'}</span>
        </button>
      </div>

      {/* Add note input form */}
      {isAdding && (
        <form onSubmit={handleAddNote} className="p-3 bg-ocean-light/50 border border-border-marine rounded-xl space-y-2 text-xs font-mono animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Investigator Name / Badge"
              value={newAuthor}
              onChange={(e) => setNewAuthor(e.target.value)}
              className="px-2 py-1 bg-white border border-border-marine rounded text-xs focus:outline-none w-48"
            />
            <select
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="px-2 py-1 bg-white border border-border-marine rounded text-xs focus:outline-none font-bold"
            >
              <option value="CRITICAL">🔴 CRITICAL EVIDENCE</option>
              <option value="ADVISORY">🟡 ADVISORY / PSC</option>
              <option value="INFO">🔵 GENERAL OBSERVATION</option>
            </select>
          </div>

          <textarea
            rows="2"
            placeholder="Record witness testimony, VDR data status, or oil sampling log..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            required
            className="w-full p-2 bg-white border border-border-marine rounded-lg font-sans text-xs focus:ring-1 focus:ring-ocean outline-none"
          />

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-ocean text-white font-bold hover:bg-ocean-deep"
            >
              Post Note
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {notes.map(n => (
          <div key={n.id} className="p-3 bg-ocean-light/30 border border-border-marine rounded-xl space-y-2 text-xs flex flex-col justify-between hover:bg-ocean-light/50 transition-colors">
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-border-marine/50">
                <span className="font-bold text-ocean-navy font-mono text-[11px]">{n.author}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold font-mono border ${getTagColor(n.tag)}`}>
                  {n.tag}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary font-sans leading-relaxed mt-2">
                {n.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border-marine/40 text-[10px] text-text-muted font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-ocean" />
                {n.timestamp}
              </span>
              <button
                onClick={() => handleDeleteNote(n.id)}
                className="text-gray-400 hover:text-status-danger p-0.5"
                title="Delete note"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

