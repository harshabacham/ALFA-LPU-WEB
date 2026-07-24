import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Mail, MapPin, Clock, Send, 
  CheckCircle, MessageSquare, ShieldCheck, Users, ArrowUpRight
} from 'lucide-react';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-700 text-left">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#fe7f2d] transition-colors border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-full bg-white dark:bg-gray-900 shadow-sm cursor-pointer"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#fe7f2d]/10 text-[#fe7f2d] rounded-full text-[10px] font-black uppercase tracking-widest">
          <MessageSquare size={14} /> Get in Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
          Contact Us
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base max-w-xl">
          Have an inquiry, feedback, or want to contribute study notes? Reach out and our peer coordinate team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Sidebar (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Official Coordinates
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Support</h4>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    support@alfa-lpu.in
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">harshabacham3@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Campus Location</h4>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    Law Gate Surrounding Area
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">Phagwara, Punjab, 144411, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Response Hours</h4>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                    Within 24 - 48 Hours
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">Monday to Saturday • Student-driven</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center gap-3">
            <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 leading-relaxed">
              Your details are covered under our privacy policies. We never sell, lease, or distribute email contacts.
            </p>
          </div>

          {/* WhatsApp Community Box */}
          <div className="p-6 bg-gradient-to-br from-[#25D366]/10 via-emerald-500/10 to-teal-500/10 border border-[#25D366]/30 rounded-3xl space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#25D366]/20">
                <WhatsAppIcon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase font-display tracking-wider">
                  WhatsApp Community
                </h4>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Official LPU Student Group
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
              Prefer real-time chat? Join 10,000+ LPU peers in our official WhatsApp group for instant announcements & peer assistance.
            </p>
            <a 
              href="https://chat.whatsapp.com/Dn9sOCWDBfDDhijvuDD0hs"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20 transition-all font-display"
            >
              <WhatsAppIcon size={16} /> Join Community Group <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* Message Form Area (8 columns) */}
        <div className="lg:col-span-8">
          {submitted ? (
            <div className="p-10 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                Message Sent Successfully!
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for contacting the ALFA coordinate team. A student moderator has received your inquiry and will respond to your email address shortly.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-3 bg-[#fe7f2d] text-white rounded-full font-bold text-xs uppercase tracking-wider hover:bg-opacity-95 shadow-lg shadow-[#fe7f2d]/20 transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form 
              onSubmit={handleSubmit}
              className="p-8 md:p-10 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] space-y-6 shadow-sm"
            >
              <h3 className="text-xl font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4">
                Submit an Inquiry Form
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Your Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your full name" 
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-transparent focus:border-[#fe7f2d] focus:ring-4 focus:ring-[#fe7f2d]/5 outline-none transition-all font-medium text-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Your Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    required
                    placeholder="Enter your email address" 
                    className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-transparent focus:border-[#fe7f2d] focus:ring-4 focus:ring-[#fe7f2d]/5 outline-none transition-all font-medium text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  placeholder="What is this regarding? (e.g., Bookmarks, Notes, Room details)" 
                  className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-transparent focus:border-[#fe7f2d] focus:ring-4 focus:ring-[#fe7f2d]/5 outline-none transition-all font-medium text-sm"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Your Message <span className="text-red-500">*</span></label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Describe your inquiry, report errors, or paste a link to your shared study notes here..." 
                  className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-transparent focus:border-[#fe7f2d] focus:ring-4 focus:ring-[#fe7f2d]/5 outline-none transition-all font-medium text-sm resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-[#fe7f2d] hover:bg-opacity-95 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#fe7f2d]/25 transition-all cursor-pointer"
              >
                Send Message Form <Send size={14} />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default Contact;
