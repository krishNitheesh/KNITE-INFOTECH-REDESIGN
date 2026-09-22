import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, GraduationCap, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, FileSpreadsheet, 
  CreditCard, ShieldAlert, BookOpen, Clock, Activity 
} from 'lucide-react';

export default function SchoolDetail() {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([
    { id: 101, name: 'Ananya Sharma', class: 'Grade 10-A', attendance: '96%', gpa: '3.9', fees: 'Paid' },
    { id: 102, name: 'Rahul Krishnan', class: 'Grade 10-B', attendance: '92%', gpa: '3.7', fees: 'Pending' },
    { id: 103, name: 'Siddharth Sen', class: 'Grade 10-A', attendance: '88%', gpa: '3.4', fees: 'Paid' },
    { id: 104, name: 'Meera Nair', class: 'Grade 10-C', attendance: '98%', gpa: '4.0', fees: 'Paid' }
  ]);

  const toggleAttendance = (id) => {
    setStudents(prev => prev.map(stud => {
      if (stud.id === id) {
        const isCurrentlyHigh = parseInt(stud.attendance) > 90;
        return {
          ...stud,
          attendance: isCurrentlyHigh ? '85%' : '97%'
        };
      }
      return stud;
    }));
  };

  const features = [
    {
      title: "Student & Faculty Portals",
      desc: "Distinct, modern web spaces for students to track coursework, and teachers to coordinate dynamic lessons.",
      icon: GraduationCap
    },
    {
      title: "Smart Gradebook Calculations",
      desc: "Automate GPA calculations, report card generation, and student term progression tracking instantly.",
      icon: FileSpreadsheet
    },
    {
      title: "Attendance & RFID Logs",
      desc: "Integrated support for biometrics and RFID scans, sending automated text alerts to parents for absences.",
      icon: Clock
    },
    {
      title: "Fee Collection & Payments",
      desc: "Allow secure online tuition payments, generating instant receipts, tracking balances, and scheduling auto-reminders.",
      icon: CreditCard
    },
    {
      title: "Course Schedules & Timetable",
      desc: "A powerful drag-and-drop course compiler that instantly flags room overlaps and faculty booking errors.",
      icon: Calendar
    },
    {
      title: "Institutional Core Logs",
      desc: "Secure storage of permanent academic transcripts, registration records, and internal institutional documents.",
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-[#16a3a4]/30 selection:text-[#16a3a4]">
      <Helmet>
        <title>School Management Platform - KNITE INFOTECH</title>
        <meta name="description" content="A complete academic ERP solution to streamline administration and enhance the digital learning environment." />
        <link rel="canonical" href="https://kniteinfotech.in/services/school" />
      </Helmet>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#16a3a4]/5 blur-[120px]"></div>
      </div>

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-6 pt-10 relative z-10 flex justify-between items-center">
        <Link to="/#school-management" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wider uppercase">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KNITE Logo" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-bold tracking-widest text-xs text-slate-400 uppercase">Education ERP</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles size={14} /> Modern Institutional Control
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            The Complete ERP for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Schools & Academies.</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            Streamline academic tracking, automate faculty administrative workflows, and bridge communications between parents, teachers, and students using our state-of-the-art secure platform.
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
            
            {/* Header window control */}
            <div className="flex gap-2 mb-6">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Users size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Active Students</h5>
                    <p className="text-xs text-slate-500">Fully Registered</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-emerald-600">1,240</span>
              </div>

              <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#16a3a4]/10 flex items-center justify-center text-[#16a3a4]">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Weekly Attendance</h5>
                    <p className="text-xs text-slate-500">Average Rate</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-[#16a3a4]">94.8%</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Enterprise ERP</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold mb-6">Fully Loaded Academic Modules</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Every implementation integrates multiple core modules into a single, high-availability centralized database environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <h2 className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-3">Deployment Path</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-8">From Concept to Classroom Launch</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Academic Audit & Mapping</h4>
                    <p className="text-slate-600">We analyze the institution's class layout, grade weighting systems, and fee structures to map database schemas perfectly.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Portal Synchronization & Test</h4>
                    <p className="text-slate-600">We set up the individual logins for faculty and registrar officers, testing grading calculators and automated SMS workflows.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-600 mb-2">Classroom Deployment & Support</h4>
                    <p className="text-slate-600">We launch the portal securely with SSL, migrating the school's historical archives, and provide staff training workshops.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full"></div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-6">Need Education ERP?</h4>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you coordinate a localized academy or run a nationwide educational ecosystem, our institutional developers are ready to customize the portal for your team.
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
