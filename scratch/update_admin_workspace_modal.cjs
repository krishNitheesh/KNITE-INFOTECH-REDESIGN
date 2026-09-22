const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/AdminClientWorkspace.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add InvoiceModal import
if (!content.includes('InvoiceModal')) {
  content = content.replace("import { getAuth, onAuthStateChanged } from \"firebase/auth\";", "import { getAuth, onAuthStateChanged } from \"firebase/auth\";\nimport InvoiceModal from '../components/InvoiceModal';");
}

// 2. Add viewingInvoice state
if (!content.includes('viewingInvoice')) {
  content = content.replace("const [activeTab, setActiveTab] = useState('overview');", "const [activeTab, setActiveTab] = useState('overview');\n  const [viewingInvoice, setViewingInvoice] = useState(null);");
}

// 3. Add InvoiceModal render at the top of return
const returnStart = "return (\n    <div className=\"min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans overflow-hidden\">";
const modalHtml = `return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans overflow-hidden">
      {viewingInvoice && (
        <InvoiceModal 
          invoice={viewingInvoice} 
          clientEmail={client.email} 
          onClose={() => setViewingInvoice(null)} 
        />
      )}`;
content = content.replace(returnStart, modalHtml);

// 4. Update the invoice cards to include View Invoice and Email buttons
const oldButtons = `<button
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
                              </button>`;

const newButtons = `<div className="flex flex-col gap-2 w-full sm:w-auto">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setViewingInvoice(inv)}
                                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all text-center"
                                >
                                  View Invoice
                                </button>
                                <a
                                  href={\`mailto:\${client.email}?subject=Invoice%20from%20Knite%20Infotech%20-\%20\${inv.title}&body=Hello,%0A%0AAn%20invoice%20for%20\${inv.amount}%20has%20been%20issued%20for%20\${inv.title}.%0A%0APlease%20log%20into%20your%20Knite%20Infotech%20client%20portal%20to%20view%20and%20pay%20this%20invoice.%0A%0AThank%20you!\`}
                                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-center flex items-center justify-center gap-1"
                                >
                                  <MessageSquare size={12} /> Email Client
                                </a>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleInvoiceStatus(inv.id)}
                                  className={\`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center \${
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
                            </div>`;

content = content.replace(oldButtons, newButtons);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Admin Workspace updated with Invoice Modal");
