import React from 'react';
import { motion } from 'framer-motion';

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClasses = "bg-slate-200 animate-pulse";
  const variants = {
    rectangular: "rounded-xl",
    circular: "rounded-full",
    text: "rounded-md h-4"
  };
  
  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}></div>
  );
}
