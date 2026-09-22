import fs from 'fs';
const code = fs.readFileSync('client_portal_partial.jsx', 'utf-8');
const lines = code.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const openCount = (line.match(/<div[^>]*>/g) || []).length;
  const selfCloseCount = (line.match(/<div[^>]*\/>/g) || []).length;
  const closeCount = (line.match(/<\/div>/g) || []).length;
  balance += (openCount - selfCloseCount - closeCount);
  if (balance < 0) {
    console.log(`Balance went negative at line ${i+1}: ${line.trim()}`);
    break;
  }
}
console.log('Final balance in partial:', balance);
