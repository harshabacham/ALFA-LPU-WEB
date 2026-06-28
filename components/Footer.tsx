import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, GraduationCap, Compass, HelpCircle, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/60 dark:border-zinc-900 py-12 px-6 mt-16 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Info Column */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fe7f2d] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-[#fe7f2d]/20">
              A
            </div>
            <span className="text-xs font-black tracking-widest text-zinc-900 dark:text-white uppercase font-sans">
              ALFA PORTAL
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs font-sans">
            The premier campus community hub custom-tailored for LPU students. Find PG rooms, courses, event calendars, and academic utilities in one slick dashboard.
          </p>
        </div>

        {/* Explore Links */}
        <div className="space-y-3 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Explore Hubs
          </h4>
          <ul className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <li>
              <Link to="/pg-rooms" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Compass size={12} /> PG Directories
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <GraduationCap size={12} /> Campus Events
              </Link>
            </li>
            <li>
              <Link to="/gpa" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                GPA Calculator
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources & Support */}
        <div className="space-y-3 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Support & Info
          </h4>
          <ul className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <li>
              <Link to="/privacy" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Shield size={12} /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/emergency" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <HelpCircle size={12} /> Emergency Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-3 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Campus Context
          </h4>
          <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <p className="flex items-center gap-2">
              <MapPin size={12} className="text-[#fe7f2d]" />
              <span>Phagwara, Punjab, India</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={12} className="text-[#fe7f2d]" />
              <span>support@alfa-lpu.in</span>
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-200/50 dark:border-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} ALFA STUDENT PORTAL • ALL RIGHTS RESERVED
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 flex items-center gap-1 font-sans">
          Built with <Heart size={10} className="text-[#fe7f2d] fill-[#fe7f2d]" /> for LPU Students
        </p>
      </div>
    </footer>
  );
};
