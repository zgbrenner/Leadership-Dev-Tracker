import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { AppState } from '../types';
import { generateLeadershipInsights } from '../services/geminiService';
import { Sparkles, Loader2, BarChart3, Target, Zap } from 'lucide-react';

interface Props {
  state: AppState;
}

export const Dashboard: React.FC<Props> = ({ state }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Helper to get ISO week number
  const getWeekNumber = (d: Date) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `W${weekNo}`;
  };

  const chartData = useMemo(() => {
    const dataMap: Record<string, { name: string; reflections: number; triggers: number; accomplishments: number }> = {};
    
    // Process all entries to group by week
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - (i * 7));
        const weekLabel = getWeekNumber(d);
        dataMap[weekLabel] = { name: weekLabel, reflections: 0, triggers: 0, accomplishments: 0 };
    }

    [...state.reflections].forEach(item => {
        const key = getWeekNumber(new Date(item.date));
        if (dataMap[key]) dataMap[key].reflections++;
    });
    
    [...state.triggers].forEach(item => {
        const key = getWeekNumber(new Date(item.timestamp));
        if (dataMap[key]) dataMap[key].triggers++;
    });

    [...state.accomplishments].forEach(item => {
        const key = getWeekNumber(new Date(item.date));
        if (dataMap[key]) dataMap[key].accomplishments++;
    });

    return Object.values(dataMap);
  }, [state]);

  const handleGenerateInsight = async () => {
    setIsLoadingInsight(true);
    setInsight(null);
    const result = await generateLeadershipInsights(state.reflections, state.triggers, state.accomplishments);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Progress Dashboard</h2>
          <p className="text-slate-500 mt-1">Your leadership journey at a glance.</p>
        </div>
        <button
          onClick={handleGenerateInsight}
          disabled={isLoadingInsight}
          className="group relative inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-wait overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative flex items-center gap-2 font-medium text-sm">
            {isLoadingInsight ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} className="text-indigo-300 group-hover:text-white" />}
            {isLoadingInsight ? 'Analyzing data...' : 'Generate AI Insights'}
          </span>
        </button>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 size={64} className="text-indigo-600" />
              </div>
              <div className="flex items-center gap-4 mb-3">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <BarChart3 size={24} />
                 </div>
                 <span className="text-slate-500 font-medium">Reflections</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-800">{state.reflections.length}</span>
                <span className="text-sm text-slate-400">entries</span>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={64} className="text-emerald-600" />
              </div>
              <div className="flex items-center gap-4 mb-3">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Target size={24} />
                 </div>
                 <span className="text-slate-500 font-medium">Wins</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-800">{state.accomplishments.length}</span>
                <span className="text-sm text-slate-400">celebrated</span>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={64} className="text-rose-600" />
              </div>
              <div className="flex items-center gap-4 mb-3">
                 <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                    <Zap size={24} />
                 </div>
                 <span className="text-slate-500 font-medium">Triggers</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-slate-800">{state.triggers.length}</span>
                <span className="text-sm text-slate-400">logged</span>
              </div>
          </div>
      </div>

      {insight && (
        <div className="relative bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-8 shadow-sm border border-indigo-100/50">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-400 to-indigo-600 rounded-l-2xl"></div>
            <h3 className="text-indigo-900 font-bold mb-4 flex items-center gap-2 text-lg">
                <Sparkles size={20} className="text-indigo-600 fill-indigo-200"/> 
                AI Leadership Coach Analysis
            </h3>
            <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                {insight}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Volume Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-800">Weekly Activity</h3>
            <div className="flex gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>Reflections</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Wins</span>
                <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>Triggers</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="reflections" fill="#6366f1" radius={[4, 4, 4, 4]} maxBarSize={40} />
                <Bar dataKey="accomplishments" fill="#10b981" radius={[4, 4, 4, 4]} maxBarSize={40} />
                <Bar dataKey="triggers" fill="#f43f5e" radius={[4, 4, 4, 4]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Consistency Trend */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-8">Reflection Consistency</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorReflections" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="reflections" 
                    stroke="#6366f1" 
                    strokeWidth={4} 
                    dot={{r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1'}} 
                    activeDot={{r: 7, strokeWidth: 0, fill: '#6366f1'}} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};