
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Bed, MapPin, Star, Users, ChevronLeft, Navigation,
  PlayCircle, CheckCircle, Phone, Heart, Share2, 
  ShieldCheck, Info, ArrowRight
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { PGRoom } from '../types';

const PGDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<PGRoom | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10 animate-in fade-in duration-500 pb-32">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/pg-rooms')} 
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft size={18} /> Back to Listings
      </button>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{room.name}</h1>
            <div className="flex items-center gap-1.5 font-bold text-lg">
              <Star size={20} className="fill-gray-900 dark:fill-white" /> {room.rating}
            </div>
          </div>
          <p className="flex items-center gap-2 text-gray-500 font-medium">
            <MapPin size={18} /> {room.address}
          </p>
        </div>

        {/* Simplified Image Gallery */}
        <div className="grid grid-cols-1 gap-4">
          <img 
            src={getDirectImageUrl(images[0])} 
            className="w-full aspect-[16/9] object-cover rounded-2xl shadow-sm" 
            alt={room.name} 
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.slice(1, 5).map((img, i) => (
              <img key={i} src={getDirectImageUrl(img)} className="w-full aspect-square object-cover rounded-xl border border-gray-100 dark:border-gray-800" alt="" />
            ))}
          </div>
        </div>

        {/* Specs Table Layout */}
        <div className="grid sm:grid-cols-3 gap-8 py-8 border-y border-gray-100 dark:border-gray-800">
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly Rent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{room.rent}</p>
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accommodation</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{room.pg_type}</p>
           </div>
           <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Slots</p>
              <p className="text-2xl font-bold text-primary-600">
                {Math.max(0, parseInt(room.total_capacity || '0') - parseInt(room.current_occupancy || '0'))} Left
              </p>
           </div>
        </div>

        {/* Description Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">About this PG</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            {room.description}
          </p>
        </div>

        {/* Amenities Bullet List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Amenities</h2>
          <div className="grid grid-cols-2 gap-y-3">
            {room.amenities && String(room.amenities).split(',').map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                <CheckCircle size={18} className="text-primary-600" />
                <span>{item.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Video Tour (If Available) */}
        {videos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Video Walkthrough</h2>
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
          <div className="p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 space-y-4">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
              <Heart size={20} /> Looking for Roommate
            </h3>
            <p className="text-blue-700 dark:text-blue-300 italic">"{room.roommate_message}"</p>
            <div className="pt-2">
               <a href={`tel:${room.roommate_contact_number}`} className="text-sm font-bold text-white bg-blue-600 px-6 py-2 rounded-lg inline-block">Contact Potential Roommate</a>
            </div>
          </div>
        )}
      </div>

      {/* Simplified Mobile Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-50">
        <div className="max-w-4xl mx-auto flex gap-4">
          <a 
            href={`tel:${room.kitchen_security_ac}`} 
            className="flex-grow flex items-center justify-center gap-2 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg"
          >
            <Phone size={18} /> Call Owner
          </a>
          <a 
            href={room.location_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl"
          >
            <Navigation size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PGDetail;
