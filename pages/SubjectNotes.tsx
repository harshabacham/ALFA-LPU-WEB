
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, Download, FileText, Eye, Copy, 
  CheckCircle2, ArrowLeft, Hash, ShieldCheck
} from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Note } from '../types';

const SubjectNotes: React.FC = () => {
  const { subjectName } = useParams<{ subjectName: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await fetchCSV<Note>(CSV_URLS.NOTES);
      const filtered = result.filter(n => n.subject === subjectName);
      setData(filtered);
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [subjectName]);

  const filteredNotes = data.filter(note => {
    const search = searchTerm.toLowerCase();
    return (note.name || "").toLowerCase().includes(search);
  });

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

  const copyToClipboard = (id: string) => {
    const link = getDownloadLink(id);
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate('/notes')}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Library
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{subjectName}</h1>
            <p className="text-gray-500 font-medium">{data.length} Resources available</p>
          </div>
          
          <div className="relative group w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search files..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 rounded-xl outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-gray-400 animate-pulse text-xs font-bold uppercase tracking-widest">
            Indexing Files...
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {filteredNotes.map((note, idx) => (
              <div 
                key={idx} 
                className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                    <FileText size={22} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {note.name}
                    </h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <ShieldCheck size={10} className="text-primary-500" /> Cloud Archive
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a 
                    href={getViewLink(note.file_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                    title="Preview"
                  >
                    <Eye size={18} />
                  </a>
                  <button 
                    onClick={() => copyToClipboard(note.file_id)}
                    className={`p-2.5 rounded-lg transition-all ${
                      copiedId === note.file_id 
                      ? 'bg-green-500 text-white' 
                      : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                    }`}
                    title="Copy Link"
                  >
                    {copiedId === note.file_id ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                  <a 
                    href={getDownloadLink(note.file_id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold hover:bg-primary-700 transition-all shadow-sm"
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <Search className="mx-auto text-gray-200 mb-4" size={40} />
            <p className="text-gray-500 font-medium">No files found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectNotes;
