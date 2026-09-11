import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Tag,
  ShieldAlert
} from 'lucide-react';

const INITIAL_DIRECTIVES = [
  {
    id: 'DIR-01',
    division: 'Division B: Nearshore Shield',
    title: 'Deploy 2.4 km Ocean Curtain Boom across Zuari Estuary',
    priority: 'CRITICAL',
    badge: 'bg-red-100 text-status-danger border-red-300',
    assignedUnit: 'Tug Sagar Kanya & ICGS C-401',
    status: 'In Progress',
    desc: 'Establish J-configuration deflection barrier across mouth of Zuari Estuary to shield sensitive juvenile fish nursery.'
  },
  {
    id: 'DIR-02',
    division: 'Division A: Offshore Recovery',
    title: 'Flotilla Centroid Interception & Weir Skimming',
    priority: 'HIGH',
    badge: 'bg-amber-100 text-status-warning border-amber-300',
    assignedUnit: 'ICGS Samudra Prahari & Skimmer Alpha-2',
    status: 'In Progress',
    desc: 'Execute coordinated sweep across thick slick sector (14.82°N, 68.21°E) using tandem dynamic skimming arms.'
  },
  {
    id: 'DIR-03',
    division: 'Air Operations',
    title: 'Continuous SLAR & Infrared Drone Reconnaissance',
    priority: 'HIGH',
    badge: 'bg-amber-100 text-status-warning border-amber-300',
    assignedUnit: 'Dornier 228 (CG-751) & Drone Strike Unit',
    status: 'Completed',
    desc: 'Update slick boundary GIS polygon and vector shear every 3 hours; transmit geo-referenced thermal mosaics to ICP.'
  },
  {
    id: 'DIR-04',
    division: 'Environmental & Wildlife',
    title: 'Pre-position Sorbent Rolls & Wildlife Triage at Galgibaga',
    priority: 'HIGH',
    badge: 'bg-amber-100 text-status-warning border-amber-300',
    assignedUnit: 'Goa Coastal Ecology Taskforce (Unit 4)',
    status: 'Pending',
    desc: 'Establish veterinary stabilization pens and deployment of hydro-absorbent booms along 4.8 km nesting dunes.'
  },
  {
    id: 'DIR-05',
    division: 'Division B: Nearshore Shield',
    title: 'Install Pneumatic Bubble Barrier at Port Channel Gate',
    priority: 'MEDIUM',
    badge: 'bg-blue-100 text-ocean border-blue-300',
    assignedUnit: 'Mormugao Port Authority Engineering',
    status: 'Pending',
    desc: 'Activate submerged perforated air manifold to prevent slick ingress into industrial berths without halting cargo traffic.'
  }
];

export const DIVISIONS = [
  'All Divisions',
  'Division A: Offshore Recovery',
  'Division B: Nearshore Shield',
  'Air Operations',
  'Environmental & Wildlife'
];

export default function Ics204TaskDirectives() {
  const [directives, setDirectives] = useState(INITIAL_DIRECTIVES);
  const [activeDivision, setActiveDivision] = useState('All Divisions');
  const [showAddForm, setShowAddForm] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDivision, setNewDivision] = useState('Division A: Offshore Recovery');
  const [newPriority, setNewPriority] = useState('HIGH');
  const [newUnit, setNewUnit] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filtered = activeDivision === 'All Divisions'
    ? directives
    : directives.filter(d => d.division === activeDivision);

  const completedCount = directives.filter(d => d.status === 'Completed').length;
  const progressPercent = Math.round((completedCount / directives.length) * 100);

  const toggleTaskStatus = (id) => {
    setDirectives(prev => prev.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === 'Completed' ? 'In Progress' : 'Completed';
        return { ...d, status: nextStatus };
      }
      return d;
    }));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let badge = 'bg-blue-100 text-ocean border-blue-300';
    if (newPriority === 'CRITICAL') badge = 'bg-red-100 text-status-danger border-red-300';
    if (newPriority === 'HIGH') badge = 'bg-amber-100 text-status-warning border-amber-300';

    const newTask = {
      id: `DIR-0${directives.length + 1}`,
      division: newDivision,
      title: newTitle.trim(),
      priority: newPriority,
      badge,
      assignedUnit: newUnit.trim() || 'Command Post Reserve',
      status: 'In Progress',
      desc: newDesc.trim() || 'Execute tactical response per ICS-204 task directive specifications.'
    };

    setDirectives([...directives, newTask]);
    setNewTitle('');
    setNewUnit('');
    setNewDesc('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white border border-border-marine rounded-2xl p-4 shadow-marine-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-marine">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ocean/10 text-ocean">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-ocean-navy uppercase tracking-wider font-mono flex items-center gap-2">
              ICS-204 Tactical Work Assignments & Task Directives
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-ocean-light text-ocean border border-border-marine">
                {completedCount}/{directives.length} COMPLETED ({progressPercent}%)
              </span>
            </h3>
            <p className="text-[11px] text-text-secondary">
              Assignment of tactical resources, divisions, and operational directives.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="py-1 px-2.5 rounded-lg bg-ocean hover:bg-ocean-deep text-white text-[10px] font-mono font-bold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Tactical Task</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border-marine/50 h-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-ocean to-status-success rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Division Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {DIVISIONS.map(div => (
          <button
            key={div}
            onClick={() => setActiveDivision(div)}
            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border transition-all ${
              activeDivision === div
                ? 'bg-ocean-navy text-white border-ocean-navy shadow-sm'
                : 'bg-ocean-light/40 hover:bg-ocean-light text-text-secondary border-border-marine'
            }`}
          >
            {div}
          </button>
        ))}
      </div>

      {/* Add Task Form (Expandable) */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="p-3 bg-ocean-light/50 border border-border-marine rounded-xl space-y-2 text-xs">
          <span className="font-bold font-mono text-ocean-navy text-[11px] block">Create New ICS-204 Directive</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input 
              type="text"
              placeholder="Task Title (e.g. Deploy sorbent sweep...)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="sm:col-span-2 p-2 rounded-lg border border-border-marine bg-white focus:outline-none focus:ring-1 focus:ring-ocean"
            />
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="p-2 rounded-lg border border-border-marine bg-white font-mono"
            >
              <option value="CRITICAL">Priority: CRITICAL</option>
              <option value="HIGH">Priority: HIGH</option>
              <option value="MEDIUM">Priority: MEDIUM</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={newDivision}
              onChange={(e) => setNewDivision(e.target.value)}
              className="p-2 rounded-lg border border-border-marine bg-white font-mono"
            >
              <option value="Division A: Offshore Recovery">Division A: Offshore Recovery</option>
              <option value="Division B: Nearshore Shield">Division B: Nearshore Shield</option>
              <option value="Air Operations">Air Operations</option>
              <option value="Environmental & Wildlife">Environmental & Wildlife</option>
            </select>
            <input 
              type="text"
              placeholder="Assigned Unit / Vessel (e.g. Skimmer Barge A-2)"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              className="p-2 rounded-lg border border-border-marine bg-white"
            />
          </div>
          <textarea
            placeholder="Operational Instructions & Sector Coordinates..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full p-2 rounded-lg border border-border-marine bg-white focus:outline-none focus:ring-1 focus:ring-ocean"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 rounded-lg border border-border-marine text-text-secondary text-[11px] font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded-lg bg-ocean text-white text-[11px] font-mono font-bold shadow-sm"
            >
              Save Directive
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((d) => {
          const isDone = d.status === 'Completed';
          return (
            <div
              key={d.id}
              onClick={() => toggleTaskStatus(d.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                isDone 
                  ? 'bg-ocean-light/20 border-border-marine opacity-75' 
                  : 'bg-white hover:bg-ocean-light/30 border-border-marine shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskStatus(d.id);
                  }}
                  className="mt-0.5 text-ocean"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-status-success" />
                  ) : (
                    <Square className="w-4 h-4 text-text-muted hover:text-ocean" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono">
                    <span className="font-bold text-ocean text-xs">{d.id}</span>
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-text-muted' : 'text-ocean-navy'}`}>
                      {d.title}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${d.badge}`}>
                      {d.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed font-sans">
                    {d.desc}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-text-muted pt-1">
                    <span>UNIT: <strong className="text-ocean-navy">{d.assignedUnit}</strong></span>
                    <span>DIV: <em>{d.division}</em></span>
                    <span className={`font-bold ${isDone ? 'text-status-success' : 'text-status-warning'}`}>
                      ● {d.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

