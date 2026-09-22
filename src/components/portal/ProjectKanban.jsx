import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Clock, CheckCircle2, PlayCircle, MoreHorizontal } from 'lucide-react';
import EmptyState from '../ui/EmptyState';

export default function ProjectKanban({ tasks = [] }) {
  const columns = [
    { id: 'todo', label: 'To Do', icon: <Clock size={16} />, color: 'text-slate-500' },
    { id: 'in_progress', label: 'In Progress', icon: <PlayCircle size={16} />, color: 'text-blue-500' },
    { id: 'review', label: 'Review', icon: <MoreHorizontal size={16} />, color: 'text-amber-500' },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 size={16} />, color: 'text-green-500' }
  ];

  if (tasks.length === 0) {
    return (
      <EmptyState 
        icon={Layout} 
        title="No tasks yet" 
        description="Your project tasks will appear here in a Kanban board once development begins."
      />
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x">
      {columns.map((col, idx) => {
        const colTasks = tasks.filter(t => t.status === col.id);
        return (
          <motion.div 
            key={col.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex-shrink-0 w-80 bg-slate-50/50 rounded-3xl p-4 border border-slate-200 snap-center"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h4 className={`text-sm font-bold flex items-center gap-2 ${col.color}`}>
                {col.icon} {col.label}
              </h4>
              <span className="text-xs font-bold bg-white text-slate-500 px-2.5 py-1 rounded-full shadow-sm border border-slate-100">
                {colTasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {colTasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow hover:border-[#16a3a4]/30 cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                      {task.priority || 'Normal'}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-800 mb-1 leading-tight">{task.title}</h5>
                  <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
