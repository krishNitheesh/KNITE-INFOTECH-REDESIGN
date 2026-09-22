const fs = require('fs');

const indexFile = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/functions/index.js';
let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace('"rzp_live_TBMKGUSBeUHSVG "', '"rzp_live_TBMKGUSBeUHSVG"');
fs.writeFileSync(indexFile, indexContent, 'utf8');

const clientFile = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let clientContent = fs.readFileSync(clientFile, 'utf8');
clientContent = clientContent.replace("'YOUR_RAZORPAY_KEY_ID'", "'rzp_live_TBMKGUSBeUHSVG'");
fs.writeFileSync(clientFile, clientContent, 'utf8');

console.log("Keys trimmed and injected");
