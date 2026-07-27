
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Search, 
  Sparkles, Bookmark, Grid, List, ChevronRight, Share2, X, AlertCircle, Info, ExternalLink, Ticket, CheckCircle2, SlidersHorizontal, RefreshCw, Star
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Event } from '../types';
import { CometCard } from '../components/ui/comet-card';
import { CardSkeleton, HeroSkeleton } from '../components/ui/skeleton';
import { useBookmarks } from '../lib/bookmarks';
import { motion, AnimatePresence } from 'framer-motion';
import { FALLBACK_EVENTS } from '../services/fallbackData';

type SortOption = 'default' | 'title-asc' | 'date-soonest' | 'price-low';
type CategoryOption = 'all' | 'free' | 'premium' | 'tech' | 'cultural' | 'workshop';

const Events: React.FC = () => {
  const [data, setData] = useState<Event[]>([]);
  const [filteredData, setFilteredData] = useState<Event[]>([]);
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [location.search]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [selectedQuickViewEvent, setSelectedQuickViewEvent] = useState<{ event: Event; index: number } | null>(null);
  const [claimedTickets, setClaimedTickets] = useState<Record<string, { name: string; date: string; id: string }>>({});
  const [ticketName, setTicketName] = useState('Harsha Bacham');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isEventBookmarked, toggleEvent } = useBookmarks();

  useEffect(() => {
    const load = async () => {
      try {
        let result = await fetchCSV<Event>(CSV_URLS.EVENTS);
        if (!result || result.length === 0) {
          result = FALLBACK_EVENTS;
        }
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error loading events CSV:", error);
        setData(FALLBACK_EVENTS);
        setFilteredData(FALLBACK_EVENTS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Helper function to categorize events semantically
  const getEventCategory = (event: Event): 'tech' | 'cultural' | 'workshop' | 'other' => {
    const title = (event.title || '').toLowerCase();
    const desc = (event.description || '').toLowerCase();
    
    if (
      title.includes('hackathon') || title.includes('coding') || title.includes('dev') ||
      title.includes('tech') || title.includes('ai') || title.includes('cloud') ||
      title.includes('code') || title.includes('robotics') || title.includes('cyber') ||
      title.includes('programming') || desc.includes('hackathon') || desc.includes('coding') || 
      desc.includes('developer')
    ) {
      return 'tech';
    }
    
    if (
      title.includes('music') || title.includes('fest') || title.includes('dj') ||
      title.includes('dance') || title.includes('cultural') || title.includes('drama') ||
      title.includes('arts') || title.includes('fashion') || title.includes('concert') ||
      title.includes('band') || title.includes('comedy') || title.includes('live') ||
      title.includes('singing') || desc.includes('music') || desc.includes('fest') || 
      desc.includes('performance')
    ) {
      return 'cultural';
    }

    if (
      title.includes('workshop') || title.includes('webinar') || title.includes('seminar') ||
      title.includes('talk') || title.includes('bootcamp') || title.includes('training') ||
      title.includes('session') || title.includes('lecture') || title.includes('expert') ||
      title.includes('panel') || desc.includes('workshop') || desc.includes('webinar') || 
      desc.includes('seminar')
    ) {
      return 'workshop';
    }

    return 'other';
  };

  // Filter & Sort Logic
  useEffect(() => {
    let result = [...data];

    // 1. Search Filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search) ||
        (item.organizer || "").toLowerCase().includes(search) ||
        (item.venue || "").toLowerCase().includes(search)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => {
        const isFree = item.price === '0' || (item.price && item.price.toLowerCase() === 'free');
        if (selectedCategory === 'free') return isFree;
        if (selectedCategory === 'premium') return !isFree;
        
        const semanticCat = getEventCategory(item);
        return semanticCat === selectedCategory;
      });
    }

    // 3. Sorting Filter
    if (sortBy === 'title-asc') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => {
        const getPriceVal = (p: string) => {
          if (!p || p.toLowerCase() === 'free') return 0;
          const num = parseInt(p.replace(/[^0-9]/g, ''), 10);
          return isNaN(num) ? 0 : num;
        };
        return getPriceVal(a.price) - getPriceVal(b.price);
      });
    } else if (sortBy === 'date-soonest') {
      // Basic sorting soonest first: we look at numeric values or text
      result.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }

    setFilteredData(result);
  }, [searchTerm, selectedCategory, sortBy, data]);

  const handleEventClick = (event: Event) => {
    const index = data.findIndex(e => e.title === event.title);
    navigate(`/events/${index}`);
  };

  // Parse dates to a cool visual calendar flip card format
  const parseDate = (dateStr: string) => {
    try {
      const cleanStr = (dateStr || '').trim();
      const match = cleanStr.match(/(\d+)\s+([A-Za-z]+)/) || cleanStr.match(/([A-Za-z]+)\s+(\d+)/);
      if (match) {
        const g1IsDigits = /^\d+$/.test(match[1]);
        const day = g1IsDigits ? match[1] : match[2];
        const month = g1IsDigits ? match[2].substring(0, 3).toUpperCase() : match[1].substring(0, 3).toUpperCase();
        return { day, month };
      }
      
      const parts = cleanStr.split(/[-/]/);
      if (parts.length >= 2) {
        const day = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const month = months[monthNum - 1] || 'EVT';
        return { day, month };
      }
      
      const words = cleanStr.split(/\s+/);
      const day = words.find(w => /^\d+$/.test(w)) || '18';
      const month = (words.find(w => /^[A-Za-z]+$/.test(w)) || 'OCT').substring(0, 3).toUpperCase();
      return { day, month };
    } catch (e) {
      return { day: '18', month: 'OCT' };
    }
  };

  // Copy details share
  const handleShareEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Check out this event: ${event.title} on ${event.date} at ${event.venue}!`;
    navigator.clipboard.writeText(shareText);
    setCopyStatus(event.title);
    setTimeout(() => setCopyStatus(null), 2500);
  };

  // Simulated ticket generation
  const handleClaimTicket = (event: Event) => {
    if (claimedTickets[event.title]) return;
    
    const randomId = 'ALFA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    setClaimedTickets(prev => ({
      ...prev,
      [event.title]: {
        name: ticketName || 'Anonymous Scholar',
        date: formattedDate,
        id: randomId
      }
    }));
  };

  // Extract spotlight event
  const spotlightEvent = data.length > 0 ? data[0] : null;
  const regularEvents = data.length > 1 ? data.slice(1) : data;

  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-1000 text-left">
      {/* Dynamic Animated Glow Mesh Gradients */}
      <div className="absolute top-0 left-1/4 w-[450px] h-[450px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-[380px] h-[380px] bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '12s', animationDelay: '3s' }}></div>

      {/* Hero Header Section */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4 border-b border-zinc-200/40 dark:border-zinc-800/50">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-500/10">
            <Sparkles size={12} className="animate-spin-slow" /> Premium Campus Hub
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-none">
            <span className="text-primary-500">Events</span> Hub
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base max-w-xl">
            Experience community reimagined. Instantly scan, filter, bookmark, and generate VIP virtual passes for the biggest events across campus.
          </p>
        </div>

        {/* Live Pulse Analytics Widget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row gap-4 w-full lg:w-auto lg:self-end">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-4 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 w-full">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Global Status</div>
              <div className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase">{loading ? 'Syncing...' : `${data.length} LIVE NOW`}</div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-5 py-4 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex items-center gap-4 w-full">
            <Star size={18} className="text-amber-500 fill-amber-500 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Entry Fee</div>
              <div className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase">
                {loading ? '...' : `${data.filter(e => e.price === '0' || e.price.toLowerCase() === 'free').length} FREE EVENTS`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight Spotlight Billboard Hero Banner */}
      {!loading && spotlightEvent && selectedCategory === 'all' && !searchTerm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full rounded-[2rem] bg-primary-50/70 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 overflow-hidden shadow-xl border border-primary-100/80 dark:border-zinc-800/70 p-6 md:p-8 flex flex-col lg:flex-row gap-8 group"
        >
          {/* Banner Poster Column */}
          <div className="relative w-full lg:w-[380px] aspect-[4/3] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-white/50 dark:bg-zinc-950/40 z-10 shrink-0 border border-primary-100/50 dark:border-zinc-800/30">
            <img 
              src={spotlightEvent.image_url || null} 
              alt={spotlightEvent.title}
              onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800")}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
            
            {/* Visual calendar date banner floating on spotlight image */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-2 rounded-xl border border-primary-100/50 dark:border-zinc-800/30 shadow-sm">
              <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-primary-700 dark:text-primary-400">Spotlight Highlight</span>
            </div>
          </div>

          {/* Info Details Column */}
          <div className="flex-1 flex flex-col justify-between gap-6 relative z-10 text-left">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="px-3 py-1 bg-primary-500/10 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary-500/20 dark:border-primary-500/30">
                  Featured Pass
                </span>
                <span className="px-3 py-1 bg-white/80 dark:bg-zinc-950/50 text-zinc-700 dark:text-zinc-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary-100/60 dark:border-zinc-850/60 shadow-xs">
                  {spotlightEvent.price === '0' || spotlightEvent.price.toLowerCase() === 'free' ? 'Complementary Entry' : `₹${spotlightEvent.price}`}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500 text-xs font-mono">STATION-ID: #LPUALFA01</span>
              </div>

              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-tight">
                {spotlightEvent.title}
              </h2>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl font-medium">
                {spotlightEvent.description || "The premier spotlight gathering of this week. Explore advanced frameworks, join high-impact modules, and build peer networks that redefine standards."}
              </p>

              {/* Grid Metadata row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-primary-100/80 dark:border-zinc-800/60 max-w-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/95 dark:bg-zinc-950/60 rounded-xl border border-primary-100/50 dark:border-zinc-800/40">
                    <Calendar size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Schedule Date</div>
                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{spotlightEvent.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/95 dark:bg-zinc-950/60 rounded-xl border border-primary-100/50 dark:border-zinc-800/40">
                    <Clock size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Start Time</div>
                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{spotlightEvent.time || "10:00 AM"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <div className="p-2.5 bg-white/95 dark:bg-zinc-950/60 rounded-xl border border-primary-100/50 dark:border-zinc-800/40">
                    <MapPin size={18} className="text-primary-500" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Location Venue</div>
                    <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-xs">{spotlightEvent.venue}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard interactive controls */}
            <div className="flex flex-wrap gap-4 items-center pt-5 border-t border-primary-100/80 dark:border-zinc-800/60">
              <button 
                onClick={() => handleEventClick(spotlightEvent)}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-primary-500/20"
              >
                Access Details <ChevronRight size={14} />
              </button>

              <button 
                onClick={(e) => {
                  toggleEvent(spotlightEvent, 0);
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  isEventBookmarked(spotlightEvent.title) 
                    ? 'bg-primary-500/10 border-primary-500/30 text-primary-600 dark:text-primary-400' 
                    : 'bg-white dark:bg-zinc-950/60 border-primary-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
                }`}
                title="Bookmark Spotlight"
              >
                <Bookmark size={15} className={isEventBookmarked(spotlightEvent.title) ? "fill-primary-500" : ""} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Action and Control Dock (Grid, Lists, Category Pills) */}
      <div className="relative z-10 space-y-6">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl md:rounded-[2.5rem] p-4 sm:p-5 border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
          
          {/* Animated Slide-pill Category Selector */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2 lg:pb-0 scroll-smooth w-full lg:w-auto">
            {(['all', 'free', 'premium', 'tech', 'cultural', 'workshop'] as const).map((cat) => {
              const labelMap: Record<CategoryOption, string> = {
                all: 'All events',
                free: 'Free access',
                premium: 'Premium pass',
                tech: 'Tech & Hackathons',
                cultural: 'Cultural & Fests',
                workshop: 'Workshops & Webinars'
              };
              
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                    isActive 
                      ? 'text-white dark:text-zinc-950 z-10' 
                      : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      className="absolute inset-0 bg-zinc-950 dark:bg-white rounded-xl -z-10 shadow-md"
                    />
                  )}
                  {labelMap[cat]}
                </button>
              );
            })}
          </div>

          {/* Action Dock Right - Search, Sort, View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            
            {/* Elegant Search Container */}
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder="Filter events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-8 py-3 w-full sm:w-60 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60 focus:ring-4 focus:ring-primary-500/10 outline-none text-xs font-bold transition-all text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full text-zinc-400"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Custom Sort dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-3 w-full bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60 outline-none text-xs font-bold text-zinc-700 dark:text-zinc-300 focus:ring-4 focus:ring-primary-500/10 cursor-pointer"
              >
                <option value="default">Default Sync</option>
                <option value="title-asc">Alphabetical A-Z</option>
                <option value="date-soonest">Schedule Date</option>
                <option value="price-low">Price: Low to High</option>
              </select>
              <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
            </div>

            {/* Modern list vs grid view selector */}
            <div className="flex justify-center bg-zinc-50 dark:bg-zinc-950 p-1 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/60">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-zinc-900 text-primary-500 dark:text-primary-400 shadow-xs' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
                title="Grid Layout"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-zinc-900 text-primary-500 dark:text-primary-400 shadow-xs' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                }`}
                title="Row Layout"
              >
                <List size={15} />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Main Events Grid or Row Presentation */}
      <div className="relative z-10 pb-32">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <CardSkeleton key={idx} imageHeight="h-56" />
              ))}
            </div>
          ) : filteredData.length > 0 ? (
            viewMode === 'grid' ? (
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
              >
                {filteredData.map((event, idx) => {
                  const isSpotlight = event.title === (spotlightEvent?.title || '');
                  const dateInfo = parseDate(event.date);
                  const isBookmarked = isEventBookmarked(event.title);
                  
                  return (
                    <motion.div
                      layout
                      key={event.title || idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="group"
                    >
                      <div 
                        className="relative rounded-[2.5rem] bg-white dark:bg-zinc-900/60 backdrop-blur-xs border border-zinc-200/60 dark:border-zinc-800/50 p-4 shadow-sm hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 flex flex-col h-full overflow-hidden text-left cursor-pointer group hover:translate-y-[-4px]"
                        onClick={() => handleEventClick(event)}
                      >
                        {/* Shimmer Border Light effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/0 via-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Image banner section with category floating */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-800 shrink-0">
                          <img
                            loading="lazy"
                            src={event.image_url || null}
                            alt={event.title}
                            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800")}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          
                          {/* Float Badge Category */}
                          <div className="absolute bottom-4 left-4 z-20">
                            <span className="px-3.5 py-1.5 bg-zinc-950/75 backdrop-blur-md border border-white/15 rounded-xl text-[9px] font-black text-zinc-100 uppercase tracking-widest">
                              {getEventCategory(event)}
                            </span>
                          </div>
                        </div>

                        {/* Event Details info wrapper */}
                        <div className="flex-1 flex flex-col justify-between pt-5 pb-2 px-1 min-w-0">
                          <div className="space-y-3">
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                                <span className="text-zinc-300 dark:text-zinc-700 font-normal">•</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {event.time || "10:00 AM"}</span>
                                <span className="text-zinc-300 dark:text-zinc-700 font-normal">•</span>
                                <span className="text-zinc-600 dark:text-zinc-400">{event.price === '0' || event.price.toLowerCase() === 'free' ? 'FREE' : `₹${event.price}`}</span>
                              </span>
                              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest shrink-0">
                                {isSpotlight ? 'SPOTLIGHT PASS' : `#PASS-${idx.toString(16).toUpperCase().padStart(3, '0')}`}
                              </span>
                            </div>

                            <h3 className="text-lg font-black text-zinc-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight leading-tight line-clamp-2">
                              {event.title}
                            </h3>

                            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2 font-medium">
                              {event.description || "No customized descriptor provided. Claim tickets to access interactive sessions, hack-modules, and community network resources."}
                            </p>
                          </div>

                          {/* Card Footer actions */}
                          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between gap-4 min-w-0">
                            <div className="flex items-center gap-2 min-w-0 text-xs font-bold text-zinc-500 dark:text-zinc-400 flex-1">
                              <MapPin size={13} className="text-primary-500 shrink-0" />
                              <span className="truncate">{event.venue}</span>
                            </div>

                            {/* Hover interactive mini-drawer buttons */}
                            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {event.link ? (
                                <a
                                  href={event.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl transition-all inline-flex items-center justify-center"
                                  title="Register on Portal"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              ) : (
                                <button
                                  onClick={() => handleEventClick(event)}
                                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl transition-all"
                                  title="Explore Event"
                                >
                                  <ExternalLink size={14} />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  const originalIdx = data.findIndex(ev => ev.title === event.title);
                                  toggleEvent(event, originalIdx >= 0 ? originalIdx : idx);
                                }}
                                className={`p-2 rounded-xl transition-all border ${
                                  isBookmarked 
                                    ? 'bg-primary-500/10 border-primary-500/20 text-primary-500' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border-transparent text-zinc-500'
                                }`}
                                title="Bookmark Event"
                              >
                                <Bookmark size={14} className={isBookmarked ? "fill-primary-500" : ""} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Rows / List Layout view mode */
              <motion.div 
                layout
                className="space-y-4"
              >
                {filteredData.map((event, idx) => {
                  const dateInfo = parseDate(event.date);
                  const isBookmarked = isEventBookmarked(event.title);
                  return (
                    <motion.div
                      layout
                      key={event.title || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-[2rem] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-all cursor-pointer text-left"
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Image + Date flip block */}
                      <div className="flex items-center gap-4 w-full md:w-auto min-w-0">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                          <img 
                            src={event.image_url || null} 
                            alt={event.title} 
                            onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800")}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Mini flip block */}
                        <div className="hidden sm:flex flex-col items-center justify-center w-11 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl shrink-0">
                          <span className="text-[8px] font-black text-primary-500 uppercase">{dateInfo.month}</span>
                          <span className="text-xs font-black text-zinc-800 dark:text-white">{dateInfo.day}</span>
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase text-primary-500 tracking-wider bg-primary-500/10 px-2 py-0.5 rounded-md">
                            {getEventCategory(event)}
                          </span>
                          <h4 className="text-sm md:text-base font-black text-zinc-800 dark:text-zinc-100 truncate uppercase tracking-tight">
                            {event.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-zinc-400 dark:text-zinc-500">
                            <span className="flex items-center gap-1 sm:hidden"><Calendar size={11} className="text-primary-500" /> {event.date}</span>
                            <span className="flex items-center gap-1"><Clock size={11} /> {event.time || "10:00 AM"}</span>
                            <span className="flex items-center gap-1"><MapPin size={11} /> {event.venue}</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA + Price row right */}
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-zinc-100 dark:border-zinc-800/40 pt-3 md:pt-0" onClick={(e) => e.stopPropagation()}>
                        <div className="text-left md:text-right">
                          <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Entry Fee</div>
                          <div className="text-xs font-black text-zinc-800 dark:text-white">
                            {event.price === '0' || event.price.toLowerCase() === 'free' ? 'FREE ACCESS' : `₹${event.price}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {event.link ? (
                            <a 
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5"
                            >
                              <span>Register</span>
                              <ExternalLink size={10} />
                            </a>
                          ) : (
                            <button 
                              onClick={() => handleEventClick(event)}
                              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                            >
                              Explore
                            </button>
                          )}

                          <button
                            onClick={() => {
                              const originalIdx = data.findIndex(ev => ev.title === event.title);
                              toggleEvent(event, originalIdx >= 0 ? originalIdx : idx);
                            }}
                            className={`p-2.5 rounded-xl border transition-all ${
                              isBookmarked 
                                ? 'bg-primary-500/10 border-primary-500/20 text-primary-500' 
                                : 'bg-zinc-50 dark:bg-zinc-850 border-transparent text-zinc-400'
                            }`}
                          >
                            <Bookmark size={13} className={isBookmarked ? "fill-primary-500" : ""} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          ) : (
            /* Bespoke empty "Radar Scan" state */
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full py-28 text-center bg-white dark:bg-zinc-900/40 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 max-w-2xl mx-auto px-6 space-y-6"
            >
              {/* Pulsing Radar Visual animation */}
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto bg-primary-500/10 rounded-full">
                <span className="absolute w-20 h-20 bg-primary-500/20 rounded-full animate-ping" />
                <span className="absolute w-12 h-12 bg-primary-500/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <Calendar className="text-primary-500 animate-pulse" size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                  Quiet on the Radar
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto font-medium leading-relaxed">
                  We scanned our schedule but couldn't find any events matching "<span className="text-primary-500 font-bold">{searchTerm || selectedCategory}</span>". Try resetting filters to view all entries.
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSortBy('default');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
              >
                <RefreshCw size={12} /> Reset System Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;
