import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { triggerScan } from '../services/api';
import { ChevronRight, ShieldCheck, Zap, Lock, Globe, BarChart3, Cpu, Loader2, Search, FileText, AlertTriangle, CheckCircle, Layers, ArrowRight, Github, Cloud, Server } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    try {
      await triggerScan();
      setTimeout(() => {
        setScanning(false);
        navigate('/dashboard');
      }, 2000);
    } catch (e) {
      setScanning(false);
      navigate('/dashboard');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-cyber-950 text-slate-50 selection:bg-indigo-500/30 selection:text-white overflow-x-hidden font-sans">
      
      {/* Navbar - Fixed & Glass */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 transition-all duration-300 backdrop-blur-md bg-cyber-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-md flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">CloudSec</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-cyber-cyan transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Workflow</button>
            <button onClick={() => scrollToSection('capabilities')} className="hover:text-cyber-cyan transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Capabilities</button>
            <button onClick={() => scrollToSection('benefits')} className="hover:text-cyber-cyan transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Benefits</button>
            <button onClick={() => scrollToSection('integration')} className="hover:text-cyber-cyan transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Integrations</button>
          </div>

          <button 
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 max-w-7xl mx-auto text-center z-10">
        
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/10 text-[10px] font-bold tracking-wide text-cyber-cyan mb-6 backdrop-blur-md shadow-[0_0_10px_rgba(34,211,238,0.2)]">
             <Zap size={10} fill="currentColor" /> AUTOMATED CLOUD SECURITY
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-400 pb-2">
            Gain Instant
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-b from-slate-400 to-slate-700">
            Visibility.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.3s' }}>
          Instant visibility into misconfigurations, risks, and compliance gaps across your Azure environment. 
          Audit key services, identify vulnerabilities, and get actionable remediation guidance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleScan}
            disabled={scanning}
            className="group relative h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] flex items-center gap-2 disabled:opacity-80 disabled:cursor-wait"
          >
            {scanning ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>INITIALIZING SCAN...</span>
              </>
            ) : (
              <>
                <span>Start Analysis</span>
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="h-14 px-8 rounded-full glass hover:bg-white/5 text-slate-300 hover:text-white font-medium transition-all duration-300 border border-white/10 hover:border-white/30"
          >
            View Live Demo
          </button>
        </div>

        {/* Hero Visual - Active Dashboard Preview */}
        <div className="mt-24 relative mx-auto max-w-6xl animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/20 to-blue-600/20 rounded-xl blur-xl opacity-30"></div>
            
            <div className="relative glass-card rounded-xl overflow-hidden border border-white/10 shadow-2xl aspect-[16/10] md:aspect-[21/9] bg-slate-950 flex flex-col transform hover:scale-[1.01] transition-transform duration-700">
                {/* Browser Bar */}
                <div className="h-10 border-b border-white/5 bg-slate-900/50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="ml-4 flex-1 max-w-sm h-6 rounded bg-slate-800/50 border border-white/5 flex items-center px-3 text-[10px] text-slate-500 font-mono">
                        https://portal.cloudsec.ai/scan/active
                    </div>
                </div>

                {/* Interface Content */}
                <div className="flex-1 flex">
                   {/* Sidebar */}
                   <div className="w-16 border-r border-white/5 bg-slate-900/30 flex flex-col items-center py-6 gap-6">
                       <div className="w-8 h-8 bg-cyan-500/20 rounded-lg text-cyan-500 flex items-center justify-center"><ShieldCheck size={18} /></div>
                       <div className="w-8 h-8 text-slate-600 flex items-center justify-center"><Layers size={18} /></div>
                       <div className="w-8 h-8 text-slate-600 flex items-center justify-center"><BarChart3 size={18} /></div>
                   </div>

                   {/* Main Area */}
                   <div className="flex-1 p-6 md:p-10 bg-slate-950 relative">
                       <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                       
                       <div className="relative z-10 flex flex-col h-full">
                           <div className="flex justify-between items-end mb-8">
                               <div>
                                   <div className="text-xs font-mono text-cyan-500 mb-1">SCAN ID: #8821-AF</div>
                                   <div className="text-2xl font-bold text-white">Infrastructure Audit</div>
                               </div>
                               <div className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold animate-pulse">LIVE SCANNING</div>
                           </div>

                           {/* Stats Cards */}
                           <div className="grid grid-cols-3 gap-4 mb-8">
                               <div className="bg-slate-900/80 border border-white/5 p-4 rounded-lg">
                                   <div className="text-slate-500 text-xs font-bold mb-1">RESOURCES</div>
                                   <div className="text-xl text-white font-mono">1,240</div>
                               </div>
                               <div className="bg-slate-900/80 border border-white/5 p-4 rounded-lg">
                                   <div className="text-slate-500 text-xs font-bold mb-1">ISSUES FOUND</div>
                                   <div className="text-xl text-orange-400 font-mono">12</div>
                               </div>
                               <div className="bg-slate-900/80 border border-white/5 p-4 rounded-lg">
                                   <div className="text-slate-500 text-xs font-bold mb-1">COMPLIANCE</div>
                                   <div className="text-xl text-cyan-400 font-mono">85%</div>
                               </div>
                           </div>

                           {/* Fake Console Output */}
                           <div className="flex-1 bg-black/40 rounded-lg border border-white/10 p-4 font-mono text-xs text-slate-400 overflow-hidden relative">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-400"><CheckCircle size={10}/> <span className="text-slate-300">Connecting to Azure Resource Manager...</span></div>
                                    <div className="flex items-center gap-2 text-green-400"><CheckCircle size={10}/> <span className="text-slate-300">Discovering Storage Accounts (us-east-1)...</span></div>
                                    <div className="flex items-center gap-2 text-yellow-400 animate-pulse"><AlertTriangle size={10}/> <span className="text-white">WARNING: Public Blob Access Enabled on 'st-legacy-01'</span></div>
                                    <div className="flex items-center gap-2 text-green-400"><CheckCircle size={10}/> <span className="text-slate-300">Analyzing Network Security Groups...</span></div>
                                    <div className="flex items-center gap-2 text-red-400 animate-pulse"><AlertTriangle size={10}/> <span className="text-white">CRITICAL: RDP (3389) open to 0.0.0.0/0 on 'vm-bastion'</span></div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-950 to-transparent"></div>
                           </div>
                       </div>
                   </div>
                </div>
                
                {/* Floating Alerts */}
                <div className="absolute top-1/4 -right-12 md:-right-16 w-64 glass-card p-4 rounded-xl border-l-4 border-l-red-500 shadow-2xl animate-fade-in-up hidden lg:block" style={{ animationDelay: '1s' }}>
                    <div className="flex items-start gap-3">
                        <div className="bg-red-500/20 p-2 rounded-lg text-red-400"><AlertTriangle size={16} /></div>
                        <div>
                            <div className="text-xs font-bold text-white mb-1">High Severity</div>
                            <div className="text-[10px] text-slate-400 leading-tight">Unencrypted storage account detected in production resource group.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Value Prop Strip */}
      <section className="py-16 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                  One click to scan. <span className="text-slate-500">One dashboard to understand.</span> <span className="text-cyber-cyan">One report to fix everything.</span>
              </h2>
          </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-cyber-950 relative">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                  <h2 className="text-sm font-bold text-cyber-cyan tracking-widest uppercase mb-3">Workflow</h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-white">How It Works</h3>
                  <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
                      We translate complex Azure security data into clean, actionable insights that help teams strengthen their cloud posture without deep security expertise.
                  </p>
              </div>

              <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 hidden md:block z-0"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                      {[
                          { title: "Scan", desc: "Analyzes your Azure environment.", icon: Search },
                          { title: "Detect", desc: "Misconfigurations are identified.", icon: ShieldCheck },
                          { title: "Prioritize", desc: "Issues ranked by impact.", icon: BarChart3 },
                          { title: "Guide", desc: "Practical remediation steps.", icon: CheckCircle },
                          { title: "Track", desc: "Monitor improvements over time.", icon: Layers },
                      ].map((step, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center group">
                              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-cyber-cyan group-hover:border-cyber-cyan transition-all mb-6 shadow-lg relative">
                                  <step.icon size={28} />
                                  <div className="absolute -bottom-3 bg-slate-950 px-2 text-xs font-mono text-slate-600">0{idx+1}</div>
                              </div>
                              <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Capabilities Grid */}
      <section id="capabilities" className="py-24 px-6 bg-slate-900/20 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                  <h2 className="text-sm font-bold text-cyber-cyan tracking-widest uppercase mb-3">Features</h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Key Capabilities</h3>
                  <p className="text-slate-400 max-w-3xl">
                    Our platform performs a full-stack security assessment of your Azure resources—Storage Accounts, Virtual Machines, Function Apps, Network Security Groups, and more.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CapabilityCard 
                      icon={<Globe size={24} />}
                      title="Automated Discovery"
                      desc="Instantly detects all relevant cloud resources—compute, storage, networking, serverless, and more."
                  />
                  <CapabilityCard 
                      icon={<Search size={24} />}
                      title="Deep Config Analysis"
                      desc="Evaluates security-critical configurations such as encryption, access control, public exposure, and identity settings."
                  />
                  <CapabilityCard 
                      icon={<AlertTriangle size={24} />}
                      title="Prioritized Findings"
                      desc="Each issue is classified by severity (High, Medium, Low) with clear evidence so teams can fix problems faster."
                  />
                  <CapabilityCard 
                      icon={<Layers size={24} />}
                      title="Historical Tracking"
                      desc="Compare results over time, monitor risk reduction, and track your security posture across scans."
                  />
                  <CapabilityCard 
                      icon={<FileText size={24} />}
                      title="Actionable Reports"
                      desc="Export professional-grade security reports in HTML or PDF for audits, management reviews, or compliance."
                  />
                  <CapabilityCard 
                      icon={<Cpu size={24} />}
                      title="API-Ready"
                      desc="Modern architecture, JSON-based results, and easy integration with dashboards or CI/CD workflows."
                  />
              </div>
          </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-6 bg-cyber-950 relative overflow-hidden border-t border-white/5">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-900/10 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                  <h2 className="text-sm font-bold text-cyber-cyan tracking-widest uppercase mb-3">Benefits</h2>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Why Choose CloudSec?</h3>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                      Modern cloud environments are complex and prone to misconfigurations. Manual checks are slow and inconsistent. We provide automatic, repeatable assessments aligned with industry best practices.
                  </p>
                  
                  <ul className="space-y-4">
                      {[
                          "Reduce cloud security risks quickly",
                          "Avoid costly misconfigurations",
                          "Support compliance audits effortlessly",
                          "Shorten investigation & remediation cycles",
                          "Gain complete visibility across Azure"
                      ].map((benefit, i) => (
                          <li key={i} className="flex items-center gap-3 text-slate-300">
                              <div className="min-w-[20px] text-green-400"><CheckCircle size={20} /></div>
                              <span>{benefit}</span>
                          </li>
                      ))}
                  </ul>
              </div>
              <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-3xl -z-10"></div>
                  <div className="glass-card p-8 rounded-2xl border border-white/10">
                      <div className="flex flex-col gap-4">
                           <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between">
                               <div>
                                   <div className="text-xs text-slate-500">Average Remediation Time</div>
                                   <div className="text-2xl font-bold text-white">2 Days</div>
                               </div>
                               <div className="text-green-400 text-sm font-bold">-85%</div>
                           </div>
                           <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between">
                               <div>
                                   <div className="text-xs text-slate-500">Security Coverage</div>
                                   <div className="text-2xl font-bold text-white">100%</div>
                               </div>
                               <div className="text-green-400 text-sm font-bold">+40%</div>
                           </div>
                           <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 flex items-center justify-between">
                               <div>
                                   <div className="text-xs text-slate-500">Audit Prep Time</div>
                                   <div className="text-2xl font-bold text-white">5 Mins</div>
                               </div>
                               <div className="text-green-400 text-sm font-bold">-90%</div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 px-6 bg-slate-900/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
           <div className="inline-flex p-3 rounded-full bg-slate-800/50 mb-6">
               <Lock size={24} className="text-cyber-cyan" />
           </div>
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Enterprise-Grade Security</h2>
           <p className="text-slate-400 max-w-2xl mx-auto mb-12">
               Built for the most demanding environments. Your data never leaves your secure perimeter without encryption.
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
                   <h4 className="text-lg font-bold text-white mb-2">End-to-End Encryption</h4>
                   <p className="text-sm text-slate-500">All data in transit and at rest is encrypted using AES-256 standards.</p>
               </div>
               <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
                   <h4 className="text-lg font-bold text-white mb-2">SOC2 Compliant</h4>
                   <p className="text-sm text-slate-500">Our infrastructure and processes are audited annually for security compliance.</p>
               </div>
               <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
                   <h4 className="text-lg font-bold text-white mb-2">Role-Based Access</h4>
                   <p className="text-sm text-slate-500">Granular permissions ensure only authorized personnel can access audit reports.</p>
               </div>
           </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integration" className="py-24 px-6 bg-cyber-950 border-t border-white/5">
         <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                 <div className="max-w-xl">
                     <h2 className="text-sm font-bold text-cyber-cyan tracking-widest uppercase mb-3">Integrations</h2>
                     <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">Works with your stack.</h3>
                     <p className="text-slate-400 mb-8 leading-relaxed">
                         Seamlessly integrate CloudSec into your existing CI/CD pipelines and communication tools. Get alerts where you work.
                     </p>
                     <button className="text-cyber-cyan font-bold hover:text-white transition-colors flex items-center gap-2">
                         View all integrations <ArrowRight size={16} />
                     </button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                     <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-cyber-cyan/50 transition-colors">
                         <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white"><Cloud size={24} /></div>
                         <span className="text-sm font-bold text-white">Azure</span>
                     </div>
                     <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-cyber-cyan/50 transition-colors">
                         <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-white"><Github size={24} /></div>
                         <span className="text-sm font-bold text-white">GitHub</span>
                     </div>
                     <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-cyber-cyan/50 transition-colors">
                         <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center text-white"><Server size={24} /></div>
                         <span className="text-sm font-bold text-white">Jira</span>
                     </div>
                     <div className="w-32 h-32 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-cyber-cyan/50 transition-colors">
                         <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-white"><Zap size={24} /></div>
                         <span className="text-sm font-bold text-white">PagerDuty</span>
                     </div>
                 </div>
             </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyber-cyan/5 to-transparent pointer-events-none"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Secure your Azure environment with confidence.</h2>
              <p className="text-lg text-slate-400 mb-10">
                  Reduce cloud security risks quickly and avoid costly misconfigurations. Start your first automated scan today.
              </p>
              <button 
                onClick={handleScan}
                className="h-14 px-10 rounded-full bg-white text-slate-900 font-bold text-lg hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                  Start Free Audit
              </button>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black text-center">
         <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
             <div className="w-4 h-4 bg-slate-700 rounded-sm"></div>
             <span className="font-semibold tracking-tight text-slate-300">CloudSec</span>
         </div>
         <p className="text-slate-600 text-sm">&copy; 2024 CloudSec Inc. All rights reserved.</p>
      </footer>

    </div>
  );
};

const CapabilityCard: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({icon, title, desc}) => (
    <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-cyber-cyan/30 transition-all group hover:-translate-y-1">
        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-cyber-cyan/20 transition-colors mb-6">
            {icon}
        </div>
        <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
            {desc}
        </p>
    </div>
);

export default Landing;