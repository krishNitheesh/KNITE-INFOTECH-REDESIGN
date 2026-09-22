import fs from 'fs';
import babel from '@babel/core';

try {
  const code = fs.readFileSync('src/pages/ClientPortal.jsx', 'utf-8');
  babel.transformSync(code, {
    presets: ['@babel/preset-react'],
    filename: 'ClientPortal.jsx'
  });
  console.log("Success");
} catch (e) {
  console.error(e.message);
}
