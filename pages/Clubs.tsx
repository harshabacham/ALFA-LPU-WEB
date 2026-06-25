import React, { useState, useEffect } from 'react';
import { 
  Users, Search, ExternalLink, Mail, Clock, 
  ShieldCheck, PlusCircle, ArrowUpRight, 
  Sparkles, Compass, Zap, Target, Award, 
  MessageSquare, ChevronRight, Check, Copy, HelpCircle
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Club } from '../types';

const Clubs: React.FC = () => {
  const [data, setData] = useState<Club[]>([]);
  const [filteredData, setFilteredData] = useState<Club[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Interactive "Vibe Matcher" state
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  
  // Clipboard copying state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Club>(CSV_URLS.CLUBS);
      setData(result);
      setFilteredData(result);
      setLoading(false);
    };
    load();
  }, []);

  // Vibe match categories
  const vibeOptions = [
    { id: 'code', label: '🚀 Build Software & AI', keywords: ['coding', 'developer', 'tech', 'software', 'google', 'microsoft', 'ai', 'robotics'] },
    { id: 'speak', label: '🎤 Public Speaking & Leads', keywords: ['speaking', 'lead', 'debate', 'toastmasters', 'entrepreneur', 'management'] },
    { id: 'art', label: '🎨 Art, Music & Dance', keywords: ['art', 'music', 'dance', 'cultural', 'creative', 'design', 'drama'] },
    { id: 'social', label: '🤝 Community & Service', keywords: ['service', 'community', 'rotaract', 'ngo', 'volunteer', 'helping'] },
  ];

  useEffect(() => {
    let result = data;
    
    // Apply Vibe Filter if selected
    if (activeVibe) {
      const vibe = vibeOptions.find(v => v.id === activeVibe);
      if (vibe) {
        result = result.filter(item => {
          const content = `${item.name} ${item.description} ${item.category}`.toLowerCase();
          return vibe.keywords.some(kw => content.includes(kw));
        });
      }
    }

    // Apply Standard Search Term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.name || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search) ||
        (item.category || "").toLowerCase().includes(search)
      );
    }
    
    // Apply Category Dropdown/Pill Filter
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    setFilteredData(result);
  }, [searchTerm, selectedCategory, activeVibe, data]);

  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    if (clean.length > 20 && !clean.includes('/') && !clean.includes('.')) {
      return `https://drive.google.com/thumbnail?id=${clean}&sz=w1000`;
    }
    return clean;
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Extract categories & count occurrences for dynamic badge tags!
  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = { All: data.length };
    data.forEach(item => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();
  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];

  // Map categories to modern distinct gradient classes
  const getCategoryColor = (cat: string) => {
    switch (cat?.toLowerCase()) {
      case 'technical':
      case 'tech':
        return 'from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'cultural':
      case 'arts':
        return 'from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-500 text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'management':
      case 'entrepreneurship':
        return 'from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      default:
        return 'from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-700 text-left">
      
      {/* 1. Bento Grid Hero Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Main Banner Card */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-8 md:p-12 text-white border border-zinc-900 shadow-2xl flex flex-col justify-between group">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-600/10 blur-[100px] rounded-full pointer-events-none"></div>
          
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 border border-white/5">
              <Sparkles size={11} className="text-indigo-400 animate-pulse" /> Student Communities
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-zinc-50">
              Find Your Crew. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Lead the Culture.
              </span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
              Explore dynamic student-run societies at LPU. Collaborate on game-changing projects, participate in hackathons, refine your leadership potential, and find lifelong mentors.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
              ].map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt="Member" 
                  className="w-8 h-8 rounded-full border-2 border-zinc-950 object-cover" 
                />
              ))}
            </div>
            <p className="text-xs text-zinc-400 font-bold">
              Joined by <span className="text-indigo-400 font-black">3,000+ LPU peers</span> this semester
            </p>
          </div>
        </div>

        {/* Dynamic Live Stats Bento Card */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/50 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-500">
              <Users size={20} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Hubs</p>
              <h3 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-1 font-display">
                {data.length || '15+'}
              </h3>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/50 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500">
              <Award size={20} />
            </div>
            <div className="mt-4">
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Core Tracks</p>
              <h3 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 mt-1 font-display">
                {categories.length - 1} Tracks
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive "Find Your Vibe" Quick Matchmaker Section */}
      <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/30 rounded-[2.5rem] p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-indigo-500" />
              <h3 className="text-lg font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">
                Vibe Matchmaker
              </h3>
            </div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Select what you want to achieve on campus, and we will highlight matching student societies.
            </p>
          </div>
          {activeVibe && (
            <button 
              onClick={() => setActiveVibe(null)}
              className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Vibe
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vibeOptions.map((vibe) => {
            const isSelected = activeVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => {
                  setActiveVibe(isSelected ? null : vibe.id);
                  // Clear dropdown category selection to avoid conflicts
                  setSelectedCategory('All');
                }}
                className={`p-4 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/10 scale-[1.02]' 
                    : 'bg-white dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-indigo-800'
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-bold leading-snug">{vibe.label}</span>
                  {isSelected ? (
                    <Check size={14} className="text-white shrink-0" />
                  ) : (
                    <ChevronRight size={14} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  )}
                </div>
                <div className={`absolute inset-0 bg-indigo-500/5 transition-opacity opacity-0 group-hover:opacity-100 ${isSelected ? 'hidden' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filtering & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-zinc-200/55 dark:border-zinc-900/60 pb-6">
        
        {/* Modern Category Swapper */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat && !activeVibe;
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveVibe(null); // Clear active vibe
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 hover:bg-zinc-200/70 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                  isSelected 
                    ? 'bg-zinc-800 dark:bg-zinc-100 text-zinc-300 dark:text-zinc-600' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sleek Search bar */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-indigo-500 dark:focus:border-indigo-500 focus:bg-white outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      {/* 4. Communities Grid */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-100 dark:border-indigo-950/40 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest text-[10px]">Syncing Campus Hubs...</p>
        </div>
      ) : filteredData.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredData.map((club, index) => {
            const colorClasses = getCategoryColor(club.category);
            const isCopied = copiedId === club.id;
            
            return (
              <div 
                key={club.id || index} 
                className="group relative bg-white dark:bg-zinc-900/40 rounded-[2rem] border border-zinc-200/55 dark:border-zinc-800/40 shadow-sm hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-800 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 md:p-8 space-y-6 flex-grow">
                  
                  {/* Top Bar with Logo & Category Tag */}
                  <div className="flex items-start justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-2.5 shadow-inner border border-zinc-200/30 dark:border-zinc-800/40 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {club.logo_link ? (
                        <img 
                          src={getDirectImageUrl(club.logo_link)} 
                          alt={club.name} 
                          className="w-full h-full object-contain filter drop-shadow-sm rounded-lg" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`fallback flex items-center justify-center text-zinc-400 ${club.logo_link ? 'hidden' : ''}`}>
                        <Users size={24} />
                      </div>
                    </div>
                    
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${colorClasses}`}>
                      <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                      {club.category || 'General'}
                    </span>
                  </div>

                  {/* Club Description info */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                      {club.name}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed line-clamp-3 font-medium">
                      {club.description || 'Join this group of dedicated students to unlock exciting opportunities, master professional frameworks, and collaborate together.'}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900/60 text-left">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-400 dark:text-zinc-500 shrink-0">
                        <Clock size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Timings</p>
                        <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 truncate">{club.meeting_times || 'Announced via Group'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-lg text-zinc-400 dark:text-zinc-500 shrink-0">
                          <Mail size={12} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Contact Point</p>
                          <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 truncate">{club.contact_info || 'Registration Form'}</p>
                        </div>
                      </div>
                      
                      {club.contact_info && club.contact_info !== '-' && (
                        <button 
                          onClick={() => copyToClipboard(club.contact_info, club.id)}
                          className="p-1.5 text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
                          title="Copy Contact Info"
                        >
                          {isCopied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom Call to action link */}
                <div className="p-6 pt-0">
                  <a 
                    href={club.form_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group/btn w-full flex items-center justify-center gap-1.5 py-3 bg-zinc-50 hover:bg-zinc-900 dark:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all shadow-sm"
                  >
                    <span>Join Community</span>
                    <ArrowUpRight size={13} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center text-center space-y-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2rem] bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-600 animate-bounce">
            <Compass size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100">No Communities Found</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium max-w-sm mx-auto">
              We couldn't locate any student hubs matching your active search filters or coordinates. Try clearing tags.
            </p>
          </div>
          <button 
            onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setActiveVibe(null);}}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl shadow-md shadow-indigo-500/10 active:scale-95 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 5. Helpful Guild Card */}
      <div className="bg-gradient-to-r from-zinc-50 via-white to-zinc-50 dark:from-zinc-900/40 dark:via-zinc-900/10 dark:to-zinc-900/40 p-6 md:p-8 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/40 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
        <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm text-indigo-500">
          <MessageSquare size={24} />
        </div>
        <div className="space-y-1 flex-grow">
          <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Are you a Club Leader?</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
            Want to list your official student community on the ALFA portal, update your point of contact details, or showcase your weekly timelines? Reach out to our portal coordinator.
          </p>
        </div>
        <a 
          href="tel:7793914091" 
          className="whitespace-nowrap px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-all"
        >
          Contact Coordinator
        </a>
      </div>

    </div>
  );
};

export default Clubs;
