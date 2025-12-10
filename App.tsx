import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  AlertCircle, 
  Award, 
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { AppView, AppState, ReflectionEntry, TriggerEntry, AccomplishmentEntry } from './types';
import { loadState, saveState } from './services/storageService';
import { ReflectionLog } from './components/ReflectionLog';
import { TriggerJournal } from './components/TriggerJournal';
import { AccomplishmentTracker } from './components/AccomplishmentTracker';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [state, setState] = useState<AppState>(loadState());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleAddReflection = (entry: ReflectionEntry) => {
    setState(prev => ({ ...prev, reflections: [...prev.reflections, entry] }));
  };

  const handleDeleteReflection = (id: string) => {
    setState(prev => ({ ...prev, reflections: prev.reflections.filter(r => r.id !== id) }));
  };

  const handleAddTrigger = (entry: TriggerEntry) => {
    setState(prev => ({ ...prev, triggers: [...prev.triggers, entry] }));
  };

  const handleDeleteTrigger = (id: string) => {
    setState(prev => ({ ...prev, triggers: prev.triggers.filter(t => t.id !== id) }));
  };

  const handleAddAccomplishment = (entry: AccomplishmentEntry) => {
    setState(prev => ({ ...prev, accomplishments: [...prev.accomplishments, entry] }));
  };

  const handleDeleteAccomplishment = (id: string) => {
    setState(prev => ({ ...prev, accomplishments: prev.accomplishments.filter(a => a.id !== id) }));
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.REFLECTIONS, label: 'Reflection Log', icon: BookOpen },
    { id: AppView.TRIGGERS, label: 'Trigger Journal', icon: AlertCircle },
    { id: AppView.ACCOMPLISHMENTS, label: 'Wins & Growth', icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-1.5 rounded-lg text-white">
                <TrendingUp size={18} />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">Leader Dev</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 hover:text-indigo-600 transition-colors">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-20 w-72 bg-slate-900 text-slate-300 transform transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
        md:relative md:translate-x-0 shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
            <div className="p-8">
            <div className="flex items-center gap-3 mb-10 text-white">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <TrendingUp size={20} className="text-white" strokeWidth={3} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white leading-none">Leader Dev</h1>
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Tracker</span>
                </div>
            </div>
            
            <nav className="space-y-2">
                {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => {
                        setView(item.id);
                        setIsMobileMenuOpen(false);
                    }}
                    className={`w-full group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                    view === item.id 
                        ? 'text-white bg-white/10 shadow-inner' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {view === item.id && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-purple-400" />
                    )}
                    <item.icon 
                        size={20} 
                        className={`transition-colors ${view === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                    />
                    {item.label}
                </button>
                ))}
            </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-800">
                        ME
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">My Growth</p>
                        <p className="text-xs text-slate-500 truncate">Keep evolving.</p>
                    </div>
                </div>
            </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-10 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen scroll-smooth">
        <div className="max-w-5xl mx-auto p-4 md:p-10 pb-20">
          {view === AppView.DASHBOARD && <Dashboard state={state} />}
          {view === AppView.REFLECTIONS && (
            <ReflectionLog 
              entries={state.reflections} 
              onAdd={handleAddReflection} 
              onDelete={handleDeleteReflection} 
            />
          )}
          {view === AppView.TRIGGERS && (
            <TriggerJournal 
              entries={state.triggers} 
              onAdd={handleAddTrigger} 
              onDelete={handleDeleteTrigger} 
            />
          )}
          {view === AppView.ACCOMPLISHMENTS && (
            <AccomplishmentTracker 
              entries={state.accomplishments} 
              onAdd={handleAddAccomplishment} 
              onDelete={handleDeleteAccomplishment} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;