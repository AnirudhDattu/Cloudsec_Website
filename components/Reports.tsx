import React, { useState, useEffect } from 'react';
import { getRuns, generateReport } from '../services/api';
import { Run } from '../types';
import { FileText, Download, Calendar, CheckCircle, Loader2 } from 'lucide-react';

const Reports: React.FC = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedRun, setSelectedRun] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getRuns().then(data => {
        setRuns(data);
        if(data.length > 0) setSelectedRun(data[data.length-1].run_id);
    });
  }, []);

  const handleGenerate = async () => {
    if(!selectedRun) return;
    setGenerating(true);
    try {
        const { url } = await generateReport(selectedRun);
        // Simulate download in demo
        setTimeout(() => {
            alert(`Report for ${selectedRun} generated successfully. In a real app, this would download the PDF.`);
            setGenerating(false);
        }, 1000);
    } catch (e) {
        setGenerating(false);
    }
  };

  return (
    <div className="p-6 md:p-12 flex flex-col items-center justify-center h-full animate-fade-in">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
            <div className="inline-flex p-4 rounded-full bg-slate-800/50 border border-slate-700 mb-6">
                <FileText size={48} className="text-cyber-cyan" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">COMPLIANCE REPORTS</h2>
            <p className="text-slate-400">Generate detailed PDF summaries of security scans for audit and remediation tracking.</p>
        </div>

        <div className="glass-panel p-8 rounded-xl border border-slate-700 shadow-2xl">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Select Scan Run</label>
            <div className="relative mb-8">
                <select 
                    className="w-full bg-slate-900 border border-slate-600 text-white p-4 rounded text-lg focus:border-cyber-cyan focus:outline-none appearance-none"
                    value={selectedRun}
                    onChange={(e) => setSelectedRun(e.target.value)}
                >
                    {runs.map(run => (
                        <option key={run.run_id} value={run.run_id}>
                            {run.run_id} ({new Date(run.timestamp).toLocaleDateString()}) - {run.total_findings} Findings
                        </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <Calendar size={20} />
                </div>
            </div>

            <button 
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-cyber-cyan hover:bg-cyan-400 text-slate-900 font-bold py-4 rounded transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {generating ? <Loader2 className="animate-spin" /> : <Download />}
                {generating ? 'GENERATING PDF...' : 'EXPORT REPORT'}
            </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded border border-slate-800 bg-slate-900/30 flex items-center gap-3 text-slate-400">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm">ISO 27001 Format</span>
            </div>
            <div className="p-4 rounded border border-slate-800 bg-slate-900/30 flex items-center gap-3 text-slate-400">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm">Executive Summary</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;