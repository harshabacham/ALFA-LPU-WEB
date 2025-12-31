
import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, PlayCircle, Clock, Book } from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Course } from '../types';

const FreeCourses: React.FC = () => {
  const [data, setData] = useState<Course[]>([]);
  const [filteredData, setFilteredData] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Course>(CSV_URLS.FREE_COURSES);
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
        (item.description || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, data]);

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Free Learning Hub</h1>
          <p className="text-gray-500">Level up your skills with curated high-quality courses</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="What do you want to learn?" 
              className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((course, idx) => (
            <div key={idx} className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="relative h-44 overflow-hidden">
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <PlayCircle className="text-white w-12 h-12" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full text-[10px] font-bold text-primary-600 shadow-sm uppercase tracking-widest">
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5 flex-grow space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-3 leading-relaxed">
                  {course.description}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-tighter pt-2">
                   <div className="flex items-center gap-1">
                     <Clock size={12} /> 10+ Hours
                   </div>
                   <div className="flex items-center gap-1">
                     <Book size={12} /> 15 Lessons
                   </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a 
                  href={course.course_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-primary-600 hover:text-white text-primary-600 rounded-2xl font-bold transition-all border border-gray-100 dark:border-gray-700"
                >
                  Start Course
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500">
            No courses found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeCourses;
