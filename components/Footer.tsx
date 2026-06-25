import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Linkedin, Youtube, ArrowRight, Mail, 
  MessageCircle, Phone, Sparkles, BookOpen, Check, Shield, AlertCircle
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12 md:space-y-16">
        
        {/* Banner Segment (Contact Us for Academic Assistance) */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-8 md:p-12 lg:p-16 shadow-[0_20px_50px_rgba(99,102,241,0.2)] group">
          {/* Decorative glows & patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60"></div>
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/15 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            {/* Text & Call-To-Action buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-100">
                  <Sparkles size={11} className="text-amber-300 animate-pulse" /> 24/7 LPU Peer Support
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
                  Contact Us for Academic Assistance
                </h3>
                <p className="text-indigo-100/90 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                  Stuck with syllabus materials, exam notes, or duty leaves? Our dedicated student community leaders are ready to guide you anytime.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/emergency" 
                  className="px-6 py-3.5 bg-zinc-950 hover:bg-zinc-900 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/20"
                >
                  Emergency Helplines
                </Link>
                <a 
                  href="https://wa.me/917793914091" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-extrabold uppercase tracking-widest text-white hover:text-indigo-100 hover:underline transition-all group/link"
                >
                  <MessageCircle size={15} className="text-emerald-400" />
                  <span>WhatsApp Chat</span>
                  <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Graphic Illustration on the right: Styled Portrait & Floating developer details card */}
            <div className="lg:col-span-5 relative hidden lg:flex h-full items-center justify-end select-none">
              {/* Giant decorative character overlay in background */}
              <div className="text-[12rem] xl:text-[15rem] font-black opacity-10 text-white font-display leading-none mr-24 select-none pointer-events-none">
                LPU
              </div>
              
              {/* Profile Image & Floating Card */}
              <div className="relative mr-4 group/dev">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-500 group-hover/dev:scale-105 group-hover/dev:border-white/40">
                  <img 
                    src="https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png" 
                    alt="Harsha Bacham" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Floating detail badge */}
                <div className="absolute -bottom-2 -right-8 bg-zinc-950/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl max-w-[190px] text-left transform rotate-2 group-hover/dev:rotate-0 transition-all duration-300">
                  <p className="text-[11px] font-black text-white">Harsha Bacham</p>
                  <p className="text-[9px] text-indigo-300 font-medium mb-1">ALFA Portal Developer</p>
                  <a 
                    href="tel:7793914091"
                    className="flex items-center gap-1 text-[10px] text-emerald-400 font-extrabold hover:underline"
                  >
                    <Phone size={9} />
                    <span>7793914091</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-column Directory Menu Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-4">
          
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
                { label: 'AI Syllabus Assistants', path: '/ai-tools' },
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
                { label: 'Social Media Feed', path: '/notifications' },
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

          {/* Column 4: Subscribe Segment */}
          <div className="space-y-4 text-left col-span-2 md:col-span-1">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600 font-display">
              Subscribe
            </h4>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Join our community to receive real-time campus updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative flex items-center">
                <input 
                  type="email" 
                  required
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10"
              >
                {isSubscribed ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-600 leading-normal">
              By subscribing, you agree to our{' '}
              <Link to="/privacy" className="underline hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              .
            </p>
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
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              aria-label="Facebook link"
            >
              <Facebook size={14} />
            </a>
            <a 
              href="https://instagram.com" 
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
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shadow-sm"
              aria-label="YouTube link"
            >
              <Youtube size={14} />
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
