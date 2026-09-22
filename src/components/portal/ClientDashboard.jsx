import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, CreditCard, Video, CheckCircle2, Clock, Inbox } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

export default function ClientDashboard({ client }) {
  const timeOfDay = new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening';
  const name = client?.email?.split('@')[0] || 'Client';

  const stats = [
    { label: 'Active Projects', value: client?.projects?.filter(p => p.status !== 'Completed').length || 0, icon: <Briefcase size={20} className="text-blue-500" />, color: 'bg-blue-500/10' },
    { label: 'Pending Invoices', value: client?.invoices?.filter(i => i.status !== 'paid').length || 0, icon: <Clock size={20} className="text-amber-500" />, color: 'bg-amber-500/10' },
    { label: 'Paid Invoices', value: client?.invoices?.filter(i => i.status === 'paid').length || 0, icon: <CreditCard size={20} className="text-green-500" />, color: 'bg-green-500/10' },
    { label: 'Upcoming Meetings', value: client?.meetings?.length || 0, icon: <Video size={20} className="text-purple-500" />, color: 'bg-purple-500/10' },
    { label: 'Open Tickets', value: client?.tickets?.filter(t => t.status !== 'Closed').length || 0, icon: <Inbox size={20} className="text-rose-500" />, color: 'bg-rose-500/10' },
    { label: 'Completed Tasks', value: client?.tasks?.filter(t => t.status === 'Completed').length || 0, icon: <CheckCircle2 size={20} className="text-teal-500" />, color: 'bg-teal-500/10' }
  ];

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {timeOfDay}, <span className="text-[#16a3a4] capitalize">{name}</span> 👋
        </h2>
        <p className="text-slate-500 mt-2 font-medium">Here's what's happening with your projects today.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} delay={idx * 0.1} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <h3 className="text-4xl font-extrabold text-slate-900">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
