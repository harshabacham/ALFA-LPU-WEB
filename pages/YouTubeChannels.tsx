
import React, { useState, useEffect } from 'react';
import { 
  Youtube, Search, Play, Filter, ExternalLink, 
  Sparkles, BookOpen, Layers, MonitorPlay 
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { YouTubeChannel } from '../types';

const YouTubeChannels: React.FC = () => {
  const [data, setData] = useState<YouTubeChannel[]>([]);
  const [filteredData, setFilteredData] = useState<YouTubeChannel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<YouTubeChannel>(CSV_URLS.YOUTUBE_CHANNELS);
      setData(result);
      setFilteredData(result);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(search) || 
        (item.subject || "").toLowerCase().includes(search) ||
        (item.category || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (selectedSubject !== 'All') {
      result = result.filter(item => item.subject === selectedSubject);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, selectedSubject, data]);

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];
  const subjects = ['All', ...Array.from(new Set(data.map(i => i.subject).filter(Boolean)))];

  const getYoutubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getThumbnail = (url: string) => {
    const id = getYoutubeID(url);
    if (!id) return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800";
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 p-10 md:p-16 text-white border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-6 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-red-500 border border-red-500/20 mx-auto lg:mx-0">
              <Youtube size={14} className="animate-pulse" /> Global Learning
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Educational <span className="text-red-600">Library.</span>
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              Curated YouTube content and academic channels to help you master any subject at your own pace.
            </p>
          </div>

          <div className="w-full lg:w-[450px] space-y-4">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search tutorials..." 
                className="w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-[2rem] outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-bold appearance-none cursor-pointer hover:bg-white/10 transition-all"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => <option key={cat} value={cat} className="bg-gray-900">{cat}</option>)}
                </select>
              </div>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none text-xs font-bold appearance-none cursor-pointer hover:bg-white/10 transition-all"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(sub => <option key={sub} value={sub} className="bg-gray-900">{sub}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-red-100 dark:border-red-900/20 border-t-red-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Video Vault...</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredData.length > 0 ? (
            filteredData.map((video, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-800/50 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2"
              >
                {/* Thumbnail Area */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={getThumbnail(video.url)} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play size={24} className="fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-lg">
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                       <Layers size={12} className="text-red-500" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{video.subject}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                  </div>

                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-red-600 hover:text-white text-gray-700 dark:text-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm group/btn"
                  >
                    Watch Now <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                <MonitorPlay size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">No Videos Found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search keywords.</p>
              </div>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All'); setSelectedSubject('All');}}
                className="px-8 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-red-700 transition-all active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pro Tip Card */}
      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[3rem] border border-red-100 dark:border-red-900/20 flex flex-col md:flex-row gap-6 items-center text-center md:text-left">
         <div className="p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
            <Sparkles size={32} className="text-red-600" />
         </div>
         <div>
            <h4 className="text-lg font-bold text-red-900 dark:text-red-400 mb-1">Learning Tip</h4>
            <p className="text-sm text-red-700 dark:text-red-300/80 leading-relaxed font-medium">
               Watching video tutorials is great for visualization. Don't forget to check the <b>Academic Notes</b> section for supplementary PDF materials and practice sheets to reinforce what you've learned.
            </p>
         </div>
         <a 
           href="/notes" 
           className="md:ml-auto whitespace-nowrap px-8 py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 active:scale-95 transition-all"
         >
           Browse Notes
         </a>
      </div>
    </div>
  );
};

export default YouTubeChannels;
