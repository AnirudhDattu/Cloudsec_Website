// App.tsx

import React, { useState, useRef, useEffect } from "react";
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  X,
  Shield,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import FindingsTable from "./components/FindingsTable";
import Reports from "./components/Reports";
import AIChat from "./components/AIChat";
import Settings from "./components/Settings";
import APIDocs from "./components/APIDocs";

// Mock Notifications Data
const NOTIFICATIONS = [
  {
    id: 1,
    title: "Scan run-20231029 completed",
    time: "2 mins ago",
    type: "success",
    desc: "12 new findings detected.",
  },
  {
    id: 2,
    title: "Critical Storage Vulnerability",
    time: "1 hour ago",
    type: "alert",
    desc: "Public blob access detected on prod-storage.",
  },
  {
    id: 3,
    title: "Compliance Report Ready",
    time: "3 hours ago",
    type: "info",
    desc: "ISO 27001 monthly report generated.",
  },
];

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Refs for click-outside detection
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifs(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Navigate to findings page with query param
      navigate(`/findings?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(""); // Optional: clear after search
    }
  };

  const handleLogout = () => {
    // Simulation of logout
    navigate("/");
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Global Search */}
      <div className="flex items-center bg-slate-800/50 rounded px-3 py-1.5 border border-slate-700 w-64 focus-within:border-cyber-cyan focus-within:ring-1 focus-within:ring-cyber-cyan/50 transition-all">
        <Search size={14} className="text-slate-500 mr-2" />
        <input
          type="text"
          placeholder="Search findings..."
          className="bg-transparent border-none text-sm text-slate-300 placeholder-slate-500 focus:outline-none w-full font-mono"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative transition-colors ${
              showNotifs ? "text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="p-3 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Notifications
                </h4>
                <button
                  onClick={() => setShowNotifs(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      {n.type === "success" && (
                        <CheckCircle
                          size={16}
                          className="text-green-500 mt-0.5 shrink-0"
                        />
                      )}
                      {n.type === "alert" && (
                        <AlertTriangle
                          size={16}
                          className="text-red-500 mt-0.5 shrink-0"
                        />
                      )}
                      {n.type === "info" && (
                        <Shield
                          size={16}
                          className="text-blue-500 mt-0.5 shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-sm text-slate-200 font-medium leading-tight group-hover:text-cyber-cyan transition-colors">
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">{n.desc}</p>
                        <p className="text-[10px] text-slate-600 mt-2 font-mono">
                          {n.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-slate-950 text-center border-t border-slate-800">
                <button className="text-[10px] text-cyber-cyan hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative border-l border-slate-700 pl-6" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white group-hover:text-cyber-cyan transition-colors">
                Admin User
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                SEC_OPS_LEAD
              </p>
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                showUserMenu
                  ? "bg-slate-700 border-cyber-cyan text-white"
                  : "bg-slate-800 border-slate-600 text-slate-300 group-hover:border-slate-400"
              }`}
            >
              <User size={16} />
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
              <div className="p-4 border-b border-slate-800 bg-slate-950">
                <p className="text-sm font-bold text-white">Admin User</p>
                <p className="text-xs text-slate-500">admin@cloudsec.ai</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    navigate("/settings");
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded flex items-center gap-2"
                >
                  <SettingsIcon size={16} /> Settings
                </button>
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded flex items-center gap-2"
                >
                  <User size={16} /> Profile
                </button>
              </div>
              <div className="p-2 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-cyber-900 text-slate-50 flex font-sans">
      {!isLanding && <Navbar />}
      <main
        className={`flex-1 relative ${
          !isLanding ? "md:ml-64" : ""
        } transition-all duration-300 flex flex-col`}
      >
        {/* Background Ambient Effects for non-landing pages */}
        {!isLanding && (
          <>
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none z-0" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none z-0" />
            <TopBar />
          </>
        )}
        <div className="relative z-10 flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/findings" element={<FindingsTable />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/api-docs" element={<APIDocs />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
