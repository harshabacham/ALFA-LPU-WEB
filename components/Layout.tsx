
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Sun, Moon, Home, Bell, Users, Calendar, 
  Bed, FileText, BookOpen, GraduationCap, Tag, Cpu, 
  PhoneCall, Compass, Youtube, Shield
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const LOGO_URL = "https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png";

const navLinks = [
  { name: 'Dashboard', path: '/', icon: Home },
  { name: 'Announcements', path: '/notifications', icon: Bell },
  { name: 'Clubs Hub', path: '/clubs', icon: Users },
  { name: 'Events', path: '/events', icon: Calendar },
  { name: 'Emergency', path: '/emergency', icon: PhoneCall },
  { name: 'Video Library', path: '/youtube', icon: Youtube },
  { name: 'PG Rooms', path: '/pg-rooms', icon: Bed },
  { name: 'Duty Leaves', path: '/duty-leaves', icon: FileText },
  { name: 'Academic Notes', path: '/notes', icon: BookOpen },
  { name: 'Free Courses', path: '/courses', icon: GraduationCap },
  { name: 'Marketplace', path: '/deals', icon: Tag },
  { name: 'AI Toolbox', path: '/ai-tools', icon: Cpu },
];

const NavItem: React.FC<{ link: typeof navLinks[0]; isActive: boolean }> = ({ link, isActive }) => {
  return (
    <Link
      to={link.path}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${
        isActive 
          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 glow-primary' 
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-primary-600 dark:hover:text-primary-400'
      }`}
    >
      <link.icon size={18} className={isActive ? 'text-white' : 'group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'} />
      <span className="text-sm font-bold tracking-tight">{link.name}</span>
      {isActive && <div className="ml-auto w-1 h-1 bg-white rounded-full"></div>}
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleModalState = (e: any) => {
      const isOpen = e.detail?.open;
      setIsModalActive(isOpen);
      if (isOpen) {
        setIsSidebarOpen(false);
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

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800/50 z-[110] transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isModalActive ? 'lg:-translate-x-full' : ''}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 pb-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl overflow-hidden flex items-center justify-center p-1 border border-zinc-100 dark:border-zinc-700 shadow-sm transition-all group-hover:shadow-md shrink-0">
                <img src={LOGO_URL} alt="ALFA" className="w-full h-full object-contain dark:brightness-110" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tighter leading-none mb-1 uppercase">ALFA(LPU)</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest truncate">Community Platform</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex-grow overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
            {navLinks.map(link => (
              <NavItem key={link.path} link={link} isActive={location.pathname === link.path} />
            ))}
            <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-4 my-2"></div>
            <Link to="/privacy" className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${location.pathname === '/privacy' ? 'bg-primary-600 text-white' : 'text-zinc-400 hover:text-primary-600 dark:hover:text-primary-400'}`}>
              <Shield size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">Privacy Policy</span>
            </Link>
          </div>

          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-transparent hover:border-primary-500/20 transition-all shadow-sm">
              <div className="p-1.5 bg-white dark:bg-zinc-700 rounded-lg shadow-sm">
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <div className="mt-4 px-4 py-2 bg-primary-500/5 rounded-xl border border-primary-500/10">
               <p className="text-[8px] font-black text-primary-600/60 uppercase tracking-[0.2em] text-center">AdSense Optimized</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header Overlay */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-900 z-[100] px-5 flex items-center justify-between transition-transform duration-300 ${isModalActive ? '-translate-y-full' : ''}`}>
        <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 flex items-center justify-center bg-primary-600 text-white rounded-lg shadow-lg">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="ALFA" className="h-6 w-6 object-contain" />
          <span className="font-black text-sm tracking-tighter dark:text-zinc-100 uppercase">ALFA(LPU)</span>
        </div>
        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {isSidebarOpen && !isModalActive && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[105] animate-in fade-in" onClick={() => setIsSidebarOpen(false)} />
      )}

      <main className={`flex-grow transition-all duration-500 ${isModalActive ? 'lg:ml-0' : 'lg:ml-64'} min-h-screen bg-zinc-50 dark:bg-zinc-950`}>
        <div className="pt-20 lg:pt-0 pb-32 lg:pb-12">
          {children}
        </div>
      </main>

      {/* Mobile Quick Nav */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border-t border-zinc-100 dark:border-zinc-800/50 px-6 py-4 flex justify-between items-center transition-transform duration-300 ${isModalActive ? 'translate-y-full' : ''}`}>
        <Link to="/" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/' ? 'text-primary-600' : 'text-zinc-400'}`}>
          <Home size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </Link>
        <Link to="/notifications" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/notifications' ? 'text-primary-600' : 'text-zinc-400'}`}>
          <Bell size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center">Feed</span>
        </Link>
        <div className="flex-1 flex justify-center">
          <button onClick={() => setIsSidebarOpen(true)} className="relative -top-8 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl border-4 border-white dark:border-zinc-950 flex items-center justify-center transform active:scale-90 transition-all">
            <Compass size={24} />
          </button>
        </div>
        <Link to="/privacy" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/privacy' ? 'text-primary-600' : 'text-zinc-400'}`}>
          <Shield size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest text-center">Privacy</span>
        </Link>
        <Link to="/emergency" className={`flex flex-col items-center gap-1 flex-1 ${location.pathname === '/emergency' ? 'text-primary-600' : 'text-zinc-400'}`}>
          <PhoneCall size={20} />
          <span className="text-[8px] font-black uppercase tracking-widest">SOS</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;
