import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Send, Bot, User, Loader2, AlertTriangle, Terminal, Activity, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getFindings, getTrend, triggerScan } from '../services/api';

// --- Tool Definitions ---

const listFindingsTool: FunctionDeclaration = {
  name: "listFindings",
  description: "Retrieve security findings. Can filter by severity (High, Medium, Low) or Service name.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      severity: { type: Type.STRING, description: "Filter by severity: High, Medium, Low, Informational" },
      service: { type: Type.STRING, description: "Filter by Azure Service name (e.g., Storage Accounts, SQL Database)" }
    }
  }
};

const getTrendTool: FunctionDeclaration = {
  name: "getTrend",
  description: "Get the historical vulnerability trend data (counts of High/Medium/Low over time).",
  parameters: { type: Type.OBJECT, properties: {} }
};

const triggerScanTool: FunctionDeclaration = {
  name: "triggerScan",
  description: "Initiate a new immediate security scan of the Azure infrastructure.",
  parameters: { type: Type.OBJECT, properties: {} }
};

const navigateTool: FunctionDeclaration = {
  name: "navigate",
  description: "Navigate the user to a specific page in the application.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      page: { 
        type: Type.STRING, 
        description: "The page to navigate to. Options: 'dashboard', 'findings', 'reports', 'settings', 'home'." 
      }
    },
    required: ["page"]
  }
};

const tools: Tool[] = [
  {
    functionDeclarations: [listFindingsTool, getTrendTool, triggerScanTool, navigateTool]
  }
];

const AIChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: '1',
        sender: 'ai',
        text: "System Online. I am Sentinel Scout, your advanced security operator powered by Gemini 3 Pro. I can analyze findings, start scans, or navigate the dashboard for you. How can I assist?",
        timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toolStatus, setToolStatus] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, toolStatus]);

  // Initialize AI Chat Session
  useEffect(() => {
    const initAI = async () => {
        if (!process.env.API_KEY) {
            setMessages(prev => [...prev, {
                id: 'sys-err-key',
                sender: 'ai',
                text: "SYSTEM ALERT: API_KEY is missing from environment variables. Please check your configuration and ensure the variable is named 'API_KEY'.",
                timestamp: new Date()
            }]);
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chat = ai.chats.create({
                model: 'gemini-2.0-flash-lite',
                config: {
                    systemInstruction: `
                      You are Sentinel Scout, an expert Cloud Security AI Agent.
                      
                      CAPABILITIES:
                      1. You have direct access to the application's data via tools.
                      2. You can query findings, analyze trends, and trigger scans.
                      3. You can navigate the user interface.

                      DATA STRUCTURE:
                      - Findings contain: rule_id, severity (High, Medium, Low), service (e.g., Storage, SQL), description, and evidence.
                      - Evidence is a JSON object with technical details (e.g., firewall rules, encryption status).
                      - Remediation steps are provided in the findings data.

                      BEHAVIOR:
                      - ALWAYS use tools to get real data. Never Hallucinate security findings.
                      - If a user asks "What's wrong?", list the High severity findings first.
                      - When explaining a finding, use the 'description' and 'remediation_steps'.
                      - If asked to "fix" it, guide the user based on the 'remediation_steps'.
                      - Maintain a professional, concise, SecOps persona.
                      - If the user asks to go to a specific page, use the 'navigate' tool immediately.
                    `,
                    tools: tools
                }
            });
            setChatSession(chat);
        } catch (e) {
            console.error("Failed to initialize AI", e);
            setMessages(prev => [...prev, {
                id: 'init-err',
                sender: 'ai',
                text: "Initialization Error: Failed to connect to the AI service. Check console for details.",
                timestamp: new Date()
            }]);
        }
    };
    initAI();
  }, []);

  const executeTool = async (name: string, args: any): Promise<any> => {
      console.log(`Executing tool: ${name}`, args);
      setToolStatus(`Executing protocol: ${name}...`);
      
      try {
          switch (name) {
              case "listFindings":
                  const allFindings = await getFindings();
                  let filtered = allFindings;
                  if (args.severity) {
                      filtered = filtered.filter(f => f.severity.toLowerCase() === args.severity.toLowerCase());
                  }
                  if (args.service) {
                      filtered = filtered.filter(f => f.service.toLowerCase().includes(args.service.toLowerCase()));
                  }
                  // Return simplified list to save tokens but include resource context
                  return filtered.map(f => ({
                      id: f.rule_id,
                      severity: f.severity,
                      service: f.service,
                      issue: f.description,
                      resource: f.resource_id, // Critical for context
                      fix: f.remediation_steps
                  }));

              case "getTrend":
                  return await getTrend();

              case "triggerScan":
                  return await triggerScan();

              case "navigate":
                  const pageMap: Record<string, string> = {
                      'dashboard': '/dashboard',
                      'findings': '/findings',
                      'reports': '/reports',
                      'settings': '/settings',
                      'home': '/'
                  };
                  const path = pageMap[args.page?.toLowerCase()] || '/dashboard';
                  navigate(path);
                  return { success: true, navigated_to: path };

              default:
                  return { error: "Unknown tool" };
          }
      } catch (e: any) {
          return { error: e.message || "Operation Failed" };
      }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userText = input;
    setInput('');
    
    // Add User Message
    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: userText,
        timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
        // 1. Send message and check for tool calls
        let result = await chatSession.sendMessage({ message: userText });
        
        // 2. Loop while there are function calls
        while (result.functionCalls && result.functionCalls.length > 0) {
            const functionResponses = [];
            
            for (const call of result.functionCalls) {
                const toolResult = await executeTool(call.name, call.args);
                
                // Ensure the response struct is valid
                const responseContent = typeof toolResult === 'object' ? toolResult : { result: toolResult };

                functionResponses.push({
                    functionResponse: {
                        name: call.name,
                        response: responseContent,
                        id: call.id
                    }
                });
            }
            
            // Send tool results back to model
            setToolStatus("Analyzing telemetry...");
            // Pass as { message: parts } to satisfy SDK ContentUnion requirement
            result = await chatSession.sendMessage({ message: functionResponses });
        }

        // 3. Final Text Response
        const aiResponseText = result.text;
        setToolStatus(null);

        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: aiResponseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);

    } catch (error: any) {
        console.error("AI Error:", error);
        setToolStatus(null);
        
        let errorMessage = "Connection Error: Unable to communicate with Neural Core.";
        if (error.message) {
             errorMessage = `System Error: ${error.message}`;
        }

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'ai',
            text: errorMessage,
            timestamp: new Date()
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  return (
    <div className="h-[calc(100vh-6rem)] p-4 md:p-8 flex flex-col animate-fade-in">
      <div className="mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Sparkles className="text-cyber-cyan" size={32} />
              SENTINEL INTELLIGENCE
          </h2>
          <p className="text-slate-400 font-mono text-sm mt-1">MODEL: GEMINI-3-PRO-PREVIEW // STATUS: ONLINE</p>
      </div>

      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm shadow-2xl relative">
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0 border
                        ${msg.sender === 'ai' ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan' : 'bg-slate-700 border-slate-600 text-slate-300'}
                    `}>
                        {msg.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    
                    <div className={`max-w-[80%]`}>
                        <div className={`
                            p-4 rounded-lg text-sm leading-relaxed shadow-lg
                            ${msg.sender === 'ai' 
                                ? 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none' 
                                : 'bg-cyber-cyan/90 text-slate-900 font-medium rounded-tr-none'}
                        `}>
                           <div className="whitespace-pre-wrap font-sans">
                                {msg.text}
                           </div>
                        </div>
                        <div className={`text-[10px] text-slate-500 mt-1 font-mono ${msg.sender === 'user' ? 'text-right' : ''}`}>
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Loading / Tool Status Indicators */}
            {(isTyping || toolStatus) && (
                <div className="flex gap-4 animate-fade-in">
                     <div className="w-10 h-10 rounded-full bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan flex items-center justify-center shrink-0">
                        <Bot size={20} />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-lg rounded-tl-none p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                             <Loader2 className="animate-spin text-cyber-cyan" size={16} />
                             <span className="text-xs text-slate-400 font-mono typing-cursor">
                                 {toolStatus || "PROCESSING..."}
                             </span>
                        </div>
                        {toolStatus && (
                            <div className="h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-cyber-cyan animate-scan-line w-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Zone */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="relative flex gap-2 items-end max-w-4xl mx-auto">
                <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg focus-within:border-cyber-cyan focus-within:ring-1 focus-within:ring-cyber-cyan/50 transition-all">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about vulnerabilities, request a scan, or navigate settings..."
                        className="w-full bg-transparent text-white p-3 min-h-[50px] max-h-32 resize-none focus:outline-none text-sm custom-scrollbar font-mono"
                        rows={1}
                    />
                </div>
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-3 bg-cyber-cyan hover:bg-cyan-400 text-slate-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={20} />
                </button>
            </div>
            <div className="max-w-4xl mx-auto mt-3 flex flex-wrap justify-center gap-3">
                 <button onClick={() => setInput("Start a new security scan immediately.")} className="text-[10px] text-slate-500 hover:text-cyber-cyan border border-slate-800 hover:border-cyber-cyan/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 uppercase tracking-wider font-bold">
                    <Activity size={10} /> Trigger Scan
                 </button>
                 <button onClick={() => setInput("List High severity findings regarding SQL.")} className="text-[10px] text-slate-500 hover:text-cyber-cyan border border-slate-800 hover:border-cyber-cyan/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 uppercase tracking-wider font-bold">
                    <AlertTriangle size={10} /> List SQL Issues
                 </button>
                 <button onClick={() => setInput("Take me to the dashboard.")} className="text-[10px] text-slate-500 hover:text-cyber-cyan border border-slate-800 hover:border-cyber-cyan/30 px-3 py-1.5 rounded-full transition-all flex items-center gap-1 uppercase tracking-wider font-bold">
                    <Terminal size={10} /> Go To Dashboard
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;