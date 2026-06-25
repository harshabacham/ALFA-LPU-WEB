import React, { useState, useMemo } from 'react';
import { 
  Phone, ShieldAlert, HeartPulse, Flame, PhoneCall, 
  Search, Info, ExternalLink, Mail, Building, Users,
  Ambulance, Siren, AlertCircle, Tag, Copy, CheckCircle2,
  ChevronRight, X, Clock, MapPin, Check, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Emergency: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [activeSosCard, setActiveSosCard] = useState<string | null>('medical'); // Default active dial card
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hostels' | 'medical' | 'support'>('all');

  const copyToClipboard = (num: string) => {
    const cleanNum = num.replace(/[^\d-]/g, '');
    navigator.clipboard.writeText(cleanNum);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const hostels = useMemo(() => [
    { name: 'BH-1', blocks: [
      { id: 'A', landline: '01824-444521' },
      { id: 'B', landline: '01824-444522' },
      { id: 'C', landline: '01824-444523' }
    ], emergency: '9915020442', gender: 'boys' },
    { name: 'BH-2', blocks: [{ id: 'A, B', landline: '01824-444524' }], emergency: '9888598705', gender: 'boys' },
    { name: 'BH-3', blocks: [
      { id: 'A, B', landline: '01824-444526' },
      { id: 'C, D', landline: '01824-444527' }
    ], emergency: '9915710553', gender: 'boys' },
    { name: 'BH-4', blocks: [{ id: 'A, B, C, D, E', landline: '01824-444529' }], emergency: '9876015107', gender: 'boys' },
    { name: 'BH-5', blocks: [
      { id: 'A, B', landline: '01824-444530' },
      { id: 'C', landline: '01824-444531' }
    ], emergency: '9780036434', gender: 'boys' },
    { name: 'BH-6', blocks: [
      { id: 'A', landline: '01824-444532' },
      { id: 'B, C', landline: '01824-444533' }
    ], emergency: '9501110445', gender: 'boys' },
    { name: 'BH-7', blocks: [{ id: '---', landline: '01824-444536' }], emergency: '7508182896', gender: 'boys' },
    { name: 'BH-8', blocks: [{ id: '---', landline: '01824-444528' }], emergency: '9780005942', gender: 'boys' },
    { name: 'Apartment', blocks: [{ id: 'A, B, C, D', landline: '01824-444520' }], emergency: '9878977900', gender: 'coed' },
    { name: 'GH-1', blocks: [{ id: '---', landline: '01824-444081' }], emergency: '9915020443', gender: 'girls' },
    { name: 'GH-2', blocks: [{ id: '---', landline: '01824-444082' }], emergency: '9876644335', gender: 'girls' },
    { name: 'GH-3', blocks: [{ id: '---', landline: '01824-444083' }], emergency: '9876740090', gender: 'girls' },
    { name: 'GH-4', blocks: [{ id: '---', landline: '01824-444084' }], emergency: '9915020444', gender: 'girls' },
    { name: 'GH-5', blocks: [{ id: 'A, B', landline: '01824-444303' }], emergency: '9876015106', gender: 'girls' },
    { name: 'GH-6', blocks: [{ id: 'A, B', landline: '01824-444301' }], emergency: '9915020439', gender: 'girls' },
  ], []);

  const safetyMedical = useMemo(() => [
    { title: 'Hospital Reception', mobile: '---', landline: '01824-444079 / 501227', icon: HeartPulse, type: 'medical' },
    { title: 'Mr. Jagdeep Singh (Safety Dept)', mobile: '9780036450', landline: '---', icon: PhoneCall, type: 'safety' },
    { title: 'Hospital Male Ward', mobile: '---', landline: '01824-444066', icon: Building, type: 'medical' },
    { title: 'Hospital Female Ward', mobile: '---', landline: '01824-444067', icon: Building, type: 'medical' },
    { title: 'Medical Laboratory', mobile: '---', landline: '01824-444069', icon: Info, type: 'medical' },
    { title: 'Dr. N. K. Gupta', mobile: '9878426871', landline: '01824-444071', icon: PhoneCall, type: 'medical' },
    { title: 'Women Help Center (Dr. Monica)', mobile: '9915020408', landline: '01824-444040', icon: ShieldAlert, type: 'women' },
    { title: 'Fire Office (Mr. Kuldeep)', mobile: '9780036402', landline: '---', icon: Flame, type: 'fire' },
    { title: 'Fire Tender Helpline', mobile: '7508183870', landline: '---', icon: Siren, type: 'fire' },
  ], []);

  const supports = useMemo(() => [
    { title: 'Accounts Help Desk', type: 'accounts', landline: '01824-444337', email: 'helpdesk.accounts@lpu.co.in', subtitle: '9:00 AM - 5:00 PM' },
    { title: 'Student Relationship Desk', type: 'relationship', landline: '01824-510311', altLandline: '7347000929', email: 'parents@lpu.co.in', subtitle: 'Parent Helpline' },
  ], []);

  // Filter systems
  const filteredHostels = useMemo(() => {
    return hostels.filter(h => h.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [hostels, searchTerm]);

  const filteredSafety = useMemo(() => {
    return safetyMedical.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [safetyMedical, searchTerm]);

  const filteredSupports = useMemo(() => {
    return supports.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [supports, searchTerm]);

  // SOS cards config
  const sosServices = {
    fire: {
      title: 'Fire & Safety Command',
      tagline: 'Emergency Response Unit',
      color: 'bg-rose-500 shadow-rose-500/10 dark:shadow-rose-500/5',
      accentColor: 'rose',
      primaryNum: '01824-444201',
      secondaryNum: '7508183870',
      availability: '24×7 Active Response',
      desc: 'Contact for fire outbreak, hazardous events, electrical emergency, or high-alert physical safety assistance anywhere inside the premises.',
      icon: Flame,
    },
    medical: {
      title: 'University Hospital Desk',
      tagline: 'Instant Healthcare Line',
      color: 'bg-primary-500 shadow-primary-500/10 dark:shadow-primary-500/5',
      accentColor: 'primary',
      primaryNum: '01824-444079',
      secondaryNum: '01824-501227',
      availability: '24×7 Resident Support',
      desc: 'Direct connection to the medical reception, emergency doctors, diagnostic clinic, ambulance calls, and male/female general wards.',
      icon: HeartPulse,
    },
    women: {
      title: 'Women Support Center',
      tagline: 'Dedicated Security Cell',
      color: 'bg-pink-500 shadow-pink-500/10 dark:shadow-pink-500/5',
      accentColor: 'pink',
      primaryNum: '9915020408',
      secondaryNum: '01824-444040',
      availability: '9:00 AM - 5:00 PM Desk',
      desc: 'Safe, confidential workspace guided by Dr. Monica and academic support team. Reachable instantly for counseling, immediate safety, and wellness.',
      icon: ShieldAlert,
    }
  };

  const CopyButton = ({ num }: { num: string }) => (
    <button 
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); copyToClipboard(num); }}
      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors shrink-0 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/50 cursor-pointer active:scale-95"
      title="Copy Number"
    >
      {copiedNumber === num ? (
        <Check size={14} className="text-emerald-500 dark:text-emerald-400" />
      ) : (
        <Copy size={14} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" />
      )}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-12">
      
      {/* Sleek, Non-Routine Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-900/40 p-6 md:p-10 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider font-display glow-primary animate-bounce-slow">
              <Siren size={12} className="animate-pulse" /> Official 24/7 Response Desk
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none font-display text-zinc-900 dark:text-white">
              Crisis & Support <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-rose-400 to-pink-400">Hub</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl font-medium">
              Zero friction, immediate assistance portal. Access dedicated hospital services, safety commanders, and student relationship cells dynamically.
            </p>
          </div>

          {/* Search Box Built Directly Into Header Card for Fresh Look */}
          <div className="relative w-full lg:max-w-md bg-white dark:bg-zinc-950/40 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800/60">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search hostel blocks, doctor names..." 
              className="pl-12 pr-10 py-3.5 w-full rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 border border-zinc-200 dark:border-transparent focus:border-primary-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tactile SOS Dial Deck */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 font-display">SOS Rapid Dial Deck</h2>
          <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-full text-zinc-500 dark:text-zinc-400 font-mono">Select to expand</span>
        </div>

        {/* 3 Circular Non-Routine SOS Controllers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controllers Deck Left Side */}
          <div className="lg:col-span-1 flex flex-col justify-between gap-4">
            {(Object.keys(sosServices) as Array<keyof typeof sosServices>).map((key) => {
              const service = sosServices[key];
              const Icon = service.icon;
              const isActive = activeSosCard === key;

              return (
                <button
                  key={key}
                  onClick={() => setActiveSosCard(key)}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 group/sos select-none cursor-pointer ${
                    isActive 
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-800 shadow-lg scale-[1.02]' 
                      : 'bg-white dark:bg-zinc-900/20 text-zinc-700 dark:text-zinc-300 border-zinc-200/80 dark:border-zinc-900/40 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Color Glow Border Indicator */}
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r from-primary-500 via-rose-500 to-pink-500 animate-pulse" />
                  )}

                  {/* Icon with glowing aura */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isActive 
                      ? `${service.color} text-white` 
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 group-hover/sos:scale-110'
                  }`}>
                    <Icon size={22} className={isActive ? 'animate-pulse' : ''} />
                  </div>

                  <div className="flex-grow min-w-0">
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block">{service.tagline}</span>
                    <h3 className="font-bold text-sm tracking-tight">{service.title}</h3>
                  </div>

                  <ChevronRight 
                    size={16} 
                    className={`transition-transform duration-300 shrink-0 ${
                      isActive ? 'rotate-90 text-primary-400' : 'text-zinc-400 dark:text-zinc-600'
                    }`} 
                  />
                </button>
              );
            })}
          </div>

          {/* Expanded Dynamic Dial Card (Right Side) */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeSosCard && (() => {
                const activeService = sosServices[activeSosCard as keyof typeof sosServices];
                const ActiveIcon = activeService.icon;

                return (
                  <motion.div
                    key={activeSosCard}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 text-zinc-900 dark:text-white p-6 md:p-8 border border-zinc-200 dark:border-zinc-800/80 shadow-2xl min-h-[300px] flex flex-col justify-between"
                  >
                    {/* Floating Abstract Glow */}
                    <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div>
                      {/* Badge / Header info */}
                      <div className="flex justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl ${activeService.color} text-white`}>
                            <ActiveIcon size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">{activeService.title}</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{activeService.tagline}</p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-950/80 text-zinc-600 dark:text-zinc-300 rounded-full text-[10px] font-bold border border-zinc-200 dark:border-zinc-800 shrink-0">
                          <Clock size={11} className="text-primary-400" /> {activeService.availability}
                        </span>
                      </div>

                      {/* Decriptive assistance text */}
                      <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-2xl mb-8">
                        {activeService.desc}
                      </p>
                    </div>

                    {/* Direct Quick Calls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/40">
                      
                      {/* Primary call card */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between group/number">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Primary Helpline</span>
                          <a 
                            href={`tel:${activeService.primaryNum}`} 
                            className="text-lg font-black font-mono hover:text-primary-400 transition-colors flex items-center gap-2 text-zinc-900 dark:text-white"
                          >
                            <Phone size={16} className="text-primary-500" /> {activeService.primaryNum}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <CopyButton num={activeService.primaryNum} />
                        </div>
                      </div>

                      {/* Secondary call card */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/60 flex items-center justify-between group/number">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Auxiliary Desk</span>
                          <a 
                            href={`tel:${activeService.secondaryNum}`} 
                            className="text-lg font-black font-mono hover:text-primary-400 transition-colors flex items-center gap-2 text-zinc-900 dark:text-white"
                          >
                            <PhoneCall size={16} className="text-rose-500" /> {activeService.secondaryNum}
                          </a>
                        </div>
                        <div className="flex gap-2">
                          <CopyButton num={activeService.secondaryNum} />
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Directory Filter & Search Results */}
      <div className="space-y-8">
        
        {/* Modern Segmented Tab Switcher */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-2">
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth">
            {(['all', 'hostels', 'medical', 'support'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'text-zinc-950 dark:text-white' 
                    : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div 
                    layoutId="activeCategoryIndicator" 
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-500" 
                  />
                )}
                {cat === 'all' && 'All Contacts'}
                {cat === 'hostels' && '🏠 Residence (Hostels)'}
                {cat === 'medical' && '🩺 Safety & Medical'}
                {cat === 'support' && '💬 Helpdesks'}
              </button>
            ))}
          </div>

          <div className="text-right shrink-0 hidden sm:block">
            <span className="text-[10px] font-mono text-zinc-400">
              Matches: {
                (selectedCategory === 'all' || selectedCategory === 'hostels' ? filteredHostels.length : 0) + 
                (selectedCategory === 'all' || selectedCategory === 'medical' ? filteredSafety.length : 0) + 
                (selectedCategory === 'all' || selectedCategory === 'support' ? filteredSupports.length : 0)
              }
            </span>
          </div>
        </div>

        {/* Dynamic Cards list */}
        <div className="space-y-12">

          {/* 1. Hostels / Residential Grid */}
          {(selectedCategory === 'all' || selectedCategory === 'hostels') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-100 font-display">Residential Facilities ({filteredHostels.length})</h3>
              </div>

              {filteredHostels.length === 0 ? (
                <p className="text-zinc-500 text-xs py-4 font-mono">No matching hostel facilities found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredHostels.map((hostel, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/60 shadow-xs hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            hostel.gender === 'girls' 
                              ? 'bg-pink-500/10 text-pink-500' 
                              : hostel.gender === 'coed' 
                              ? 'bg-indigo-500/10 text-indigo-500' 
                              : 'bg-primary-500/10 text-primary-500'
                          }`}>
                            <Building size={20} />
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">
                              {hostel.gender === 'girls' ? 'Girls Hostels' : hostel.gender === 'coed' ? 'Apartments' : 'Boys Hostels'}
                            </span>
                            <h4 className="text-lg font-black text-zinc-900 dark:text-white mt-1 leading-none">{hostel.name}</h4>
                          </div>
                        </div>

                        {/* Block Lists */}
                        <div className="space-y-2 pt-1">
                          {hostel.blocks.map((block, bIdx) => (
                            <div 
                              key={bIdx} 
                              className="p-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100/50 dark:border-zinc-850/30 flex items-center justify-between"
                            >
                              <div className="min-w-0">
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400">
                                  {block.id === '---' ? 'Reception desk' : `Block ${block.id}`}
                                </span>
                                {block.landline !== '---' ? (
                                  <a 
                                    href={`tel:${block.landline}`} 
                                    className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-primary-500 transition-colors flex items-center gap-1.5 mt-0.5"
                                  >
                                    <Phone size={11} className="text-zinc-400" /> {block.landline}
                                  </a>
                                ) : (
                                  <p className="text-xs text-zinc-400 italic">Intercom offline</p>
                                )}
                              </div>
                              {block.landline !== '---' && <CopyButton num={block.landline} />}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Primary Emergency Line */}
                      <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                            <AlertCircle size={10} /> Emergency mobile
                          </span>
                          <CopyButton num={hostel.emergency} />
                        </div>
                        <a 
                          href={`tel:${hostel.emergency}`} 
                          className="text-base font-black text-zinc-900 dark:text-white hover:text-rose-500 transition-colors flex items-center justify-between group/call"
                        >
                          <span className="font-mono">{hostel.emergency}</span>
                          <div className="w-8 h-8 rounded-full bg-rose-500/5 group-hover/call:bg-rose-500 group-hover/call:text-white flex items-center justify-center transition-all text-rose-500">
                            <PhoneCall size={14} />
                          </div>
                        </a>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Safety & Medical Officials */}
          {(selectedCategory === 'all' || selectedCategory === 'medical') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-100 font-display">Medical & Safety Personnel ({filteredSafety.length})</h3>
              </div>

              {filteredSafety.length === 0 ? (
                <p className="text-zinc-500 text-xs py-4 font-mono">No matching medical or safety contacts found.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSafety.map((official, idx) => {
                    const OfficialIcon = official.icon;
                    return (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-zinc-900/40 p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/60 hover:border-primary-500/20 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center gap-4 group/official"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 group-hover/official:scale-105 duration-300 transition-transform flex items-center justify-center shrink-0">
                          <OfficialIcon size={22} className="text-primary-500" />
                        </div>

                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{official.title}</h4>
                          
                          <div className="space-y-1 mt-1.5">
                            {official.mobile !== '---' && (
                              <div className="flex items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-900/30 p-1.5 rounded-lg border border-zinc-100/50 dark:border-zinc-850/20">
                                <a 
                                  href={`tel:${official.mobile}`} 
                                  className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline truncate"
                                >
                                  Cell: {official.mobile}
                                </a>
                                <CopyButton num={official.mobile} />
                              </div>
                            )}

                            {official.landline !== '---' && (
                              <div className="flex items-center justify-between gap-2 bg-zinc-50 dark:bg-zinc-900/30 p-1.5 rounded-lg border border-zinc-100/50 dark:border-zinc-850/20">
                                <a 
                                  href={`tel:${official.landline}`} 
                                  className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:underline truncate"
                                >
                                  Intercom: {official.landline}
                                </a>
                                <CopyButton num={official.landline} />
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. Helpdesks / Supports */}
          {(selectedCategory === 'all' || selectedCategory === 'support') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 dark:text-zinc-100 font-display">Academic & Administrative Desks ({filteredSupports.length})</h3>
              </div>

              {filteredSupports.length === 0 ? (
                <p className="text-zinc-500 text-xs py-4 font-mono">No matching helpdesk records found.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredSupports.map((support, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white dark:bg-zinc-900/40 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/60 shadow-xs hover:shadow-lg transition-all duration-300 relative overflow-hidden group/desk"
                    >
                      {/* Brand pattern accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl group-hover/desk:scale-125 transition-transform" />

                      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded">
                              {support.type === 'accounts' ? 'Finance Office' : 'Student Relations'}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium">{support.subtitle}</span>
                          </div>
                          <h4 className="text-lg font-bold text-zinc-950 dark:text-white">{support.title}</h4>
                        </div>

                        {/* Interactive contact action deck */}
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 flex items-center gap-3">
                            <a 
                              href={`tel:${support.landline}`} 
                              className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200 hover:text-primary-500 transition-colors"
                            >
                              {support.landline}
                            </a>
                            <CopyButton num={support.landline} />
                          </div>

                          {support.altLandline && (
                            <div className="bg-zinc-50 dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 flex items-center gap-3">
                              <a 
                                href={`tel:${support.altLandline}`} 
                                className="text-sm font-bold font-mono text-zinc-800 dark:text-zinc-200 hover:text-primary-500 transition-colors"
                              >
                                {support.altLandline}
                              </a>
                              <CopyButton num={support.altLandline} />
                            </div>
                          )}

                          <a 
                            href={`mailto:${support.email}`} 
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-900 dark:hover:bg-zinc-850 rounded-2xl text-xs font-bold transition-all"
                          >
                            <Mail size={13} /> Email support
                          </a>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Helpful Guidelines & Quick Protocol */}
      <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 md:p-8 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-primary-500 animate-pulse" /> Emergency Command Guidelines
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed">
            For major security or medical contingencies, dial the Hospital Desk or Fire cell immediately. Landline extensions are fully responsive between 8:30 AM and 6:00 PM. Mobile support is authorized for round-the-clock physical emergency response.
          </p>
        </div>

        <a 
          href="tel:01824-444079" 
          className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/10 active:scale-95 transition-all font-display block text-center cursor-pointer select-none"
        >
          Dial Central Response
        </a>
      </div>

    </div>
  );
};

export default Emergency;
