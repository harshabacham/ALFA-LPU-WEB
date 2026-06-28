import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, LifeBuoy } from "lucide-react";
import { WarningGraphic } from "../components/ui/warning-graphic";

interface NotFoundProps {
  title?: string;
  description?: string;
  showBackHome?: boolean;
}

export const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  description = "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.",
  showBackHome = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12 text-center relative overflow-hidden select-none">
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#fe7f2d]/5 rounded-full blur-[100px] pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto space-y-8">
        {/* Animated Custom Warning Graphic */}
        <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/40 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.02)] backdrop-blur-md transform hover:scale-[1.01] transition-transform duration-500">
          <WarningGraphic
            width={320}
            height={110}
            enableAnimations={true}
            animationSpeed={1.2}
            className="drop-shadow-[0_4px_12px_rgba(253,194,33,0.15)] max-w-full"
            color="#fe7f2d"
          />
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <span className="text-[10px] font-black tracking-[0.25em] text-[#fe7f2d] uppercase font-mono">
            Error Code: 404 / CONNECTION_STALE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all border border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer shadow-sm active:scale-98"
          >
            <ArrowLeft size={14} className="text-zinc-500" />
            <span>Go Back</span>
          </button>

          {showBackHome && (
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-[#fe7f2d] hover:bg-[#ee6517] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-[#fe7f2d]/10 active:scale-98"
            >
              <Home size={14} />
              <span>Go to Home</span>
            </Link>
          )}

          <Link
            to="/emergency"
            className="w-full sm:w-auto px-6 py-3 bg-zinc-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all border border-transparent hover:border-zinc-200/60 dark:hover:border-zinc-800/60 cursor-pointer"
          >
            <LifeBuoy size={14} />
            <span>Emergency Help</span>
          </Link>
        </div>

        {/* System Diagnostics Hints */}
        <div className="pt-6 border-t border-zinc-150 dark:border-zinc-850/60 w-full">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wide">
            💡 Network Check: Active • Student Portal API V1.4.2
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
