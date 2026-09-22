import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, FileText, Video, CreditCard, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandPalette({ isOpen, setIsOpen, isAdmin }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  const clientActions = [
    { id: 'dash', label: 'Go to Dashboard', icon: <LayoutDashboard size={16} />, route: '/portal' },
    { id: 'inv', label: 'View Invoices', icon: <CreditCard size={16} />, route: '/portal?tab=invoices' },
    { id: 'meet', label: 'Join Knite Meet', icon: <Video size={16} />, route: '/portal?tab=meetings' },
    { id: 'docs', label: 'View Documents', icon: <FileText size={16} />, route: '/portal?tab=resources' }
  ];

  const adminActions = [
    { id: 'admin-dash', label: 'Admin Dashboard', icon: <LayoutDashboard size={16} />, route: '/admin' },
    { id: 'admin-clients', label: 'Manage Clients', icon: <User size={16} />, route: '/admin?tab=active' },
  ];

  const actions = isAdmin ? adminActions : clientActions;
  const filteredActions = actions.filter(action => action.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (route) => {
    setIsOpen(false);
    navigate(route);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-50 border border-slate-200"
          >
            <div className="flex items-center px-4 py-3 border-b border-slate-100">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                type="text"
                autoFocus
                placeholder="Search commands or jump to..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-slate-800 focus:outline-none text-base placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md ml-3">
                <Command size={12} /> K
              </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredActions.length > 0 ? (
                filteredActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action.route)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-700 hover:text-[#16a3a4] rounded-xl transition-colors text-sm font-semibold group"
                  >
                    <span className="text-slate-400 group-hover:text-[#16a3a4] transition-colors">{action.icon}</span>
                    {action.label}
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-slate-500">
                  No commands found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
