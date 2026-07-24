"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Menu, X, Sun, Moon, Search, Sparkles, ArrowUpRight,
  Home, Bell, Users, Calendar, Bed, BookOpen, 
  GraduationCap, Tag, Cpu, PhoneCall, Youtube, 
  Bookmark, Ticket, ShieldAlert, Sparkle, ArrowRight,
  Clock, Activity, Info, ArrowLeft, Calculator, User
} from "lucide-react";
import { fetchCSV } from "../../services/csvService";
import { CSV_URLS } from "../../constants";
import { Event as AppEvent, PGRoom } from "../../types";

interface FloatingNavProps {
  isDark?: boolean;
  toggleTheme?: () => void;
  className?: string;
}

// All available modules in the ALFA ecosystem with descriptions, categories, badge and brand color schemes
const modulesData = [
  { 
    name: "Dashboard", 
    path: "/", 
    icon: Home, 
    category: "Academic Hub", 
    description: "Your central hub and academic summary overview",
    badge: "Main",
    color: "emerald"
  },
  { 
    name: "Academic Notes", 
    path: "/notes", 
    icon: BookOpen, 
    category: "Academic Hub", 
    description: "LPU syllabus, PYQs, and class notes",
    badge: "Syllabus",
    color: "blue"
  },
  { 
    name: "Duty Leaves", 
    path: "/duty-leaves", 
    icon: Ticket, 
    category: "Academic Hub", 
    description: "Apply and track duty leaf approval letters",
    badge: "LPU-OMs",
    color: "amber"
  },
  { 
    name: "Free Courses", 
    path: "/courses", 
    icon: GraduationCap, 
    category: "Academic Hub", 
    description: "Learn high-demand technical skills for free",
    badge: "Certify",
    color: "indigo"
  },
  { 
    name: "AI Toolbox", 
    path: "/ai-tools", 
    icon: Cpu, 
    category: "Academic Hub", 
    description: "Chat with LPU-tailored AI study helpers",
    badge: "AI power",
    color: "violet"
  },
  { 
    name: "GPA Calculator", 
    path: "/gpa", 
    icon: Calculator, 
    category: "Academic Hub", 
    description: "Calculate & estimate your CGPA and TGPA",
    badge: "GPA",
    color: "emerald"
  },

  { 
    name: "Clubs Hub", 
    path: "/clubs", 
    icon: Users, 
    category: "Campus Life", 
    description: "Explore official LPU student organizations & fests",
    badge: "Join Us",
    color: "pink"
  },
  { 
    name: "Events", 
    path: "/events", 
    icon: Calendar, 
    category: "Campus Life", 
    description: "Hackathons, tech talks, and cultural workshops",
    badge: "Fests",
    color: "rose"
  },
  { 
    name: "Video Library", 
    path: "/youtube", 
    icon: Youtube, 
    category: "Campus Life", 
    description: "Curated guides, tutorials, and life at LPU clips",
    badge: "Vlogs",
    color: "red"
  },
  { 
    name: "Announcements", 
    path: "/notifications", 
    icon: Bell, 
    category: "Campus Life", 
    description: "Real-time updates, notifications & official news",
    badge: "Live",
    color: "sky"
  },
  { 
    name: "Campus Guides", 
    path: "/guides", 
    icon: Sparkles, 
    category: "Campus Life", 
    description: "Senior-vetted roadmaps for placements, fests & academics",
    badge: "Unique",
    color: "amber"
  },

  { 
    name: "PG Rooms", 
    path: "/pg-rooms", 
    icon: Bed, 
    category: "Services & Essentials", 
    description: "Compare local flats, hostels & PG accommodation",
    badge: "Rentals",
    color: "cyan"
  },
  { 
    name: "Marketplace", 
    path: "/deals", 
    icon: Tag, 
    category: "Services & Essentials", 
    description: "Buy and sell secondhand gear and books",
    badge: "Deals",
    color: "orange"
  },
  { 
    name: "Emergency SOS", 
    path: "/emergency", 
    icon: PhoneCall, 
    category: "Services & Essentials", 
    description: "Direct campus helpline dialers & safety SOS",
    badge: "24/7 Helpline",
    color: "red",
    pulse: true
  },
  { 
    name: "My Bookmarks", 
    path: "/bookmarks", 
    icon: Bookmark, 
    category: "Services & Essentials", 
    description: "Your saved academic posts, notes, & articles",
    badge: "Saved",
    color: "purple"
  },
  { 
    name: "My Profile", 
    path: "/profile", 
    icon: User, 
    category: "Services & Essentials", 
    description: "Manage registered clubs, saved events & posted marketplace deals",
    badge: "Profile",
    color: "emerald"
  },
];

const LOGO_URL = "https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 320, 
      damping: 26 
    } 
  },
};

export const FloatingNav: React.FC<FloatingNavProps> = ({
  isDark: initialIsDark,
  toggleTheme: initialToggleTheme,
  className,
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");
  const [greeting, setGreeting] = useState("Hello");
  const location = useLocation();
  const isDashboard = location.pathname === "/";
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [eventTitles, setEventTitles] = useState<Record<number, string>>({});
  const [pgNames, setPgNames] = useState<Record<number, string>>({});

  useEffect(() => {
    if (location.pathname.startsWith('/events/') && Object.keys(eventTitles).length === 0) {
      fetchCSV<AppEvent>(CSV_URLS.EVENTS).then((data) => {
        const titlesMap: Record<number, string> = {};
        data.forEach((evt, idx) => {
          if (evt.title) titlesMap[idx] = evt.title;
        });
        setEventTitles(titlesMap);
      }).catch(err => console.warn("Failed to load event titles for breadcrumb:", err));
    }
    if (location.pathname.startsWith('/pg-rooms/') && Object.keys(pgNames).length === 0) {
      fetchCSV<PGRoom>(CSV_URLS.PG_ROOMS).then((data) => {
        const namesMap: Record<number, string> = {};
        data.forEach((pg, idx) => {
          if (pg.name) namesMap[idx] = pg.name;
        });
        setPgNames(namesMap);
      }).catch(err => console.warn("Failed to load PG names for breadcrumb:", err));
    }
  }, [location.pathname]);

  // Handle local dark mode state if parent didn't pass it down
  const [localIsDark, setLocalIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const isDark = initialIsDark !== undefined ? initialIsDark : localIsDark;

  const handleToggleTheme = () => {
    if (initialToggleTheme) {
      initialToggleTheme();
    } else {
      const nextDark = !localIsDark;
      setLocalIsDark(nextDark);
      if (nextDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  // Lock body scroll and dispatch modal active event when overlay is open
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: isOverlayOpen } }));

    if (isOverlayOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.dispatchEvent(new CustomEvent('alfa-modal-active', { detail: { open: false } }));
      document.body.style.overflow = "";
    };
  }, [isOverlayOpen]);

  // Set time-based greeting
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting("Good Morning");
    } else if (hours < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  // Handle escape key to clear search input first, then close menu overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOverlayOpen) {
        if (searchQuery.trim() !== "") {
          setSearchQuery("");
        } else {
          setIsOverlayOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOverlayOpen, searchQuery]);

  // Auto-close menu overlay when route changes
  useEffect(() => {
    setIsOverlayOpen(false);
  }, [location]);

  const [isModalActive, setIsModalActive] = useState(false);

  useEffect(() => {
    const handleModalActive = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.open === 'boolean') {
        setIsModalActive(customEvent.detail.open);
      }
    };
    window.addEventListener('alfa-modal-active', handleModalActive);
    return () => {
      window.removeEventListener('alfa-modal-active', handleModalActive);
    };
  }, []);

  // Listen for custom menu toggle event
  useEffect(() => {
    const handleToggleMenu = () => {
      setIsOverlayOpen((prev) => !prev);
    };
    window.addEventListener("alfa-toggle-menu", handleToggleMenu);
    return () => {
      window.removeEventListener("alfa-toggle-menu", handleToggleMenu);
    };
  }, []);

  // Scroll behavior: show when scrolling up, hide when scrolling down
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.02) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  // Filter modules based on search input and active tag category
  const filteredModules = useMemo(() => {
    let result = modulesData;
    
    // Filter by quick tag category
    if (activeCategoryFilter !== "All") {
      result = result.filter(m => m.category === activeCategoryFilter);
    }

    // Filter by search text query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.category.toLowerCase().includes(query) ||
          m.badge.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [searchQuery, activeCategoryFilter]);

  // Group filtered modules by category
  const categorizedModules = useMemo(() => {
    const groups: { [key: string]: typeof modulesData } = {};
    filteredModules.forEach((m) => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, [filteredModules]);

  // Category tags for top quick filters
  const filterCategories = ["All", "Academic Hub", "Campus Life", "Services & Essentials"];

  // Helper to color icons and badges dynamically based on item setup
  const getColorClasses = (color: string) => {
    switch(color) {
      case "emerald":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/30",
          text: "text-emerald-600 dark:text-emerald-400",
          border: "border-emerald-200/50 dark:border-emerald-900/40",
          accent: "group-hover:border-emerald-500/50",
          pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        };
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-950/30",
          text: "text-blue-600 dark:text-blue-400",
          border: "border-blue-200/50 dark:border-blue-900/40",
          accent: "group-hover:border-blue-500/50",
          pill: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
        };
      case "amber":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/30",
          text: "text-amber-600 dark:text-amber-400",
          border: "border-amber-200/50 dark:border-amber-900/40",
          accent: "group-hover:border-amber-500/50",
          pill: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        };
      case "indigo":
        return {
          bg: "bg-indigo-50 dark:bg-indigo-950/30",
          text: "text-indigo-600 dark:text-indigo-400",
          border: "border-indigo-200/50 dark:border-indigo-900/40",
          accent: "group-hover:border-indigo-500/50",
          pill: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        };
      case "violet":
        return {
          bg: "bg-violet-50 dark:bg-violet-950/30",
          text: "text-violet-600 dark:text-violet-400",
          border: "border-violet-200/50 dark:border-violet-900/40",
          accent: "group-hover:border-violet-500/50",
          pill: "bg-violet-500/10 text-violet-600 dark:text-violet-400"
        };
      case "pink":
        return {
          bg: "bg-pink-50 dark:bg-pink-950/30",
          text: "text-pink-600 dark:text-pink-400",
          border: "border-pink-200/50 dark:border-pink-900/40",
          accent: "group-hover:border-pink-500/50",
          pill: "bg-pink-500/10 text-pink-600 dark:text-pink-400"
        };
      case "rose":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/30",
          text: "text-rose-600 dark:text-rose-400",
          border: "border-rose-200/50 dark:border-rose-900/40",
          accent: "group-hover:border-rose-500/50",
          pill: "bg-rose-500/10 text-rose-600 dark:text-rose-400"
        };
      case "sky":
        return {
          bg: "bg-sky-50 dark:bg-sky-950/30",
          text: "text-sky-600 dark:text-sky-400",
          border: "border-sky-200/50 dark:border-sky-900/40",
          accent: "group-hover:border-sky-500/50",
          pill: "bg-sky-500/10 text-sky-600 dark:text-sky-400"
        };
      case "cyan":
        return {
          bg: "bg-cyan-50 dark:bg-cyan-950/30",
          text: "text-cyan-600 dark:text-cyan-400",
          border: "border-cyan-200/50 dark:border-cyan-900/40",
          accent: "group-hover:border-cyan-500/50",
          pill: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        };
      case "orange":
        return {
          bg: "bg-orange-50 dark:bg-orange-950/30",
          text: "text-orange-600 dark:text-orange-400",
          border: "border-orange-200/50 dark:border-orange-900/40",
          accent: "group-hover:border-orange-500/50",
          pill: "bg-orange-500/10 text-orange-600 dark:text-orange-400"
        };
      case "purple":
        return {
          bg: "bg-purple-50 dark:bg-purple-950/30",
          text: "text-purple-600 dark:text-purple-400",
          border: "border-purple-200/50 dark:border-purple-900/40",
          accent: "group-hover:border-purple-500/50",
          pill: "bg-purple-500/10 text-purple-600 dark:text-purple-400"
        };
      default:
        return {
          bg: "bg-zinc-50 dark:bg-zinc-900/30",
          text: "text-zinc-600 dark:text-zinc-400",
          border: "border-zinc-200/50 dark:border-zinc-800/40",
          accent: "group-hover:border-zinc-500/50",
          pill: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
        };
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 1, y: -100 }}
          animate={{
            y: (visible || isOverlayOpen) ? 0 : -100,
            opacity: (visible || isOverlayOpen) ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("fixed top-4 md:top-6 inset-x-0 mx-auto z-[5000] w-full max-w-7xl px-4 md:px-6 lg:px-8", className)}
        >
          {/* Main Floating Pill Header */}
          <div className="flex h-14 md:h-16 items-center justify-between rounded-2xl border border-sand-200/60 bg-white/80 px-3 md:px-5 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-300 dark:border-zinc-800/60 dark:bg-zinc-900/80">
            
            {/* Left side: Logo on Dashboard, OR Inline Breadcrumbs on Subpages */}
            {isDashboard ? (
              <Link 
                to="/" 
                onClick={() => setIsOverlayOpen(false)}
                className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-sand-200/50 bg-sand-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-800/80">
                  <img src={LOGO_URL} alt="ALFA" className="h-full w-full object-contain dark:brightness-110" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] md:text-sm font-bold tracking-tight text-primary-500 uppercase font-display">
                    ALFA(LPU)
                  </span>
                  <span className="hidden sm:inline-block text-[8px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
                    Student Portal
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 xs:gap-2 shrink-0 max-w-[65vw] xs:max-w-[72vw] sm:max-w-[80vw] md:max-w-2xl overflow-hidden">
                <Link
                  to="/"
                  onClick={() => setIsOverlayOpen(false)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sand-100/90 dark:bg-zinc-800/90 hover:bg-sand-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs transition-all border border-sand-200/60 dark:border-zinc-700/60 shrink-0 shadow-2xs group"
                  title="Return to Home Dashboard"
                >
                  <ArrowLeft size={13} className="text-primary-500 transition-transform group-hover:-translate-x-0.5" />
                  <span className="hidden xs:inline font-bold">Home</span>
                </Link>

                {/* Inline Breadcrumb Segment Trail */}
                <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl bg-sand-100/60 dark:bg-zinc-950/40 border border-sand-200/30 dark:border-zinc-800/30 overflow-hidden">
                  {location.pathname.split('/').filter(Boolean).map((value, index, array) => {
                    const to = `/${array.slice(0, index + 1).join('/')}`;
                    const isLast = index === array.length - 1;
                    const parentSegment = index > 0 ? array[index - 1] : '';

                    const ROUTE_NAMES: Record<string, string> = {
                      'clubs': 'Clubs',
                      'events': 'Events',
                      'deals': 'Marketplace',
                      'add': 'Post Deal',
                      'notes': 'Notes',
                      'gpa': 'GPA Calc',
                      'pg-rooms': 'PG Rooms',
                      'duty-leaves': 'Duty Leaves',
                      'courses': 'Courses',
                      'ai-tools': 'AI Tools',
                      'emergency': 'Emergency',
                      'youtube': 'YouTube',
                      'about': 'About',
                      'contact': 'Contact',
                      'guides': 'Guides',
                      'notifications': 'Feed',
                      'bookmarks': 'Bookmarks',
                      'profile': 'Profile',
                      'privacy': 'Privacy',
                      'terms': 'Terms',
                      'disclaimer': 'Disclaimer'
                    };

                    let formattedName = ROUTE_NAMES[value];
                    if (!formattedName) {
                      if (/^\d+$/.test(value)) {
                        if (parentSegment === 'events') {
                          formattedName = eventTitles[parseInt(value)] || 'Event Details';
                        } else if (parentSegment === 'pg-rooms') {
                          formattedName = pgNames[parseInt(value)] || 'PG Details';
                        } else {
                          formattedName = 'Details';
                        }
                      } else if (parentSegment === 'notes') {
                        formattedName = decodeURIComponent(value).replace(/-/g, ' ').toUpperCase();
                      } else {
                        formattedName = decodeURIComponent(value)
                          .replace(/-/g, ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase());
                      }
                    }

                    return (
                      <React.Fragment key={to}>
                        <span className="text-zinc-300 dark:text-zinc-600 shrink-0 text-[10px]">/</span>
                        {isLast ? (
                          <span className="text-primary-600 dark:text-primary-400 font-bold truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[220px] md:max-w-[320px]">
                            {formattedName}
                          </span>
                        ) : (
                          <Link
                            to={to}
                            onClick={() => setIsOverlayOpen(false)}
                            className="text-zinc-500 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400 transition-colors shrink-0"
                          >
                            {formattedName}
                          </Link>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Middle: Quick Links on Dashboard */}
            {isDashboard && (
              <div className="hidden md:flex items-center gap-1.5 bg-sand-100/50 dark:bg-zinc-950/40 p-1 rounded-xl border border-sand-200/30 dark:border-zinc-800/20">
                {[
                  { name: "Home", path: "/", icon: Home },
                  { name: "Feed", path: "/notifications", icon: Bell },
                  { name: "Notes", path: "/notes", icon: BookOpen },
                  { name: "Leaves", path: "/duty-leaves", icon: Ticket },
                  { name: "SOS", path: "/emergency", icon: PhoneCall, pulse: true },
                ].map((item, idx) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setIsOverlayOpen(false)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                        isActive
                          ? "bg-white text-primary-500 shadow-sm dark:bg-zinc-900 dark:text-primary-400"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                      )}
                    >
                      <Icon className={cn("h-3.5 w-3.5", item.pulse && "text-rose-500 animate-pulse")} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right: Profile Link, Theme Toggle & Creative Menu Toggle */}
            <div className="flex items-center gap-2">
              {/* Profile button */}
              <Link
                to="/profile"
                onClick={() => setIsOverlayOpen(false)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all cursor-pointer shadow-sm border",
                  location.pathname === "/profile"
                    ? "bg-primary-500 text-white border-primary-600"
                    : "bg-sand-100/80 text-zinc-600 hover:bg-sand-200/80 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-750 border-sand-200/10 dark:border-zinc-800/10"
                )}
                aria-label="User Profile"
                title="User Profile"
              >
                <User size={15} />
              </Link>

              {/* Theme toggler inside pill */}
              <button
                onClick={handleToggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-sand-100/80 text-zinc-600 transition-all hover:bg-sand-200/80 dark:bg-zinc-800/80 dark:text-zinc-400 dark:hover:bg-zinc-750 cursor-pointer shadow-sm border border-sand-200/10 dark:border-zinc-800/10"
                aria-label="Toggle Theme"
              >
                {isDark ? (
                  <Sun size={15} className="text-amber-500 animate-spin-slow" />
                ) : (
                  <Moon size={15} className="text-indigo-500" />
                )}
              </button>

              {/* Dynamic Menu Toggle Button */}
              <button
                onClick={() => setIsOverlayOpen(!isOverlayOpen)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm select-none border",
                  isOverlayOpen
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500/15"
                    : "bg-primary-500 text-white border-primary-600/10 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20"
                )}
              >
                <motion.div
                  animate={{ rotate: isOverlayOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {isOverlayOpen ? <X size={15} /> : <Menu size={15} />}
                </motion.div>
                <span>
                  {isOverlayOpen ? "Close" : "Menu"}
                </span>
              </button>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Fullscreen Premium Bento Sidebar Menu Overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOverlayOpen(false)}
            className="fixed inset-0 z-[4990] bg-black/40 backdrop-blur-xs cursor-pointer"
          />
        )}
        {isOverlayOpen && (
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            onAnimationComplete={() => {
              searchInputRef.current?.focus();
            }}
            className="fixed top-0 left-0 bottom-0 z-[5000] h-full w-[calc(100%-48px)] sm:w-full sm:max-w-[340px] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-3xl border-r border-zinc-200/40 dark:border-zinc-900/50 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Elegant Ambient lighting dot */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Premium Minimalist Header */}
            <div className="p-6 pb-4 shrink-0 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">
                    LPU Portal
                  </span>
                </div>
                <h2 className="text-xl font-extrabold font-display text-zinc-900 dark:text-zinc-50 tracking-tight">
                  Navigation
                </h2>
              </div>

              <button
                onClick={() => setIsOverlayOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/60 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 transition-all cursor-pointer border border-zinc-100 dark:border-zinc-800"
                aria-label="Close menu"
              >
                <X size={15} />
              </button>
            </div>

            {/* Seamless Minimalist Search Line */}
            <div className="px-6 pb-4 shrink-0">
              <div className="relative flex items-center border-b border-zinc-150 dark:border-zinc-900 focus-within:border-primary-500/60 transition-colors py-1.5">
                <Search size={14} className="text-zinc-400 shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search portal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold outline-none text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation List Area */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex-1 overflow-y-auto px-6 py-2 space-y-6 scrollbar-none"
            >
              {filteredModules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShieldAlert size={20} className="text-zinc-300 dark:text-zinc-700 mb-2" />
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
                    No matching pages found
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(""); setActiveCategoryFilter("All"); }}
                    className="mt-3 text-[10px] font-bold text-primary-500 uppercase tracking-wider"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.keys(categorizedModules).map((category) => (
                    <motion.div 
                      key={category} 
                      variants={itemVariants}
                      layout="position"
                      className="space-y-3"
                    >
                      {/* Editorial Tiny Category Label */}
                      <span className="text-[9px] font-extrabold uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-600 block">
                        {category}
                      </span>

                      {/* Clean List Rows */}
                      <div className="space-y-1">
                        {categorizedModules[category].map((module) => {
                          const Icon = module.icon;
                          const isActive = location.pathname === module.path;
                          const colors = getColorClasses(module.color);

                          return (
                            <motion.div
                              key={module.path}
                              variants={itemVariants}
                              layout="position"
                              className="relative"
                            >
                              <Link
                                to={module.path}
                                onClick={() => setIsOverlayOpen(false)}
                                className={cn(
                                  "group flex items-center gap-3.5 py-2.5 px-3 rounded-xl transition-all duration-200 relative",
                                  isActive
                                    ? "bg-zinc-50 dark:bg-zinc-900/40 font-bold"
                                    : "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20"
                                )}
                              >
                                {/* Precise Left Indicator bar */}
                                {isActive && (
                                  <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-md bg-primary-500"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                  />
                                )}

                                {/* Left Minimal Icon Indicator */}
                                <div className={cn(
                                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 border",
                                  isActive
                                    ? "bg-primary-500 border-primary-600 text-white"
                                    : "bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-500 group-hover:scale-105"
                                )}>
                                  <Icon size={13} className={module.pulse ? "animate-pulse" : ""} />
                                </div>

                                {/* Title & Short Subtitle */}
                                <div className="flex-grow min-w-0">
                                  <span className={cn(
                                    "block text-xs font-bold leading-none tracking-tight transition-colors duration-150",
                                    isActive
                                      ? "text-primary-500"
                                      : "text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white"
                                  )}>
                                    {module.name}
                                  </span>
                                  <span className="block text-[9px] text-zinc-400 dark:text-zinc-600 mt-1 truncate">
                                    {module.description}
                                  </span>
                                </div>

                                {/* Clean right chevron arrow on hover */}
                                <ArrowRight 
                                  size={11} 
                                  className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 text-zinc-400 shrink-0" 
                                />
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
