import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FloatingNav } from './ui/floating-navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex min-h-screen bg-sand-100 dark:bg-zinc-950 overflow-x-hidden w-full max-w-full">
      {/* Dynamic Floating Premium Navbar - Global for All Pages */}
      <FloatingNav isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="relative flex-grow min-h-screen bg-sand-100 dark:bg-zinc-950 bg-grid-pattern flex flex-col overflow-x-hidden w-full max-w-full">
        <div className="flex-grow pt-24 md:pt-28 pb-16 w-full overflow-x-hidden max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
