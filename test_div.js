import fs from 'fs';
const code = fs.readFileSync('src/pages/ClientPortal.jsx', 'utf-8');
const lines = code.split('\n');

let balance = 0;
for (let i = 482; i <= 831; i++) {
  const line = lines[i];
  const openCount = (line.match(/<div[^>]*>/g) || []).length;
  // Account for self-closing divs just in case, though usually none.
  const selfCloseCount = (line.match(/<div[^>]*\/>/g) || []).length;
  const closeCount = (line.match(/<\/div>/g) || []).length;
  balance += (openCount - selfCloseCount - closeCount);
  if (balance < 0) {
    console.log(`Balance went negative at line ${i+1}: ${line.trim()}`);
  }
}
console.log('Final balance:', balance);
