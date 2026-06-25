import React, { useState, useEffect } from 'react';
import { Tag, Search, Filter, MapPin, ShoppingBag, Star, Mail, Phone, ChevronRight, Sparkles, Zap } from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Deal } from '../types';

const Deals: React.FC = () => {
  const [data, setData] = useState<Deal[]>([]);
  const [filteredData, setFilteredData] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Deal>(CSV_URLS.DEALS);
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
        (item.title || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search) ||
        (item.tags || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (selectedCondition !== 'All') {
      result = result.filter(item => item.condition === selectedCondition);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, selectedCondition, data]);

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];
  const conditions = ['All', ...Array.from(new Set(data.map(i => i.condition).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
            <Sparkles size={12} className="text-accent-500" /> Marketplace Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none font-display">
            Alfa Deals
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base max-w-xl">
            Exclusively curated community marketplace. Buy and sell textbooks, gadgets, and campus essentials safely.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="pl-11 pr-4 py-3.5 w-full md:w-64 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50 dark:bg-zinc-900/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50 dark:bg-zinc-900/50 focus:border-primary-500 outline-none text-xs font-bold uppercase tracking-wider"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select 
              className="px-4 py-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50 dark:bg-zinc-900/50 focus:border-primary-500 outline-none text-xs font-bold uppercase tracking-wider"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-24">
        {loading ? (
          <div className="col-span-full py-40 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px] font-display">Syncing Market Database...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((deal, idx) => (
            <div key={`${deal.id || 'deal'}-${idx}`} className="group bg-sand-50 dark:bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/40 hover:shadow-md hover:border-primary-500/20 hover:scale-[1.02] transition-all duration-350 flex flex-col text-left">
              <div className="relative h-40 md:h-48 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 bg-sand-50/90 dark:bg-zinc-900/90 backdrop-blur rounded-lg text-[9px] font-bold text-primary-500 shadow-sm uppercase tracking-wider font-display">
                    {deal.condition}
                  </span>
                </div>
              </div>
              
              <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white line-clamp-1 font-display">{deal.title}</h3>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star size={12} className="fill-current text-amber-400" />
                      <span className="text-[10px]">{deal.rating}</span>
                    </div>
                  </div>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mb-4 font-medium leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end border-t border-zinc-100 dark:border-zinc-800/50 pt-3">
                    <div>
                      <span className="text-base md:text-lg font-extrabold text-primary-500 font-display">₹{deal.price}</span>
                      <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                         <MapPin size={10} /> {deal.location}
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] text-zinc-400 font-bold uppercase mb-0.5 font-display">Seller</p>
                       <p className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-200">{deal.seller_name}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a 
                      href={`mailto:${deal.contact}`}
                      className="flex-grow flex items-center justify-center gap-1.5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-500/10 transition-all active:scale-95 glow-primary font-display"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-zinc-50 dark:bg-zinc-900/10 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 max-w-lg mx-auto w-full">
             <ShoppingBag className="mx-auto mb-6 text-zinc-300 dark:text-zinc-700" size={80} />
             <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-tight font-display">No Deals Found</h3>
             <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-xs font-medium max-w-sm mx-auto px-4">No items matched your current search filters. Try widening your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;
