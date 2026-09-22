import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Globe, Smartphone, Megaphone, CheckCircle2, Server, 
  GraduationCap, Stethoscope, Briefcase, Bot, Cpu, 
  Code, Palette, Terminal, Brain, ChevronDown, 
  Menu, X, ArrowRight, ShieldCheck, Sparkles, Search,
  Zap, Building2
} from 'lucide-react';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const servicesMenu = [
    { name: 'Web Development', desc: 'High-speed Jamstack & enterprise portals', icon: Globe, color: 'text-blue-600 bg-blue-50', path: '/services/website' },
    { name: 'App Development', desc: 'iOS & Android native & cross-platform apps', icon: Smartphone, color: 'text-purple-600 bg-purple-50', path: '/services/mobile' },
    { name: 'Digital Marketing', desc: 'Performance SEO, PPC & organic reach', icon: Megaphone, color: 'text-amber-600 bg-amber-50', path: isHome ? '#contact' : '/#contact' },
    { name: 'Software Testing', desc: 'Automated QA suites & security audits', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', path: isHome ? '#contact' : '/#contact' },
    { name: 'Server Development', desc: 'Cloud infrastructure & microservices', icon: Server, color: 'text-sky-600 bg-sky-50', path: '/services/custom-dev' },
    { name: 'Server Maintenance', desc: '24/7 server monitoring & 99.99% uptime', icon: Cpu, color: 'text-teal-600 bg-teal-50', path: isHome ? '#contact' : '/#contact' },
    { name: 'AI Systems', desc: 'Autonomous agents & custom LLM pipelines', icon: Bot, color: 'text-indigo-600 bg-indigo-50', path: isHome ? '#hero-bento' : '/#hero-bento' },
  ];

  const solutionsMenu = [
    { name: 'School Software (ERP)', desc: 'Complete academic ERP & student portal', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50', path: '/services/school' },
    { name: 'Hospital Software (ERP)', desc: 'Clinical records, OPD & automated billing', icon: Stethoscope, color: 'text-rose-600 bg-rose-50', path: '/services/hospital' },
    { name: 'All Business Software', desc: 'Custom CRM, billing, ERP & inventory', icon: Briefcase, color: 'text-blue-600 bg-blue-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
    { name: 'AI Applications', desc: 'LLM agents, smart bots & analytics', icon: Bot, color: 'text-amber-600 bg-amber-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
    { name: 'Automations', desc: 'Workflow triggers & business automation', icon: Cpu, color: 'text-teal-600 bg-teal-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
  ];

  const coursesMenu = [
    { name: 'Software Testing (QA)', desc: 'Selenium, Cypress & manual QA mastery', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
    { name: 'UI / UX Design', desc: 'Figma, design systems & research', icon: Palette, color: 'text-pink-600 bg-pink-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
    { name: 'Full Stack Development', desc: 'React, Node, databases & cloud APIs', icon: Code, color: 'text-blue-600 bg-blue-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
    { name: 'Digital Marketing', desc: 'SEO, Google Ads & conversion growth', icon: Megaphone, color: 'text-amber-600 bg-amber-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
    { name: 'AI / Machine Learning', desc: 'Python, predictive models & GenAI', icon: Brain, color: 'text-purple-600 bg-purple-50', path: isHome ? '#ecosystem' : '/#ecosystem' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-[#e5e7eb] h-[72px] sm:h-[76px] flex items-center transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between" ref={dropdownRef}>
        
        {/* Left: Original KNITE INFOTECH Logo & Nav Items */}
        <div className="flex items-center gap-8 xl:gap-10">
          <Link to={isHome ? '#' : '/'} className="flex items-center gap-3 group flex-shrink-0">
            <img 
              src="/logo.png" 
              alt="KNITE Logo" 
              className="h-9 sm:h-10 w-auto object-contain" 
            />
            <div className="flex flex-col">
              <span className="text-[19px] sm:text-[21px] font-black tracking-tight text-slate-950 leading-none">
                KNITE <span className="text-slate-800 font-bold">INFOTECH</span>
              </span>
            </div>
          </Link>

          {/* Nav Items (Exact Original Contents: Services, Solutions, Courses, Clients) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[15px] text-[#111827] font-normal">
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
            >
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded transition-colors ${
                  activeDropdown === 'services' ? 'text-[#e42528] font-medium' : 'text-[#111827] hover:text-[#e42528]'
                }`}
              >
                <span>Services</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-[#e42528]' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'services' && (
                <div 
                  className="absolute top-full left-0 w-[580px] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 mt-1 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {servicesMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className={`p-2 rounded-lg ${item.color} mt-0.5 flex-shrink-0`}>
                          <Icon size={17} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#e42528] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight line-clamp-1 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('solutions')}
            >
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded transition-colors ${
                  activeDropdown === 'solutions' ? 'text-[#e42528] font-medium' : 'text-[#111827] hover:text-[#e42528]'
                }`}
              >
                <span>Solutions</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180 text-[#e42528]' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'solutions' && (
                <div 
                  className="absolute top-full left-0 w-[540px] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 mt-1 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {solutionsMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className={`p-2 rounded-lg ${item.color} mt-0.5 flex-shrink-0`}>
                          <Icon size={17} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#e42528] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight line-clamp-1 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Courses Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('courses')}
            >
              <button 
                onClick={() => setActiveDropdown(activeDropdown === 'courses' ? null : 'courses')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded transition-colors ${
                  activeDropdown === 'courses' ? 'text-[#e42528] font-medium' : 'text-[#111827] hover:text-[#e42528]'
                }`}
              >
                <span>Courses</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${activeDropdown === 'courses' ? 'rotate-180 text-[#e42528]' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'courses' && (
                <div 
                  className="absolute top-full left-0 w-[540px] bg-white rounded-xl shadow-2xl border border-slate-200 p-4 mt-1 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {coursesMenu.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className={`p-2 rounded-lg ${item.color} mt-0.5 flex-shrink-0`}>
                          <Icon size={17} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-[#e42528] transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 leading-tight line-clamp-1 mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clients Link */}
            <Link
              to={isHome ? '#clients' : '/#clients'}
              className="px-3 py-2 rounded text-[#111827] hover:text-[#e42528] transition-colors"
            >
              Clients
            </Link>

          </nav>
        </div>

        {/* Right: Search, Global, Client Portal (in red text), Request Consultation (in solid red button) */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-6">
          
          {/* Search Icon */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-[#333333] hover:text-black p-1.5 rounded transition-colors"
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* Language / Region */}
          <div className="flex items-center gap-1.5 text-[14.5px] font-normal text-[#333333] hover:text-black cursor-pointer">
            <Globe size={16} />
            <span>English</span>
          </div>

          {/* Client Portal (Red Link - exactly like "Sign In" in image) */}
          <Link
            to="/portal"
            className="text-[15px] font-semibold text-[#e42528] hover:text-[#c91d20] transition-colors"
          >
            Client Portal
          </Link>

          {/* Request Consultation (Solid Red Button - exactly like "Sign Up" in image) */}
          <Link
            to={isHome ? '#contact' : '/#contact'}
            className="bg-[#e42528] hover:bg-[#c91d20] text-white font-semibold text-[14px] px-5 py-2 rounded-[4px] shadow-none transition-all flex items-center justify-center tracking-normal"
          >
            Request Consultation
          </Link>

        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-3">
          <Link
            to="/portal"
            className="text-xs font-bold text-[#e42528] px-1.5 py-1"
          >
            Client Portal
          </Link>
          <Link
            to={isHome ? '#contact' : '/#contact'}
            className="bg-[#e42528] text-white font-bold text-xs px-3 py-1.5 rounded"
          >
            Consult
          </Link>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Search Bar Flyout */}
      {isSearchOpen && (
        <div className="hidden lg:block absolute top-full left-0 right-0 border-t border-slate-100 bg-slate-50/95 px-8 py-3 animate-in fade-in duration-150">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search services, ERP platforms, technologies, or case studies..."
              className="w-full bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
              autoFocus
            />
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-1 duration-150">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Services</div>
            <div className="grid grid-cols-1 gap-1.5">
              {servicesMenu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-slate-800 text-sm font-medium"
                >
                  <item.icon size={17} className="text-[#e42528]" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Solutions</div>
            <div className="grid grid-cols-1 gap-1.5">
              {solutionsMenu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-slate-800 text-sm font-medium"
                >
                  <item.icon size={17} className="text-[#e42528]" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Courses</div>
            <div className="grid grid-cols-1 gap-1.5">
              {coursesMenu.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-slate-800 text-sm font-medium"
                >
                  <item.icon size={17} className="text-[#e42528]" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <Link
              to="/portal"
              onClick={() => setIsOpen(false)}
              className="text-center font-bold text-[#e42528] py-2.5 rounded-lg border border-[#e42528]/30 hover:bg-red-50 text-sm"
            >
              Client Portal
            </Link>
            <Link
              to={isHome ? '#contact' : '/#contact'}
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-[#e42528] text-white py-3 rounded-lg font-bold text-sm shadow-sm"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
