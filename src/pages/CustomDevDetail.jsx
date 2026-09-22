import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Database, ShieldAlert, ArrowLeft, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, Play, Terminal, 
  Layers, HardDrive, RefreshCw, Cpu 
} from 'lucide-react';

export default function CustomDevDetail() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('GET /api/v1/metrics');
  const [responseOutput, setResponseOutput] = useState({
    status: 200,
    time: "24ms",
    data: {
      uptime_seconds: 864200,
      active_database_connections: 14,
      worker_queue_load: "2.4%",
      api_rate_limit: "998/1000 requests remaining"
    }
  });
  const [isSandboxLoading, setIsSandboxLoading] = useState(false);

  const endpoints = [
    {
      route: 'GET /api/v1/metrics',
      desc: 'Retrieve core cloud system diagnostics.',
      response: {
        status: 200,
        time: "18ms",
        data: {
          system_load: "0.15 (1m)",
          memory_used_mb: 488,
          active_workers: 4,
          redis_cache_hit_ratio: "98.4%"
        }
      }
    },
    {
      route: 'POST /api/v1/jobs/trigger',
      desc: 'Spin up a background worker queue process.',
      response: {
        status: 202,
        time: "48ms",
        data: {
          job_id: "job_b7e9f2a68cd",
          status: "queued",
          priority: "high",
          triggered_by: "api_sandbox",
          estimated_execution_seconds: 3.5
        }
      }
    },
    {
      route: 'GET /api/v1/db/schema',
      desc: 'Verify PostgreSQL database table health.',
      response: {
        status: 200,
        time: "32ms",
        data: {
          tables: ["users", "organizations", "billing_profiles", "audit_logs"],
          rls_enforced_count: 4,
          primary_replica_synced: true,
          pool_status: "optimal"
        }
      }
    }
  ];

  const handleEndpointSelect = (endpoint) => {
    setIsSandboxLoading(true);
    setSelectedEndpoint(endpoint.route);
    
    setTimeout(() => {
      setResponseOutput(endpoint.response);
      setIsSandboxLoading(false);
    }, 450);
  };

  const features = [
    {
      title: "Microservices & Serverless",
      desc: "Architected as decoupled microservices using Node.js, Go, or AWS Lambda, providing near-infinite vertical scaling.",
      icon: Cpu
    },
    {
      title: "Supabase & Postgres Core",
      desc: "Robust relational databases integrated with absolute Row-Level Security (RLS) policies enforcing multi-tenancy.",
      icon: Database
    },
    {
      title: "Redis & Background Workers",
      desc: "Offload long-running scripts and massive datasets into asynchronous BullMQ background queue architectures.",
      icon: Layers
    },
    {
      title: "Custom Third-Party APIs",
      desc: "Complete, reliable integrations with payment rails, automated CRM triggers, and enterprise legacy interfaces.",
      icon: Code2
    },
    {
      title: "High-Availability Clusters",
      desc: "Deployed across containerized Docker clusters, orchestrated by Kubernetes for zero-downtime hot reloading.",
      icon: HardDrive
    },
    {
      title: "Secure JWT & OAuth Rails",
      desc: "Industry-standard JSON Web Token security, complete with refresh-token rotation and multi-factor auth integrations.",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-[#16a3a4]/30 selection:text-[#16a3a4]">
      <Helmet>
        <title>Custom Web Development - KNITE INFOTECH</title>
        <meta name="description" content="Tailored web applications designed precisely for your unique business needs." />
        <link rel="canonical" href="https://kniteinfotech.in/services/custom-dev" />
      </Helmet>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[20%] w-[350px] h-[350px] rounded-full bg-violet-500/5 blur-[100px]"></div>
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#16a3a4]/5 blur-[120px]"></div>
      </div>

      {/* Main Header */}
      <header className="max-w-7xl mx-auto px-6 pt-10 relative z-10 flex justify-between items-center">
        <Link to="/#custom-web-dev" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wider uppercase">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KNITE Logo" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-bold tracking-widest text-xs text-slate-400 uppercase">Bespoke Engineering</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10 grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-600 text-xs font-bold tracking-wider uppercase mb-6">
            <Sparkles size={14} /> Mission-Critical Architecture
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">Custom Web Dev.</span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            We build tailored, heavy-duty applications tailored precisely to your organization's logic, utilizing robust multi-tenant architectures, secure database pipelines, and blazing-fast microservices.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="/#contact" className="bg-[#16a3a4] hover:bg-teal-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-[#16a3a4]/20 flex items-center gap-2">
              Architect Your App <ChevronRight size={18} />
            </a>
          </div>
        </div>

        {/* Dynamic Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/3] rounded-3xl bg-slate-50 border border-slate-200 p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full"></div>
            
            {/* Header window control */}
            <div className="flex gap-2 mb-6">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-green-400"></div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-600">
                    <Database size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Database Sync</h5>
                    <p className="text-xs text-slate-500">Primary Replication</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-green-500/10 text-green-600 rounded-md">Healthy</span>
              </div>

              <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#16a3a4]/10 flex items-center justify-center text-[#16a3a4]">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-800">Job Queues</h5>
                    <p className="text-xs text-slate-500">Redis Background Core</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-500/10 text-blue-600 rounded-md">4 Workers</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mb-16">
          <h2 className="text-violet-600 font-bold tracking-wider uppercase text-sm mb-3">System Blueprint</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold mb-6">Highly Custom Dev Standards</h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Every web application is engineered cleanly, targeting high throughput capacity, rigid data auditing layers, and fluid frontend interactions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-violet-500/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
              <h2 className="text-violet-600 font-bold tracking-wider uppercase text-sm mb-3">Deployment Path</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-8">From Concept to Cluster Launch</h3>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Systems Architecture Outline</h4>
                    <p className="text-slate-600">We outline sequence flows, detail relation schemas, map third-party API payloads, and draft database architectures.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">API Assembly & Integration Testing</h4>
                    <p className="text-slate-600">We write clean endpoints, setup authentication rails, mount background tasks, and run comprehensive endpoint integration tests.</p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-violet-500 text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-violet-600 mb-2">Containerized Orchestration</h4>
                    <p className="text-slate-600">We deploy applications inside Docker containers, configuring autoscaling parameters and robust CI/CD integration layers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 blur-3xl rounded-full"></div>
              
              <h4 className="text-2xl font-bold text-slate-900 mb-6">Need Bespoke Custom Dev?</h4>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Whether you coordinate complex microservice architectures, build real-time monitoring consoles, or require customized data compilers, our software engineers are ready to build it.
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
