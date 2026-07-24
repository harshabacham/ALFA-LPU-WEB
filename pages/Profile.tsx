import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, UserCheck, Edit3, Trash2, Plus, Users, Calendar, Tag, Sparkles, 
  ExternalLink, Clock, MapPin, Phone, Mail, CheckCircle2, X, Bookmark, 
  ShieldCheck, GraduationCap, LogOut, LogIn, Share2, AlertCircle, ArrowRight, 
  Search, Check, Camera, Settings, ArrowUpRight, Calculator, RefreshCw,
  Radio, Activity, Database, CheckCircle, Flame
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from '../services/firebase';
import { userProfileService, UserProfileData } from '../services/userProfileService';
import { useBookmarks } from '../lib/bookmarks';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Club, Event as AppEvent, Deal } from '../types';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { events: savedEvents, toggleEvent } = useBookmarks();

  // User State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>(userProfileService.getProfile());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit Form State
  const [editForm, setEditForm] = useState<UserProfileData>(profileData);

  // Profile Collections
  const [registeredClubs, setRegisteredClubs] = useState<Club[]>([]);
  const [postedDeals, setPostedDeals] = useState<Deal[]>([]);
  const [liveSavedEvents, setLiveSavedEvents] = useState<AppEvent[]>([]);

  // Real-time Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [liveSheetCounts, setLiveSheetCounts] = useState({ clubs: 0, events: 0, deals: 0 });

  // Active Tab
  const [activeTab, setActiveTab] = useState<'clubs' | 'events' | 'deals' | 'settings'>('clubs');

  // Filter terms inside tabs
  const [clubSearch, setClubSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [dealSearch, setDealSearch] = useState('');

  // Toast / Status Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addSyncLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSyncLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const current = userProfileService.getProfile();
        const updatedProfile: UserProfileData = {
          ...current,
          displayName: (current.displayName && current.displayName !== 'LPU Student') ? current.displayName : (user.displayName || current.displayName),
          email: (current.email && current.email !== 'student@lpu.in') ? current.email : (user.email || current.email),
          photoURL: user.photoURL || current.photoURL
        };
        userProfileService.saveProfile(updatedProfile);
        setProfileData(updatedProfile);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time Live Data Sync Function
  const syncRealtimeData = useCallback(async (isManual = false) => {
    setIsSyncing(true);
    const nowStr = new Date().toLocaleTimeString();

    try {
      // 1. Load local baseline data
      const localJoinedClubs = userProfileService.getJoinedClubs();
      const localDeals = userProfileService.getPostedDeals();
      const currentProfile = userProfileService.getProfile();

      // Preserve profile choices and Google credentials seamlessly
      const effectiveProfile: UserProfileData = firebaseUser ? {
        ...currentProfile,
        displayName: (currentProfile.displayName && currentProfile.displayName !== 'LPU Student') ? currentProfile.displayName : (firebaseUser.displayName || currentProfile.displayName),
        email: (currentProfile.email && currentProfile.email !== 'student@lpu.in') ? currentProfile.email : (firebaseUser.email || currentProfile.email),
        photoURL: firebaseUser.photoURL || currentProfile.photoURL
      } : currentProfile;

      setProfileData(effectiveProfile);

      // 2. Fetch live remote data from Google Sheets CSVs
      const [liveClubsCSV, liveEventsCSV, liveDealsCSV] = await Promise.all([
        fetchCSV<Club>(CSV_URLS.CLUBS).catch(() => []),
        fetchCSV<AppEvent>(CSV_URLS.EVENTS).catch(() => []),
        fetchCSV<Deal>(CSV_URLS.DEALS).catch(() => [])
      ]);

      setLiveSheetCounts({
        clubs: liveClubsCSV.length,
        events: liveEventsCSV.length,
        deals: liveDealsCSV.length
      });

      // Enrich Registered Clubs with Live CSV updates
      const enrichedJoinedClubs = localJoinedClubs.map(localClub => {
        const liveMatch = liveClubsCSV.find(c => 
          (c.id && localClub.id && c.id === localClub.id) || 
          (c.name && localClub.name && c.name.toLowerCase().trim() === localClub.name.toLowerCase().trim())
        );
        if (liveMatch) {
          return {
            ...localClub,
            ...liveMatch,
            // Retain id if locally defined
            id: localClub.id || liveMatch.id
          };
        }
        return localClub;
      });
      setRegisteredClubs(enrichedJoinedClubs);

      // Enrich Saved Events with Live CSV updates
      const enrichedSavedEvents = savedEvents.map(b => {
        const liveMatch = liveEventsCSV.find(e => 
          (e.title && b.item.title && e.title.toLowerCase().trim() === b.item.title.toLowerCase().trim()) ||
          (e.id && b.item.id && e.id === b.item.id)
        );
        return liveMatch ? { ...b.item, ...liveMatch } : b.item;
      });
      setLiveSavedEvents(enrichedSavedEvents);

      // Merge local posted deals with user's remote deals from live sheet
      const userEmail = (firebaseUser?.email || currentProfile.email || '').toLowerCase().trim();
      const userName = (firebaseUser?.displayName || currentProfile.displayName || '').toLowerCase().trim();

      const matchedRemoteDeals = liveDealsCSV.filter(d => {
        if (!d.title) return false;
        const sEmail = (d.seller_email || '').toLowerCase().trim();
        const sName = (d.seller_name || '').toLowerCase().trim();
        const contact = (d.contact || '').toLowerCase().trim();
        return (userEmail && sEmail === userEmail) || (userName && sName === userName) || (currentProfile.phone && contact.includes(currentProfile.phone));
      });

      // Deduplicate deals by ID / title
      const dealMap = new Map<string, Deal>();
      localDeals.forEach(d => dealMap.set(d.id || d.title, d));
      matchedRemoteDeals.forEach(d => {
        const key = d.id || d.title;
        if (!dealMap.has(key)) {
          dealMap.set(key, d);
        }
      });

      setPostedDeals(Array.from(dealMap.values()));
      setLastSyncedAt(nowStr);

      addSyncLog(`Live data sync finished (${liveClubsCSV.length} clubs, ${liveEventsCSV.length} events, ${liveDealsCSV.length} deals fetched).`);
      if (isManual) {
        showToast(`Real-time sync complete! Updated ${enrichedJoinedClubs.length} clubs & ${enrichedSavedEvents.length} events.`);
      }
    } catch (err) {
      console.error('Failed to sync live data', err);
      addSyncLog(`Sync error: ${String(err)}`);
    } finally {
      setIsSyncing(false);
    }
  }, [savedEvents, firebaseUser]);

  // Initial Sync & Real-time Listeners
  useEffect(() => {
    syncRealtimeData();

    // Custom Event Listeners
    const handleLocalUpdate = () => {
      addSyncLog('Local profile/bookmark update event detected.');
      syncRealtimeData();
    };

    window.addEventListener('alfa_profile_updated', handleLocalUpdate);
    window.addEventListener('alfa_bookmarks_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);
    window.addEventListener('focus', handleLocalUpdate);

    return () => {
      window.removeEventListener('alfa_profile_updated', handleLocalUpdate);
      window.removeEventListener('alfa_bookmarks_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      window.removeEventListener('focus', handleLocalUpdate);
    };
  }, [syncRealtimeData]);

  // Real-time Polling Interval (Every 15 Seconds)
  useEffect(() => {
    if (!autoSyncEnabled) return;
    const interval = setInterval(() => {
      syncRealtimeData();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoSyncEnabled, syncRealtimeData]);

  // Handle Profile Form Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    userProfileService.saveProfile(editForm);
    setProfileData(editForm);
    setIsEditModalOpen(false);
    showToast('Profile updated successfully!');
    addSyncLog('User profile settings updated locally.');
  };

  // Google Login / Logout Handlers
  const handleGoogleAuth = async () => {
    if (firebaseUser) {
      try {
        await signOut(auth);
        showToast('Signed out of Google account.');
        addSyncLog('User signed out.');
      } catch (err) {
        console.error('Sign out error', err);
      }
    } else {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        if (res.user) {
          showToast(`Welcome back, ${res.user.displayName || 'Student'}!`);
          addSyncLog(`User authenticated via Google: ${res.user.email}`);
        }
      } catch (err) {
        console.error('Google Auth Error', err);
      }
    }
  };

  // Handle Unregistering Club
  const handleUnregisterClub = (club: Club) => {
    userProfileService.toggleJoinClub(club);
    syncRealtimeData();
    showToast(`Removed "${club.name}" from your registered clubs.`);
    addSyncLog(`Unregistered from club: ${club.name}`);
  };

  // Handle Deleting Posted Deal
  const handleDeleteDeal = (dealId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete listing "${title}"?`)) {
      userProfileService.deletePostedDeal(dealId);
      syncRealtimeData();
      showToast(`Listing "${title}" removed.`);
      addSyncLog(`Deleted marketplace listing: ${title}`);
    }
  };

  // Handle Toggle Deal Sold
  const handleToggleSold = (dealId: string) => {
    userProfileService.toggleDealSoldStatus(dealId);
    syncRealtimeData();
    showToast('Listing status updated.');
    addSyncLog(`Updated status for deal ID: ${dealId}`);
  };

  // Filtered collections
  const filteredClubs = registeredClubs.filter(c => 
    (c.name || '').toLowerCase().includes(clubSearch.toLowerCase()) ||
    (c.category || '').toLowerCase().includes(clubSearch.toLowerCase())
  );

  const filteredEvents = liveSavedEvents.filter(e => 
    (e.title || '').toLowerCase().includes(eventSearch.toLowerCase()) ||
    (e.venue || '').toLowerCase().includes(eventSearch.toLowerCase())
  );

  const filteredDeals = postedDeals.filter(d => 
    (d.title || '').toLowerCase().includes(dealSearch.toLowerCase()) ||
    (d.category || '').toLowerCase().includes(dealSearch.toLowerCase())
  );

  // Direct Image Helper
  const getDirectImageUrl = (urlOrId: any) => {
    if (!urlOrId) return "";
    let clean = String(urlOrId).trim().replace(/['"]/g, '');
    const idMatch = clean.match(/\/d\/([a-zA-Z0-9_-]{25,})/) || 
                    clean.match(/[?&]id=([a-zA-Z0-9_-]{25,})/) ||
                    clean.match(/\/open\?id=([a-zA-Z0-9_-]{25,})/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
    }
    return clean;
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = (event: AppEvent) => {
    const title = encodeURIComponent(event.title || 'LPU Campus Event');
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.venue || 'LPU Campus');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-8 animate-in fade-in duration-300 text-left">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[6000] bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-3 rounded-2xl shadow-2xl border border-zinc-700/50 flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {!firebaseUser && !isGuestMode ? (
        <div className="bg-white dark:bg-zinc-900/80 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800 p-8 md:p-12 shadow-sm space-y-8 text-center max-w-3xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-lg shadow-primary-500/20">
            <User size={38} />
          </div>

          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest border border-primary-500/20">
              ALFA LPU Student Account
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50 font-display tracking-tight">
              Sign In to Create & Manage Your Student Profile
            </h1>
            <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Authenticate with your Google account to customize your student details, track registered clubs, sync saved campus events to Google Calendar, and manage marketplace listings with real-time live data updates.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0"><Users size={16} /></div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Registered Clubs</h4>
                <p className="text-[11px] text-zinc-500">Track joined LPU societies with live sheet sync</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
              <div className="p-2 bg-rose-500/10 text-rose-500 rounded-xl shrink-0"><Calendar size={16} /></div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Saved Events & Fests</h4>
                <p className="text-[11px] text-zinc-500">Calendar integration for hackathons & concerts</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0"><Tag size={16} /></div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Marketplace Listings</h4>
                <p className="text-[11px] text-zinc-500">List books, gear & bikes for sale on campus</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl shrink-0"><GraduationCap size={16} /></div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Academic & CGPA</h4>
                <p className="text-[11px] text-zinc-500">Save Roll No., Branch & target CGPA estimator</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleGoogleAuth}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-2xl text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-md flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign In with Google</span>
            </button>

            <button
              onClick={() => setIsGuestMode(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              Preview as Guest
            </button>
          </div>
        </div>
      ) : (
        <>
          {!firebaseUser && isGuestMode && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500 shrink-0" />
                <span>Viewing in Guest Preview mode. Sign in with Google to create and sync your student profile permanently.</span>
              </div>
              <button
                onClick={handleGoogleAuth}
                className="px-3.5 py-1.5 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-all cursor-pointer shrink-0"
              >
                Sign In with Google
              </button>
            </div>
          )}

          {/* 1. Profile Header Card */}
      <div className="relative bg-white dark:bg-zinc-900/60 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/50 p-6 md:p-8 shadow-sm overflow-hidden">
        {/* Subtle Decorative Ambient Gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Main Info */}
          <div className="flex items-start md:items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-primary-500 to-indigo-600 p-1 shadow-md">
                <img 
                  src={firebaseUser?.photoURL || profileData.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profileData.displayName)}`} 
                  alt={profileData.displayName} 
                  className="w-full h-full object-cover rounded-[1.3rem] bg-white dark:bg-zinc-900"
                />
              </div>
              {firebaseUser && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-white dark:ring-zinc-900" title="Verified Account">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 font-display tracking-tight truncate">
                  {firebaseUser?.displayName || profileData.displayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 text-[10px] font-black uppercase tracking-wider border border-primary-500/20">
                  {profileData.branch || 'LPU Student'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-zinc-400" />
                  {firebaseUser?.email || profileData.email}
                </span>
                {profileData.rollNumber && (
                  <span className="flex items-center gap-1 font-mono text-[11px] bg-zinc-100 dark:bg-zinc-800/60 px-2 py-0.5 rounded-md text-zinc-700 dark:text-zinc-300">
                    ID: {profileData.rollNumber}
                  </span>
                )}
                {profileData.year && (
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} className="text-zinc-400" />
                    {profileData.year}
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal pt-1 max-w-2xl">
                {profileData.bio || 'No bio provided.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
            <button
              onClick={() => {
                setEditForm(profileData);
                setIsEditModalOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-2xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleGoogleAuth}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                firebaseUser 
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20' 
                  : 'bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
              }`}
            >
              {firebaseUser ? (
                <>
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  <span>Sign In with Google</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Overview Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Clubs KPI */}
        <div 
          onClick={() => setActiveTab('clubs')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'clubs' 
              ? 'bg-primary-500 text-white border-primary-600 shadow-md scale-[1.02]' 
              : 'bg-white dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeTab === 'clubs' ? 'text-primary-100' : 'text-zinc-400'}`}>
              Registered Clubs
            </span>
            <div className={`p-2 rounded-xl ${activeTab === 'clubs' ? 'bg-white/20' : 'bg-primary-500/10 text-primary-500'}`}>
              <Users size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${activeTab === 'clubs' ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
              {registeredClubs.length}
            </span>
            <span className={`text-[10px] font-bold ${activeTab === 'clubs' ? 'text-white/80' : 'text-zinc-400'}`}>
              Live Synced
            </span>
          </div>
        </div>

        {/* Saved Events KPI */}
        <div 
          onClick={() => setActiveTab('events')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'events' 
              ? 'bg-primary-500 text-white border-primary-600 shadow-md scale-[1.02]' 
              : 'bg-white dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeTab === 'events' ? 'text-primary-100' : 'text-zinc-400'}`}>
              Saved Events
            </span>
            <div className={`p-2 rounded-xl ${activeTab === 'events' ? 'bg-white/20' : 'bg-rose-500/10 text-rose-500'}`}>
              <Calendar size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${activeTab === 'events' ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
              {liveSavedEvents.length}
            </span>
            <span className={`text-[10px] font-bold ${activeTab === 'events' ? 'text-white/80' : 'text-zinc-400'}`}>
              Bookmarked
            </span>
          </div>
        </div>

        {/* Deals KPI */}
        <div 
          onClick={() => setActiveTab('deals')}
          className={`p-5 rounded-3xl border transition-all cursor-pointer ${
            activeTab === 'deals' 
              ? 'bg-primary-500 text-white border-primary-600 shadow-md scale-[1.02]' 
              : 'bg-white dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-black uppercase tracking-wider ${activeTab === 'deals' ? 'text-primary-100' : 'text-zinc-400'}`}>
              Posted Listings
            </span>
            <div className={`p-2 rounded-xl ${activeTab === 'deals' ? 'bg-white/20' : 'bg-amber-500/10 text-amber-500'}`}>
              <Tag size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-2xl font-black font-display ${activeTab === 'deals' ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
              {postedDeals.length}
            </span>
            <span className={`text-[10px] font-bold ${activeTab === 'deals' ? 'text-white/80' : 'text-zinc-400'}`}>
              Marketplace
            </span>
          </div>
        </div>

        {/* Target GPA KPI */}
        <div 
          onClick={() => navigate('/gpa')}
          className="p-5 rounded-3xl border bg-white dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/50 hover:border-zinc-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Target CGPA
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Calculator size={16} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-display text-zinc-900 dark:text-white">
              {profileData.targetGpa || '8.5'}
            </span>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
              Calculate <ArrowUpRight size={10} />
            </span>
          </div>
        </div>

      </div>

      {/* 3. Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'clubs', label: 'My Registered Clubs', icon: Users, count: registeredClubs.length },
          { id: 'events', label: 'Saved Events', icon: Calendar, count: liveSavedEvents.length },
          { id: 'deals', label: 'My Marketplace Deals', icon: Tag, count: postedDeals.length },
          { id: 'settings', label: 'Academic & Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isActive 
                    ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: REGISTERED CLUBS */}
      {activeTab === 'clubs' && (
        <div className="space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <span>Registered Club Memberships</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your active campus student organizations with real-time Google Sheet synchronization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Filter registered clubs..."
                  value={clubSearch}
                  onChange={(e) => setClubSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-100 outline-none focus:border-primary-500"
                />
              </div>

              <Link
                to="/clubs"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 rounded-xl text-xs font-extrabold hover:bg-primary-500/20 transition-all shrink-0"
              >
                <Plus size={14} />
                <span>Explore Clubs</span>
              </Link>
            </div>
          </div>

          {/* Clubs Grid */}
          {filteredClubs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClubs.map((club, idx) => (
                <div 
                  key={club.id || idx}
                  className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-2 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shrink-0">
                        {club.logo_link ? (
                          <img 
                            src={getDirectImageUrl(club.logo_link)} 
                            alt={club.name} 
                            className="w-full h-full object-contain rounded-lg"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Users size={22} className="text-zinc-400" />
                        )}
                      </div>

                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20 flex items-center gap-1">
                        <Check size={11} /> Registered
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 leading-snug">
                        {club.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {club.description || 'Active campus student society.'}
                      </p>
                    </div>

                    {club.meeting_times && (
                      <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium bg-zinc-50 dark:bg-zinc-800/50 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <Clock size={13} className="text-zinc-400 shrink-0" />
                        <span className="truncate">{club.meeting_times}</span>
                      </div>
                    )}
                  </div>

                  {/* Club Actions */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-2">
                    {club.form_link && (
                      <a 
                        href={club.form_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                      >
                        <span>Join Form</span>
                        <ArrowUpRight size={12} />
                      </a>
                    )}

                    <button
                      onClick={() => handleUnregisterClub(club)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                      title="Unregister from club"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
              <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-3xl flex items-center justify-center mx-auto">
                <Users size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No registered clubs found</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {clubSearch ? 'No registered clubs match your search filter.' : 'You haven’t registered for any campus clubs yet. Explore active LPU communities!'}
                </p>
              </div>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-2xl text-xs font-bold hover:bg-primary-600 transition-all shadow-sm"
              >
                <Plus size={14} /> Browse Clubs Directory
              </Link>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SAVED EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <span>Saved Campus Events & Fests</span>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase border border-rose-500/20">
                  Live Timings
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Bookmarked hackathons, cultural workshops, and star nights with live Google Sheet date updates.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Filter saved events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-100 outline-none focus:border-primary-500"
                />
              </div>

              <Link
                to="/events"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl text-xs font-extrabold hover:bg-rose-500/20 transition-all shrink-0"
              >
                <Plus size={14} />
                <span>Explore Events</span>
              </Link>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Event Banner */}
                    <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                          <Calendar size={32} />
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          toggleEvent(event, index);
                          syncRealtimeData();
                          showToast(`Removed "${event.title}" from saved events.`);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur text-rose-400 hover:text-white transition-all cursor-pointer"
                        title="Remove bookmark"
                      >
                        <Trash2 size={14} />
                      </button>

                      {event.price && (
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-zinc-900/80 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider">
                          {event.price}
                        </span>
                      )}
                    </div>

                    <div className="p-6 pt-0 space-y-3">
                      <div className="space-y-1">
                        <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                          {event.title}
                        </h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="space-y-2 text-[11px] text-zinc-600 dark:text-zinc-300 font-medium">
                        {event.date && (
                          <div className="flex items-center gap-2">
                            <Clock size={13} className="text-rose-500 shrink-0" />
                            <span>{event.date} {event.time ? `• ${event.time}` : ''}</span>
                          </div>
                        )}
                        {event.venue && (
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="text-rose-500 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 flex items-center gap-2">
                    <a
                      href={getGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      <Calendar size={13} />
                      <span>Add to Calendar</span>
                    </a>

                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-primary-500 text-white rounded-xl text-xs font-bold hover:bg-primary-600 transition-all"
                        title="Open Registration Link"
                      >
                        <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto">
                <Calendar size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No saved events</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {eventSearch ? 'No saved events match your filter.' : 'Bookmark upcoming campus hackathons, cultural fests, and workshops to keep track!'}
                </p>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-2xl text-xs font-bold hover:bg-rose-600 transition-all shadow-sm"
              >
                <Plus size={14} /> Browse Campus Events
              </Link>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: MARKETPLACE LISTINGS */}
      {activeTab === 'deals' && (
        <div className="space-y-6">
          
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-display flex items-center gap-2">
                <span>My Marketplace Listings</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase border border-amber-500/20">
                  Live Feed
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your active secondhand textbook, gadget, bicycle, and room gear listings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Filter listings..."
                  value={dealSearch}
                  onChange={(e) => setDealSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-800 dark:text-zinc-100 outline-none focus:border-amber-500"
                />
              </div>

              <Link
                to="/deals/add"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl text-xs font-extrabold hover:bg-amber-500/20 transition-all shrink-0"
              >
                <Plus size={14} />
                <span>Post New Deal</span>
              </Link>
            </div>
          </div>

          {/* Listings Grid */}
          {filteredDeals.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => {
                const isSold = (deal as any).isSold;
                return (
                  <div 
                    key={deal.id || deal.title}
                    className={`bg-white dark:bg-zinc-900/60 rounded-3xl border p-6 shadow-sm flex flex-col justify-between transition-all ${
                      isSold ? 'opacity-70 border-zinc-200 dark:border-zinc-800/40' : 'border-zinc-200/60 dark:border-zinc-800/50 hover:shadow-md'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Image & Price */}
                      <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl overflow-hidden">
                        {deal.image_url ? (
                          <img 
                            src={deal.image_url} 
                            alt={deal.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <Tag size={32} />
                          </div>
                        )}

                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-zinc-900/90 backdrop-blur text-amber-400 text-xs font-black">
                          ₹{deal.price}
                        </span>

                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur ${
                          isSold ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-500 text-white'
                        }`}>
                          {isSold ? 'Sold Out' : 'Active'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-500">
                            {deal.category || 'General'}
                          </span>
                          {deal.condition && (
                            <span className="text-[10px] font-bold text-zinc-400">
                              {deal.condition}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-1">
                          {deal.title}
                        </h3>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {deal.description}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 pt-1">
                          <Phone size={12} className="text-amber-500 shrink-0" />
                          <span className="font-mono">{deal.contact}</span>
                          {deal.location && <span>• {deal.location}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Deal Actions */}
                    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSold(deal.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSold 
                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300' 
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {isSold ? 'Reactivate Listing' : 'Mark as Sold'}
                      </button>

                      <button
                        onClick={() => handleDeleteDeal(deal.id, deal.title)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-white dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 space-y-4">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto">
                <Tag size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">No active marketplace listings</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {dealSearch ? 'No listings match your search.' : 'You haven’t posted any items for sale yet. Post secondhand books, bicycles, or calculators!'}
                </p>
              </div>
              <Link
                to="/deals/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-zinc-950 font-bold rounded-2xl text-xs hover:bg-amber-400 transition-all shadow-sm"
              >
                <Plus size={14} /> List an Item for Sale
              </Link>
            </div>
          )}

        </div>
      )}

      {/* TAB 4: ACADEMIC & SETTINGS */}
      {activeTab === 'settings' && (
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Academic Summary Card */}
          <div className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/50 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-2xl">
                <GraduationCap size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-display">Academic Details</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Lovely Professional University Student File</p>
              </div>
            </div>

            <div className="space-y-3 divide-y divide-zinc-100 dark:divide-zinc-800/60 text-xs">
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 font-medium">Full Name</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{profileData.displayName}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 font-medium">LPU Registration No.</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{profileData.rollNumber}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 font-medium">Branch / Stream</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{profileData.branch}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 font-medium">Academic Year</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{profileData.year}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 font-medium">Section / Group</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{profileData.section || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-500 font-medium">Target CGPA</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{profileData.targetGpa || '8.5'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setEditForm(profileData);
                setIsEditModalOpen(true);
              }}
              className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Update Student Profile</span>
            </button>
          </div>

          {/* Quick Platform Shortcuts */}
          <div className="bg-white dark:bg-zinc-900/60 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/50 p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-display">ALFA Student Portal Tools</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Quick links to academic helpers</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/duty-leaves"
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 transition-all space-y-2 group"
              >
                <div className="text-amber-500"><Sparkles size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Duty Leaves</h4>
                  <p className="text-[10px] text-zinc-500">Apply LPU OM letters</p>
                </div>
              </Link>

              <Link
                to="/gpa"
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500 transition-all space-y-2 group"
              >
                <div className="text-emerald-500"><Calculator size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">GPA Calculator</h4>
                  <p className="text-[10px] text-zinc-500">Target TGPA estimator</p>
                </div>
              </Link>

              <Link
                to="/emergency"
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-rose-500 transition-all space-y-2 group"
              >
                <div className="text-rose-500"><Phone size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Emergency SOS</h4>
                  <p className="text-[10px] text-zinc-500">Campus helpline 24/7</p>
                </div>
              </Link>

              <Link
                to="/notes"
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 hover:border-blue-500 transition-all space-y-2 group"
              >
                <div className="text-blue-500"><GraduationCap size={18} /></div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Academic Notes</h4>
                  <p className="text-[10px] text-zinc-500">PYQs and syllabus</p>
                </div>
              </Link>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  if (window.confirm("Reset local profile cache and saved preferences?")) {
                    localStorage.removeItem('alfa_user_profile');
                    syncRealtimeData();
                    showToast("Profile data reset to defaults.");
                  }
                }}
                className="text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <RefreshCw size={12} /> Reset Local Profile Preferences
              </button>
            </div>

          </div>

        </div>
      )}
      </>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[5500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl">
                  <User size={18} />
                </div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 font-display">
                  Edit Student Profile
                </h2>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={editForm.displayName} 
                    onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Registration No.
                  </label>
                  <input 
                    type="text" 
                    value={editForm.rollNumber || ''} 
                    onChange={e => setEditForm({ ...editForm, rollNumber: e.target.value })}
                    placeholder="e.g. 12201942"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Branch / Stream
                  </label>
                  <input 
                    type="text" 
                    value={editForm.branch || ''} 
                    onChange={e => setEditForm({ ...editForm, branch: e.target.value })}
                    placeholder="e.g. B.Tech CSE"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Academic Year
                  </label>
                  <input 
                    type="text" 
                    value={editForm.year || ''} 
                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                    placeholder="e.g. 3rd Year"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Contact Phone
                  </label>
                  <input 
                    type="text" 
                    value={editForm.phone || ''} 
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Section
                  </label>
                  <input 
                    type="text" 
                    value={editForm.section || ''} 
                    onChange={e => setEditForm({ ...editForm, section: e.target.value })}
                    placeholder="e.g. K22GK"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Target CGPA
                  </label>
                  <input 
                    type="text" 
                    value={editForm.targetGpa || ''} 
                    onChange={e => setEditForm({ ...editForm, targetGpa: e.target.value })}
                    placeholder="e.g. 8.5"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Student Bio
                </label>
                <textarea 
                  rows={3}
                  value={editForm.bio || ''} 
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Share a short bio..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs font-semibold text-zinc-900 dark:text-zinc-100 outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* REALTIME SYNC LOGS MODAL */}
      {showLogsModal && (
        <div className="fixed inset-0 z-[5500] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 text-zinc-100 rounded-[2.5rem] border border-zinc-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <h3 className="text-lg font-black font-display text-white">
                  Real-Time Sync Audit Log
                </h3>
              </div>
              <button
                onClick={() => setShowLogsModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-64 overflow-y-auto space-y-2 p-3 bg-black/40 rounded-2xl font-mono text-[11px] text-zinc-300 border border-zinc-800/80 scrollbar-thin">
              {syncLogs.length > 0 ? (
                syncLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed border-b border-zinc-800/40 pb-1.5">
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-center py-10">No sync events logged yet.</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-zinc-400 text-[10px]">
                Auto-refresh every 15 seconds
              </span>
              <button
                onClick={() => setSyncLogs([])}
                className="text-xs text-rose-400 hover:underline cursor-pointer"
              >
                Clear Log
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
