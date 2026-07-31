import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tag, Search, Filter, MapPin, ShoppingBag, Star, Mail, Phone, ChevronRight, Sparkles, Zap, Plus, X, Lock, LogOut, CheckCircle2, Globe, ArrowRight, AlertCircle, ExternalLink, ShieldCheck, Copy, Edit, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import { fetchCSV } from '../services/csvService';
import { CSV_URLS } from '../constants';
import { Deal } from '../types';
import { CardSkeleton } from '../components/ui/skeleton';
import { FALLBACK_DEALS } from '../services/fallbackData';
import { AdUnit } from '../components/AdUnit';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signOut } from '../services/firebase';
import { User } from '../services/firebase';

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

const APPS_SCRIPT_CODE = `function cleanId(val) {
  if (val === undefined || val === null) return "";
  var s = val.toString().trim();
  
  // Remove commas (very common in formatted numbers in Google Sheets)
  s = s.replace(/,/g, '');
  
  if (s.indexOf(".") !== -1) {
    var parts = s.split(".");
    if (parts[1] === "0" || parts[1] === "") {
      return parts[0];
    }
  }
  return s;
}

function idsMatch(val1, val2) {
  var s1 = cleanId(val1);
  var s2 = cleanId(val2);
  if (s1 === s2 && s1 !== "") return true;
  
  // Try direct numeric matching if both are valid numbers
  var n1 = Number(s1);
  var n2 = Number(s2);
  if (!isNaN(n1) && !isNaN(n2) && n1 === n2 && s1 !== "") return true;
  
  return false;
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Deals");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    }
    
    var data = JSON.parse(e.postData.contents);
    var action = (data.action || "").toString().toLowerCase().trim();
    var id = data.id;
    
    if (action === "delete") {
      if (!id) throw new Error("ID is required for delete");
      var rows = sheet.getDataRange().getValues();
      var found = false;
      for (var i = 1; i < rows.length; i++) {
        if (idsMatch(rows[i][0], id)) {
          sheet.deleteRow(i + 1);
          found = true;
          break;
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: found ? "Deal deleted!" : "Deal not found!" }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeader("Access-Control-Allow-Origin", "*");
    }
    
    // Fail-safe duplicate protection: if ID already exists, automatically update it instead of appending!
    if (id) {
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {
        if (idsMatch(rows[i][0], id)) {
          var rowNum = i + 1;
          sheet.getRange(rowNum, 2).setValue(data.title || "");
          sheet.getRange(rowNum, 3).setValue(data.description || "");
          sheet.getRange(rowNum, 4).setValue(data.price || "");
          sheet.getRange(rowNum, 5).setValue(data.contact || "");
          sheet.getRange(rowNum, 6).setValue(data.image_url || "");
          sheet.getRange(rowNum, 7).setValue(data.category || "");
          sheet.getRange(rowNum, 8).setValue(data.tags || "");
          sheet.getRange(rowNum, 9).setValue(data.rating || "5.0");
          sheet.getRange(rowNum, 10).setValue(data.location || "Campus");
          sheet.getRange(rowNum, 11).setValue(data.condition || "");
          sheet.getRange(rowNum, 12).setValue(data.seller_name || "");
          sheet.getRange(rowNum, 13).setValue(data.seller_email || "");
          
          return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Deal updated successfully!" }))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeader("Access-Control-Allow-Origin", "*");
        }
      }
    }
    
    // Default / Create action: append the row matching Google Sheet structure
    sheet.appendRow([
      data.id || ("deal-" + Date.now()),
      data.title || "",
      data.description || "",
      data.price || "",
      data.contact || "",
      data.image_url || "",
      data.category || "",
      data.tags || "",
      data.rating || "5.0",
      data.location || "Campus",
      data.condition || "",
      data.seller_name || "",
      data.seller_email || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Deal synced!" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Deals");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    }
    
    var params = e.parameter;
    sheet.appendRow([
      params.id || ("deal-" + Date.now()),
      params.title || "",
      params.description || "",
      params.price || "",
      params.contact || "",
      params.image_url || "",
      params.category || "",
      params.tags || "",
      "5.0",
      params.location || "Campus",
      params.condition || "",
      params.seller_name || "",
      params.seller_email || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Deal synced!" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}`;

const cleanId = (val: any): string => {
  if (val === undefined || val === null) return "";
  let s = val.toString().trim();
  s = s.replace(/,/g, '');
  if (s.indexOf(".") !== -1) {
    const parts = s.split(".");
    if (parts[1] === "0" || parts[1] === "") {
      return parts[0];
    }
  }
  return s;
};

const Deals: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Deal[]>([]);
  const [filteredData, setFilteredData] = useState<Deal[]>([]);
  const location = useLocation();
  const searchParam = new URLSearchParams(location.search).get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('search');
    if (query !== null) {
      setSearchTerm(query);
    }
  }, [location.search]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [loading, setLoading] = useState(true);

  // Authentication and Form State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);
  const [editUploading, setEditUploading] = useState(false);
  const [editUploadError, setEditUploadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'loading' } | null>(null);

  const handleEditImageUpload = async (file: File) => {
    if (!file || !editingDeal) return;
    
    if (!file.type.startsWith('image/')) {
      setEditUploadError("Please select a valid image file.");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setEditUploadError("Image size must be less than 10MB.");
      return;
    }

    setEditUploading(true);
    setEditUploadError(null);

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
        setEditingDeal({
          ...editingDeal,
          image_url: uploadedUrl
        });
      } else {
        throw new Error(resData?.error?.message || "Invalid response from ImgBB");
      }
    } catch (err: any) {
      console.error("ImgBB upload error:", err);
      setEditUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setEditUploading(false);
    }
  };

  // Sync state
  const [showSyncGuide, setShowSyncGuide] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [submitApiUrl, setSubmitApiUrl] = useState(
    localStorage.getItem('alfa_deals_submit_api') || 'https://script.google.com/macros/s/AKfycby-c7QxbvujL1YKXnzgREA1Ra6dGjhD4_mmO1_vRQzeXQzhTm4J8ky_MoFMKOxw5yCEiA/exec'
  );
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const globalSubmitApi = (import.meta as any).env.VITE_DEALS_SUBMIT_API || submitApiUrl;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const saveSubmitApi = (url: string) => {
    setSubmitApiUrl(url);
    localStorage.setItem('alfa_deals_submit_api', url);
  };

  const handleTestSync = async () => {
    if (!globalSubmitApi) {
      setTestStatus('error');
      setTestMessage('Please configure a Google Apps Script Web App URL first.');
      return;
    }
    setTestStatus('testing');
    setTestMessage('Sending test deal row...');
    try {
      const testDeal = {
        id: `test-deal-${Date.now()}`,
        title: 'Test Marketplace Book',
        description: 'Auto-generated test row to verify Google Sheets synchronization.',
        price: '199',
        contact: '917793914091',
        image_url: DEFAULT_IMAGES[0].url,
        category: 'Books',
        tags: 'Test, Books, SheetSync',
        rating: '5.0',
        location: 'Campus Hub',
        condition: 'Like New',
        seller_name: currentUser?.displayName || 'Test Admin'
      };

      await fetch(globalSubmitApi, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testDeal)
      });

      setTestStatus('success');
      setTestMessage('Test row submitted successfully! Please check your Google Spreadsheet to confirm the entry.');
    } catch (error: any) {
      console.error('Sync Test Error:', error);
      setTestStatus('error');
      setTestMessage(error.message || 'Failed to sync. Ensure the script allows public cross-origin POST requests.');
    }
  };

  // Track Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Load CSV and local Deals with robust deduplication, edit-caching, and deletion-caching
  useEffect(() => {
    const load = async () => {
      try {
        let result = await fetchCSV<Deal>(CSV_URLS.DEALS);
        if (!result || result.length === 0) {
          result = FALLBACK_DEALS;
        }
        
        const localDealsStr = localStorage.getItem('alfa_local_deals');
        const localDeals: Deal[] = localDealsStr ? JSON.parse(localDealsStr) : [];
        
        const deletedIdsStr = localStorage.getItem('alfa_deleted_deal_ids');
        const deletedIds: string[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
        const deletedSet = new Set(deletedIds.map(id => cleanId(id)));

        const editedDealsStr = localStorage.getItem('alfa_edited_deals');
        const editedDealsRaw: Record<string, Deal> = editedDealsStr ? JSON.parse(editedDealsStr) : {};
        const editedDeals: Record<string, Deal> = {};
        Object.keys(editedDealsRaw).forEach(k => {
          editedDeals[cleanId(k)] = editedDealsRaw[k];
        });

        // Combine local additions and sheet results in reverse order (newest from sheet first)
        const reversedResult = [...result].reverse();
        const rawCombined = [...localDeals, ...reversedResult];
        const seenIds = new Set<string>();
        const combined: Deal[] = [];

        for (const item of rawCombined) {
          if (!item.id) continue;
          const idStr = cleanId(item.id);
          if (!idStr) continue;
          
          // Skip locally deleted items (survives 5-minute Google Sheets CSV refresh lag)
          if (deletedSet.has(idStr)) {
            continue;
          }
          
          // Deduplicate items
          if (seenIds.has(idStr)) {
            continue;
          }
          seenIds.add(idStr);

          // Apply local edits if they exist (survives 5-minute Google Sheets CSV refresh lag)
          if (editedDeals[idStr]) {
            combined.push(editedDeals[idStr]);
          } else {
            combined.push(item);
          }
        }

        setData(combined);
        setFilteredData(combined);
      } catch (err) {
        console.error('Error loading deals:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filtering Logic
  useEffect(() => {
    let result = data;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.title || "").toLowerCase().includes(search) || 
        (item.description || "").toLowerCase().includes(search) ||
        (item.tags || "").toLowerCase().includes(search)
      );
    }
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (selectedCondition !== 'All') {
      result = result.filter(item => item.condition === selectedCondition);
    }
    setFilteredData(result);
  }, [searchTerm, selectedCategory, selectedCondition, data]);

  const categories = ['All', ...Array.from(new Set(data.map(i => i.category).filter(Boolean)))];
  const conditions = ['All', ...Array.from(new Set(data.map(i => i.condition).filter(Boolean)))];

  const getWhatsAppUrl = (contact: string, title: string) => {
    if (!contact) return '#';
    let cleaned = contact.replace(/\D/g, '');
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    const message = encodeURIComponent(`Hi, I'm interested in buying your item "${title}" on Alfa Deals.`);
    return `https://wa.me/${cleaned}?text=${message}`;
  };

  const handleAddClick = () => {
    navigate('/deals/add');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!dealId) {
      console.warn("Cannot delete deal: ID is empty.");
      return;
    }

    const idStr = cleanId(dealId);
    setDeletingId(idStr);
    setToast({ message: "Removing listing from sheet...", type: 'loading' });
    
    let syncSuccess = false;

    // Sync deletion with Google Sheets if configured
    if (globalSubmitApi) {
      try {
        console.log(`Sending delete request to Google Sheets for ID: ${idStr}`);
        await fetch(globalSubmitApi, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'delete', id: idStr })
        });
        console.log("Successfully triggered delete in Google Sheets.");
        syncSuccess = true;
      } catch (err) {
        console.error("Error deleting from Google Sheets:", err);
        setToast({ message: "Failed to remove from Google Sheets, but listing deleted locally.", type: 'error' });
        setTimeout(() => setToast(null), 4000);
      }
    } else {
      syncSuccess = true;
    }

    // Update local React state immediately with robust ID matching
    setData(prevData => prevData.filter(deal => cleanId(deal.id) !== idStr));
    setFilteredData(prevFiltered => prevFiltered.filter(deal => cleanId(deal.id) !== idStr));
    
    // 1. Remove from local additions
    try {
      const localDealsStr = localStorage.getItem('alfa_local_deals');
      if (localDealsStr) {
        const localDeals: Deal[] = JSON.parse(localDealsStr);
        const updatedLocal = localDeals.filter(deal => cleanId(deal.id) !== idStr);
        localStorage.setItem('alfa_local_deals', JSON.stringify(updatedLocal));
      }
    } catch (e) {
      console.error("Error updating local additions in localStorage:", e);
    }

    // 2. Save to local deletions cache to survive page reload until Google Sheets updates the public CSV URL
    try {
      const deletedIdsStr = localStorage.getItem('alfa_deleted_deal_ids');
      const deletedIds: string[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
      if (!deletedIds.map(id => cleanId(id)).includes(idStr)) {
        deletedIds.push(idStr);
        localStorage.setItem('alfa_deleted_deal_ids', JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.error("Error saving deleted IDs to localStorage:", e);
    }

    // 3. Remove from local edits cache if it was there
    try {
      const editedDealsStr = localStorage.getItem('alfa_edited_deals');
      if (editedDealsStr) {
        const editedDeals: Record<string, Deal> = JSON.parse(editedDealsStr);
        const matchedKey = Object.keys(editedDeals).find(k => cleanId(k) === idStr);
        if (matchedKey) {
          delete editedDeals[matchedKey];
        }
        localStorage.setItem('alfa_edited_deals', JSON.stringify(editedDeals));
      }
    } catch (e) {
      console.error("Error removing from edited deals cache:", e);
    }

    setDeletingId(null);
    if (syncSuccess) {
      setToast({ message: "Listing successfully removed!", type: 'success' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    if (!editingDeal.title || !editingDeal.price || !editingDeal.contact || !editingDeal.description) {
      alert("Please fill in all required fields.");
      return;
    }

    const idStr = cleanId(editingDeal.id);

    // Update local React state immediately with robust ID matching
    const updatedData = data.map(deal => cleanId(deal.id) === idStr ? editingDeal : deal);
    setData(updatedData);
    setFilteredData(filteredData.map(deal => cleanId(deal.id) === idStr ? editingDeal : deal));

    // 1. If it was a local addition, update it in local additions list
    const localDealsStr = localStorage.getItem('alfa_local_deals');
    if (localDealsStr) {
      const localDeals: Deal[] = JSON.parse(localDealsStr);
      const updatedLocal = localDeals.map(deal => cleanId(deal.id) === idStr ? editingDeal : deal);
      localStorage.setItem('alfa_local_deals', JSON.stringify(updatedLocal));
    }

    // 2. Save to local edits cache to survive page reload until Google Sheets updates the public CSV URL
    const editedDealsStr = localStorage.getItem('alfa_edited_deals');
    const editedDeals: Record<string, Deal> = editedDealsStr ? JSON.parse(editedDealsStr) : {};
    editedDeals[idStr] = editingDeal;
    localStorage.setItem('alfa_edited_deals', JSON.stringify(editedDeals));

    // Sync edited deal with Google Sheets if configured
    if (globalSubmitApi) {
      try {
        await fetch(globalSubmitApi, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...editingDeal, action: 'update' })
        });
        console.log("Successfully triggered update in Google Sheets.");
      } catch (err) {
        console.error("Error updating in Google Sheets:", err);
      }
    }

    setEditingDeal(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Top Banner & Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-zinc-200/40 dark:border-zinc-800/40">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
            <Sparkles size={12} className="text-accent-500" /> Marketplace Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none font-display">
            Alfa Deals
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base max-w-xl">
            Exclusively curated community marketplace. Buy and sell textbooks, gadgets, and campus essentials safely.
          </p>
        </div>

        {/* Action Controls Side */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* User profile details if authenticated */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm mr-2 shrink-0">
              {currentUser.photoURL && currentUser.photoURL.trim() !== "" ? (
                <img src={currentUser.photoURL || null} alt={currentUser.displayName || ''} className="w-8 h-8 rounded-full border border-zinc-200" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {currentUser.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="hidden md:block text-left pr-2">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider font-display leading-none">Seller Profile</p>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200 truncate max-w-[120px]">{currentUser.displayName}</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}



          {/* Primary CTA - Add Your Item Option */}
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-500/10 transition-all active:scale-95 cursor-pointer font-display shrink-0"
          >
            <Plus size={16} />
            <span>Add Your Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="space-y-3 w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="Search deals by title or description in real-time..." 
              className="pl-11 pr-10 py-3.5 w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all shadow-sm font-medium text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl transition-colors cursor-pointer bg-zinc-100 dark:bg-zinc-800"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select 
              className="px-4 py-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 focus:border-primary-500 outline-none text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 cursor-pointer shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
            </select>
            <select 
              className="px-4 py-3.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 focus:border-primary-500 outline-none text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-200 cursor-pointer shadow-sm"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              {conditions.map(cond => <option key={cond} value={cond}>{cond === 'All' ? 'All Conditions' : cond}</option>)}
            </select>
          </div>
        </div>

        {/* Real-time search indicator bar */}
        {(searchTerm || selectedCategory !== 'All' || selectedCondition !== 'All') && (
          <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium animate-in fade-in duration-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span>Found <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{filteredData.length}</strong> {filteredData.length === 1 ? 'deal' : 'deals'}</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 font-semibold text-[11px]">
                  Matching "{searchTerm}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedCondition('All');
              }}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 cursor-pointer hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-24">
        {loading ? (
          <>
            {Array.from({ length: 8 }).map((_, idx) => (
              <CardSkeleton key={idx} imageHeight="h-40" />
            ))}
          </>
        ) : filteredData.length > 0 ? (
          filteredData.map((deal, idx) => {
            const isOwner = !!(
              currentUser &&
              (
                (deal.seller_email && currentUser.email && deal.seller_email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()) ||
                (!deal.seller_email && deal.seller_name && currentUser.displayName && deal.seller_name.trim().toLowerCase() === currentUser.displayName.trim().toLowerCase())
              )
            );
            return (
              <div key={`${deal.id || 'deal'}-${idx}`} className="group bg-sand-50 dark:bg-zinc-900/40 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/40 hover:shadow-md hover:border-primary-500/20 hover:scale-[1.02] transition-all duration-350 flex flex-col text-left">
                <div className="relative h-40 md:h-48 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                  <img src={deal.image_url || null} alt={deal.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 bg-sand-50/90 dark:bg-zinc-900/90 backdrop-blur rounded-lg text-[9px] font-bold text-primary-500 shadow-sm uppercase tracking-wider font-display">
                      {deal.condition}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-sm md:text-base font-bold text-zinc-900 dark:text-white line-clamp-1 font-display">{deal.title}</h3>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                        <Star size={12} className="fill-current text-amber-400" />
                        <span className="text-[10px]">{deal.rating}</span>
                      </div>
                    </div>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-2 mb-4 font-medium leading-relaxed">
                      {deal.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end border-t border-zinc-100 dark:border-zinc-800/50 pt-3">
                      <div>
                        <span className="text-base md:text-lg font-extrabold text-primary-500 font-display">₹{deal.price}</span>
                        <div className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                           <MapPin size={10} /> {deal.location}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] text-zinc-400 font-bold uppercase mb-0.5 font-display">Seller</p>
                         <p className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-200">{deal.seller_name}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isOwner ? (
                        <>
                          <button
                            onClick={() => setEditingDeal(deal)}
                            className="flex-grow flex items-center justify-center gap-1.5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 font-display cursor-pointer"
                          >
                            <Edit size={14} className="text-primary-500" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDealToDelete(deal)}
                            disabled={deletingId !== null}
                            className={`px-3 py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center ${
                              deletingId === cleanId(deal.id)
                                ? 'bg-rose-500/25 text-rose-500'
                                : deletingId !== null
                                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 cursor-pointer'
                            }`}
                            title={deletingId === cleanId(deal.id) ? "Deleting..." : "Delete Listing"}
                          >
                            {deletingId === cleanId(deal.id) ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </>
                      ) : (
                        <a 
                          href={getWhatsAppUrl(deal.contact, deal.title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow flex items-center justify-center gap-1.5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-500/10 transition-all active:scale-95 glow-primary font-display"
                        >
                          Buy Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 text-center bg-zinc-50 dark:bg-zinc-900/10 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/60 max-w-lg mx-auto w-full">
             <ShoppingBag className="mx-auto mb-6 text-zinc-300 dark:text-zinc-700" size={80} />
             <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-tight font-display">No Deals Found</h3>
             <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-xs font-medium max-w-sm mx-auto px-4">No items matched your current search filters. Try widening your criteria.</p>
          </div>
        )}
      </div>

      {/* Google Sheets Synchronization Guide Modal */}
      {showSyncGuide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left animate-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
                  <Globe size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black font-display uppercase tracking-tight text-zinc-900 dark:text-white">Google Sheet Sync Settings</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Sync local and public community deal submissions</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSyncGuide(false)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm">
              
              {/* IMPORTANT REDEPLOY WARNING */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-800 dark:text-amber-300">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-amber-500" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-wider font-display">Action Required: Update & Redeploy Apps Script</p>
                  <p className="text-[11px] leading-relaxed font-semibold">
                    Google Sheets Web Apps cache previous script files. To prevent duplicate rows and ensure edits update the same row correctly:
                  </p>
                  <ul className="list-disc pl-4 text-[10.5px] leading-relaxed font-semibold space-y-0.5 mt-1.5">
                    <li>Copy the new Apps Script code from Step 3 below.</li>
                    <li>In your Apps Script editor, paste it to replace your current code and save.</li>
                    <li>At the top right, click <span className="font-extrabold text-amber-700 dark:text-amber-200">Deploy &rarr; Manage deployments</span>.</li>
                    <li>Click the <span className="font-extrabold">Pencil (Edit) icon</span> next to your active deployment.</li>
                    <li>In the <span className="font-extrabold">Version</span> dropdown, select <span className="font-black underline text-amber-600 dark:text-amber-400">"New version"</span> (CRITICAL: choosing this is required to clear the cache!).</li>
                    <li>Click <span className="font-extrabold">Deploy</span>.</li>
                  </ul>
                </div>
              </div>

              {/* API Configuration Input */}
              <div className="space-y-2 bg-primary-500/5 dark:bg-primary-500/10 p-5 rounded-2xl border border-primary-500/10">
                <label className="text-[10px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 font-display flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Web App Submit URL
                </label>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold leading-relaxed">
                  Enter your Google Apps Script Web App URL below. When saved, any deal added by any user on this site will be synced directly to your Google Spreadsheet in real-time!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-grow px-3.5 py-2.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 text-xs font-semibold text-zinc-800 dark:text-zinc-100 outline-none focus:border-primary-500 transition-colors"
                    value={submitApiUrl}
                    onChange={(e) => saveSubmitApi(e.target.value)}
                  />
                  <button
                    onClick={handleTestSync}
                    disabled={testStatus === 'testing'}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                  </button>
                </div>

                {testStatus !== 'idle' && (
                  <div className={`mt-3 p-3 rounded-xl border flex items-start gap-2.5 text-xs font-semibold ${
                    testStatus === 'success' 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                      : testStatus === 'error'
                      ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                      : 'bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}>
                    {testStatus === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                    <span>{testMessage}</span>
                  </div>
                )}
              </div>

              {/* Step by Step Guide */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-500 font-display border-b border-zinc-100 dark:border-zinc-800 pb-1">
                  How to setup Google Sheets sync:
                </h4>
                
                <div className="space-y-3.5 text-xs text-zinc-600 dark:text-zinc-300 font-semibold leading-relaxed">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">Open your Spreadsheet</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">Go to your Google Spreadsheet linked in <code>constants.ts</code>. Make sure the active tab or a tab is named <span className="font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Deals</span>.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">Open Apps Script Editor</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">In the Google Sheets top menu, click <span className="font-bold">Extensions</span> &rarr; <span className="font-bold">Apps Script</span>. Delete any default code in <code>Code.gs</code>.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <div className="flex-grow space-y-2">
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">Copy & Paste Script Code</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal font-sans">
                        Copy the optimized Apps Script snippet below and paste it directly into the editor:
                      </p>
                      
                      <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3.5 font-mono text-[10px] text-zinc-600 dark:text-zinc-300 shadow-inner max-h-40 overflow-y-auto">
                        <button
                          type="button"
                          onClick={copyAppsScript}
                          className="absolute top-2 right-2 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 rounded-lg text-primary-500 transition-all flex items-center gap-1 text-[9px] font-bold tracking-wider uppercase"
                        >
                          {copiedCode ? (
                            <>
                              <CheckCircle2 size={12} className="text-emerald-500" />
                              <span className="text-emerald-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                        <pre className="whitespace-pre-wrap leading-normal text-left pr-16">{APPS_SCRIPT_CODE}</pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">Deploy as a Web App</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">
                        In the Apps Script top-right, click <span className="font-bold">Deploy</span> &rarr; <span className="font-bold">New Deployment</span>.<br />
                        - Click the gear icon next to "Select type" and select <span className="font-bold">Web App</span>.<br />
                        - Execute as: <span className="font-bold">Me (your-email@gmail.com)</span>.<br />
                        - Who has access: <span className="font-bold">Anyone</span> (this is required to let community users submit).<br />
                        - Click <span className="font-bold">Deploy</span>, authorize permissions, and copy the generated <span className="font-bold">Web App URL</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">5</span>
                    <div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200">Paste URL & Save</p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 font-sans">Paste the Web App URL in the input field above, test the connection, and close this panel. Your Google Spreadsheet is now connected!</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/20 flex justify-between items-center">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                🔒 Secured via Cross-Origin Redirection
              </span>
              <button
                onClick={() => setShowSyncGuide(false)}
                className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-[2rem] w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left animate-in zoom-in-95 duration-250">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center">
                  <Edit size={18} />
                </div>
                <div>
                  <h3 className="text-base font-black font-display uppercase tracking-tight text-zinc-900 dark:text-white">Edit Deal Listing</h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Modify your marketplace item details</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingDeal(null)}
                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEdit} className="flex-grow overflow-y-auto p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Item Title *</label>
                <input 
                  type="text" 
                  required
                  value={editingDeal.title}
                  onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                  placeholder="e.g. HC Verma Physics Vol 1"
                />
              </div>

              {/* Price & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Price (₹) *</label>
                  <input 
                    type="number" 
                    required
                    value={editingDeal.price}
                    onChange={(e) => setEditingDeal({ ...editingDeal, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                    placeholder="e.g. 299"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={editingDeal.location || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, location: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                    placeholder="e.g. BH-3 or Girls Hostel"
                  />
                </div>
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Category *</label>
                  <select 
                    value={editingDeal.category}
                    onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                  >
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cycles">Cycles</option>
                    <option value="Essentials">Essentials</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Condition *</label>
                  <select 
                    value={editingDeal.condition}
                    onChange={(e) => setEditingDeal({ ...editingDeal, condition: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Worn">Worn</option>
                  </select>
                </div>
              </div>

              {/* Contact (WhatsApp) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">WhatsApp Number *</label>
                <input 
                  type="text" 
                  required
                  value={editingDeal.contact}
                  onChange={(e) => setEditingDeal({ ...editingDeal, contact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                  placeholder="e.g. 91xxxxxxxxxx"
                />
              </div>

              {/* Product Photo Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Product Photo</label>
                
                {/* Compact Upload Area */}
                <div 
                  className={`relative border border-dashed rounded-xl p-4 transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                    editUploading ? 'bg-zinc-50 dark:bg-zinc-900/30 border-primary-400 animate-pulse' :
                    editingDeal.image_url ? 'bg-emerald-500/5 border-emerald-500/40' :
                    'bg-zinc-50 dark:bg-zinc-950/20 border-zinc-200 dark:border-zinc-800 hover:border-primary-500/40'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleEditImageUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => {
                    const input = document.getElementById('edit-image-upload-input');
                    if (input) input.click();
                  }}
                >
                  <input 
                    type="file" 
                    id="edit-image-upload-input" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleEditImageUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {editUploading ? (
                    <div className="space-y-2 py-2">
                      <Loader2 className="w-6 h-6 text-primary-500 animate-spin mx-auto" />
                      <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">Uploading to ImgBB...</p>
                    </div>
                  ) : editingDeal.image_url ? (
                    <div className="flex items-center gap-4 w-full text-left">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/30 shadow-sm shrink-0">
                        <img referrerPolicy="no-referrer" src={editingDeal.image_url} alt="Uploaded preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-grow">
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Photo Uploaded!
                        </p>
                        <p className="text-[9px] text-zinc-400 font-semibold truncate">{editingDeal.image_url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDeal({ ...editingDeal, image_url: '' });
                        }}
                        className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 py-1">
                      <UploadCloud className="w-6 h-6 text-zinc-400 dark:text-zinc-500 mx-auto" />
                      <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                        Drag & drop photo or <span className="text-primary-600 dark:text-primary-400 underline">browse</span>
                      </p>
                    </div>
                  )}
                </div>

                {editUploadError && (
                  <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <AlertCircle size={12} /> {editUploadError}
                  </p>
                )}

                {/* Plain text fallback */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Or paste image URL</span>
                  <input 
                    type="text" 
                    value={editingDeal.image_url || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, image_url: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-xs font-medium transition-all"
                    placeholder="Image link (Unsplash, Imgur, etc.)"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">Description *</label>
                <textarea 
                  required
                  rows={3}
                  value={editingDeal.description}
                  onChange={(e) => setEditingDeal({ ...editingDeal, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-800 dark:text-zinc-100 focus:border-primary-500 outline-none text-sm font-medium transition-all resize-none"
                  placeholder="Tell buyers about the condition, accessories, and meeting place..."
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setEditingDeal(null)}
                  className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-500/10 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 rounded-2xl shadow-xl border border-zinc-800 dark:border-zinc-200 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toast.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-primary-500" />}
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
          <p className="text-xs font-bold uppercase tracking-wider font-display">{toast.message}</p>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {dealToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center">
              <Trash2 size={22} />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-white font-display">Delete Listing?</h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Are you sure you want to delete <span className="font-bold">"{dealToDelete.title}"</span>? This will remove the listing.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDealToDelete(null)}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-display"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const id = dealToDelete.id;
                  setDealToDelete(null);
                  if (id) handleDeleteDeal(id);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-display"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AdSense Sponsored Unit */}
      <div className="my-10">
        <AdUnit label="Student Marketplace & Gear Sponsors" slot="5069382104" />
      </div>

      {/* Rich Marketplace Safety & Student Trading Guide */}
      <section className="bg-sand-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary-500" size={20} />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">
            Student Marketplace Safety & Fair Pricing Guidelines
          </h2>
        </div>
        <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The ALFA Campus Marketplace is designed for student-to-student exchange of textbooks, lab coats, scientific calculators, bicycles, and hostel furniture. Always follow these safety best practices:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 space-y-1">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">1. Public Campus Meetups</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Conduct transactions in well-lit public campus locations like Central Library, UniMall, or Block 34 food courts.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 space-y-1">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">2. Inspect Item Before Payment</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Verify gadget functionality, bicycle brakes, or textbook condition in person prior to transferring funds via UPI.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/50 dark:border-zinc-800 space-y-1">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">3. Zero Advance Deposits</h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Never wire advance booking fees to unverified numbers. Real student sellers will gladly meet you on campus.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Deals;
