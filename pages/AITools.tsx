
import React, { useState, useEffect } from 'react';
import { 
  Cpu, Search, ExternalLink, Zap, X, Info, 
  Sparkles, Share2, ArrowRight, MessageSquare,
  ShieldCheck, Globe
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { AITool } from '../types';

const AITools: React.FC = () => {
  const [data, setData] = useState<AITool[]>([]);
  const [filteredData, setFilteredData] = useState<AITool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<AITool>(CSV_URLS.AI_TOOLS);
      setData(result);
      setFilteredData(result);
      setLoading(false);
    };
    load();
  }, []);

  const dispatchModalState = (isOpen: boolean) => {
    window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: isOpen } }));
  };

  useEffect(() => {
    dispatchModalState(!!selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.tool_name || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, data]);

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];

  const handleShare = async (tool: AITool) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out ${tool.tool_name} on Alfa(LPU)`,
          text: tool.description,
          url: window.location.href
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} /> Productivity
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-zinc-50 tracking-tighter uppercase leading-none">
            AI Toolbox
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg max-w-xl">
            Supercharge your workflow with curated artificial intelligence tools. Handpicked for students and creators.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input 
              type="text" 
              placeholder="Find tools..." 
              className="pl-14 pr-8 py-4 w-full md:w-72 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="pl-6 pr-12 py-4 w-full rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm font-bold text-xs appearance-none uppercase tracking-widest"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <Zap size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
        {loading ? (
          <div className="col-span-full py-40 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-6 text-zinc-400 font-black uppercase tracking-widest text-xs">Syncing AI Database...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((tool, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedTool(tool)}
              className="group relative bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-[2.5rem] p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 p-2.5 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <img src={tool.logo_url} alt={tool.tool_name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 group-hover:text-primary-600 transition-colors">
                    {tool.tool_name}
                  </h3>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{tool.category}</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 relative z-10">
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-4 font-medium">
                  {tool.description}
                </p>
                <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all">
                  Full Details <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-10 pt-6 border-t border-zinc-50 dark:border-zinc-800/50 flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-2 text-zinc-300 dark:text-zinc-700">
                    <Zap size={16} className="fill-current" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Premium Pick</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                    <ExternalLink size={18} />
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-48 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[4rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
             <Cpu className="mx-auto text-zinc-200 dark:text-zinc-800 mb-8" size={120} />
             <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tighter">Tools Not Found</h3>
             <p className="text-zinc-500 mt-2 font-medium max-w-sm mx-auto">Try search for something else or explore a different category.</p>
          </div>
        )}
      </div>

      {/* Detailed Tool Modal */}
      {selectedTool && (
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedTool(null)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 w-full max-w-3xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/10 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 md:p-12 pb-4 flex justify-between items-start">
              <div className="flex items-center gap-6 text-left">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] p-4 flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-xl">
                  <img src={selectedTool.logo_url} alt={selectedTool.tool_name} className="w-full h-full object-contain" />
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">{selectedTool.category}</span>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                         <ShieldCheck size={14} />
                         <span className="text-[9px] font-black uppercase tracking-widest">Verified Tool</span>
                      </div>
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 leading-tight tracking-tighter">{selectedTool.tool_name}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTool(null)} 
                className="p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 md:p-12 overflow-y-auto space-y-10 scrollbar-hide text-left">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-8 bg-primary-600 rounded-full glow-primary"></div>
                   <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">About this Tool</h3>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-zinc-700 dark:text-zinc-300 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap">
                    {selectedTool.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl text-primary-600 shadow-sm"><Zap size={20} /></div>
                    <div>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Integration</p>
                       <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Web & Browser</p>
                    </div>
                 </div>
                 <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-800/50 flex items-center gap-4">
                    <div className="p-3 bg-white dark:bg-zinc-800 rounded-2xl text-indigo-600 shadow-sm"><Globe size={20} /></div>
                    <div>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Availability</p>
                       <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Global Access</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 md:p-12 pt-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleShare(selectedTool)}
                className="flex-grow py-5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-sm"
              >
                <Share2 size={18} /> Share Tool
              </button>
              <a 
                href={selectedTool.tool_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-500/20 active:scale-95 glow-primary flex items-center justify-center gap-3"
              >
                Try {selectedTool.tool_name} <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITools;
