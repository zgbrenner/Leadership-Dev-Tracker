import React, { useState } from 'react';
import { AccomplishmentEntry } from '../types';
import { Award, Trash2, CheckCircle2, Star } from 'lucide-react';

interface Props {
  entries: AccomplishmentEntry[];
  onAdd: (entry: AccomplishmentEntry) => void;
  onDelete: (id: string) => void;
}

export const AccomplishmentTracker: React.FC<Props> = ({ entries, onAdd, onDelete }) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEntry: AccomplishmentEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      title,
      details,
    };

    onAdd(newEntry);
    setTitle('');
    setDetails('');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Accomplishment Tracker</h2>
        <p className="text-slate-500 mt-2 text-lg">Celebrate your wins and record positive feedback.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Accomplishment / Win</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="e.g., Successfully led the quarterly review..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Details (Optional)</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none h-24 resize-none transition-all"
              placeholder="Why was this significant?"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-50">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Award size={18} />
            Log Win
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {entries.length === 0 ? (
           <div className="text-center py-16 text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <Star className="text-emerald-300" />
            </div>
            <p>No accomplishments logged yet.</p>
          </div>
        ) : (
          entries.slice().reverse().map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 group hover:shadow-md hover:border-emerald-100 transition-all duration-300">
              <div className="mt-1 w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Award size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg">{entry.title}</h3>
                {entry.details && <p className="text-slate-600 mt-2 leading-relaxed">{entry.details}</p>}
                <p className="text-xs font-semibold text-slate-400 mt-3 uppercase tracking-wider">
                   {new Date(entry.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
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