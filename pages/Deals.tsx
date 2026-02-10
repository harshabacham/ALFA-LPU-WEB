
import React, { useState, useEffect } from 'react';
import { Tag, Search, Filter, MapPin, ShoppingBag, Star, Mail, Phone, ChevronRight } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alfa Deals</h1>
          <p className="text-gray-500">Exclusive community marketplace for students</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select 
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none text-sm"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((deal) => (
            <div key={deal.id} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="relative h-40 md:h-56 overflow-hidden bg-gray-100 dark:bg-gray-900">
                <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg text-[10px] font-bold text-primary-600 shadow-sm uppercase tracking-widest">
                    {deal.condition}
                  </span>
                </div>
              </div>
              
              <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-base md:text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{deal.title}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                      <Star size={12} className="fill-yellow-500" />
                      <span>{deal.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-4">
                    {deal.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xl md:text-2xl font-black text-primary-600">₹{deal.price}</span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                         <MapPin size={10} /> {deal.location}
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Seller</p>
                       <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">{deal.seller_name}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a 
                      href={`mailto:${deal.contact}`}
                      className="flex-grow flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                    >
                      Buy Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
             <ShoppingBag className="mx-auto mb-4 text-gray-300" size={48} />
             <p className="font-medium">No items found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;
