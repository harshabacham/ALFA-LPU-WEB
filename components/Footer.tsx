import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Instagram, Linkedin, Github, ArrowRight, Mail, 
  BookOpen, Check, Shield, AlertCircle
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/60 transition-colors duration-200 mt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 space-y-12 md:space-y-16">
        
        {/* Multi-column Directory Menu Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 pt-4">
          
          {/* Column 1: Useful Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 font-display">
              Useful Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About Us', path: '/' },
                { label: 'Contact Helplines', path: '/emergency' },
                { label: 'LPU Hostels Info', path: '/emergency' },
                { label: 'Terms of Service', path: '/privacy' },
                { label: 'Privacy Policy', path: '/privacy' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path}
                    className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Student Services */}
          <div className="space-y-4 text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 font-display">
              Student Services
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Notes & Exam Guides', path: '/notes' },
                { label: 'Duty Leave Approvals', path: '/duty-leaves' },
                { label: 'PG Accommodation Finder', path: '/pg-rooms' },
                { label: 'Free Online Certifications', path: '/courses' },
                { label: 'AI Tools', path: '/ai-tools' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path}
                    className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4 text-left">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 font-display">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Events Hub', path: '/events' },
                { label: 'Community Clubs', path: '/clubs' },
                { label: 'Announcements', path: '/notifications' },
                { label: 'LPU YouTube Channels', path: '/youtube' },
                { label: 'Saved Bookmarks', path: '/bookmarks' },
              ].map((link, i) => (
                <li key={i}>
                  <Link 
                    to={link.path}
                    className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Separator */}
        <div className="h-px bg-zinc-200/60 dark:bg-zinc-900/60 w-full"></div>

        {/* Lower row: Branding identity & social channels */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Logo Name & Slogan */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 font-display">
                ALFA.
              </span>
            </Link>
            <span className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></span>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono hidden sm:block">
              LPU Student Portal
            </span>
          </div>

          {/* Social Channels in the mockup */}
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/harsha_bacham/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              aria-label="Instagram link"
            >
              <Instagram size={14} />
            </a>
            <a 
              href="https://linkedin.com/in/harsha-bacham/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              aria-label="LinkedIn link"
            >
              <Linkedin size={14} />
            </a>
            <a 
              href="https://github.com/harsha-bacham" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              aria-label="GitHub link"
            >
              <Github size={14} />
            </a>
          </div>

        </div>

        {/* Very bottom legal metadata row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-900/40 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 font-mono">
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link>
            <Link to="/privacy" className="hover:text-primary-500 transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-primary-500 transition-colors">Cookie Policy</Link>
          </div>
          <div>
            <span>© 2026 ALFA. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
