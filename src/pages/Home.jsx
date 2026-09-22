import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Smartphone, Megaphone, CheckCircle2, Server,
  GraduationCap, Stethoscope, Briefcase, Bot, Cpu,
  Code, Palette, Terminal, Brain, ArrowRight, CheckCircle,
  Mail, Phone, MapPin, Send, ShieldCheck, Zap, Users,
  Layers, ChevronRight, Star, ExternalLink, Lock, Database,
  Sparkles, Award, PlayCircle, BarChart3, Activity, Check,
  Clock, ShieldAlert, FileText, ArrowUpRight, Box, Quote
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import NavBar from '../components/NavBar';

const firebaseConfig = {
  apiKey: "AIzaSyDXJ2ezJMtsXFqcgEmPQ2XyXnXloprC7Dg",
  authDomain: "knite-web.firebaseapp.com",
  projectId: "knite-web",
  storageBucket: "knite-web.firebasestorage.app",
  messagingSenderId: "383481390906",
  appId: "1:383481390906:web:b0d57f18e982ff7cead203"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedShowcase, setSelectedShowcase] = useState('school');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: 'Web Development',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // The 6 Core Services
  const featuredServices = [
    {
      title: 'Web Development',
      desc: 'High-speed Jamstack architectures, Next.js corporate portals, and responsive web platforms.',
      icon: Globe,
      color: 'text-[#0066cc]',
      link: '/services/website'
    },
    {
      title: 'App Development',
      desc: 'Native iOS & Android mobile ecosystems and cross-platform Flutter/React Native solutions.',
      icon: Smartphone,
      color: 'text-[#6366f1]',
      link: '/services/mobile'
    },
    {
      title: 'Digital Marketing',
      desc: 'Performance growth marketing, conversion-rate optimization, and targeted multi-channel campaigns.',
      icon: Megaphone,
      color: 'text-[#f59e0b]',
      link: '#contact'
    },
    {
      title: 'Software Testing',
      desc: 'End-to-end automated QA pipelines, Cypress/Selenium coverage, and vulnerability security audits.',
      icon: CheckCircle2,
      color: 'text-[#10b981]',
      link: '#contact'
    },
    {
      title: 'Server Development',
      desc: 'Cloud-native microservices, Docker/Kubernetes container orchestration, and PostgreSQL backends.',
      icon: Server,
      color: 'text-[#0ea5e9]',
      link: '/services/custom-dev'
    },
    {
      title: 'Server Maintenance',
      desc: '24/7 infrastructure monitoring, auto-scaling, backup recovery, and 99.99% uptime maintenance.',
      icon: Cpu,
      color: 'text-[#14b8a6]',
      link: '#contact'
    }
  ];

  const showcases = {
    school: {
      title: 'School Management ERP Suite',
      subtitle: 'Institutional Operating System',
      desc: 'A unified digital administrative backbone connecting administrators, educators, students, and parents with automated grading, instant UPI fee clearance, and intelligent attendance analytics.',
      features: [
        'Automated GPA & Gradebook Generation',
        'Direct UPI & NetBanking Integrated Fee Portal',
        'Real-time Student & Parent Mobile Portals',
        'Faculty Timetable & Leave Workflows'
      ],
      link: '/services/school',
      image: '/images/school_clean.png',
      badge: 'Academic ERP'
    },
    hospital: {
      title: 'Hospital Management & Clinical ERP',
      subtitle: 'Healthcare Clinical Infrastructure',
      desc: 'A mission-critical medical infrastructure designed to streamline outpatient flow, pharmacy dispensing, inpatient bed tracking, and encrypted electronic health records.',
      features: [
        'HIPAA-Compliant Electronic Health Records',
        'Smart OPD Token & Queue Scheduling',
        'Automated Pharmacy & Lab Billing Engine',
        'Multi-Department Doctor Rosters'
      ],
      link: '/services/hospital',
      image: '/images/hospital_clean.png',
      badge: 'Healthcare ERP'
    },
    website: {
      title: 'High-Performance Web Engineering',
      subtitle: 'Corporate Platforms & Portals',
      desc: 'We architect enterprise web platforms designed for speed, SEO authority, and global conversion. Built on Jamstack and modern React frameworks.',
      features: [
        'Edge CDN Pre-Rendered Architecture',
        '100/100 Google Lighthouse Standards',
        'Dynamic Headless CMS Integration',
        'Built-in Schema.org Structured Data'
      ],
      link: '/services/website',
      image: '/images/website_clean.png',
      badge: 'Web Architecture'
    },
    mobile: {
      title: 'Native & Cross-Platform Mobile Apps',
      subtitle: 'iOS & Android Application Suite',
      desc: 'Exceptional mobile experiences engineered with native performance, offline database sync, and real-time push notifications across all mobile devices.',
      features: [
        'Smooth 120Hz Native Animations',
        'Offline Caching & Local Database Sync',
        'Instant Push Notifications & Deep Linking',
        'Secure Biometric Authentication'
      ],
      link: '/services/mobile',
      image: '/images/mobile_clean.png',
      badge: 'Mobile Platform'
    },
    custom: {
      title: 'Custom Cloud & Server Engineering',
      subtitle: 'Bespoke Enterprise Systems',
      desc: 'Bespoke software systems, microservices, and databases tailored to solve your unique operational bottlenecks with zero third-party platform limitations.',
      features: [
        'Scalable REST & GraphQL Microservices',
        'PostgreSQL & Supabase Multi-Tenancy',
        'Docker & Kubernetes Container Deployments',
        'Enterprise RBAC & Security Audit Logs'
      ],
      link: '/services/custom-dev',
      image: '/images/custom_clean.png',
      badge: 'Cloud Engineering'
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        type: 'consultation_inquiry',
        timestamp: serverTimestamp()
      });

      const response = await fetch("https://formsubmit.co/ajax/kniteinfotech@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || "Not specified",
          category: formData.category,
          message: formData.message,
          _subject: `New Enterprise Consultation Request from ${formData.name} (${formData.company || "Independent"})`,
          _captcha: "false"
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', category: 'Web Development', message: '' });
      } else {
        alert("Form recorded to Database, but email routing had a temporary issue.");
      }
    } catch (e) {
      console.error("Error submitting form: ", e);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-[#111827] min-h-screen font-sans antialiased selection:bg-[#e42528]/15 selection:text-[#e42528] overflow-x-hidden">
      <Helmet>
        <title>KNITE INFOTECH | Enterprise Digital Engineering & Technology Solutions</title>
        <meta name="description" content="Your life's work, powered by our life's work. High-performance web development, mobile apps, digital marketing, software testing, server engineering, and AI systems." />
        <link rel="canonical" href="https://kniteinfotech.in/" />
      </Helmet>

      {/* Global Navigation Bar */}
      <NavBar />

      {/* 1. HERO: CLEAN ZOHO HERO WITH FLOATING BENTO CARD */}
      <section id="home" className="relative pt-32 sm:pt-36 pb-16 md:pb-24 bg-white overflow-hidden">
        
        {/* Subtle wavy concentric lines */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none">
            <path d="M-100 200 C300 120, 700 350, 1540 160" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M-100 350 C400 220, 900 480, 1540 280" stroke="#cbd5e1" strokeWidth="1" />
            <path d="M-100 500 C500 320, 800 620, 1540 400" stroke="#cbd5e1" strokeWidth="1" />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight text-[#111827] leading-[1.15] mb-4">
            Your life's work,<br className="hidden sm:inline" />
            powered by our{' '}
            <span className="relative inline-block text-[#111827]">
              life's work
              {/* Red Curve Underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#e42528]" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8.5C50 2.5 150 2.5 198 8.5" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subtext */}
          <div className="max-w-2xl mx-auto mt-6 mb-8 text-[#4b5563] text-base sm:text-lg leading-relaxed">
            <p>
              A unique and powerful software suite to transform the way you work.
            </p>
            <p className="mt-1">
              Designed for businesses of all sizes, built by a company that{' '}
              <span className="border-b border-dotted border-slate-500 font-medium text-slate-800">values your privacy & precision</span>.
            </p>
          </div>

          {/* Red Action Button */}
          <div className="mb-14 sm:mb-16">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-[#e42528] hover:bg-[#c91d20] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-[4px] shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>GET STARTED FOR FREE</span>
              <ChevronRight size={17} className="stroke-[2.5]" />
            </a>
          </div>

          {/* Zoho Hero Bento Card */}
          <div id="hero-bento" className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden text-left">
            <div className="grid lg:grid-cols-12">
              
              {/* Left Card: AI Systems & Automations */}
              <div className="lg:col-span-4 bg-gradient-to-b from-[#2e155c] via-[#240e49] to-[#1a0836] p-7 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-900/50 flex items-center justify-center">
                      <div className="w-full h-full bg-[#1e0a3c] rounded-[14px] flex items-center justify-center">
                        <Sparkles size={24} className="text-violet-300 animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs font-semibold text-purple-200/80 mb-1">
                      Introducing
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-3">
                      KNITE AI Systems
                    </h3>
                    <p className="text-purple-200/90 text-xs sm:text-sm leading-relaxed mb-6">
                      Build autonomous agents that can qualify leads, resolve tickets, draft proposals, and automate operations.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 text-center pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 border border-purple-400/40 bg-purple-950/60 hover:bg-purple-900/80 text-purple-100 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors"
                  >
                    <span>EXPLORE AI SYSTEMS</span>
                    <ChevronRight size={14} />
                  </a>
                </div>
              </div>

              {/* Right Box: Featured Services Grid (3x2) */}
              <div className="lg:col-span-8 p-6 sm:p-8 bg-white flex flex-col justify-between">
                
                {/* Header row */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    FEATURED SERVICES
                  </span>
                  <a
                    href="#flagships"
                    className="text-xs font-bold text-[#0066cc] hover:text-[#004c99] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>EXPLORE ALL SERVICES</span>
                    <ChevronRight size={14} />
                  </a>
                </div>

                {/* 6 Grid Items */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {featuredServices.map((service, index) => {
                    const Icon = service.icon;
                    const isAnchor = service.link.startsWith('#');
                    return (
                      <div key={index} className="group">
                        {isAnchor ? (
                          <a href={service.link} className="block">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <Icon size={20} className={`${service.color} flex-shrink-0`} />
                              <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#e42528] transition-colors leading-tight">
                                {service.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {service.desc}
                            </p>
                          </a>
                        ) : (
                          <Link to={service.link} className="block">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <Icon size={20} className={`${service.color} flex-shrink-0`} />
                              <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#e42528] transition-colors leading-tight">
                                {service.title}
                              </h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {service.desc}
                            </p>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer note */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium text-slate-600">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Dedicated sprint teams & full source code ownership
                  </span>
                  <span className="text-slate-400">
                    Built for Startups & Enterprises
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. ZOHO ONE YELLOW BANNER: KNITE ONE */}
      <section className="bg-[#FED600] text-slate-950 py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: All-in-One Suite */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                  <Box size={22} className="text-[#FED600]" />
                </div>
                <span className="text-xs font-black tracking-widest uppercase text-slate-900">
                  ALL-IN-ONE SUITE
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-[54px] font-black tracking-tight text-slate-950 leading-none mb-4">
                KNITE ONE
              </h2>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 leading-snug">
                The operating system for business
              </h3>

              <p className="text-slate-900 text-sm sm:text-base leading-relaxed mb-8 max-w-xl">
                Run your entire business on Knite—our unified platform for all your operational needs. Get access to dedicated full-stack engineering teams, custom software development, cloud infrastructure, and 24/7 technical support.
              </p>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-[#e42528] hover:bg-[#c91d20] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-[4px] shadow-sm transition-all transform hover:-translate-y-0.5"
              >
                <span>TRY KNITE ONE</span>
                <ChevronRight size={16} className="stroke-[2.5]" />
              </a>
            </div>

            {/* Right Column: Founder Quote */}
            <div className="lg:col-span-5">
              <div className="relative pl-4 lg:pl-8">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                  <Quote size={20} className="fill-white" />
                </div>

                <blockquote className="text-lg sm:text-xl font-medium text-slate-950 leading-relaxed mb-6 font-serif italic">
                  "You can be a startup, mid-sized company, or an enterprise—KNITE Infotech is a boon for all."
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-950 shadow-md flex-shrink-0 bg-white">
                    <img
                      src="/images/founder.png"
                      alt="Krish N Kumaresh"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-base font-bold text-slate-950">
                      Krish N Kumaresh
                    </div>
                    <div className="text-xs text-slate-800 font-medium">
                      Founder & CEO, KNITE INFOTECH
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. BRANDS THAT TRUST US */}
      <section id="clients" className="py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-10">
            <h2 className="text-xs font-black tracking-widest uppercase text-slate-500 mb-2">
              BRANDS THAT TRUST US
            </h2>
            <div className="w-8 h-1 bg-[#e42528] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center max-w-4xl mx-auto mb-10">
            
            {/* Comorin International School */}
            <div className="flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all group">
              <img
                src="/images/comorin_logo.png"
                alt="Comorin International School"
                className="h-12 w-auto object-contain max-w-[160px]"
              />
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-950">Comorin International</span>
            </div>

            {/* GK Farms */}
            <div className="flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all group">
              <img
                src="/images/gk_farms_logo.png"
                alt="GK Farms"
                className="h-12 w-auto object-contain max-w-[160px]"
              />
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-950">GK Farms</span>
            </div>

            {/* Vency Food Cave */}
            <div className="flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all group">
              <img
                src="/images/vency_food_cave_logo.jpeg"
                alt="Vency Food Cave"
                className="h-12 w-auto object-contain max-w-[160px] rounded"
              />
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-950">Vency Food Cave</span>
            </div>

            {/* TechVenture */}
            <div className="flex flex-col items-center justify-center gap-2 grayscale hover:grayscale-0 transition-all group">
              <div className="h-12 flex items-center justify-center font-black text-slate-800 text-lg tracking-tight">
                TECH<span className="text-[#0066cc]">VENTURE</span>
              </div>
              <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-950">Global Tech Partner</span>
            </div>

          </div>

          <a
            href="#case-studies"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066cc] hover:text-[#004c99] uppercase tracking-wider"
          >
            <span>CUSTOMER STORIES</span>
            <ChevronRight size={14} />
          </a>

        </div>
      </section>

      {/* 4. THE CORE VALUES AND PRINCIPLES THAT DRIVE US */}
      <section id="values" className="py-20 md:py-24 bg-[#fafbfc] border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mb-4">
              The core values and principles that drive us
            </h2>
            <p className="text-slate-600 text-base">
              Sustainable technology practices, engineering integrity, and long-term customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            
            {/* Long-term commitment */}
            <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                Long-term commitment
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Running a sustainable, profitable organization gives us a good sense of challenges that a growing business faces. We take pride in running a sustainable business that's powered by you, our customer.
              </p>
            </div>

            {/* Customer-first philosophy */}
            <div className="bg-white p-8 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="text-xl font-bold text-[#111827] mb-3">
                Customer-first philosophy
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                In all these years, it's our customers' trust and goodwill that has helped us establish a strong position in the market. No matter the size of your business, we're here to help you scale and succeed.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE PLATFORM SHOWCASES */}
      <section id="flagships" className="py-20 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight mb-4">
              Explore Our Production Platforms
            </h2>
            <p className="text-slate-600 text-base">
              Click through our specialized suites to inspect live modules and operational capabilities.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {Object.keys(showcases).map((key) => {
                const item = showcases[key];
                const isActive = selectedShowcase === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedShowcase(key)}
                    className={`px-4 py-2 rounded text-xs sm:text-sm font-semibold transition-all ${
                      isActive ? 'bg-slate-950 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.badge}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0066cc] mb-2 block">
                  {showcases[selectedShowcase].subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-4 tracking-tight">
                  {showcases[selectedShowcase].title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
                  {showcases[selectedShowcase].desc}
                </p>

                <div className="space-y-2.5 mb-8">
                  {showcases[selectedShowcase].features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                        <Check size={13} />
                      </div>
                      <span className="text-slate-800 text-sm font-medium">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={showcases[selectedShowcase].link}
                    className="px-6 py-3 bg-slate-950 hover:bg-slate-800 text-white font-bold rounded transition-all flex items-center gap-2 text-xs sm:text-sm shadow-xs"
                  >
                    Launch Interactive Demo <ArrowRight size={15} />
                  </Link>
                  <a
                    href="#contact"
                    className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded border border-slate-300 transition-all text-xs sm:text-sm"
                  >
                    Request Technical Scope
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <Link to={showcases[selectedShowcase].link} className="block group">
                  <div className="aspect-[4/3] rounded-xl bg-white border border-slate-200 overflow-hidden shadow-lg group-hover:border-[#0066cc]/50 transition-all">
                    <img
                      src={showcases[selectedShowcase].image}
                      alt={showcases[selectedShowcase].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6. CONSULTATION INQUIRY */}
      <section id="contact" className="py-20 md:py-24 bg-[#fafbfc] border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#e42528] mb-2 block">
                Connect With Our Team
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] mb-6 tracking-tight">
                Request an Engineering Consultation.
              </h2>
              <p className="text-slate-600 text-base mb-8 leading-relaxed">
                Connect with our senior engineering team. Whether commissioning an institutional ERP, bespoke web platform, mobile app, or cloud server maintenance, we deliver with precision.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg text-[#0066cc] border border-slate-200">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Direct Office</div>
                    <a href="mailto:kniteinfotech@gmail.com" className="text-base font-bold text-slate-950 hover:text-[#0066cc] transition-colors">
                      kniteinfotech@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="p-2.5 bg-slate-50 rounded-lg text-[#0066cc] border border-slate-200">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Engineering Headquarters</div>
                    <p className="text-base font-bold text-slate-950">
                      Nagercoil, Kanyakumari, Tamil Nadu, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-lg">
                <h3 className="text-2xl font-black text-slate-950 mb-2">Technical RFP & Inquiry</h3>
                <p className="text-slate-500 text-sm mb-8">
                  Submit your parameters. An engineering director will evaluate your request within 24 business hours.
                </p>

                {isSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                    <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
                      <CheckCircle size={28} />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-950 mb-2">Inquiry Transmitted Successfully</h4>
                    <p className="text-emerald-800 text-sm max-w-md mx-auto">
                      Thank you for contacting KNITE INFOTECH. Our technical leadership will reach out promptly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Your Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0066cc] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@organization.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0066cc] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0066cc] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Organization</label>
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0066cc] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Service Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0066cc] transition-colors"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">App Development</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="Software Testing">Software Testing (QA)</option>
                        <option value="Server Development">Server Development</option>
                        <option value="Server Maintenance">Server Maintenance</option>
                        <option value="AI Systems">AI Systems & Automations</option>
                        <option value="School ERP">School ERP Platform</option>
                        <option value="Hospital ERP">Hospital ERP Platform</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Project Details *</label>
                      <textarea
                        required
                        rows="4"
                        placeholder="Detail your requirements, current technical bottlenecks, timeline, and goals..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#0066cc] transition-colors resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#e42528] hover:bg-[#c91d20] text-white font-bold py-3.5 rounded transition-all shadow-sm flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-60"
                    >
                      {isSubmitting ? 'Transmitting Request...' : (
                        <>Submit Consultation Request <Send size={15} /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CORPORATE FOOTER */}
      <footer className="bg-[#111827] text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="KNITE" className="w-8 h-8 object-contain" />
                <span className="text-xl font-black text-white tracking-tight">
                  KNITE <span className="text-slate-300">INFOTECH</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                A unique and powerful software suite to transform the way you work.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800 max-w-fit">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>100% Data Sovereignty & Code Ownership</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services/website" className="hover:text-white transition-colors">Web Development</Link></li>
                <li><Link to="/services/mobile" className="hover:text-white transition-colors">App Development</Link></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Digital Marketing</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Software Testing</a></li>
                <li><Link to="/services/custom-dev" className="hover:text-white transition-colors">Server Development</Link></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Server Maintenance</a></li>
                <li><a href="#hero-bento" className="hover:text-white transition-colors">AI Systems</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services/school" className="hover:text-white transition-colors">School Software</Link></li>
                <li><Link to="/services/hospital" className="hover:text-white transition-colors">Hospital Software</Link></li>
                <li><a href="#flagships" className="hover:text-white transition-colors">Business Software</a></li>
                <li><a href="#hero-bento" className="hover:text-white transition-colors">AI & Automations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Portal & Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/portal" className="text-teal-400 hover:text-teal-300 font-bold">Client Portal Workspace</Link></li>
                <li><a href="#case-studies" className="hover:text-white transition-colors">Customer Stories</a></li>
                <li><a href="#values" className="hover:text-white transition-colors">Core Values</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} KNITE INFOTECH. All rights reserved. Nagercoil, Kanyakumari, Tamil Nadu, India.
            </div>
            <div className="flex items-center gap-6">
              <a href="#home" className="hover:text-slate-400 transition-colors">Back to top</a>
              <Link to="/portal" className="hover:text-slate-400 transition-colors">Client Portal</Link>
              <a href="#contact" className="hover:text-slate-400 transition-colors">Contact Us</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
