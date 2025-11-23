import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, BookOpen, HelpCircle, GraduationCap, Mic, Send, 
  LayoutDashboard, Trash2, Globe, Power, X, Menu, Target, TrendingUp,
  Download, BarChart3, ChevronLeft, Calendar
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

const AdminLogin = ({ onLogin }: { onLogin: (remember: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'admin@pelagicdivers.com' || email === 'hanneyroger@gmail.com' || email === 'inah@pelagicdiversfuvahmulah.com' || email === 'info@pelagicdiversfuvahmulah.com') && password === 'shark') {
      onLogin(remember);
    }
  };
  return (
    <div className="flex items-center justify-center h-full bg-slate-50 p-4">
      <div className="bg-white p-6 rounded-2xl border shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6"><img src={BRAND_LOGO} alt="Logo" className="h-12" onError={(e)=>{e.currentTarget.style.display='none'}} /></div>
        <h2 className="text-xl font-bold text-center mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded-lg" />
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
            Stay logged in
          </label>
          <button type="submit" className="w-full bg-blue-900 text-white p-3 rounded-lg font-bold">Login</button>
        </form>
      </div>
    </div>
  );
};

// Reusable Date Filter Component
const DateFilter = ({ dateRange, setDateRange, filterMode, setFilterMode }: {
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  filterMode: string;
  setFilterMode: (mode: string) => void;
}) => {
  const applyPreset = (mode: 'TWK' | 'LWK' | 'LMTH') => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    if (mode === 'TWK') { start.setDate(today.getDate() - today.getDay()); end = today; }
    else if (mode === 'LWK') { start.setDate(today.getDate() - today.getDay() - 7); end.setDate(today.getDate() - today.getDay() - 1); }
    else if (mode === 'LMTH') { start = new Date(today.getFullYear(), today.getMonth() - 1, 1); end = new Date(today.getFullYear(), today.getMonth(), 0); }
    setDateRange({ start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] });
    setFilterMode(mode);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 text-[10px]">
      <button onClick={() => applyPreset('TWK')} className={`px-1.5 py-0.5 font-bold rounded ${filterMode==='TWK'?'bg-blue-100 text-blue-600':'text-slate-400 hover:text-slate-600'}`}>TWK</button>
      <button onClick={() => applyPreset('LWK')} className={`px-1.5 py-0.5 font-bold rounded ${filterMode==='LWK'?'bg-blue-100 text-blue-600':'text-slate-400 hover:text-slate-600'}`}>LWK</button>
      <button onClick={() => applyPreset('LMTH')} className={`px-1.5 py-0.5 font-bold rounded ${filterMode==='LMTH'?'bg-blue-100 text-blue-600':'text-slate-400 hover:text-slate-600'}`}>LMTH</button>
      <input 
        type="date" 
        value={dateRange.start} 
        onChange={(e) => { setDateRange({...dateRange, start: e.target.value}); setFilterMode('Custom'); }}
        className="bg-slate-50 border rounded px-1 py-0.5 w-24 text-[10px]"
      />
      <span className="text-slate-300">-</span>
      <input 
        type="date" 
        value={dateRange.end} 
        onChange={(e) => { setDateRange({...dateRange, end: e.target.value}); setFilterMode('Custom'); }}
        className="bg-slate-50 border rounded px-1 py-0.5 w-24 text-[10px]"
      />
    </div>
  );
};

const AdminDashboard = ({ sponsors, setSponsors }: { sponsors: Sponsor[], setSponsors: (s: Sponsor[]) => void }) => {
  // Separate date states for each panel
  const [roiDateRange, setRoiDateRange] = useState({ start: '2025-01-01', end: '2025-02-28' });
  const [roiFilterMode, setRoiFilterMode] = useState('Custom');
  
  const [logsDateRange, setLogsDateRange] = useState({ start: '2025-01-01', end: '2025-02-28' });
  const [logsFilterMode, setLogsFilterMode] = useState('Custom');

  // Filter logs for each panel independently
  const roiFilteredLogs = useMemo(() => ANALYTICS_DB.filter(log => log.date >= roiDateRange.start && log.date <= roiDateRange.end), [roiDateRange]);
  const logsFilteredLogs = useMemo(() => ANALYTICS_DB.filter(log => log.date >= logsDateRange.start && log.date <= logsDateRange.end), [logsDateRange]);

  // Campaign stats use ROI date range
  const campaignStats = useMemo(() => sponsors.map(sponsor => {
    const categoryVol = roiFilteredLogs.filter(l => l.categoryMatch === sponsor.category).length;
    const brandMentions = roiFilteredLogs.filter(l => l.brandMentioned === sponsor.partner).length;
    const sov = categoryVol > 0 ? Math.round((brandMentions / categoryVol) * 100) : 0;
    return { ...sponsor, categoryVol, brandMentions, sov };
  }), [roiFilteredLogs, sponsors]);

  // KPIs use logs date range
  const sentimentScore = useMemo(() => { 
    if (logsFilteredLogs.length === 0) return 0; 
    return Math.round((logsFilteredLogs.filter(l => l.sentiment === 'Positive').length / logsFilteredLogs.length) * 100); 
  }, [logsFilteredLogs]);
  
  const totalMentions = useMemo(() => logsFilteredLogs.filter(l => l.brandMentioned).length, [logsFilteredLogs]);

  const handleExport = () => {
    const headers = ["Date", "Time", "User", "Topic", "Category", "Brand Mentioned", "Sentiment"];
    const rows = logsFilteredLogs.map(l => [l.date, l.time, l.user, `"${l.topic}"`, l.categoryMatch || '-', l.brandMentioned || '-', l.sentiment].join(","));
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `pelagic_logs_${logsDateRange.start}_to_${logsDateRange.end}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Simple Header */}
      <header className="bg-white border-b p-3 flex justify-between items-center shrink-0">
        <h2 className="text-lg font-bold flex items-center gap-2"><LayoutDashboard className="text-blue-600" /> Operations</h2>
        <div className="text-xs text-slate-400">Pelagic Divers Admin</div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid lg:grid-cols-3 gap-4">
          
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            
            {/* CAMPAIGN INPUT - with its own date range */}
            <div className="bg-white p-4 rounded-xl border">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-sm"><Target size={16} className="text-red-500"/> New Campaign</h3>
              <form onSubmit={(e) => { 
                e.preventDefault(); 
                const f = new FormData(e.currentTarget); 
                setSponsors([...sponsors, { 
                  id: Date.now(), 
                  category: f.get('cat') as string, 
                  partner: f.get('partner') as string, 
                  frequency: Number(f.get('freq')), 
                  startDate: f.get('start') as string, 
                  endDate: f.get('end') as string, 
                  active: true 
                }]); 
                (e.target as HTMLFormElement).reset(); 
              }} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Category</label>
                    <input name="cat" placeholder="e.g. Cameras" className="w-full p-2 border rounded text-sm" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Partner Brand</label>
                    <input name="partner" placeholder="e.g. GoPro" className="w-full p-2 border rounded text-sm" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Target Frequency %</label>
                  <input name="freq" type="number" defaultValue={40} min={1} max={100} className="w-full p-2 border rounded text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1 flex items-center gap-1"><Calendar size={10}/> Start Date</label>
                    <input name="start" type="date" className="w-full p-2 border rounded text-sm" required />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1 flex items-center gap-1"><Calendar size={10}/> End Date</label>
                    <input name="end" type="date" className="w-full p-2 border rounded text-sm" required />
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white p-2 rounded font-bold text-sm hover:bg-blue-700 transition-colors">Launch Campaign</button>
              </form>
            </div>

            {/* ACTIVE ROI - with its own date filter */}
            <div className="bg-white p-4 rounded-xl border">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold flex items-center gap-2 text-sm"><TrendingUp size={16} className="text-green-500"/> Active ROI</h3>
              </div>
              {/* ROI Date Filter */}
              <div className="mb-3 pb-3 border-b">
                <DateFilter 
                  dateRange={roiDateRange} 
                  setDateRange={setRoiDateRange}
                  filterMode={roiFilterMode}
                  setFilterMode={setRoiFilterMode}
                />
              </div>
              <div className="space-y-3">
                {campaignStats.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No campaigns</p>}
                {campaignStats.map(s => (
                  <div key={s.id} className={`p-3 rounded-lg border ${s.active ? 'bg-slate-50' : 'bg-slate-100 opacity-60'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <span className="font-bold text-sm">{s.partner}</span>
                        <span className={`ml-2 text-[9px] px-1 py-0.5 rounded ${s.active ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                          {s.active ? 'LIVE' : 'PAUSED'}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setSponsors(sponsors.map(x => x.id === s.id ? { ...x, active: !x.active } : x))} className="text-slate-400 hover:text-blue-500 p-1"><Power size={12} /></button>
                        <button onClick={() => setSponsors(sponsors.filter(x => x.id !== s.id))} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 mb-1">{s.category} • Target: {s.frequency}%</div>
                    <div className="text-[9px] text-slate-400 mb-2 flex items-center gap-1">
                      <Calendar size={9}/> {s.startDate} → {s.endDate}
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-slate-400">{s.brandMentions}/{s.categoryVol} mentions</span>
                      <span className={`text-lg font-bold ${s.sov >= s.frequency ? 'text-green-500' : 'text-blue-600'}`}>{s.sov}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${s.sov >= s.frequency ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(s.sov, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - LOGS with its own date filter */}
          <div className="lg:col-span-2 bg-white rounded-xl border flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold flex items-center gap-2 text-sm"><BarChart3 size={16} /> Chat Logs</h3>
                <button onClick={handleExport} className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors">
                  <Download size={10} /> CSV
                </button>
              </div>
              {/* Logs Date Filter */}
              <DateFilter 
                dateRange={logsDateRange} 
                setDateRange={setLogsDateRange}
                filterMode={logsFilterMode}
                setFilterMode={setLogsFilterMode}
              />
            </div>
            
            {/* KPI Summary for this date range */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 border-b">
              <div className="text-center">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Chats</div>
                <div className="text-lg font-bold">{logsFilteredLogs.length}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Sentiment</div>
                <div className={`text-lg font-bold ${sentimentScore >= 70 ? 'text-green-500' : 'text-orange-500'}`}>{sentimentScore}%</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500 uppercase font-bold">Mentions</div>
                <div className="text-lg font-bold text-blue-600">{totalMentions}</div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="flex-1 overflow-auto max-h-[400px]">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="p-2 font-bold">Date</th>
                    <th className="p-2 font-bold">User</th>
                    <th className="p-2 font-bold hidden md:table-cell">Topic</th>
                    <th className="p-2 font-bold">Tags</th>
                    <th className="p-2 font-bold">Sent</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logsFilteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-2 whitespace-nowrap">{log.date}</td>
                      <td className="p-2">{log.user}</td>
                      <td className="p-2 hidden md:table-cell max-w-[150px] truncate">{log.topic}</td>
                      <td className="p-2">
                        {log.categoryMatch && <span className="px-1 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] mr-1">{log.categoryMatch}</span>}
                        {log.brandMentioned && <span className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-[9px]">{log.brandMentioned}</span>}
                      </td>
                      <td className="p-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${log.sentiment === 'Positive' ? 'bg-green-50 text-green-600' : log.sentiment === 'Negative' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                          {log.sentiment.charAt(0)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {logsFilteredLogs.length === 0 && (
                    <tr><td colSpan={5} className="p-8 text-center text-slate-400">No logs for selected period</td></tr>
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

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'cx' | 'admin'>('cx');
  const [isAdmin, setIsAdmin] = useState(() => {
    try { return localStorage.getItem('pelagic_admin') === 'true'; } catch { return false; }
  });
  const [activeView, setActiveView] = useState<'chat' | 'packages' | 'courses' | 'faq'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [liveStatus, setLiveStatus] = useState<'connecting' | 'listening' | 'error'>('connecting');
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startLiveSession = async () => {
    setIsLive(true);
    setLiveStatus('connecting');
    try {
      const { connectLiveSession, decodeAudioData } = await import('./services/geminiService');
      
      // Initialize audio playback
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const session = await connectLiveSession({
        onOpen: () => setLiveStatus('listening'),
        onAudioData: async (base64Audio: string) => {
          if (audioContextRef.current) {
            const buffer = await decodeAudioData(base64Audio, audioContextRef.current);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start();
          }
        },
        onClose: () => {
          setIsLive(false);
          setLiveStatus('connecting');
        },
        onError: (error: any) => {
          console.error('Live session error:', error);
          setLiveStatus('error');
        }
      });
      
      liveSessionRef.current = session;
    } catch (error) {
      console.error('Failed to start live session:', error);
      setLiveStatus('error');
    }
  };

  const stopLiveSession = async () => {
    if (liveSessionRef.current) {
      await liveSessionRef.current.disconnect();
      liveSessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsLive(false);
    setLiveStatus('connecting');
  };

  useEffect(() => {
    if (isLive && !liveSessionRef.current) {
      startLiveSession();
    }
  }, [isLive]);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);

  const handleAdminLogin = (remember: boolean) => {
    setIsAdmin(true);
    if (remember) {
      try { localStorage.setItem('pelagic_admin', 'true'); } catch {}
    }
  };

  useEffect(() => {
    if (!initRef.current) {
      const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
      setMessages([{ role: 'model', text: g.chat, timestamp: new Date() }]);
      initRef.current = true;
    }
    const interval = setInterval(() => setGreetingIdx(p => (p + 1) % GREETINGS.length), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { setSidebarOpen(false); }, [activeView, appMode]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await sendMessageToGemini(userMsg.text, sponsors);
      setMessages(p => [...p, { role: 'model', text: response, timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-900 font-sans text-slate-200">
      {appMode === 'cx' && <ImmersiveBackground />}
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-3 py-2 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white"><Menu size={20} /></button>
        <div className="flex items-center gap-2">
          <img src={BRAND_LOGO} alt="Logo" className="h-6" onError={(e) => e.currentTarget.style.display='none'}/>
          <div className="text-center">
            <div className="font-bold text-white text-xs leading-tight">PELAGIC DIVERS</div>
            <div className="text-[8px] text-blue-300 uppercase tracking-wider">Fuvahmulah</div>
          </div>
        </div>
        <div className="w-10" />
      </div>

      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />}
      
      <nav className={`fixed z-50 top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-4 gap-3 transition-transform duration-300 w-16 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="hidden md:block bg-blue-500 p-1.5 rounded-lg mb-2"><img src={BRAND_LOGO} alt="Logo" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-white mb-2"><ChevronLeft size={20} /></button>
        <button onClick={() => setAppMode('cx')} className={`p-2 rounded-lg ${appMode==='cx' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><MessageSquare size={18} /></button>
        <button onClick={() => setAppMode('admin')} className={`p-2 rounded-lg ${appMode==='admin' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><LayoutDashboard size={18} /></button>
        {appMode === 'cx' && (<>
          <div className="w-8 h-[1px] bg-white/10 my-1" />
          <button onClick={() => setActiveView('chat')} className={`p-2 rounded-lg ${activeView==='chat' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><MessageSquare size={18} /></button>
          <button onClick={() => setActiveView('packages')} className={`p-2 rounded-lg ${activeView==='packages' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><BookOpen size={18} /></button>
          <button onClick={() => setActiveView('courses')} className={`p-2 rounded-lg ${activeView==='courses' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><GraduationCap size={18} /></button>
          <button onClick={() => setActiveView('faq')} className={`p-2 rounded-lg ${activeView==='faq' ? 'bg-blue-500 text-white' : 'text-slate-400'}`}><HelpCircle size={18} /></button>
        </>)}
      </nav>

      <main className="fixed top-0 right-0 bottom-0 left-0 md:left-16 flex flex-col pt-12 md:pt-0">
        {appMode === 'admin' ? (
          isAdmin ? <AdminDashboard sponsors={sponsors} setSponsors={setSponsors} /> : <AdminLogin onLogin={handleAdminLogin} />
        ) : (
          <div className="flex-1 flex flex-col h-full relative overflow-hidden">
            <header className="hidden md:flex p-4 justify-between items-center shrink-0">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <img src={BRAND_LOGO} alt="Logo" className="h-10" onError={(e) => e.currentTarget.style.display='none'}/>
                  <div>
                    <h1 className="text-xl font-bold text-white">PELAGIC DIVERS FUVAHMULAH</h1>
                    <div className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">Maldives • UNESCO Biosphere</div>
                  </div>
                </div>
                <div className="flex gap-4 text-[10px] text-slate-300 mt-2">
                  <span>🦈 Tiger Sharks Year-Round</span>
                  <span>✓ 100% Safety Record</span>
                  <span>✓ 10+ Years Experience</span>
                </div>
              </div>
              <div className="bg-black/30 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2"><Globe size={12} className="text-blue-300" /><span className="text-xs font-medium text-white">{GREETINGS[greetingIdx].text}</span></div>
            </header>

            <div className="flex-1 relative overflow-hidden">
              {activeView !== 'chat' && (
                <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-20 flex flex-col">
                  <div className="flex justify-between items-center p-3 border-b border-white/10 shrink-0">
                    <h2 className="text-base font-bold text-white">{activeView==='packages' ? 'Packages' : activeView==='courses' ? 'Courses' : 'FAQ'}</h2>
                    <button onClick={() => setActiveView('chat')} className="p-1.5 hover:bg-white/10 rounded"><X className="text-white" size={18} /></button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    {activeView === 'packages' && <Packages />}
                    {activeView === 'courses' && <Courses />}
                    {activeView === 'faq' && <FAQ />}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="absolute inset-0 bottom-16 overflow-auto p-3 space-y-3">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role==='user'?'bg-blue-600 text-white':'bg-black/60 text-slate-200 border border-white/10'}`}>
                      <ReactMarkdown components={{
                        a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{children}</a>,
                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                        text: ({children}) => {
                          // Auto-linkify plain URLs
                          if (typeof children === 'string') {
                            const urlRegex = /(https?:\/\/[^\s]+)/g;
                            const parts = children.split(urlRegex);
                            return <>{parts.map((part, i) => 
                              urlRegex.test(part) ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline break-all">{part}</a> : part
                            )}</>;
                          }
                          return <>{children}</>;
                        }
                      }}>{m.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && <div className="text-slate-500 text-xs animate-pulse">Thinking...</div>}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Fixed Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur p-2 border-t border-white/10">
              <div className="flex items-center gap-2 bg-black/60 rounded-xl p-1.5 border border-white/20">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)} 
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent text-white px-3 py-2 outline-none text-base min-w-0"
                  style={{ fontSize: '16px' }}
                />
                <button onClick={startLiveSession} className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-blue-400">
                  <Mic size={20} />
                </button>
                <button onClick={handleSend} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-lg">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {isLive && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white p-4">
          <div className="animate-pulse mb-6"><Mic size={48} className={liveStatus === 'error' ? 'text-red-500' : 'text-blue-500'} /></div>
          <h2 className="text-xl font-light tracking-widest mb-2">
            {liveStatus === 'connecting' && 'CONNECTING...'}
            {liveStatus === 'listening' && 'LISTENING...'}
            {liveStatus === 'error' && 'CONNECTION ERROR'}
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            {liveStatus === 'listening' && 'Speak naturally - I can hear you'}
            {liveStatus === 'error' && 'Check microphone permissions'}
          </p>
          <button onClick={stopLiveSession} className="bg-red-500/20 border border-red-500 text-red-200 px-6 py-3 rounded-full flex gap-2 items-center text-sm hover:bg-red-500/30 transition-colors">
            <Power size={18} /> END SESSION
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
