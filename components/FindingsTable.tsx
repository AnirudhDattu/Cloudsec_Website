import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFindings } from '../services/api';
import { Finding, Severity } from '../types';
import { ChevronDown, ChevronUp, AlertOctagon, AlertTriangle, Info, Filter, Search, X } from 'lucide-react';

const FindingsTable: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [findings, setFindings] = useState<Finding[]>([]);
  const [filteredFindings, setFilteredFindings] = useState<Finding[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialQuery);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Sync state with URL params if they change externally (e.g., from Navbar)
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    getFindings().then(data => {
        setFindings(data);
        setFilteredFindings(data);
        setLoading(false);
    });
  }, []);

  useEffect(() => {
    let res = findings;

    if (search) {
        const q = search.toLowerCase();
        res = res.filter(f => 
            f.rule_id.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.resource_id.toLowerCase().includes(q) ||
            f.service.toLowerCase().includes(q)
        );
    }

    if (severityFilter !== 'All') {
        res = res.filter(f => f.severity === severityFilter);
    }

    if (serviceFilter !== 'All') {
        res = res.filter(f => f.service === serviceFilter);
    }

    setFilteredFindings(res);
  }, [search, severityFilter, serviceFilter, findings]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearSearch = () => {
    setSearch('');
    setSearchParams({});
  };

  const getSeverityIcon = (s: Severity) => {
    switch(s) {
        case Severity.High: return <AlertOctagon className="text-red-500" size={18} />;
        case Severity.Medium: return <AlertTriangle className="text-orange-500" size={18} />;
        default: return <Info className="text-yellow-500" size={18} />;
    }
  };

  const getSeverityBadge = (s: Severity) => {
    const colors = {
        [Severity.High]: 'bg-red-500/20 text-red-500 border-red-500/30',
        [Severity.Medium]: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
        [Severity.Low]: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
        [Severity.Informational]: 'bg-blue-500/20 text-blue-500 border-blue-500/30'
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-mono border ${colors[s]} uppercase tracking-wide`}>
            {s}
        </span>
    );
  };

  const uniqueServices = Array.from(new Set(findings.map(f => f.service)));

  if (loading) return <div className="p-12 text-center font-mono text-cyber-cyan">FETCHING_DATA...</div>;

  return (
    <div className="p-6 md:p-12 h-full overflow-hidden flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-white">FINDINGS EXPLORER</h2>
            <p className="text-slate-400 font-mono text-sm mt-1">{filteredFindings.length} ISSUES DETECTED</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Search Rule ID or Resource..." 
                    className="bg-slate-900 border border-slate-700 text-white pl-10 pr-8 py-2 rounded focus:border-cyber-cyan focus:outline-none font-mono text-sm w-64 transition-colors"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if(e.target.value === '') setSearchParams({});
                        else setSearchParams({q: e.target.value});
                    }}
                />
                {search && (
                    <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        <X size={14} />
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded px-3">
                <Filter size={14} className="text-slate-400" />
                <select 
                    className="bg-transparent text-white text-sm py-2 focus:outline-none"
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                >
                    <option value="All">All Severities</option>
                    <option value={Severity.High}>High</option>
                    <option value={Severity.Medium}>Medium</option>
                    <option value={Severity.Low}>Low</option>
                </select>
            </div>

            <select 
                className="bg-slate-900 border border-slate-700 text-white text-sm px-3 py-2 rounded focus:outline-none focus:border-cyber-cyan"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
            >
                <option value="All">All Services</option>
                {uniqueServices.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto border border-slate-800 rounded-lg bg-slate-900/50 backdrop-blur-sm custom-scrollbar">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 sticky top-0 z-10">
                <tr>
                    <th className="p-4 text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800">SEVERITY</th>
                    <th className="p-4 text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800">RULE ID</th>
                    <th className="p-4 text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800">SERVICE</th>
                    <th className="p-4 text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800">DESCRIPTION</th>
                    <th className="p-4 text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800 w-10"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {filteredFindings.length > 0 ? (
                    filteredFindings.map(finding => (
                    <React.Fragment key={finding.id}>
                        <tr 
                            onClick={() => toggleExpand(finding.id)}
                            className={`
                                cursor-pointer transition-colors hover:bg-slate-800/50 
                                ${expandedId === finding.id ? 'bg-slate-800/80' : ''}
                            `}
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    {getSeverityIcon(finding.severity)}
                                    {getSeverityBadge(finding.severity)}
                                </div>
                            </td>
                            <td className="p-4 font-mono text-cyber-cyan text-sm">{finding.rule_id}</td>
                            <td className="p-4 text-slate-300 text-sm">{finding.service}</td>
                            <td className="p-4 text-slate-300 text-sm font-medium">{finding.description}</td>
                            <td className="p-4 text-slate-500">
                                {expandedId === finding.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </td>
                        </tr>
                        {expandedId === finding.id && (
                            <tr className="bg-slate-950/50">
                                <td colSpan={5} className="p-0">
                                    <div className="p-6 border-b border-slate-800 border-l-4 border-l-cyber-cyan animate-fade-in">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Affected Resource</h4>
                                                <p className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded border border-slate-800 break-all mb-6">
                                                    {finding.resource_id}
                                                </p>

                                                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Remediation</h4>
                                                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded border border-slate-800">
                                                    {finding.remediation_steps}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">Technical Evidence</h4>
                                                <pre className="font-mono text-xs text-green-400 bg-black/50 p-4 rounded border border-slate-800 overflow-auto h-full max-h-64 custom-scrollbar">
                                                    {JSON.stringify(finding.evidence, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))) : (
                    <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-500 font-mono">
                            NO DATA MATCHING "{search}"
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default FindingsTable;