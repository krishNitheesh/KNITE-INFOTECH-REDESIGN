import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CreditCard, Video, FileText, CheckCircle2 } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function ActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <EmptyState 
        icon={Activity} 
        title="No recent activity" 
        description="Your project history and updates will appear here."
      />
    );
  }

  const getIcon = (type) => {
    switch(type) {
      case 'invoice': return <CreditCard size={14} className="text-amber-600" />;
      case 'meeting': return <Video size={14} className="text-blue-600" />;
      case 'document': return <FileText size={14} className="text-purple-600" />;
      case 'task': return <CheckCircle2 size={14} className="text-green-600" />;
      default: return <Activity size={14} className="text-slate-600" />;
    }
  };

  const getBgColor = (type) => {
    switch(type) {
      case 'invoice': return 'bg-amber-100 border-amber-200';
      case 'meeting': return 'bg-blue-100 border-blue-200';
      case 'document': return 'bg-purple-100 border-purple-200';
      case 'task': return 'bg-green-100 border-green-200';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-[27px] before:w-[2px] before:bg-slate-100">
      {activities.map((activity, idx) => (
        <motion.div 
          key={activity.id || idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative flex gap-4"
        >
          <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shrink-0 z-10 shadow-sm ${getBgColor(activity.type)}`}>
            {getIcon(activity.type)}
          </div>
          <div className="flex-grow bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-[#16a3a4]/20 transition-all">
            <div className="flex justify-between items-start mb-1">
              <h5 className="text-sm font-bold text-slate-800">{activity.title}</h5>
              <span className="text-[10px] font-semibold text-slate-400">{activity.time}</span>
            </div>
            <p className="text-xs text-slate-500">{activity.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
