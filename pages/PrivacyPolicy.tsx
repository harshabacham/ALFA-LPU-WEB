
import React from 'react';
import { Shield, Lock, Eye, Globe, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 space-y-10 animate-in fade-in duration-700 text-left">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          <Shield size={14} /> Legal Transparency
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 font-medium">Last Updated: June 11, 2025</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4 p-8 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-2xl font-bold flex items-center gap-3"><Lock className="text-primary-500" /> Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Alfa App ("we," "our," or "us") does not require user registration for most features. However, we collect certain data to improve your experience:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li><strong>Usage Data:</strong> Pages visited, time spent, and interactions.</li>
            <li><strong>Device Information:</strong> IP address, browser type, and operating system.</li>
            <li><strong>Cookies:</strong> To personalize content and analyze traffic.</li>
          </ul>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-2xl font-bold flex items-center gap-3"><Globe className="text-primary-500" /> Google AdSense & Cookies</h2>
          <p className="text-gray-600 dark:text-gray-400">
            We use Google AdSense to serve ads when you visit our website. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary-600 hover:underline">Ads Settings</a>.</li>
            <li>We use "DART cookies" to serve ads based on your preferences.</li>
          </ul>
        </section>

        <section className="space-y-4 p-8 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-2xl font-bold flex items-center gap-3"><Eye className="text-primary-500" /> Third-Party Content</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Our app displays content from Google Sheets, YouTube, and other third-party services. These services may collect data according to their own privacy policies. We are not responsible for the data practices of external sites linked within the marketplace or notification feed.
          </p>
        </section>

        <div className="pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-400 text-sm italic">If you have questions about this policy, contact us at <a href="mailto:harshabacham@gmail.com" className="text-primary-600 font-bold">harshabacham@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
