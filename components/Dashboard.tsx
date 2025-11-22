import React, { useEffect, useState } from 'react';
import { getFindings, getTrend, getRuns, triggerScan } from '../services/api';
import { Finding, TrendPoint, Severity, Run } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, Activity, Server, Play, Loader2, RefreshCw } from 'lucide-react';

const COLORS = {
  [Severity.High]: '#ef4444',
  [Severity.Medium]: '#f97316',
  [Severity.Low]: '#eab308',
  [Severity.Informational]: '#3b82f6'
};

const Dashboard: React.FC = () => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchData = async () => {
    const [fData, tData, rData] = await Promise.all([
      getFindings(),
      getTrend(),
      getRuns()
    ]);
    setFindings(fData);
    setTrend(tData);
    setRuns(rData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScan = async () => {
    setScanning(true);
    try {
        await triggerScan();
        // Artificial delay for UX if the scan is instant (mock mode)
        setTimeout(async () => {
            await fetchData();
            setScanning(false);
        }, 1500);
    } catch (error) {
        console.error("Scan failed", error);
        setScanning(false);
    }
  };

  // Derived Stats
  const total = findings.length;
  const high = findings.filter(f => f.severity === Severity.High).length;
  const medium = findings.filter(f => f.severity === Severity.Medium).length;
  const low = findings.filter(f => f.severity === Severity.Low).length;

  const pieData = [
    { name: 'High', value: high },
    { name: 'Medium', value: medium },
    { name: 'Low', value: low },
  ];

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center text-slate-500 font-mono"><Loader2 className="animate-spin mr-2" /> LOADING DATA...</div>;
  }

  return (
    <div className="p-6 md:p-12 space-y-8 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Security Overview</h2>
            <p className="text-slate-400 font-mono text-sm">
                LAST RUN: {runs[runs.length-1]?.run_id || 'UNKNOWN'} 
                <span className="mx-2 text-slate-600">|</span> 
                STATUS: <span className="text-green-400">ACTIVE</span>
            </p>
        </div>
        
        <div className="flex gap-3">
            <button 
                onClick={fetchData}
                className="p-3 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Refresh Data"
            >
                <RefreshCw size={20} />
            </button>
            <button 
                onClick={handleScan}
                disabled={scanning}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
                {scanning ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                {scanning ? 'SCANNING...' : 'NEW SCAN'}
            </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard 
          title="TOTAL FINDINGS" 
          value={total} 
          icon={<Server size={24} />} 
          color="text-white" 
          borderColor="border-slate-700"
        />
        <KpiCard 
          title="HIGH SEVERITY" 
          value={high} 
          icon={<AlertTriangle size={24} />} 
          color="text-red-500" 
          borderColor="border-red-500/30"
          bg="bg-red-500/5"
        />
        <KpiCard 
          title="MEDIUM SEVERITY" 
          value={medium} 
          icon={<Activity size={24} />} 
          color="text-orange-500" 
          borderColor="border-orange-500/30"
          bg="bg-orange-500/5"
        />
        <KpiCard 
          title="RUNS COMPLETED" 
          value={runs.length} 
          icon={<CheckCircle size={24} />} 
          color="text-cyan-400" 
          borderColor="border-cyan-500/30"
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Trend Chart */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-slate-900/40">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" />
            Vulnerability Trend
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ fontFamily: 'sans-serif', fontSize: '12px' }}
                    cursor={{ stroke: '#334155', strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{r: 6, fill: '#ef4444'}} />
                <Line type="monotone" dataKey="medium" stroke="#f97316" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="low" stroke="#eab308" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 bg-slate-900/40">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <AlertTriangle size={16} className="text-cyan-400" />
            Severity Distribution
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const KpiCard: React.FC<{title: string, value: number, icon: React.ReactNode, color: string, borderColor: string, bg?: string}> = ({
    title, value, icon, color, borderColor, bg = 'bg-slate-900/50'
}) => (
  <div className={`relative overflow-hidden rounded-xl border ${borderColor} ${bg} p-6 transition-all hover:shadow-lg hover:shadow-black/20`}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-2">{title}</p>
        <h4 className={`text-4xl font-bold tracking-tight ${color}`}>{value}</h4>
      </div>
      <div className={`p-3 rounded-full bg-white/5 ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default Dashboard;