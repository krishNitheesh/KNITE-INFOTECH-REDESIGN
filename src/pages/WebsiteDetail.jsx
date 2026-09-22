import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, ShieldCheck, Zap, ArrowLeft, ArrowRight, Gauge, 
  Sparkles, CheckCircle2, ChevronRight, BarChart3, Search, 
  Cpu, FileCode, Check 
} from 'lucide-react';

export default function WebsiteDetail() {
  const [urlInput, setUrlInput] = useState('https://kniteinfotech.in');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);
  const [scores, setScores] = useState({ perf: 0, seo: 0, access: 0, best: 0 });

  const runAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditComplete(false);
    setAuditProgress(0);
    setScores({ perf: 0, seo: 0, access: 0, best: 0 });
  };

  useEffect(() => {
    if (!isAuditing) return;
    const interval = setInterval(() => {
      setAuditProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAuditing(false);
          setAuditComplete(true);
          // High scores to showcase Knite's optimization standard
          setScores({
            perf: 99,
            seo: 100,
            access: 98,
            best: 100
          });
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isAuditing]);

  const features = [
    {
      title: "Jamstack & Static Generation",
      desc: "Blazing fast pre-rendered HTML served directly from Global Edge CDNs, bypassing slow database queries.",
      icon: Zap
    },
    {
      title: "SEO & Semantic Architecture",
      desc: "Proper header hierarchy, schema.org structured data markup, and automatic sitemap generation built-in.",
      icon: Search
    },
    {
      title: "Headless CMS Integration",
      desc: "Allow your team to publish blogs, press releases, and page copy easily via Sanity, Contentful, or Strapi.",
      icon: FileCode
    },
    {
      title: "Ironclad Security & SSL",
      desc: "Distributed serverless platforms provide near-zero surface area for injections or server failures.",
      icon: ShieldCheck
    },
    {
      title: "Enterprise Core Web Vitals",
      desc: "Guaranteed Green LCP, FID, and CLS scores out of the box to rank higher on Google Search results.",
      icon: Gauge
    },
    {
      title: "Adaptive Responsive Layouts",
      desc: "Pixel-perfect mobile, tablet, and high-DPI desktop viewports with fluid container grids.",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-[#16a3a4]/30 selection:text-[#16a3a4]">
      <Helmet>
        <title>Website Engineering - KNITE INFOTECH</title>
        <meta name="description" content="High-performance, responsive, and SEO-optimized corporate websites and web platforms." />
        <link rel="canonical" href="https://kniteinfotech.in/services/website" />
      </Helmet>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#16a3a4]/5 blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px]"></div>
      </div>

      {/* Main Header / Navigation Info */}
      <header className="max-w-7xl mx-auto px-6 pt-10 relative z-10 flex justify-between items-center">
        <Link to="/#website" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wider uppercase">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KNITE Logo" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-bold tracking-widest text-xs text-slate-400 uppercase">Website Engineering</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16a3a4]/10 border border-[#16a3a4]/30 text-[#16a3a4] text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles size={14} /> Web Platforms of the Future
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Architecting Blazing-Fast <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16a3a4] to-blue-500">Web Platforms.</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            We don't build generic websites. We engineer search-optimized, secure, and incredibly fast digital experiences that captivate visitors, load instantly on mobile devices, and convert visitors into customers.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/#contact" className="bg-[#16a3a4] hover:bg-teal-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-[#16a3a4]/20 flex items-center gap-2">
              Request a Consultation <ChevronRight size={18} />
            </a>
          </div>
        </div>

        {/* Dynamic Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/3] rounded-3xl bg-slate-50 border border-slate-200 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a3a4]/5 blur-3xl rounded-full"></div>
            
            {/* Header window control */}
            <div className="flex gap-2 mb-6">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
            </div>

            <div className="space-y-4">
              <div className="h-6 w-1/3 bg-slate-200 rounded-lg"></div>
              <div className="h-24 w-full bg-white border border-slate-200 rounded-xl flex items-center px-6 gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#16a3a4]/10 flex items-center justify-center text-[#16a3a4]">
                  <Gauge size={24} />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
                  <div className="h-2 w-1/2 bg-slate-200 rounded-md"></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="h-20 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-sm">
                  <div className="h-2 w-2/3 bg-slate-200 rounded-md"></div>
                  <div className="text-xl font-bold text-green-600">99+</div>
                </div>
                <div className="h-20 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-sm">
                  <div className="h-2 w-2/3 bg-slate-200 rounded-md"></div>
                  <div className="text-xl font-bold text-[#16a3a4]">100</div>
                </div>
                <div className="h-20 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between shadow-sm">
                  <div className="h-2 w-2/3 bg-slate-200 rounded-md"></div>
                  <div className="text-xl font-bold text-blue-600">98</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-[#16a3a4] font-bold tracking-wider uppercase text-sm mb-3">Enterprise Standards</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold mb-6">Fully Loaded Engineering Features</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Every website built by Knite is custom-engineered using modern deployment pipelines and top-tier frameworks. No slow templates, no cluttered dependencies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-[#16a3a4]/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#16a3a4]/10 text-[#16a3a4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={22} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Workflow Process */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[#16a3a4] font-bold tracking-wider uppercase text-sm mb-3">Our Workflow</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-8">From Blueprint to Global Edge Deployment</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Wireframing & Dynamic Prototyping</h4>
                    <p className="text-slate-600">We draft pixel-perfect layouts mapped precisely to user journeys and brand identity guidelines.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Clean-Code System Assembly</h4>
                    <p className="text-slate-600">We construct custom components with high performance, React state synchronization, and smooth framer-motion layers.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#16a3a4] text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#16a3a4] mb-2">Deployment & Continuous Delivery</h4>
                    <p className="text-slate-600">Integrated CI/CD automatically runs test specs and builds pages, deploying immediately to scalable global serverless CDNs.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a3a4]/5 blur-3xl rounded-full"></div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-6">Need Website Engineering?</h4>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you need a high-end corporate landing page, a product showcase catalog, or an SEO-optimized publication system, our engineering team is ready to build it.
              </p>
              
              <a href="/#contact" className="w-full bg-[#16a3a4] hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2">
                Consult With Our Developers <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 text-slate-500 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="KNITE" className="w-8 h-8 opacity-80 grayscale" />
            <span className="font-bold tracking-widest text-slate-700 text-xs">KNITE INFOTECH</span>
          </div>
          <div className="text-xs">
            &copy; {new Date().getFullYear()} Knite Infotech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
