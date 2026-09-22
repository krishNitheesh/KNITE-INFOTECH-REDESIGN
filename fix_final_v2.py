import re

with open('client_portal_partial.jsx', 'r') as f:
    partial_lines = f.readlines()

valid_lines = []
for line in partial_lines:
    if "<truncated" in line:
        break
    valid_lines.append(line)

meetings_rest = """                                  onClick={() => navigate(`/meet?room=${meet.link.split('/').pop()}&name=${encodeURIComponent(dbUser?.name || dbUser?.email || 'Knite Client')}&role=client`)}
                                  className="w-full sm:w-auto px-6 py-3 bg-[#16a3a4] hover:bg-[#16a3a4]/80 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#16a3a4]/20"
                                >
                                  Join Meeting
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Content Switcher */}
                    {activeTab === 'settings' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg relative z-10">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Portal Settings</h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Customize your portal experience.</p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                            <label className="block text-slate-900 text-sm font-bold mb-4 flex items-center gap-2"><MessageSquare size={16} /> Chat Theme</label>
                            <p className="text-xs text-slate-500 mt-4 text-center">Chat theme settings go here.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className={`bg-white text-slate-400 border-t border-slate-100 relative z-10 ${user && dbUser?.status === 'approved' ? 'hidden' : 'py-10'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="KNITE" className="w-8 h-8 opacity-40 grayscale" />
            <span className="font-bold tracking-widest text-slate-500 text-xs">KNITE INFOTECH</span>
          </div>
          <div className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Knite Infotech. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
"""

with open('ClientPortal_Fixed_v2.jsx', 'w') as f:
    f.writelines(valid_lines)
    f.write(meetings_rest)

print("Done")
