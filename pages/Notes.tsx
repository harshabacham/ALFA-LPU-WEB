
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Library, BookOpen, ChevronRight, Folder, Cpu, Settings, 
  Zap, Binary, Globe, Search, ArrowRight, GraduationCap
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Note } from '../types';

const Notes: React.FC = () => {
  const [subjects, setSubjects] = useState<{name: string, count: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

      const uniqueSubjects = Object.entries(subjectMap).map(([name, count]) => ({
        name,
        count
      }));
      
      setSubjects(uniqueSubjects.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    };
    load();
  }, []);

  const getBranchIcon = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('CSE') || n.includes('COMPUTER')) return Cpu;
    if (n.includes('MEC') || n.includes('MECHANICAL')) return Settings;
    if (n.includes('PES') || n.includes('PHYSICAL')) return Zap;
    if (n.includes('ECE') || n.includes('ELECTRONICS')) return Binary;
    if (n.includes('CIVIL')) return Globe;
    return BookOpen;
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Clean Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 dark:border-gray-800 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Academic Notes</h1>
          <p className="text-gray-500 font-medium">Access verified study materials and departmental resources.</p>
        </div>
        
        <div className="relative group w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search branches..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 rounded-xl outline-none transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-gray-50 dark:bg-gray-900/50 rounded-2xl animate-pulse"></div>
          ))
        ) : filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, idx) => {
            const Icon = getBranchIcon(subject.name);
            return (
              <button
                key={idx}
                onClick={() => navigate(`/notes/${encodeURIComponent(subject.name)}`)}
                className="group flex items-center gap-5 p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all text-left"
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:bg-primary-500 group-hover:text-white rounded-xl transition-all">
                  <Icon size={24} />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                    {subject.count} Resources
                  </p>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </button>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center">
            <Folder className="mx-auto text-gray-200 dark:text-gray-800 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No branches found matching your search.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center gap-6 pt-12 opacity-50">
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <GraduationCap size={14} /> Curated Content
         </div>
         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Library size={14} /> Shared Knowledge
         </div>
      </div>
    </div>
  );
};

export default Notes;
