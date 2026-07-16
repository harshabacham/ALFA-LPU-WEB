import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Award, Users, BookOpen, Compass, 
  Target, Heart, ShieldCheck, HelpCircle, Mail, MapPin
} from 'lucide-react';

const About: React.FC = () => {
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
          <Users size={14} /> Our Mission & Values
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
          About ALFA Portal
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-2xl">
          The premier campus utility and community resource customized from the ground up for the student body of Lovely Professional University (LPU).
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        
        {/* Core Description block */}
        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-2xl font-black flex items-center gap-3 text-zinc-950 dark:text-white">
            <Compass className="text-[#fe7f2d]" /> What is ALFA?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            ALFA stands as a comprehensive, peer-driven Student Operating Workspace designed specifically to centralize and simplify campus life. LPU is an immense academic city with tens of thousands of active students, numerous blocks, countless PG accommodations, hundreds of student organizations, and massive continuous placement drives. 
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            Navigating this giant ecosystem can be overwhelming. ALFA was established by a passionate collective of senior students to solve this very problem. By organizing official and unofficial academic resources, offering specialized GPA tools, creating curated local hostel/flat listings, and providing community-submitted study files, ALFA serves as an indispensable daily asset.
          </p>
        </section>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center mx-auto">
              <BookOpen size={20} />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Academic Focus</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Vetted lecture notes, past exam question papers, clear attendance instructions, and intuitive calculation models.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center mx-auto">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Peer Validation</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All listed deals, local PGs, and third-party links are vetted by our senior student administrators to filter out spam.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800/80 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center mx-auto">
              <Target size={20} />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">Career Oriented</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Free masterclasses, placement-preparation instructions, and duty leave roadmaps to boost student careers.
            </p>
          </div>
        </div>

        {/* Origins Story and Ethics */}
        <section className="space-y-4 p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/80 shadow-sm">
          <h2 className="text-2xl font-black flex items-center gap-3 text-zinc-950 dark:text-white">
            <Heart className="text-red-500" /> Non-Profit & Student First
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            ALFA Portal operates on a fully non-commercial, non-profit, student-first ethic. We believe that access to education, accommodation information, and community resources should be completely open, transparent, and user-friendly. 
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
            To sustain our server costs and expand database capacity for notes and listings, we partner with premium ad networks like Google AdSense to serve highly personalized, clean, and family-safe advertising. This enables us to maintain ALFA as a 100% free portal for students.
          </p>
        </section>

        {/* Contact and Support Context */}
        <div className="pt-8 border-t border-gray-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Need Further Clarification?</p>
            <p className="text-xs text-gray-500">Learn more about our acceptable terms or write directly to our student portal coordinators.</p>
          </div>
          <div className="flex gap-3">
            <a 
              href="mailto:support@alfa-lpu.in"
              className="px-5 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-200 rounded-full font-bold text-xs uppercase tracking-wider hover:border-[#fe7f2d] dark:hover:border-[#fe7f2d] transition-all"
            >
              Email Support
            </a>
            <button 
              onClick={() => navigate('/contact')}
              className="px-5 py-3 bg-[#fe7f2d] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 shadow-md shadow-[#fe7f2d]/20 transition-all cursor-pointer"
            >
              Contact Us
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
