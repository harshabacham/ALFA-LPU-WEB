
import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('alfa_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('alfa_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:w-[400px] z-[1000] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-2xl border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full"></div>
        
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-2xl glow-primary">
            <Cookie size={24} />
          </div>
          <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-100">Cookie Choice</h4>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
          We use cookies to improve your experience and serve relevant ads via Google AdSense. See our <Link to="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link> for details.
        </p>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={handleAccept}
            className="flex-grow py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 glow-primary"
          >
            <Check size={16} /> Accept All
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
