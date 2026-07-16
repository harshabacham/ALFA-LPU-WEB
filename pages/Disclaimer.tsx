import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, HelpCircle, Shield, AlertTriangle } from 'lucide-react';

const Disclaimer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-700 text-left">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#fe7f2d] transition-colors border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-full bg-white dark:bg-gray-900 shadow-sm cursor-pointer"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fe7f2d]/10 text-[#fe7f2d] rounded-full text-[10px] font-black uppercase tracking-widest">
          <AlertTriangle size={14} /> Legal Disclosures
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
          Disclaimer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          Last Updated: July 15, 2026
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        
        {/* Core Disclaimer Content */}
        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <Info size={20} className="text-[#fe7f2d]" /> 1. Non-Affiliation with Lovely Professional University (LPU)
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ALFA Portal (alfa-lpu.in) is a fully independent, peer-founded community resource and web portal developed by and for students. 
            <strong> ALFA is NOT affiliated, associated, authorized, endorsed by, or in any official capacity connected with Lovely Professional University (LPU)</strong>, Phagwara, Punjab, or any of its subsidiaries or administrative branches.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            The official website of Lovely Professional University can be found exclusively at <a href="https://www.lpu.in" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] hover:underline">https://www.lpu.in</a>. All official academic queries, attendance details, and grading questions must be directed to LPU's official UMS (University Management System) portal.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <Shield size={20} className="text-[#fe7f2d]" /> 2. Accuracy of Content and Listings
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            While we strive to ensure that all peer-provided academic notes, free certified courses, YouTube video links, local PG directories, and secondhand student deals are valid and helpful, we cannot guarantee absolute accuracy or completeness. User-generated postings in the Marketplace or PG section are the sole responsibility of their respective authors. We urge all students to physically inspect rented spaces and verify buyers/sellers before entering financial transactions.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <HelpCircle size={20} className="text-[#fe7f2d]" /> 3. Advertising and AdSense Disclosure
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ALFA uses third-party advertising services, most notably Google AdSense, to display non-obtrusive, highly relevant advertisements to our users. These advertising partners may utilize specialized tracking cookies (such as the DART cookie) to personalize your ad delivery based on browser activity. This website is purely supported by these clean, family-friendly advertisements to continue offering free peer tools and study materials to college students.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800/80 text-center">
          <p className="text-xs text-gray-400 italic">
            For specific compliance or disclaimer inquiries, please contact: <a href="mailto:support@alfa-lpu.in" className="text-[#fe7f2d] font-bold hover:underline">support@alfa-lpu.in</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Disclaimer;
