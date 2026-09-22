import re

with open('src/pages/ClientPortal.jsx', 'r') as f:
    content = f.read()

# Let's replace the broken closing block
broken_block = """                      </div>
                    )}
                  </div>
                </div>)}
            </div>
          )}
        </div>
      </main>"""

fixed_block = """                      </div>
                    )}
            </div>
          </div>
          </>
          )}
        </div>
      </div>"""

content = content.replace(broken_block, fixed_block)

with open('src/pages/ClientPortal.jsx', 'w') as f:
    f.write(content)

