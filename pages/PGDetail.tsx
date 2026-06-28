import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Users, ChevronLeft, ChevronRight,
  CheckCircle, Bookmark, Copy, MessageCircle,
  Home, Sparkles, AlertCircle, X, ExternalLink, Maximize2,
  Share2, ShieldCheck, Info, Play, Calendar, ShieldAlert
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { PGRoom } from '../types';
import { useBookmarks } from '../lib/bookmarks';
import { motion, AnimatePresence } from 'motion/react';
import { WarningGraphic } from '../components/ui/warning-graphic';

const PGDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<PGRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const { isPGBookmarked, togglePG } = useBookmarks();
  const [copiedOwner, setCopiedOwner] = useState(false);
  const [copiedRoommate, setCopiedRoommate] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxType, setLightboxType] = useState<'image' | 'video'>('image');
  const [direction, setDirection] = useState(0);

  // Prevent background scrolling cleanly when lightbox is active using fixed positioning lock
  useEffect(() => {
    if (lightboxOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [lightboxOpen]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (lightboxType === 'image') {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, lightboxIndex, lightboxType]);

  const cleanPhoneForWhatsApp = (num: string) => {
    if (!num) return '';
    const digits = num.replace(/\D/g, '');
    if (digits.length === 10) {
      return '91' + digits;
    }
    return digits;
  };

  const copyToClipboard = (text: string, isOwner: boolean) => {
    const firstNum = text.split(/[,/]+/)[0]?.trim() || text;
    navigator.clipboard.writeText(firstNum).then(() => {
      if (isOwner) {
        setCopiedOwner(true);
        setTimeout(() => setCopiedOwner(false), 2000);
      } else {
        setCopiedRoommate(true);
        setTimeout(() => setCopiedRoommate(false), 2000);
      }
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchCSV<PGRoom>(CSV_URLS.PG_ROOMS);
      const index = parseInt(id || '-1');
      if (index >= 0 && index < data.length) {
        setRoom(data[index]);
      }
      setLoading(false);
    };
    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#fe7f2d] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 animate-pulse font-display">Preparing listing presentation...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center px-4">
        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 p-6 rounded-[2rem] shadow-sm backdrop-blur-md">
          <WarningGraphic 
            width={260} 
            height={85} 
            color="#fe7f2d"
            enableAnimations={true}
          />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 font-display">Property Listing Unavailable</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The PG room listing you are trying to view does not exist or may have been archived.
          </p>
        </div>
        <button 
          onClick={() => navigate('/pg-rooms')}
          className="px-6 py-2.5 bg-[#fe7f2d] hover:bg-[#ee6517] text-white rounded-full text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          Return to PG Directory
        </button>
      </div>
    );
  }

  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=1200";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1600`;
    }
    return clean;
  };

  const getDirectVideoUrl = (urlOrId: any) => {
    if (!urlOrId) return "";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return clean;
  };

  const images = String(room.image_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);
  const videos = String(room.video_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);

  const openLightbox = (index: number, type: 'image' | 'video') => {
    setLightboxIndex(index);
    setLightboxType(type);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    if (lightboxType === 'image' && images.length > 0) {
      setDirection(1);
      setLightboxIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrev = () => {
    if (lightboxType === 'image' && images.length > 0) {
      setDirection(-1);
      setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getActiveMediaUrl = () => {
    if (lightboxType === 'image') {
      return getDirectImageUrl(images[lightboxIndex]);
    } else {
      return getDirectVideoUrl(videos[lightboxIndex]) || videos[lightboxIndex];
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 animate-in fade-in duration-500 pb-28 text-left">
      
      {/* Sleek Navigation & Actions Header (Balanced Layout, Fine Spacing) */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-900">
        <button 
          onClick={() => navigate('/pg-rooms')} 
          className="group flex items-center gap-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all"
        >
          <div className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-full shadow-sm group-hover:-translate-x-0.5 transition-transform">
            <ChevronLeft size={14} className="text-zinc-600 dark:text-zinc-300" />
          </div>
          <span className="hidden sm:inline font-sans uppercase tracking-wider text-[11px]">Back to Directory</span>
          <span className="sm:hidden font-sans text-[11px]">Back</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Share Action Button */}
          <button
            onClick={copyPageLink}
            className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-full shadow-sm text-zinc-500 hover:text-[#fe7f2d] dark:hover:text-[#fe7f2d] hover:bg-zinc-50/50 transition-all relative cursor-pointer"
            title="Copy Page Link"
          >
            {copiedShare ? <CheckCircle size={15} className="text-emerald-500" /> : <Share2 size={15} />}
            {copiedShare && (
              <span className="absolute -bottom-9 right-0 bg-zinc-950 text-white text-[10px] py-1 px-2.5 rounded-md shadow-lg whitespace-nowrap z-50 animate-in slide-in-from-top-1">
                Link Copied!
              </span>
            )}
          </button>

          {/* Icon-Only Bookmark Action Button (Removed word label as requested) */}
          <button
            onClick={() => togglePG(room, parseInt(id || '0'))}
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${
              isPGBookmarked(room.name)
              ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/40 shadow-sm'
              : 'bg-white dark:bg-zinc-900 border-zinc-200/50 dark:border-zinc-800/80 text-zinc-500 hover:text-rose-500 hover:bg-rose-50/30'
            }`}
            title={isPGBookmarked(room.name) ? 'Saved' : 'Save'}
          >
            <Bookmark size={15} className={isPGBookmarked(room.name) ? "fill-rose-500 text-rose-500 animate-bounce-once" : ""} />
          </button>
        </div>
      </div>

      {/* Hero Header Presentation Area (Polished White/Sand Light Theme & Zinc Dark Theme) */}
      <div className="bg-gradient-to-r from-white via-zinc-50/40 to-white dark:from-zinc-900/40 dark:via-zinc-950/20 dark:to-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/60 shadow-[0_4px_24px_rgba(0,0,0,0.01)] space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-[10px] font-extrabold tracking-wider uppercase rounded-md border border-zinc-200/30 dark:border-zinc-800/40">
            {room.gender || 'Co-living'}
          </span>
          <span className="px-3 py-1 bg-[#fe7f2d]/10 text-[#fe7f2d] text-[10px] font-extrabold tracking-wider uppercase rounded-md border border-[#fe7f2d]/10">
            {room.sharing || 'Any Sharing'}
          </span>
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/10 px-3 py-1 rounded-md text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{room.rating || '4.5'} Rating</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4.5xl font-black text-zinc-900 dark:text-white tracking-tight leading-none font-sans">
            {room.name}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1">
            <MapPin size={13} className="text-[#fe7f2d]" />
            <span>{room.address || room.location || "LPU Campus Area, Phagwara"}</span>
          </p>
        </div>
      </div>

      {/* Interactive Media Showcase Section - Integrated Premium Accordion Gallery */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 h-[260px] sm:h-[420px] w-full overflow-hidden rounded-3xl">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx, 'image')}
              className="relative group h-full flex-1 hover:flex-[4] sm:hover:flex-[6] transition-all duration-500 rounded-3xl overflow-hidden cursor-pointer border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm hover:shadow-lg bg-zinc-100 dark:bg-zinc-900"
            >
              <img
                src={getDirectImageUrl(img)}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                alt={`${room.name} view ${idx + 1}`}
                loading="lazy"
              />
              
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-85 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Zoom badge indicator */}
              <div className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                <Maximize2 size={12} className="text-[#fe7f2d]" />
              </div>

              {/* Bottom text details */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-end text-white select-none pointer-events-none">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#fe7f2d] bg-[#fe7f2d]/10 backdrop-blur-sm self-start px-2 py-0.5 rounded border border-[#fe7f2d]/20 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Room View {idx + 1}
                </p>
                <p className="text-[11px] font-extrabold text-white truncate max-w-[120px] sm:max-w-xs transition-transform duration-500 group-hover:translate-x-1">
                  {idx === 0 ? "Main Space View" : `Gallery Photo #${idx + 1}`}
                </p>
              </div>

              {/* Vertical indicator when not hovered */}
              <div className="absolute inset-y-0 left-0 flex items-center justify-center w-full group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                <span className="text-[9px] font-bold text-white/50 tracking-[0.2em] uppercase [writing-mode:vertical-lr] rotate-180">
                  Photo {idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Helper caption */}
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center font-sans tracking-wide">
          ✨ Hover or tap on any picture to expand, or click to launch fullscreen immersive gallery ({images.length} photos)
        </p>
      </div>

      {/* Structured Bento Grid layout for specifications (Premium Light Aesthetics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Rental Info */}
        <div className="bg-gradient-to-br from-white to-amber-50/10 dark:from-zinc-900/30 dark:to-zinc-900/10 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-sans">Monthly Rent</p>
            <p className="text-3xl font-black text-[#fe7f2d] tracking-tight mt-1">₹{room.rent}</p>
          </div>
          <div className="h-[1.5px] bg-zinc-100 dark:bg-zinc-850" />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            All conveniences inclusive as designated by the owner.
          </p>
        </div>

        {/* Card 2: PG Class Type */}
        <div className="bg-gradient-to-br from-white to-zinc-50/40 dark:from-zinc-900/30 dark:to-zinc-900/10 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-sans">Property Class</p>
            <p className="text-lg font-extrabold text-zinc-850 dark:text-zinc-100 tracking-tight mt-1 flex items-center gap-2">
              <Home size={18} className="text-[#fe7f2d] shrink-0" />
              <span className="truncate">{room.pg_type || 'Premium PG'}</span>
            </p>
          </div>
          <div className="h-[1.5px] bg-zinc-100 dark:bg-zinc-850" />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Specially structured layout customized for LPU students.
          </p>
        </div>

        {/* Card 3: Realtime Vacancy Status */}
        <div className="bg-gradient-to-br from-white to-emerald-50/10 dark:from-zinc-900/30 dark:to-emerald-950/5 p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-sans">Live Availability</p>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1 flex items-center gap-1.5">
              <CheckCircle size={18} className="text-emerald-500 shrink-0" />
              <span>{Math.max(0, parseInt(room.total_capacity || '0') - parseInt(room.current_occupancy || '0'))} Slots Available</span>
            </p>
          </div>
          <div className="h-[1.5px] bg-zinc-100 dark:bg-zinc-850" />
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
            Updated in real-time. Secure and lock your slot today!
          </p>
        </div>

      </div>

      {/* Description & Overview Section */}
      <div className="bg-white dark:bg-zinc-900/30 p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#fe7f2d] flex items-center gap-1.5 font-sans">
          <Sparkles size={14} /> Description & Overview
        </h3>
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-xs sm:text-sm">
          {room.description || "Beautiful premium student accommodation located closely to the LPU campus. Offering superb student environments, well-ventilated rooms, power-backup systems, high-speed Wi-Fi, and laundry services."}
        </p>
      </div>

      {/* Included Amenities Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-sans pl-1">Included Amenities & Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {room.amenities && String(room.amenities).split(',').map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 p-4 bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-1 bg-amber-500/10 rounded-lg shrink-0">
                <CheckCircle size={13} className="text-[#fe7f2d]" />
              </div>
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{item.trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verified WhatsApp Only Contacts Directory (Light mode focused) */}
      <div className="p-6 sm:p-8 bg-emerald-50/20 dark:bg-zinc-900/20 rounded-3xl border border-emerald-200/30 dark:border-zinc-800/60 space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 font-sans">
            <ShieldCheck className="text-emerald-500" size={18} /> Verified WhatsApp Directory Only
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            For streamlined communications and safety, bookings and roommate matching inquiries are managed strictly via verified WhatsApp channels. Direct calling is disabled.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Owner/Administrator Card */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between space-y-4 shadow-sm hover:border-emerald-500/20 transition-all">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PG Owner / Caretaker</h4>
                <p className="text-xs font-extrabold text-zinc-850 dark:text-zinc-100 mt-1">{room.kitchen_security_ac || 'Not Registered'}</p>
              </div>
            </div>

            {room.kitchen_security_ac ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a 
                  href={`https://wa.me/${cleanPhoneForWhatsApp(room.kitchen_security_ac)}?text=${encodeURIComponent(`Hi! I saw your PG "${room.name}" on LPU Marketplace and am interested in checking availability.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <button 
                  onClick={() => copyToClipboard(room.kitchen_security_ac, true)}
                  className="py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-850 dark:text-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedOwner ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedOwner ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No contact details registered.</p>
            )}
          </div>

          {/* Roommate/Co-living Matching Card */}
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 flex flex-col justify-between space-y-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-[#fe7f2d]/10 text-[#fe7f2d] rounded-full flex items-center justify-center shrink-0">
                  <Users size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Roommate Matching</h4>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                    {String(room.is_looking_for_roommate).toLowerCase() === 'true' 
                      ? 'Looking for a flatmate' 
                      : 'No active roommate requests'}
                  </p>
                </div>
              </div>
              {String(room.is_looking_for_roommate).toLowerCase() === 'true' && room.roommate_message && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic line-clamp-2 leading-relaxed pl-1">
                  "{room.roommate_message}"
                </p>
              )}
            </div>

            {String(room.is_looking_for_roommate).toLowerCase() === 'true' && room.roommate_contact_number ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <a 
                  href={`https://wa.me/${cleanPhoneForWhatsApp(room.roommate_contact_number)}?text=${encodeURIComponent(`Hi! I saw your roommate posting for "${room.name}" on LPU Marketplace and would love to connect.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <button 
                  onClick={() => copyToClipboard(room.roommate_contact_number, false)}
                  className="py-2.5 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-850 dark:text-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedRoommate ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  <span>{copiedRoommate ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">No active roommate requests.</p>
            )}
          </div>

        </div>
      </div>

      {/* Video Walkthrough Preview Card */}
      {videos.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-sans pl-1">Video Walkthrough</h2>
          {videos.map((vid, i) => (
            <div 
              key={i} 
              onClick={() => openLightbox(i, 'video')}
              className="group aspect-video rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer relative shadow-md"
            >
              <img 
                src={getDirectImageUrl(vid)} 
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-all duration-700 group-hover:scale-[1.02] z-0"
                alt="Video Walkthrough Thumbnail"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=1200";
                }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 z-10" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-20">
                <span className="w-14 h-14 bg-[#fe7f2d] hover:bg-[#ee6517] text-white rounded-full flex items-center justify-center shadow-xl transform scale-100 group-hover:scale-105 transition-transform duration-300">
                  <Play size={20} className="fill-white text-white ml-0.5" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-white uppercase tracking-wider font-sans">Launch Video Walkthrough</p>
                  <p className="text-[10px] text-zinc-300 mt-1 max-w-xs mx-auto">
                    View the fully responsive walkthrough tour directly.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Elegant Sandboxed Lightbox System (Extremely Smooth, Zero Page Scrolling, Stunning Dark Glass) */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/95 z-[99999] flex flex-col justify-between p-4 sm:p-6 backdrop-blur-3xl select-none overflow-hidden touch-none"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            
            {/* Lightbox Header Bar */}
            <div className="w-full max-w-4xl mx-auto flex items-center justify-between py-3 border-b border-white/10 z-50">
              <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">
                {lightboxType === 'image' ? `Photo ${lightboxIndex + 1} of ${images.length}` : `Interactive Video walk-through`}
              </span>
              <div className="flex items-center gap-3">
                {/* Core secure access handle to launch direct source paths easily */}
                <a 
                  href={getActiveMediaUrl()} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-4 py-1.5 bg-[#fe7f2d] hover:bg-[#ee6517] text-white text-[11px] font-bold rounded-full flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                  title="Open the cloud source path directly"
                >
                  <ExternalLink size={12} />
                  <span className="hidden sm:inline">Open Original Link</span>
                  <span className="sm:hidden">Open</span>
                </a>
                <button 
                  onClick={() => setLightboxOpen(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Core Media Display Screen */}
            <div className="relative flex-grow w-full max-w-5xl mx-auto flex items-center justify-center p-2 sm:p-6 my-auto">
              
              {/* Left controller arrow */}
              {lightboxType === 'image' && images.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-2 sm:left-4 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 text-white rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-md z-50 cursor-pointer border border-white/10 shadow-xl"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {/* Stage element container with Framer Motion slide effects */}
              <div className="relative max-h-[70vh] w-full max-w-3xl flex items-center justify-center overflow-hidden py-4 px-2">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  {lightboxType === 'image' ? (
                    <motion.div
                      key={lightboxIndex}
                      custom={direction}
                      variants={{
                        enter: (dir) => ({
                          x: dir > 0 ? 250 : -250,
                          opacity: 0,
                          scale: 0.95
                        }),
                        center: {
                          x: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 28
                          }
                        },
                        exit: (dir) => ({
                          x: dir < 0 ? 250 : -250,
                          opacity: 0,
                          scale: 0.95,
                          transition: {
                            duration: 0.15
                          }
                        })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.5}
                      onDragEnd={(e, info) => {
                        if (info.offset.x < -60) {
                          handleNext();
                        } else if (info.offset.x > 60) {
                          handlePrev();
                        }
                      }}
                      className="cursor-grab active:cursor-grabbing select-none max-h-[66vh] flex items-center justify-center"
                    >
                      <img 
                        src={getActiveMediaUrl()} 
                        draggable="false"
                        className="max-h-[64vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" 
                        alt="PG Room View"
                        onError={(e) => {
                          const target = e.target as HTMLElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'p-8 text-center text-zinc-300 space-y-4 max-w-sm bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl';
                            fallback.innerHTML = `
                              <p class="text-sm font-bold">🔒 Folder Restrictions Policy</p>
                              <p class="text-xs text-zinc-400">This item is securely hosted on LPU cloud directories. Tap below to launch high-resolution view:</p>
                              <a href="${getActiveMediaUrl()}" target="_blank" class="inline-block px-5 py-2.5 bg-[#fe7f2d] text-white text-xs font-bold rounded-full shadow-lg transition-transform hover:scale-105">View File on Google Drive</a>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full aspect-video max-h-[68vh] min-w-[310px] sm:min-w-[620px] rounded-2xl overflow-hidden shadow-2xl bg-zinc-900 border border-white/10 relative">
                      <iframe 
                        src={getActiveMediaUrl()} 
                        className="w-full h-full border-0" 
                        allowFullScreen
                        title="Walkthrough Video Player"
                      ></iframe>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right controller arrow */}
              {lightboxType === 'image' && images.length > 1 && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-2 sm:right-4 p-3.5 bg-zinc-900/60 hover:bg-zinc-800/80 text-white rounded-full transition-all hover:scale-105 active:scale-95 backdrop-blur-md z-50 cursor-pointer border border-white/10 shadow-xl"
                  aria-label="Next Photo"
                >
                  <ChevronRight size={22} />
                </button>
              )}
            </div>

            {/* Bottom Thumbnails navigation ribbon */}
            {lightboxType === 'image' && images.length > 1 && (
              <div className="w-full max-w-4xl mx-auto overflow-x-auto pb-4 pt-2 flex justify-center gap-2.5 z-50 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setDirection(idx > lightboxIndex ? 1 : -1);
                      setLightboxIndex(idx);
                    }}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      lightboxIndex === idx ? 'border-[#fe7f2d] scale-105 shadow-md shadow-[#fe7f2d]/20' : 'border-white/10 opacity-40 hover:opacity-100 hover:scale-102'
                    }`}
                  >
                    <img src={getDirectImageUrl(img)} className="w-full h-full object-cover" alt="" />
                  </button>
                ))}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default PGDetail;
