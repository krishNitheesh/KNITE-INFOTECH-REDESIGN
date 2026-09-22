import fs from 'fs';
import babel from '@babel/core';

try {
  const code = fs.readFileSync('ClientPortal_Fixed_v3.jsx', 'utf-8');
  babel.transformSync(code, {
    presets: ['@babel/preset-react'],
    filename: 'ClientPortal.jsx'
  });
  console.log("Syntax is perfectly valid!");
} catch (e) {
  console.error(e.message);
}
