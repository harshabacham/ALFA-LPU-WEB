
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
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
            <Sparkles size={12} className="text-accent-500" /> Productivity Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none font-display">
            AI Toolbox
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base max-w-xl">
            Supercharge your academic and creative workflow with curated intelligence tools handpicked for LPU students.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="pl-11 pr-4 py-3.5 w-full md:w-64 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <select 
              className="pl-5 pr-10 py-3.5 w-full rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm font-bold text-xs appearance-none uppercase tracking-wider"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <Zap size={12} />
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {loading ? (
          <div className="col-span-full py-40 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px] font-display">Syncing AI Database...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((tool, idx) => (
            <div 
              key={idx} 
              onClick={() => setSelectedTool(tool)}
              className="group relative bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl p-6 hover:shadow-md hover:border-primary-500/20 hover:scale-[1.02] transition-all duration-350 flex flex-col cursor-pointer overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 p-2 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <img src={tool.logo_url} alt={tool.tool_name} className="w-full h-full object-contain rounded-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-primary-500 transition-colors font-display leading-tight">
                    {tool.tool_name}
                  </h3>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-display">{tool.category}</span>
                </div>
              </div>

              <div className="flex-grow space-y-3 relative z-10">
                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3 font-medium">
                  {tool.description}
                </p>
                <div className="text-[10px] font-bold text-primary-500 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform font-display">
                  Full Details <ArrowRight size={12} />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-600">
                    <Zap size={14} className="fill-current text-primary-500/60" />
                    <span className="text-[9px] font-semibold uppercase tracking-wider font-display">Verified Tool</span>
                 </div>
                 <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-500 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                    <ExternalLink size={14} />
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-zinc-50 dark:bg-zinc-900/10 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 max-w-lg mx-auto w-full">
             <Cpu className="mx-auto text-zinc-300 dark:text-zinc-700 mb-6" size={80} />
             <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-tight font-display">Tools Not Found</h3>
             <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-xs font-medium max-w-sm mx-auto px-4">No tool names or descriptions matched your keyword. Please try a different category or search query.</p>
          </div>
        )}
      </div>

      {/* Detailed Tool Modal */}
      {selectedTool && (
        <div 
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedTool(null)}
        >
          <div 
            className="bg-white dark:bg-zinc-900 w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-zinc-200 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 pb-3 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="flex items-center gap-4 text-left">
                <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-2.5 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 shadow-inner">
                  <img src={selectedTool.logo_url} alt={selectedTool.tool_name} className="w-full h-full object-contain rounded" />
                </div>
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 rounded text-[9px] font-bold uppercase tracking-wider font-display">{selectedTool.category}</span>
                      <div className="flex items-center gap-1 text-zinc-400">
                         <ShieldCheck size={12} className="text-emerald-500" />
                         <span className="text-[9px] font-semibold uppercase tracking-wider font-display">Verified Integration</span>
                      </div>
                   </div>
                   <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight font-display">{selectedTool.tool_name}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTool(null)} 
                className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-lg hover:bg-red-500 hover:text-white hover:scale-105 duration-300 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide text-left flex-grow">
              <div className="space-y-3">
                 <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-display">Description</h3>
                 <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap">
                   {selectedTool.description}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-primary-500 shadow-sm"><Zap size={16} /></div>
                    <div>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-display">Integration</p>
                       <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Web Portal</p>
                    </div>
                 </div>
                 <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg text-accent-500 shadow-sm"><Globe size={16} /></div>
                    <div>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider font-display">Availability</p>
                       <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Free Access</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800/60 flex gap-3">
              <button 
                onClick={() => handleShare(selectedTool)}
                className="flex-1 py-3.5 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 font-display"
              >
                <Share2 size={14} /> Share Tool
              </button>
              <a 
                href={selectedTool.tool_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary-500/10 active:scale-95 glow-primary flex items-center justify-center gap-1.5 font-display"
              >
                Try Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITools;
