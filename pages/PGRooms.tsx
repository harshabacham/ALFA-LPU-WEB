import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bed, MapPin, Search, Star, Users, 
  Heart, RefreshCw, Filter, ArrowRight, ShieldCheck, Bookmark,
  SlidersHorizontal, Check, Wifi, Info, Phone, Navigation, Sparkles,
  DollarSign, ChevronDown, CheckCircle, Eye, Sliders, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { PGRoom } from '../types';
import { useBookmarks } from '../lib/bookmarks';

const PGRooms: React.FC = () => {
  const [data, setData] = useState<PGRoom[]>([]);
  const [filteredData, setFilteredData] = useState<PGRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [budgetRange, setBudgetRange] = useState('All'); // All, low (<6000), medium (6000-9000), high (>9000)
  const [sortBy, setSortBy] = useState('recommended'); // recommended, price-asc, price-desc, rating-desc
  const [onlyRoommate, setOnlyRoommate] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isPGBookmarked, togglePG } = useBookmarks();

  // Dynamically extract common amenities
  const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);

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
    if (data.length > 0) {
      const allAmenities = data.flatMap(item => 
        String(item.amenities || "").split(',').map(a => a.trim()).filter(Boolean)
      );
      // Get unique and filter to popular ones
      const unique = Array.from(new Set(allAmenities))
        .filter(a => a.length > 2 && a.length < 25)
        .slice(0, 10);
      setAvailableAmenities(unique);
    }
  }, [data]);

  useEffect(() => {
    let result = [...data];

    // Search filter
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.name || "").toLowerCase().includes(s) || 
        (item.address || "").toLowerCase().includes(s) ||
        (item.description || "").toLowerCase().includes(s) ||
        (item.amenities || "").toLowerCase().includes(s)
      );
    }

    // Type filter (Boys, Girls, Co-ed)
    if (selectedType !== 'All') {
      result = result.filter(item => (item.pg_type || "").toLowerCase() === selectedType.toLowerCase());
    }

    // Budget range filter
    if (budgetRange !== 'All') {
      result = result.filter(item => {
        const rentVal = parseInt(String(item.rent).replace(/[^0-9]/g, '')) || 0;
        if (budgetRange === 'low') return rentVal < 6000;
        if (budgetRange === 'medium') return rentVal >= 6000 && rentVal <= 9000;
        if (budgetRange === 'high') return rentVal > 9000;
        return true;
      });
    }

    // Roommate wanted filter
    if (onlyRoommate) {
      result = result.filter(item => String(item.is_looking_for_roommate).toLowerCase() === 'true');
    }

    // Availability filter (slots > 0)
    if (onlyAvailable) {
      result = result.filter(item => {
        const cap = parseInt(item.total_capacity || '0') || 0;
        const occ = parseInt(item.current_occupancy || '0') || 0;
        return (cap - occ) > 0;
      });
    }

    // Amenities filters
    if (selectedAmenities.length > 0) {
      result = result.filter(item => {
        const itemAmens = String(item.amenities || "").toLowerCase();
        return selectedAmenities.every(amen => itemAmens.includes(amen.toLowerCase()));
      });
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => {
        const rentA = parseInt(String(a.rent).replace(/[^0-9]/g, '')) || 0;
        const rentB = parseInt(String(b.rent).replace(/[^0-9]/g, '')) || 0;
        return rentA - rentB;
      });
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => {
        const rentA = parseInt(String(a.rent).replace(/[^0-9]/g, '')) || 0;
        const rentB = parseInt(String(b.rent).replace(/[^0-9]/g, '')) || 0;
        return rentB - rentA;
      });
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return ratingB - ratingA;
      });
    }

    setFilteredData(result);
  }, [searchTerm, selectedType, budgetRange, sortBy, onlyRoommate, onlyAvailable, selectedAmenities, data]);

  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
    return clean;
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setBudgetRange('All');
    setSortBy('recommended');
    setOnlyRoommate(false);
    setOnlyAvailable(false);
    setSelectedAmenities([]);
  };

  const getPGTypeColor = (type: string) => {
    const t = String(type).toLowerCase();
    if (t.includes('girl')) return 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20';
    if (t.includes('boy')) return 'bg-sky-500/10 text-sky-500 dark:text-sky-400 border-sky-500/20';
    return 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20';
  };

  // Stats calculation
  const totalVerified = data.length;
  const roommateWantedCount = data.filter(i => String(i.is_looking_for_roommate).toLowerCase() === 'true').length;
  const spotsAvailable = data.reduce((acc, curr) => {
    const cap = parseInt(curr.total_capacity) || 0;
    const occ = parseInt(curr.current_occupancy) || 0;
    return acc + Math.max(0, cap - occ);
  }, 0);

  const activeFiltersCount = 
    (selectedType !== 'All' ? 1 : 0) + 
    (budgetRange !== 'All' ? 1 : 0) + 
    (onlyRoommate ? 1 : 0) + 
    (onlyAvailable ? 1 : 0) + 
    selectedAmenities.length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 text-left relative overflow-hidden">
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      {/* Modern Premium Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-zinc-200/50 dark:border-zinc-800/50 relative z-10">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20">
            <Sparkles size={11} className="animate-pulse" />
            <span>Premium Student Housing Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none font-display">
            Find Your Ideal <span className="bg-gradient-to-r from-primary-500 via-amber-500 to-primary-600 bg-clip-text text-transparent">Study Nest</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
            Verified, budget-friendly premium PG spaces and student accommodations near LPU Phagwara. Connect directly with landlords or find roommate matches.
          </p>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
          <div className="p-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-xs flex flex-col justify-center">
            <span className="text-2xl font-black text-gray-900 dark:text-white">{totalVerified}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">Verified PGs</span>
          </div>
          <div className="p-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-xs flex flex-col justify-center">
            <span className="text-2xl font-black text-primary-500">{spotsAvailable}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">Vacant Slots</span>
          </div>
          <div className="p-4 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-xs flex flex-col justify-center">
            <span className="text-2xl font-black text-emerald-500">{roommateWantedCount}</span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mt-0.5">Roommates</span>
          </div>
        </div>
      </div>

      {/* High-End Search and Filter Bar */}
      <div className="space-y-4 relative z-10">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Custom Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by PG name, street address, area or facilities..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-500 transition-all text-sm font-semibold shadow-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xs ${
                showFilters || activeFiltersCount > 0
                ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20' 
                : 'bg-white dark:bg-zinc-900/60 dark:border-zinc-800/80 border-zinc-200/60 text-gray-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-white text-primary-600 font-black text-[10px] flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Quick Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-5 pr-10 py-3.5 bg-white dark:bg-zinc-900/60 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-800/80 text-xs font-black uppercase tracking-wider text-gray-700 dark:text-zinc-300 outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer shadow-xs"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="rating-desc">Rating: High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
          </div>
        </div>

        {/* Micro Category Filter Chips (Boys, Girls, Co-ed) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {['All', 'Boys', 'Girls', 'Co-ed'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  selectedType === type 
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm' 
                  : 'bg-white/60 dark:bg-zinc-900/40 text-gray-500 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-800/50 hover:border-gray-400 dark:hover:border-zinc-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-black uppercase tracking-widest text-primary-500 hover:text-primary-600 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={12} className="animate-spin-once" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>

        {/* Collapsible Expandable Advanced Filters Drawer with Animation */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-white/95 dark:bg-zinc-900/60 backdrop-blur-md rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                
                {/* Rent Range Selector */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Monthly Rent (Budget)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Any Budget', value: 'All' },
                      { label: 'Under ₹6k', value: 'low' },
                      { label: '₹6k - ₹9k', value: 'medium' },
                      { label: 'Above ₹9k', value: 'high' }
                    ].map(btn => (
                      <button
                        key={btn.value}
                        onClick={() => setBudgetRange(btn.value)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                          budgetRange === btn.value
                          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/30 font-black'
                          : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-850 text-gray-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Amenities Checklist */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Amenities & Facilities</h4>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {availableAmenities.map(amenity => (
                      <label 
                        key={amenity}
                        className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-300 cursor-pointer hover:text-primary-500 transition-colors select-none"
                      >
                        <input 
                          type="checkbox"
                          className="rounded border-zinc-300 dark:border-zinc-700 text-primary-500 focus:ring-primary-500/35 h-3.5 w-3.5 cursor-pointer"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                        />
                        <span className="truncate">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Student Intent & Availability toggles */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Availability & Socials</h4>
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setOnlyRoommate(!onlyRoommate)}
                        className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          onlyRoommate
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-850 text-gray-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Heart size={14} className={onlyRoommate ? "fill-emerald-500 text-emerald-500 animate-pulse" : ""} />
                          <span>Looking for Roommates</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-black ${
                          onlyRoommate ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
                        }`}>
                          {onlyRoommate && "✓"}
                        </div>
                      </button>

                      <button
                        onClick={() => setOnlyAvailable(!onlyAvailable)}
                        className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          onlyAvailable
                          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/30'
                          : 'bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-850 text-gray-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Bed size={14} />
                          <span>Show Only Vacant PGs</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] font-black ${
                          onlyAvailable ? 'bg-primary-500 border-primary-500 text-white' : 'border-zinc-300 dark:border-zinc-700'
                        }`}>
                          {onlyAvailable && "✓"}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid List View of Premium Styled PG Cards */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col space-y-4 animate-pulse text-left min-w-0">
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                  <Bed className="text-zinc-300 dark:text-zinc-700/50 animate-bounce" size={40} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="h-5 w-2/3 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
                    <div className="h-4 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  </div>
                  <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
                  <div className="h-4 w-1/3 bg-zinc-300 dark:bg-zinc-700 rounded-lg pt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/80 p-8 max-w-lg mx-auto"
          >
            <Info className="mx-auto text-zinc-400 dark:text-zinc-600 mb-4" size={48} />
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No Matching Accommodations</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              We couldn't find any PG rooms matching your active filters. Try resetting search fields or easing filters.
            </p>
            <button 
              onClick={clearAllFilters}
              className="px-6 py-3 bg-primary-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/45 cursor-pointer transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10"
          >
            {filteredData.map((pg, idx) => {
              const images = String(pg.image_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);
              const firstImg = getDirectImageUrl(images[0]);
              
              const totalCap = parseInt(pg.total_capacity || '0') || 0;
              const currentOcc = parseInt(pg.current_occupancy || '0') || 0;
              const available = Math.max(0, totalCap - currentOcc);
              
              const isLFR = String(pg.is_looking_for_roommate).toLowerCase() === 'true';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
                  key={pg.name}
                  onClick={() => navigate(`/pg-rooms/${data.indexOf(pg)}`)}
                  className="group cursor-pointer flex flex-col space-y-3 min-w-0 text-left"
                >
                  {/* Premium Clean Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/60 shadow-xs">
                    <img 
                      src={firstImg} 
                      alt={pg.name} 
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" 
                      onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800')}
                      referrerPolicy="no-referrer"
                    />

                    {/* Subtle Overlay Badges for Critical Status Only */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {available === 0 && (
                        <span className="px-2 py-1 bg-zinc-900/95 text-zinc-300 text-[9px] font-black uppercase tracking-widest rounded-lg border border-zinc-700/40 backdrop-blur-xs">
                          Fully Booked
                        </span>
                      )}
                      {available > 0 && available <= 2 && (
                        <span className="px-2 py-1 bg-red-600/95 text-white text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-500/40 backdrop-blur-xs">
                          {available} left
                        </span>
                      )}
                    </div>

                    {/* Bookmark Toggle Overlay Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePG(pg, data.indexOf(pg));
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-zinc-950/80 hover:bg-white text-gray-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 rounded-full transition-all duration-300 shadow-xs flex items-center justify-center z-10 hover:scale-105 active:scale-95"
                      style={{ minWidth: '40px', minHeight: '40px' }}
                      title={isPGBookmarked(pg.name) ? "Remove Bookmark" : "Bookmark PG"}
                    >
                      <Bookmark size={14} className={isPGBookmarked(pg.name) ? "fill-red-500 text-red-500" : ""} />
                    </button>
                  </div>

                  {/* Clean, Simple Info Area */}
                  <div className="space-y-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate flex-grow min-w-0 group-hover:text-primary-500 transition-colors" title={pg.name}>
                        {pg.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 shrink-0 text-xs font-semibold text-gray-800 dark:text-zinc-200">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span>{parseFloat(pg.rating || "0.0").toFixed(1)}</span>
                      </div>
                    </div>

                    {/* PG Type & Sub-location */}
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                      <span className="text-primary-500 font-bold">{pg.pg_type || 'Student'}</span>
                      <span className="text-zinc-300 dark:text-zinc-700">•</span>
                      <span className="truncate">{pg.address?.split(',')[0] || pg.address || 'LPU Region'}</span>
                    </p>

                    {/* Price rent */}
                    <div className="pt-0.5">
                      <span className="text-sm font-black text-gray-900 dark:text-gray-100">₹{pg.rent}</span>
                      <span className="text-gray-400 dark:text-zinc-500 text-[10px] ml-1">/ month</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Trust & Verification Banner */}
      <div className="p-8 bg-gradient-to-r from-primary-500/5 via-amber-500/5 to-primary-600/5 dark:from-primary-500/10 dark:via-zinc-900/30 dark:to-amber-500/5 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/80 shadow-xs text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-primary-500/5 rounded-full blur-2xl" />
        
        <div className="space-y-3 max-w-2xl">
          <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
            <ShieldCheck className="text-emerald-500" size={22} />
            <span>Official University Accommodation Policy</span>
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            All PG spaces mapped above are managed by independent, local verified landlords. Residents must follow university discipline and bring student badges for clearance inspections.
          </p>
        </div>

        <div className="shrink-0">
          <a 
            href="tel:+911824440100" 
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gray-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-md transition-all duration-300"
          >
            <Phone size={13} />
            <span>Contact Helpline</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default PGRooms;
