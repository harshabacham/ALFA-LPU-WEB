import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, Scale, ShieldCheck, AlertCircle } from 'lucide-react';

const Terms: React.FC = () => {
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
          <Scale size={14} /> Legality & Guidelines
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
          Terms of Service
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          Last Updated: July 15, 2026
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        
        {/* Terms detail cards */}
        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <FileText size={20} className="text-[#fe7f2d]" /> 1. Acceptance of Terms
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            By accessing and utilizing the ALFA Portal web application, you explicitly agree to read, understand, and comply with these Terms of Service in their entirety. If you do not agree with any of the outlined terms, policies, or guidelines, you must discontinue your use of our application immediately.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <ShieldCheck size={20} className="text-[#fe7f2d]" /> 2. Community Standards & Acceptable Use
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ALFA is built as an academic and housing portal to help LPU students. You are permitted to use the platform solely for lawful, academic, and ethical purposes. The following actions are strictly prohibited:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs text-gray-500 leading-relaxed">
            <li>Submitting inaccurate, fraudulent, or deceptive details inside the PG Rooms or Deals sections.</li>
            <li>Uploading files or academic notes that violate intellectual property copyrights or contain malicious software, viruses, or spyware.</li>
            <li>Spamming, harvesting user emails, or attempting to compromise server routing, database queries, or general portal security.</li>
            <li>Attempting to post offensive, abusive, hateful, or inappropriate content on shared community panels.</li>
          </ul>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <AlertCircle size={20} className="text-[#fe7f2d]" /> 3. Third-Party Links & Content Disclaimers
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ALFA includes curated links to external websites, community spreadsheets, YouTube educational channels, and other third-party services. We operate as an indexer and are not responsible for the accuracy, security, or legal compliance of external content. Clicking on links is done at your own risk, governed by the terms of those respective providers.
          </p>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white">
            <Scale size={20} className="text-[#fe7f2d]" /> 4. Limitation of Liability
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            ALFA Portal, including its administrators, peer contributors, and developers, shall in no event be held liable for any damages, academic penalties, financial losses, or housing disputes arising from your use or inability to use the platform. All resources, including GPA formulas, PG listings, and exam study tips, are offered "as is" without any express warranties.
          </p>
        </section>

        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800/80 text-center">
          <p className="text-xs text-gray-400 italic">
            For specific compliance or terms inquiries, contact us at: <a href="mailto:support@alfa-lpu.in" className="text-[#fe7f2d] font-bold hover:underline">support@alfa-lpu.in</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;
