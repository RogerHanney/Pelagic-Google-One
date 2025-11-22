import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, BookOpen, HelpCircle, GraduationCap, Mic, Send, 
  LayoutDashboard, Trash2, Globe, Power, X
} from 'lucide-react';
import { 
  BACKGROUND_IMAGES, GREETINGS, BRAND_LOGO,
  DEFAULT_SPONSORS
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
    <div className="flex items-center justify-center h-full bg-slate-50">
      <div className="bg-white p-8 rounded-2xl border shadow-xl w-full max-w-md">
        <div className="flex justify-center mb-6"><img src={BRAND_LOGO} alt="Logo" className="h-16" onError={(e)=>{e.currentTarget.style.display='none'}} /></div>
        <h2 className="text-2xl font-bold text-center mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded-lg" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border rounded-lg" />
          <button type="submit" className="w-full bg-blue-900 text-white p-3 rounded-lg font-bold">Login</button>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'cx' | 'admin'>('cx');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'packages' | 'courses' | 'faq'>('chat');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [sponsors, setSponsors] = useState<Sponsor[]>(DEFAULT_SPONSORS);
  
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
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 font-sans text-slate-200 flex">
      {appMode === 'cx' && <ImmersiveBackground />}
      
      <nav className="relative z-30 w-20 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col items-center py-6 gap-6">
        <div className="bg-blue-500 p-2 rounded-xl">
          <img src={BRAND_LOGO} alt="PDF" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <button onClick={() => setAppMode('cx')} className={`p-3 rounded-xl ${appMode==='cx' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}><MessageSquare /></button>
        <button onClick={() => setAppMode('admin')} className={`p-3 rounded-xl ${appMode==='admin' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}><LayoutDashboard /></button>
        
        {appMode === 'cx' && (
          <>
            <div className="w-10 h-[1px] bg-white/10" />
            <button onClick={() => setActiveView('chat')} className={`p-3 rounded-xl ${activeView==='chat' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}><MessageSquare /></button>
            <button onClick={() => setActiveView('packages')} className={`p-3 rounded-xl ${activeView==='packages' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}><BookOpen /></button>
            <button onClick={() => setActiveView('courses')} className={`p-3 rounded-xl ${activeView==='courses' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}><GraduationCap /></button>
            <button onClick={() => setActiveView('faq')} className={`p-3 rounded-xl ${activeView==='faq' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}><HelpCircle /></button>
          </>
        )}
      </nav>

      <main className="relative z-20 flex-1 h-full flex flex-col overflow-hidden">
        {appMode === 'admin' ? (
          isAdmin ? (
            <div className="flex-1 bg-slate-50 text-slate-900 p-8 overflow-auto">
               <header className="flex justify-between items-center mb-8">
                 <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard /> Operations Dashboard</h1>
                 <div className="flex items-center gap-2">
                    <div className="text-right"><div className="font-bold">Roger Hanney</div><div className="text-xs text-slate-500">Super Admin</div></div>
                    <div className="w-10 h-10 bg-blue-600 rounded-full text-white flex items-center justify-center font-bold">RH</div>
                 </div>
               </header>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">Campaign Strategy</h3>
                    <p className="text-sm text-slate-500 mb-4">Add partners to influence AI answers.</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const cat = (form.elements.namedItem('cat') as HTMLInputElement).value;
                        const partner = (form.elements.namedItem('partner') as HTMLInputElement).value;
                        if(cat && partner) setSponsors([...sponsors, { id: Date.now(), category: cat, partner, frequency: 40, startDate: '2025-01-01', endDate: '2025-12-31' }]);
                        form.reset();
                    }} className="space-y-3">
                        <input name="cat" placeholder="Category (e.g. Cameras)" className="w-full p-2 border rounded" required />
                        <input name="partner" placeholder="Partner (e.g. GoPro)" className="w-full p-2 border rounded" required />
                        <button className="w-full bg-blue-600 text-white p-2 rounded font-bold">Activate</button>
                    </form>
                  </div>
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2">Active Campaigns</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50"><tr><th className="p-3">Category</th><th className="p-3">Partner</th><th className="p-3">Target</th><th className="p-3">Action</th></tr></thead>
                        <tbody>
                            {sponsors.map(s => (
                                <tr key={s.id} className="border-t">
                                    <td className="p-3 font-bold">{s.category}</td>
                                    <td className="p-3">{s.partner}</td>
                                    <td className="p-3">{s.frequency}%</td>
                                    <td className="p-3"><button onClick={() => setSponsors(sponsors.filter(x => x.id !== s.id))} className="text-red-500"><Trash2 size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                  </div>
               </div>
            </div>
          ) : <AdminLogin onLogin={() => setIsAdmin(true)} />
        ) : (
          <div className="flex-1 flex flex-col h-full relative">
            <header className="p-6 flex justify-between items-center shrink-0">
               <div>
                  <div className="flex items-center gap-3 mb-1">
                    <img src={BRAND_LOGO} alt="PDF" className="h-8" onError={(e) => e.currentTarget.style.display='none'}/>
                    <h1 className="text-2xl font-bold text-white drop-shadow-lg">PELAGIC DIVERS</h1>
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
               {activeView !== 'chat' && (
                 <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl z-20 flex flex-col animate-in slide-in-from-bottom-5">
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                        <h2 className="text-2xl font-bold text-white">
                            {activeView==='packages' && 'Packages & Pricing'}
                            {activeView==='courses' && 'SSI Certifications'}
                            {activeView==='faq' && 'Frequently Asked Questions'}
                        </h2>
                        <button onClick={() => setActiveView('chat')} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X className="text-white" /></button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {activeView === 'packages' && <Packages />}
                        {activeView === 'courses' && <Courses />}
                        {activeView === 'faq' && <FAQ />}
                    </div>
                 </div>
               )}

               <div className="absolute inset-0 flex flex-col z-10">
                 <div className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-xl ${m.role==='user'?'bg-blue-600 text-white':'bg-black/60 text-slate-200 border border-white/10'}`}>
                                <ReactMarkdown>{m.text}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-slate-500 text-xs animate-pulse ml-4">Tiger Shark is thinking...</div>}
                 </div>
                 <div className="p-4">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-2 flex gap-2">
                        <input 
                            value={input} 
                            onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent text-white px-4 py-2 outline-none"
                        />
                        <button onClick={() => setIsLive(true)} className="p-2 text-blue-400 hover:bg-white/10 rounded"><Mic /></button>
                        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-xl"><Send size={18} /></button>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>
      
      {isLive && (
        <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center text-white">
             <div className="animate-pulse mb-8"><Mic size={64} className="text-blue-500" /></div>
             <h2 className="text-2xl font-light tracking-widest mb-8">LISTENING...</h2>
             <button onClick={() => setIsLive(false)} className="bg-red-500/20 border border-red-500 text-red-200 px-8 py-3 rounded-full flex gap-2 items-center">
                <Power size={18} /> END SESSION
             </button>
        </div>
      )}
    </div>
  );
};

export default App;
