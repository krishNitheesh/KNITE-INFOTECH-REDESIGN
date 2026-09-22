import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, FileText, Download, Search, Image as ImageIcon, FileArchive, FileCode } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import EmptyState from '../ui/EmptyState';

export default function DocumentCenter({ documents = [] }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Contracts', 'Invoices', 'Designs', 'Source Code'];

  const getIconForType = (type) => {
    if(type?.includes('image')) return <ImageIcon size={20} className="text-purple-500" />;
    if(type?.includes('pdf')) return <FileText size={20} className="text-red-500" />;
    if(type?.includes('zip')) return <FileArchive size={20} className="text-amber-500" />;
    if(type?.includes('code')) return <FileCode size={20} className="text-slate-500" />;
    return <FileText size={20} className="text-blue-500" />;
  };

  const filteredDocs = documents.filter(doc => 
    (filter === 'All' || doc.category === filter) &&
    doc.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${filter === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#16a3a4] transition-colors"
          />
        </div>
      </div>

      {filteredDocs.length === 0 ? (
        <EmptyState 
          icon={Folder} 
          title="No documents found" 
          description={documents.length === 0 ? "Project files, contracts, and invoices will appear here." : "No documents match your search criteria."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, idx) => (
            <GlassCard key={doc.id || idx} delay={idx * 0.05} className="p-4 flex items-center justify-between group">
              <div className="flex items-center gap-4 truncate">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getIconForType(doc.type)}
                </div>
                <div className="truncate">
                  <h5 className="text-sm font-bold text-slate-800 truncate">{doc.name}</h5>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{doc.size || 'Unknown size'} • {new Date(doc.date).toLocaleDateString()}</p>
                </div>
              </div>
              <a 
                href={doc.url} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#16a3a4] hover:text-white transition-colors shrink-0"
              >
                <Download size={14} />
              </a>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
