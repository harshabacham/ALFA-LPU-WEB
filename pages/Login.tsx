
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, ShieldCheck, AlertCircle, Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../services/firebase';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentDomain = window.location.hostname;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      console.error("Login Error:", err);
      setErrorCode(err.code);
      if (err.code === 'auth/api-key-not-valid' || err.code === 'auth/invalid-api-key') {
        setError("Firebase Configuration Error: Please check your API Key in services/firebase.ts");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Login was cancelled. Please try again.");
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`This domain (${currentDomain}) is not authorized in your Firebase project.`);
      } else {
        setError("Failed to sign in: " + (err.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  const copyDomain = () => {
    navigator.clipboard.writeText(currentDomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-6 py-12">
      <div className="w-full max-w-md space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Branding */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-[2rem] p-4 shadow-2xl border border-gray-100 dark:border-gray-800 rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png" 
              alt="Alfa Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">ALFA HUB</h1>
            <p className="text-gray-500 font-medium">Student Community Platform</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-8 relative overflow-hidden">
          <div className="space-y-2 pt-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Authorized Access</h2>
            <p className="text-sm text-gray-500">Sign in with your university/personal Google account.</p>
          </div>

          {error && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30 flex items-start gap-3 text-left">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>

              {errorCode === 'auth/unauthorized-domain' && (
                <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 text-left space-y-3 animate-in fade-in zoom-in-95">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                    <ShieldCheck size={14} /> Domain Setup Required:
                  </h4>
                  <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed font-medium">
                    To enable login, you must add this domain to your Firebase Console:
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-inner">
                    <code className="text-[10px] font-mono text-gray-600 dark:text-gray-300 truncate flex-grow">
                      {currentDomain}
                    </code>
                    <button 
                      onClick={copyDomain}
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-blue-600"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <a 
                    href="https://console.firebase.google.com/project/alfa-lpu/authentication/settings" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors"
                  >
                    Authorize Domain <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95 shadow-sm group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="pt-4 flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" /> Secure SSL
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} className="text-primary-500" /> Community
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-medium px-8 leading-relaxed">
          By signing in, you are accessing the official Alfa App community hub. Your data is protected under university guidelines.
        </p>
      </div>
    </div>
  );
};

export default Login;
