import React from 'react';
import { motion } from 'framer-motion';
import { MoreHorizontal, Plus, Filter, LayoutGrid } from 'lucide-react';

export default function LeadPipeline() {
  const columns = [
    { id: 'lead', title: 'New Lead', count: 0, color: 'bg-slate-100' },
    { id: 'contacted', title: 'Contacted', count: 0, color: 'bg-blue-50' },
    { id: 'proposal', title: 'Proposal Sent', count: 0, color: 'bg-amber-50' },
    { id: 'won', title: 'Closed Won', count: 0, color: 'bg-green-50' }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead Pipeline</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage incoming leads and sales opportunities.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50"><Filter size={16} /></button>
          <button className="px-4 py-2 bg-[#16a3a4] text-white rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-[#16a3a4]/90"><Plus size={16} /> New Lead</button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar h-[500px]">
        {columns.map((col, idx) => (
          <motion.div 
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`flex-shrink-0 w-80 rounded-2xl p-4 flex flex-col border border-slate-200/60 ${col.color}`}
          >
            <div className="flex justify-between items-center mb-4 px-1">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                {col.title} <span className="text-xs bg-white text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">{col.count}</span>
              </h4>
              <button className="text-slate-400 hover:text-slate-700"><MoreHorizontal size={16} /></button>
            </div>

            <div className="space-y-3 overflow-y-auto hide-scrollbar flex-grow flex flex-col items-center justify-center text-slate-400">
              {col.count === 0 && (
                <div className="text-center p-4">
                  <p className="text-sm font-semibold">No leads yet</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
