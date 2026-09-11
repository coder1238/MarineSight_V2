import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Tag, Trash2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function InvestigatorLogbookCard({ vessel }) {
  const storageKey = `marinesight_vessel_notes_${vessel.mmsi}`;
  
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load saved notes", e);
    }
    return [
      {
        id: 1,
        time: "11 SEP 2026, 22:45 UTC",
        author: "Forensics Lead (Dr. E. Vance)",
        text: "Speed drop to 3.8 kn precisely matches centroid origin of the 14.7 km² hydrocarbon slick. Recommend immediate transponder log impound upon berthing.",
        tags: ["#AISBlackout", "#SpeedDrop", "#CriticalPriority"]
      }
    ];
  });

  const [newNoteText, setNewNoteText] = useState('');
  const [selectedTag, setSelectedTag] = useState('#AISBlackout');
  const [investigationStatus, setInvestigationStatus] = useState("Under Surveillance");

  const quickTags = ["#AISBlackout", "#SpeedDrop", "#OWSDefect", "#CoastGuardIntercept", "#FlagStateAudit", "#SampleMatch"];

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.warn("Could not save notes", e);
    }
  }, [notes, storageKey]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newEntry = {
      id: Date.now(),
      time: new Date().toUTCString().slice(5, 22) + " UTC",
      author: "Investigator Sentry",
      text: newNoteText.trim(),
      tags: [selectedTag]
    };

    setNotes([newEntry, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-ocean-navy uppercase tracking-wider">
              Forensic Evidence & Investigator Annotation Logbook
            </h3>
            <p className="text-[10px] text-text-secondary font-sans">
              Chain-of-custody case notes with browser local storage synchronization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-muted">CASE STATUS:</span>
          <select
            value={investigationStatus}
            onChange={(e) => setInvestigationStatus(e.target.value)}
            className="p-1 bg-ocean-light border border-border-marine rounded text-[10px] font-bold text-ocean-deep focus:outline-none"
          >
            <option value="Under Surveillance">Under Surveillance</option>
            <option value="Pending Interception">Pending Interception</option>
            <option value="Referred to Prosecutor">Referred to Prosecutor</option>
            <option value="Cleared">Cleared</option>
          </select>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAddNote} className="space-y-2">
        <textarea
          rows={2}
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder={`Add forensic annotation for ${vessel.name} (e.g. verified engine log discrepancy, witness testimony)...`}
          className="w-full p-2.5 bg-ocean-light border border-border-marine rounded-xl text-xs text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-ocean/40 font-mono resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Tag Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            <Tag className="w-3 h-3 text-text-muted" />
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  selectedTag === tag
                    ? 'bg-ocean text-white font-bold'
                    : 'bg-ocean-light text-text-secondary hover:bg-ocean-sky'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={!newNoteText.trim()}
            className="px-3 py-1.5 rounded-lg bg-ocean hover:bg-ocean-deep disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Send className="w-3 h-3" />
            <span>Save Entry</span>
          </button>
        </div>
      </form>

      {/* Log Entries List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-[11px] text-text-muted font-sans text-center py-4">
            No notes recorded for this vessel yet. Add your first forensic note above.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-2.5 rounded-xl border border-border-marine/60 bg-ocean-light/40 space-y-1 group"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-ocean-navy">{note.author}</span>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">{note.time}</span>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-status-danger p-0.5 transition-opacity"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-text-primary font-sans leading-relaxed">
                {note.text}
              </p>

              <div className="flex items-center gap-1 pt-0.5">
                {note.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-1.5 py-0.2 rounded bg-ocean-sky text-ocean-deep font-bold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

