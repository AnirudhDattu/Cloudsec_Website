// components/Navbar.tsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  List,
  FileText,
  Zap,
  Bot,
  Settings,
  BookOpen,
} from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <Zap size={18} /> },
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/findings", label: "Findings", icon: <List size={18} /> },
    { path: "/reports", label: "Reports", icon: <FileText size={18} /> },
    { path: "/chat", label: "AI Analyst", icon: <Bot size={18} /> },
    { path: "/api-docs", label: "API Reference", icon: <BookOpen size={18} /> },
  ];

  const isSettingsActive = location.pathname === "/settings";

  return (
    <nav className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-wider text-white">
            CLOUDSEC
          </h1>
          <p className="text-xs text-slate-400 tracking-widest">DEFENSE V2.0</p>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                isActive
                  ? "bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                  : "text-slate-400 hover:text-white hover:translate-x-1"
              }`}
            >
              <span
                className={`${
                  isActive
                    ? "text-cyber-cyan"
                    : "text-slate-500 group-hover:text-white transition-colors"
                }`}
              >
                {item.icon}
              </span>
              <span className="font-medium tracking-wide text-sm">
                {item.label}
              </span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#22d3ee]"></div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4">
        <Link
          to="/settings"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group mb-2 ${
            isSettingsActive
              ? "bg-slate-800 text-white border border-slate-700"
              : "text-slate-400 hover:text-white hover:translate-x-1"
          }`}
        >
          <Settings
            size={18}
            className={
              isSettingsActive
                ? "text-white"
                : "text-slate-500 group-hover:text-white"
            }
          />
          <span className="font-medium tracking-wide text-sm">
            Configuration
          </span>
        </Link>
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-mono">
              SYSTEM ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            Connected to: CloudSec Node
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
