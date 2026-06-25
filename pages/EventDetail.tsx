
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, ExternalLink, Share2, 
  ChevronLeft, CalendarPlus, Download, User, Info, 
  Ticket, ArrowRight, Bookmark, Copy, Check, Sparkles
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Event } from '../types';
import { useBookmarks } from '../lib/bookmarks';

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
      <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest">Gathering intelligence...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-6 text-center">
       <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
         <Info size={28} />
       </div>
       <h1 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Event Not Found</h1>
       <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-2 mb-6 max-w-sm">The event you are looking for doesn't exist or has been archived.</p>
       <button onClick={() => navigate('/events')} className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-wider transition-transform active:scale-95">Return to Events</button>
    </div>
  );

  const formatCalendarDate = (dateStr: string, timeStr: string) => {
    try {
      const cleanDate = dateStr.replace(/-/g, '');
      const cleanTime = timeStr.replace(/[:\s]/g, '').slice(0, 4);
      return `${cleanDate}T${cleanTime}00Z`;
    } catch (e) {
      return "";
    }
  };

  const getGoogleCalendarUrl = (e: Event) => {
    const start = formatCalendarDate(e.date, e.time);
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: e.title,
      dates: `${start}/${start}`,
      details: `${e.description}\n\nOrganized by: ${e.organizer}`,
      location: e.venue
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const downloadIcs = (e: Event) => {
    const start = formatCalendarDate(e.date, e.time);
    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `DTSTART:${start}`, `DTEND:${start}`, `SUMMARY:${e.title}`,
      `DESCRIPTION:${e.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${e.venue}`, 'END:VEVENT', 'END:VCALENDAR'
    ].join('\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${e.title.replace(/\s+/g, '_')}.ics`);
    link.click();
  };

  const copyLink = () => {
    const shareUrl = window.location.origin + window.location.pathname + window.location.hash;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share && event) {
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 text-left">
      {/* Sticky Top Action Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/60 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Back button */}
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-primary-500 font-extrabold text-xs uppercase tracking-wider transition-all"
          >
            <ChevronLeft size={16} /> Back to hub
          </button>

          {/* Action Hub */}
          <div className="flex items-center gap-2">
            
            {/* Quick RSVP Button in Nav Bar */}
            <a 
              href={event.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-95 cursor-pointer"
            >
              <span>Register Instantly</span>
              <ArrowRight size={14} className="shrink-0" />
            </a>

            {/* Quick Calendar Dropdown */}
            <div className="relative group">
              <button 
                className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300 transition-all shadow-sm"
              >
                <CalendarPlus size={15} className="text-primary-500 shrink-0" />
                <span className="hidden md:inline">Add to Calendar</span>
              </button>
              
              {/* Dropdown Menu on Hover */}
              <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 rounded-xl shadow-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a 
                  href={getGoogleCalendarUrl(event)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-primary-500"
                >
                  Google Calendar
                </a>
                <button 
                  onClick={() => downloadIcs(event)}
                  className="w-full block px-4 py-2 text-left text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-primary-500"
                >
                  Outlook / ICS File
                </button>
              </div>
            </div>

            {/* Bookmark */}
            <button 
              onClick={() => event && toggleEvent(event, parseInt(id || '0'))}
              className={`p-2.5 rounded-xl border transition-all shadow-sm ${
                event && isEventBookmarked(event.title) 
                ? 'text-amber-500 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10' 
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
              title={event && isEventBookmarked(event.title) ? "Remove Bookmark" : "Bookmark Event"}
            >
              <Bookmark size={15} className={event && isEventBookmarked(event.title) ? "fill-amber-500 text-amber-500" : ""} />
            </button>
            
            {/* Share */}
            <button 
              onClick={handleShare}
              className="p-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"
              title="Share Event"
            >
              {copied ? <Check size={15} className="text-green-500" /> : <Share2 size={15} />}
            </button>
          </div>

        </div>
      </div>

      {/* Dynamic blurred hero backdrop (gives cinema effect) */}
      <div className="relative h-48 md:h-56 overflow-hidden w-full select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 dark:opacity-20 scale-110"
          style={{ backgroundImage: `url(${event.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/50 to-zinc-50 dark:via-zinc-950/50 dark:to-zinc-950" />
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 -mt-24 md:-mt-28 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Rich poster display & descriptive body */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Visual Header Poster */}
            <div className="aspect-[16/9] w-full rounded-[2rem] overflow-hidden bg-zinc-200 dark:bg-zinc-900 shadow-2xl border-4 border-white dark:border-zinc-900 relative group">
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700" 
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-zinc-950/80 text-white backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-400 animate-spin" /> Featured Campus Event
                </span>
              </div>
            </div>

            {/* Title & Detailed Information */}
            <div className="bg-white dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
              <div className="space-y-2">
                <h1 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
                  {event.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span>Organized by</span>
                  <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{event.organizer}</span>
                </div>
              </div>

              <div className="border-t border-zinc-200/50 dark:border-zinc-800/60 pt-5 space-y-3">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info size={14} className="text-primary-500" /> Event Description
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                  {event.description}
                </p>
              </div>
            </div>

          </div>

          {/* Right Side: Quick facts sidebar (no redundant registration buttons!) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Quick RSVP Details Box */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden text-left space-y-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-2xl rounded-full pointer-events-none" />
              
              <div className="space-y-4.5">
                <div className="border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Admission</span>
                  <div className="text-xl font-black text-primary-500 font-display mt-1">
                    {event.price && !isNaN(Number(event.price.replace(/[^\d]/g, ''))) 
                      ? `₹${event.price}` 
                      : event.price || 'Free Admission'
                    }
                  </div>
                </div>

                {/* Grid of facts */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl shrink-0">
                      <Calendar size={15} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Date</p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl shrink-0">
                      <Clock size={15} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Time</p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl shrink-0">
                      <MapPin size={15} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Venue</p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{event.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl shrink-0">
                      <User size={15} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Host</p>
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{event.organizer}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-3">
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-950 dark:hover:bg-zinc-900 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-500 transition-all border border-zinc-200/30 dark:border-zinc-800/30"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-green-500" /> Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={12} /> Share event link
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
