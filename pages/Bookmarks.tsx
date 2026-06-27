import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bookmark, Calendar, Bed, FileText, Trash2, 
  Search, ExternalLink, ArrowRight, Eye, Download,
  MapPin, Clock, Star, ShieldCheck, HeartCrack, ChevronRight
} from 'lucide-react';
import { useBookmarks } from '../lib/bookmarks';

const Bookmarks: React.FC = () => {
  const { events, pgs, notes, toggleEvent, togglePG, toggleNote } = useBookmarks();
  const [activeTab, setActiveTab] = useState<'events' | 'pgs' | 'notes'>('events');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Helper for direct Google Drive image links if needed
  const getDirectImageUrl = (urlOrId: string) => {
    if (!urlOrId) return "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w800`;
    return clean;
  };

  const getCleanId = (id: any) => {
    if (!id) return "";
    let strId = String(id).trim().replace(/['"]/g, '');
    if (strId.includes('drive.google.com')) {
      const match = strId.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || strId.match(/id=([a-zA-Z0-9_-]{25,})/);
      if (match && match[1]) return match[1];
    }
    return strId.split(/[?#]/)[0];
  };

  const getViewLink = (id: string) => `https://drive.google.com/file/d/${getCleanId(id)}/view`;
  const getDownloadLink = (id: string) => `https://drive.google.com/uc?export=download&id=${getCleanId(id)}`;

  // Filter bookmarked items
  const filteredEvents = events.filter(be => 
    be.item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    be.item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPGs = pgs.filter(bp => 
    bp.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bp.item.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNotes = notes.filter(bn => 
    bn.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bn.item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-500 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Bookmark size={12} className="fill-primary-500" /> Saved Items
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">
            My Bookmarks
          </h1>
          <p className="text-gray-500 font-medium">
            Quick access to your pinned Events, PG Accommodations, and Academic Resources.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search saved items..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 rounded-xl outline-none transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 dark:border-gray-800/60 scrollbar-hide">
        <button
          onClick={() => { setActiveTab('events'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'events'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white'
          }`}
        >
          <Calendar size={14} />
          <span>Events</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'events' 
              ? 'bg-white/20 dark:bg-black/10 text-white dark:text-gray-900' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>{events.length}</span>
        </button>

        <button
          onClick={() => { setActiveTab('pgs'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'pgs'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white'
          }`}
        >
          <Bed size={14} />
          <span>PG Accommodations</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'pgs' 
              ? 'bg-white/20 dark:bg-black/10 text-white dark:text-gray-900' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>{pgs.length}</span>
        </button>

        <button
          onClick={() => { setActiveTab('notes'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'notes'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
              : 'bg-white dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white'
          }`}
        >
          <FileText size={14} />
          <span>Academic Notes</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'notes' 
              ? 'bg-white/20 dark:bg-black/10 text-white dark:text-gray-900' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}>{notes.length}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === 'events' && (
          filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((be) => (
                <div 
                  key={be.item.title}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[16/10] w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img 
                      src={be.item.image_url} 
                      alt={be.item.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <button
                      onClick={() => toggleEvent(be.item, be.index)}
                      className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-gray-900/90 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-gray-500 rounded-full transition-all shadow-sm flex items-center justify-center"
                      title="Remove Bookmark"
                      style={{ minWidth: '44px', minHeight: '44px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider block">
                        {be.item.organizer}
                      </span>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
                        {be.item.title}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2">
                        {be.item.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-gray-800/60 text-xs text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-gray-400" />
                        <span>{be.item.date} • {be.item.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-gray-400" />
                        <span className="truncate">{be.item.venue}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/events/${be.index}`)}
                      className="w-full py-3 bg-gray-100 hover:bg-primary-600 dark:bg-gray-800 dark:hover:bg-primary-600 text-gray-700 hover:text-white dark:text-gray-200 dark:hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      style={{ minHeight: '44px' }}
                    >
                      View Event <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto">
                <Calendar size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Saved Events</h3>
              <p className="text-gray-500 text-sm">
                Bookmark exciting cultural programs, hackathons, and guest lectures from the Events Hub.
              </p>
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                style={{ minHeight: '44px' }}
              >
                Browse Events
              </button>
            </div>
          )
        )}

        {activeTab === 'pgs' && (
          filteredPGs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPGs.map((bp, idx) => {
                const images = String(bp.item.image_urls || "").split(/[\n,\s]+/).map(u => u.trim()).filter(u => u.length > 10);
                const firstImg = getDirectImageUrl(images[0]);

                return (
                  <div 
                    key={`${bp.item.name}-${idx}`}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
                      <img 
                        src={firstImg} 
                        alt={bp.item.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800')}
                      />
                      <button
                        onClick={() => togglePG(bp.item, bp.index)}
                        className="absolute top-3 right-3 p-2.5 bg-white/90 dark:bg-gray-900/90 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-gray-500 rounded-full transition-all shadow-sm flex items-center justify-center"
                        title="Remove Bookmark"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4 text-left">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">{bp.item.name}</h3>
                          <div className="flex items-center gap-1 text-xs font-bold shrink-0">
                            <Star size={13} className="fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
                            {bp.item.rating}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 font-medium truncate">{bp.item.address}</p>
                        <p className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest pt-1">
                          {bp.item.pg_type} Accomodation
                        </p>
                      </div>

                      <div className="flex justify-between items-end border-t border-gray-50 dark:border-gray-800/60 pt-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Rent</p>
                          <p className="text-base font-black text-gray-900 dark:text-white">₹{bp.item.rent} <span className="text-gray-400 text-xs font-normal">/ mo</span></p>
                        </div>
                        <button
                          onClick={() => navigate(`/pg-rooms/${bp.index}`)}
                          className="px-4 py-2 bg-gray-100 hover:bg-primary-600 dark:bg-gray-800 dark:hover:bg-primary-600 text-gray-700 hover:text-white dark:text-gray-200 dark:hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          style={{ minHeight: '44px' }}
                        >
                          Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto">
                <Bed size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Saved PG listings</h3>
              <p className="text-gray-500 text-sm">
                Keep a list of rooms, flats, or roommate listings you want to compare or contact later.
              </p>
              <button
                onClick={() => navigate('/pg-rooms')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                style={{ minHeight: '44px' }}
              >
                Browse Accommodations
              </button>
            </div>
          )
        )}

        {activeTab === 'notes' && (
          filteredNotes.length > 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {filteredNotes.map((bn) => (
                  <div 
                    key={bn.item.file_id} 
                    className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                        <FileText size={22} />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-bold text-gray-900 dark:text-white truncate text-base">
                          {bn.item.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <Link 
                            to={`/notes/${encodeURIComponent(bn.item.subject)}`} 
                            className="text-[10px] font-bold text-primary-500 hover:underline uppercase tracking-wider"
                          >
                            {bn.item.subject}
                          </Link>
                          <span className="text-gray-300 dark:text-gray-700 text-xs">•</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck size={10} className="text-emerald-500" /> Cloud Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={getViewLink(bn.item.file_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                        title="Preview File"
                        style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye size={18} />
                      </a>
                      <a 
                        href={getDownloadLink(bn.item.file_id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all mr-2"
                        title="Download File"
                        style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Download size={18} />
                      </a>
                      <button 
                        onClick={() => toggleNote(bn.item)}
                        className="p-3 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-gray-400 hover:text-red-500 rounded-xl transition-all flex items-center justify-center"
                        title="Remove Bookmark"
                        style={{ minWidth: '44px', minHeight: '44px' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 rounded-full flex items-center justify-center mx-auto">
                <FileText size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Saved Academic Resources</h3>
              <p className="text-gray-500 text-sm">
                Pin syllabi, lecture slides, assignment sheets, and question banks directly for simple retrieval.
              </p>
              <button
                onClick={() => navigate('/notes')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all"
                style={{ minHeight: '44px' }}
              >
                Browse Library
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
