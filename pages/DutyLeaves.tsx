import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  FileText, Search, Calendar, MapPin, Clock, ArrowUpDown, X, 
  ChevronRight, Sparkles, Calculator, CheckCircle2, QrCode, 
  Printer, Share2, Award, ShieldCheck, Download, AlertCircle, Info, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { DutyLeave } from '../types';

const DutyLeaves: React.FC = () => {
  const [data, setData] = useState<DutyLeave[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedLeave, setSelectedLeave] = useState<DutyLeave | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchCSV<DutyLeave>(CSV_URLS.DUTY_LEAVES);
        setData(result);
      } catch (err) {
        console.error("Failed to load Duty Leaves CSV", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const dispatchModalState = (isOpen: boolean) => {
    window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: isOpen } }));
  };

  useEffect(() => {
    dispatchModalState(!!selectedLeave);
  }, [selectedLeave]);

  // Derived sorted and searched data
  const processedData = useMemo(() => {
    let result = [...data];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(s) || 
        (item.description || "").toLowerCase().includes(s) ||
        (item.venue || "").toLowerCase().includes(s)
      );
    }
    
    result.sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
    
    return result;
  }, [data, searchTerm, sortOrder]);

  // Calendar stats
  const totalDLCount = data.length;
  const hoursPerDL = 6;
  const totalSavedHours = totalDLCount * hoursPerDL;

  const handleShare = async (leave: DutyLeave, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Duty Leave: ${leave.title}`,
          text: `Official DL recorded on ${leave.date} at ${leave.venue}.`,
          url: window.location.href
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(`Duty Leave Record:\nTitle: ${leave.title}\nDate: ${leave.date}\nVenue: ${leave.venue}\nTime: ${leave.time}`);
      alert("Duty Leave details copied to clipboard!");
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  // Helper to parse dates gracefully
  const getParsedDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { day: '01', month: 'DL', year: '2026' };
    }
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
      year: d.getFullYear()
    };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 space-y-10 min-h-screen">
      
      {/* 1. Creative Hero Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 p-6 md:p-10 text-white border border-zinc-900 shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-primary-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/15 text-primary-400 border border-primary-500/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-display">
                <ShieldCheck size={12} className="animate-pulse" /> Verified Academic Office
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-zinc-300 rounded-full text-[10px] font-bold border border-zinc-800">
                Official DL Registry
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none font-display">
              Duty <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Leaves Tracker</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-medium">
              Academic waiver records for representing the institution in sports, club activities, and professional hackathons.
            </p>
          </div>

          {/* Mini Statistics cards inside Hero banner */}
          <div className="flex items-center gap-4 shrink-0 bg-zinc-900/40 backdrop-blur-md p-4 rounded-3xl border border-zinc-800/80">
            <div className="text-left px-2 border-r border-zinc-800">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Total DLs</p>
              <p className="text-2xl font-black text-white font-display">{totalDLCount}</p>
            </div>
            <div className="text-left px-2">
              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Hours Saved</p>
              <p className="text-2xl font-black text-primary-400 font-display">~{totalSavedHours} hrs</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DL Records Stream */}
      <div className="max-w-4xl mx-auto w-full space-y-6">
          
          {/* Filters Dock */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search event title, venue, date..." 
                className="pl-11 pr-4 py-2.5 w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 shadow-xs transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sorting Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <ArrowUpDown size={14} />
              <span>{sortOrder === 'desc' ? 'Recent Dates First' : 'Oldest Dates First'}</span>
            </button>

          </div>

          {/* Active List Stream */}
          {loading ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-950 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-900">
              <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-zinc-500 font-bold text-sm">Fetching verified DL ledger...</p>
            </div>
          ) : processedData.length > 0 ? (
            <div className="space-y-4">
              {processedData.map((leave, idx) => {
                const dateMeta = getParsedDate(leave.date);
                return (
                  <motion.div
                    key={`${leave.title}-${idx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                    onClick={() => setSelectedLeave(leave)}
                    className="group bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-900 rounded-[2rem] p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:border-zinc-300 dark:hover:border-zinc-800 transition-all duration-300 cursor-pointer"
                  >
                    
                    {/* Date Block & Details Block */}
                    <div className="flex gap-4 items-center w-full min-w-0">
                      
                      {/* Premium Retro-futuristic Date Badge */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 border border-primary-500/10 rounded-2xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-xl sm:text-2xl font-black tracking-tight leading-none font-mono">
                          {dateMeta.day}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest font-display mt-1">
                          {dateMeta.month}
                        </span>
                      </div>

                      {/* Text info block */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 rounded-md text-[8px] font-bold uppercase tracking-wider font-mono">
                            APPROVED PASS
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-medium">
                            <Clock size={11} /> {leave.time || 'All Day'}
                          </span>
                        </div>
                        <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-snug truncate group-hover:text-primary-500 transition-colors">
                          {leave.title}
                        </h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs truncate max-w-md font-medium">
                          {leave.description}
                        </p>
                      </div>

                    </div>

                    {/* Arrow/CTA Column */}
                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end border-t border-zinc-100 dark:border-zinc-900 sm:border-0 pt-3 sm:pt-0 shrink-0">
                      <span className="sm:hidden text-[10px] font-bold text-zinc-400">Tap to show digital pass</span>
                      <div className="w-9 h-9 rounded-full bg-zinc-50 dark:bg-zinc-900 group-hover:bg-primary-500/10 group-hover:text-primary-500 flex items-center justify-center transition-all">
                        <ChevronRight size={18} className="text-zinc-400 group-hover:text-primary-500 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-900 p-8">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-zinc-400" />
              </div>
              <h4 className="font-bold text-lg text-zinc-800 dark:text-zinc-200 mb-1">No Duty Leaves Found</h4>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                No matching academic waiver forms found for the keyword or date filter.
              </p>
            </div>
          )}

      </div>

      {/* 3. Centered Digital Pass Modal Pop-up */}
      <AnimatePresence>
        {selectedLeave && (
          <div key="dl-pass-modal-portal">
            {createPortal(
              <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 overflow-y-auto">
                
                {/* Dark blur backdrop */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-0"
                  onClick={() => setSelectedLeave(null)}
                />

                {/* Centered Modal Card */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="relative w-full max-w-2xl bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] shadow-[0_24px_70px_rgba(0,0,0,0.18)] dark:shadow-[0_24px_70px_rgba(0,0,0,0.55)] border border-zinc-200/80 dark:border-zinc-900/80 flex flex-col overflow-hidden max-h-[90vh] z-10"
                >
                  
                  {/* Top Navigation Row */}
                  <div className="p-6 md:p-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 rounded-md text-[10px] font-extrabold uppercase tracking-widest font-mono border border-orange-500/10">
                        APPROVED PASS
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400 font-bold text-xs font-mono">
                        {selectedLeave.date}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedLeave(null)}
                      className="p-2 hover:bg-zinc-200/60 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-950 dark:hover:text-white rounded-xl transition-all cursor-pointer bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-850"
                      aria-label="Close pass panel"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Title Section */}
                  <div className="px-6 md:px-8 pb-6">
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight font-display">
                      {selectedLeave.title}
                    </h3>
                  </div>

                  {/* Horizontal Divider */}
                  <div className="border-t border-zinc-200/60 dark:border-zinc-900/80" />

                  {/* Scrollable Content Body */}
                  <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto max-h-[50vh] scrollbar-thin">
                    
                    {/* Description Text */}
                    <div className="space-y-2">
                      <p className="text-zinc-700 dark:text-zinc-300 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">
                        {selectedLeave.description}
                      </p>
                    </div>

                    {/* Metadata Details Table / Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-200/40 dark:border-zinc-900/60">
                      
                      <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/40 dark:border-zinc-900/50">
                        <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block">AUTHORIZED DATE</span>
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedLeave.date}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/40 dark:border-zinc-900/50">
                        <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl">
                          <Clock size={18} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block">WAIVER TIME</span>
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedLeave.time || 'All Day'}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3.5 bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/40 dark:border-zinc-900/50 sm:col-span-2">
                        <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block">HOST VENUE / EVENT LOCATION</span>
                          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{selectedLeave.venue}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-zinc-900/30 rounded-2xl border border-zinc-200/40 dark:border-zinc-900/50 sm:col-span-2 justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0">
                            <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-500 block">DIGITALLY SIGNED</span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Record ID: ALFA-DL-{getParsedDate(selectedLeave.date).month}{getParsedDate(selectedLeave.date).day}-024</span>
                          </div>
                        </div>
                        
                        {/* QR Code Icon Indicator */}
                        <div className="p-1.5 bg-white rounded-lg border border-zinc-200/60 shadow-xs flex items-center justify-center shrink-0">
                          <QrCode size={28} className="text-zinc-950" />
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Footer Controls Row */}
                  <div className="p-6 md:p-8 bg-zinc-100/60 dark:bg-zinc-900/50 border-t border-zinc-200/50 dark:border-zinc-900 flex flex-row items-center justify-between gap-4">
                    
                    <button 
                      onClick={(e) => handleShare(selectedLeave, e)}
                      className="flex-1 md:flex-initial flex items-center justify-center gap-2 py-3.5 px-6 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-800 dark:text-zinc-200 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border border-zinc-200/60 dark:border-zinc-800 cursor-pointer shadow-sm"
                    >
                      <Share2 size={14} className="text-zinc-500 dark:text-zinc-400" />
                      <span>Share Pass</span>
                    </button>

                    <button 
                      onClick={() => setSelectedLeave(null)}
                      className="flex-1 md:flex-initial flex items-center justify-center py-3.5 px-8 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-orange-600/10"
                    >
                      <span>Got It</span>
                    </button>

                  </div>

                </motion.div>
              </div>,
              document.body
            )}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default DutyLeaves;
