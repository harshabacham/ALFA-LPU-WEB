import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogType?: string;
  image?: string;
}

const DEFAULT_IMAGE = "https://i.postimg.cc/d0dg476z/Chat-GPT-Image-Jun-11-2025-07-35-42-AM.png";
const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return "https://alfa-lpu.web.app";
};

const ROUTE_SEO_MAP: Record<string, SEOConfig> = {
  '/': {
    title: 'Alfa LPU - Lovely Professional University Student Portal, Clubs, Fests & Marketplace',
    description: 'Alfa LPU is the ultimate student hub for Lovely Professional University. Access live LPU club registrations, campus events, fests, student marketplace buy/sell, CGPA calculator, PYQs, study notes, campus directory, emergency contacts, and YouTube courses.',
    keywords: 'Lovely Professional University, LPU, Alfa LPU, LPU student portal, LPU clubs, LPU events, LPU fests, LPU marketplace, LPU CGPA calculator, LPU notes, LPU PYQ, LPU UMS, LPU study materials, LPU student platform, LPU campus guide',
  },
  '/clubs': {
    title: 'LPU Student Clubs & Societies Directory - Alfa LPU',
    description: 'Discover and register for 100+ LPU student clubs, cultural societies, technical organizations, and youth leadership communities at Lovely Professional University with live Google Sheet integration.',
    keywords: 'LPU clubs, Lovely Professional University societies, LPU tech clubs, LPU cultural clubs, join LPU club, LPU student organizations, LPU youth parliament, LPU robotics club',
  },
  '/events': {
    title: 'LPU Campus Events, Fests & Hackathons 2026 - Alfa LPU',
    description: 'Explore upcoming campus events, cultural fests, tech hackathons, esports tournaments, workshops, and celebrity nights at Lovely Professional University with Google Calendar integration.',
    keywords: 'LPU events, LPU fests, LPU One India, LPU One World, LPU Youth Vibe, LPU hackathons, Lovely Professional University event registration, LPU celebrity night, LPU concerts',
  },
  '/deals': {
    title: 'LPU Student Marketplace - Buy & Sell Books, Cycles & Gear - Alfa LPU',
    description: 'Buy, sell, and rent used textbooks, bicycles, mattresses, laptop accessories, and hostel essentials directly from fellow Lovely Professional University students.',
    keywords: 'LPU marketplace, buy sell LPU, LPU used books, LPU secondhand cycle, LPU hostel furniture, Lovely Professional University buy and sell, LPU student deals, LPU Law Gate deals',
  },
  '/notes': {
    title: 'LPU Academic Notes, PYQ Papers & Syllabus - Alfa LPU',
    description: 'Free download LPU subject notes, previous year question papers (PYQs), assignment guides, lab manuals, and exam preparation material for CSE, ECE, MBA, B.Tech & Pharmacy.',
    keywords: 'LPU notes, LPU PYQ, LPU previous year question papers, LPU syllabus, LPU study materials, LPU CSE notes, LPU BTech question papers, Lovely Professional University notes',
  },
  '/gpa': {
    title: 'LPU CGPA & TGPA Calculator - Alfa LPU',
    description: 'Accurate online LPU CGPA and TGPA calculator designed for Lovely Professional University grading system. Estimate grade points, target CGPA, and track academic progress effortlessly.',
    keywords: 'LPU CGPA calculator, LPU TGPA calculator, LPU grade calculator, Lovely Professional University grading system, LPU CGPA estimator, LPU UMS marks calculator',
  },
  '/pg-rooms': {
    title: 'LPU PGs, Flats & Rooms Near Law Gate & Phagwara - Alfa LPU',
    description: 'Find verified PG rooms, student flats, food mess facilities, and rented accommodation near LPU Law Gate, Main Gate, and Phagwara with authentic student reviews and contact info.',
    keywords: 'LPU PG rooms, LPU Law Gate PG, flats near LPU, LPU hostel vs PG, PG near Lovely Professional University, LPU room rent, Phagwara PG for students, LPU mess food',
  },
  '/duty-leaves': {
    title: 'LPU Duty Leave Application Guide & Process - Alfa LPU',
    description: 'Step-by-step guide to applying for Duty Leaves (DL) at Lovely Professional University for club activities, sports, cultural representation, and events on UMS.',
    keywords: 'LPU duty leave, LPU DL application, how to apply DL in LPU, LPU UMS duty leave, Lovely Professional University attendance duty leave, LPU DL rules',
  },
  '/courses': {
    title: 'Free Skill Courses & Certifications for LPU Students - Alfa LPU',
    description: 'Access curated free coding courses, web development tutorials, data science certifications, and career skills tailored for Lovely Professional University students.',
    keywords: 'free coding courses LPU, free web development course, LPU computer science resources, free certifications students, tech skills LPU',
  },
  '/ai-tools': {
    title: 'LPU AI Academic & Study Assistant Tools - Alfa LPU',
    description: 'AI-powered study tools for LPU students to generate subject summaries, draft emails to faculty, format assignments, and prepare for viva questions.',
    keywords: 'LPU AI tools, AI study helper, LPU assignment generator, AI viva preparation, student AI assistants, Lovely Professional University AI',
  },
  '/emergency': {
    title: 'LPU Emergency Contact Numbers, Security & Helpline - Alfa LPU',
    description: 'Direct emergency helpline numbers for LPU Campus Security, UniHospital, Warden desks, Law Gate Police Station, Ambulance, and Student Grievance Helpline.',
    keywords: 'LPU emergency contacts, LPU security helpline, LPU UniHospital number, LPU warden contact, Lovely Professional University emergency number, LPU Law Gate police contact',
  },
  '/youtube': {
    title: 'Top Educational YouTube Channels for LPU Subjects - Alfa LPU',
    description: 'Handpicked, high-rated YouTube channels covering LPU semester subjects like Engineering Mathematics, Data Structures, Java, DBMS, and Accounting.',
    keywords: 'LPU best YouTube channels, best YouTube channel for BTech CSE, LPU maths YouTube, engineering semester exam YouTube, study channels LPU',
  },
  '/about': {
    title: 'About Alfa LPU - The Student Community Platform for LPU',
    description: 'Learn about Alfa LPU, an open-source student-driven platform empowering Lovely Professional University students with campus information, tools, notes, and community resources.',
    keywords: 'About Alfa LPU, LPU student community, Lovely Professional University platform, LPU student portal, Alfa LPU mission',
  },
  '/contact': {
    title: 'Contact Alfa LPU - Student Support & Inquiries',
    description: 'Get in touch with the Alfa LPU team for feedback, club listing requests, marketplace support, campus event promotion, or collaboration opportunities.',
    keywords: 'Contact Alfa LPU, LPU support, list club on Alfa LPU, contact LPU student portal, Alfa LPU feedback',
  },
  '/guides': {
    title: 'LPU Campus Navigation & Freshman Survival Guide - Alfa LPU',
    description: 'Essential campus guide for new Lovely Professional University students: UniHospital, food courts, Block locations, UMS portal tips, hostel rules, and campus life hacks.',
    keywords: 'LPU freshman guide, LPU campus survival guide, LPU block numbers, LPU UniHospital guide, LPU campus map, LPU hostel rules, LPU UMS guide',
  },
  '/privacy': {
    title: 'Privacy Policy - Alfa LPU Platform',
    description: 'Privacy Policy for Alfa LPU student platform outlining data protection, user privacy, cookies, and security guidelines.',
    keywords: 'Alfa LPU privacy policy, LPU data protection, user privacy',
  },
  '/terms': {
    title: 'Terms of Service - Alfa LPU Platform',
    description: 'Terms of Service and Community Guidelines governing the use of the Alfa LPU student portal and services.',
    keywords: 'Alfa LPU terms, terms of service, LPU community rules',
  },
  '/disclaimer': {
    title: 'Disclaimer - Alfa LPU Student Hub',
    description: 'Disclaimer and official notice regarding Alfa LPU as an independent student community initiative.',
    keywords: 'Alfa LPU disclaimer, student initiative notice',
  },
};

const SEOHead: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const baseUrl = getBaseUrl();
    const pathname = location.pathname;
    const config = ROUTE_SEO_MAP[pathname] || {
      title: 'Alfa LPU - Lovely Professional University Student Portal',
      description: 'The official student platform for Lovely Professional University. Access clubs, campus events, student marketplace, study notes, CGPA calculator, and emergency helplines.',
      keywords: 'Lovely Professional University, LPU, Alfa LPU, LPU student portal, LPU campus hub',
    };

    const currentUrl = `${baseUrl}${pathname}`;

    // 1. Title
    document.title = config.title;

    // Helper function to set/create meta element
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to set/create link element
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', config.description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', config.keywords);
    setMetaTag('meta[name="author"]', 'name', 'author', 'Alfa LPU Community');
    setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('meta[name="googlebot"]', 'name', 'googlebot', 'index, follow, max-snippet:-1, max-image-preview:large');
    setMetaTag('meta[name="bingbot"]', 'name', 'bingbot', 'index, follow');

    // 3. OpenGraph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', config.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', config.description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', config.ogType || 'website');
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', config.image || DEFAULT_IMAGE);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Alfa LPU');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');

    // 4. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', config.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', config.description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', config.image || DEFAULT_IMAGE);
    setMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', '@AlfaLPU');

    // 5. Canonical Link
    setLinkTag('canonical', currentUrl);

    // 6. JSON-LD Dynamic Schema
    let schemaScript = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'json-ld-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          "url": baseUrl,
          "name": "Alfa LPU",
          "description": "Lovely Professional University Student Portal, Clubs, Events & Marketplace",
          "publisher": {
            "@id": `${baseUrl}/#organization`
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/deals?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "inLanguage": "en-US"
        },
        {
          "@type": "EducationalOrganization",
          "@id": `${baseUrl}/#organization`,
          "name": "Alfa LPU",
          "alternateName": "Lovely Professional University Student Hub",
          "url": baseUrl,
          "logo": DEFAULT_IMAGE,
          "sameAs": [
            "https://www.lpu.in"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jalandhar - Delhi G.T. Road",
            "addressLocality": "Phagwara",
            "addressRegion": "Punjab",
            "postalCode": "144411",
            "addressCountry": "IN"
          }
        },
        {
          "@type": "WebPage",
          "@id": `${currentUrl}#webpage`,
          "url": currentUrl,
          "name": config.title,
          "description": config.description,
          "isPartOf": {
            "@id": `${baseUrl}/#website`
          },
          "inLanguage": "en-US"
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(schemaData);

  }, [location]);

  return null;
};

export default SEOHead;
