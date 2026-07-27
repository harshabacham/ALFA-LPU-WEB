import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, X, BookOpen, Calendar, Users, Tag, 
  ArrowRight, Sparkles, FileText, MapPin, Clock, 
  ChevronRight, ArrowUpRight, Check, ShieldAlert,
  GraduationCap, AlertCircle, ShoppingBag
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Note, Event as AppEvent, Club, Deal } from '../types';
import { FALLBACK_EVENTS, FALLBACK_CLUBS, FALLBACK_DEALS } from '../services/fallbackData';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryLabel: 'Notes' | 'Events' | 'Clubs' | 'Marketplace';
  type: 'note' | 'event' | 'club' | 'deal';
  icon: React.ElementType;
  color: 'blue' | 'rose' | 'pink' | 'amber';
  url: string;
  meta?: string;
  extra?: string;
}

const FALLBACK_NOTES: Note[] = [
  { subject: 'CSE101', name: 'Computer Programming Fundamentals & C Basics', file_id: 'note-1' },
  { subject: 'MTH165', name: 'Differential Equations & Linear Algebra Formulas', file_id: 'note-2' },
  { subject: 'ECE211', name: 'Digital Electronics Circuit Diagrams & PYQs', file_id: 'note-3' },
  { subject: 'CSE316', name: 'Operating Systems System Calls & Memory Management', file_id: 'note-4' },
  { subject: 'INT219', name: 'Front-End Web Development with HTML, CSS & React', file_id: 'note-5' },
  { subject: 'MEC107', name: 'Engineering Graphics & CAD Drawing Guidelines', file_id: 'note-6' },
  { subject: 'CHE110', name: 'Environmental Studies & Applied Chemistry Notes', file_id: 'note-7' },
  { subject: 'PEL121', name: 'Communication Skills & PEP Placement Guide', file_id: 'note-8' }
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'notes' | 'events' | 'clubs' | 'deals'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Load CSV data across all 4 domains on initial mount
  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      setIsLoading(true);

      const [notesRes, eventsRes, clubsRes, dealsRes] = await Promise.allSettled([
        fetchCSV<Note>(CSV_URLS.NOTES),
        fetchCSV<AppEvent>(CSV_URLS.EVENTS),
        fetchCSV<Club>(CSV_URLS.CLUBS),
        fetchCSV<Deal>(CSV_URLS.DEALS),
      ]);

      if (!isMounted) return;

      if (notesRes.status === 'fulfilled' && notesRes.value.length > 0) {
        setNotes(notesRes.value);
      } else {
        setNotes(FALLBACK_NOTES);
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value.length > 0) {
        setEvents(eventsRes.value);
      } else {
        setEvents(FALLBACK_EVENTS);
      }

      if (clubsRes.status === 'fulfilled' && clubsRes.value.length > 0) {
        setClubs(clubsRes.value);
      } else {
        setClubs(FALLBACK_CLUBS);
      }

      if (dealsRes.status === 'fulfilled' && dealsRes.value.length > 0) {
        setDeals(dealsRes.value);
      } else {
        setDeals(FALLBACK_DEALS);
      }

      setIsLoading(false);
    };

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lock scroll when modal is open and auto-focus input
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Transform and filter search results
  const allResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const items: SearchResultItem[] = [];

    // 1. Process Notes
    notes.forEach((note, idx) => {
      const subject = note.subject || '';
      const name = note.name || '';
      const matches = !q || subject.toLowerCase().includes(q) || name.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `note-${idx}-${subject}`,
          title: subject ? `${subject.toUpperCase()} - ${name || 'Syllabus Notes'}` : name || 'Academic Notes',
          subtitle: `Subject Code: ${subject.toUpperCase()}`,
          description: name ? `LPU Course file & study resources for ${name}` : 'Course notes and syllabus file',
          categoryLabel: 'Notes',
          type: 'note',
          icon: BookOpen,
          color: 'blue',
          url: `/notes?search=${encodeURIComponent(subject || name)}`,
          meta: 'Syllabus & PYQs',
          extra: note.file_id ? 'PDF Available' : 'Resource'
        });
      }
    });

    // 2. Process Events
    events.forEach((evt, idx) => {
      const title = evt.title || '';
      const desc = evt.description || '';
      const venue = evt.venue || '';
      const organizer = evt.organizer || '';

      const matches = !q || 
        title.toLowerCase().includes(q) || 
        desc.toLowerCase().includes(q) ||
        venue.toLowerCase().includes(q) ||
        organizer.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `event-${idx}`,
          title: title || 'Campus Event',
          subtitle: `${evt.date || 'Upcoming'} ${evt.time ? `• ${evt.time}` : ''} ${venue ? `• ${venue}` : ''}`,
          description: desc || 'Campus hackathon, fest, or workshop event at LPU.',
          categoryLabel: 'Events',
          type: 'event',
          icon: Calendar,
          color: 'rose',
          url: `/events/${idx}`,
          meta: evt.price || 'Free Entry',
          extra: organizer || 'Campus Event'
        });
      }
    });

    // 3. Process Clubs
    clubs.forEach((club, idx) => {
      const name = club.name || '';
      const desc = club.description || '';
      const category = club.category || '';

      const matches = !q || 
        name.toLowerCase().includes(q) || 
        desc.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `club-${club.id || idx}`,
          title: name || 'Student Organization',
          subtitle: `Category: ${category || 'Official Club'}`,
          description: desc || 'Official LPU student organization & technical society.',
          categoryLabel: 'Clubs',
          type: 'club',
          icon: Users,
          color: 'pink',
          url: `/clubs?search=${encodeURIComponent(name)}`,
          meta: club.category || 'Student Club',
          extra: club.meeting_times || 'Active'
        });
      }
    });

    // 4. Process Marketplace Deals
    deals.forEach((deal, idx) => {
      const title = deal.title || '';
      const desc = deal.description || '';
      const category = deal.category || '';
      const tags = deal.tags || '';
      const location = deal.location || '';

      const matches = !q || 
        title.toLowerCase().includes(q) || 
        desc.toLowerCase().includes(q) ||
        category.toLowerCase().includes(q) ||
        tags.toLowerCase().includes(q) ||
        location.toLowerCase().includes(q);

      if (matches) {
        items.push({
          id: `deal-${deal.id || idx}`,
          title: title || 'Marketplace Item',
          subtitle: `₹${deal.price || '0'} • ${deal.location || 'Campus'} (${deal.condition || 'Used'})`,
          description: desc || 'Student-to-student marketplace listing.',
          categoryLabel: 'Marketplace',
          type: 'deal',
          icon: Tag,
          color: 'amber',
          url: `/deals?search=${encodeURIComponent(title)}`,
          meta: `₹${deal.price || '0'}`,
          extra: deal.seller_name ? `Seller: ${deal.seller_name}` : deal.location
        });
      }
    });

    return items;
  }, [query, notes, events, clubs, deals]);

  // Filter items by category tab
  const filteredResults = useMemo(() => {
    if (activeTab === 'all') return allResults;
    if (activeTab === 'notes') return allResults.filter(i => i.type === 'note');
    if (activeTab === 'events') return allResults.filter(i => i.type === 'event');
    if (activeTab === 'clubs') return allResults.filter(i => i.type === 'club');
    if (activeTab === 'deals') return allResults.filter(i => i.type === 'deal');
    return allResults;
  }, [allResults, activeTab]);

  // Counts per tab category
  const counts = useMemo(() => {
    return {
      all: allResults.length,
      notes: allResults.filter(i => i.type === 'note').length,
      events: allResults.filter(i => i.type === 'event').length,
      clubs: allResults.filter(i => i.type === 'club').length,
      deals: allResults.filter(i => i.type === 'deal').length,
    };
  }, [allResults]);

  // Reset keyboard selected index when query or tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  // Handle result item selection
  const handleSelectResult = (item: SearchResultItem) => {
    onClose();
    navigate(item.url);
  };

  // Keyboard Navigation: Up, Down, Enter, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev + 1) % filteredResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredResults.length > 0 ? (prev - 1 + filteredResults.length) % filteredResults.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
          handleSelectResult(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Ensure active keyboard item is scrolled into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector(`[data-result-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Helper for color styles
  const getColorBadgeClasses = (color: SearchResultItem['color']) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      case 'pink':
        return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const getIconContainerClasses = (color: SearchResultItem['color']) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      case 'rose':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
      case 'pink':
        return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-start justify-center pt-12 md:pt-20 px-4 sm:px-6">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-zinc-950/60 dark:bg-black/75 backdrop-blur-md transition-opacity cursor-pointer"
        />

        {/* Floating Command Palette Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] z-[9995]"
        >
          {/* Header Search Input Bar */}
          <div className="p-4 md:p-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-3 bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
            <Search className="w-5 h-5 text-primary-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes, events, clubs, marketplace deals..."
              className="w-full bg-transparent text-sm md:text-base font-bold text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-xl hover:bg-zinc-200/60 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-200/50 dark:bg-zinc-800 rounded-lg transition-colors shrink-0"
            >
              Esc
            </button>
          </div>

          {/* Category Quick Filter Chips */}
          <div className="px-4 md:px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
            {[
              { id: 'all', label: 'All Results', count: counts.all, icon: Sparkles },
              { id: 'notes', label: 'Notes', count: counts.notes, icon: BookOpen },
              { id: 'events', label: 'Events', count: counts.events, icon: Calendar },
              { id: 'clubs', label: 'Clubs', count: counts.clubs, icon: Users },
              { id: 'deals', label: 'Marketplace', count: counts.deals, icon: Tag },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Container List */}
          <div
            ref={resultsContainerRef}
            className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 scrollbar-none"
          >
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
                  Indexing Portal Records...
                </p>
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    No matching records found
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                    {query
                      ? `We couldn't find any notes, events, clubs, or marketplace deals for "${query}".`
                      : 'Try typing a keyword to search across ALFA portal.'}
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block w-full mb-1">
                    Try quick queries:
                  </span>
                  {['CSE101', 'Hackathon', 'GDG', 'Books', 'PG Room'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="px-2.5 py-1 rounded-lg bg-sand-100 dark:bg-zinc-800 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-sand-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredResults.map((item, index) => {
                  const ItemIcon = item.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      data-result-index={index}
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group relative flex items-start gap-3.5 p-3 md:p-3.5 rounded-2xl transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-sand-100/90 dark:bg-zinc-800/90 border-primary-500/40 shadow-xs'
                          : 'bg-white dark:bg-zinc-900/60 border-transparent hover:bg-sand-50 dark:hover:bg-zinc-800/40'
                      }`}
                    >
                      {/* Left Category Icon */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${getIconContainerClasses(
                          item.color
                        )}`}
                      >
                        <ItemIcon className="w-4 h-4" />
                      </div>

                      {/* Content Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <h4
                              className={`text-xs md:text-sm font-bold tracking-tight truncate ${
                                isSelected
                                  ? 'text-primary-600 dark:text-primary-400'
                                  : 'text-zinc-900 dark:text-zinc-100 group-hover:text-primary-500'
                              }`}
                            >
                              {item.title}
                            </h4>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${getColorBadgeClasses(
                              item.color
                            )}`}
                          >
                            {item.categoryLabel}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                          {item.subtitle}
                        </p>

                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Right Arrow Chevron */}
                      <div className="self-center shrink-0 pl-1">
                        <ArrowRight
                          className={`w-4 h-4 transition-all ${
                            isSelected
                              ? 'text-primary-500 translate-x-0.5 opacity-100'
                              : 'text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Keyboard Navigation Shortcuts Guide */}
          <div className="p-3 px-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 font-medium shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300">
                  ↵
                </kbd>
                <span>Select</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[9px] font-mono bg-zinc-200/80 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300">
                  Esc
                </kbd>
                <span>Close</span>
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono uppercase text-zinc-400">
              <Sparkles className="w-3 h-3 text-primary-500" />
              <span>ALFA Global Search</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
