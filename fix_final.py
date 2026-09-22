import re

# 1. Get the original lines 1-778 from client_portal_partial.jsx
with open('client_portal_partial.jsx', 'r') as f:
    partial_lines = f.readlines()

valid_lines = []
for line in partial_lines:
    if "<truncated" in line:
        break
    valid_lines.append(line)

# The last line in valid_lines is probably around line 779.
# Let's see what the last line is:
# "                                <button"
# Let's just write the rest of the 'meetings' tab:

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
"""

# Now extract the 'settings' tab and footer from the current ClientPortal.jsx
with open('src/pages/ClientPortal.jsx', 'r') as f:
    current_content = f.read()

settings_match = re.search(r'(              {/\* Content Switcher \*/}\s*\{activeTab === \'settings\'.*?</div>\n  \);\n})', current_content, re.DOTALL)
settings_code = settings_match.group(1) if settings_match else ""

# Wait, in the original, the switcher was a series of if/else or &&.
# We just append the settings code and footer.
# But wait! I can just use the settings code and footer directly from the current file!

with open('ClientPortal_Fixed.jsx', 'w') as f:
    f.writelines(valid_lines)
    f.write(meetings_rest)
    f.write(settings_code)

