const fs = require('fs');

const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/AdminDashboard.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
const importRegex = /import \{ ArrowLeft, Users, ShieldAlert, CheckCircle2, XCircle, RefreshCw, LogOut, Mail, ShieldCheck, ChevronRight, Trash2 \} from 'lucide-react';/;
content = content.replace(importRegex, "import { ArrowLeft, Users, ShieldAlert, CheckCircle2, XCircle, RefreshCw, LogOut, Mail, ShieldCheck, ChevronRight, Trash2, LayoutDashboard, UserPlus, CheckCircle, ExternalLink } from 'lucide-react';");

// 2. Replace the render block
const returnIndex = content.indexOf('  // Filter clients');
if (returnIndex === -1) {
  console.log("Could not find '// Filter clients'");
  process.exit(1);
}

const beforeReturn = content.substring(0, returnIndex);

const newRender = `  // Filter clients
  const pendingClients = clients.filter(c => c.status === 'pending');
  const processedClients = clients.filter(c => c.status !== 'pending');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="w-12 h-12 bg-[#16a3a4]/10 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="text-[#16a3a4]" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Total Clients</p>
                  <h3 className="text-4xl font-extrabold text-slate-900">{clients.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <UserPlus className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Approvals</p>
                  <h3 className="text-4xl font-extrabold text-slate-900">{pendingClients.length}</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Active Clients</p>
                  <h3 className="text-4xl font-extrabold text-slate-900">{processedClients.length}</h3>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
              Awaiting Approval ({pendingClients.length})
            </h3>
            {pendingClients.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center">
                <ShieldCheck size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">You're all caught up!</p>
                <p className="text-slate-400 text-sm mt-1">No pending client requests.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingClients.map((client) => (
                  <div key={client.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row justify-between gap-6 items-center">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-[#16a3a4] text-lg">{client.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{client.email}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested: {client.createdAt ? new Date(client.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => updateClientStatus(client.id, 'approved')}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => updateClientStatus(client.id, 'rejected')}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => deleteClient(client.id)}
                        className="p-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-slate-400 transition-all disabled:opacity-50"
                        title="Delete Request"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'active':
        return (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              All Registered Clients ({processedClients.length})
            </h3>
            {processedClients.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <p className="text-slate-400 font-medium">No active clients found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {processedClients.map((client) => (
                  <div key={client.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#16a3a4]/30 transition-colors">
                    <div 
                      onClick={() => navigate(\`/admin/client/\${client.id}\`)}
                      className="cursor-pointer group flex items-center gap-4 flex-grow w-full"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span className="font-bold text-slate-600 text-lg group-hover:text-[#16a3a4]">{client.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-[#16a3a4] transition-colors flex items-center gap-2">
                          {client.email} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {client.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-100 px-2.5 py-1 rounded-md border border-green-200">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 uppercase tracking-wider bg-red-100 px-2.5 py-1 rounded-md border border-red-200">
                              <XCircle size={12} /> Rejected
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium">Click to manage workspace</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center w-full md:w-auto">
                      {client.status === 'approved' ? (
                        <button
                          disabled={updatingId === client.id}
                          onClick={() => updateClientStatus(client.id, 'rejected')}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <button
                          disabled={updatingId === client.id}
                          onClick={() => updateClientStatus(client.id, 'approved')}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-green-50 hover:text-green-600 border border-slate-200 hover:border-green-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Re-Approve
                        </button>
                      )}
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => deleteClient(client.id)}
                        className="p-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-slate-400 transition-all disabled:opacity-50"
                        title="Delete Profile"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-[#16a3a4]/20 selection:text-[#16a3a4]">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 z-20 relative shadow-sm">
        <div>
          {/* Logo Area */}
          <div className="p-8 pb-6 border-b border-slate-100 flex items-center justify-center">
            <Link to="/" className="flex flex-col items-center group">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-[#16a3a4] blur-xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
                <img src="/logo.png" alt="KNITE" className="w-14 h-14 relative z-10 drop-shadow-md" />
              </div>
              <span className="font-extrabold tracking-widest text-slate-800 text-sm">KNITE ADMIN</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={\`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all \${
                activeTab === 'overview' ? 'bg-[#16a3a4]/10 text-[#16a3a4]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }\`}
            >
              <LayoutDashboard size={18} className={activeTab === 'overview' ? 'text-[#16a3a4]' : 'text-slate-400'} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={\`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all \${
                activeTab === 'pending' ? 'bg-[#16a3a4]/10 text-[#16a3a4]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }\`}
            >
              <div className="flex items-center gap-3">
                <UserPlus size={18} className={activeTab === 'pending' ? 'text-[#16a3a4]' : 'text-slate-400'} />
                Pending Approvals
              </div>
              {pendingClients.length > 0 && (
                <span className="px-2 py-0.5 bg-yellow-500 text-white rounded-full text-[10px]">{pendingClients.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={\`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all \${
                activeTab === 'active' ? 'bg-[#16a3a4]/10 text-[#16a3a4]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }\`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={activeTab === 'active' ? 'text-[#16a3a4]' : 'text-slate-400'} />
                Active Clients
              </div>
              {processedClients.length > 0 && (
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px]">{processedClients.length}</span>
              )}
            </button>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Link to="/portal" className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-colors">
            <ArrowLeft size={18} />
            Back to Portal
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold transition-colors mt-1"
          >
            <LogOut size={18} />
            Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(22,163,164,0.03),transparent_60%)] pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'pending' && 'Pending Approvals'}
              {activeTab === 'active' && 'Client Workspaces'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your client relationships and portal access.</p>
          </div>
          <button 
            onClick={fetchClients}
            className="p-2.5 bg-white hover:bg-slate-50 text-[#16a3a4] rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow flex items-center gap-2"
            title="Refresh Data"
          >
            <RefreshCw size={16} /> <span className="text-xs font-bold hidden sm:inline">Refresh</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
`;

fs.writeFileSync(filePath, beforeReturn + newRender, 'utf8');

const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Replace root layout in `AdminDashboard.jsx` with full-screen flex layout.', '- `[x]` Replace root layout in `AdminDashboard.jsx` with full-screen flex layout.');
taskContent = taskContent.replace('- `[ ]` Implement persistent Sidebar navigation.', '- `[x]` Implement persistent Sidebar navigation.');
taskContent = taskContent.replace('- `[ ]` Create specific views for Overview, Pending Approvals, and Active Clients.', '- `[x]` Create specific views for Overview, Pending Approvals, and Active Clients.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');

console.log("Admin Dashboard updated successfully.");
