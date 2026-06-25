import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Bell, Shield, PhoneCall, Compass, ArrowLeft, Sun, Moon
} from 'lucide-react';
import { FloatingNav } from './ui/floating-navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleModalState = (e: any) => {
      const isOpen = e.detail?.open;
      setIsModalActive(isOpen);
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    };
    window.addEventListener('alfa-modal-active', handleModalState);
    return () => {
      window.removeEventListener('alfa-modal-active', handleModalState);
    };
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const isDashboard = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-sand-100 dark:bg-zinc-950">
      {/* Dynamic Floating Premium Navbar - Global for All Pages */}
      <FloatingNav isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-grow min-h-screen bg-sand-100 dark:bg-zinc-950 bg-grid-pattern flex flex-col">
        <div className="flex-grow pt-24 md:pt-28 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
          {children}
        </div>
        <Footer />
      </main>

      {/* Mobile Quick Nav - Dashboard Only */}
      {isDashboard && (
        <nav className={`lg:hidden fixed bottom-4 left-4 right-4 z-[100] bg-sand-50/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-sand-200/60 dark:border-zinc-800/50 px-5 py-3 rounded-2xl flex justify-between items-center transition-transform duration-300 shadow-xl ${isModalActive ? 'translate-y-20' : ''}`}>
          <Link to="/" className={`flex flex-col items-center gap-1 flex-1 transition-all ${location.pathname === '/' ? 'text-primary-600 dark:text-primary-400 scale-105' : 'text-zinc-400'}`}>
            <Home size={18} />
            <span className="text-[9px] font-medium uppercase tracking-wider font-display">Home</span>
          </Link>
          <Link to="/notifications" className={`flex flex-col items-center gap-1 flex-1 transition-all ${location.pathname === '/notifications' ? 'text-primary-600 dark:text-primary-400 scale-105' : 'text-zinc-400'}`}>
            <Bell size={18} />
            <span className="text-[9px] font-medium uppercase tracking-wider text-center font-display">Feed</span>
          </Link>
          <div className="flex-1 flex justify-center">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('alfa-toggle-menu'))} 
              className="relative -top-6 w-12 h-12 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-600/30 flex items-center justify-center transform active:scale-90 transition-all border border-primary-500/30 cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Compass size={20} className="animate-spin-slow" />
            </button>
          </div>
          <Link to="/privacy" className={`flex flex-col items-center gap-1 flex-1 transition-all ${location.pathname === '/privacy' ? 'text-primary-600 dark:text-primary-400 scale-105' : 'text-zinc-400'}`}>
            <Shield size={18} />
            <span className="text-[9px] font-medium uppercase tracking-wider text-center font-display">Privacy</span>
          </Link>
          <Link to="/emergency" className={`flex flex-col items-center gap-1 flex-1 transition-all ${location.pathname === '/emergency' ? 'text-primary-600 dark:text-primary-400 scale-105' : 'text-zinc-400'}`}>
            <PhoneCall size={18} />
            <span className="text-[9px] font-medium uppercase tracking-wider font-display">SOS</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

export default Layout;
