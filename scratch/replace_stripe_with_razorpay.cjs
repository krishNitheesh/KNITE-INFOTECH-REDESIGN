const fs = require('fs');

// 1. AdminClientWorkspace.jsx
const adminFile = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/AdminClientWorkspace.jsx';
let adminContent = fs.readFileSync(adminFile, 'utf8');

adminContent = adminContent.replace(/stripePortalUrl/g, 'razorpayUrl');
adminContent = adminContent.replace(/setStripePortalUrl/g, 'setRazorpayUrl');
adminContent = adminContent.replace(/saveStripeUrl/g, 'saveRazorpayUrl');
adminContent = adminContent.replace(/Stripe Portal URL updated/g, 'Razorpay URL updated');
adminContent = adminContent.replace(/Stripe Customer Portal/g, 'Razorpay Payment Link');
adminContent = adminContent.replace(/https:\/\/billing.stripe.com\/p\/login\/\.\.\./g, 'https://rzp.io/i/...');
adminContent = adminContent.replace(/View Stripe Checkout Link/g, 'View Razorpay Payment Link');
adminContent = adminContent.replace(/https:\/\/buy.stripe.com\/\.\.\./g, 'https://rzp.io/i/...');

fs.writeFileSync(adminFile, adminContent, 'utf8');


// 2. ClientPortal.jsx
const clientFile = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let clientContent = fs.readFileSync(clientFile, 'utf8');

clientContent = clientContent.replace(/dbUser\.stripePortalUrl/g, 'dbUser.razorpayUrl');
clientContent = clientContent.replace(/>\s*Stripe Portal\s*</g, '> Razorpay Portal <');

fs.writeFileSync(clientFile, clientContent, 'utf8');

console.log("Replaced Stripe with Razorpay");
