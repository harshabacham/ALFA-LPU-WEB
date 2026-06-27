
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bed, MapPin, Star, Users, ChevronLeft, Navigation,
  PlayCircle, CheckCircle, Phone, Heart, Share2, 
  ShieldCheck, Info, ArrowRight, Bookmark
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { PGRoom } from '../types';
import { useBookmarks } from '../lib/bookmarks';

const PGDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<PGRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const { isPGBookmarked, togglePG } = useBookmarks();

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

  if (loading) return <div className="py-40 text-center text-gray-400 animate-pulse font-medium">Loading property details...</div>;
  if (!room) return <div className="py-40 text-center">Property not found.</div>;

  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=1200";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`;
    return clean;
  };

  const images = String(room.image_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);
  const videos = String(room.video_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500 pb-32 text-left">
      {/* Navigation and Bookmarks */}
      <div className="flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/pg-rooms')} 
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft size={18} /> Back to Listings
        </button>
        <button
          onClick={() => togglePG(room, parseInt(id || '0'))}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            isPGBookmarked(room.name)
            ? 'bg-red-500/10 border-red-500/20 text-red-600'
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
          style={{ minHeight: '44px' }}
        >
          <Bookmark size={15} className={isPGBookmarked(room.name) ? "fill-red-500 text-red-500" : ""} />
          <span>{isPGBookmarked(room.name) ? 'Saved' : 'Save PG'}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">{room.name}</h1>
            <div className="flex items-center gap-1.5 font-bold text-base sm:text-lg shrink-0 bg-gray-50 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-800 w-fit">
              <Star size={18} className="fill-amber-400 text-amber-400" /> {room.rating}
            </div>
          </div>
          <p className="flex items-center gap-2 text-gray-500 font-medium text-sm sm:text-base">
            <MapPin size={18} className="text-primary-500 shrink-0" /> {room.address}
          </p>
        </div>

        {/* Simplified Image Gallery */}
        <div className="grid grid-cols-1 gap-4">
          <img 
            src={getDirectImageUrl(images[0])} 
            className="w-full aspect-[16/9] object-cover rounded-2xl shadow-sm" 
            alt={room.name} 
          />
          {images.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.slice(1, 5).map((img, i) => (
                <img key={i} src={getDirectImageUrl(img)} className="w-full aspect-square object-cover rounded-xl border border-gray-100 dark:border-gray-800" alt="" />
              ))}
            </div>
          )}
        </div>

        {/* Specs Table Layout */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 py-6 md:py-8 border-y border-gray-100 dark:border-gray-800">
           <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Rent</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">₹{room.rent}</p>
           </div>
           <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accommodation</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate" title={room.pg_type}>{room.pg_type}</p>
           </div>
           <div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Slots</p>
              <p className="text-lg sm:text-2xl font-bold text-primary-600 dark:text-primary-450">
                {Math.max(0, parseInt(room.total_capacity || '0') - parseInt(room.current_occupancy || '0'))} Left
              </p>
           </div>
        </div>

        {/* Desktop & Tablet Inline Action Bar (Hidden on Mobile, where sticky is used) */}
        <div className="hidden sm:flex p-6 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-2xl items-center justify-between gap-6">
          <div className="space-y-1">
             <h3 className="font-bold text-gray-900 dark:text-white text-base">Book a Tour / Inquiry</h3>
             <p className="text-sm text-gray-500">Contact the PG administrator directly to check availability.</p>
          </div>
          <div className="flex gap-3">
             <a 
               href={`tel:${room.kitchen_security_ac}`} 
               className="px-5 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-md"
             >
               <Phone size={16} /> Call Owner
             </a>
             <a 
               href={room.location_url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="px-5 py-3 bg-gray-150 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-900 dark:text-white text-sm font-bold rounded-xl flex items-center gap-2 transition-all"
             >
               <Navigation size={16} /> Locate Map
             </a>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">About this PG</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
            {room.description}
          </p>
        </div>

        {/* Amenities Bullet List */}
        <div className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {room.amenities && String(room.amenities).split(',').map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <CheckCircle size={18} className="text-primary-600 shrink-0" />
                <span className="text-sm sm:text-base">{item.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tour (If Available) */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Video Walkthrough</h2>
            {videos.map((vid, i) => (
              <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-black border border-gray-100 dark:border-gray-800">
                <iframe 
                  src={String(vid).includes('/d/') ? `https://drive.google.com/file/d/${String(vid).match(/\/d\/([a-zA-Z0-9_-]{25,})/)?.[1]}/preview` : vid} 
                  className="w-full h-full" 
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        )}

        {/* Roommate Section (Simplified) */}
        {String(room.is_looking_for_roommate).toLowerCase() === 'true' && (
          <div className="p-6 sm:p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 space-y-4">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
              <Heart size={20} /> Looking for Roommate
            </h3>
            <p className="text-blue-700 dark:text-blue-300 italic text-sm sm:text-base">"{room.roommate_message}"</p>
            <div className="pt-2">
               <a href={`tel:${room.roommate_contact_number}`} className="text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-750 px-5 py-2.5 rounded-lg inline-block transition-colors">Contact Potential Roommate</a>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Mobile Floating Action Bar (Only visible on mobile screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-3">
          <a 
            href={`tel:${room.kitchen_security_ac}`} 
            className="flex-grow flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-md text-sm"
          >
            <Phone size={16} /> Call Owner
          </a>
          <a 
            href={room.location_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center p-3.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl"
          >
            <Navigation size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PGDetail;
