import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';
import GlassCard from '../ui/GlassCard';



export default function ExecutiveDashboard({ clients = [] }) {
  // Calculate genuine data from clients
  const activeClients = clients.filter(c => c.status === 'approved').length;
  
  let totalRevenue = 0;
  let ongoingProjects = 0;
  let totalInvoices = 0;

  clients.forEach(client => {
    // Sum revenue from paid invoices
    if (client.invoices) {
      totalInvoices += client.invoices.length;
      client.invoices.forEach(inv => {
        if (inv.status === 'paid' && inv.amount) {
          // Parse amount, assuming it might be a string like "5000" or "5000.00"
          const amt = parseFloat(String(inv.amount).replace(/[^0-9.]/g, ''));
          if (!isNaN(amt)) totalRevenue += amt;
        }
      });
    }
    
    // Count ongoing projects/tasks
    if (client.tasks) {
      ongoingProjects += client.tasks.length;
    }
  });

  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(totalRevenue);

  const stats = [
    { label: 'Total Revenue (YTD)', value: formattedRevenue, icon: <DollarSign size={20} className="text-emerald-500" />, trend: 'Live' },
    { label: 'Active Clients', value: activeClients, icon: <Users size={20} className="text-blue-500" />, trend: 'Live' },
    { label: 'Ongoing Projects', value: ongoingProjects, icon: <Briefcase size={20} className="text-purple-500" />, trend: 'Live' },
    { label: 'Total Invoices', value: totalInvoices, icon: <TrendingUp size={20} className="text-amber-500" />, trend: 'Live' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h3>
        <p className="text-sm text-slate-500 font-medium">Overview of agency performance and revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} delay={idx * 0.1} className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{stat.trend}</span>
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-slate-900">{stat.value}</h4>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
}
