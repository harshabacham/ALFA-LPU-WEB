
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Search, Filter, X, Calendar, ExternalLink, Play, Image as ImageIcon, ArrowUpDown, RefreshCw, Circle, Share2 } from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const [data, setData] = useState<Notification[]>([]);
  const [filteredData, setFilteredData] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await fetchCSV<Notification>(CSV_URLS.NOTIFICATIONS);
      setData(result);
      
      // Update the last notified ID in local storage for feed consistency
      if (result.length > 0) {
        const latestInFeed = [...result].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeB - timeA;
        })[0];
        localStorage.setItem('alfa_last_notified_id', latestInFeed.id);
      }
    } catch (error) {
      console.error("Polling error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Background Polling (Every 60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadData(true);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [loadData]);

  useEffect(() => {
    let result = [...data];
    
    // Filtering
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Sorting by timestamp
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      
      if (isNaN(timeA) || isNaN(timeB)) {
        return sortOrder === 'desc' 
          ? (String(b.timestamp || "")).localeCompare(String(a.timestamp || ""))
          : (String(a.timestamp || "")).localeCompare(String(b.timestamp || ""));
      }

      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    setFilteredData(result);
  }, [searchTerm, selectedCategory, sortOrder, data]);

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];

  const isVideo = (url: string) => {
    return url && url.match(/\.(mp4|webm|ogg)$|drive\.google\.com.*video/i);
  };

  const handleShare = async (notif: Notification) => {
    if (navigator.share) {
      try {
        const shareUrl = window.location.origin + window.location.pathname + window.location.hash;
        await navigator.share({
          title: notif.title,
          text: notif.description,
          url: shareUrl
        });
      } catch (err) {
        console.error("Error sharing notification:", err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-600 rounded-2xl text-white shadow-lg relative">
             <Bell size={32} />
             {isRefreshing && (
               <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center border-2 border-primary-600">
                 <RefreshCw size={10} className="text-primary-600 animate-spin" />
               </div>
             )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full border border-green-500/20">
                <Circle size={8} className="fill-current animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
              </div>
            </div>
            <p className="text-gray-500">Auto-updates from the community feed every minute</p>
          </div>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search news..." 
            className="pl-12 pr-4 py-3.5 w-full rounded-[1.5rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative min-w-[140px]">
            <select 
              className="w-full px-5 py-3.5 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none shadow-sm font-bold text-sm appearance-none pr-10"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <Filter size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative min-w-[160px]">
            <select 
              className="w-full px-5 py-3.5 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none shadow-sm font-bold text-sm appearance-none pr-10"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
            <ArrowUpDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="grid gap-4">
        {loading && data.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Fetching updates...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((notif, index) => (
            <div 
              key={`${notif.id}-${index}`} 
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-[2rem] p-5 md:p-6 flex gap-4 md:gap-8 items-center cursor-pointer hover:shadow-2xl hover:border-primary-200 dark:hover:border-primary-900/50 transition-all active:scale-[0.99]"
              onClick={() => setSelectedNotif(notif)}
            >
              {/* Icon/Media Preview */}
              <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-primary-50 dark:bg-primary-900/20 items-center justify-center text-primary-600 shrink-0 relative overflow-hidden group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 transition-colors">
                {notif.media_url ? (
                  <>
                    <img src={notif.media_url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-all">
                       {isVideo(notif.media_url) ? <Play size={24} className="text-white drop-shadow-md" /> : <ImageIcon size={24} className="text-white drop-shadow-md" />}
                    </div>
                  </>
                ) : (
                  <Bell size={32} />
                )}
              </div>

              <div className="flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-700 dark:text-primary-400">
                    {notif.category}
                  </span>
                  <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                    <Calendar size={12} /> {notif.timestamp}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors mb-1">{notif.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed">{notif.description}</p>
              </div>

              <div className="shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all">
                <ExternalLink size={24} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
            <Bell className="mx-auto text-gray-300 mb-6" size={72} />
            <p className="text-gray-500 font-black text-2xl mb-2">Nothing to report</p>
            <p className="text-gray-400 font-medium">No notifications found matching your search.</p>
          </div>
        )}
      </div>

      {/* Full Details Modal */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                      {selectedNotif.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-bold">{selectedNotif.timestamp}</span>
                 </div>
                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                    {selectedNotif.title}
                 </h2>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
              {selectedNotif.media_url && selectedNotif.media_url.trim() !== "" && (
                <div className="rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 bg-black shadow-2xl">
                  {isVideo(selectedNotif.media_url) ? (
                    <video controls className="w-full aspect-video object-contain" autoPlay>
                      <source src={selectedNotif.media_url} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      src={selectedNotif.media_url} 
                      alt="Notification content" 
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  )}
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xl font-medium whitespace-pre-wrap">
                  {selectedNotif.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 pt-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => handleShare(selectedNotif)}
                className="flex-grow py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 size={18} /> Share Update
              </button>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="flex-grow py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-500/30 active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
          {/* Backdrop Closer */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedNotif(null)}></div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
