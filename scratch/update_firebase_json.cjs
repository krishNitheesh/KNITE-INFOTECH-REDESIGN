const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/firebase.json';
let config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

if (!config.functions) {
  config.functions = {
    source: "functions"
  };
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
  console.log("firebase.json updated");
} else {
  console.log("firebase.json already has functions");
}
