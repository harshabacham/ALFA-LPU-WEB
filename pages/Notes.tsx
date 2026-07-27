import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Library, BookOpen, ChevronRight, Folder, Cpu, Settings, 
  Zap, Binary, Globe, Search, ArrowRight, GraduationCap,
  Sparkles, Star, Bookmark, Download, FileText,
  Share2, Hash, Eye, TrendingUp, Compass, FolderKanban, Info,
  ExternalLink, Trash2, CheckCircle2, Copy
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Note } from '../types';
import { CardSkeleton } from '../components/ui/skeleton';
import { useBookmarks } from '../lib/bookmarks';

const Notes: React.FC = () => {
  const [subjects, setSubjects] = useState<{name: string, count: number, category: string}[]>([]);
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { notes: bookmarkedNotes, toggleNote, isNoteBookmarked } = useBookmarks();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [location.search]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Note>(CSV_URLS.NOTES);
      const subjectMap: Record<string, number> = {};
      
      result.forEach(note => {
        if (note.subject) {
          const sub = note.subject.trim();
          subjectMap[sub] = (subjectMap[sub] || 0) + 1;
        }
      });

      const getCategoryForSubject = (name: string): string => {
        const n = name.toUpperCase();
        if (n.includes('CSE') || n.includes('COMPUTER') || n.includes('CODE') || n.includes('PROGRAMMING') || n.includes('WEB') || n.includes('DATA')) {
          return 'Computing';
        }
        if (n.includes('ECE') || n.includes('ELECTRONICS') || n.includes('ELECTRICAL') || n.includes('BINARY') || n.includes('ZAP')) {
          return 'Electronics';
        }
        if (n.includes('MEC') || n.includes('MECHANICAL') || n.includes('CIVIL') || n.includes('DESIGN') || n.includes('ENGINEERING')) {
          return 'Engineering';
        }
        if (n.includes('MATH') || n.includes('PHYSICS') || n.includes('CHEMISTRY') || n.includes('EVS') || n.includes('SCIENCE')) {
          return 'Applied Sciences';
        }
        return 'Business & General';
      };

      const uniqueSubjects = Object.entries(subjectMap).map(([name, count]) => ({
        name,
        count,
        category: getCategoryForSubject(name)
      }));
      
      setSubjects(uniqueSubjects.sort((a, b) => b.count - a.count)); // Sort by count descending for dynamic relevance
      setLoading(false);
    };
    load();
  }, []);

  const getBranchIcon = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('CSE') || n.includes('COMPUTER')) return Cpu;
    if (n.includes('MEC') || n.includes('MECHANICAL')) return Settings;
    if (n.includes('PES') || n.includes('PHYSICAL') || n.includes('ZAP')) return Zap;
    if (n.includes('ECE') || n.includes('ELECTRONICS') || n.includes('BINARY')) return Binary;
    if (n.includes('CIVIL')) return Globe;
    return BookOpen;
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

  const copyToClipboard = (fileId: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(fileId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSubjects = subjects.filter(s => {
    return s.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 text-left">
      {/* Editorial Welcome Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-neutral-900 text-white p-8 md:p-12 mb-10 shadow-2xl border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-amber-300 uppercase tracking-widest"
          >
            <Sparkles size={12} className="animate-pulse" /> Verified Study Vault
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-display"
          >
            Your Academic <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-amber-300 to-primary-500">
              Co-Pilot
            </span>.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed max-w-lg"
          >
            Access a beautifully organized library of verified notes, hand-curated cheat sheets, and departmental study materials to elevate your grades.
          </motion.p>
        </div>

        {/* Dynamic Interactive Stats Ring */}
        <div className="hidden lg:flex absolute right-12 bottom-12 items-center gap-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-white font-mono">{subjects.length}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Branches</span>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="text-center">
            <span className="block text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">
              {subjects.reduce((sum, s) => sum + s.count, 0)}
            </span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Resources</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content Area: Desktop Asymmetric Sidebar split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Navigation, Filters, and Subject Grid (3 Cols) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Smart Search Bar */}
          <div className="relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search academic branches and resources..." 
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/60 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 rounded-2xl outline-none transition-all text-xs font-bold text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Subjects Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <CardSkeleton key={`skeleton-${idx}`} hasImage={false} className="h-32" />
                ))
              ) : filteredSubjects.length > 0 ? (
                filteredSubjects.map((subject, idx) => {
                  const Icon = getBranchIcon(subject.name);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={subject.name}
                    >
                      <button
                        onClick={() => navigate(`/notes/${encodeURIComponent(subject.name)}`)}
                        className="group relative w-full p-4 text-left bg-white dark:bg-zinc-950/60 border border-zinc-150 dark:border-zinc-900 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden h-32"
                      >
                        {/* Interactive Background Glow on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        {/* Top Metadata Header (Badge Removed) */}
                        <div className="flex items-start justify-between relative z-10 w-full mb-2">
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 group-hover:bg-primary-500 group-hover:text-white rounded-xl transition-all duration-300">
                            <Icon size={16} />
                          </div>
                        </div>

                        {/* Middle Title Details */}
                        <div className="relative z-10 space-y-0.5 w-full">
                          <h3 className="text-xs font-black text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                            {subject.name}
                          </h3>
                          <div className="flex items-center justify-between w-full pt-0.5">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                              <Folder size={10} className="text-amber-500 shrink-0" />
                              <span>{subject.count} {subject.count === 1 ? 'file' : 'files'}</span>
                            </p>
                            <span className="text-[9px] font-black text-primary-500 uppercase tracking-wider flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              Open <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-16 text-center bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-800/40 rounded-3xl"
                >
                  <Folder className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" size={32} />
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold">No academic subjects found matching your filters.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); }}
                    className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-[10px] font-bold rounded-xl hover:scale-105 transition-all uppercase tracking-wider"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Saved Notes Pocket (1 Col - Sticky Workspace) */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-none pr-1 pb-6">
          <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-4 sm:p-5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between mb-3 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-2">
              <div className="flex items-center gap-1.5">
                <Bookmark className="text-amber-500" size={14} />
                <h3 className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Workspace Pocket
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-black rounded-full">
                {bookmarkedNotes.length}
              </span>
            </div>

            <p className="text-zinc-400 text-[10px] font-medium leading-relaxed mb-3">
              Add note files to your personal Workspace Pocket for instant access across devices.
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-none pr-1">
              <AnimatePresence mode="popLayout">
                {bookmarkedNotes.length > 0 ? (
                  bookmarkedNotes.map((bookmark) => {
                    const note = bookmark.item;
                    const driveLink = getViewLink(note.file_id);
                    return (
                      <motion.div
                        key={note.file_id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="group flex flex-col p-2.5 bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 rounded-xl shadow-sm hover:border-amber-500/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2 min-w-0">
                          <div className="flex gap-1.5 items-center min-w-0">
                            <FileText className="text-zinc-400 shrink-0" size={12} />
                            <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
                              {note.name}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => toggleNote(note)}
                            className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                            title="Remove"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>

                        {/* Details and direct link row */}
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-900 w-full">
                          <span className="text-[8px] font-extrabold text-zinc-400 uppercase tracking-widest truncate max-w-[100px]">
                            {note.subject}
                          </span>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => copyToClipboard(note.file_id, driveLink)}
                              className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                              title="Copy URL"
                            >
                              {copiedId === note.file_id ? (
                                <CheckCircle2 size={11} className="text-green-500" />
                              ) : (
                                <Copy size={11} />
                              )}
                            </button>
                            <a
                              href={driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-primary-500 hover:text-primary-600 transition-colors"
                              title="Open Drive Link"
                            >
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="py-6 text-center bg-white dark:bg-zinc-950/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                    <FolderKanban className="mx-auto text-zinc-300 dark:text-zinc-800 mb-1.5" size={20} />
                    <span className="block text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">
                      Pocket Empty
                    </span>
                    <span className="text-[9px] text-zinc-400 mt-0.5 block px-4 leading-normal">
                      Bookmark files to save them here.
                    </span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Informational Tip */}
          <div className="bg-gradient-to-br from-primary-50 to-amber-50 dark:from-zinc-900/20 dark:to-zinc-900/10 border border-primary-500/10 rounded-2xl p-4 text-left">
            <div className="flex items-center gap-1.5 mb-1 text-primary-600 dark:text-primary-400">
              <Info size={12} className="shrink-0" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Pro Student Tip</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-[10px] font-medium leading-relaxed">
              You can bookmark multiple files inside any Branch Notes panel, copy direct academic assets directly, or preview notes directly before launching them inside Google Drive.
            </p>
          </div>
        </div>

      </div>

      {/* Decorative Curated Footer Badges */}
      <div className="flex flex-wrap items-center gap-6 pt-12 border-t border-zinc-100 dark:border-zinc-900 mt-16 opacity-60">
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <GraduationCap size={14} /> Curated Syllabus Match
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <Library size={14} /> Verified Student Peer-to-Peer Hub
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          <Compass size={14} /> Made for LPU Students
        </div>
      </div>
    </div>
  );
};

export default Notes;
