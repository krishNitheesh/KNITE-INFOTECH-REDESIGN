import React from 'react';
import { X, Download } from 'lucide-react';

export default function InvoiceModal({ invoice, clientEmail, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:bg-white print:p-0">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
        
        {/* Modal Header (Hidden on print) */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 print:hidden">
          <h3 className="text-lg font-bold text-slate-900">Formal Invoice</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-sm rounded-lg transition-colors"
            >
              <Download size={16} /> Save PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Document Body */}
        <div className="p-10 md:p-16 overflow-y-auto print:overflow-visible">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
            <div>
              <img src="/logo.png" alt="KNITE INFOTECH" className="h-12 mb-4" />
              <div className="text-sm text-slate-500">
                <p className="font-bold text-slate-800">Knite Infotech</p>
                <p>123 Digital Avenue</p>
                <p>Tech District, 10001</p>
                <p>support@kniteinfotech.com</p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">Invoice</h1>
              <p className="text-sm text-slate-500 font-bold mb-1">Invoice ID: <span className="font-mono text-slate-800">#{invoice.id.slice(-6)}</span></p>
              <p className="text-sm text-slate-500 font-bold">Issue Date: <span className="text-slate-800">{new Date(parseInt(invoice.id)).toLocaleDateString()}</span></p>
              <p className="text-sm text-slate-500 font-bold">Due Date: <span className="text-slate-800">{invoice.dueDate}</span></p>
            </div>
          </div>

          {/* Billing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 border-t border-b border-slate-100 py-8">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Billed To</h4>
              <p className="font-bold text-slate-800 text-lg mb-1">{clientEmail}</p>
              <p className="text-sm text-slate-500">Client Workspace Member</p>
            </div>
            <div className="text-left md:text-right">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Status</h4>
              {invoice.status === 'paid' ? (
                <div>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wider rounded border border-green-200 mb-2">
                    Paid
                  </span>
                  {invoice.paidAt && <p className="text-xs text-slate-500 font-semibold">on {new Date(invoice.paidAt).toLocaleDateString()}</p>}
                  {invoice.paymentId && <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: {invoice.paymentId}</p>}
                </div>
              ) : (
                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 font-bold text-sm uppercase tracking-wider rounded border border-amber-200">
                  Unpaid
                </span>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-5">
                    <p className="font-bold text-slate-800 text-base">{invoice.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Professional services rendered per agreement.</p>
                  </td>
                  <td className="py-5 font-bold text-slate-900 text-right text-lg">{invoice.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-16">
            <div className="w-full md:w-1/2 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-slate-500">Subtotal</span>
                <span className="font-bold text-slate-800">{invoice.amount}</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-500">Tax</span>
                <span className="font-bold text-slate-800">Included</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-extrabold text-slate-900">Total Due</span>
                <span className="text-2xl font-extrabold text-[#16a3a4]">{invoice.amount}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-center border-t border-slate-100 pt-8 text-xs text-slate-400 font-medium">
            <p className="font-bold text-slate-500 mb-1">Thank you for your business!</p>
            <p>If you have any questions concerning this invoice, please contact support@kniteinfotech.com</p>
          </div>

        </div>
      </div>
    </div>
  );
}
