import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, BookOpen, HelpCircle, GraduationCap, Mic, Send, 
  LayoutDashboard, Trash2, Globe, Power, X, Menu, Target, TrendingUp,
  Search, Download, ChevronLeft
} from 'lucide-react';
import { 
  BACKGROUND_IMAGES, GREETINGS, BRAND_LOGO,
  DEFAULT_SPONSORS, ANALYTICS_DB
} from './constants';
import { sendMessageToGemini } from './services/geminiService';
import { ChatMessage, Sponsor } from './types';
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

const AdminDashboard = ({ sponsors, setSponsors }: { sponsors: Sponsor[], setSponsors: (s: Sponsor[]) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'analytics'>('campaigns');
  
  const filteredLogs = ANALYTICS_DB.filter(log => 
    log.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-slate-50 text-slate-900 p-4 md:p-8 overflow-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2"><LayoutDashboard /> Operations Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="text-right"><div className="font-bold text-sm md:text-base">Roger Hanney</div><div className="text-xs text-slate-500">Super Admin</div></div>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold text-sm">RH</div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'campaigns' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
        >
          <Target size={16} className="inline mr-2" />Campaigns
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
        >
          <TrendingUp size={16} className="inline mr-2" />Analytics
        </button>
      </div>

      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-4 md:p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Target size={18}/> Campaign Strategy</h3>
            <p className="text-sm text-slate-500 mb-4">Add partners to influence AI answers.</p>
            <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const cat = (form.elements.namedItem('cat') as HTMLInputElement).value;
                const partner = (form.elements.namedItem('partner') as HTMLInputElement).value;
                if(cat && partner) setSponsors([...sponsors, { id: Date.now(), category: cat, partner, frequency: 40, startDate: '2025-01-01', endDate: '2025-12-31' }]);
                form.reset();
            }} className="space-y-3">
                <input name="cat" placeholder="Category (e.g. Cameras)" className="w-full p-2 border rounded text-sm" required />
                <input name="partner" placeholder="Partner (e.g. GoPro)" className="w-full p-2 border rounded text-sm" required />
                <button className="w-full bg-blue-600 text-white p-2 rounded font-bold text-sm">Activate</button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-xl border shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2"><TrendingUp size={18}/> Active Campaigns</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50"><tr><th className="p-2 md:p-3">Category</th><th className="p-2 md:p-3">Partner</th><th className="p-2 md:p-3">Target</th><th className="p-2 md:p-3">Action</th></tr></thead>
                  <tbody>
                      {sponsors.map(s => (
                          <tr key={s.id} className="border-t">
                              <td className="p-2 md:p-3 font-bold">{s.category}</td>
                              <td className="p-2 md:p-3">{s.partner}</td>
                              <td className="p-2 md:p-3">{s.frequency}%</td>
                              <td className="p-2 md:p-3"><button onClick={() => setSponsors(sponsors.filter(x => x.id !== s.id))} className="text-red-500"><Trash2 size={16}/></button></td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Search and Export */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search logs by topic or tag..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
              <Download size={16} /> Export CSV
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border">
              <div className="text-2xl font-bold text-blue-600">{ANALYTICS_DB.length}</div>
              <div className="text-xs text-slate-500">Total Conversations</div>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <div className="text-2xl font-bold text-green-600">{ANALYTICS_DB.filter(l => l.sentiment === 'Positive').length}</div>
              <div className="text-xs text-slate-500">Positive Sentiment</div>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <div className="text-2xl font-bold text-orange-600">{sponsors.length}</div>
              <div className="text-xs text-slate-500">Active Campaigns</div>
            </div>
            <div className="bg-white p-4 rounded-xl border">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-xs text-slate-500">Response Rate</div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50">
              <h3 className="font-bold">Conversation Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-3 font-medium text-slate-600">ID</th>
                    <th className="p-3 font-medium text-slate-600">Date</th>
                    <th className="p-3 font-medium text-slate-600">User</th>
                    <th className="p-3 font-medium text-slate-600">Topic</th>
                    <th className="p-3 font-medium text-slate-600">Tags</th>
                    <th className="p-3 font-medium text-slate-600">Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-slate-50">
                      <td className="p-3 font-mono text-xs text-slate-500">{log.id}</td>
                      <td className="p-3 text-slate-600">{log.date}</td>
                      <td className="p-3">{log.user}</td>
                      <td className="p-3 font-medium">{log.topic}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {log.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                          log.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                          log.sentiment === 'Mixed' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>{log.sentiment}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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

  // Close sidebar when view changes on mobile
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
        <div className="w-10" /> {/* Spacer for centering */}
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
                 
                 {/* Chat Input - Fixed at bottom */}
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
