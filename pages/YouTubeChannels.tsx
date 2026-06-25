import React, { useState, useEffect } from 'react';
import { 
  Youtube, Search, Play, Filter, ExternalLink, 
  Sparkles, BookOpen, Layers, MonitorPlay, 
  X, Tv, Clock, Check, Bookmark, Heart, 
  Share2, ArrowUpRight, HelpCircle, AlertCircle
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { YouTubeChannel } from '../types';

const YouTubeChannels: React.FC = () => {
  const [data, setData] = useState<YouTubeChannel[]>([]);
  const [filteredData, setFilteredData] = useState<YouTubeChannel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Interactive Cinema Player State
  const [activeVideo, setActiveVideo] = useState<YouTubeChannel | null>(null);
  
  // Watchlist (locally persisted bookmarks)
  const [watchlist, setWatchlist] = useState<YouTubeChannel[]>(() => {
    try {
      const saved = localStorage.getItem('alfa-youtube-watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Filter lists
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [subjectsList, setSubjectsList] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<YouTubeChannel>(CSV_URLS.YOUTUBE_CHANNELS);
      setData(result);
      setFilteredData(result);
      
      // Compute unique categories and subjects
      const cats = ['All', ...Array.from(new Set(result.map(i => i.category).filter(Boolean)))];
      const subs = ['All', ...Array.from(new Set(result.map(i => i.subject).filter(Boolean)))];
      setCategoriesList(cats);
      setSubjectsList(subs);
      
      setLoading(false);
    };
    load();
  }, []);

  // Sync Watchlist with Local Storage
  useEffect(() => {
    try {
      localStorage.setItem('alfa-youtube-watchlist', JSON.stringify(watchlist));
    } catch (e) {}
  }, [watchlist]);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(search) || 
        (item.subject || "").toLowerCase().includes(search) ||
        (item.category || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (selectedSubject !== 'All') {
      result = result.filter(item => item.subject === selectedSubject);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, selectedSubject, data]);

  const getYoutubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = (url: string) => {
    const id = getYoutubeID(url);
    if (!id) return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800";
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  // Toggle dynamic Watchlist bookmark
  const toggleWatchlist = (video: YouTubeChannel, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering theater trigger on same card click
    const isSaved = watchlist.some(item => item.url === video.url);
    if (isSaved) {
      setWatchlist(watchlist.filter(item => item.url !== video.url));
    } else {
      setWatchlist([...watchlist, video]);
    }
  };

  // Check if a video is bookmarked
  const isInWatchlist = (url: string) => {
    return watchlist.some(item => item.url === url);
  };

  // Generate subject-specific iconography and background themes
  const getSubjectIconMeta = (subject: string) => {
    const clean = String(subject).toLowerCase();
    if (clean.includes('code') || clean.includes('python') || clean.includes('programming') || clean.includes('computer')) {
      return {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        label: '💻 Computer Science'
      };
    }
    if (clean.includes('math') || clean.includes('calculus') || clean.includes('algebra')) {
      return {
        bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
        label: '📐 Mathematics'
      };
    }
    if (clean.includes('chemistry') || clean.includes('chem') || clean.includes('physics') || clean.includes('mechanics')) {
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        label: '🔬 Physical Sciences'
      };
    }
    return {
      bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      label: '📖 Academics'
    };
  };

  // Share utility
  const shareVideo = (video: YouTubeChannel, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: `Check out this syllabus video on ALFA: ${video.subject}`,
        url: video.url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(video.url);
      alert('Video link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-12 animate-in fade-in duration-700 text-left">
      
      {/* 1. Immersive Cinema Player Backdrop overlay if video selected */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh]">
            
            {/* Top Toolbar */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-900 bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">ALFA Interactive Player</span>
                <span className="text-zinc-600">|</span>
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{activeVideo.subject}</span>
              </div>
              <button 
                onClick={() => setActiveVideo(null)}
                className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors"
                aria-label="Close Player"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Player Frame Container */}
            <div className="relative w-full aspect-video flex-grow bg-black">
              {getYoutubeID(activeVideo.url) ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYoutubeID(activeVideo.url)}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 p-8 text-center text-zinc-400">
                  <AlertCircle size={48} className="text-red-500" />
                  <p className="text-sm font-bold">This link does not point to a standard YouTube format.</p>
                  <a 
                    href={activeVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Open Externally
                  </a>
                </div>
              )}
            </div>

            {/* Title & Details Panel inside modal */}
            <div className="p-6 bg-zinc-950 border-t border-zinc-900 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{activeVideo.category}</span>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">{activeVideo.title}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button 
                    onClick={(e) => toggleWatchlist(activeVideo, e)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                      isInWatchlist(activeVideo.url)
                        ? 'bg-red-600 border-red-500 text-white'
                        : 'border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <Bookmark size={13} className={isInWatchlist(activeVideo.url) ? 'fill-current' : ''} />
                    <span>{isInWatchlist(activeVideo.url) ? 'Saved' : 'Save Session'}</span>
                  </button>
                  
                  <a 
                    href={activeVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold border border-zinc-800 transition-colors"
                  >
                    <span>YouTube Link</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Premium Streaming Hub Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-8 md:p-12 text-white border border-zinc-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-red-600/15 rounded-full blur-[110px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-red-500 border border-red-500/20">
              <Youtube size={13} className="animate-pulse" /> Global Learning Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-zinc-50">
              Master the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-pink-500">
                Syllabus Instantly.
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
              Curated YouTube tutorials and playlists mapped specifically to your university syllabus guidelines. Watch, bookmark, and review on-demand without commercial distractions.
            </p>
          </div>

          <div className="w-full lg:w-[420px] bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-5 rounded-[2rem] space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search subjects, topics, creators..." 
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-900 rounded-xl outline-none focus:border-red-500 text-xs font-bold text-white placeholder:text-zinc-600 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Quick selectors inside banner */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Track</label>
                <select 
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-lg outline-none text-[10px] font-bold text-zinc-300 cursor-pointer hover:bg-zinc-900 transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categoriesList.map(cat => <option key={cat} value={cat} className="bg-zinc-950">{cat}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Subject</label>
                <select 
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-lg outline-none text-[10px] font-bold text-zinc-300 cursor-pointer hover:bg-zinc-900 transition-all"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjectsList.map(sub => <option key={sub} value={sub} className="bg-zinc-950">{sub}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Personalized Watchlist Section (Only renders if items bookmarked) */}
      {watchlist.length > 0 && (
        <div className="space-y-4 border-l-2 border-red-500 pl-4 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark size={16} className="text-red-500 fill-current" />
              <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">My Saved Lectures ({watchlist.length})</h3>
            </div>
            <button 
              onClick={() => setWatchlist([])}
              className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors"
            >
              Clear Watchlist
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
            {watchlist.map((video, idx) => (
              <div 
                key={`wl-${idx}`}
                onClick={() => setActiveVideo(video)}
                className="group relative bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/40 rounded-2xl overflow-hidden hover:border-red-500/40 p-3 flex gap-3 cursor-pointer transition-all"
              >
                <div className="relative w-24 h-16 shrink-0 rounded-lg overflow-hidden bg-zinc-200">
                  <img src={getThumbnail(video.url)} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <Play size={14} className="text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0 text-left flex flex-col justify-between py-0.5">
                  <h4 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                    {video.title}
                  </h4>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {video.subject}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Subject Navigation Buttons Grid (Replaces old static listings) */}
      <div className="space-y-3 text-left">
        <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">Syllabus Subject Rails</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {subjectsList.map((subject) => {
            const isSelected = selectedSubject === subject;
            const meta = getSubjectIconMeta(subject);
            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected 
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/15'
                    : 'bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {subject === 'All' ? '🌐 All Subjects' : meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Main Videos Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-red-100 dark:border-red-950/40 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredData.length > 0 ? (
            filteredData.map((video, idx) => {
              const meta = getSubjectIconMeta(video.subject);
              const isSaved = isInWatchlist(video.url);
              
              return (
                <div 
                  key={idx} 
                  onClick={() => setActiveVideo(video)}
                  className="group relative bg-white dark:bg-zinc-900/40 rounded-[1.8rem] border border-zinc-200/60 dark:border-zinc-800/40 overflow-hidden hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-800 cursor-pointer transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  {/* Thumbnail Cover container */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-950">
                    <img 
                      src={getThumbnail(video.url)} 
                      alt={video.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Floating controls overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Widescreen Interactive Play ring */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play size={18} className="fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bookmark Pill in absolute position */}
                    <button 
                      onClick={(e) => toggleWatchlist(video, e)}
                      className="absolute top-3 right-3 p-1.5 bg-black/60 backdrop-blur-md hover:bg-black/80 rounded-lg text-white border border-white/5 hover:border-white/15 transition-all"
                      title="Bookmark Lecture"
                    >
                      <Bookmark size={12} className={isSaved ? 'text-red-500 fill-current' : ''} />
                    </button>

                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-md border border-white/5">
                        {video.category || 'Lecture'}
                      </span>
                    </div>
                  </div>

                  {/* Body information content */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-1.5">
                        <Layers size={11} className="text-red-500" />
                        <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{video.subject}</span>
                      </div>
                      <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-red-500 transition-colors">
                        {video.title}
                      </h3>
                    </div>

                    {/* Footer buttons row */}
                    <div className="flex gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
                      <button 
                        onClick={() => setActiveVideo(video)}
                        className="flex-grow py-2.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-red-600 dark:hover:bg-red-600 text-zinc-700 dark:text-zinc-300 hover:text-white dark:hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center flex items-center justify-center gap-1"
                      >
                        <Tv size={12} />
                        <span>Watch Player</span>
                      </button>
                      
                      <button 
                        onClick={(e) => shareVideo(video, e)}
                        className="px-3 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-xl transition-all border border-zinc-200/40 dark:border-zinc-800/40"
                        title="Share Links"
                      >
                        <Share2 size={12} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center text-center space-y-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                <MonitorPlay size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100">No Lectures Found</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium max-w-sm mx-auto">
                  Try widening your keyword queries or resetting the active subject path.
                </p>
              </div>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedSubject('All');}}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl shadow-md shadow-red-500/10 active:scale-95 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6. Pro Study recommendation card */}
      <div className="bg-red-50/50 dark:bg-red-950/10 p-6 md:p-8 rounded-[2rem] border border-red-100 dark:border-red-900/20 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
        <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
          <Sparkles size={24} className="text-red-500 animate-pulse" />
        </div>
        <div className="space-y-1 flex-grow">
          <h4 className="text-sm font-black text-red-900 dark:text-red-400 uppercase tracking-wider">Reinforce with Practice Sheets</h4>
          <p className="text-xs text-red-700 dark:text-red-300/80 leading-relaxed font-medium">
            Watching visual tutorials boosts retention up to 60%. Pair these videos with corresponding practice guides and PDF folders directly inside our Study Notes section.
          </p>
        </div>
        <a 
          href="/notes" 
          className="whitespace-nowrap px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/10 active:scale-95 transition-all"
        >
          Browse Study Notes
        </a>
      </div>

    </div>
  );
};

export default YouTubeChannels;
