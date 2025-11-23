// components/APIDocs.tsx

import React from "react";
import {
  Server,
  Code,
  Database,
  Terminal,
  ChevronRight,
  FileJson,
  ArrowRight,
} from "lucide-react";

const APIDocs: React.FC = () => {
  return (
    <div className="p-6 md:p-12 h-full animate-fade-in overflow-y-auto custom-scrollbar">
      <header className="mb-12 border-b border-slate-800 pb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-cyber-cyan" size={32} />
          API REFERENCE
        </h2>
        <p className="text-slate-400 font-mono text-sm mt-2">
          PROTOCOL SPECIFICATION V1.0 // BACKEND INTEGRATION GUIDE
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content - Endpoints */}
        <div className="xl:col-span-2 space-y-8">
          {/* Introduction */}
          <div className="glass-panel p-8 rounded-xl border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Server size={20} className="text-cyber-purple" />
              Integration Overview
            </h3>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Azure Sentinel Scout is designed to work with any backend that
              implements the REST API contract defined below. By default, the
              application runs in <strong>Mock Mode</strong>. To connect a real
              Python/Node.js backend:
            </p>
            <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-6 font-mono text-sm bg-slate-900/50 p-4 rounded border border-slate-800">
              <li>
                Go to <span className="text-cyber-cyan">Settings</span> in the
                sidebar.
              </li>
              <li>
                Switch "Data Source Mode" to{" "}
                <span className="text-cyber-cyan">Real Backend</span>.
              </li>
              <li>
                Enter your API Base URL (e.g.,{" "}
                <span className="text-yellow-500">
                  http://localhost:5000/api
                </span>
                ).
              </li>
              <li>
                Ensure your backend supports CORS for the frontend origin.
              </li>
            </ol>
          </div>

          <h3 className="text-2xl font-bold text-white mt-12 mb-6">
            Endpoints
          </h3>

          {/* GET /runs */}
          <EndpointCard
            method="GET"
            path="/runs"
            desc="Retrieve a list of all historical security scans."
            response={`[
  {
    "run_id": "run-20231028-001",
    "timestamp": "2023-10-28T08:00:00Z",
    "status": "completed",
    "total_findings": 20
  }
]`}
          />

          {/* GET /findings */}
          <EndpointCard
            method="GET"
            path="/findings"
            desc="Get detailed vulnerability findings. Optional filtering by run_id."
            params={[
              {
                name: "run_id",
                type: "string",
                desc: "Optional. Filter by specific scan ID.",
              },
            ]}
            response={`[
  {
    "id": "f-101",
    "rule_id": "AZ-STORAGE-001",
    "severity": "High", 
    "service": "Storage Accounts",
    "description": "Public access enabled.",
    "evidence": { "publicAccess": true }
  }
]`}
          />

          {/* GET /trend */}
          <EndpointCard
            method="GET"
            path="/trend"
            desc="Historical trend data for the dashboard charts."
            response={`[
  { "date": "10/25", "high": 2, "medium": 5, "low": 5 },
  { "date": "10/26", "high": 3, "medium": 8, "low": 4 }
]`}
          />

          {/* POST /scan */}
          <EndpointCard
            method="POST"
            path="/scan"
            desc="Trigger a new immediate scan asynchronously."
            response={`{
  "message": "Scan initiated successfully",
  "runId": "run-1700000000"
}`}
          />
        </div>

        {/* Sidebar - Resources */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-slate-700 sticky top-6">
            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
              <Database size={18} className="text-cyber-cyan" />
              Data Structures
            </h4>
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Severity Enum
                </div>
                <div className="font-mono text-xs text-cyber-cyan">
                  "High" | "Medium" | "Low" | "Informational"
                </div>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                  Status Enum
                </div>
                <div className="font-mono text-xs text-green-400">
                  "completed" | "failed" | "running"
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Code size={18} className="text-orange-400" />
                Python Flask Example
              </h4>
              <div className="bg-slate-950 p-4 rounded border border-slate-800 overflow-x-auto custom-scrollbar">
                <pre className="text-[10px] font-mono text-slate-300 leading-relaxed">
                  {`@app.route('/api/runs')
def get_runs():
  data = db.query_runs()
  return jsonify(data)`}
                </pre>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                See <code className="text-slate-300">backend/server.py</code>{" "}
                for full implementation details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EndpointCard: React.FC<{
  method: string;
  path: string;
  desc: string;
  params?: any[];
  response: string;
}> = ({ method, path, desc, params, response }) => {
  const methodColors: Record<string, string> = {
    GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POST: "bg-green-500/20 text-green-400 border-green-500/30",
    PUT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800/50 bg-slate-900/50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-bold font-mono border ${methodColors[method]}`}
            >
              {method}
            </span>
            <span className="font-mono text-lg text-slate-200">{path}</span>
          </div>
          <p className="text-sm text-slate-400">{desc}</p>
        </div>
      </div>

      <div className="p-6 bg-slate-950/30">
        {params && (
          <div className="mb-6">
            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Query Parameters
            </h5>
            <div className="bg-slate-900 rounded border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-slate-800">
                  {params.map((p, i) => (
                    <tr key={i}>
                      <td className="p-3 font-mono text-cyber-cyan w-32">
                        {p.name}
                      </td>
                      <td className="p-3 font-mono text-yellow-500 w-24">
                        {p.type}
                      </td>
                      <td className="p-3 text-slate-400">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FileJson size={14} /> Response Example
          </h5>
          <div className="relative group">
            <pre className="bg-slate-950 text-slate-300 p-4 rounded border border-slate-800 font-mono text-xs overflow-x-auto custom-scrollbar">
              {response}
            </pre>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">
              application/json
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
