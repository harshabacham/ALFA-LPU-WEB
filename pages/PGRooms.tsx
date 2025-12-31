
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bed, MapPin, Search, Star, Users, 
  Heart, RefreshCw, Filter, ArrowRight, ShieldCheck
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { PGRoom } from '../types';

const PGRooms: React.FC = () => {
  const [data, setData] = useState<PGRoom[]>([]);
  const [filteredData, setFilteredData] = useState<PGRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchCSV<PGRoom>(CSV_URLS.PG_ROOMS);
      setData(result);
      setFilteredData(result);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.name || "").toLowerCase().includes(s) || 
        (item.address || "").toLowerCase().includes(s)
      );
    }
    if (selectedType !== 'All') {
      result = result.filter(item => item.pg_type === selectedType);
    }
    setFilteredData(result);
  }, [searchTerm, selectedType, data]);

  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
    return clean;
  };

  const pgTypes = ['All', ...Array.from(new Set(data.map(i => i.pg_type).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 bg-white dark:bg-gray-950 min-h-screen">
      {/* Simple Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">PG Rooms</h1>
        <p className="text-gray-500 max-w-lg">Simple, verified student accommodations in Phagwara. No hidden fees, just clean living.</p>
      </div>

      {/* Clean Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by area or name..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-xl border-none outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {pgTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type 
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' 
                : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Minimalist Grid */}
      {loading ? (
        <div className="py-20 text-center animate-pulse text-gray-400 font-medium">Loading spaces...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {filteredData.map((pg, idx) => {
            const images = String(pg.image_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);
            const firstImg = getDirectImageUrl(images[0]);
            const available = Math.max(0, parseInt(pg.total_capacity || '0') - parseInt(pg.current_occupancy || '0'));

            return (
              <div 
                key={idx} 
                onClick={() => navigate(`/pg-rooms/${data.indexOf(pg)}`)}
                className="group cursor-pointer flex flex-col space-y-4"
              >
                {/* Clean Image Container */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-900">
                  <img 
                    src={firstImg} 
                    alt={pg.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800')}
                  />
                  {available <= 2 && available > 0 && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-md">
                      Only {available} Left
                    </div>
                  )}
                </div>

                {/* Flat Info Area */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{pg.name}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold">
                      <Star size={14} className="fill-gray-900 dark:fill-white" />
                      {pg.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{pg.address}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100 pt-1">₹{pg.rent} <span className="text-gray-400 font-normal">/ month</span></p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PGRooms;
