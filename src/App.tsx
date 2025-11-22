import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, BookOpen, HelpCircle, GraduationCap, Mic, Send, 
  LayoutDashboard, Trash2, Globe, Power, X, Menu, Target, TrendingUp,
  Download, BarChart3, ChevronLeft, Plus
} from 'lucide-react';
import { 
  BACKGROUND_IMAGES, GREETINGS, BRAND_LOGO,
  DEFAULT_SPONSORS, ANALYTICS_DB
} from './constants';
import { sendMessageToGemini } from './services/geminiService';
import { ChatMessage, Sponsor, LogEntry } from './types';
import { Packages } from './pages/Packages';
import { Courses } from './pages/Courses';
import { FAQ } from './pages/FAQ';

// --- COMPONENTS ---

const ImmersiveBackground = () => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => (p + 1) % BACKGROUND_IMAGES.length), 8000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-ocean-900">
      {BACKGROUND_IMAGES.map((img, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${idx === index ? 'opacity-100' : 'opacity-0'}`}>
          <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}
    </div>
  );
};

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@pelagicdivers.com' || email === 'hanneyroger@gmail.com') && password === 'shark') {
      onLogin();
    }
  };
  return (
    <div className="flex items-center justify-center h-full bg-slate-50 p-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl border shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6"><img src={BRAND_LOGO} alt="Logo" className="h-12 md:h-16" onError={(e)=>{e.currentTarget.style.display='none'}} /></div>
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg text-base" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded-lg text-base" />
          <button type="submit" className="w-full bg-blue-900 text-white p-3 rounded-lg font-bold">Login</button>
        </form>
      </div>
    </div>
  );
};

// --- FULL OPERATIONS DASHBOARD ---
const AdminDashboard = ({ sponsors, setSponsors }: { sponsors: Sponsor[], setSponsors: (s: Sponsor[]) => void }) => {
  // STATE: Date Ranges
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-02-28' });
  const [filterMode, setFilterMode] = useState<'Custom' | 'TWK' | 'LWK' | 'LMTH'>('Custom');
  
  // LOGIC: Quick Date Presets
  const applyPreset = (mode: 'TWK' | 'LWK' | 'LMTH') => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    if (mode === 'TWK') {
      start.setDate(today.getDate() - today.getDay());
      end = today;
    } else if (mode === 'LWK') {
      start.setDate(today.getDate() - today.getDay() - 7);
      end.setDate(today.getDate() - today.getDay() - 1);
    } else if (mode === 'LMTH') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    }
    
    setDateRange({
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    });
    setFilterMode(mode);
  };

  // LOGIC: Filter Data based on Date Range
  const filteredLogs = useMemo(() => {
    return ANALYTICS_DB.filter(log => 
      log.date >= dateRange.start && log.date <= dateRange.end
    );
  }, [dateRange]);

  // LOGIC: Calculate ROI (Share of Voice)
  const campaignStats = useMemo(() => {
    return sponsors.map(sponsor => {
      const categoryVol = filteredLogs.filter(l => l.categoryMatch === sponsor.category).length;
      const brandMentions = filteredLogs.filter(l => l.brandMentioned === sponsor.partner).length;
      const sov = categoryVol > 0 ? Math.round((brandMentions / categoryVol) * 100) : 0;
      
      return { ...sponsor, categoryVol, brandMentions, sov };
    });
  }, [filteredLogs, sponsors]);

  // LOGIC: Calculate Sentiment Score
  const sentimentScore = useMemo(() => {
    if (filteredLogs.length === 0) return 0;
    const positive = filteredLogs.filter(l => l.sentiment === 'Positive').length;
    return Math.round((positive / filteredLogs.length) * 100);
  }, [filteredLogs]);

  // LOGIC: Total Partner Mentions
  const totalMentions = useMemo(() => {
    return filteredLogs.filter(l => l.brandMentioned).length;
  }, [filteredLogs]);

  // LOGIC: Export CSV
  const handleExport = () => {
    const headers = ["Date", "Time", "User", "Topic", "Category", "Brand Mentioned", "Sentiment"];
    const rows = filteredLogs.map(l => 
      [l.date, l.time, l.user, `"${l.topic}"`, l.categoryMatch || '-', l.brandMentioned || '-', l.sentiment].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pelagic_analytics_${dateRange.start}_to_${dateRange.end}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LOGIC: Toggle Campaign Active State
  const toggleCampaign = (id: number) => {
    setSponsors(sponsors.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // LOGIC: Delete Campaign
  const deleteCampaign = (id: number) => {
    setSponsors(sponsors.filter(s => s.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
      {/* HEADER & TOOLBAR */}
      <header className="bg-white border-b p-3 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shrink-0">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" /> Operations Command
        </h2>
        
        {/* REPORTING TOOLBAR */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1 rounded-lg border text-xs">
          <button onClick={() => applyPreset('TWK')} className={`px-2 md:px-3 py-1 font-bold rounded transition-colors ${filterMode==='TWK'?'bg-white shadow text-blue-600':'text-slate-500 hover:text-slate-700'}`}>TWK</button>
          <button onClick={() => applyPreset('LWK')} className={`px-2 md:px-3 py-1 font-bold rounded transition-colors ${filterMode==='LWK'?'bg-white shadow text-blue-600':'text-slate-500 hover:text-slate-700'}`}>LWK</button>
          <button onClick={() => applyPreset('LMTH')} className={`px-2 md:px-3 py-1 font-bold rounded transition-colors ${filterMode==='LMTH'?'bg-white shadow text-blue-600':'text-slate-500 hover:text-slate-700'}`}>LMTH</button>
          <div className="hidden md:block w-[1px] h-4 bg-slate-300 mx-1" />
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => { setDateRange(p => ({...p, start: e.target.value})); setFilterMode('Custom'); }}
            className="bg-transparent outline-none w-28"
          />
          <span className="text-slate-400">-</span>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => { setDateRange(p => ({...p, end: e.target.value})); setFilterMode('Custom'); }}
            className="bg-transparent outline-none w-28"
          />
          <div className="hidden md:block w-[1px] h-4 bg-slate-300 mx-1" />
          <button onClick={handleExport} className="flex items-center gap-1 font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors">
            <Download size={12} /> CSV
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 md:p-8">
        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white p-3 md:p-4 rounded-xl border shadow-sm">
            <div className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1">Total Conversations</div>
            <div className="text-2xl md:text-3xl font-bold text-slate-800">{filteredLogs.length}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border shadow-sm">
            <div className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1">Sentiment Score</div>
            <div className={`text-2xl md:text-3xl font-bold ${sentimentScore >= 70 ? 'text-green-500' : sentimentScore >= 40 ? 'text-orange-500' : 'text-red-500'}`}>{sentimentScore}%</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border shadow-sm">
            <div className="text-slate-500 text-[10px] md:text-xs font-bold uppercase mb-1">Partner Mentions</div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{totalMentions}</div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center cursor-pointer hover:bg-blue-50 border-dashed border-blue-200 text-blue-500 transition-colors">
            <Plus size={20} />
            <span className="text-[10px] md:text-xs font-bold">New Report</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* LEFT COL: INPUTS & STRATEGY */}
          <div className="space-y-6 md:space-y-8">
            {/* CAMPAIGN INPUT FORM */}
            <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800"><Target size={18} className="text-red-500"/> Campaign Input</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const newSponsor: Sponsor = {
                  id: Date.now(),
                  category: f.get('cat') as string,
                  partner: f.get('partner') as string,
                  frequency: Number(f.get('freq')),
                  startDate: f.get('start') as string,
                  endDate: f.get('end') as string,
                  active: true
                };
                setSponsors([...sponsors, newSponsor]);
                (e.target as HTMLFormElement).reset();
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-500 block mb-1">Category</label>
                    <input name="cat" placeholder="e.g. Cameras" className="w-full p-2 border rounded text-sm" required />
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-500 block mb-1">Partner Brand</label>
                    <input name="partner" placeholder="e.g. GoPro" className="w-full p-2 border rounded text-sm" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div>
                    <label className="text-[10px] md:text-xs font-bold text-slate-500 block mb-1">Freq (%)</label>
                    <input name="freq" type="number" defaultValue={40} min={1} max={100} className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] md:text-xs font-bold text-slate-500 block mb-1">Campaign Dates</label>
                    <div className="flex gap-2">
                      <input name="start" type="date" className="w-full p-2 border rounded text-sm" required />
                      <input name="end" type="date" className="w-full p-2 border rounded text-sm" required />
                    </div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold text-sm transition-colors">Launch Campaign</button>
              </form>
            </div>

            {/* ACTIVE ROI CARDS */}
            <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-800"><TrendingUp size={18} className="text-green-500"/> Active ROI</h3>
              <div className="space-y-3">
                {campaignStats.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-4">No campaigns configured</p>
                )}
                {campaignStats.map(s => (
                  <div key={s.id} className={`p-3 rounded-lg border ${s.active ? 'bg-slate-50 border-slate-100' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-bold text-sm">{s.partner}</span>
                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                          {s.active ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => toggleCampaign(s.id)} className="text-slate-400 hover:text-blue-500 p-1 transition-colors">
                          <Power size={14} />
                        </button>
                        <button onClick={() => deleteCampaign(s.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 mb-2">{s.category} • Target: {s.frequency}%</div>
                    <div className="flex items-end justify-between">
                      <div className="text-[10px] text-slate-400">{s.startDate} → {s.endDate}</div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{s.sov}% <span className="text-[10px] text-slate-400 font-normal">SOV</span></div>
                        <div className="text-[10px] text-slate-400">{s.brandMentions} / {s.categoryVol} chats</div>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all ${s.sov >= s.frequency ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${Math.min(s.sov, 100)}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                      <span>0%</span>
                      <span className="text-blue-500">Target: {s.frequency}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COL: LOG EXPLORER */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm flex flex-col min-h-[400px]">
            <div className="p-4 md:p-6 border-b flex justify-between items-center shrink-0">
              <h3 className="font-bold flex items-center gap-2 text-slate-800"><BarChart3 size={18} className="text-slate-400"/> Log Explorer</h3>
              <div className="text-xs text-slate-400">Showing {filteredLogs.length} records</div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                  <tr>
                    <th className="p-3 md:p-4 font-bold text-[10px] md:text-xs">Date</th>
                    <th className="p-3 md:p-4 font-bold text-[10px] md:text-xs">User</th>
                    <th className="p-3 md:p-4 font-bold text-[10px] md:text-xs hidden md:table-cell">Topic</th>
                    <th className="p-3 md:p-4 font-bold text-[10px] md:text-xs">Tags</th>
                    <th className="p-3 md:p-4 font-bold text-[10px] md:text-xs">Sentiment</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 md:p-4 whitespace-nowrap text-slate-500">
                        <div className="font-mono text-[10px] md:text-xs">{log.date}</div>
                        <div className="text-[9px] md:text-[10px]">{log.time}</div>
                      </td>
                      <td className="p-3 md:p-4 font-medium text-xs md:text-sm">{log.user}</td>
                      <td className="p-3 md:p-4 text-slate-600 text-xs md:text-sm hidden md:table-cell">{log.topic}</td>
                      <td className="p-3 md:p-4">
                        <div className="flex flex-wrap gap-1">
                          {log.categoryMatch && (
                            <span className="px-1.5 md:px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[9px] md:text-[10px] border">
                              {log.categoryMatch}
                            </span>
                          )}
                          {log.brandMentioned && (
                            <span className="px-1.5 md:px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[9px] md:text-[10px] border border-green-200">
                              {log.brandMentioned}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 md:p-4">
                        <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded text-[9px] md:text-xs font-bold ${
                          log.sentiment === 'Positive' ? 'bg-green-50 text-green-600' : 
                          log.sentiment === 'Negative' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {log.sentiment}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">No logs found for this period.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'cx' | 'admin'>('cx');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'packages' | 'courses' | 'faq'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setMessages([{ role: 'model', text: g.chat, timestamp: new Date() }]);
      initRef.current = true;
    }
    const interval = setInterval(() => setGreetingIdx(p => (p + 1) % GREETINGS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeView, appMode]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await sendMessageToGemini(userMsg.text, sponsors);
      setMessages(p => [...p, { role: 'model', text: response, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-900 font-sans text-slate-200 flex">
      {appMode === 'cx' && <ImmersiveBackground />}
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <img src={BRAND_LOGO} alt="PDF" className="h-6" onError={(e) => e.currentTarget.style.display='none'}/>
          <span className="font-bold text-white text-sm">PELAGIC DIVERS</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <nav className={`
        fixed md:relative z-50 h-full bg-black/90 md:bg-black/40 backdrop-blur-xl border-r border-white/10 
        flex flex-col items-center py-6 gap-4 transition-transform duration-300
        w-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:block bg-blue-500 p-2 rounded-xl">
          <img src={BRAND_LOGO} alt="PDF" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        
        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-white mb-2">
          <ChevronLeft size={24} />
        </button>

        <button onClick={() => setAppMode('cx')} className={`p-3 rounded-xl transition-colors ${appMode==='cx' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
          <MessageSquare size={20} />
        </button>
        <button onClick={() => setAppMode('admin')} className={`p-3 rounded-xl transition-colors ${appMode==='admin' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
          <LayoutDashboard size={20} />
        </button>
        
        {appMode === 'cx' && (
          <>
            <div className="w-10 h-[1px] bg-white/10 my-2" />
            <button onClick={() => setActiveView('chat')} className={`p-3 rounded-xl transition-colors ${activeView==='chat' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              <MessageSquare size={20} />
            </button>
            <button onClick={() => setActiveView('packages')} className={`p-3 rounded-xl transition-colors ${activeView==='packages' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              <BookOpen size={20} />
            </button>
            <button onClick={() => setActiveView('courses')} className={`p-3 rounded-xl transition-colors ${activeView==='courses' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              <GraduationCap size={20} />
            </button>
            <button onClick={() => setActiveView('faq')} className={`p-3 rounded-xl transition-colors ${activeView==='faq' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              <HelpCircle size={20} />
            </button>
          </>
        )}
      </nav>

      <main className="relative z-20 flex-1 h-full flex flex-col overflow-hidden pt-14 md:pt-0">
        {appMode === 'admin' ? (
          isAdmin ? (
            <AdminDashboard sponsors={sponsors} setSponsors={setSponsors} />
          ) : <AdminLogin onLogin={() => setIsAdmin(true)} />
        ) : (
          <div className="flex-1 flex flex-col h-full relative">
            {/* Desktop Header */}
            <header className="hidden md:flex p-4 lg:p-6 justify-between items-center shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <img src={BRAND_LOGO} alt="PDF" className="h-8" onError={(e) => e.currentTarget.style.display='none'}/>
                  <h1 className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg">PELAGIC DIVERS</h1>
                </div>
                <div className="text-xs uppercase tracking-widest text-blue-300 font-bold pl-11">Fuvahmulah • Maldives</div>
                <div className="flex gap-3 text-[10px] text-slate-300 pl-11 mt-1"><span>300+ Tiger Sharks</span><span>10 Years Experience</span></div>
              </div>
              <div className="bg-black/30 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md flex items-center gap-2">
                <Globe size={14} className="text-blue-300" />
                <span className="text-sm font-medium text-white min-w-[80px] text-center">{GREETINGS[greetingIdx].text}</span>
              </div>
            </header>

            <div className="flex-1 relative overflow-hidden">
              {/* Content Panels */}
              {activeView !== 'chat' && (
                <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-20 flex flex-col">
                  <div className="flex justify-between items-center p-4 md:p-6 border-b border-white/10 shrink-0">
                    <h2 className="text-lg md:text-2xl font-bold text-white">
                      {activeView==='packages' && 'Packages & Pricing'}
                      {activeView==='courses' && 'SSI Certifications'}
                      {activeView==='faq' && 'FAQ'}
                    </h2>
                    <button onClick={() => setActiveView('chat')} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <X className="text-white" size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {activeView === 'packages' && <Packages />}
                    {activeView === 'courses' && <Courses />}
                    {activeView === 'faq' && <FAQ />}
                  </div>
                </div>
              )}

              {/* Chat Interface */}
              <div className="absolute inset-0 flex flex-col z-10">
                <div className="flex-1 overflow-auto p-3 md:p-4 space-y-3 md:space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-xl text-sm md:text-base ${
                        m.role==='user'
                          ?'bg-blue-600 text-white'
                          :'bg-black/60 text-slate-200 border border-white/10'
                      }`}>
                        <ReactMarkdown>{m.text}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && <div className="text-slate-500 text-xs animate-pulse ml-4">Tiger Shark is thinking...</div>}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="shrink-0 p-3 md:p-4 bg-gradient-to-t from-slate-900/80 to-transparent">
                  <div className="bg-black/60 border border-white/10 rounded-xl md:rounded-2xl p-2 flex gap-2">
                    <input 
                      value={input} 
                      onChange={e => setInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      placeholder="Ask anything..."
                      className="flex-1 bg-transparent text-white px-3 md:px-4 py-2 outline-none text-sm md:text-base"
                    />
                    <button onClick={() => setIsLive(true)} className="p-2 text-blue-400 hover:bg-white/10 rounded-lg transition-colors">
                      <Mic size={18} />
                    </button>
                    <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg md:rounded-xl transition-colors hover:bg-blue-500">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Voice Mode Overlay */}
      {isLive && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white p-4">
          <div className="animate-pulse mb-8"><Mic size={48} className="text-blue-500" /></div>
          <h2 className="text-xl md:text-2xl font-light tracking-widest mb-8 text-center">LISTENING...</h2>
          <button onClick={() => setIsLive(false)} className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-3 rounded-full flex gap-2 items-center text-sm">
            <Power size={18} /> END SESSION
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
