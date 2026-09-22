import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, delay = 0, onClick }) {
  const baseClasses = "bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden";
  const hoverClasses = hover ? "hover:shadow-[0_8px_30px_rgb(22,163,164,0.1)] hover:-translate-y-1 hover:border-[#16a3a4]/20 transition-all duration-300" : "";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
