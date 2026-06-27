import React, { useState } from 'react';
import { Siren, Search, X, Sparkles } from 'lucide-react';

const Emergency: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Sleek, Non-Routine Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 p-6 md:p-10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider font-display glow-primary animate-bounce-slow">
              <Siren size={12} className="animate-pulse" /> Official 24/7 Response Desk
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none font-display text-zinc-900 dark:text-white">
              Helpline <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-rose-400 to-pink-400">Numbers</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl font-medium">
              Zero friction, immediate assistance portal. Access dedicated hospital services, safety commanders, and student relationship cells dynamically.
            </p>
          </div>

          {/* Search Box Built Directly Into Header Card for Fresh Look */}
          <div className="relative w-full lg:max-w-md bg-white dark:bg-zinc-950/40 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800/60">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search hostel blocks, doctor names..." 
              className="pl-12 pr-10 py-3.5 w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 border border-zinc-200 dark:border-transparent focus:border-primary-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-primary-500 animate-pulse" /> Emergency Command Guidelines
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
            For major security or medical contingencies, dial the Hospital Desk or Fire cell immediately. Landline extensions are fully responsive between 8:30 AM and 6:00 PM. Mobile support is authorized for round-the-clock physical emergency response.
          </p>
        </div>

        <a 
          href="tel:01824-444079" 
          className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/10 active:scale-95 transition-all font-display block text-center cursor-pointer select-none"
        >
          Dial Central Response
        </a>
      </div>

    </div>
  );
};

export default Emergency;
