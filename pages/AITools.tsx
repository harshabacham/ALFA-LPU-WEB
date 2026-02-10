
import React, { useState, useEffect } from 'react';
import { Cpu, Search, ExternalLink, Zap } from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { AITool } from '../types';

const AITools: React.FC = () => {
  const [data, setData] = useState<AITool[]>([]);
  const [filteredData, setFilteredData] = useState<AITool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Toolbox</h1>
          <p className="text-gray-500">Supercharge your productivity with artificial intelligence</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tools..." 
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((tool, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col group">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/30 p-2 flex items-center justify-center shrink-0">
                  <img src={tool.logo_url} alt={tool.tool_name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                    {tool.tool_name}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tool.category}</span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {tool.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                 <div className="flex items-center gap-2 text-primary-500">
                    <Zap size={16} className="fill-current" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Fast Setup</span>
                 </div>
                 <a 
                  href={tool.tool_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-2 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                >
                  Try Now <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500">
            No AI tools found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AITools;
