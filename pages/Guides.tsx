import React, { useState } from 'react';
import { 
  BookOpen, Calendar, Bed, Sparkles, ChevronRight, 
  Clock, Share2, ArrowLeft, Search, GraduationCap, 
  HelpCircle, ShieldCheck, Heart, Award, Home as HomeIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuideArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  summary: string;
  content: React.ReactNode;
}

const Guides: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGuide, setActiveGuide] = useState<GuideArticle | null>(null);

  const guidesData: GuideArticle[] = [
    {
      id: "academic-survival",
      title: "LPU Academic Survival Guide: Attendance, CGPA & Exams",
      category: "Academics",
      readTime: "6 min read",
      icon: GraduationCap,
      summary: "Master LPU's academic policies, understand the 75% attendance rule, and learn strategies to maintain an 8.5+ CGPA.",
      content: (
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p className="text-lg leading-relaxed font-medium">
            Academic life at Lovely Professional University (LPU) is structured, rigorous, and highly governed by precise policies. To excel, you need to understand both the formal rules and the informal best practices. This guide is curated by senior peers to help you navigate your academic journey smoothly.
          </p>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">01.</span> The Golden Rule: 75% Attendance
          </h3>
          <p>
            LPU has a strict and non-negotiable policy regarding attendance. You must maintain at least <strong>75% attendance</strong> in each course to be eligible to sit for the End-Term Examinations.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>The Block List:</strong> If your attendance drops below 75% in a subject, you will be put on the Block List in your UMS (University Management System). Being blocked means you receive an automatic 'E' or 'F' grade for that course due to shortage of attendance.</li>
            <li><strong>Medical and On-Duty Margins:</strong> While medical leaves and duty leaves exist, they should be applied proactively. Medical leave can provide a minor margin under special circumstances approved by the Head of Department (HOD) and the University Medical Board, but it is always safest to stay above 80% dynamically.</li>
            <li><strong>Daily Tracking:</strong> Check your attendance daily on the LPU Touch app or UMS portal. Attendance errors must be reported to the concerned subject teacher within 48 hours.</li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">02.</span> Maintaining an 8.5+ CGPA
          </h3>
          <p>
            Your CGPA is determined by your performance in Mid-Term Examinations, End-Term Examinations, Continuous Assessment (CA), and practical files/vivas. Here is how the weightage typically breaks down for a standard course:
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 my-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs font-bold uppercase text-zinc-400">Mid-Term</div>
                <div className="text-lg font-black text-zinc-800 dark:text-zinc-200">20% - 25%</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-zinc-400">End-Term</div>
                <div className="text-lg font-black text-[#fe7f2d]">40% - 50%</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-zinc-400">Continuous Assessment</div>
                <div className="text-lg font-black text-zinc-800 dark:text-zinc-200">25% - 30%</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-zinc-400">Practicals/Vivas</div>
                <div className="text-lg font-black text-zinc-800 dark:text-zinc-200">10% - 15%</div>
              </div>
            </div>
          </div>
          <p>
            <strong>Pro Tip for Continuous Assessment (CA):</strong> CAs consist of class tests, assignments, presentations, and online quizzes. Many students neglect CA, but it is the easiest place to score full marks! Always complete your CA assignments on time and don't skip mock tests on UMS.
          </p>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">03.</span> Mitigating Backlogs and Re-appears
          </h3>
          <p>
            If you score below the passing marks (usually 30% in End-Term and 40% aggregate), you will get a Re-appear.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Re-appear Exams:</strong> These are held in the following semester. You will have to pay a re-appear examination fee via UMS to register.</li>
            <li><strong>Make-up Exams:</strong> If you missed an exam due to an official medical emergency or high-level placement drive, you can apply for a Make-up exam. Make-up exams do not carry the "re-appear" label on your transcript.</li>
          </ul>
        </div>
      )
    },
    {
      id: "duty-leaves",
      title: "How to Secure Duty Leaves at LPU: A Practical Guide",
      category: "Academics",
      readTime: "5 min read",
      icon: BookOpen,
      summary: "Understand the end-to-end process of applying, validating, and securing official duty leaves (DL) for student fests, sports, and placement drives.",
      content: (
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p className="text-lg leading-relaxed font-medium">
            Duty Leaves (DL) are essential at LPU. If you are participating in a university-approved event, hackathon, cultural performance, or placement drive, you can claim attendance for the classes you missed. However, getting your DL approved is a structured process that requires attention to detail.
          </p>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">01.</span> Types of Duty Leaves Eligible for Approval
          </h3>
          <p>
            You cannot get a duty leave for casual reasons. DL is only granted for the following categories:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Placements:</strong> Attending official university campus placement drives, PPTs (Pre-Placement Talks), or interviews coordinated by the Division of Career Services.</li>
            <li><strong>Cultural Events:</strong> Representing your department or the university in YouthVibe, One India, One World, national fests, or youth festivals.</li>
            <li><strong>Technical and Hackathons:</strong> Participating in hackathons, code jams, or technical symposiums representing LPU or an official student organization/club.</li>
            <li><strong>Sports:</strong> Participating in inter-university athletic meets, tournaments, or physical training camps.</li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">02.</span> Step-by-Step DL Application Flow
          </h3>
          <p>
            Do not wait until the end of the semester to request duty leaves! Follow these strict steps to ensure approval:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Obtain Prior Approval:</strong> Before participating in the event, get verbal or written approval from your Mentor or Block Academic Coordinator.
            </li>
            <li>
              <strong>Get the Event Certificate/List:</strong> Upon event completion, collect the official participation list, certificate, or pass signed by the organizing authority (e.g., Department of Student Welfare, Division of Career Services, or Sport Coordinator).
            </li>
            <li>
              <strong>Log into UMS Portal:</strong> Navigate to the <em>Duty Leave Management System</em> inside the UMS website.
            </li>
            <li>
              <strong>Upload Supporting Documents:</strong> Select the dates, classes, and specific times you missed. Upload a scanned, high-quality copy of your participation certificate or selection letter.
            </li>
            <li>
              <strong>Track Department Review:</strong> The application first goes to your Course Instructor, then to your HOD, and finally to the central registrar for final adjustments. You can track this status in real-time under your DL tracker.
            </li>
          </ol>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">03.</span> Common Reasons for DL Rejection
          </h3>
          <p>
            Avoid these critical mistakes to ensure your duty leaves are not rejected:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Late Submission:</strong> DL requests must be submitted within <strong>7 working days</strong> of the event. Requests submitted after this window are automatically rejected by the system.</li>
            <li><strong>Blurry Uploads:</strong> Uploading blurry, cut-off, or unreadable screenshots of certificates will result in immediate rejection by the HOD.</li>
            <li><strong>Mismatch in Timing:</strong> Applying for a full-day DL when you were only active during a 1-hour session. Ensure the hours selected exactly match the event itinerary.</li>
          </ul>
        </div>
      )
    },
    {
      id: "placements-prep",
      title: "LPU Placement Preparation Guide: How to Ace the Drives",
      category: "Placements",
      readTime: "7 min read",
      icon: Award,
      summary: "An industry-vetted roadmap specifically for LPU students to crack technical rounds, aptitude tests, and HR interviews for mass and dream recruitments.",
      content: (
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p className="text-lg leading-relaxed font-medium">
            LPU has one of the largest placement operations in India, attracting premium dream recruiters (such as Google, Microsoft, Amazon) and giant mass recruiters (Cognizant, TCS, Capgemini, Wipro). Cracking these placements requires a highly tactical approach.
          </p>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">01.</span> Understanding the Placement Process
          </h3>
          <p>
            The placement journey typically begins in your penultimate year. It is managed via the **UMS Placement Portal** and supervised by the Division of Career Services. Here is what to expect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>PEP (Placement Enhancement Program):</strong> LPU conducts mandatory PEP classes covering quantitative aptitude, logical reasoning, verbal ability, and soft skills. Do not skip PEP! It is graded and directly influences your eligibility for high-paying dream drives.</li>
            <li><strong>Eligibility Criteria:</strong> Most companies mandate a minimum CGPA of 6.0, 7.0, or 7.5, with **no active backlogs**. Maintaining a clean academic record is your ticket to entry.</li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">02.</span> Step-by-Step Technical Placement Strategy
          </h3>
          <p>
            If you are aiming for software engineering or technical roles, follow this roadmap:
          </p>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Master Data Structures and Algorithms (DSA):</strong> Start with arrays, strings, linked lists, and progress to trees, graphs, and dynamic programming. Practice daily on platforms like LeetCode and GeeksforGeeks.
            </li>
            <li>
              <strong>Build Strong Projects:</strong> Have at least 2-3 unique, fully functional projects on your resume. Avoid generic projects like simple calculators or basic weather apps. Focus on full-stack apps, machine learning models, or utility browser extensions.
            </li>
            <li>
              <strong>Practice Aptitude and Verbal:</strong> Many brilliant coders fail in the first round because they ignore aptitude. Solve quantitative problems daily (R.S. Aggarwal level) and practice mock online tests on platforms like IndiaBIX.
            </li>
            <li>
              <strong>Optimize Your Resume:</strong> Keep your resume to exactly one page. Highlight your tech stack, GitHub links, deployment URLs, hackathon participations, and GPA.
            </li>
          </ol>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">03.</span> Leveraging the LPU Placement Cell
          </h3>
          <p>
            The Placement Cell regularly updates mock test papers and recruiter-specific questions. Keep an active profile on the UMS PEP section, solve all mock tests, attend company-specific PPT sessions, and register for drives within the specified deadline (usually 24 hours from the announcement).
          </p>
        </div>
      )
    },
    {
      id: "accommodation",
      title: "PG & Hostel Guide: Renting Around LPU Campus",
      category: "Housing",
      readTime: "5 min read",
      icon: Bed,
      summary: "A transparent guide on choosing accommodation. Compare staying inside the campus versus renting PGs, flats, or independent rooms outside.",
      content: (
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p className="text-lg leading-relaxed font-medium">
            Finding the right place to live is crucial for your focus, health, and peace of mind during your college years. LPU has a massive campus population, which has spawned a major housing ecosystem both on-campus and off-campus. This guide analyzes your options objectively.
          </p>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">01.</span> On-Campus Hostels vs. Off-Campus PGs
          </h3>
          <p>
            Here is a realistic comparison of both accommodation options:
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="p-3 font-bold text-zinc-700 dark:text-zinc-300">Feature</th>
                  <th className="p-3 font-bold text-zinc-700 dark:text-zinc-300">On-Campus Hostels</th>
                  <th className="p-3 font-bold text-[#fe7f2d]">Off-Campus PGs/Flats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr>
                  <td className="p-3 font-semibold">Commute</td>
                  <td className="p-3">0 minutes. Walk straight to classrooms.</td>
                  <td className="p-3">5 - 20 minutes via auto, cycle, or walk.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Curfew</td>
                  <td className="p-3">Strict curfew (typically 10 PM).</td>
                  <td className="p-3">Flexible curfews or self-managed entry.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Food</td>
                  <td className="p-3">Mess system included in hostel fee.</td>
                  <td className="p-3">Cook, order, tiffin service, or local dhabas.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Cost</td>
                  <td className="p-3">Higher annual upfront payment.</td>
                  <td className="p-3">Lower monthly rentals, variable electricity.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">02.</span> Major Off-Campus Locations to Consider
          </h3>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Law Gate:</strong> The most popular off-campus student hub. It is vibrant, packed with dhabas, stationery shops, gyms, and local markets. It is right opposite the main gate, making it convenient. However, it can be noisy and crowded.
            </li>
            <li>
              <strong>GT Road (Main Entrance Surrounding):</strong> Houses premium apartments, high-end PGs with luxury amenities (like swimming pools and private gyms), and individual flats. Convenient for auto boarding.
            </li>
            <li>
              <strong>Deep Nagar & Phagwara Suburbs:</strong> Quiet, peaceful residential neighborhoods located slightly further from campus. Rentals here are extremely cheap and ideal for senior students renting independent 2BHK/3BHK flats with friends.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">03.</span> Rental Checklist: What to Inspect Before Paying
          </h3>
          <p>
            Do not sign a lease or pay security deposits until you have confirmed the following:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Electricity Billing:</strong> Understand if electricity is charged at commercial rates (usually ₹10 to ₹12 per unit) or residential rates. AC billing can inflate your monthly expenses.</li>
            <li><strong>Water & Power Backup:</strong> Verify if there are working inverters/generators for power cuts, and checking the water supply pressure is consistent.</li>
            <li><strong>WiFi Quality:</strong> High-speed internet is essential for your studies. Ask the PG manager for a speed test or verify which local providers have fiber connections.</li>
            <li><strong>Refund Policy:</strong> Get security deposit refund terms written explicitly on a signed lease agreement.</li>
          </ul>
        </div>
      )
    },
    {
      id: "fests-clubs",
      title: "Extracurriculars: Joining LPU Clubs, Chapters & Fests",
      category: "Campus Life",
      readTime: "5 min read",
      icon: Sparkles,
      summary: "Discover how to join active LPU student organizations (DSW, IEEE, DSC) and maximize soft-skill credits, certificates, and duty leaves.",
      content: (
        <div className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p className="text-lg leading-relaxed font-medium">
            Campus life at LPU extends far beyond the four walls of classrooms. Engaging in extracurricular activities is one of the best ways to build a stellar resume, develop leadership traits, network with outstanding peers, and secure essential duty leaves.
          </p>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">01.</span> DSW (Department of Student Welfare)
          </h3>
          <p>
            The Department of Student Welfare, located inside the **Uni-Mall**, is the nerve center of all student fests, national-level cultural groups, hobby clubs, and student organizations. DSW handles registration for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>YouthVibe:</strong> LPU's signature annual national inter-university cultural and technical fest. It hosts celebrity concerts, fashion shows, street plays, and massive coding battles.</li>
            <li><strong>One India & One World:</strong> Colorful multi-ethnic parades showcasing the heritage of Indian states and international cultures of global LPU students.</li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">02.</span> Professional Chapters and Clubs
          </h3>
          <p>
            Joining professional groups can help you gain massive technical exposure:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <strong>Google Developer Groups (GDG / GDSC):</strong> Focused on Android, cloud, Web, and AI. They host bootcamps, solution challenges, and local hackathons.
            </li>
            <li>
              <strong>IEEE Student Branch LPU:</strong> Perfect for engineering students looking to conduct research, attend technical conferences, and connect with global researchers.
            </li>
            <li>
              <strong>Hobby and Community Clubs:</strong> Ranging from theater (Abhivyakti), dance, photography, poetry, to social welfare clubs like Red Ribbon.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 pt-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="text-[#fe7f2d]">03.</span> How to Join and Get Involved
          </h3>
          <p>
            Club recruitments usually happen at the start of the Autumn semester (around August-September). Keep an eye on notices around the block boards, social channels of various clubs, or visit the DSW desks in Uni-Mall. 
          </p>
          <p>
            <strong>The Networking Payoff:</strong> Being an active member of an organizing committee grants you hands-on team management experience, which is highly appreciated during placement interviews. Furthermore, organizing teams can claim official duty leaves for the days spent coordinating fests!
          </p>
        </div>
      )
    }
  ];

  const filteredGuides = guidesData.filter(guide => 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-700 text-left">
      
      {/* Detail view of active guide */}
      {activeGuide ? (
        <div className="space-y-8 max-w-4xl mx-auto">
          <button 
            onClick={() => setActiveGuide(null)}
            className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#fe7f2d] transition-colors border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Guides Hub
          </button>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 text-primary-500 rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
              {activeGuide.category}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 dark:text-white tracking-tight leading-tight">
              {activeGuide.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1"><Clock size={13} /> {activeGuide.readTime}</span>
              <span>•</span>
              <span className="text-zinc-500 dark:text-zinc-400">Author: Alfa Peer Contributors</span>
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.01)] leading-relaxed">
            {activeGuide.content}
          </div>

          <div className="pt-8 border-t border-zinc-200/50 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" /> Peer Verified Academic Resource
            </div>
            <button 
              onClick={async () => {
                if (navigator.share) {
                  try {
                    await navigator.share({
                      title: activeGuide.title,
                      text: activeGuide.summary,
                      url: window.location.href
                    });
                  } catch (e) {
                    console.log("Share failed:", e);
                  }
                }
              }}
              className="px-6 py-3 bg-[#fe7f2d] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-opacity-90 shadow-lg shadow-[#fe7f2d]/20 transition-all cursor-pointer"
            >
              <Share2 size={14} /> Share Guide
            </button>
          </div>
        </div>
      ) : (
        /* Grid list view of all guides */
        <div className="space-y-10">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fe7f2d]/10 text-[#fe7f2d] rounded-full text-[10px] font-bold uppercase tracking-wider font-display">
                <Sparkles size={12} className="animate-spin-slow" /> Official Guidelines & Advice
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none font-display">
                Campus Guides
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-sm md:text-base max-w-xl">
                Comprehensive, high-value, and actionable guides verified by seniors to help you master exams, secure attendance, choose housing, and clear placements.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search campus guides..." 
                className="pl-11 pr-4 py-3.5 w-full rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all shadow-sm font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Academic Warning Card for AdSense Policy compliance content */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between text-left">
            <div className="space-y-1 flex-grow">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <HelpCircle size={18} className="text-[#fe7f2d]" /> Need Official LPU Academic Support?
              </h3>
              <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-3xl leading-relaxed">
                Remember, while our peer guidelines provide practical wisdom from LPU graduates, always reference your official LPU Touch mobile app and UMS account for specific administrative notices and real-time attendance queries.
              </p>
            </div>
            <a 
              href="https://ums.lpu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#fe7f2d] dark:hover:border-[#fe7f2d] text-zinc-700 dark:text-zinc-200 rounded-full font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap"
            >
              Access UMS Login
            </a>
          </div>

          {/* Bento-grid of Guides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide, idx) => {
              const IconComp = guide.icon;
              return (
                <div 
                  key={guide.id}
                  onClick={() => setActiveGuide(guide)}
                  className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-[2rem] p-6 md:p-8 space-y-6 hover:border-[#fe7f2d] dark:hover:border-[#fe7f2d] transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/[0.01] cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#fe7f2d]/10 text-[#fe7f2d] flex items-center justify-center">
                        <IconComp size={24} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 rounded-full border border-zinc-100 dark:border-zinc-700">
                        {guide.category}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg md:text-xl font-extrabold text-zinc-950 dark:text-white tracking-tight group-hover:text-[#fe7f2d] transition-colors leading-snug">
                        {guide.title}
                      </h2>
                      <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                        {guide.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      <Clock size={12} /> {guide.readTime}
                    </span>
                    <span className="text-xs font-bold text-[#fe7f2d] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                      Read Guide <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <HelpCircle className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3" size={40} />
              <p className="text-zinc-500 dark:text-zinc-400 font-bold">No campus guides matched your search.</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-3 text-xs font-bold text-[#fe7f2d] hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Guides;
