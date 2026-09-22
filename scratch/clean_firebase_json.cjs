const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/firebase.json';
let config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (config.functions) {
  delete config.functions;
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
  console.log("firebase.json cleaned");
} else {
  console.log("firebase.json already clean");
}
