import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, HeartPulse, ShieldAlert, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, Activity, Calendar, 
  Stethoscope, Receipt, ShieldCheck, Pill 
} from 'lucide-react';

export default function HospitalDetail() {
  const [patients, setPatients] = useState([
    { id: 'PT-9941', name: 'Rohan Deshmukh', age: 34, stage: 'OPD Registered', complaint: 'Acute Migraine' },
    { id: 'PT-9942', name: 'Asha Gopalan', age: 48, stage: 'Triage Check', complaint: 'Hypertension History' },
    { id: 'PT-9943', name: 'Dr. Kabir Sen', age: 52, stage: 'Consultation', complaint: 'Routine Post-Op' },
    { id: 'PT-9944', name: 'Sara Jacob', age: 22, stage: 'Pharmacy', complaint: 'Allergy Prescriptions' }
  ]);

  const advancePatientStage = (id) => {
    setPatients(prev => prev.map(pt => {
      if (pt.id === id) {
        let nextStage = 'OPD Registered';
        if (pt.stage === 'OPD Registered') nextStage = 'Triage Check';
        else if (pt.stage === 'Triage Check') nextStage = 'Consultation';
        else if (pt.stage === 'Consultation') nextStage = 'Pharmacy';
        else if (pt.stage === 'Pharmacy') nextStage = 'Bill Settled';
        else if (pt.stage === 'Bill Settled') nextStage = 'Discharged';
        else if (pt.stage === 'Discharged') nextStage = 'OPD Registered';
        
        return { ...pt, stage: nextStage };
      }
      return pt;
    }));
  };

  const features = [
    {
      title: "Electronic Health Records (EHR)",
      desc: "Comprehensive patient health records with granular permission tracking, detailed diagnosis audits, and lab integration.",
      icon: HeartPulse
    },
    {
      title: "Doctor Schedule Manager",
      desc: "Coordinate clinical shifts, manage instant appointment bookings, and set auto-consultation alerts smoothly.",
      icon: Calendar
    },
    {
      title: "HIPAA Secure Architectures",
      desc: "Complete operational compliance with HIPAA guidelines, enforcing industry-standard database encryption at rest.",
      icon: ShieldCheck
    },
    {
      title: "Automated OPD Patient Flow",
      desc: "Coordinate hospital waiting lines, prioritize triage scores, and manage patient flows seamlessly in real-time.",
      icon: Activity
    },
    {
      title: "Smart Pharmacy & Inventory",
      desc: "Track medicine stock, automate alert thresholds for low medicines, and link billing to the main desk.",
      icon: Pill
    },
    {
      title: "Medical Billing & Insurance",
      desc: "Integrated claim billing modules that process corporate insurance forms, generating detailed print-ready invoices.",
      icon: Receipt
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-[#16a3a4]/30 selection:text-[#16a3a4]">
      <Helmet>
        <title>Hospital Management System - KNITE INFOTECH</title>
        <meta name="description" content="Mission-critical healthcare infrastructure ensuring smooth clinical operations and secure patient data handling." />
        <link rel="canonical" href="https://kniteinfotech.in/services/hospital" />
      </Helmet>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[10%] w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px]"></div>
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-[#16a3a4]/5 blur-[120px]"></div>
      </div>

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-6 pt-10 relative z-10 flex justify-between items-center">
        <Link to="/#hospital-management" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wider uppercase">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KNITE Logo" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-bold tracking-widest text-xs text-slate-400 uppercase">Healthcare ERP</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles size={14} /> Mission-Critical Health Tech
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Clinical Precision with our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">Hospital ERP.</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            Streamline patient queues, automate pharmacy inventories, enforce secure HIPAA EHR logs, and optimize medical bill payouts with our unified healthcare administration suite.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/#contact" className="bg-[#16a3a4] hover:bg-teal-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-[#16a3a4]/20 flex items-center gap-2">
              Request Platform Demo <ChevronRight size={18} />
            </a>
          </div>
        </div>

        {/* Dynamic Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/3] rounded-3xl bg-slate-50 border border-slate-200 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full"></div>
            
            {/* Header window control */}
            <div className="flex gap-2 mb-6">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-600">
                    <HeartPulse size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">HIPAA Storage</h5>
                    <p className="text-xs text-slate-500">256-bit AES Crypt</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-green-500/10 text-green-600 rounded-md">Compliant</span>
              </div>

              <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#16a3a4]/10 flex items-center justify-center text-[#16a3a4]">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Doctor Roster</h5>
                    <p className="text-xs text-slate-500">On-Call Shifts</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-md">24 Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-cyan-600 font-bold tracking-wider uppercase text-sm mb-3">Healthcare Modules</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold mb-6">Unified Operational Control</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Every clinical deployment binds complex workflows into a secure, low-latency ecosystem ensuring data integrity and zero record loss.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-cyan-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <h2 className="text-cyan-600 font-bold tracking-wider uppercase text-sm mb-3">Our Workflow</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-8">From System Setup to Clinical Go-Live</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Operational Assessment</h4>
                    <p className="text-slate-600">We inspect hospital departments, analyze pharmacy layouts, and map billing channels to align operational flows perfectly.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">EHR Setup & Security Review</h4>
                    <p className="text-slate-600">We deploy encrypted database storage, set strict HIPAA permission keys, and perform internal data-leak resistance reviews.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-cyan-600 mb-2">Hospital Rollout & Training</h4>
                    <p className="text-slate-600">We host classroom tutorials for doctors and administrative staff, migration of historical charts, and monitor launch performance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl rounded-full"></div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-6">Need Hospital ERP?</h4>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you manage a localized specialty clinic or direct a massive multi-campus healthcare ecosystem, our engineers are ready to build it.
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
