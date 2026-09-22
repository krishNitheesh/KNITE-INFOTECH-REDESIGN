import fs from 'fs';
const code = fs.readFileSync('src/pages/ClientPortal.jsx', 'utf-8');
const lines = code.split('\n');

let balance = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<>')) console.log(`<> opened at ${i+1}`);
  if (line.includes('</>')) console.log(`</> closed at ${i+1}`);

  const openCount = (line.match(/<div[^>]*>/g) || []).length;
  const selfCloseCount = (line.match(/<div[^>]*\/>/g) || []).length;
  const closeCount = (line.match(/<\/div>/g) || []).length;
  balance += (openCount - selfCloseCount - closeCount);
  if (line.includes('</>')) {
    console.log(`Balance at </> (line ${i+1}) is ${balance}`);
  }
}
