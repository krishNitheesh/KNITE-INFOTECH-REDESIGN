const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replacements
content = content.replaceAll('bg-[#020617]', 'bg-white');
content = content.replaceAll('text-slate-100', 'text-slate-900');
content = content.replaceAll('bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)]', 'bg-[radial-gradient(circle_at_50%_-20%,#e2e8f0,transparent)]');
content = content.replaceAll('bg-[#020617]/80', 'bg-white/80');
content = content.replaceAll('border-white/5', 'border-slate-200');
content = content.replaceAll('border-white/10', 'border-slate-200');
content = content.replaceAll('bg-slate-950/20', 'bg-slate-50');
content = content.replaceAll('bg-slate-950/50', 'bg-slate-50');
content = content.replaceAll('bg-slate-950/60', 'bg-slate-50/80');
content = content.replaceAll('bg-slate-950/80', 'bg-white');
content = content.replaceAll('bg-slate-950', 'bg-slate-100');
content = content.replaceAll('bg-[#020c1b]', 'bg-slate-50');
content = content.replaceAll('bg-slate-900/40', 'bg-white');
content = content.replaceAll('bg-slate-900/60', 'bg-white/90');
content = content.replaceAll('bg-slate-900/80', 'bg-white/80');
content = content.replaceAll('bg-slate-900/30', 'bg-white/60');
content = content.replaceAll('bg-slate-900', 'bg-white');

content = content.replaceAll('text-slate-400', 'text-slate-600');
content = content.replaceAll('text-slate-300', 'text-slate-700');

content = content.replaceAll('bg-white/5', 'bg-slate-100');
content = content.replaceAll('bg-white/10', 'bg-slate-200');
content = content.replaceAll('bg-white/20', 'bg-slate-300');

// Specific text-white replacements that were on dark backgrounds but not buttons
content = content.replaceAll('<span className="text-white font-bold">', '<span className="text-slate-900 font-bold">');
content = content.replaceAll('text-2xl font-black text-white', 'text-2xl font-black text-slate-900');
content = content.replaceAll('text-xl md:text-2xl font-bold text-white', 'text-xl md:text-2xl font-bold text-slate-900');
content = content.replaceAll('text-6xl font-outfit mb-10 text-white', 'text-6xl font-outfit mb-10 text-slate-900');

content = content.replaceAll('text-slate-800', 'text-slate-300');

content = content.replaceAll('from-slate-900', 'from-white');
content = content.replaceAll('via-slate-900/40', 'via-white/80');
content = content.replaceAll('via-slate-900', 'via-white');

content = content.replaceAll('border-slate-900/80', 'border-white');

// For the black hero text that was "ENGINEERING THE FUTURE" 
// We had <span className="text-slate-600 font-light italic">THE FUTURE.</span> which is fine on white bg.

fs.writeFileSync('src/App.jsx', content);
console.log('Conversion complete');
