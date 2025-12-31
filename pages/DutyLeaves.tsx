
import React, { useState, useEffect } from 'react';
import { FileText, Search, Calendar, MapPin, Clock, ArrowUpDown, X, Info, ChevronRight } from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { DutyLeave } from '../types';

const DutyLeaves: React.FC = () => {
  const [data, setData] = useState<DutyLeave[]>([]);
  const [filteredData, setFilteredData] = useState<DutyLeave[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedLeave, setSelectedLeave] = useState<DutyLeave | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<DutyLeave>(CSV_URLS.DUTY_LEAVES);
      setData(result);
      setLoading(false);
    };
    load();
  }, []);

  const dispatchModalState = (isOpen: boolean) => {
    window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: isOpen } }));
  };

  useEffect(() => {
    dispatchModalState(!!selectedLeave);
  }, [selectedLeave]);

  useEffect(() => {
    let result = [...data];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(item => (item.title || "").toLowerCase().includes(s) || (item.description || "").toLowerCase().includes(s));
    }
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredData(result);
  }, [searchTerm, sortOrder, data]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div><h1 className="text-3xl font-bold dark:text-white">Duty Leaves</h1><p className="text-gray-500">Official records</p></div>
      </div>

      <div className="space-y-4">
        {loading ? <div className="text-center py-20 animate-pulse text-gray-400">Loading records...</div> : filteredData.map((leave, idx) => (
          <div key={idx} onClick={() => setSelectedLeave(leave)} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 flex gap-6 items-center cursor-pointer hover:shadow-xl transition-all">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex flex-col items-center justify-center text-primary-600">
               <span className="text-2xl font-black">{new Date(leave.date).getDate()}</span>
               <span className="text-[10px] font-bold uppercase">{new Date(leave.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div className="flex-grow">
               <h3 className="text-xl font-bold dark:text-white">{leave.title}</h3>
               <p className="text-gray-500 text-sm">{leave.description}</p>
            </div>
            <ChevronRight size={24} className="text-gray-300" />
          </div>
        ))}
      </div>

      {selectedLeave && (
        <div className="fixed inset-0 z-[500] w-screen h-screen overflow-hidden bg-white dark:bg-gray-950 animate-in fade-in duration-300 flex flex-col overscroll-none">
          {/* Modal Header Container */}
          <div className="w-full max-w-4xl mx-auto flex flex-col h-full p-6 md:p-12 overflow-y-auto overscroll-contain">
            <div className="flex justify-between items-start mb-12">
               <div className="flex items-center gap-6">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-primary-600 text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-xl shrink-0"><FileText size={32} className="md:w-10 md:h-10" /></div>
                 <div className="min-w-0">
                   <h2 className="text-2xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight truncate">{selectedLeave.title}</h2>
                   <p className="text-primary-600 text-lg md:text-xl font-black mt-1 md:mt-2">{selectedLeave.date}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedLeave(null)} className="p-3 md:p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl md:rounded-3xl hover:bg-red-500 hover:text-white transition-all shrink-0 ml-4"><X size={24} className="md:w-8 md:h-8" /></button>
            </div>

            <div className="space-y-12 flex-grow">
               <p className="text-gray-700 dark:text-gray-300 text-xl md:text-3xl leading-relaxed whitespace-pre-wrap">{selectedLeave.description}</p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Venue</p>
                    <p className="text-xl md:text-2xl font-black dark:text-white">{selectedLeave.venue}</p>
                  </div>
                  <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Time</p>
                    <p className="text-xl md:text-2xl font-black dark:text-white">{selectedLeave.time}</p>
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => setSelectedLeave(null)} className="w-full py-5 md:py-6 bg-primary-600 hover:bg-primary-700 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-lg md:text-xl transition-all shadow-xl shadow-primary-500/20 active:scale-95">Close Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DutyLeaves;
