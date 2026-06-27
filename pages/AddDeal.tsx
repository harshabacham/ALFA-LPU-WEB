import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, ArrowLeft, Sparkles, MapPin, Plus, Lock, 
  ExternalLink, ShieldCheck, AlertCircle, Copy, CheckCircle2, 
  Check, Info, Package, DollarSign, Phone, TextQuote, Tag
} from 'lucide-react';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged } from '../services/firebase';
import { User } from '../services/firebase';
import { Deal } from '../types';

const DEFAULT_IMAGES = [
  {
    name: 'Textbooks',
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Gadgets',
    url: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Cycles & Transport',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Calculators',
    url: 'https://images.unsplash.com/photo-1518133680790-3985ea46d4a5?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Essentials & Furniture',
    url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
  }
];

const CATEGORIES = ['Books', 'Electronics', 'Calculators', 'Bicycles', 'Clothing', 'Essentials', 'Others'];
const CONDITIONS = ['Like New', 'Excellent', 'Good', 'Fair', 'Refurbished'];

const AddDeal: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authErrorCode, setAuthErrorCode] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Books',
    condition: 'Good',
    price: '',
    location: '',
    contact: '',
    description: '',
    imageUrl: '',
    selectedImageTemplate: DEFAULT_IMAGES[0].url
  });

  const currentDomain = window.location.hostname;

  const copyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopiedDomain(true);
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  // Track Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthErrorCode(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Authentication Error:", err);
      setAuthErrorCode(err.code);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError("Sign-in was cancelled. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setAuthError(`This domain (${currentDomain}) is not authorized in your Firebase project.`);
      } else {
        setAuthError(err.message || "Failed to authenticate.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.contact || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    const newDeal: Deal = {
      id: `local-deal-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      price: formData.price,
      contact: formData.contact,
      image_url: formData.imageUrl || formData.selectedImageTemplate,
      category: formData.category,
      tags: `${formData.category}, ${formData.condition}, ${formData.title}`,
      rating: "5.0",
      location: formData.location || "Campus",
      condition: formData.condition,
      seller_name: currentUser?.displayName || "Student Seller",
    };

    // Save to local storage for persistence
    const localDealsStr = localStorage.getItem('alfa_local_deals');
    const localDeals: Deal[] = localDealsStr ? JSON.parse(localDealsStr) : [];
    const updatedLocal = [newDeal, ...localDeals];
    localStorage.setItem('alfa_local_deals', JSON.stringify(updatedLocal));

    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/deals');
    }, 2000);
  };

  // If newly submitted, show success state
  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-zinc-950 dark:text-white font-display mb-2">Deal Listed Successfully!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-6">
          Your product "{formData.title}" is now active in the Alfa Marketplace. Returning to deals feed...
        </p>
        <div className="w-full bg-zinc-100 dark:bg-zinc-900 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show sign-in prompt on a separate elegant page
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        
        {/* Back navigation */}
        <button 
          onClick={() => navigate('/deals')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Deals
        </button>

        <div className="max-w-md mx-auto py-12 space-y-8 text-center">
          
          {/* Branding Card */}
          <div className="bg-white dark:bg-zinc-900/60 backdrop-blur p-8 md:p-10 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/40 shadow-xl space-y-6">
            <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center mx-auto">
              <Lock size={28} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight font-display uppercase">Sign In Required</h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium leading-relaxed max-w-xs mx-auto">
                Join our verified student marketplace. Sign in to list secondhand books, gadgets, or transport items safely.
              </p>
            </div>

            {authError && (
              <div className="space-y-4">
                <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-500/20 text-left flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>

                {authErrorCode === 'auth/unauthorized-domain' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 text-left space-y-2.5 animate-in fade-in zoom-in-95">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Domain Setup Required:
                    </h4>
                    <p className="text-[10px] text-blue-800 dark:text-blue-300 leading-relaxed font-semibold">
                      Please add this domain to Authorized Domains in your Firebase Auth console:
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-inner">
                      <code className="text-[10px] font-mono text-zinc-600 dark:text-zinc-300 truncate flex-grow">
                        {currentDomain}
                      </code>
                      <button 
                        type="button"
                        onClick={copyDomain}
                        className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors text-blue-600 shrink-0"
                      >
                        {copiedDomain ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <a 
                      href="https://console.firebase.google.com/project/alfa-lpu/authentication/settings" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Authorize Domain <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3.5 py-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-850 dark:hover:bg-zinc-750 text-white rounded-2xl font-bold transition-all active:scale-95 shadow-md disabled:opacity-50 text-xs uppercase tracking-wider font-display cursor-pointer"
            >
              {authLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5 bg-white p-0.5 rounded-full" alt="Google" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
              ⚡ Secure & Authorized LPU Student Access Only
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated State - Render Dedicated Listing Page
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/deals')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Marketplace
        </button>

        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-xl border border-zinc-200/40 dark:border-zinc-800/40">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-wider font-display">Logged in as {currentUser.displayName}</span>
        </div>
      </div>

      {/* Main Form Form Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/40 shadow-xl overflow-hidden">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 md:px-10 py-8 text-white space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-wider">
            <Sparkles size={11} className="text-accent-400" /> Marketplace Hub
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display">Create Your Listing</h1>
          <p className="text-primary-100 text-xs font-medium max-w-xl">
            Fill in your product specifications carefully. LPU community members will find your details and initiate trade through WhatsApp securely.
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6">
          
          {/* Section: Basic info */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary-500 font-display flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
              <Package size={14} /> Product Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">Item Title <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <TextQuote className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. CSE-310 Lab Manual / Canon 1500D"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/5 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">Price (₹) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                  <input 
                    type="number" 
                    required
                    placeholder="e.g. 500"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/5 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">Category <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                  <select
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">Condition <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Package className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                  <select
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 cursor-pointer"
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  >
                    {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">Meetup Location <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Block-34 / Law Gate"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/5 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">Item Description <span className="text-rose-500">*</span></label>
              <textarea 
                required
                rows={3}
                placeholder="Describe your item state, purchase year, specific faults, or inclusion of accessories..."
                className="w-full px-4 py-3.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/5 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* Section: Contact detail */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary-500 font-display flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
              <Phone size={14} /> Contact Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display flex items-center gap-1">WhatsApp No. <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-zinc-400" size={14} />
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/5 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-all"
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-display">Seller Profile Name</label>
                <input 
                  type="text" 
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200/30 bg-zinc-100 dark:bg-zinc-900/60 text-xs font-bold text-zinc-500 outline-none cursor-not-allowed"
                  value={currentUser?.displayName || 'Student Seller'}
                />
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 font-semibold leading-normal">
              ℹ️ Your WhatsApp contact will be encrypted as a direct click-to-chat hyperlink. No direct spam calling is allowed.
            </p>
          </div>

          {/* Section: Cover Media */}
          <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-primary-500 font-display flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800/60 pb-2">
              <ShoppingBag size={14} /> Product Image
            </h3>

            {/* Presets */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-display">Choose High-Resolution Cover Preset</label>
              
              <div className="grid grid-cols-5 gap-3">
                {DEFAULT_IMAGES.map((img) => {
                  const isSelected = formData.selectedImageTemplate === img.url && !formData.imageUrl;
                  return (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => setFormData({...formData, selectedImageTemplate: img.url, imageUrl: ''})}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected ? 'border-primary-500 scale-95 ring-4 ring-primary-500/15' : 'border-zinc-200 dark:border-zinc-800/80 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-1.5">
                        <span className="text-[7.5px] text-white font-black uppercase tracking-wider truncate leading-none">{img.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom image option */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-display">Or Paste Custom Image URL</label>
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/... (optional)"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-sand-50/30 dark:bg-zinc-950/30 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/5 outline-none text-xs font-semibold text-zinc-800 dark:text-zinc-100 transition-all"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value, selectedImageTemplate: ''})}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-850">
            <button
              type="button"
              onClick={() => navigate('/deals')}
              className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary-500/10 transition-all active:scale-95 flex items-center gap-2 font-display cursor-pointer"
            >
              <Plus size={14} /> Submit Listing
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddDeal;
