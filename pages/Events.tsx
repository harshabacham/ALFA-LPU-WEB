
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, Search, 
  Sparkles, Tag, Bookmark
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Event } from '../types';
import { CometCard } from '../components/ui/comet-card';
import { useBookmarks } from '../lib/bookmarks';

const Events: React.FC = () => {
  const [data, setData] = useState<Event[]>([]);
  const [filteredData, setFilteredData] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isEventBookmarked, toggleEvent } = useBookmarks();

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Event>(CSV_URLS.EVENTS);
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
        (item.organizer || "").toLowerCase().includes(search)
      );
    }
    setFilteredData(result);
  }, [searchTerm, data]);

  const handleEventClick = (event: Event) => {
    const index = data.findIndex(e => e.title === event.title);
    navigate(`/events/${index}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={14} /> Spotlight
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">
            Events Hub
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-xl">
            Stay synced with the pulse of the community. From tech summits to cultural fests.
          </p>
        </div>
        
        <div className="relative group w-full md:w-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="pl-14 pr-8 py-5 w-full md:w-96 rounded-[2rem] border-none bg-white/70 dark:bg-gray-900/70 backdrop-blur-md focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 pb-32">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="flex justify-center h-full w-full max-w-[340px] mx-auto">
              <div className="w-full bg-sand-50 dark:bg-zinc-900 p-5 rounded-[24px] border border-zinc-100/50 dark:border-zinc-800/50 space-y-6 animate-pulse text-left">
                {/* Poster Image Skeleton */}
                <div className="relative aspect-[3/4] w-full bg-zinc-200 dark:bg-zinc-800 rounded-[20px] flex items-center justify-center">
                  <div className="absolute top-4 left-4 w-16 h-6 bg-zinc-300 dark:bg-zinc-700 rounded-xl" />
                  <div className="absolute top-4 right-4 w-10 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                  <Calendar className="text-zinc-300 dark:text-zinc-700/50" size={40} />
                </div>
                
                {/* Details Skeleton */}
                <div className="space-y-4 px-1">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-20 bg-zinc-300 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-6 w-11/12 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
                    <div className="h-6 w-3/4 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredData.length > 0 ? (
          filteredData.map((event, idx) => (
            <div key={idx} className="flex justify-center h-full">
              <CometCard className="w-full max-w-[340px]">
                <div
                  onClick={() => handleEventClick(event)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleEventClick(event);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group flex h-full w-full cursor-pointer flex-col items-stretch rounded-[24px] bg-sand-50 dark:bg-zinc-900 p-3 md:p-5 text-left transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                  aria-label={`View event ${event.title}`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Poster Image Container */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[20px] bg-gray-100 dark:bg-gray-800">
                    <img
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      alt={event.title}
                      src={event.image_url}
                      onError={(e) => (e.currentTarget.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800")}
                    />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4">
                      <div className="px-4 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest shadow-sm">
                        {event.price === '0' || (event.price && event.price.toLowerCase() === 'free') ? 'Free' : `₹${event.price}`}
                      </div>
                    </div>

                    {/* Bookmark Overlay Button */}
                    <div className="absolute top-4 right-4 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const originalIndex = data.findIndex(ev => ev.title === event.title);
                          toggleEvent(event, originalIndex >= 0 ? originalIndex : idx);
                        }}
                        className="p-2.5 bg-white/95 dark:bg-black/80 hover:bg-white dark:hover:bg-zinc-950 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-full transition-all shadow-md flex items-center justify-center border border-gray-100/10"
                        title={isEventBookmarked(event.title) ? "Remove Bookmark" : "Bookmark Event"}
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <Bookmark size={15} className={isEventBookmarked(event.title) ? "fill-primary-500 text-primary-500" : ""} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="mt-6 space-y-3 px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} /> Upcoming
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        #{idx.toString(16).toUpperCase().padStart(4, '0')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors uppercase tracking-tight leading-tight line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="text-primary-500" /> 
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 truncate">
                        <MapPin size={14} className="text-primary-500" /> 
                        {event.venue}
                      </div>
                    </div>
                  </div>
                </div>
              </CometCard>
            </div>
          ))
        ) : (
          <div className="col-span-full py-48 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
             <Calendar className="mx-auto text-gray-200 dark:text-gray-800 mb-8" size={120} />
             <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Quiet on the Radar</h3>
             <p className="text-gray-500 mt-2 font-medium max-w-sm mx-auto">No events found matching your current search. Try adjusting your keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
