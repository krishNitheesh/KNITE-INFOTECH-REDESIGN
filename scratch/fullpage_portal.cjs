const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetStr = `      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-6 py-20 w-full relative z-10 flex-grow flex items-center justify-center">
        <div className={\`w-full \${user && dbUser?.status === 'approved' ? 'max-w-5xl' : 'max-w-md'} bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-100 relative overflow-hidden transition-all duration-300\`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a3a4]/5 blur-3xl rounded-full pointer-events-none"></div>`;

const replaceStr = `      {/* Main Body */}
      <main className={\`w-full relative z-10 flex-grow flex \${user && dbUser?.status === 'approved' ? '' : 'max-w-6xl mx-auto px-6 py-20 items-center justify-center'}\`}>
        <div className={\`w-full \${user && dbUser?.status === 'approved' ? 'bg-white min-h-[calc(100vh-80px)] flex flex-col' : 'max-w-md bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-100 relative overflow-hidden transition-all duration-300'}\`}>
          {(!user || dbUser?.status !== 'approved') && <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a3a4]/5 blur-3xl rounded-full pointer-events-none"></div>}`;

content = content.replace(targetStr, replaceStr);

// Now we need to remove the extra border/rounded from the inner dashboard wrapper so it fills the screen perfectly.
// Let's find: `<div className="flex flex-col md:flex-row min-h-[600px] bg-slate-50/50 rounded-2xl border border-slate-150 overflow-hidden shadow-inner">`
const innerDashStr = `<div className="flex flex-col md:flex-row min-h-[600px] bg-slate-50/50 rounded-2xl border border-slate-150 overflow-hidden shadow-inner">`;
const innerDashReplace = `<div className="flex flex-col md:flex-row flex-grow bg-slate-50/50 border-t border-slate-150 overflow-hidden">`;

content = content.replace(innerDashStr, innerDashReplace);

// Also remove fixed height from main content area to make it fill the screen properly
// Find: `<div className="flex-1 px-6 md:px-10 py-8 flex flex-col h-[600px] overflow-y-auto hide-scrollbar relative">`
const contentAreaStr = `<div className="flex-1 px-6 md:px-10 py-8 flex flex-col h-[600px] overflow-y-auto hide-scrollbar relative">`;
const contentAreaReplace = `<div className="flex-1 px-6 md:px-10 py-8 flex flex-col flex-grow overflow-y-auto hide-scrollbar relative">`;

content = content.replace(contentAreaStr, contentAreaReplace);

// Hide global header and footer if logged in and approved for a true full-page app experience
// Find header: `<header className="max-w-7xl mx-auto px-6 pt-10 w-full relative z-10 flex justify-between items-center">`
const headerStr = `<header className="max-w-7xl mx-auto px-6 pt-10 w-full relative z-10 flex justify-between items-center">`;
const headerReplace = `<header className={\`max-w-7xl mx-auto px-6 w-full relative z-10 flex justify-between items-center \${user && dbUser?.status === 'approved' ? 'py-4 border-b border-slate-100 bg-white' : 'pt-10'}\`}>`;

content = content.replace(headerStr, headerReplace);

// Find footer: `<footer className="bg-white text-slate-400 py-10 border-t border-slate-100 relative z-10">`
const footerStr = `<footer className="bg-white text-slate-400 py-10 border-t border-slate-100 relative z-10">`;
const footerReplace = `<footer className={\`bg-white text-slate-400 border-t border-slate-100 relative z-10 \${user && dbUser?.status === 'approved' ? 'hidden' : 'py-10'}\`}>`;

content = content.replace(footerStr, footerReplace);


fs.writeFileSync(filePath, content, 'utf8');
console.log("Made Client Portal full-page.");
