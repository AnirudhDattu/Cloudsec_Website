// components/Settings.tsx

import React, { useEffect, useState } from "react";
import {
  Save,
  Server,
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings as SettingsIcon,
} from "lucide-react";
import { getConfig, saveConfig } from "../services/api";

const Settings: React.FC = () => {
  const [useMock, setUseMock] = useState(true);
  const [apiUrl, setApiUrl] = useState("");
  const [status, setStatus] = useState<
    "IDLE" | "TESTING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const config = getConfig();
    setUseMock(config.useMock);
    setApiUrl(config.apiUrl);
  }, []);

  const handleSave = () => {
    saveConfig({ useMock, apiUrl });
    // Show brief saved confirmation
    setStatus("SUCCESS");
    setStatusMsg("Settings saved locally.");
    setTimeout(() => {
      setStatus("IDLE");
      setStatusMsg("");
    }, 2000);
  };

  const handleTestConnection = async () => {
    if (useMock) {
      setStatus("SUCCESS");
      setStatusMsg("Mock mode is active. No connection needed.");
      return;
    }

    setStatus("TESTING");
    try {
      const res = await fetch(`${apiUrl}/runs`);
      if (res.ok) {
        setStatus("SUCCESS");
        setStatusMsg("Connection successful! Backend is reachable.");
      } else {
        setStatus("ERROR");
        setStatusMsg(
          `Backend reachable but returned ${res.status} ${res.statusText}`
        );
      }
    } catch (error) {
      setStatus("ERROR");
      setStatusMsg(
        "Failed to connect. Ensure backend is running and CORS is enabled."
      );
    }
  };

  return (
    <div className="p-6 md:p-12 h-full animate-fade-in">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="text-cyber-cyan" size={32} />
          SYSTEM CONFIGURATION
        </h2>
        <p className="text-slate-400 font-mono text-sm mt-1">
          MANAGE DATA SOURCE AND API CONNECTIONS
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Source Card */}
        <div className="glass-panel p-8 rounded-xl border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database size={20} /> DATA SOURCE MODE
          </h3>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUseMock(true)}
              className={`flex-1 py-4 rounded border transition-all ${
                useMock
                  ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan"
                  : "bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold mb-1">MOCK DATA</div>
              <div className="text-xs opacity-70">Use built-in sample data</div>
            </button>
            <button
              onClick={() => setUseMock(false)}
              className={`flex-1 py-4 rounded border transition-all ${
                !useMock
                  ? "bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan"
                  : "bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800"
              }`}
            >
              <div className="font-bold mb-1">REAL BACKEND</div>
              <div className="text-xs opacity-70">
                Connect to local Python API
              </div>
            </button>
          </div>

          <div className="text-sm text-slate-400 bg-slate-900/50 p-4 rounded border border-slate-800 leading-relaxed">
            {useMock
              ? "Running in Demo Mode. No backend required. Data is reset on page reload."
              : "The app will attempt to fetch JSON data from the API URL configured below."}
          </div>
        </div>

        {/* Connection Settings Card */}
        <div
          className={`glass-panel p-8 rounded-xl border border-slate-700 transition-opacity ${
            useMock ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Server size={20} /> API CONNECTION
          </h3>

          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              API Base URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-600 text-white p-3 rounded font-mono text-sm focus:border-cyber-cyan focus:outline-none"
              placeholder="http://localhost:5000/api"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleTestConnection}
              disabled={status === "TESTING"}
              className="text-sm font-bold text-cyber-cyan hover:text-cyan-300 flex items-center gap-2"
            >
              {status === "TESTING" ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <RefreshCw size={16} />
              )}
              TEST CONNECTION
            </button>

            {status === "SUCCESS" && (
              <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                <CheckCircle size={14} /> {statusMsg || "OK"}
              </span>
            )}
            {status === "ERROR" && (
              <span className="text-red-500 text-xs font-bold flex items-center gap-1">
                <XCircle size={14} /> {statusMsg || "FAILED"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-cyber-cyan hover:bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
        >
          <Save size={18} />
          SAVE SETTINGS
        </button>
      </div>

      <div className="mt-12 border-t border-slate-800 pt-8">
        <h4 className="text-white font-bold mb-4">Backend Integration Help</h4>
        <p className="text-slate-400 text-sm mb-4">
          To connect your own backend, ensure your API matches the JSON
          structure defined in the app.
        </p>
        <div className="bg-slate-900 p-4 rounded border border-slate-800 font-mono text-xs text-slate-300">
          See <strong>API_CONTRACT.md</strong> in the project root for the full
          specification.
        </div>
      </div>
    </div>
  );
};

export default Settings;
