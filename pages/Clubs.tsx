
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, ExternalLink, Mail, Clock, 
  ShieldCheck, PlusCircle, ArrowUpRight, 
  Sparkles, Compass, Zap
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Club } from '../types';

const Clubs: React.FC = () => {
  const [data, setData] = useState<Club[]>([]);
  const [filteredData, setFilteredData] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Club>(CSV_URLS.CLUBS);
      setData(result);
      setFilteredData(result);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.name || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, data]);

  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    if (clean.length > 20 && !clean.includes('/') && !clean.includes('.')) {
      return `https://drive.google.com/thumbnail?id=${clean}&sz=w1000`;
    }
    return clean;
  };

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 p-10 md:p-20 text-white border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 border border-white/10">
              <Sparkles size={14} className="animate-pulse" /> Student Communities
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85]">
              Lead the <span className="text-primary-500">Future.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              Unlock exclusive opportunities, master new skills, and connect with visionaries. Your journey starts here.
            </p>
          </div>

          <div className="w-full lg:w-auto space-y-4">
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search Hub..." 
                  className="w-full lg:w-[400px] pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-lg font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-3">
               {categories.slice(0, 4).map(cat => (
                 <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-primary-600 border-primary-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Modern Grid Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
          <div className="col-span-full py-40 flex flex-col items-center justify-center">
            <div className="w-20 h-20 border-8 border-primary-100 dark:border-primary-900/20 border-t-primary-600 rounded-full animate-spin"></div>
            <p className="mt-8 text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Syncing Directory...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((club, index) => (
            <div 
              key={club.id || index} 
              className="group relative bg-white dark:bg-gray-800/40 rounded-[3rem] border border-gray-100 dark:border-gray-800/50 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-700 flex flex-col overflow-hidden hover:-translate-y-4"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-10 flex-grow space-y-8">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-3.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-none border border-gray-100 dark:border-white/5 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-700">
                    {club.logo_link ? (
                      <img 
                        src={getDirectImageUrl(club.logo_link)} 
                        alt={club.name} 
                        className="w-full h-full object-contain filter drop-shadow-sm" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`fallback flex items-center justify-center text-primary-500 ${club.logo_link ? 'hidden' : ''}`}>
                      <Users size={32} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-primary-500/20">
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      {club.category || 'Active'}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 group-hover:text-primary-500 transition-colors">
                       <Zap size={14} className="fill-current" />
                       <span className="text-[8px] font-black uppercase tracking-widest italic">Fast Entry</span>
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight group-hover:text-primary-600 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 font-medium">
                    {club.description}
                  </p>
                </div>

                {/* Frosted Detail Bar */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-primary-500">
                        <Clock size={16} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Meetings</span>
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200 truncate">{club.meeting_times || 'Weekly'}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-xl text-primary-500">
                        <Mail size={16} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Point of Contact</span>
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-200 truncate">{club.contact_info || 'View Form'}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="px-10 pb-10">
                <a 
                  href={club.form_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative group/btn w-full flex items-center justify-between px-8 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-primary-500/20 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white dark:hover:text-white transition-all active:scale-[0.96] overflow-hidden"
                >
                  <span className="relative z-10">Join Community</span>
                  <ArrowUpRight size={20} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-48 flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 animate-bounce">
              <Compass size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white">Empty Orbit</h3>
              <p className="text-gray-500 font-medium">No communities matched your coordinates. Try searching again.</p>
            </div>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="px-8 py-3 bg-primary-600 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;
