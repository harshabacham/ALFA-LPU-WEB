import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, ArrowLeft, Sparkles, MapPin, Plus, Lock, 
  ExternalLink, ShieldCheck, AlertCircle, Copy, CheckCircle2, 
  Check, Info, Package, DollarSign, Phone, TextQuote, Tag,
  UploadCloud, Loader2, Trash2
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

  // Submitting and syncing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatusText, setSubmitStatusText] = useState('Saving listing...');

  const globalSubmitApi = (import.meta as any).env.VITE_DEALS_SUBMIT_API || localStorage.getItem('alfa_deals_submit_api') || 'https://script.google.com/macros/s/AKfycby-c7QxbvujL1YKXnzgREA1Ra6dGjhD4_mmO1_vRQzeXQzhTm4J8ky_MoFMKOxw5yCEiA/exec';

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

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError("Please select a valid image file.");
      return;
    }
    
    // Validate file size (10MB limit for ImgBB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append('image', file);
      body.append('key', '070a49d17706829a493c0eee083502a6');

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: body,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const resData = await response.json();
      if (resData && resData.success && resData.data && resData.data.url) {
        const uploadedUrl = resData.data.url;
        setFormData(prev => ({
          ...prev,
          imageUrl: uploadedUrl,
          selectedImageTemplate: ''
        }));
      } else {
        throw new Error(resData?.error?.message || "Invalid response from ImgBB");
      }
    } catch (err: any) {
      console.error("ImgBB upload error:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.contact || !formData.description) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatusText("Saving listing locally...");

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
      seller_email: currentUser?.email || "",
    };

    // Save to local storage for persistence
    const localDealsStr = localStorage.getItem('alfa_local_deals');
    const localDeals: Deal[] = localDealsStr ? JSON.parse(localDealsStr) : [];
    const updatedLocal = [newDeal, ...localDeals];
    localStorage.setItem('alfa_local_deals', JSON.stringify(updatedLocal));

    // Post to Google Sheets if API is configured
    if (globalSubmitApi) {
      setSubmitStatusText("Syncing deal with Google Sheets...");
      try {
        await fetch(globalSubmitApi, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDeal)
        });
        console.log("Successfully appended row to Google Sheet.");
      } catch (err) {
        console.error("Error submitting to Google Sheet Web App:", err);
      }
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/deals');
    }, 2500);
  };

  // If currently saving/submitting, show loading state
  if (isSubmitting) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6">
        <div className="animate-spin w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-zinc-950 dark:text-white font-display uppercase tracking-tight">Publishing Listing</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold animate-pulse">{submitStatusText}</p>
        </div>
      </div>
    );
  }

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

        {/* Sync Indicator Banner */}
        {!globalSubmitApi && (
          <div className="mx-6 md:mx-10 mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-3 text-left">
              <Info size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 font-display">Local Mode Active</h4>
                <p className="text-[11px] text-amber-700 dark:text-zinc-400 font-semibold leading-relaxed font-sans">
                  This deal will only be saved in your local browser storage. To share with the whole LPU campus, please connect your Google Sheets sync webhook on the Marketplace main page!
                </p>
              </div>
            </div>
          </div>
        )}

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

            {/* Upload Area */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-display">Upload Product Photo</label>
              
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                  uploading ? 'bg-zinc-50 dark:bg-zinc-900/30 border-primary-400 animate-pulse' :
                  formData.imageUrl && !formData.selectedImageTemplate ? 'bg-emerald-500/5 border-emerald-500/40' :
                  'bg-sand-50/20 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 hover:border-primary-500/40 hover:bg-sand-50/45'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleImageUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => {
                  const input = document.getElementById('image-upload-input');
                  if (input) input.click();
                }}
              >
                <input 
                  type="file" 
                  id="image-upload-input" 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                />

                {uploading ? (
                  <div className="space-y-3 py-4">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto" />
                    <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300">Uploading to ImgBB...</p>
                  </div>
                ) : formData.imageUrl && !formData.selectedImageTemplate ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-emerald-500/30 shadow-sm">
                      <img referrerPolicy="no-referrer" src={formData.imageUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, imageUrl: '', selectedImageTemplate: DEFAULT_IMAGES[0].url }));
                        }}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow"
                        title="Remove image"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 size={14} /> Image Uploaded Successfully!
                      </p>
                      <p className="text-[10px] text-zinc-400 font-semibold truncate max-w-xs">{formData.imageUrl}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <UploadCloud className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mx-auto transition-transform hover:scale-110" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Drag and drop your image, or <span className="text-primary-600 dark:text-primary-400 underline">browse</span>
                      </p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">Supports PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>

              {uploadError && (
                <p className="text-[10.5px] text-rose-500 font-bold flex items-center gap-1 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  <AlertCircle size={14} /> {uploadError}
                </p>
              )}
            </div>

            {/* Presets */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block font-display">Or Choose High-Resolution Cover Preset</label>
              
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
                      <img referrerPolicy="no-referrer" src={img.url} alt={img.name} className="w-full h-full object-cover" />
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
