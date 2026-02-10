
import React, { useState } from 'react';
import { 
  Phone, ShieldAlert, HeartPulse, Flame, PhoneCall, 
  Search, Info, ExternalLink, Mail, Building, Users,
  Ambulance, Siren, AlertCircle, Tag, Copy, CheckCircle2
} from 'lucide-react';

const Emergency: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyToClipboard = (num: string) => {
    const cleanNum = num.replace(/[^\d-]/g, '');
    navigator.clipboard.writeText(cleanNum);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const hostels = [
    { name: 'BH-1', blocks: [
      { id: 'A', landline: '01824-444521' },
      { id: 'B', landline: '01824-444522' },
      { id: 'C', landline: '01824-444523' }
    ], emergency: '9915020442' },
    { name: 'BH-2', blocks: [{ id: 'A, B', landline: '01824-444524' }], emergency: '9888598705' },
    { name: 'BH-3', blocks: [
      { id: 'A, B', landline: '01824-444526' },
      { id: 'C, D', landline: '01824-444527' }
    ], emergency: '9915710553' },
    { name: 'BH-4', blocks: [{ id: 'A, B, C, D, E', landline: '01824-444529' }], emergency: '9876015107' },
    { name: 'BH-5', blocks: [
      { id: 'A, B', landline: '01824-444530' },
      { id: 'C', landline: '01824-444531' }
    ], emergency: '9780036434' },
    { name: 'BH-6', blocks: [
      { id: 'A', landline: '01824-444532' },
      { id: 'B, C', landline: '01824-444533' }
    ], emergency: '9501110445' },
    { name: 'BH-7', blocks: [{ id: '---', landline: '01824-444536' }], emergency: '7508182896' },
    { name: 'BH-8', blocks: [{ id: '---', landline: '01824-444528' }], emergency: '9780005942' },
    { name: 'Apartment', blocks: [{ id: 'A, B, C, D', landline: '01824-444520' }], emergency: '9878977900' },
    { name: 'GH-1', blocks: [{ id: '---', landline: '01824-444081' }], emergency: '9915020443' },
    { name: 'GH-2', blocks: [{ id: '---', landline: '01824-444082' }], emergency: '9876644335' },
    { name: 'GH-3', blocks: [{ id: '---', landline: '01824-444083' }], emergency: '9876740090' },
    { name: 'GH-4', blocks: [{ id: '---', landline: '01824-444084' }], emergency: '9915020444' },
    { name: 'GH-5', blocks: [{ id: 'A, B', landline: '01824-444303' }], emergency: '9876015106' },
    { name: 'GH-6', blocks: [{ id: 'A, B', landline: '01824-444301' }], emergency: '9915020439' },
  ];

  const safetyMedical = [
    { title: 'Hospital Reception', mobile: '---', landline: '01824-444079 / 501227', icon: HeartPulse },
    { title: 'Mr. Jagdeep Singh', mobile: '9780036450', landline: '---', icon: PhoneCall },
    { title: 'Hospital Male Ward', mobile: '---', landline: '01824-444066', icon: Building },
    { title: 'Hospital Female Ward', mobile: '---', landline: '01824-444067', icon: Building },
    { title: 'Medical Laboratory', mobile: '---', landline: '01824-444069', icon: Info },
    { title: 'Dr. N. K. Gupta', mobile: '9878426871', landline: '01824-444071', icon: PhoneCall },
    { title: 'Women Help Center (Dr. Monica)', mobile: '9915020408', landline: '01824-444040', icon: ShieldAlert },
    { title: 'Fire Office (Mr. Kuldeep)', mobile: '9780036402', landline: '---', icon: Flame },
    { title: 'Fire Tender', mobile: '7508183870', landline: '---', icon: Siren },
  ];

  const filteredHostels = hostels.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSafety = safetyMedical.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CopyButton = ({ num }: { num: string }) => (
    <button 
      onClick={(e) => { e.preventDefault(); copyToClipboard(num); }}
      className="p-1.5 hover:bg-black/10 rounded-lg transition-colors ml-auto group/copy"
      title="Copy Number"
    >
      {copiedNumber === num ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="opacity-40 group-hover/copy:opacity-100" />}
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4">
            <div className="p-3 bg-red-600 text-white rounded-2xl shadow-xl animate-pulse">
               <Siren size={32} />
            </div>
            Emergency Support
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Official university emergency directory available 24/7</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search hostel or department..." 
            className="pl-12 pr-6 py-4 w-full sm:w-96 rounded-[1.5rem] border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all shadow-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Critical Hotlines */}
      <div className="grid md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-red-500/30 relative overflow-hidden group">
            <Flame className="absolute top-4 right-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-100">Fire & Safety Cell</h3>
               <p className="text-4xl font-black">24×7</p>
               <div className="space-y-2">
                 <div className="flex items-center gap-3">
                   <a href="tel:01824-444201" className="text-lg font-bold hover:translate-x-1 transition-transform flex items-center gap-3">
                      <Phone size={20} /> 01824-444201
                   </a>
                   <CopyButton num="01824-444201" />
                 </div>
                 <div className="flex items-center gap-3">
                   <a href="tel:7508183870" className="text-lg font-bold hover:translate-x-1 transition-transform flex items-center gap-3">
                      <Siren size={20} /> 7508183870
                   </a>
                   <CopyButton num="7508183870" />
                 </div>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary-500/30 relative overflow-hidden group">
            <Ambulance className="absolute top-4 right-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-100">Hospital Reception</h3>
               <p className="text-4xl font-black">24×7</p>
               <div className="space-y-2">
                 <div className="flex items-center gap-3">
                   <a href="tel:01824-444079" className="text-lg font-bold hover:translate-x-1 transition-transform flex items-center gap-3">
                      <HeartPulse size={20} /> 01824-444079
                   </a>
                   <CopyButton num="01824-444079" />
                 </div>
                 <div className="flex items-center gap-3">
                   <a href="tel:01824-501227" className="text-lg font-bold hover:translate-x-1 transition-transform flex items-center gap-3">
                      <Phone size={20} /> 01824-501227
                   </a>
                   <CopyButton num="01824-501227" />
                 </div>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-pink-600 to-pink-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-pink-500/30 relative overflow-hidden group">
            <ShieldAlert className="absolute top-4 right-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
            <div className="relative z-10 space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-100">Women Help Center</h3>
               <p className="text-4xl font-black">9AM - 5PM</p>
               <div className="space-y-2">
                 <div className="flex items-center gap-3">
                   <a href="tel:9915020408" className="text-lg font-bold hover:translate-x-1 transition-transform flex items-center gap-3">
                      <PhoneCall size={20} /> 9915020408
                   </a>
                   <CopyButton num="9915020408" />
                 </div>
                 <div className="flex items-center gap-3">
                   <a href="tel:01824-444040" className="text-lg font-bold hover:translate-x-1 transition-transform flex items-center gap-3">
                      <Building size={20} /> 01824-444040
                   </a>
                   <CopyButton num="01824-444040" />
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* Residential Facilities Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-primary-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Residential Facilities</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHostels.map((hostel, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
                  <Building size={24} />
                </div>
                <div className="text-right">
                   <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Hostel</span>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white">{hostel.name}</h3>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                {hostel.blocks.map((block, bIdx) => (
                  <div key={bIdx} className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Block {block.id}</span>
                      {block.landline !== '---' && <CopyButton num={block.landline} />}
                    </div>
                    {block.landline !== '---' && (
                      <a href={`tel:${block.landline}`} className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 transition-colors flex items-center gap-2">
                        <Phone size={14} /> {block.landline}
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                   <span className="flex items-center gap-1"><AlertCircle size={10} /> Emergency Mobile</span>
                   <CopyButton num={hostel.emergency} />
                </p>
                <a href={`tel:${hostel.emergency}`} className="text-lg font-black text-gray-900 dark:text-white hover:text-red-600 transition-colors flex items-center justify-between">
                   {hostel.emergency}
                   <PhoneCall size={20} className="text-red-500 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Medical Officials Grid */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-primary-600 rounded-full"></div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Safety & Medical Personnel</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSafety.map((official, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex gap-6 items-center group hover:border-primary-500/50 transition-all">
              <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                <official.icon size={28} />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 truncate">{official.title}</h4>
                <div className="space-y-1">
                   {official.mobile !== '---' && (
                     <div className="flex items-center gap-2">
                       <a href={`tel:${official.mobile}`} className="text-xs font-bold text-primary-600 hover:underline block">Mobile: {official.mobile}</a>
                       <CopyButton num={official.mobile} />
                     </div>
                   )}
                   {official.landline !== '---' && (
                     <div className="flex items-center gap-2">
                       <a href={`tel:${official.landline}`} className="text-xs font-medium text-gray-500 block">Landline: {official.landline}</a>
                       <CopyButton num={official.landline} />
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fee & Student Relationships */}
      <section className="grid md:grid-cols-2 gap-8">
         <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600">
                  <Tag size={24} />
               </div>
               <h3 className="text-xl font-bold dark:text-white">Fee Related Queries</h3>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Help Desk (9AM - 5PM)</p>
                    <CopyButton num="01824-444337" />
                  </div>
                  <a href="tel:01824-444337" className="text-lg font-bold text-gray-800 dark:text-gray-200">01824-444337</a>
               </div>
               <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Support</p>
                  <a href="mailto:helpdesk.accounts@lpu.co.in" className="text-sm font-bold text-primary-600 hover:underline">helpdesk.accounts@lpu.co.in</a>
               </div>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                  <Users size={24} />
               </div>
               <h3 className="text-xl font-bold dark:text-white">Student Relationship</h3>
            </div>
            <div className="space-y-4">
               <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Direct Helpline</p>
                    <div className="flex gap-2">
                       <CopyButton num="01824-510311" />
                       <CopyButton num="7347000929" />
                    </div>
                  </div>
                  <div className="space-x-3">
                    <a href="tel:01824-510311" className="text-base font-bold text-gray-800 dark:text-gray-200">01824-510311</a>
                    <span className="text-gray-300">|</span>
                    <a href="tel:7347000929" className="text-base font-bold text-gray-800 dark:text-gray-200">7347000929</a>
                  </div>
               </div>
               <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Parent Support Email</p>
                  <a href="mailto:parents@lpu.co.in" className="text-sm font-bold text-primary-600 hover:underline">parents@lpu.co.in</a>
               </div>
            </div>
         </div>
      </section>

      {/* Quick Alert Disclaimer */}
      <div className="bg-red-50 dark:bg-red-900/10 p-8 rounded-[2.5rem] border border-red-100 dark:border-red-900/20 flex gap-6 items-start">
         <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl text-red-600 shadow-sm">
            <AlertCircle size={24} />
         </div>
         <div>
            <h4 className="font-bold text-red-900 dark:text-red-400 mb-1">Emergency Protocol</h4>
            <p className="text-sm text-red-700 dark:text-red-300/80 leading-relaxed">
               For life-threatening emergencies, please call the Hospital Reception or Fire Cell immediately. Hostel emergency mobile numbers are intended for urgent facility issues and resident safety concerns. Official landlines are monitored from 8:00 AM to 10:00 PM.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Emergency;
