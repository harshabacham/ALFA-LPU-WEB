import React from 'react';
import { Shield, Lock, Eye, Globe, ChevronLeft, CheckCircle2, FileText, AlertCircle, Mail, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-700 text-left">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#fe7f2d] transition-colors border border-zinc-200 dark:border-zinc-800 px-4 py-2 rounded-full bg-white dark:bg-zinc-900 shadow-xs cursor-pointer"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fe7f2d]/10 text-[#fe7f2d] rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
          <Shield size={14} /> AdSense Compliant Legal Transparency
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400">
          <span>Effective Date: July 30, 2026</span>
          <span>•</span>
          <span>Applies to: alfa-lpu.in & lpualfa.vercel.app</span>
        </div>
      </div>

      <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
        
        {/* Intro */}
        <section className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Lock className="text-[#fe7f2d]" size={20} /> 1. Overview & Commitment to Privacy
          </h2>
          <p>
            At <strong>LPU ALFA Portal</strong> ("we," "our," or "us"), accessible from <em>https://alfa-lpu.in</em> and <em>https://lpualfa.vercel.app</em>, one of our main priorities is the privacy of our student visitors. This Privacy Policy document outlines the types of information that is collected and recorded by LPU ALFA Portal and how we use, safeguard, and disclose it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our portal privacy coordinator via email at <a href="mailto:harshabacham3@gmail.com" className="text-[#fe7f2d] font-bold hover:underline">harshabacham3@gmail.com</a> or <a href="mailto:support@alfa-lpu.in" className="text-[#fe7f2d] font-bold hover:underline">support@alfa-lpu.in</a>.
          </p>
        </section>

        {/* AdSense & Cookies Section - CRITICAL FOR GOOGLE ADSENSE APPROVAL */}
        <section className="p-6 md:p-8 bg-amber-500/5 dark:bg-amber-500/10 rounded-3xl border border-amber-500/20 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Globe className="text-[#fe7f2d]" size={20} /> 2. Google AdSense & DoubleClick DART Cookies
          </h2>
          <p className="font-medium text-zinc-800 dark:text-zinc-200">
            Google is a third-party advertising vendor on our site. Google uses cookies, known as DoubleClick DART cookies, to serve ads to our site visitors based upon their visit to <em>alfa-lpu.in</em> and other sites across the Internet.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
            <li>
              <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
            </li>
            <li>
              <strong>Personalized Advertising:</strong> Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              <strong>How to Opt Out:</strong> Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] font-bold hover:underline">Google Ads Settings</a>. Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] font-bold hover:underline">www.aboutads.info/choices</a> or the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] font-bold hover:underline">Network Advertising Initiative Opt-Out Page</a>.
            </li>
          </ul>
        </section>

        {/* Data Collection */}
        <section className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Eye className="text-[#fe7f2d]" size={20} /> 3. Information We Collect
          </h2>
          <p>
            LPU ALFA Portal does not require user registration or mandatory personal logins to access core academic notes, PYQs, GPA calculators, and club directories. However, we may collect minimal data in the following ways:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5">
              <h3 className="font-bold text-xs uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <FileText size={14} className="text-[#fe7f2d]" /> Log Files
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Standard web server log files including IP addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and click counts. These are not linked to personally identifiable information.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 space-y-1.5">
              <h3 className="font-bold text-xs uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <UserCheck size={14} className="text-[#fe7f2d]" /> User Submissions
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                If you contact us directly via our inquiry form or submit secondhand deal listings, we receive your name, email address, phone number, message contents, and attached documents.
              </p>
            </div>
          </div>
        </section>

        {/* Third Party Links & Ad Partners */}
        <section className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Globe className="text-[#fe7f2d]" size={20} /> 4. Third-Party Advertising Partners & Privacy Policies
          </h2>
          <p>
            LPU ALFA Portal’s Privacy Policy does not apply to other advertisers, external student housing websites, YouTube educational channels, or Google Sheets datasets linked on our platform. Thus, we advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-xs md:text-sm">
            <li><strong>Google Privacy & Terms:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] hover:underline">https://policies.google.com/technologies/ads</a></li>
            <li><strong>Google AdSense Policy:</strong> <a href="https://support.google.com/adsense/answer/48182" target="_blank" rel="noopener noreferrer" className="text-[#fe7f2d] hover:underline">https://support.google.com/adsense/answer/48182</a></li>
          </ul>
        </section>

        {/* GDPR & CCPA Rights */}
        <section className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <Shield className="text-[#fe7f2d]" size={20} /> 5. CCPA & GDPR Privacy Rights
          </h2>
          <p>
            Under data protection regulations (including CCPA and GDPR), users have the right to request:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-xs md:text-sm text-zinc-600 dark:text-zinc-300">
            <li><strong>Right to Know:</strong> Disclosure of categories and specific pieces of personal data collected.</li>
            <li><strong>Right to Deletion:</strong> Deletion of any personal data collected about the consumer.</li>
            <li><strong>Right to Opt-Out:</strong> Opt-out of the sale or sharing of personal data.</li>
          </ul>
          <p className="text-xs text-zinc-500 pt-2">
            If you make a request, we have 30 days to respond to you. If you would like to exercise any of these rights, please contact us.
          </p>
        </section>

        {/* Children's Privacy (COPPA) */}
        <section className="p-6 md:p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
            <AlertCircle className="text-[#fe7f2d]" size={20} /> 6. Children's Information Protection (COPPA)
          </h2>
          <p>
            LPU ALFA Portal is designed specifically for university students and higher-education academics. We do not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        {/* Contact Footer */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-2">
          <p className="text-xs text-zinc-500">
            Questions regarding this AdSense-compliant Privacy Policy? Write to us:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-[#fe7f2d]">
            <a href="mailto:harshabacham3@gmail.com" className="hover:underline flex items-center gap-1"><Mail size={12} /> harshabacham3@gmail.com</a>
            <a href="mailto:support@alfa-lpu.in" className="hover:underline flex items-center gap-1"><Mail size={12} /> support@alfa-lpu.in</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
