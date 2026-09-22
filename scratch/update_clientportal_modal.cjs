const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add InvoiceModal import
if (!content.includes('InvoiceModal')) {
  content = content.replace("import { CreditCard, Video, Calendar, Clock, FileText, ArrowRight, CheckCircle2, AlertCircle, Link as LinkIcon, MessageSquare, Paperclip, Check, X, Shield, Lock, Activity, Send } from 'lucide-react';", "import { CreditCard, Video, Calendar, Clock, FileText, ArrowRight, CheckCircle2, AlertCircle, Link as LinkIcon, MessageSquare, Paperclip, Check, X, Shield, Lock, Activity, Send } from 'lucide-react';\nimport InvoiceModal from '../components/InvoiceModal';");
}

// 2. Add viewingInvoice state
if (!content.includes('viewingInvoice')) {
  content = content.replace("const [dbUser, setDbUser] = useState(null);", "const [dbUser, setDbUser] = useState(null);\n  const [viewingInvoice, setViewingInvoice] = useState(null);");
}

// 3. Add InvoiceModal render at the top of return
const returnStart = "return (\n    <div className=\"min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans selection:bg-[#16a3a4]/20 selection:text-[#16a3a4]\">";
const modalHtml = `return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans selection:bg-[#16a3a4]/20 selection:text-[#16a3a4]">
      {viewingInvoice && (
        <InvoiceModal 
          invoice={viewingInvoice} 
          clientEmail={user.email} 
          onClose={() => setViewingInvoice(null)} 
        />
      )}`;
content = content.replace(returnStart, modalHtml);


// 4. Update the invoice cards to include "View Invoice" button
// In ClientPortal.jsx, the button block looks like:
/*
<button
                                onClick={() => handleRazorpayCheckout(inv)}
                                className="w-full bg-[#16a3a4] hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-teal-600/20"
                              >
                                Pay Now
                              </button>
*/
// Wait, the client might want to view it even if it's paid or unpaid. So we should put "View Invoice" button there.

const oldInvoiceActionsRegex = /<div className="flex flex-col sm:flex-row items-center gap-3 mt-5">[\s\S]*?<\/div>/g;

content = content.replace(/<button\s*onClick=\{\(\) => handleRazorpayCheckout\(inv\)\}\s*className="w-full bg-\[#16a3a4\] hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-teal-600\/20"\s*>\s*Pay Now\s*<\/button>/g, `<div className="flex gap-3 w-full">
                                <button
                                  onClick={() => handleRazorpayCheckout(inv)}
                                  className="flex-1 bg-[#16a3a4] hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-teal-600/20"
                                >
                                  Pay Now
                                </button>
                                <button
                                  onClick={() => setViewingInvoice(inv)}
                                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm"
                                >
                                  View Invoice
                                </button>
                              </div>`);

// If it's already paid, they might just see "No action needed" or something. Let's find what's rendered for Paid.
// In ClientPortal.jsx: `<div className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 text-center text-xs font-bold text-slate-400">Payment Complete</div>`

content = content.replace(/<div className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 text-center text-xs font-bold text-slate-400">\s*Payment Complete\s*<\/div>/g, `<div className="flex gap-3 w-full">
                                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl py-3 text-center text-xs font-bold text-slate-400 flex items-center justify-center">Payment Complete</div>
                                <button
                                  onClick={() => setViewingInvoice(inv)}
                                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-sm"
                                >
                                  View Invoice
                                </button>
                              </div>`);

fs.writeFileSync(filePath, content, 'utf8');
console.log("ClientPortal updated with Invoice Modal");
