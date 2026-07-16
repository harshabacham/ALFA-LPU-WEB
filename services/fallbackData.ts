import { PGRoom, Event, Club, Course, Deal, AITool, YouTubeChannel } from '../types';

export const FALLBACK_PG_ROOMS: PGRoom[] = [
  {
    name: "Stanza Living Munich House",
    pg_type: "Boys",
    address: "Law Gate Road, Near Main Highway, Phagwara, Punjab",
    rent: "7500",
    kitchen_security_ac: "+91 98765 43210",
    amenities: "High-speed WiFi, 3 Meals Daily, Power Backup, Gym Access, Laundry Services, 24/7 Security",
    image_urls: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    video_urls: "",
    location_url: "https://maps.google.com",
    description: "Premium fully-managed student housing located just 2 minutes from LPU Law Gate. Features spacious double-sharing rooms, a modern fitness center, game room with billiards, and nutritious, chef-crafted meals. Highly recommended for first-year and second-year engineering students wanting a hassle-free study environment.",
    rating: "4.8",
    total_capacity: "120",
    current_occupancy: "105",
    is_looking_for_roommate: "false",
    roommate_message: "",
    roommate_preferences: "",
    move_in_date: "",
    roommate_contact_number: ""
  },
  {
    name: "Saraswati Girls Residency",
    pg_type: "Girls",
    address: "Deep Nagar, GT Road Backside, Phagwara, Punjab",
    rent: "6800",
    kitchen_security_ac: "+91 98765 01234",
    amenities: "High-speed WiFi, Pure Veg Mess, Power Backup, RO Drinking Water, CCTV Surveillance, Warden Duty",
    image_urls: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    video_urls: "",
    location_url: "https://maps.google.com",
    description: "A secure, quiet, and friendly girls' residency located in Deep Nagar, offering comfortable single and double sharing options. Features a robust three-tier security system with 24/7 female warden presence. Includes high-speed Wi-Fi, pure vegetarian home-style meals, housekeeping, and spacious study tables in every room.",
    rating: "4.7",
    total_capacity: "80",
    current_occupancy: "72",
    is_looking_for_roommate: "true",
    roommate_message: "Looking for a quiet, studios flatmate.",
    roommate_preferences: "Non-smoker, vegetarian",
    move_in_date: "2026-08-01",
    roommate_contact_number: "+91 98765 01234"
  },
  {
    name: "Co-Operative Flats & Studios",
    pg_type: "Co-ed",
    address: "Maheshpa Villa, Jalandhar-Delhi GT Road, Phagwara, Punjab",
    rent: "12000",
    kitchen_security_ac: "+91 99887 76655",
    amenities: "High-speed WiFi, Private Kitchen, Balcony, Covered Parking, Lift, Refrigerator, Air Conditioning",
    image_urls: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    video_urls: "",
    location_url: "https://maps.google.com",
    description: "Modern independent 1BHK studio apartments perfect for senior students or researchers desiring complete privacy and flexible timings. Each studio features a fully equipped modular kitchen, spacious balcony, attached bathroom, air conditioning, and fiber broadband connections. Zero curfew restrictions.",
    rating: "4.6",
    total_capacity: "40",
    current_occupancy: "35",
    is_looking_for_roommate: "false",
    roommate_message: "",
    roommate_preferences: "",
    move_in_date: "",
    roommate_contact_number: ""
  }
];

export const FALLBACK_EVENTS: Event[] = [
  {
    image_url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    title: "LPU Hacks 2026: The Ultimate 36-Hour Hackathon",
    description: "Get ready for the biggest annual technical hackathon at LPU! Team up with fellow coders, designers, and business thinkers to tackle real-world problems in FinTech, EdTech, Healthcare, and Sustainable Development. Prizes worth ₹1,50,000, free meals, official participation certificates, and up to 3 days of approved Duty Leaves for all active participants.",
    link: "https://lpu-hacks.alfa-lpu.in",
    date: "2026-08-25",
    time: "09:00 AM",
    venue: "Uni-Mall Block 3 Auditorium, LPU Campus",
    price: "Free",
    organizer: "LPU Developer Community (GDSC LPU)"
  },
  {
    image_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
    title: "YouthVibe National Cultural Mega Fest",
    description: "The crown jewel of LPU student life! Join over 50 universities participating in dance battlegrounds, fashion pageants, rock band showcases, street plays, and art galleries. Concludes with a grand celebrity star night featuring top Bollywood and independent musical artists. Official event volunteer certifications and major duty leave packages provided.",
    link: "https://youthvibe.lpu.in",
    date: "2026-10-12",
    time: "10:00 AM",
    venue: "Baldev Raj Mittal Unipolis, LPU Campus",
    price: "Free Entry",
    organizer: "Division of Student Welfare (DSW)"
  }
];

export const FALLBACK_CLUBS: Club[] = [
  {
    id: "cl-1",
    logo_link: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=150&h=150&q=80",
    name: "GDG LPU (Google Developer Groups)",
    description: "The primary tech and developer circle on campus. Focused on building production-ready projects in Android, Cloud, Web, Flutter, and Generative AI. We host weekly workshops, build-a-thons, and expert speaker events.",
    category: "Technical",
    form_link: "https://forms.google.com",
    contact_info: "gdg.lpu@alfa-lpu.in",
    meeting_times: "Wednesdays & Saturdays (5:30 PM - 7:00 PM)"
  },
  {
    id: "cl-2",
    logo_link: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&h=150&q=80",
    name: "LPU Abhivyakti (Theater & Dramatics)",
    description: "The leading dramatic society at LPU. We conduct high-energy street plays (Nukkad Natak), stage dramas, and mime acts raising awareness on global and campus issues. Win national trophies and develop unmatched confidence.",
    category: "Creative",
    form_link: "https://forms.google.com",
    contact_info: "abhivyakti.dsw@lpu.in",
    meeting_times: "Daily (5:45 PM - 7:30 PM) at Uni-Mall Basement"
  }
];

export const FALLBACK_COURSES: Course[] = [
  {
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    title: "Full Stack Web Development with React & Node",
    description: "A comprehensive, step-by-step masterclass by Meta. Learn to design responsive web layouts, implement stateful React components, establish robust backend REST APIs, and deploy cloud applications. Free enrollment via LPU's Coursera Student Portal.",
    category: "Technical",
    course_url: "https://coursera.org"
  },
  {
    image_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    title: "Data Structures & Algorithms in Java",
    description: "The gold standard course for placement coding round preparation. Master core algorithmic complexity, data organization, search tree routing, and graph traversal. Extremely critical for dream placement drives at LPU.",
    category: "Coding",
    course_url: "https://coursera.org"
  }
];

export const FALLBACK_DEALS: Deal[] = [
  {
    id: "dl-1",
    title: "Engineering Physics & Mathematics Books (Sem 1 & 2)",
    price: "450",
    category: "Books",
    condition: "Almost New",
    description: "Perfect condition reference books for first-year engineering students. No markings, complete syllabus coverage including textbook and lab manuals. Selling because I cleared my semesters.",
    contact: "+91 94433 22110",
    image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    tags: "Books, B.Tech, CSE",
    rating: "5",
    location: "Law Gate",
    seller_name: "Amit Patel"
  },
  {
    id: "dl-2",
    title: "Kore Ergonomic Study Table",
    price: "1200",
    category: "Furniture",
    condition: "Gently Used",
    description: "Foldable study table with a sturdy metal frame and wood-laminated top. Includes a cup holder and tablet slot. Perfect for Law Gate PG rooms or hostel compartments.",
    contact: "+91 88776 65544",
    image_url: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    tags: "Furniture, Study",
    rating: "4",
    location: "GT Road",
    seller_name: "Sneha Kapoor"
  }
];

export const FALLBACK_AI_TOOLS: AITool[] = [
  {
    tool_name: "LPU Attendance Predictor",
    description: "An intelligent calculator designed specifically for LPU's 75% attendance rule. Input your current attendance and future schedule to know exactly how many bunk leaves you can take safely without getting blocked.",
    category: "Academic Support",
    logo_url: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=150&h=150&q=80",
    tool_url: "https://alfa-lpu.in/gpa"
  },
  {
    tool_name: "PEP Aptitude Solver",
    description: "An AI tutor trained specifically on past quantitative and logical reasoning questions asked during LPU PEP classes. Provides detailed step-by-step solutions and shortcut logic.",
    category: "Placement Prep",
    logo_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=150&h=150&q=80",
    tool_url: "https://alfa-lpu.in/ai-tools"
  }
];

export const FALLBACK_YOUTUBE_CHANNELS: YouTubeChannel[] = [
  {
    category: "Vlogs & News",
    subject: "Campus Life",
    title: "LPU Official Campus Channel",
    url: "https://youtube.com/@lpuuniversity"
  },
  {
    category: "Placement & Career",
    subject: "CSE & Coding",
    title: "Placement Insights with Seniors",
    url: "https://youtube.com"
  }
];
