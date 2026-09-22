import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, ShieldCheck, Zap, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, Bell, Heart, 
  Cpu, MessageSquare, User, SmartphoneNfc 
} from 'lucide-react';

export default function MobileDetail() {
  const [activeTab, setActiveTab] = useState('home');
  const [pushTitle, setPushTitle] = useState('Welcome to Knite!');
  const [pushBody, setPushBody] = useState('Our native performance feels incredible.');
  const [activeNotification, setActiveNotification] = useState(null);

  const triggerPush = (e) => {
    e.preventDefault();
    if (!pushTitle || !pushBody) return;
    setActiveNotification({ title: pushTitle, body: pushBody });
    setTimeout(() => {
      setActiveNotification(null);
    }, 5000);
  };

  const features = [
    {
      title: "iOS & Android Fluidity",
      desc: "Architected using advanced Flutter and React Native engines, delivering a true 120Hz native experience.",
      icon: Smartphone
    },
    {
      title: "Secure Biometric Vault",
      desc: "Direct integration with Keychain and Keystore, supporting FaceID, TouchID, and Android Fingerprint API.",
      icon: ShieldCheck
    },
    {
      title: "Offline Sync Engine",
      desc: "Robust local caching keeps the application fully operational without internet connectivity, syncing in the background.",
      icon: Zap
    },
    {
      title: "Push Campaign Management",
      desc: "Engage users dynamically using localized push triggers, segment filters, and rich image alerts.",
      icon: Bell
    },
    {
      title: "Payment Gateway Integrations",
      desc: "Seamless support for Apple Pay, Google Pay, Razorpay, Stripe, and modern digital wallets.",
      icon: SmartphoneNfc
    },
    {
      title: "Sensors & Native APIs",
      desc: "Full access to camera, Bluetooth, GPS tracking, accelerometer, and system notifications.",
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-[#16a3a4]/30 selection:text-[#16a3a4]">
      <Helmet>
        <title>Mobile Applications - KNITE INFOTECH</title>
        <meta name="description" content="Native and cross-platform mobile ecosystems that deliver exceptional user experiences for iOS and Android." />
        <link rel="canonical" href="https://kniteinfotech.in/services/mobile" />
      </Helmet>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px]"></div>
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#16a3a4]/5 blur-[120px]"></div>
      </div>

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-6 pt-10 relative z-10 flex justify-between items-center">
        <Link to="/#mobile-application" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wider uppercase">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KNITE Logo" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-bold tracking-widest text-xs text-slate-400 uppercase">Mobile Ecosystems</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles size={14} /> Fluid Native Experiences
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Exquisite Mobile Apps for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">iOS & Android.</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            We draft, prototype, and engineer custom iOS and Android applications that delight users. Leveraging advanced cross-platform architectures, we guarantee lightning-fast startup speeds and rich micro-interactions.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/#contact" className="bg-[#16a3a4] hover:bg-teal-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-[#16a3a4]/20 flex items-center gap-2">
              Start Mobile Project <ChevronRight size={18} />
            </a>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-[280px] h-[560px] bg-slate-100 border-8 border-slate-200 rounded-[3rem] p-3 shadow-xl overflow-hidden">
            {/* Top speaker & camera bezel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-200 rounded-b-xl z-20"></div>
            
            {/* Screen Content Mockup */}
            <div className="w-full h-full bg-white rounded-[2.5rem] relative flex flex-col justify-between p-4 pt-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                  <span>9:41</span>
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                    <span className="w-3.5 h-3 rounded-md bg-slate-200"></span>
                  </div>
                </div>

                <div className="h-28 bg-gradient-to-tr from-blue-500/10 to-[#16a3a4]/5 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="h-3 w-12 bg-blue-400/40 rounded-md"></div>
                  <div className="h-6 w-3/4 bg-slate-800/10 rounded-md"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-3 gap-3">
                    <div className="w-5 h-5 rounded bg-blue-500/10"></div>
                    <div className="h-2 flex-1 bg-slate-200 rounded-md"></div>
                  </div>
                  <div className="h-10 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-3 gap-3">
                    <div className="w-5 h-5 rounded bg-[#16a3a4]/10"></div>
                    <div className="h-2 flex-1 bg-slate-200 rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="h-8 border-t border-slate-100 flex justify-around items-center text-slate-400 text-xs pt-1">
                <Smartphone size={16} className="text-blue-500" />
                <MessageSquare size={16} />
                <User size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Core Modules</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold mb-6">Cutting-Edge Mobile Architecture</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Every mobile product is custom-architected, optimizing startup CPU threads and rendering workloads for seamless user retention.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <h2 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-3">Our Workflow</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-8">From Concept to Store Submission</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">High-Fidelity UX Design</h4>
                    <p className="text-slate-600">We construct comprehensive screen wireframes and UI components following iOS Human Interface and Material Design standards.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Secure Microservices Setup</h4>
                    <p className="text-slate-600">We integrate cloud databases, setup background worker loops, cache layers, and establish tokenized JWT authentication.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-blue-600 mb-2">Publishing & Updates Integration</h4>
                    <p className="text-slate-600">We submit applications to Apple TestFlight & Google Play Console, configuring automated CodePush triggers for seamless over-the-air hot updates.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full"></div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-6">Need Mobile Engineering?</h4>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you need a full retail mobile ecosystem, a dynamic staff monitoring dashboard, or a healthcare monitoring application, our engineers are ready to build it.
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
