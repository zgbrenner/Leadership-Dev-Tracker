import React, { useState } from 'react';
import { ReflectionEntry, ReflectionCategory } from '../types';
import { Plus, Trash2, Calendar, MessageSquare, Brain, Zap } from 'lucide-react';

interface Props {
  entries: ReflectionEntry[];
  onAdd: (entry: ReflectionEntry) => void;
  onDelete: (id: string) => void;
}

export const ReflectionLog: React.FC<Props> = ({ entries, onAdd, onDelete }) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ReflectionCategory>(ReflectionCategory.PROGRESS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry: ReflectionEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      content,
      category,
    };

    onAdd(newEntry);
    setContent('');
  };

  const getCategoryIcon = (cat: ReflectionCategory) => {
    switch(cat) {
        case ReflectionCategory.PROGRESS: return <Brain size={14} />;
        case ReflectionCategory.COMMUNICATION: return <MessageSquare size={14} />;
        case ReflectionCategory.STRESS: return <Zap size={14} />;
        default: return <Brain size={14} />;
    }
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <header>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Weekly Reflection Log</h2>
        <p className="text-slate-500 mt-2 text-lg">Capture your thoughts on leadership, communication, and stress.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 transition-shadow hover:shadow-xl">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Focus Area</label>
            <div className="flex flex-wrap gap-3">
              {Object.values(ReflectionCategory).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    category === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/30'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Reflection</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none h-40 resize-none leading-relaxed transition-all"
              placeholder="What went well? What was challenging? How did you show up as a leader?"
            />
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className="self-end flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus size={18} />
            Log Reflection
          </button>
        </div>
      </form>

      <div className="space-y-5">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Past Reflections</h3>
        {entries.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white/50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <Brain className="text-slate-300" />
            </div>
            <p>No reflections yet.</p>
            <p className="text-sm">Start by adding one above.</p>
          </div>
        ) : (
          entries.slice().reverse().map((entry) => (
            <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-5 group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide border ${
                    entry.category === ReflectionCategory.PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    entry.category === ReflectionCategory.COMMUNICATION ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                    'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {getCategoryIcon(entry.category)}
                    {entry.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                    <Calendar size={14} />
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: 'long', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-base">{entry.content}</p>
              </div>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-all self-start opacity-0 group-hover:opacity-100"
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