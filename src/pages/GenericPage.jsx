import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function GenericPage({ title, description, badge }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] pt-24 pb-20 font-sans">
      <div className="max-w-[980px] mx-auto px-6 text-center pt-20">
        <h2 className="text-[#bf4800] text-[12px] font-semibold tracking-widest uppercase mb-4">{badge}</h2>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          {description}
        </p>
        
        <div className="flex justify-center gap-6">
          <Link to="/contact" className="bg-[#0071e3] text-white px-6 py-3 rounded-full text-[15px] font-semibold hover:bg-[#0077ed] transition-colors">
            Get Started
          </Link>
          <Link to="/" className="text-[#0071e3] hover:underline flex items-center gap-1 text-[15px] font-semibold">
            Learn more <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      {/* Placeholder content section */}
      <div className="max-w-[980px] mx-auto px-6 mt-32">
        <div className="bg-white rounded-3xl p-10 md:p-20 shadow-[0_20px_40px_rgba(0,0,0,0.04)] text-center">
          <h3 className="text-3xl font-bold mb-6">Engineering Excellence</h3>
          <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
            Our {title.toLowerCase()} are designed with absolute precision, utilizing the latest frameworks to deliver unparalleled performance and seamless user experiences.
          </p>
        </div>
      </div>
    </div>
  );
}
