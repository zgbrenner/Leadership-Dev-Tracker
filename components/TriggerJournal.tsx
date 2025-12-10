import React, { useState } from 'react';
import { TriggerEntry } from '../types';
import { AlertCircle, Trash2, Clock, Activity } from 'lucide-react';

interface Props {
  entries: TriggerEntry[];
  onAdd: (entry: TriggerEntry) => void;
  onDelete: (id: string) => void;
}

export const TriggerJournal: React.FC<Props> = ({ entries, onAdd, onDelete }) => {
  const [trigger, setTrigger] = useState('');
  const [notes, setNotes] = useState('');
  const [intensity, setIntensity] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim()) return;

    const newEntry: TriggerEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      trigger,
      notes,
      intensity
    };

    onAdd(newEntry);
    setTrigger('');
    setNotes('');
    setIntensity(5);
  };

  const getIntensityColor = (val: number) => {
    if (val <= 3) return 'bg-emerald-500';
    if (val <= 6) return 'bg-amber-500';
    return 'bg-rose-600';
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Emotional Trigger Journal</h2>
        <p className="text-slate-500 mt-2 text-lg">Track and analyze moments of emotional activation.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">What triggered you?</label>
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
              placeholder="e.g., Unexpected feedback in meeting..."
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Context / Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 outline-none h-32 resize-none transition-all"
              placeholder="How did you react? What was the context?"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
             <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Emotional Intensity</label>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getIntensityColor(intensity)}`}>
                    Level {intensity}
                </span>
             </div>
             <div className="h-12 bg-slate-50 rounded-xl px-4 flex items-center border border-slate-100">
               <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={intensity} 
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
               />
             </div>
             <div className="flex justify-between text-xs text-slate-400 mt-2 px-1">
                <span>Mild Annoyance</span>
                <span>Moderate Frustration</span>
                <span>Overwhelming</span>
             </div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-50">
          <button
            type="submit"
            disabled={!trigger.trim()}
            className="flex items-center gap-2 bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-rose-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Activity size={18} />
            Log Trigger
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="mx-auto w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-3">
                <Activity className="text-rose-300" />
            </div>
            <p>No triggers logged. That's good news!</p>
          </div>
        ) : (
          entries.slice().reverse().map((entry) => (
            <div key={entry.id} className="relative bg-white p-6 pl-8 rounded-2xl shadow-sm border border-slate-100 flex gap-4 group overflow-hidden hover:shadow-md transition-all">
              {/* Intensity Bar Indicator */}
              <div className={`absolute left-0 top-0 bottom-0 w-2 ${getIntensityColor(entry.intensity)}`} />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-slate-800 text-lg">{entry.trigger}</h3>
                   <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Clock size={12} />
                      {new Date(entry.timestamp).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'
                      })}
                   </span>
                </div>
                <p className="text-slate-600 mb-4 leading-relaxed">{entry.notes}</p>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded text-white ${getIntensityColor(entry.intensity)}`}>
                        Intensity: {entry.intensity}/10
                    </span>
                </div>
              </div>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-all self-start opacity-0 group-hover:opacity-100"
                aria-label="Delete entry"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};