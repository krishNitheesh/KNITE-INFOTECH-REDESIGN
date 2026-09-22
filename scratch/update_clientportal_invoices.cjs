const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldUpdate = "i.id === inv.id ? { ...i, status: 'paid', paymentId: response.razorpay_payment_id } : i";
const newUpdate = "i.id === inv.id ? { ...i, status: 'paid', paymentId: response.razorpay_payment_id, paidAt: new Date().toISOString() } : i";

content = content.replace(oldUpdate, newUpdate);

fs.writeFileSync(filePath, content, 'utf8');
console.log("ClientPortal.jsx updated");
