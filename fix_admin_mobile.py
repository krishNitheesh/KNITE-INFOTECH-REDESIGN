import re

with open('src/pages/AdminDashboard.jsx', 'r') as f:
    content = f.read()

# 1. Add Menu and X to imports
if 'Menu,' not in content:
    content = content.replace('ArrowLeft, Users', 'Menu, X, ArrowLeft, Users')

# 2. Add isMobileMenuOpen state
if 'isMobileMenuOpen' not in content:
    content = content.replace('const [activeMeeting, setActiveMeeting] = useState(null);', 
                              'const [activeMeeting, setActiveMeeting] = useState(null);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);')

# 3. Fix the sidebar wrapper and add overlay
old_sidebar = """<div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-[#16a3a4]/20 selection:text-[#16a3a4] relative">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200/50 glass-panel flex flex-col justify-between z-20 relative shadow-xl shadow-slate-200/30">"""

new_sidebar = """<div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-[#16a3a4]/20 selection:text-[#16a3a4] relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:relative top-0 left-0 h-full w-72 lg:w-64 border-r border-slate-200/50 bg-white/95 backdrop-blur-xl flex flex-col justify-between z-50 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full"
        >
          <X size={20} />
        </button>"""
content = content.replace(old_sidebar, new_sidebar)

# 4. Also wrap navigation onClick handlers to close menu
content = re.sub(r'onClick=\{\(\) => \{ setActiveTab\(\'(.*?)\'\); setSelectedClient\(null\); \}\}', 
                 r"onClick={() => { setActiveTab('\1'); setSelectedClient(null); setIsMobileMenuOpen(false); }}", content)

# 5. Add Hamburger Menu to Top Header
old_header = """<header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div>"""

new_header = """<header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 lg:px-8 flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div>"""

content = content.replace(old_header, new_header)

# Ensure the closing div for the new_header flex-1 is placed correctly
# It currently has:
#         </header>
old_header_close = """          </button>
        </header>"""
new_header_close = """          </button>
          </div>
        </header>"""
content = content.replace(old_header_close, new_header_close)

# 6. Hide decorative blobs on mobile
content = content.replace('className="glow-blob bg-[#16a3a4]', 'className="glow-blob hidden lg:block bg-[#16a3a4]')
content = content.replace('className="glow-blob bg-blue-600', 'className="glow-blob hidden lg:block bg-blue-600')

with open('src/pages/AdminDashboard.jsx', 'w') as f:
    f.write(content)
