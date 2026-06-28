import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, Search, Filter, X, Calendar, ExternalLink, Play, 
  Image as ImageIcon, RefreshCw, Circle, Share2, 
  ArrowUpDown, Megaphone, Clock, Sparkles, Compass, 
  Layers, CheckCircle2, AlertCircle, ChevronRight, HelpCircle,
  Sliders, BellOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Notification } from '../types';
import { FollowerPointerCard } from '../components/ui/following-pointer';

const Notifications: React.FC = () => {
  const [data, setData] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // User notification preferences
  const [preferences, setPreferences] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('alfa_notification_preferences');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Simulated push notification toast
  const [testNotif, setTestNotif] = useState<{ title: string; body: string; category: string } | null>(null);

  // User dismissed notifications
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('alfa_dismissed_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedNotifs(prev => {
      const updated = [...prev, id];
      localStorage.setItem('alfa_dismissed_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const togglePreference = (category: string) => {
    setPreferences(prev => {
      const updated = {
        ...prev,
        [category]: prev[category] === false ? true : false
      };
      localStorage.setItem('alfa_notification_preferences', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerTestNotification = () => {
    const templates = [
      {
        title: "Upcoming Midterm Examination Shift",
        body: "The mid-semester examination for third-year classes has been rescheduled to next Monday. Please review the official portal for modified room allotments.",
        category: "Academic / Exams"
      },
      {
        title: "Annual Tech Fest Registration Open",
        body: "Registration for the annual campus hackathon is now open! Prizes up to $5,000. Team registration closes on Friday.",
        category: "Events"
      },
      {
        title: "Microsoft Placement Drive 2026",
        body: "Microsoft recruitment coordinators are visiting campus next month for early career roles. Register your eligibility by midnight.",
        category: "Placements"
      }
    ];
    
    const enabledCats = Object.keys(preferences).filter(cat => preferences[cat] !== false);
    let chosen = templates[Math.floor(Math.random() * templates.length)];
    
    if (enabledCats.length > 0) {
      const matching = templates.filter(t => enabledCats.some(ec => ec.toLowerCase().includes(t.category.toLowerCase().split(' ')[0])));
      if (matching.length > 0) {
        chosen = matching[Math.floor(Math.random() * matching.length)];
      }
    } else {
      chosen = {
        title: "All Channels Muted",
        body: "You have muted all notification channels. Unmute at least one channel to receive campus updates!",
        category: "Alert"
      };
    }

    setTestNotif(chosen);

    setTimeout(() => {
      setTestNotif(prev => prev && prev.title === chosen.title ? null : prev);
    }, 5000);
  };

  const getCategoryDetails = (cat: string) => {
    const normalized = (cat || "").toLowerCase();
    if (normalized.includes('urgent') || normalized.includes('important') || normalized.includes('alert')) {
      return {
        label: 'Urgent Alerts',
        desc: 'Urgent notifications, system alerts, and crucial notices.',
        colorClass: 'text-rose-500',
        bgToggleClass: 'bg-rose-500'
      };
    }
    if (normalized.includes('placement') || normalized.includes('job') || normalized.includes('career')) {
      return {
        label: 'Placement & Career',
        desc: 'Recruitment drives, career workshops, and job alerts.',
        colorClass: 'text-emerald-500',
        bgToggleClass: 'bg-emerald-500'
      };
    }
    if (normalized.includes('exam') || normalized.includes('academic') || normalized.includes('class')) {
      return {
        label: 'Academic Updates',
        desc: 'Exam sheets, schedule changes, and academic policies.',
        colorClass: 'text-sky-500',
        bgToggleClass: 'bg-sky-500'
      };
    }
    if (normalized.includes('event') || normalized.includes('club') || normalized.includes('fest')) {
      return {
        label: 'Events & Club News',
        desc: 'Festivals, hackathons, club announcements, and webinars.',
        colorClass: 'text-violet-500',
        bgToggleClass: 'bg-violet-500'
      };
    }
    return {
      label: cat,
      desc: `General campus updates from the ${cat} department.`,
      colorClass: 'text-zinc-500',
      bgToggleClass: 'bg-zinc-600'
    };
  };

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const result = await fetchCSV<Notification>(CSV_URLS.NOTIFICATIONS);
      setData(result);
      
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (result.length > 0) {
        const latestInFeed = [...result].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          return timeB - timeA;
        })[0];
        localStorage.setItem('alfa_last_notified_id', latestInFeed.id);
      }

      // Initialize preferences for newly discovered categories
      setPreferences(prev => {
        const updated = { ...prev };
        let changed = false;
        result.forEach(item => {
          if (item.category && updated[item.category] === undefined) {
            updated[item.category] = true;
            changed = true;
          }
        });
        if (changed) {
          localStorage.setItem('alfa_notification_preferences', JSON.stringify(updated));
        }
        return updated;
      });
    } catch (error) {
      console.error("Polling error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      loadData(true);
    }, 45000); // refresh every 45s

    return () => clearInterval(intervalId);
  }, [loadData]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: !!selectedNotif } }));
  }, [selectedNotif]);

  // Derived filtered & sorted data
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Filter out dismissed notifications
    result = result.filter(item => !dismissedNotifs.includes(item.id));
    
    // Filter out muted categories only when viewing 'All'
    if (selectedCategory === 'All') {
      result = result.filter(item => preferences[item.category] !== false);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search) ||
        (item.category || "").toLowerCase().includes(search)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [data, searchTerm, selectedCategory, sortOrder, preferences, dismissedNotifs]);

  // Group stats for Left Sidebar panel
  const categoriesList = useMemo(() => {
    const counts: { [key: string]: number } = {};
    data.forEach(item => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return [
      { name: 'All', count: data.length },
      ...Object.entries(counts).map(([name, count]) => ({ name, count }))
    ];
  }, [data]);

  // Spotlight Header Notice (Absolute Latest in raw data before filter)
  const spotlightNotif = useMemo(() => {
    if (data.length === 0) return null;
    return [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  }, [data]);

  const isVideo = (url: string) => {
    return url && url.match(/\.(mp4|webm|ogg)$|drive\.google\.com.*video/i);
  };

  const handleShare = async (notif: Notification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: notif.title,
          text: notif.description,
          url: window.location.href
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to Clipboard
      navigator.clipboard.writeText(`${notif.title}\n\n${notif.description}`);
      alert("Announcement copied to clipboard!");
    }
  };

  // Helper to resolve category colors dynamically
  const getCategoryTheme = (cat: string) => {
    const normalized = (cat || "").toLowerCase();
    if (normalized.includes('urgent') || normalized.includes('important') || normalized.includes('alert')) {
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20',
        dot: 'bg-rose-500 shadow-rose-500/50',
        accent: 'rose'
      };
    }
    if (normalized.includes('placement') || normalized.includes('job') || normalized.includes('career')) {
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        dot: 'bg-emerald-500 shadow-emerald-500/50',
        accent: 'emerald'
      };
    }
    if (normalized.includes('exam') || normalized.includes('academic') || normalized.includes('class')) {
      return {
        bg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/20',
        dot: 'bg-sky-500 shadow-sky-500/50',
        accent: 'sky'
      };
    }
    if (normalized.includes('event') || normalized.includes('club') || normalized.includes('fest')) {
      return {
        bg: 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/20',
        dot: 'bg-violet-500 shadow-violet-500/50',
        accent: 'violet'
      };
    }
    return {
      bg: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
      dot: 'bg-zinc-400 dark:bg-zinc-500 shadow-zinc-500/50',
      accent: 'zinc'
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-10 min-h-screen">
      
      {/* 1. Header with dynamic updates counter */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-6 md:p-10 text-white border border-zinc-900 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/20 text-primary-400 border border-primary-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-display">
                <Megaphone size={12} className="animate-bounce" /> Live Board
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-zinc-300 rounded-full text-[10px] font-bold border border-zinc-800">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Auto-syncs
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none font-display">
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-300">Announcements</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-medium">
              Stay in sync with real-time official news, exams updates, placement activities, and campus club alerts.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-zinc-900/50 backdrop-blur-md p-4 rounded-3xl border border-zinc-800/80">
            <div className="p-3 bg-zinc-800 rounded-2xl relative">
              <Bell size={24} className="text-primary-400 animate-pulse" />
              {isRefreshing && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                  <RefreshCw size={10} className="text-white animate-spin" />
                </div>
              )}
            </div>

            <button 
              onClick={() => loadData()}
              className="p-2 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer text-zinc-400 hover:text-white"
              title="Sync feed"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Headline Feature Notice Grid (Highlight of absolute latest notice) */}
      {spotlightNotif && !searchTerm && selectedCategory === 'All' && (
        <FollowerPointerCard title="Press to read announcement" className="relative group rounded-[2.5rem] bg-linear-to-b from-zinc-50 to-white dark:from-zinc-900/30 dark:to-zinc-950/20 border border-zinc-200/60 dark:border-zinc-800/60 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
              <Sparkles size={11} className="text-amber-500" />
              Headline
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {spotlightNotif.media_url ? (
              <div className="lg:col-span-4 relative aspect-[16/10] sm:aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950">
                <img 
                  src={spotlightNotif.media_url || null} 
                  alt={spotlightNotif.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {isVideo(spotlightNotif.media_url) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                      <Play size={20} className="fill-current" />
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="lg:col-span-4 relative aspect-[16/10] sm:aspect-video lg:aspect-square w-full rounded-2xl bg-linear-to-br from-primary-500/10 via-amber-500/5 to-transparent border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center">
                <Megaphone size={40} className="text-primary-500 mb-3 animate-pulse" />
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Official Notice Board Announcement</span>
              </div>
            )}

            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest font-display border ${getCategoryTheme(spotlightNotif.category).bg}`}>
                  {spotlightNotif.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-400">
                  <Calendar size={13} className="text-zinc-400" /> {spotlightNotif.timestamp}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-display leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {spotlightNotif.title}
              </h2>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed line-clamp-3">
                {spotlightNotif.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button 
                  onClick={() => setSelectedNotif(spotlightNotif)}
                  className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-bold rounded-2xl text-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Read Announcement</span>
                  <ChevronRight size={14} />
                </button>
                <button 
                  onClick={(e) => handleShare(spotlightNotif, e)}
                  className="p-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-2xl transition-all cursor-pointer border border-zinc-200/40 dark:border-zinc-800"
                  title="Share announcement"
                >
                  <Share2 size={15} />
                </button>
              </div>
            </div>
          </div>
        </FollowerPointerCard>
      )}

      {/* 3. Immersive Split Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Custom Navigation & Stat Desk */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          
          {/* Card: Live Filtering & Searching Deck */}
          <div className="rounded-[2rem] bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 p-6 space-y-6 shadow-sm">
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Compass size={18} className="text-primary-500" />
                <span>Search & Filter</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Filter announcements instantly by keyword or department tags.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="text" 
                placeholder="Find specific updates..." 
                className="pl-11 pr-4 py-3 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 shadow-xs transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* List Category Cards with counts */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500 block">
                Departments & Tags
              </span>
              
              <div className="grid grid-cols-1 gap-1.5">
                {categoriesList.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  const theme = getCategoryTheme(cat.name);
                  const isMuted = preferences[cat.name] === false;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-left border ${
                        isActive 
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-md' 
                          : 'bg-zinc-50/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200/50 dark:border-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                        <span className="truncate">{cat.name}</span>
                        {isMuted && (
                          <span className="shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[8px] uppercase tracking-wider font-extrabold">
                            <BellOff size={8} /> Muted
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                        isActive ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900' : 'bg-zinc-200/50 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Toggle Controller */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Ordering Chronology:</span>
              <button
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer transition-all active:scale-95"
              >
                <ArrowUpDown size={13} />
                <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
              </button>
            </div>

          </div>

          {/* Card: Notification Preferences */}
          <div className="rounded-[2rem] bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 p-6 space-y-6 shadow-sm text-left">
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Sliders size={18} className="text-primary-500" />
                <span>Preferences</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure your notification channels. Muted channels are hidden from the general timeline.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {Object.keys(preferences).length > 0 ? (
                Object.keys(preferences).map(cat => {
                  const isEnabled = preferences[cat] !== false;
                  const details = getCategoryDetails(cat);
                  const theme = getCategoryTheme(cat);
                  return (
                    <div 
                      key={cat} 
                      className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/60 dark:border-zinc-900/60 transition-all hover:border-zinc-200 dark:hover:border-zinc-800"
                    >
                      <div className="space-y-1 text-left flex-grow min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate block max-w-[150px]">{details.label}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-normal line-clamp-2">
                          {details.desc}
                        </p>
                      </div>
                      
                      {/* Interactive Custom Switch */}
                      <button
                        onClick={() => togglePreference(cat)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isEnabled ? theme.dot.split(' ')[1] || 'bg-primary-500' : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}
                        aria-label={`Toggle notifications for ${details.label}`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-xs text-zinc-400 font-medium">
                  Loading preferences...
                </div>
              )}
            </div>

            <button
              onClick={triggerTestNotification}
              className="w-full py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Bell size={13} className="text-primary-500 animate-pulse" />
              <span>Send Test Notification</span>
            </button>
          </div>

          {/* Card: Help Tip Card */}
          <div className="rounded-[2rem] bg-linear-to-br from-indigo-500/5 to-purple-500/5 border border-zinc-200/50 dark:border-zinc-900 p-6 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <HelpCircle size={18} />
              <h4 className="text-sm font-bold">Community Alerts</h4>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              Are you missing any important campus details or forms? You can easily search titles, dates, or contact info above.
            </p>
          </div>

        </div>

        {/* Right Side: Sleek Custom Timeline Stream Feed */}
        <div className="lg:col-span-8 space-y-6">

          {/* Heading with counts */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm uppercase tracking-widest font-bold text-zinc-400 dark:text-zinc-500">
              {selectedCategory === 'All' ? 'Timeline Stream' : `${selectedCategory} Notices`} ({processedData.length})
            </h3>
          </div>

          {/* Alert banner if viewing a muted category */}
          {selectedCategory !== 'All' && preferences[selectedCategory] === false && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 text-xs font-medium text-left">
              <div className="flex items-center gap-2.5">
                <BellOff size={16} className="text-amber-500 shrink-0" />
                <span>You have muted notifications for <strong>{selectedCategory}</strong>. Updates in this category won't show in the "All" stream.</span>
              </div>
              <button 
                onClick={() => togglePreference(selectedCategory)}
                className="px-3.5 py-1.5 bg-amber-500 text-white dark:text-zinc-950 font-bold rounded-xl hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap active:scale-95 text-xs"
              >
                Unmute Channel
              </button>
            </div>
          )}

          {loading && data.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-900">
              <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-zinc-500 font-bold text-sm">Synchronizing stream board...</p>
            </div>
          ) : processedData.length > 0 ? (
            <div className="relative pl-6 sm:pl-8 space-y-6 border-l border-zinc-200 dark:border-zinc-800 ml-4">
              
              {processedData.map((notif, index) => {
                const theme = getCategoryTheme(notif.category);
                return (
                  <motion.div 
                    key={`${notif.id}-${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
                    className="relative group cursor-pointer"
                    onClick={() => setSelectedNotif(notif)}
                  >
                    {/* Glowing circular timeline connector node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-7 w-4 h-4 rounded-full bg-zinc-950 dark:bg-black border-2 border-zinc-300 dark:border-zinc-700 flex items-center justify-center transition-all duration-300 group-hover:border-primary-500 dark:group-hover:border-primary-400 group-hover:scale-125">
                      <div className={`w-1.5 h-1.5 rounded-full ${theme.dot} transition-transform group-hover:scale-110`} />
                    </div>

                    {/* Announcement Item Content Card */}
                    <div className="bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 rounded-3xl p-5 md:p-6 shadow-xs hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest font-display border ${theme.bg}`}>
                            {notif.category}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold flex items-center gap-1">
                            <Clock size={11} />
                            {notif.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Dismiss Button */}
                          <button 
                            onClick={(e) => dismissNotification(notif.id, e)}
                            className="p-1 hover:bg-rose-500/10 hover:text-rose-500 text-zinc-400 dark:text-zinc-500 rounded-lg transition-colors cursor-pointer"
                            title="Dismiss notification"
                          >
                            <X size={14} />
                          </button>
                          {/* Tiny hover arrow icon */}
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 group-hover:text-primary-500 transition-colors">
                            <span>View Notice</span>
                            <ChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-5 items-start">
                        {notif.media_url && (
                          <div className="w-full md:w-32 h-20 shrink-0 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950 relative">
                            <img 
                              src={notif.media_url || null} 
                              alt="" 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              {isVideo(notif.media_url) ? <Play size={16} className="text-white fill-current" /> : <ImageIcon size={16} className="text-white" />}
                            </div>
                          </div>
                        )}

                        <div className="flex-grow space-y-1.5">
                          <h4 className="font-bold text-lg md:text-xl text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-primary-500 transition-colors">
                            {notif.title}
                          </h4>
                          <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed">
                            {notif.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100/60 dark:border-zinc-900/40 flex items-center justify-between sm:hidden">
                        <span className="text-xs font-bold text-zinc-400">Tap to expand</span>
                        <button 
                          onClick={(e) => handleShare(notif, e)}
                          className="p-1.5 bg-zinc-50 dark:bg-zinc-900 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}

            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-900 p-8">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-zinc-400" />
              </div>
              <h4 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mb-1">No announcements found</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Try widening your keyword search or switching to another category tab on the left.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* 4. Elegant Interactive Slide Drawer (Replaces plain routine modal) */}
      <AnimatePresence>
        {selectedNotif && (
          <div key="notification-modal-portal">
            {createPortal(
              <div className="fixed inset-0 z-[6000] overflow-hidden flex justify-end">
                
                {/* Backdrop Layer */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-0"
                  onClick={() => setSelectedNotif(null)}
                />

                {/* Slider Drawer Panel */}
                <motion.div 
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="relative w-full max-w-lg bg-white dark:bg-zinc-950 h-full shadow-2xl border-l border-zinc-200 dark:border-zinc-800 flex flex-col justify-between z-10"
                >
                  
                  {/* Drawer Header */}
                  <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-900 flex items-start justify-between">
                    <div className="space-y-2 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest font-display border ${getCategoryTheme(selectedNotif.category).bg}`}>
                          {selectedNotif.category}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 flex items-center gap-1">
                          <Clock size={11} /> {selectedNotif.timestamp}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-display leading-snug">
                        {selectedNotif.title}
                      </h3>
                    </div>

                    <button 
                      onClick={() => setSelectedNotif(null)}
                      className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-all cursor-pointer border border-zinc-200/40 dark:border-zinc-850"
                      aria-label="Close panel"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Drawer Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-thin">
                    
                    {/* Media Preview Container */}
                    {selectedNotif.media_url && selectedNotif.media_url.trim() !== "" && (
                      <div className="rounded-2xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-950 shadow-md">
                        {isVideo(selectedNotif.media_url) ? (
                          <video controls className="w-full aspect-video object-contain" autoPlay>
                            <source src={selectedNotif.media_url} />
                          </video>
                        ) : (
                          <img 
                            src={selectedNotif.media_url || null} 
                            alt="" 
                            className="w-full h-auto max-h-[300px] object-cover hover:scale-101 transition-transform" 
                          />
                        )}
                      </div>
                    )}

                    {/* Main Body Description text content */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                        <Megaphone size={13} className="text-primary-500" />
                        <span>Notice Body Description</span>
                      </div>
                      
                      <div className="bg-zinc-50 dark:bg-zinc-900/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-900/60">
                        <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm md:text-base whitespace-pre-line font-medium">
                          {selectedNotif.description}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info Block */}
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500">Notice Integrity Check</span>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span>Verifiable source (ALFA community cloud synchronization)</span>
                      </div>
                    </div>

                  </div>

                  {/* Drawer Footer controls */}
                  <div className="p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-900/80 flex items-center gap-4">
                    <button 
                      onClick={(e) => handleShare(selectedNotif, e)}
                      className="flex-1 py-3 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Share2 size={14} />
                      <span>Copy or Share</span>
                    </button>
                    <button 
                      onClick={() => setSelectedNotif(null)}
                      className="flex-1 py-3 bg-zinc-950 dark:bg-zinc-100 hover:bg-zinc-900 dark:hover:bg-white text-white dark:text-zinc-950 rounded-2xl text-xs font-extrabold transition-all shadow-md cursor-pointer"
                    >
                      Close Notice
                    </button>
                  </div>

                </motion.div>
              </div>,
              document.body
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Simulated Push Notification Banner Popup */}
      <AnimatePresence>
        {testNotif && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[6000] w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 flex gap-3.5 items-start overflow-hidden text-left"
          >
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0">
              <Bell size={18} className="animate-bounce" />
            </div>
            
            <div className="flex-grow space-y-1 pr-6 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${getCategoryTheme(testNotif.category).bg}`}>
                  {testNotif.category}
                </span>
                <span className="text-[9px] font-bold text-zinc-400 font-mono">Simulation</span>
              </div>
              <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug truncate">
                {testNotif.title}
              </h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2 font-medium">
                {testNotif.body}
              </p>
            </div>

            <button 
              onClick={() => setTestNotif(null)}
              className="absolute top-3 right-3 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Notifications;
