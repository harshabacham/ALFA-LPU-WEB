import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, GraduationCap, Compass, HelpCircle, Mail, MapPin, Scale, Info, FileText, Sparkles, BookOpen, Tag, Users, ShieldAlert, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-900 py-12 px-4 sm:px-6 lg:px-8 mt-20 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
        
        {/* Brand & Purpose Column (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fe7f2d] flex items-center justify-center text-white font-black text-base shadow-sm shadow-[#fe7f2d]/30 font-display">
              A
            </div>
            <div>
              <span className="text-sm font-black tracking-widest text-zinc-950 dark:text-white uppercase font-display block">
                LPU ALFA PORTAL
              </span>
              <span className="text-[10px] font-bold text-zinc-400 font-mono">
                Independent Student Community Hub
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
            LPU ALFA is the premier peer-driven academic, housing, and campus resource portal custom-tailored for Lovely Professional University students. Access semester notes, PYQs, live club directories, campus events, secondhand student marketplace, GPA calculator, and PG room listings.
          </p>
          <div className="pt-1 flex flex-wrap gap-2 text-[10px] font-bold font-mono text-zinc-500">
            <span className="px-2.5 py-1 bg-sand-100 dark:bg-zinc-900 rounded-md border border-zinc-200/60 dark:border-zinc-800">
              Phagwara, Punjab 144411
            </span>
            <span className="px-2.5 py-1 bg-sand-100 dark:bg-zinc-900 rounded-md border border-zinc-200/60 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400">
              100% Free Peer Network
            </span>
          </div>
        </div>

        {/* Academic & Campus Hubs */}
        <div className="space-y-3 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
            Academic & Campus
          </h4>
          <ul className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <li>
              <Link to="/notes" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <BookOpen size={13} className="text-[#fe7f2d]" /> Notes & PYQs
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <GraduationCap size={13} className="text-[#fe7f2d]" /> Campus Events & Fests
              </Link>
            </li>
            <li>
              <Link to="/clubs" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Users size={13} className="text-[#fe7f2d]" /> Student Clubs Directory
              </Link>
            </li>
            <li>
              <Link to="/deals" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Tag size={13} className="text-[#fe7f2d]" /> Student Marketplace
              </Link>
            </li>
            <li>
              <Link to="/pg-rooms" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Compass size={13} className="text-[#fe7f2d]" /> PG & Law Gate Housing
              </Link>
            </li>
            <li>
              <Link to="/gpa" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#fe7f2d]" /> CGPA & TGPA Calculator
              </Link>
            </li>
          </ul>
        </div>

        {/* Guides & Tools */}
        <div className="space-y-3 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
            Guides & Utilities
          </h4>
          <ul className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <li>
              <Link to="/guides" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <FileText size={13} className="text-[#fe7f2d]" /> Campus Survival Guides
              </Link>
            </li>
            <li>
              <Link to="/duty-leaves" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <ShieldAlert size={13} className="text-[#fe7f2d]" /> Duty Leave (DL) Guide
              </Link>
            </li>
            <li>
              <Link to="/emergency" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Phone size={13} className="text-[#fe7f2d]" /> Emergency Helplines
              </Link>
            </li>
            <li>
              <Link to="/youtube" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#fe7f2d]" /> Top YouTube Channels
              </Link>
            </li>
            <li>
              <Link to="/ai-tools" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#fe7f2d]" /> AI Academic Tools
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Trust Column (Mandatory for AdSense) */}
        <div className="space-y-3 text-left">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-mono">
            Policies & Publisher
          </h4>
          <ul className="space-y-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            <li>
              <Link to="/privacy" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Shield size={13} className="text-[#fe7f2d]" /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Scale size={13} className="text-[#fe7f2d]" /> Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/disclaimer" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Info size={13} className="text-[#fe7f2d]" /> Legal Disclaimer
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <HelpCircle size={13} className="text-[#fe7f2d]" /> About LPU ALFA
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#fe7f2d] transition-colors flex items-center gap-1.5">
                <Mail size={13} className="text-[#fe7f2d]" /> Contact Support
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Non-affiliation Disclaimer Note */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 text-left">
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 leading-relaxed font-medium">
          <strong>Disclaimer:</strong> LPU ALFA (alfa-lpu.in) is an independent, non-profit student community portal. It is NOT affiliated with, authorized, or endorsed by Lovely Professional University (LPU), Phagwara, Punjab. For official university queries, visit the official LPU portal at <a href="https://www.lpu.in" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] underline">www.lpu.in</a> or login to your UMS dashboard.
        </p>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest font-mono">
          © {new Date().getFullYear()} LPU ALFA PORTAL • ALL RIGHTS RESERVED
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 flex items-center gap-1 font-sans">
          Crafted with <Heart size={10} className="text-[#fe7f2d] fill-[#fe7f2d]" /> for Lovely Professional University Students
        </p>
      </div>
    </footer>
  );
};

export default Footer;
