const fs = require('fs');

const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// We want to replace the `/* Approved Client Relationship Dashboard */` block
const startMarker = '/* Approved Client Relationship Dashboard */';
const endMarker = '</div>\n              )}'; 

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
  console.error("Start marker not found");
  process.exit(1);
}

// Find the corresponding end of the approved client block
const lastClosingDivs = content.lastIndexOf('</div>\n              )}');
if (lastClosingDivs === -1) {
  console.error("End marker not found");
  process.exit(1);
}

const newDashboardCode = `/* Approved Client Relationship Dashboard */
                <div className="flex flex-col md:flex-row min-h-[600px] bg-slate-50/50 rounded-2xl border border-slate-150 overflow-hidden shadow-inner">
                  {/* Left Sidebar */}
                  <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col pt-6 pb-6 px-4 bg-white z-20">
                    <div className="mb-8 hidden md:block px-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-bold tracking-wider uppercase mb-3">
                        <CheckCircle2 size={12} /> Approved Client
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 truncate" title={user.email}>{user.email.split('@')[0]}</h3>
                      <p className="text-xs text-slate-500 mt-1 truncate">{user.email}</p>
                    </div>

                    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
                      {[
                        { id: 'overview', icon: <Eye size={16} />, label: 'Overview' },
                        { id: 'invoices', icon: <CreditCard size={16} />, label: 'Invoices' },
                        { id: 'meetings', icon: <Video size={16} />, label: 'Knite Meet' },
                        { id: 'resources', icon: <Link2 size={16} />, label: 'Resources' },
                        { id: 'messages', icon: <MessageSquare size={16} />, label: 'Messages' },
                        { id: 'settings', icon: <Info size={16} />, label: 'Settings' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={\`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap \${activeTab === tab.id
                              ? 'bg-[#16a3a4] text-white shadow-md shadow-[#16a3a4]/20'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }\`}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6 hidden md:block">
                      {user.email.toLowerCase() === 'kniteinfotech@gmail.com' && (
                        <Link
                          to="/admin"
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#16a3a4]/10 text-[#16a3a4] hover:bg-[#16a3a4]/20 text-xs font-bold transition-colors mb-3"
                        >
                          <ShieldCheck size={14} /> Go to Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors text-xs font-bold"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 px-6 md:px-10 py-8 flex flex-col h-[600px] overflow-y-auto hide-scrollbar relative">
                    {/* Header for Mobile */}
                    <div className="flex justify-between items-center mb-6 md:hidden">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-bold tracking-wider uppercase">
                        <CheckCircle2 size={12} /> Approved
                      </div>
                      <button onClick={handleLogout} className="text-slate-500 p-2"><LogOut size={16}/></button>
                    </div>

                    {/* Content Switcher */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-6">
                          <h4 className="text-3xl font-extrabold text-slate-900">Welcome Back</h4>
                          <p className="text-sm text-slate-500 mt-1">Here is a summary of your workspace.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-[#16a3a4]/50 transition-all cursor-pointer group" onClick={() => setActiveTab('invoices')}>
                            <div className="w-12 h-12 rounded-2xl bg-[#16a3a4]/10 flex items-center justify-center text-[#16a3a4] mb-4 group-hover:scale-110 transition-transform">
                              <CreditCard size={20} />
                            </div>
                            <h5 className="font-bold text-slate-900 text-lg">Invoices</h5>
                            <p className="text-sm text-slate-500 mt-1">{dbUser?.invoices?.length || 0} active records</p>
                          </div>
                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('meetings')}>
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                              <Video size={20} />
                            </div>
                            <h5 className="font-bold text-slate-900 text-lg">Knite Meet</h5>
                            <p className="text-sm text-slate-500 mt-1">{dbUser?.meetings?.length || 0} scheduled</p>
                          </div>
                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-orange-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('resources')}>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform">
                              <Link2 size={20} />
                            </div>
                            <h5 className="font-bold text-slate-900 text-lg">Resources</h5>
                            <p className="text-sm text-slate-500 mt-1">{dbUser?.resources?.length || 0} shared links</p>
                          </div>
                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-purple-500/50 transition-all cursor-pointer group" onClick={() => setActiveTab('messages')}>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                              <MessageSquare size={20} />
                            </div>
                            <h5 className="font-bold text-slate-900 text-lg">Messages</h5>
                            <p className="text-sm text-slate-500 mt-1">{dbUser?.messages?.length || 0} messages</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'invoices' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Billing & Invoices</h4>
                            <p className="text-sm text-slate-500">Manage your payments securely.</p>
                          </div>
                          <CreditCard className="text-slate-300 w-10 h-10" />
                        </div>
                        
                        {(!dbUser.invoices || dbUser.invoices.length === 0) ? (
                          <div className="flex flex-col items-center justify-center gap-3 p-10 bg-green-50/50 border border-green-200 rounded-2xl">
                            <CheckCircle2 size={32} className="text-green-600" />
                            <p className="text-green-800 text-base font-semibold">All invoices are paid! Thank you for your partnership.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {dbUser.invoices.map(inv => (
                              <div key={inv.id} className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group">
                                <div className="text-sm w-full sm:w-auto">
                                  <p className="font-extrabold text-slate-900 text-lg">{inv.title}</p>
                                  <p className="text-slate-500 mt-1">Due date: <span className="font-semibold text-slate-700">{inv.dueDate}</span></p>
                                  <span className={\`inline-block mt-3 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider \${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}\`}>
                                    {inv.status}
                                  </span>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-3">
                                  <span className="font-extrabold text-2xl text-slate-900">{inv.amount}</span>
                                  {inv.status === 'unpaid' && inv.payUrl && (
                                    <a
                                      href={inv.payUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-6 py-3 bg-[#16a3a4] hover:bg-[#16a3a4]/85 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-[#16a3a4]/20"
                                    >
                                      Pay Now <ChevronRight size={16} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                          <span className="text-slate-500 font-semibold">Need to manage cards or recurring payments?</span>
                          <a
                            href="https://billing.stripe.com/p/login/test_magicLinkPlaceholder"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                          >
                            Stripe Portal <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    )}

                    {activeTab === 'meetings' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Knite Meet</h4>
                            <p className="text-sm text-slate-500">Join secure video conferences with your team.</p>
                          </div>
                          <Video className="text-slate-300 w-10 h-10" />
                        </div>
                        
                        {(!dbUser.meetings || dbUser.meetings.length === 0) ? (
                          <div className="p-12 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                              <Video size={28} className="text-slate-400" />
                            </div>
                            <p className="text-slate-900 text-lg font-bold">No video meetings scheduled.</p>
                            <p className="text-slate-500 text-sm mt-2">We will schedule and link conferences here shortly.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {dbUser.meetings.map(meet => (
                              <div key={meet.id} className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-6 shadow-sm hover:border-[#16a3a4]/40 hover:shadow-md transition-all group">
                                <div>
                                  <p className="font-extrabold text-slate-900 text-xl">{meet.topic}</p>
                                  <p className="text-sm text-slate-500 font-semibold mt-2 flex items-center gap-2">
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">📅 {new Date(meet.time).toLocaleDateString()}</span>
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">⏱️ {new Date(meet.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">⏳ {meet.duration} mins</span>
                                  </p>
                                </div>
                                <button
                                  onClick={() => navigate(\`/meet?room=\${meet.link.split('/').pop()}&name=\${encodeURIComponent(dbUser?.name || dbUser?.email || 'Knite Client')}&role=client\`)}
                                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-transform transform active:scale-95 flex items-center justify-center gap-2 self-start sm:self-center shadow-lg"
                                >
                                  <Video size={16} /> Join Meeting
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'resources' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Shared Resources</h4>
                            <p className="text-sm text-slate-500">Access your project files, designs, and documents.</p>
                          </div>
                          <Link2 className="text-slate-300 w-10 h-10" />
                        </div>
                        
                        {(!dbUser.resources || dbUser.resources.length === 0) ? (
                          <div className="p-12 bg-white border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                              <Link2 size={28} className="text-slate-400" />
                            </div>
                            <p className="text-slate-900 text-lg font-bold">No workspace resources shared yet.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {dbUser.resources.map(res => (
                              <a
                                key={res.id}
                                href={res.url}
                                target="_blank"
                                rel="noreferrer"
                                className="p-5 bg-white border border-slate-200 hover:border-[#16a3a4] hover:shadow-md rounded-2xl transition-all flex items-start gap-4 group"
                              >
                                <div className="text-3xl p-3 bg-slate-50 rounded-xl group-hover:bg-[#16a3a4]/5 transition-colors">
                                  {res.type === 'figma' ? '🎨' : res.type === 'drive' ? '📁' : res.type === 'github' ? '💻' : res.type === 'doc' ? '📝' : '🔗'}
                                </div>
                                <div className="flex-grow pt-1">
                                  <div className="font-extrabold text-base text-slate-900 line-clamp-1 group-hover:text-[#16a3a4] transition-colors">{res.title}</div>
                                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mt-1.5">{res.type || 'link'}</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#16a3a4] transition-colors mt-2">
                                  <ExternalLink size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                                </div>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'messages' && (
                      <div className={\`flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-2xl border shadow-sm transition-colors \${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}\`}>
                        <div className={\`p-5 border-b flex justify-between items-center \${isDarkMode ? 'border-slate-800' : 'border-slate-150'}\`}>
                          <div>
                            <h4 className={\`font-extrabold text-lg \${isDarkMode ? 'text-white' : 'text-slate-900'}\`}>Direct Messages</h4>
                            <p className={\`text-xs mt-1 \${isDarkMode ? 'text-slate-400' : 'text-slate-500'}\`}>Chat securely with Knite Infotech admins.</p>
                          </div>
                          {uploading && <span className="px-3 py-1 bg-teal-500/10 text-teal-600 text-[10px] font-bold uppercase tracking-wider rounded-full animate-pulse">Uploading...</span>}
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-5 space-y-5">
                          {(!dbUser.messages || dbUser.messages.length === 0) ? (
                            <div className="h-full flex flex-col items-center justify-center text-center">
                              <div className={\`w-16 h-16 rounded-full flex items-center justify-center mb-4 \${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}\`}>
                                <MessageSquare size={24} className={\`\${isDarkMode ? 'text-slate-600' : 'text-slate-400'}\`} />
                              </div>
                              <p className={\`text-sm font-semibold \${isDarkMode ? 'text-slate-300' : 'text-slate-600'}\`}>No messages yet.</p>
                              <p className={\`text-xs mt-1 \${isDarkMode ? 'text-slate-500' : 'text-slate-400'}\`}>Start the conversation below.</p>
                            </div>
                          ) : (
                            dbUser.messages.map((msg, index) => (
                              <div key={index} className={\`flex flex-col \${msg.sender === 'client' ? 'items-end' : 'items-start'} group relative\`}>
                                <div className={\`p-4 rounded-[1.25rem] text-sm max-w-[85%] leading-relaxed relative shadow-sm \${msg.sender === 'client'
                                    ? 'bg-[#16a3a4] text-white rounded-br-sm'
                                    : isDarkMode
                                      ? 'bg-slate-800 text-slate-100 rounded-bl-sm border border-slate-700/50'
                                      : 'bg-slate-100 border border-slate-200/50 text-slate-900 rounded-bl-sm'
                                  }\`}>
                                  {editingMessageId === (msg.id || msg.timestamp) ? (
                                    <div className="flex items-center gap-2 min-w-[200px]">
                                      <input
                                        type="text"
                                        value={editingText}
                                        onChange={e => setEditingText(e.target.value)}
                                        className="flex-grow p-2 text-slate-900 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#16a3a4]"
                                        autoFocus
                                      />
                                      <button onClick={() => editChatMessage(msg.id || msg.timestamp, editingText)} className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg transition-colors"><Check size={14} /></button>
                                      <button onClick={() => { setEditingMessageId(null); setEditingText(''); }} className="bg-slate-400 hover:bg-slate-500 text-white p-2 rounded-lg transition-colors"><X size={14} /></button>
                                    </div>
                                  ) : msg.fileUrl ? (
                                    <div>
                                      {msg.fileType?.startsWith('image/') ? (
                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                          <img src={msg.fileUrl} alt={msg.fileName} className="max-w-[200px] rounded-xl border border-slate-300/20 shadow-sm max-h-[160px] object-cover hover:opacity-90 transition-opacity" />
                                        </a>
                                      ) : (
                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={\`flex items-center gap-2 hover:underline font-bold \${msg.sender === 'client' ? 'text-white' : isDarkMode ? 'text-[#2dd4bf]' : 'text-slate-900'}\`}>
                                          <div className="p-2 bg-white/20 rounded-lg"><Link2 size={16}/></div> {msg.fileName}
                                        </a>
                                      )}
                                    </div>
                                  ) : (
                                    <span>
                                      {msg.content}
                                      {msg.edited && <span className="text-[10px] italic ml-2 opacity-60">(edited)</span>}
                                    </span>
                                  )}

                                  <div className="absolute -top-3 -right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    {msg.sender === 'client' && !msg.fileUrl && editingMessageId !== (msg.id || msg.timestamp) && (
                                      <button onClick={() => { setEditingMessageId(msg.id || msg.timestamp); setEditingText(msg.content); }} className="bg-white text-blue-600 hover:bg-blue-50 p-1.5 rounded-full shadow-md border border-slate-100"><Edit2 size={12} /></button>
                                    )}
                                    <button onClick={() => deleteChatMessage(msg.id || msg.timestamp, msg.fileUrl)} className="bg-white text-red-600 hover:bg-red-50 p-1.5 rounded-full shadow-md border border-slate-100"><Trash2 size={12} /></button>
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-2 font-medium px-2">
                                  {msg.sender === 'client' ? 'You' : 'Admin'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))
                          )}
                        </div>

                        <form onSubmit={sendMessage} className={\`p-4 border-t flex gap-3 items-center relative \${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-150 bg-slate-50/50'}\`}>
                          {showEmojiPicker && (
                            <div className={\`absolute bottom-20 left-4 border rounded-2xl p-4 shadow-xl z-20 flex flex-wrap gap-2 max-w-[325px] max-h-[220px] overflow-y-auto \${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200'}\`}>
                              {commonEmojis.filter(emoji => !/[a-zA-Z]/.test(emoji)).map(emoji => (
                                <button key={emoji} type="button" onClick={() => { setClientMessage(prev => prev + emoji); setShowEmojiPicker(false); }} className={\`text-lg hover:scale-125 transition-transform p-1.5 rounded-lg \${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}\`}>{emoji}</button>
                              ))}
                            </div>
                          )}
                          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={\`p-3 rounded-xl transition-colors \${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm'}\`}><Smile size={18} /></button>
                          <label className={\`cursor-pointer p-3 rounded-xl transition-colors \${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 shadow-sm'}\`}>
                            <Paperclip size={18} />
                            <input type="file" onChange={handleFileUpload} className="hidden" />
                          </label>
                          <input
                            type="text"
                            placeholder="Type a message..."
                            required={!uploading}
                            value={clientMessage}
                            onChange={e => setClientMessage(e.target.value)}
                            className={\`flex-grow rounded-xl px-5 py-3.5 focus:outline-none text-sm transition-colors shadow-sm \${isDarkMode ? 'bg-slate-800 text-white placeholder-slate-500 border border-slate-700' : 'bg-white text-slate-900 border border-slate-200 focus:border-[#16a3a4] focus:ring-4 focus:ring-[#16a3a4]/10'}\`}
                          />
                          <button type="submit" className="bg-[#16a3a4] hover:bg-[#16a3a4]/85 text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-transform transform active:scale-95 shadow-md shadow-[#16a3a4]/20 flex items-center justify-center"><Check size={18} /></button>
                        </form>
                      </div>
                    )}

                    {activeTab === 'settings' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Portal Settings</h4>
                            <p className="text-sm text-slate-500">Customize your workspace experience.</p>
                          </div>
                          <Info className="text-slate-300 w-10 h-10" />
                        </div>
                        
                        <div className="space-y-5">
                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                            <label className="block text-slate-900 text-sm font-bold mb-4 flex items-center gap-2"><Eye size={16}/> Accessibility: Font Size</label>
                            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <button onClick={() => setFontZoom(prev => Math.max(80, prev - 10))} className="p-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg transition-colors font-bold w-12 h-12 flex items-center justify-center shadow-sm">A-</button>
                              <div className="flex-1 flex flex-col items-center justify-center">
                                <span className="font-extrabold text-slate-900 text-lg">{fontZoom}%</span>
                              </div>
                              <button onClick={() => setFontZoom(prev => Math.min(150, prev + 10))} className="p-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg transition-colors font-bold w-12 h-12 flex items-center justify-center shadow-sm">A+</button>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 text-center">Adjust the global text size for better readability.</p>
                          </div>

                          <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                            <label className="block text-slate-900 text-sm font-bold mb-4 flex items-center gap-2"><MessageSquare size={16}/> Chat Theme</label>
                            <button
                              onClick={() => setIsDarkMode(!isDarkMode)}
                              className={\`w-full py-4 px-4 rounded-xl text-sm font-bold transition-transform transform active:scale-95 flex items-center justify-center gap-2 shadow-sm \${isDarkMode ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}\`}
                            >
                              {isDarkMode ? '🌙 Switch to Light Mode' : '☀️ Switch to Dark Mode'}
                            </button>
                            <p className="text-xs text-slate-500 mt-4 text-center">This theme applies to the Direct Messages panel.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>`;

const finalContent = content.substring(0, startIndex) + newDashboardCode + content.substring(lastClosingDivs + 20);

fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("Successfully replaced the dashboard content.");

