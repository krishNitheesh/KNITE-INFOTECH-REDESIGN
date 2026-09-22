const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/AdminClientWorkspace.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update toggleInvoiceStatus
const oldToggle = `  const toggleInvoiceStatus = async (invId) => {
    const updatedInvoices = (client.invoices || []).map(inv => {
      if (inv.id === invId) {
        return { ...inv, status: inv.status === 'paid' ? 'unpaid' : 'paid' };
      }
      return inv;
    });
    await saveClientFields({ invoices: updatedInvoices });
  };`;

const newToggle = `  const toggleInvoiceStatus = async (invId) => {
    const updatedInvoices = (client.invoices || []).map(inv => {
      if (inv.id === invId) {
        const isCurrentlyPaid = inv.status === 'paid';
        return { 
          ...inv, 
          status: isCurrentlyPaid ? 'unpaid' : 'paid',
          paidAt: isCurrentlyPaid ? null : new Date().toISOString(),
          paymentId: isCurrentlyPaid ? null : (inv.paymentId || 'manual_override')
        };
      }
      return inv;
    });
    await saveClientFields({ invoices: updatedInvoices });
  };`;

content = content.replace(oldToggle, newToggle);


// 2. Redesign the activeTab === 'invoices' rendering block
const oldTabStart = `            {/* INVOICES TAB */}
            {activeTab === 'invoices' && (`;

// We will replace everything from `oldTabStart` to the `            {/* SHARED LINKS TAB */}`
const endIndex = content.indexOf(`            {/* SHARED LINKS TAB */}`);

if(content.indexOf(oldTabStart) === -1 || endIndex === -1) {
  console.error("Could not find invoice render boundaries");
  process.exit(1);
}

const beforeInvoices = content.substring(0, content.indexOf(oldTabStart));
const afterInvoices = content.substring(endIndex);

const newInvoiceRender = `            {/* INVOICES TAB */}
            {activeTab === 'invoices' && (
              <div className="space-y-8 flex flex-col flex-grow">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financials & Invoicing</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Manage billing, issue new invoices, and track payment history</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign size={18} className="text-teal-600" /> Invoice History
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        {client.invoices?.length || 0} Total
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {(!client.invoices || client.invoices.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/80">
                          <CreditCard size={40} className="text-slate-300 mb-4" />
                          <p className="text-slate-500 text-sm font-bold">No invoices issued yet</p>
                          <p className="text-slate-400 text-xs mt-1 text-center px-6">Create your first invoice to the right to start billing this client.</p>
                        </div>
                      ) : (
                        client.invoices.map(inv => (
                          <div key={inv.id} className="p-5 bg-white border border-slate-200 hover:border-teal-600/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-1.5">
                                <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">{inv.title}</h5>
                                <span className={\`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest \${
                                  inv.status === 'paid' 
                                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50' 
                                    : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200/50'
                                  }\`}>
                                  {inv.status}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1.5 mt-3">
                                <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                                  <span className="w-5 flex justify-center opacity-60">💰</span>
                                  <span className="font-bold text-slate-900">{inv.amount}</span> 
                                  <span className="text-slate-300 mx-1">|</span> 
                                  <span>Due: {inv.dueDate}</span>
                                </p>
                                
                                {inv.status === 'paid' && inv.paidAt && (
                                  <p className="text-[11px] text-green-600 font-medium flex items-center gap-2">
                                    <span className="w-5 flex justify-center opacity-60">✅</span>
                                    Paid on {new Date(inv.paidAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>
                                )}
                                
                                {inv.status === 'paid' && inv.paymentId && (
                                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2 font-mono">
                                    <span className="w-5 flex justify-center">#</span>
                                    {inv.paymentId}
                                  </p>
                                )}

                                {inv.payUrl && inv.status !== 'paid' && (
                                  <a href={inv.payUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#16a3a4] hover:text-teal-700 font-bold flex items-center gap-1.5 w-fit mt-1">
                                    <Link2 size={12} /> View External Payment Link
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex sm:flex-col gap-2 items-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 mt-2 sm:mt-0">
                              <button
                                onClick={() => toggleInvoiceStatus(inv.id)}
                                className={\`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all w-full sm:w-auto text-center \${
                                  inv.status === 'paid' 
                                  ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' 
                                  : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                                }\`}
                              >
                                Mark {inv.status === 'paid' ? 'Unpaid' : 'Paid'}
                              </button>
                              <button 
                                onClick={() => deleteInvoice(inv.id)} 
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                title="Delete Invoice"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl sticky top-0 shadow-sm shadow-slate-200/50">
                      <div className="mb-6">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 border border-teal-100">
                          <Plus size={24} className="text-teal-600" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Issue New Invoice</h4>
                        <p className="text-xs text-slate-500 mt-1">Bill this client for project phases, setup fees, or retainers.</p>
                      </div>

                      <form onSubmit={addInvoice} className="space-y-5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Item / Description</label>
                          <input
                            type="text"
                            required
                            value={newInvTitle}
                            onChange={(e) => setNewInvTitle(e.target.value)}
                            placeholder="e.g. Design System Phase 1"
                            className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
                            <input
                              type="text"
                              required
                              value={newInvAmount}
                              onChange={(e) => setNewInvAmount(e.target.value)}
                              placeholder="e.g. ₹5000"
                              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                            <input
                              type="text"
                              value={newInvDueDate}
                              onChange={(e) => setNewInvDueDate(e.target.value)}
                              placeholder="e.g. July 5, 2026"
                              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          className="w-full bg-[#16a3a4] hover:bg-teal-700 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 mt-2"
                        >
                          <Plus size={16} /> Issue Invoice
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
`;

fs.writeFileSync(filePath, beforeInvoices + newInvoiceRender + afterInvoices, 'utf8');

// Also update task
const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Update `handleRazorpayCheckout` in `ClientPortal.jsx` to append `paidAt` timestamp.', '- `[x]` Update `handleRazorpayCheckout` in `ClientPortal.jsx` to append `paidAt` timestamp.');
taskContent = taskContent.replace('- `[ ]` Update `toggleInvoiceStatus` in `AdminClientWorkspace.jsx` to manage `paidAt` and `paymentId` logic for manual overrides.', '- `[x]` Update `toggleInvoiceStatus` in `AdminClientWorkspace.jsx` to manage `paidAt` and `paymentId` logic for manual overrides.');
taskContent = taskContent.replace('- `[ ]` Redesign the Invoices rendering block in `AdminClientWorkspace.jsx` for a premium look with payment timestamps.', '- `[x]` Redesign the Invoices rendering block in `AdminClientWorkspace.jsx` for a premium look with payment timestamps.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');

console.log("Admin Invoices redesigned");
