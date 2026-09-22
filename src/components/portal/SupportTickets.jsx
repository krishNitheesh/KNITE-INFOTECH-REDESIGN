import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, LifeBuoy, AlertCircle, CheckCircle2 } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import EmptyState from '../ui/EmptyState';

export default function SupportTickets({ tickets = [] }) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return 'bg-rose-100 text-rose-700';
      case 'working': return 'bg-blue-100 text-blue-700';
      case 'waiting': return 'bg-amber-100 text-amber-700';
      case 'resolved': return 'bg-teal-100 text-teal-700';
      case 'closed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority?.toLowerCase()) {
      case 'high': return <AlertCircle size={14} className="text-rose-500" />;
      case 'medium': return <AlertCircle size={14} className="text-amber-500" />;
      case 'low': return <CheckCircle2 size={14} className="text-slate-400" />;
      default: return null;
    }
  };

  if (tickets.length === 0) {
    return (
      <EmptyState 
        icon={LifeBuoy} 
        title="No support tickets" 
        description="Need help? Open a support ticket and our team will get back to you shortly."
      />
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, idx) => (
        <GlassCard key={ticket.id} delay={idx * 0.05} className="p-5 flex flex-col sm:flex-row gap-4 justify-between group cursor-pointer">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <MessageSquare size={18} className="text-slate-400 group-hover:text-[#16a3a4] transition-colors" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-bold text-slate-900 group-hover:text-[#16a3a4] transition-colors">{ticket.subject}</h5>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                  {ticket.status || 'Open'}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{ticket.lastMessage}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1">
                  {getPriorityIcon(ticket.priority)} {ticket.priority || 'Normal'} Priority
                </span>
                <span>•</span>
                <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col justify-end items-end shrink-0">
             <div className="text-xs font-bold text-slate-400">#{ticket.id?.substring(0,6) || '1023'}</div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
