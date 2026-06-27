
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Users, Calendar, Bed, FileText, BookOpen, 
  GraduationCap, Tag, Cpu, Quote, ChevronRight,
  X, ExternalLink, Play, Image as ImageIcon, Share2,
  ChevronLeft, Sparkles, ArrowUp, ArrowUpRight, MousePointer2, MapPin, Clock, Ticket, PhoneCall,
  Download, Linkedin, Instagram, Github, MessageCircle, Twitter, Megaphone, PlusCircle, MessageSquare,
  Calculator
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS, QUOTES } from '../constants';
import { Event, Notification as NotificationType, Deal, PGRoom } from '../types';
import { FollowerPointerCard } from '../components/ui/following-pointer';
import { PointerHighlight } from '../components/ui/pointer-highlight';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [pgRooms, setPgRooms] = useState<PGRoom[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<NotificationType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quote, setQuote] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, notificationsData, dealsData, pgRoomsData] = await Promise.all([
          fetchCSV<Event>(CSV_URLS.EVENTS),
          fetchCSV<NotificationType>(CSV_URLS.NOTIFICATIONS),
          fetchCSV<Deal>(CSV_URLS.DEALS),
          fetchCSV<PGRoom>(CSV_URLS.PG_ROOMS)
        ]);
        
        setEvents(eventsData);
        setDeals(dealsData);
        setPgRooms(pgRoomsData);

        const sortedNotifs = [...notificationsData].sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime();
          const timeB = new Date(b.timestamp).getTime();
          if (isNaN(timeA)) return 1;
          if (isNaN(timeB)) return -1;
          return timeB - timeA;
        });
        
        setNotifications(sortedNotifs.slice(0, 3));
        setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      } catch (err) {
        console.error("Error loading home page CSV data:", err);
      }
    };
    loadData();

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dispatchModalState = (isOpen: boolean) => {
    window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: isOpen } }));
  };

  useEffect(() => {
    dispatchModalState(!!selectedNotif);
  }, [selectedNotif]);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % events.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [events.length, isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [events.length, isAnimating]);

  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(handleNext, 10000);
    return () => clearInterval(interval);
  }, [events.length, handleNext]);

  const isVideo = (url: string) => {
    return url && url.match(/\.(mp4|webm|ogg)$|drive\.google\.com.*video/i);
  };

  const quickLinks = [
    { name: 'Announcements', path: '/notifications', icon: Bell, color: 'bg-red-500' },
    { name: 'Notes', path: '/notes', icon: BookOpen, color: 'bg-primary-600' },
    { name: 'Events', path: '/events', icon: Calendar, color: 'bg-primary-500' },
    { name: 'Duty Leaves', path: '/duty-leaves', icon: Ticket, color: 'bg-orange-500' },
    { name: 'SOS', path: '/emergency', icon: PhoneCall, color: 'bg-rose-600' },
  ];

  const handleShare = async (notif: NotificationType) => {
    if (navigator.share) {
      try {
        const shareUrl = window.location.origin + window.location.pathname + window.location.hash;
        await navigator.share({
          title: notif.title,
          text: notif.description,
          url: shareUrl
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <div className="relative animate-in fade-in duration-700 pb-12 overflow-x-hidden bg-grid-pattern">
      <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-zinc-100 dark:bg-zinc-900 pointer-events-none">
        <div className="h-full bg-primary-500 transition-all duration-200" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Hero Spotlight Section */}
      <section className="relative pt-6 md:pt-12 pb-12 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[130px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent-500/10 dark:bg-accent-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Aceternity & Apple inspired dual layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Hero Brand Intro Column */}
            <div className="lg:col-span-7 text-left space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider font-display glow-primary animate-bounce-slow">
                <Sparkles size={13} className="text-primary-500 animate-pulse" />
                <span>ALFA Student OS v2.1 • Redefined</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-display leading-tight">
                  Navigate Campus Life <br className="hidden sm:inline" />
                  <PointerHighlight
                    rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow-500"
                    containerClassName="inline-block relative"
                  >
                    <span className="text-primary-500">Like a Pro.</span>
                  </PointerHighlight>
                </h1>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                  Welcome to <span className="text-primary-600 dark:text-primary-400 font-bold font-display">ALFA(LPU)</span> — the premium workspace designed for LPU students. Get lightning-fast announcements, coordinate duty leaves, discover local marketplace deals, study with peer-vetted notes, and access powerful student tools.
                </p>
              </div>

              {/* Action Buttons with macOS style pill design */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    const el = document.getElementById('bento-spotlight');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-600 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary-500/15 transition-all duration-300 hover:scale-105 active:scale-95 font-display glow-primary cursor-pointer"
                >
                  Explore Spotlight Events <ArrowUpRight size={15} />
                </button>
                <a 
                  href="https://alfalpu1.apk.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-sand-200 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 hover:bg-sand-300 dark:hover:bg-zinc-800 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 active:scale-95 font-display border border-sand-300 dark:border-zinc-800"
                >
                  <Download size={15} /> Download Offical App
                </a>
              </div>

              {/* Live Operating Stats ticker */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-zinc-200/55 dark:border-zinc-800/40 max-w-lg">
                <div className="text-left">
                  <div className="text-base sm:text-xl md:text-2xl font-black text-zinc-800 dark:text-zinc-100 font-display">3,000+</div>
                  <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-display">Community Members</div>
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-xl md:text-2xl font-black text-primary-500 font-display">99.2%</div>
                  <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-display">Duty Leave Approval</div>
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-xl md:text-2xl font-black text-accent-500 font-display">300+</div>
                  <div className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-display">Vetted Exam Notes</div>
                </div>
              </div>
            </div>

            {/* Right macOS Dashboard Interactive Simulator */}
            <div className="lg:col-span-5 w-full relative">
              <div className="absolute -inset-1.5 bg-primary-500 rounded-3xl blur-xl opacity-20 dark:opacity-30 group-hover:opacity-40 transition-opacity duration-1000"></div>
              
              {/* macOS Window */}
              <div className="relative rounded-2xl bg-zinc-900/90 dark:bg-black/95 border border-zinc-800/50 dark:border-zinc-800 shadow-2xl overflow-hidden text-left flex flex-col h-[340px] md:h-auto md:aspect-[1.3] group">
                
                {/* macOS Title Bar */}
                <div className="h-10 bg-zinc-950/90 dark:bg-black/90 px-4 flex items-center justify-between border-b border-zinc-800/40 shrink-0">
                  {/* Window Controls */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-inner cursor-pointer hover:brightness-110"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner cursor-pointer hover:brightness-110"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner cursor-pointer hover:brightness-110"></div>
                  </div>
                  
                  {/* Address Bar */}
                  <div className="hidden sm:flex px-4 md:px-6 py-1 bg-zinc-900 dark:bg-zinc-900/60 rounded-md border border-zinc-800/40 text-[10px] font-mono text-zinc-500 select-none items-center gap-1.5 max-w-[150px] md:max-w-[200px] truncate">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    alfa.lpu.edu/student-os
                  </div>
                  
                  {/* Info Badge */}
                  <div className="text-[9px] font-bold font-mono text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                    LIVE DATA
                  </div>
                </div>

                {/* macOS Workspace Simulator Area */}
                <div className="flex-grow p-4 pb-20 space-y-3.5 overflow-y-auto scrollbar-hide text-zinc-100 bg-zinc-950 font-sans">
                  
                  {/* Real Interactive Notification Banner */}
                  {notifications.length > 0 ? (
                    <Link to="/notifications" className="block p-3 bg-zinc-900/90 hover:bg-zinc-900 rounded-xl border border-zinc-800/80 flex items-center justify-between shadow-md group/banner transition-all">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 shrink-0 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs">
                          {notifications[0].category?.toLowerCase() === "official" ? "📢" : "💡"}
                        </div>
                        <div className="text-left min-w-0">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-display">LPU Announcement</p>
                          <p className="text-xs font-semibold text-zinc-100 truncate max-w-[110px] xs:max-w-[140px] sm:max-w-[220px] group-hover/banner:text-primary-400 transition-colors">
                            {notifications[0].title}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 shrink-0 ml-2">
                        {notifications[0].timestamp ? new Date(notifications[0].timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : "Just now"}
                      </span>
                    </Link>
                  ) : (
                    <div className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs">📢</div>
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-display">LPU Official Notice</p>
                          <p className="text-xs font-semibold text-zinc-100">No active notices found</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Operational grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Live Widget 1: Real Featured Event */}
                    {events.length > 0 ? (
                      <Link to="/events" className="block p-3 bg-zinc-900/60 hover:bg-zinc-900/80 rounded-xl border border-zinc-800/60 hover:border-zinc-700/80 transition-all text-left group/widget">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-display">Featured Event</span>
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        </div>
                        <p className="text-xs font-black text-zinc-100 font-display group-hover/widget:text-primary-400 transition-colors truncate">
                          {events[0].title}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate">
                          {events[0].venue} • {events[0].date}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-display">Schedule</span>
                          <div className="w-2 h-2 rounded-full bg-zinc-600"></div>
                        </div>
                        <p className="text-xs font-black text-zinc-100 font-display">No events today</p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1">Check back later</p>
                      </div>
                    )}

                    {/* Live Widget 2: Real Hot Deal or PG Listing */}
                    {deals.length > 0 ? (
                      <Link to="/deals" className="block p-3 bg-zinc-900/60 hover:bg-zinc-900/80 rounded-xl border border-zinc-800/60 hover:border-zinc-700/80 transition-all text-left group/widget">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-display">Hot Deal</span>
                          <span className="text-[8px] font-bold bg-primary-500 text-white px-1.5 py-0.5 rounded uppercase font-display">₹{deals[0].price}</span>
                        </div>
                        <p className="text-xs font-black text-zinc-100 font-display group-hover/widget:text-primary-400 transition-colors truncate">
                          {deals[0].title}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate">
                          {deals[0].seller_name} • {deals[0].location || "Near Gate 2"}
                        </p>
                      </Link>
                    ) : pgRooms.length > 0 ? (
                      <Link to="/pg-rooms" className="block p-3 bg-zinc-900/60 hover:bg-zinc-900/80 rounded-xl border border-zinc-800/60 hover:border-zinc-700/80 transition-all text-left group/widget">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-display">Roommate Needed</span>
                          <span className="text-[8px] font-bold bg-primary-500 text-white px-1.5 py-0.5 rounded uppercase font-display">₹{pgRooms[0].rent}/mo</span>
                        </div>
                        <p className="text-xs font-black text-zinc-100 font-display group-hover/widget:text-primary-400 transition-colors truncate">
                          {pgRooms[0].name}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate">
                          {pgRooms[0].address}
                        </p>
                      </Link>
                    ) : (
                      <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/60 text-left">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-display">Hot Deal</span>
                          <span className="text-[8px] font-bold bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded uppercase">SOLD</span>
                        </div>
                        <p className="text-xs font-black text-zinc-100 font-display">No deals posted</p>
                        <p className="text-[10px] font-mono text-zinc-400 mt-1">Check marketplace</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* macOS Floating Dock - Always Visible, Never Scroll! */}
                <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
                  <div className="px-3 sm:px-3.5 py-1.5 bg-zinc-900/95 dark:bg-zinc-950/95 backdrop-blur-md rounded-2xl border border-zinc-800/60 flex items-center gap-2 sm:gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto font-sans">
                    {quickLinks.map((ql, i) => (
                      <Link 
                        key={i} 
                        to={ql.path} 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:scale-125 hover:-translate-y-1.5 transition-all duration-300 shadow"
                        style={{ backgroundColor: ql.color === 'bg-primary-500' ? '#fe7f2d' : ql.color === 'bg-accent-500' ? '#233d4d' : ql.color === 'bg-red-500' ? '#ef4444' : ql.color === 'bg-orange-500' ? '#f97316' : ql.color === 'bg-primary-600' ? '#233d4d' : '#e11d48' }}
                        title={ql.name}
                      >
                        <ql.icon size={15} />
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div id="bento-spotlight" className="pt-4"></div>
          
          {events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Event Spotlight Carousel Slider (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between p-6 md:p-8 rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden group">
                {/* Decorative colored blurs */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-500/10 dark:bg-primary-500/10 blur-[60px] rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-500/10 dark:bg-rose-500/5 blur-[60px] rounded-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>
                
                <div className="space-y-6">
                  {/* Card Header with Spotlight Badge & Elegant Control Group */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                        Spotlight Event
                      </span>
                    </div>
                    
                    {/* Compact, modern glassmorphic slider controls */}
                    <div className="flex items-center gap-2">
                       <button 
                         onClick={handlePrev} 
                         className="w-9 h-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-full border border-zinc-200/60 dark:border-zinc-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                         aria-label="Previous event"
                       >
                         <ChevronLeft size={16} />
                       </button>
                       <button 
                         onClick={handleNext} 
                         className="w-9 h-9 flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded-full border border-zinc-200/60 dark:border-zinc-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                         aria-label="Next event"
                       >
                         <ChevronRight size={16} />
                       </button>
                    </div>
                  </div>

                  {/* Main Aspect Slider Screen */}
                  <FollowerPointerCard
                    title={`View details: ${events[currentSlide]?.title || 'Spotlight Event'}`}
                    className="relative aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-3xl border border-zinc-200/40 dark:border-zinc-850/30 shadow-md bg-zinc-100 dark:bg-zinc-950"
                  >
                    {events.map((event, idx) => (
                      <div 
                        key={idx}
                        className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[0.98] pointer-events-none z-0'
                        }`}
                      >
                        <Link to={`/events/${idx}`} className="block w-full h-full relative group/img overflow-hidden">
                          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-105" />
                          {/* Smooth vignette overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                        </Link>
                      </div>
                    ))}
                  </FollowerPointerCard>
                </div>

                {/* Card Footer with Dots Indicator and sleek action details */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display mr-2">Spotlight</span>
                    <div className="flex items-center gap-1.5">
                      {events.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide(i)}
                          className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                            i === currentSlide ? 'w-6 bg-primary-500' : 'w-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Link 
                    to={`/events/${currentSlide}`} 
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-display uppercase tracking-widest group/link"
                  >
                     <span>View Event details</span> 
                     <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>

              {/* Event Description and quick facts (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-[2rem] bg-sand-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm relative overflow-hidden text-left">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-500/5 blur-3xl rounded-full pointer-events-none"></div>
                
                <div className="space-y-6">
                  {events.map((event, idx) => (
                    <div key={idx} className={`space-y-4 transition-all duration-500 ${idx === currentSlide ? 'block opacity-100' : 'hidden opacity-0'}`}>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-block px-2.5 py-0.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-md text-[9px] font-bold uppercase tracking-widest font-display">
                            {event.category || 'Spotlight'}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-medium font-display uppercase tracking-wider">
                            <Calendar size={11} className="text-primary-500" /> {event.date}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-md text-[10px] font-medium font-display uppercase tracking-wider">
                            <MapPin size={11} className="text-accent-500" /> {event.venue}
                          </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-display leading-tight line-clamp-2">
                          {event.title}
                        </h2>
                      </div>
                      
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed line-clamp-4 pl-4 border-l-2 border-primary-500">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60">
                          <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest font-display block mb-1">Pass Price</span>
                          <span className="text-lg font-extrabold text-primary-500 dark:text-primary-400 font-display">₹{event.price || 'Free'}</span>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/50 dark:border-zinc-800/60">
                          <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest font-display block mb-1">Venue Coordinators</span>
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-200 truncate block font-display">{event.organizer || 'LPU Student Hub'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/40 flex flex-col sm:flex-row gap-3">
                  <Link 
                    to={`/events/${currentSlide}`} 
                    className="flex-grow inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-600/15 font-display glow-primary"
                  >
                    Get Tickets <Ticket size={15} />
                  </Link>
                  <Link 
                    to="/events" 
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-750 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border border-zinc-200/60 dark:border-zinc-700/50 font-display"
                  >
                    All Events <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-sand-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/40 rounded-[2rem] shadow-sm">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-zinc-400 text-xs font-semibold uppercase tracking-widest font-display">Syncing Spotlight Universe...</p>
            </div>
          )}
        </div>
      </section>

      {/* Campus Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-12 space-y-16">
        <section className="text-left">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest font-display">Campus Hub</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: 'Announcements', path: '/notifications', icon: Bell, color: 'text-rose-500 bg-rose-500/10 border-rose-500/10 dark:border-rose-500/5' },
              { name: 'Academic Notes', path: '/notes', icon: BookOpen, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/10 dark:border-indigo-500/5' },
              { name: 'Events Spotlight', path: '/events', icon: Calendar, color: 'text-primary-500 bg-primary-500/10 border-primary-500/10 dark:border-primary-500/5' },
              { name: 'Duty Leaves', path: '/duty-leaves', icon: Ticket, color: 'text-amber-500 bg-amber-500/10 border-amber-500/10 dark:border-amber-500/5' },
              { name: 'GPA Calculator', path: '/gpa', icon: Calculator, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10 dark:border-emerald-500/5' },
              { name: 'SOS Emergency', path: '/emergency', icon: PhoneCall, color: 'text-red-500 bg-red-500/10 border-red-500/10 dark:border-red-500/5' },
            ].map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="flex flex-col items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-sand-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-md hover:border-primary-500/20 group"
              >
                <div className={`${link.color} p-2.5 sm:p-3 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
                  <link.icon size={18} />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block font-display leading-tight">{link.name}</span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 font-medium block">Explore Portal →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 text-left">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest font-display">Feed Updates</h3>
              </div>
              <Link to="/notifications" className="text-[11px] font-bold uppercase text-primary-500 tracking-wider hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-display">View All Updates</Link>
            </div>
            <div className="space-y-4">
              {notifications.map((notif, index) => (
                <div 
                  key={`${notif.id || 'notif'}-${index}`} 
                  onClick={() => setSelectedNotif(notif)} 
                  className="bg-sand-50 dark:bg-zinc-900/50 p-4 sm:p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-850/40 flex gap-3 sm:gap-4 hover:shadow-md hover:border-primary-500/20 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all duration-300"><Bell size={18} /></div>
                  <div className="flex-grow min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-semibold text-primary-500 uppercase tracking-wider font-display">{notif.timestamp}</span>
                    </div>
                    <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1 truncate group-hover:text-primary-500 transition-colors duration-300 font-display">{notif.title}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium">{notif.description}</p>
                  </div>
                  <div className="w-8 h-10 sm:h-11 shrink-0 flex items-center justify-center text-zinc-300 dark:text-zinc-700 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="text-left">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest font-display">Daily Wisdom</h3>
            </div>
            <div className="bg-sand-50 dark:bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-zinc-200/50 dark:border-zinc-850/40 relative overflow-hidden flex flex-col justify-center min-h-[220px] text-left shadow-sm group">
              <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              <Quote className="text-primary-500 opacity-5 absolute top-6 right-6 group-hover:scale-110 transition-transform duration-700" size={70} />
              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500 font-display block">Campus Quote</span>
                <p className="text-zinc-800 dark:text-zinc-200 text-base md:text-lg font-bold italic leading-relaxed">
                  "{quote}"
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Download App Section */}
        <section className="mt-8 text-left">
          <div className="bg-gradient-to-br from-accent-900 to-accent-950 dark:from-zinc-900 dark:to-zinc-950 rounded-[2rem] p-6 sm:p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl border border-zinc-200/20 dark:border-zinc-850/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="space-y-5 relative z-10 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 dark:bg-zinc-800/80 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                <Sparkles size={12} className="text-accent-400" /> New Release Available
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display leading-tight">Get ALFA(LPU) on Android</h2>
              <p className="text-zinc-300 text-xs md:text-sm font-medium leading-relaxed">
                Stay updated with instant push notifications, high-performance offline access, and a fully polished, native student mobile dashboard.
              </p>
              <a 
                href="https://alfalpu1.apk.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-sand-50 text-accent-900 hover:bg-sand-200 dark:bg-primary-500 dark:text-white dark:hover:bg-primary-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 font-display"
              >
                <Download size={16} /> Download APK Document
              </a>
            </div>
            <div className="relative z-10 shrink-0">
              <div className="w-36 h-36 md:w-48 md:h-48 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center p-6 shadow-2xl">
                 <img src="https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png" alt="App Icon" className="w-full h-full object-contain rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration & Get Featured Section */}
        <section className="mt-8 text-left">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest font-display">Get Featured</h3>
          </div>
          <div className="bg-sand-50 dark:bg-zinc-900/30 rounded-[2rem] p-6 sm:p-8 md:p-12 text-zinc-900 dark:text-zinc-100 shadow-sm relative overflow-hidden group/featured border border-zinc-200/50 dark:border-zinc-800/40">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover/featured:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <div className="space-y-3">
                  <h4 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display leading-tight">Grow with ALFA(LPU)</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed max-w-lg">
                    Advertise your brand, promote student events, list your PG space, or feature custom student deals. Tap directly into a highly active student community instantly.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { label: 'Promotions', icon: Megaphone },
                    { label: 'PG Listings', icon: PlusCircle },
                    { label: 'Events Spotlight', icon: Calendar },
                    { label: 'Clubs Portal', icon: Users },
                    { label: 'Suggestions', icon: MessageSquare }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-wider border border-zinc-200/50 dark:border-zinc-800/20 hover:bg-zinc-200 dark:hover:bg-zinc-750 transition-all font-display">
                      <item.icon size={11} className="text-primary-500" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-sand-50 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-zinc-200/60 dark:border-zinc-800/40 flex flex-col items-center text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-xl flex items-center justify-center shadow-inner group-hover/featured:scale-105 duration-500 transition-transform">
                  <PhoneCall size={28} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-500 font-display">Student Support Helpline</p>
                  <a 
                    href="tel:7793914091" 
                    className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white hover:text-primary-500 transition-colors tracking-tight block font-display"
                  >
                    7793914091
                  </a>
                </div>
                <div className="space-y-3 w-full">
                  <p className="text-xs text-zinc-400 font-medium italic">Call or message for instant listing approval</p>
                  <a 
                    href="https://wa.me/917793914091" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-emerald-500/10 font-display"
                  >
                    <MessageCircle size={16} /> WhatsApp Business Chat
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workspace Highlights Spotlight */}
        <section className="mt-8 text-left">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest font-display">Workspace Highlights</h3>
          </div>
          
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm mb-8 font-medium max-w-2xl leading-relaxed">
            Experience our collaborative, gesture-interactive campus workspace. Hover over the highlighted phrases in the cards below to see live collaborative cursor annotations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/40 rounded-[2rem] p-6 md:p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-blue-500/20 to-sky-500/10 dark:from-blue-950/40 dark:to-sky-950/20 border border-blue-500/10 dark:border-blue-500/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-20"></div>
                <BookOpen size={32} className="text-blue-500 dark:text-blue-400 relative z-10 animate-pulse-slow" />
              </div>
              <div className="mt-6 text-zinc-850 dark:text-zinc-200 text-sm md:text-base font-bold leading-relaxed tracking-tight">
                Our state-of-the-art{' '}
                <PointerHighlight
                  rectangleClassName="bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30 dark:border-blue-500/40 px-1.5 py-0.5 rounded-lg"
                  pointerClassName="text-blue-500"
                  containerClassName="inline-block"
                >
                  <span className="text-blue-500 font-bold">peer study tool</span>
                </PointerHighlight>{' '}
                delivers comprehensive notes and syllabus-matching resources with minimal effort.
              </div>
              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
                Syllabus-aligned study guides, peer-vetted questions, and course notes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/40 rounded-[2rem] p-6 md:p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 dark:from-purple-950/40 dark:to-indigo-950/20 border border-purple-500/10 dark:border-purple-500/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-20"></div>
                <Users size={32} className="text-purple-500 dark:text-purple-400 relative z-10 animate-pulse-slow" />
              </div>
              <div className="mt-6 text-zinc-850 dark:text-zinc-200 text-sm md:text-base font-bold leading-relaxed tracking-tight">
                Discover our{' '}
                <PointerHighlight
                  rectangleClassName="bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/30 dark:border-purple-500/40 px-1.5 py-0.5 rounded-lg"
                  pointerClassName="text-purple-500"
                  containerClassName="inline-block"
                >
                  <span className="text-purple-500 font-bold">innovative clubs</span>
                </PointerHighlight>{' '}
                and communities for all student technical interests.
              </div>
              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
                Connect with leading student groups, cultural blocks, and technical societies.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/40 rounded-[2rem] p-6 md:p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-500/10 dark:border-emerald-500/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-20"></div>
                <Cpu size={32} className="text-emerald-500 dark:text-emerald-400 relative z-10 animate-pulse-slow" />
              </div>
              <div className="mt-6 text-zinc-850 dark:text-zinc-200 text-sm md:text-base font-bold leading-relaxed tracking-tight">
                Experience the next-gen{' '}
                <PointerHighlight
                  rectangleClassName="bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30 dark:border-emerald-500/40 px-1.5 py-0.5 rounded-lg"
                  pointerClassName="text-emerald-500"
                  containerClassName="inline-block"
                >
                  <span className="text-emerald-500 font-bold">sustainable tech</span>
                </PointerHighlight>{' '}
                and AI assistant tools.
              </div>
              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
                Smart automation widgets designed to elevate your day-to-day productivity.
              </p>
            </div>
          </div>
        </section>

        {/* About Developer Section */}
        <section className="mt-8 text-left">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest font-display">About the Author</h3>
          </div>
          <div className="bg-sand-50 dark:bg-zinc-900/50 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-850/40 p-6 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
            <div className="w-32 h-32 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-800 shadow-md relative group/dev">
              <img src="https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png" alt="Harsha Bacham" className="w-full h-full object-cover transition-transform duration-500 group-hover/dev:scale-110" />
              <div className="absolute inset-0 bg-primary-500/10 mix-blend-overlay"></div>
            </div>
            <div className="flex-grow space-y-4 text-center md:text-left">
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 font-display tracking-tight">Harsha Bacham</h4>
                <p className="text-primary-500 dark:text-primary-400 font-bold text-[10px] uppercase tracking-widest mt-1 font-display">Lead Creator & Designer</p>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-xl font-medium">
                Deeply focused on developing next-generation student platforms that elevate community networks. ALFA(LPU) represents a completely streamlined full-stack solution.
              </p>
              <div className="flex justify-center md:justify-start gap-3">
                <a href="https://www.linkedin.com/in/harsha-bacham/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-[#0077b5] text-white rounded-lg shadow-sm hover:-translate-y-1 duration-300 transition-transform"><Linkedin size={15} /></a>
                <a href="https://www.instagram.com/harsha_bacham/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-[#e1306c] text-white rounded-lg shadow-sm hover:-translate-y-1 duration-300 transition-transform"><Instagram size={15} /></a>
                <a href="https://github.com/harshabacham" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-lg shadow-sm hover:-translate-y-1 duration-300 transition-transform"><Github size={15} /></a>
                <a href="https://wa.me/917793914091" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-[#25D366] text-white rounded-lg shadow-sm hover:-translate-y-1 duration-300 transition-transform"><MessageCircle size={15} /></a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showScrollTop && !selectedNotif && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-24 right-8 z-[90] w-10 h-10 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-600/30 flex items-center justify-center hover:scale-115 active:scale-95 transition-all duration-300 glow-primary border border-primary-500/30"><ArrowUp size={18} /></button>
      )}

      {selectedNotif && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-sand-50 dark:bg-zinc-900 w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-zinc-200 dark:border-zinc-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 pb-3 flex justify-between items-start border-b border-zinc-100 dark:border-zinc-800/60">
              <div className="space-y-2 text-left">
                 <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-primary-500/10 text-primary-500 rounded text-[9px] font-bold uppercase tracking-wider font-display">{notifCategory(selectedNotif.category)}</span>
                    <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider font-display">{selectedNotif.timestamp}</p>
                 </div>
                 <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight font-display">{selectedNotif.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)} 
                className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-lg hover:bg-red-500 hover:text-white hover:scale-105 duration-300 transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 scrollbar-hide text-left flex-grow">
              {selectedNotif.media_url && selectedNotif.media_url.trim() !== "" && (
                <div className="rounded-xl overflow-hidden bg-black shadow border border-white/5">
                  {isVideo(selectedNotif.media_url) ? (
                    <video controls autoPlay className="w-full aspect-video">
                      <source src={selectedNotif.media_url} />
                    </video>
                  ) : (
                    <img 
                      src={selectedNotif.media_url} 
                      alt="" 
                      className="w-full h-auto max-h-[40vh] object-contain mx-auto" 
                    />
                  )}
                </div>
              )}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedNotif.description}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-3 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-100 dark:border-zinc-800/60 flex gap-3">
              <button 
                onClick={() => handleShare(selectedNotif)}
                className="flex-1 py-3.5 bg-sand-50 dark:bg-zinc-800 hover:bg-sand-100 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 flex items-center justify-center gap-1.5 font-display"
              >
                <Share2 size={14} /> Share Update
              </button>
              <button 
                onClick={() => setSelectedNotif(null)} 
                className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-primary-500/10 active:scale-95 glow-primary font-display"
              >
                Got It
              </button>
            </div>
          </div>
          {/* Clickable Backdrop to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedNotif(null)}></div>
        </div>
      )}
    </div>
  );
};

const notifCategory = (cat: any) => String(cat || 'Info').toUpperCase();

export default Home;
