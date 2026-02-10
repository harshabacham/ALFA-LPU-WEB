
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Clock, ExternalLink, Share2, 
  ChevronLeft, CalendarPlus, Download, User, Info, 
  Ticket, ArrowRight, ChevronRight
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Event } from '../types';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 text-sm font-medium tracking-wide">Loading details...</p>
    </div>
  );

  if (!event) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 text-center">
       <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h1>
       <p className="text-gray-500 mt-2 mb-8">The event you are looking for doesn't exist or has been removed.</p>
       <button onClick={() => navigate('/events')} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm transition-transform active:scale-95">Return to Hub</button>
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
        console.error("Error sharing event details:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-semibold text-sm transition-colors"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <button 
            onClick={handleShare}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full">
                  <Calendar size={16} className="text-primary-500" /> {event.date}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full">
                  <Clock size={16} className="text-primary-500" /> {event.time}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-full">
                  <MapPin size={16} className="text-primary-500" /> {event.venue}
                </div>
              </div>
            </div>

            {/* Main Poster */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-sm">
              <img 
                src={event.image_url} 
                alt={event.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Info size={20} className="text-primary-500" /> About the Event
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Organizer Section */}
            <div className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Organized By</p>
                <h4 className="font-bold text-gray-900 dark:text-white">{event.organizer}</h4>
              </div>
            </div>
          </div>

          {/* Sidebar / Registration Area */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              
              {/* Registration Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Entry Fee</span>
                  <div className="text-2xl font-extrabold text-primary-600">₹{event.price || 'Free'}</div>
                </div>

                <div className="space-y-3">
                  <a 
                    href={event.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-primary-500/20"
                  >
                    Register Now <ArrowRight size={18} />
                  </a>
                  <p className="text-[10px] text-center text-gray-400 font-medium">Clicking above will redirect you to the official portal.</p>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarPlus size={14} className="text-primary-500" /> Save to Calendar
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={getGoogleCalendarUrl(event)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-all"
                    >
                      Google
                    </a>
                    <button 
                      onClick={() => downloadIcs(event)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-all"
                    >
                      Outlook
                    </button>
                  </div>
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
