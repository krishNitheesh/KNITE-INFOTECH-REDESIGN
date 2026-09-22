import re

with open('src/pages/ClientPortal.jsx', 'r') as f:
    content = f.read()

# Replace the block from <div className="max-w-[1400px]... down to <div className="mb-8 hidden md:block px-2"> with the proper logic

new_block = """      <div className="max-w-[1400px] mx-auto relative z-10 p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {loading ? (
            <div className="lg:col-span-12 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-12 h-12 border-4 border-t-[#16a3a4] border-slate-200 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Processing verification...</p>
            </div>
          ) : !user ? (
            <div className="lg:col-span-12 flex justify-center items-center min-h-[600px]">
              <div className="glass-panel w-full max-w-md rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
                <div className="flex border-b border-slate-200 mb-6">
                  <button onClick={() => { setIsRegistering(false); setStatusMessage(''); }} className={`flex-1 pb-3 text-center text-sm font-bold transition-colors ${!isRegistering ? 'text-[#16a3a4] border-b-2 border-[#16a3a4]' : 'text-slate-400 hover:text-slate-700'}`}>Sign In</button>
                  <button onClick={() => { setIsRegistering(true); setStatusMessage(''); }} className={`flex-1 pb-3 text-center text-sm font-bold transition-colors ${isRegistering ? 'text-[#16a3a4] border-b-2 border-[#16a3a4]' : 'text-slate-400 hover:text-slate-700'}`}>Register</button>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight mb-2 text-slate-900">{isRegistering ? 'Create Client Profile' : 'Client Portal'}</h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">{isRegistering ? 'Request access by creating a client profile. Once approved, you can log in to manage your payments.' : 'Enter your credentials to access your billing portal dashboard.'}</p>
                {statusMessage && <div className={`p-4 rounded-xl text-sm mb-6 ${statusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : statusType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'}`}>{statusMessage}</div>}
                <form onSubmit={handleAuthRequest} className="space-y-4">
                  <div>
                    <label className="block text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">Email Address</label>
                    <input type="email" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#16a3a4] focus:bg-white transition-colors text-sm" />
                  </div>
                  {!isRegistering && (
                    <div className="flex justify-end"><button type="button" onClick={() => { setShowForgotPassword(!showForgotPassword); setForgotStatus({ msg: '', type: '' }); }} className="text-xs text-[#16a3a4] hover:underline font-semibold">{showForgotPassword ? 'Back to Sign In' : 'Forgot Password?'}</button></div>
                  )}
                  {showForgotPassword && !isRegistering ? (
                    <div className="p-5 border rounded-2xl bg-slate-50 mt-4 space-y-3">
                      <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Reset Password</h5>
                      <input type="email" placeholder="name@company.com" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#16a3a4] text-xs transition-colors" />
                      <button type="button" onClick={handleForgotPassword} disabled={forgotLoading} className="w-full bg-[#16a3a4] hover:bg-[#16a3a4]/80 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex justify-center items-center gap-2">{forgotLoading ? 'Sending...' : 'Send Reset Link'}</button>
                      {forgotStatus.msg && <p className={`text-[10px] font-bold ${forgotStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{forgotStatus.msg}</p>}
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">Password</label>
                        <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#16a3a4] focus:bg-white transition-colors text-sm" />
                      </div>
                      <button type="submit" className="w-full bg-[#16a3a4] hover:bg-[#16a3a4]/80 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 text-sm shadow-lg shadow-[#16a3a4]/10">{isRegistering ? 'Submit Request' : 'Sign In'} <ChevronRight size={16} /></button>
                    </>
                  )}
                </form>
              </div>
            </div>
          ) : dbUser?.status === 'pending' ? (
            <div className="lg:col-span-12 flex justify-center items-center min-h-[600px]">
              <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-12 text-center shadow-xl">
                <div className="w-16 h-16 bg-yellow-500/10 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles size={32} /></div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Pending Approval</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">Hello <span className="text-slate-900 font-semibold">{user.email}</span>. Your portal access request has been sent for approval. You will receive an email once the administrators activate your client profile.</p>
                <button onClick={handleLogout} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-sm"><LogOut size={16} /> Sign Out</button>
              </div>
            </div>
          ) : (
            <>
          {/* LEFT SIDEBAR - PROFILE & NAV */}
          <div className="lg:col-span-3">
            <div className="glass-panel rounded-[2.5rem] p-8 lg:sticky lg:top-8 shadow-sm flex flex-col h-auto min-h-[500px]">
              <div className="mb-8 hidden md:block px-2">"""

content = re.sub(r'      <div className="max-w-\[1400px\] mx-auto relative z-10 p-4 md:p-8">.*?<div className="mb-8 hidden md:block px-2">', new_block, content, flags=re.DOTALL)

# Add closing tags for the fragments we opened
new_end = """                      </div>
                    )}
                  </div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}"""

content = re.sub(r'                      </div>\n                    \)}\n                  </div>\n                </div>\n              </div>\n            \)}\n          </div>\n        </div>\n      </div>\n    </div>\n  \);\n}', new_end, content, flags=re.DOTALL)

with open('src/pages/ClientPortal.jsx', 'w') as f:
    f.write(content)

