
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Users, Calendar, Bed, FileText, BookOpen, 
  GraduationCap, Tag, Cpu, Quote, ChevronRight,
  X, ExternalLink, Play, Image as ImageIcon, Share2,
  ChevronLeft, Sparkles, ArrowUp, MousePointer2, MapPin, Clock, Ticket, PhoneCall,
  Download, Linkedin, Instagram, Github, MessageCircle, Twitter, Megaphone, PlusCircle, MessageSquare
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS, QUOTES } from '../constants';
import { Event, Notification as NotificationType } from '../types';
import AdBanner from '../components/AdBanner';

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [selectedNotif, setSelectedNotif] = useState<NotificationType | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quote, setQuote] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const [eventsData, notificationsData] = await Promise.all([
        fetchCSV<Event>(CSV_URLS.EVENTS),
        fetchCSV<NotificationType>(CSV_URLS.NOTIFICATIONS)
      ]);
      
      setEvents(eventsData);

      const sortedNotifs = [...notificationsData].sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        if (isNaN(timeA)) return 1;
        if (isNaN(timeB)) return -1;
        return timeB - timeA;
      });
      
      setNotifications(sortedNotifs.slice(0, 3));
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
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
    { name: 'Events', path: '/events', icon: Calendar, color: 'bg-primary-500' },
    { name: 'Duty Leaves', path: '/duty-leaves', icon: FileText, color: 'bg-orange-500' },
    { name: 'Notes', path: '/notes', icon: BookOpen, color: 'bg-primary-600' },
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
    <div className="relative animate-in fade-in duration-700 pb-12 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-1.5 z-[110] bg-gray-200 dark:bg-gray-800 pointer-events-none">
        <div className="h-full bg-primary-600 transition-all duration-200" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[700px] flex items-center bg-white dark:bg-gray-950 px-6 md:px-12 py-12 md:py-20 overflow-hidden">
        <div className="max-w-screen-2xl w-full">
          {events.length > 0 ? (
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
              <div className="lg:col-span-7 relative">
                <div className="relative aspect-[4/3] md:aspect-[16/9] w-full z-10">
                  {events.map((event, idx) => (
                    <div 
                      key={idx}
                      className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-x-8 z-0 pointer-events-none'
                      }`}
                    >
                      <Link 
                        to={`/events/${idx}`}
                        className="block w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-800 shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                      >
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                      </Link>
                      <div className={`absolute -bottom-4 -right-4 md:-right-8 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-xl z-30 transition-all duration-1000 delay-300 ${idx === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                         <div className="space-y-3">
                            <div className="flex items-center gap-2">
                               <div className="p-2 bg-primary-600 text-white rounded-xl"><Calendar size={16} /></div>
                               <p className="text-sm font-black text-gray-900 dark:text-white">{event.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-xl"><MapPin size={16} /></div>
                               <p className="text-xs font-bold text-gray-500 dark:text-gray-400 max-w-[120px] truncate">{event.venue}</p>
                            </div>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                {events.map((event, idx) => (
                  <div key={idx} className={`transition-all duration-700 ${idx === currentSlide ? 'block opacity-100' : 'hidden opacity-0'}`}>
                    <div className="space-y-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Sparkles size={14} /> Spotlight Event
                      </span>
                      <Link to={`/events/${idx}`} className="block group">
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter group-hover:text-primary-600 transition-colors">{event.title}</h2>
                      </Link>
                      <p className="text-gray-500 dark:text-gray-400 text-lg line-clamp-2 border-l-4 border-primary-600 pl-5">{event.description}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <Link to={`/events/${idx}`} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all active:scale-95">Get Tickets <Ticket size={18} /></Link>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-gray-400 uppercase">Fee</span>
                           <span className="text-xl font-black text-gray-900 dark:text-white">₹{event.price || 'Free'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-6 pt-8">
                   <div className="flex gap-2">
                      {/* Removed non-standard handlePrev attribute */}
                      <button onClick={handlePrev} className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-primary-600 hover:text-white transition-all shadow-sm"><ChevronLeft size={24} /></button>
                      {/* Removed non-standard handleNext attribute */}
                      <button onClick={handleNext} className="w-12 h-12 shrink-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-400 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-primary-600 hover:text-white transition-all shadow-sm"><ChevronRight size={24} /></button>
                   </div>
                   <div className="h-1 flex-grow max-w-[100px] bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 transition-all duration-1000" style={{ width: `${((currentSlide + 1) / events.length) * 100}%` }}></div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[400px] animate-pulse"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
          )}
        </div>
      </section>

      

      {/* Campus Content */}
      <div className="max-w-screen-2xl px-6 md:px-12 mt-12 space-y-16">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Campus Hub</h3>
          </div>
          
          <div className="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
            {quickLinks.map((link) => (
              <Link key={link.name} to={link.path} className="flex flex-col items-center gap-3 min-w-[110px] p-4 rounded-[2rem] hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700 shadow-sm hover:shadow-xl group">
                <div className={`${link.color} w-14 h-14 rounded-2xl text-white flex items-center justify-center group-hover:scale-110 transition-transform`}><link.icon size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 text-center">{link.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black flex items-center gap-3 dark:text-white"><div className="w-2 h-8 bg-primary-600 rounded-full"></div>Announcements</h3>
              <Link to="/notifications" className="text-[10px] font-black uppercase text-primary-600 tracking-widest hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div key={notif.id} onClick={() => setSelectedNotif(notif)} className="bg-white dark:bg-gray-800 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex gap-5 hover:shadow-xl transition-all cursor-pointer group">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all"><Bell size={24} /></div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-primary-600 uppercase tracking-widest">{notif.timestamp}</span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1 truncate group-hover:text-primary-600 transition-colors">{notif.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{notif.description}</p>
                  </div>
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center text-gray-200 group-hover:text-primary-500 group-hover:translate-x-1 transition-all">
                    <ChevronRight size={24} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden flex flex-col justify-center min-h-[200px]">
              <Quote className="text-primary-500 opacity-5 absolute top-6 right-6" size={80} />
              <div className="relative z-10 space-y-4">
                <h4><span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-600">Daily Wisdom</span></h4>
                <p className="text-gray-800 dark:text-gray-200 text-lg font-bold italic leading-relaxed">"{quote}"</p>
              </div>
            </div>
          </section>
        </div>

        

        {/* Download App Section */}
        <section className="mt-8">
          <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-[3rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="space-y-6 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                <Sparkles size={14} /> New Release
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">Download ALFA(LPU) App</h2>
              <p className="text-white/80 text-lg max-w-md font-medium">Experience ALFA(LPU) directly on your Android device with native notifications and faster access.</p>
              <a 
                href="https://alfalpu1.apk.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Download size={20} /> Download APK Now
              </a>
            </div>
            <div className="relative z-10 shrink-0 animate-bounce-slow">
              <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 flex items-center justify-center p-8 shadow-inner">
                 <img src="https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png" alt="App Icon" className="w-full h-full object-contain rounded-[2rem]" />
              </div>
            </div>
          </div>
        </section>

       

        {/* Collaboration & Get Featured Section */}
        <section className="mt-8 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Get Featured</h3>
          </div>
          <div className="bg-gradient-to-br from-primary-900 to-indigo-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl relative overflow-hidden group/featured">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover/featured:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h4 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Want to grow with ALFA(LPU)?</h4>
                  <p className="text-primary-100/80 text-lg font-medium leading-relaxed max-w-lg">
                    Whether you're a business looking for promotions, a PG owner wanting to list your space, or a club leader organizing the next big event—reach thousands of students instantly.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Promotions', icon: Megaphone },
                    { label: 'Add PG Rooms', icon: PlusCircle },
                    { label: 'Feature Events', icon: Calendar },
                    { label: 'Join Clubs', icon: Users },
                    { label: 'Suggestions', icon: MessageSquare }
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">
                      <item.icon size={12} className="text-primary-400" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/20 flex flex-col items-center text-center space-y-8 shadow-inner">
                <div className="w-24 h-24 bg-white text-primary-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl transform group-hover/featured:rotate-12 transition-transform duration-500">
                  <PhoneCall size={48} />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-300">Direct Support Line</p>
                  <a 
                    href="tel:7793914091" 
                    className="text-4xl md:text-5xl font-black text-white hover:text-primary-400 transition-colors tracking-tighter block"
                  >
                    7793914091
                  </a>
                </div>
                <div className="space-y-4 w-full">
                  <p className="text-sm text-primary-100/60 font-medium italic">Call or WhatsApp for partnerships</p>
                  <a 
                    href="https://wa.me/917793914091" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-5 bg-white text-primary-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                  >
                    <MessageCircle size={20} /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Developer Section */}
        <section className="mt-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Meet the Mind</h3>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="w-48 h-48 rounded-[3rem] bg-indigo-50 dark:bg-indigo-900/20 overflow-hidden shrink-0 border-4 border-white dark:border-gray-800 shadow-2xl relative group">
              <img src="https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png" alt="Harsha Bacham" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 rounded-[2rem]" />
              <div className="absolute inset-0 bg-indigo-600/10 mix-blend-overlay"></div>
            </div>
            <div className="flex-grow space-y-6 text-center md:text-left">
              <div>
                <h4 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">Harsha Bacham</h4>
                <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em] mt-2">Lead Developer & Visionary</p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
                Passionate about building community-driven technologies that empower students and simplify campus life. Harsha is a full-stack engineer dedicated to creating elegant solutions for complex problems.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href="https://www.linkedin.com/in/harsha-bacham/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-blue-700 text-white rounded-xl shadow-lg hover:-translate-y-1 transition-all"><Linkedin size={20} /></a>
                <a href="https://github.com/harshabacham" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl shadow-lg hover:-translate-y-1 transition-all"><Github size={20} /></a>
                <a href="https://wa.me/917793914091" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-green-500 text-white rounded-xl shadow-lg hover:-translate-y-1 transition-all"><MessageCircle size={20} /></a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showScrollTop && !selectedNotif && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-24 right-8 z-[90] w-12 h-12 bg-primary-600 text-white rounded-xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all"><ArrowUp size={24} /></button>
      )}

      {selectedNotif && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-2xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">{notifCategory(selectedNotif.category)}</span>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{selectedNotif.timestamp}</p>
                 </div>
                 <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">{selectedNotif.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)} 
                className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-8 scrollbar-hide">
              {selectedNotif.media_url && selectedNotif.media_url.trim() !== "" && (
                <div className="rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10">
                  {isVideo(selectedNotif.media_url) ? (
                    <video controls autoPlay className="w-full aspect-video">
                      <source src={selectedNotif.media_url} />
                    </video>
                  ) : (
                    <img 
                      src={selectedNotif.media_url} 
                      alt="" 
                      className="w-full h-auto max-h-[60vh] object-contain mx-auto" 
                    />
                  )}
                </div>
              )}
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed whitespace-pre-wrap">
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
                className="flex-grow py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-95"
              >
                Close Notification
              </button>
            </div>
          </div>
          {/* Clickable Backdrop to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setSelectedNotif(null)}></div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </div>
  );
};

const notifCategory = (cat: any) => String(cat || 'Info').toUpperCase();

export default Home;
