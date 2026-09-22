const fs = require('fs');
const filePathAdmin = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/AdminClientWorkspace.jsx';
let adminContent = fs.readFileSync(filePathAdmin, 'utf8');

// Add state
adminContent = adminContent.replace(
  'const [clientNote, setClientNote] = useState(\'\');',
  'const [clientNote, setClientNote] = useState(\'\');\n  const [stripePortalUrl, setStripePortalUrl] = useState(\'\');'
);

// Add to onSnapshot
adminContent = adminContent.replace(
  'setClientNote(data.notes || \'\');',
  'setClientNote(data.notes || \'\');\n        setStripePortalUrl(data.stripePortalUrl || \'\');'
);

// Add save function
adminContent = adminContent.replace(
  'const saveNotes = async () => {\n    await saveClientFields({ notes: clientNote });\n    alert("Internal notes updated successfully.");\n  };',
  'const saveNotes = async () => {\n    await saveClientFields({ notes: clientNote });\n    alert("Internal notes updated successfully.");\n  };\n\n  const saveStripeUrl = async () => {\n    await saveClientFields({ stripePortalUrl });\n    alert("Stripe Portal URL updated.");\n  };'
);

// Add UI block in Overview (Find internal admin notes section)
const adminNotesStr = `<div className="mt-8 pt-8 border-t border-slate-200">
                      <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                        <MessageSquare size={16} className="text-teal-600" /> Internal Admin Notes
                      </h4>`;
                      
const newStripeBlock = `<div className="mt-8 pt-8 border-t border-slate-200">
                      <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                        <CreditCard size={16} className="text-teal-600" /> Stripe Customer Portal
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <input
                          type="url"
                          className="flex-grow p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                          placeholder="https://billing.stripe.com/p/login/..."
                          value={stripePortalUrl}
                          onChange={(e) => setStripePortalUrl(e.target.value)}
                        />
                        <button
                          onClick={saveStripeUrl}
                          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors whitespace-nowrap"
                        >
                          Save Link
                        </button>
                      </div>
                    </div>\n\n                    <div className="pt-2">
                      <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
                        <MessageSquare size={16} className="text-teal-600" /> Internal Admin Notes
                      </h4>`;

adminContent = adminContent.replace(adminNotesStr, newStripeBlock);
fs.writeFileSync(filePathAdmin, adminContent, 'utf8');

const filePathClient = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let clientContent = fs.readFileSync(filePathClient, 'utf8');

const oldStripeLink = `<div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                          <span className="text-slate-500 font-semibold">Need to manage cards or recurring payments?</span>
                          <a
                            href="https://billing.stripe.com/p/login/test_magicLinkPlaceholder"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                          >
                            Stripe Portal <ExternalLink size={14} />
                          </a>
                        </div>`;
                        
const newStripeLink = `<div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                          <span className="text-slate-500 font-semibold">Need to manage cards or recurring payments?</span>
                          {dbUser.stripePortalUrl ? (
                            <a
                              href={dbUser.stripePortalUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
                            >
                              Stripe Portal <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Portal link not configured</span>
                          )}
                        </div>`;

clientContent = clientContent.replace(oldStripeLink, newStripeLink);
fs.writeFileSync(filePathClient, clientContent, 'utf8');

console.log("Stripe integrated!");
