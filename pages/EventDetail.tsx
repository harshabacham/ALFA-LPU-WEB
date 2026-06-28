import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, ExternalLink, Share2, 
  CalendarPlus, User, Info, 
  Bookmark, Check, Sparkles, ChevronLeft
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Event } from '../types';
import { useBookmarks } from '../lib/bookmarks';
import { motion } from 'framer-motion';
import { WarningGraphic } from '../components/ui/warning-graphic';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const { isEventBookmarked, toggleEvent } = useBookmarks();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCSV<Event>(CSV_URLS.EVENTS);
      const index = parseInt(id || '-1');
      if (index >= 0 && index < data.length) {
        setEvent(data[index]);
      }
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"
      />
      <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest font-display animate-pulse">
        Assembling Event Intelligence...
      </p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 text-center space-y-6">
       <div className="bg-zinc-150/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 p-6 rounded-[2rem] shadow-sm backdrop-blur-md">
         <WarningGraphic 
           width={260} 
           height={85} 
           color="#fe7f2d"
           enableAnimations={true}
         />
       </div>
       <div className="space-y-2">
         <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight font-display">
           Event Not Found
         </h1>
         <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-sm font-medium">
           The campus event you are seeking does not exist or has completed.
         </p>
       </div>
       <button 
         onClick={() => navigate('/events')} 
         className="px-6 py-3 bg-[#fe7f2d] hover:bg-[#ee6517] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-md cursor-pointer"
       >
         Return to Events Hub
       </button>
    </div>
  );

  const cleanPrice = event.price?.trim() || 'Free';
  const isFree = cleanPrice.toLowerCase() === 'free' || cleanPrice === '0' || cleanPrice === '₹0';

  const formatCalendarDate = (dateStr: string, timeStr: string) => {
    try {
      const cleanDate = dateStr.replace(/[^0-9]/g, ''); 
      const timeMatch = timeStr.match(/(\d+):(\d+)/);
      let hour = '10';
      let minute = '00';
      if (timeMatch) {
        hour = timeMatch[1].padStart(2, '0');
        minute = timeMatch[2].padStart(2, '0');
      }
      return `${cleanDate}T${hour}${minute}00Z`;
    } catch (e) {
      return "20261231T100000Z";
    }
  };

  const getGoogleCalendarUrl = (e: Event) => {
    const start = formatCalendarDate(e.date, e.time);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: e.title,
      dates: `${start}/${start}`,
      details: `${e.description}\n\nOrganizer: ${e.organizer}`,
      location: e.venue
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const copyLink = () => {
    const shareUrl = window.location.origin + window.location.pathname + window.location.hash;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareUrl = window.location.origin + window.location.pathname + window.location.hash;
        await navigator.share({
          title: event.title,
          text: event.description,
          url: shareUrl,
        });
      } catch (err) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 text-left transition-colors duration-200 relative overflow-hidden">
      
      {/* Dark Mode Ambient Backdrop Spotlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/25 rounded-full blur-[120px] pointer-events-none hidden dark:block" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-[150px] pointer-events-none hidden dark:block" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none hidden dark:block" />

      {/* 2. Main Grid Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pt-6 relative z-10">
        


        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 units) - High Fidelity Description & Actions */}
          <div className="lg:col-span-8 space-y-6">

            {/* Main Title Banner & Hero Card */}
            <div className="bg-white/90 dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(254,127,45,0.03)] border border-zinc-200/60 dark:border-zinc-800/80 overflow-hidden">
              <div className="p-1">
                <div className="aspect-[21/9] w-full rounded-[2.2rem] overflow-hidden bg-zinc-950 relative">
                  <img 
                    src={event.image_url || null} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200";
                    }}
                  />
                  
                  {/* Vignette Overlay for Image readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-zinc-950/40" />

                  {/* Left Side Category Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1.5 bg-zinc-950/85 backdrop-blur-md text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-zinc-800/80 flex items-center gap-1.5 shadow-lg">
                      <Sparkles size={11} className="text-amber-400 animate-pulse" />
                      <span>SPOTLIGHT EXCLUSIVE</span>
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg ${
                      isFree 
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                      : 'bg-primary-500/20 text-primary-400 border-primary-500/40'
                    }`}>
                      {isFree ? 'FREE ACCESS' : 'PREMIUM'}
                    </span>
                  </div>

                  {/* Right Side Bookmarking and Share Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {/* Event Bookmarking */}
                    <button 
                      onClick={() => toggleEvent(event, parseInt(id || '0'))}
                      className={`p-2.5 rounded-xl border transition-all duration-300 shadow-md cursor-pointer backdrop-blur-md ${
                        isEventBookmarked(event.title) 
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-amber-500/25' 
                        : 'bg-zinc-950/85 text-zinc-400 hover:text-primary-500 hover:border-primary-500/50 border-zinc-850 shadow-black/20'
                      }`}
                      id="event-detail-bookmark-button"
                      title={isEventBookmarked(event.title) ? "Remove Saved" : "Save Event"}
                    >
                      <Bookmark size={15} className={isEventBookmarked(event.title) ? "fill-amber-400 text-amber-400" : ""} />
                    </button>
                    
                    {/* Share Action */}
                    <button 
                      onClick={handleShare}
                      className="p-2.5 bg-zinc-950/85 border border-zinc-850 backdrop-blur-md rounded-xl text-zinc-400 hover:text-primary-500 hover:border-primary-500/50 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
                      id="event-detail-share-button"
                      title="Share event details"
                    >
                      {copied ? <Check size={15} className="text-emerald-400" /> : <Share2 size={15} />}
                    </button>
                  </div>

                </div>
              </div>

              {/* Title & Metadata Body */}
              <div className="px-6 py-8 md:p-10 space-y-6">
                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white leading-tight font-display tracking-tight uppercase">
                    {event.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-semibold pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-500/20 dark:bg-primary-500/30 flex items-center justify-center font-black text-[10px] text-primary-500 dark:text-primary-400 border border-primary-500/20">
                        {event.organizer?.charAt(0) || 'L'}
                      </div>
                      <span>Hosted by <strong className="text-zinc-800 dark:text-zinc-150 font-black">{event.organizer || "LPU Student Council"}</strong></span>
                    </div>
                    <span className="text-zinc-300 dark:text-zinc-800">•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-primary-500 dark:text-primary-400" />
                      <span>{event.date}</span>
                    </span>
                  </div>
                </div>

                {/* Styled Event Detailed Description */}
                <div className="border-t border-zinc-150 dark:border-zinc-800/60 pt-6 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px] font-black">
                    <Info size={14} className="text-primary-500 dark:text-primary-400" />
                    <span>OVERVIEW & INFO</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-line font-medium">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (4 units) - Admission Stub & Event Facts List */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick RSVP Admissions box (Ticket Stub style) */}
            <div className="bg-white/95 dark:bg-zinc-900/60 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/80 rounded-[2.5rem] p-6 shadow-xl dark:shadow-[0_20px_50px_rgba(254,127,45,0.06)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/20 blur-2xl rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />
              
              <div className="space-y-5">
                <div className="pb-4 text-center">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">ADMISSION CATEGORY</span>
                  <div className="text-4xl font-black bg-gradient-to-r from-primary-500 via-amber-500 to-primary-600 dark:from-primary-400 dark:via-amber-300 dark:to-primary-500 bg-clip-text text-transparent font-display mt-1.5 uppercase tracking-tight drop-shadow-xs">
                    {isFree ? 'Free Admission' : cleanPrice}
                  </div>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-1.5 block tracking-wider">LPU Student Badge Clearance Required</span>
                </div>

                {/* Realistic Ticket Stub Dotted Tear-off Divider */}
                <div className="relative border-t-2 border-dashed border-zinc-100 dark:border-zinc-800/80 my-5">
                  <div className="absolute -left-9 -top-2.5 w-5 h-5 rounded-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200/60 dark:border-zinc-800/80" />
                  <div className="absolute -right-9 -top-2.5 w-5 h-5 rounded-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200/60 dark:border-zinc-800/80" />
                </div>

                {/* Primary Action Button */}
                <a 
                  href={event.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 bg-gradient-to-r from-primary-500 via-primary-600 to-amber-500 hover:from-primary-600 hover:via-primary-700 hover:to-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 dark:shadow-primary-500/10 hover:-translate-y-0.5 hover:scale-[1.01] active:scale-95 cursor-pointer text-center"
                  id="event-detail-primary-register-link"
                >
                  <span>Register on Portal</span>
                  <ExternalLink size={14} className="shrink-0 animate-pulse" />
                </a>

                {/* Facts List with clean custom icons */}
                <div className="space-y-4 pt-4 border-t border-zinc-150 dark:border-zinc-800/60">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">EVENT COORDINATES</span>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 dark:text-primary-400 rounded-xl shrink-0 border border-primary-500/20 dark:border-primary-500/30 shadow-xs">
                        <Calendar size={15} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">DATE</p>
                        <p className="text-xs font-black text-zinc-800 dark:text-zinc-250">{event.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 dark:text-primary-400 rounded-xl shrink-0 border border-primary-500/20 dark:border-primary-500/30 shadow-xs">
                        <Clock size={15} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">TIME</p>
                        <p className="text-xs font-black text-zinc-800 dark:text-zinc-250">{event.time || "10:00 AM"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 dark:text-primary-400 rounded-xl shrink-0 border border-primary-500/20 dark:border-primary-500/30 shadow-xs">
                        <MapPin size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">CAMPUS VENUE</p>
                        <p className="text-xs font-black text-zinc-800 dark:text-zinc-250 truncate" title={event.venue}>{event.venue}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 dark:text-primary-400 rounded-xl shrink-0 border border-primary-500/20 dark:border-primary-500/30 shadow-xs">
                        <User size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none mb-1">CAMPUS ORGANIZER</p>
                        <p className="text-xs font-black text-zinc-800 dark:text-zinc-250 truncate" title={event.organizer || "LPU Student Council"}>{event.organizer || "LPU Student Council"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Sync Section */}
                <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800/60 space-y-2">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-2 text-center">SYNC SCHEDULE</span>
                  
                  <div className="flex">
                    <a 
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-3 bg-primary-500/10 hover:bg-primary-500/20 dark:bg-primary-500/10 dark:hover:bg-primary-500/25 border border-primary-500/20 dark:border-primary-500/40 rounded-xl text-[9.5px] font-black uppercase tracking-widest text-primary-650 dark:text-primary-400 transition-all duration-300 cursor-pointer text-center"
                    >
                      <CalendarPlus size={11} className="text-primary-500 dark:text-primary-400" />
                      <span>Sync Google Calendar</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Integrity & Guidelines checklist */}
            <div className="bg-white/95 dark:bg-zinc-900/60 dark:backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/80 rounded-[2.5rem] p-6 shadow-md dark:shadow-black/10 space-y-4">
              <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">ADMISSION GUIDELINES</span>
              
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400 font-semibold leading-relaxed">
                <li className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-1.5 shrink-0" />
                  <span>Always bring your official physical university ID Card.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-1.5 shrink-0" />
                  <span>Arrive at least 15-20 minutes early for gate checking and registration roll checks.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 mt-1.5 shrink-0" />
                  <span>Bookmark this page to save this event to your personal saved checklist.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
