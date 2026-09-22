import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowLeft, Users, ShieldAlert, CheckCircle2, XCircle, RefreshCw, LogOut, Mail, ShieldCheck, ChevronRight, Trash2, LayoutDashboard, UserPlus, CheckCircle, ExternalLink, Briefcase } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword
} from "firebase/auth";

import ExecutiveDashboard from '../components/admin/ExecutiveDashboard';
import LeadPipeline from '../components/admin/LeadPipeline';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXJ2ezJMtsXFqcgEmPQ2XyXnXloprC7Dg",
  authDomain: "knite-web.firebaseapp.com",
  projectId: "knite-web",
  storageBucket: "knite-web.firebasestorage.app",
  messagingSenderId: "383481390906",
  appId: "1:383481390906:web:b0d57f18e982ff7cead203"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const ADMIN_EMAIL = "kniteinfotech@gmail.com";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info'); // info, success, error
  const [clients, setClients] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal Form States
  const [newMeetTopic, setNewMeetTopic] = useState('');
  const [newMeetTime, setNewMeetTime] = useState('');
  const [newMeetDuration, setNewMeetDuration] = useState(30);
  const [newMeetLink, setNewMeetLink] = useState('');
  const [newInvTitle, setNewInvTitle] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvDueDate, setNewInvDueDate] = useState('');
  const [newInvPayUrl, setNewInvPayUrl] = useState('');
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState('figma');
  const [clientNote, setClientNote] = useState('');
  const [adminReply, setAdminReply] = useState('');

  const navigate = useNavigate();

  // 3. Fetch all clients from users collection
  const fetchClients = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const clientList = [];
      querySnapshot.forEach((doc) => {
        clientList.push({ id: doc.id, ...doc.data() });
      });
      setClients(clientList);
    } catch (error) {
      console.error("Error fetching clients: ", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. Verify Admin Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
        fetchClients();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Knite Meet is managed on a dedicated standalone page (/meet)

  // 2. Handle Admin Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
      setStatusMessage('Access denied. Invalid administrator email address.');
      setStatusType('error');
      return;
    }

    setLoginLoading(true);
    setStatusMessage('');

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      setStatusMessage('Successfully logged in!');
      setStatusType('success');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setStatusMessage('Invalid administrator email or password.');
      } else {
        setStatusMessage('An error occurred. Please try again.');
      }
      setStatusType('error');
    } finally {
      setLoginLoading(false);
    }
  };


  // 4. Update Client Status (Approve/Reject)
  const updateClientStatus = async (emailId, newStatus) => {
    setUpdatingId(emailId);
    try {
      const userRef = doc(db, "users", emailId);
      await updateDoc(userRef, {
        status: newStatus
      });
      
      // Update local state
      setClients(prev => prev.map(c => c.id === emailId ? { ...c, status: newStatus } : c));
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // 5. Delete Client Profile
  const deleteClient = async (emailId) => {
    if (!window.confirm(`Are you sure you want to delete the profile for ${emailId}? This will remove them from the system so they can register fresh.`)) return;
    setUpdatingId(emailId);
    try {
      const userRef = doc(db, "users", emailId);
      await deleteDoc(userRef);
      // Update local state
      setClients(prev => prev.filter(c => c.id !== emailId));
      if (selectedClient?.id === emailId) {
        setSelectedClient(null);
      }
    } catch (error) {
      console.error("Error deleting user profile: ", error);
      alert("Failed to delete client profile.");
    } finally {
      setUpdatingId(null);
    }
  };

  // 6. Generic update client fields helper
  const saveClientFields = async (updatedFields) => {
    if (!selectedClient) return;
    try {
      const clientRef = doc(db, "users", selectedClient.id);
      await updateDoc(clientRef, updatedFields);
      const updatedClient = { ...selectedClient, ...updatedFields };
      setSelectedClient(updatedClient);
      setClients(prev => prev.map(c => c.id === selectedClient.id ? updatedClient : c));
    } catch (error) {
      console.error("Error saving client fields:", error);
      alert("Failed to update client data.");
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setClientNote(client.notes || '');
    setActiveTab('overview');
  };

  const saveNotes = async () => {
    await saveClientFields({ notes: clientNote });
    alert("Internal notes updated successfully.");
  };

  // 7. Knite Meet management functions
  const addMeeting = async (e) => {
    e.preventDefault();
    if (!newMeetTopic || !newMeetTime) return;
    const cleanId = selectedClient.id.replace(/[^a-zA-Z0-9]/g, '');
    const finalLink = `https://meet.jit.si/KniteMeet-${cleanId}-${Date.now()}`;
    const meeting = {
      id: Date.now().toString(),
      topic: newMeetTopic,
      time: newMeetTime,
      duration: parseInt(newMeetDuration) || 30,
      link: finalLink
    };
    const updatedMeetings = [...(selectedClient.meetings || []), meeting];
    await saveClientFields({ meetings: updatedMeetings });
    setNewMeetTopic('');
    setNewMeetTime('');
    setNewMeetDuration(30);
    setNewMeetLink('');
  };

  const deleteMeeting = async (meetId) => {
    const updatedMeetings = (selectedClient.meetings || []).filter(m => m.id !== meetId);
    await saveClientFields({ meetings: updatedMeetings });
  };

  // 8. Invoice management functions
  const addInvoice = async (e) => {
    e.preventDefault();
    if (!newInvTitle || !newInvAmount) return;
    const invoice = {
      id: Date.now().toString(),
      title: newInvTitle,
      amount: newInvAmount,
      dueDate: newInvDueDate || 'On Receipt',
      status: 'unpaid',
      payUrl: newInvPayUrl || ''
    };
    const updatedInvoices = [...(selectedClient.invoices || []), invoice];
    await saveClientFields({ invoices: updatedInvoices });
    setNewInvTitle('');
    setNewInvAmount('');
    setNewInvDueDate('');
    setNewInvPayUrl('');
  };

  const toggleInvoiceStatus = async (invId) => {
    const updatedInvoices = (selectedClient.invoices || []).map(inv => {
      if (inv.id === invId) {
        return { ...inv, status: inv.status === 'paid' ? 'unpaid' : 'paid' };
      }
      return inv;
    });
    await saveClientFields({ invoices: updatedInvoices });
  };

  const deleteInvoice = async (invId) => {
    const updatedInvoices = (selectedClient.invoices || []).filter(inv => inv.id !== invId);
    await saveClientFields({ invoices: updatedInvoices });
  };

  // 9. Resource management functions
  const addResource = async (e) => {
    e.preventDefault();
    if (!newResTitle || !newResUrl) return;
    const resource = {
      id: Date.now().toString(),
      title: newResTitle,
      url: newResUrl,
      type: newResType
    };
    const updatedResources = [...(selectedClient.resources || []), resource];
    await saveClientFields({ resources: updatedResources });
    setNewResTitle('');
    setNewResUrl('');
    setNewResType('figma');
  };

  const deleteResource = async (resId) => {
    const updatedResources = (selectedClient.resources || []).filter(r => r.id !== resId);
    await saveClientFields({ resources: updatedResources });
  };

  // 10. Message functions
  const sendAdminReply = async (e) => {
    e.preventDefault();
    if (!adminReply.trim()) return;
    const msg = {
      sender: 'admin',
      content: adminReply.trim(),
      timestamp: Date.now()
    };
    const updatedMessages = [...(selectedClient.messages || []), msg];
    await saveClientFields({ messages: updatedMessages });
    setAdminReply('');
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setIsAdmin(false);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#16a3a4] border-slate-200 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-sm font-medium">Verifying credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center relative overflow-x-hidden selection:bg-[#16a3a4]/20 selection:text-[#16a3a4]">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(22,163,164,0.06),transparent_60%)] pointer-events-none"></div>

        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a3a4]/5 blur-3xl rounded-full pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold tracking-wider uppercase mb-6">
            <ShieldAlert size={14} /> Admin Access Only
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4 text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Please authenticate using your registered administrator email address and password to access controls.
          </p>

          {statusMessage && (
            <div className={`p-4 rounded-xl text-sm mb-6 text-left ${
              statusType === 'success' ? 'bg-green-500/10 text-green-700 border border-green-500/20' :
              statusType === 'error' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
              'bg-[#16a3a4]/10 text-[#16a3a4] border border-[#16a3a4]/20'
            }`}>
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">Admin Email</label>
              <input
                type="email"
                placeholder="kniteinfotech@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginLoading}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#16a3a4] transition-colors text-sm disabled:opacity-50 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#16a3a4] transition-colors text-sm disabled:opacity-50 placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#16a3a4] hover:bg-[#16a3a4]/90 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 text-sm shadow-lg shadow-[#16a3a4]/10 disabled:opacity-50"
            >
              {loginLoading ? 'Signing in...' : 'Sign In as Admin'} <ChevronRight size={16} />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <Link to="/portal" className="text-teal-400 hover:text-teal-300 transition-colors text-sm font-semibold">
              Go to Client Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter clients
  const pendingClients = clients.filter(c => c.status === 'pending');
  const processedClients = clients.filter(c => c.status !== 'pending');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 pb-10">
            <ExecutiveDashboard clients={processedClients} />
          </div>
        );
      case 'pipeline':
        return (
          <div className="h-[calc(100vh-140px)]">
            <LeadPipeline />
          </div>
        );
      case 'pending':
        return (
          <div className="bento-card">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.6)]"></span>
              Awaiting Approval ({pendingClients.length})
            </h3>
            {pendingClients.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50 flex flex-col items-center justify-center">
                <ShieldCheck size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">You're all caught up!</p>
                <p className="text-slate-400 text-sm mt-1">No pending client requests.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendingClients.map((client) => (
                  <div key={client.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col sm:flex-row justify-between gap-6 items-center">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-[#16a3a4] text-lg">{client.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{client.email}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Requested: {client.createdAt ? new Date(client.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => updateClientStatus(client.id, 'approved')}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => updateClientStatus(client.id, 'rejected')}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                      >
                        Reject
                      </button>
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => deleteClient(client.id)}
                        className="p-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-slate-400 transition-all disabled:opacity-50"
                        title="Delete Request"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'active':
        return (
          <div className="bento-card">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></span>
              All Registered Clients ({processedClients.length})
            </h3>
            {processedClients.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
                <p className="text-slate-400 font-medium">No active clients found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {processedClients.map((client) => (
                  <div key={client.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#16a3a4]/30 transition-colors">
                    <div 
                      onClick={() => navigate(`/admin/client/${client.id}`)}
                      className="cursor-pointer group flex items-center gap-4 flex-grow w-full"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <span className="font-bold text-slate-600 text-lg group-hover:text-[#16a3a4]">{client.email.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-[#16a3a4] transition-colors flex items-center gap-2">
                          {client.email} <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {client.status === 'approved' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 uppercase tracking-wider bg-green-100 px-2.5 py-1 rounded-md border border-green-200">
                              <CheckCircle2 size={12} /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 uppercase tracking-wider bg-red-100 px-2.5 py-1 rounded-md border border-red-200">
                              <XCircle size={12} /> Rejected
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 group-hover:text-slate-600 transition-colors font-medium">Click to manage workspace</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center w-full md:w-auto">
                      {client.status === 'approved' ? (
                        <button
                          disabled={updatingId === client.id}
                          onClick={() => updateClientStatus(client.id, 'rejected')}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <button
                          disabled={updatingId === client.id}
                          onClick={() => updateClientStatus(client.id, 'approved')}
                          className="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-green-50 hover:text-green-600 border border-slate-200 hover:border-green-200 text-slate-700 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Re-Approve
                        </button>
                      )}
                      <button
                        disabled={updatingId === client.id}
                        onClick={() => deleteClient(client.id)}
                        className="p-2.5 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-slate-400 transition-all disabled:opacity-50"
                        title="Delete Profile"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-[#16a3a4]/20 selection:text-[#16a3a4] relative">
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
        </button>
        <div>
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <ShieldCheck size={28} className="text-[#16a3a4]" />
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">KNITE</h2>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Admin Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => { setActiveTab('overview'); setSelectedClient(null); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'overview' && !selectedClient ? 'nav-pill-active' : 'nav-pill-inactive'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} className={activeTab === 'overview' && !selectedClient ? 'text-[#16a3a4]' : 'text-slate-400'} />
                Overview
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('pending'); setSelectedClient(null); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'pending' && !selectedClient ? 'nav-pill-active' : 'nav-pill-inactive'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserPlus size={18} className={activeTab === 'pending' ? 'text-[#16a3a4]' : 'text-slate-400'} />
                Pending Approvals
              </div>
              {pendingClients.length > 0 && (
                <span className="px-2 py-0.5 bg-yellow-500 text-white rounded-full text-[10px]">{pendingClients.length}</span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('active'); setSelectedClient(null); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'active' && !selectedClient ? 'nav-pill-active' : 'nav-pill-inactive'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={18} className={activeTab === 'active' && !selectedClient ? 'text-[#16a3a4]' : 'text-slate-400'} />
                Active Clients
              </div>
              {processedClients.length > 0 && (
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full text-[10px]">{processedClients.length}</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('pipeline'); setSelectedClient(null); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'pipeline' && !selectedClient ? 'nav-pill-active' : 'nav-pill-inactive'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase size={18} className={activeTab === 'pipeline' && !selectedClient ? 'text-[#16a3a4]' : 'text-slate-400'} />
                Lead Pipeline
              </div>
            </button>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <Link to="/portal" className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 rounded-xl text-sm font-bold transition-colors">
            <ArrowLeft size={18} />
            Back to Portal
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl text-sm font-bold transition-colors mt-1"
          >
            <LogOut size={18} />
            Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Global Dynamic Background Effects */}
      <div className="noise-overlay"></div>
      <div className="glow-blob hidden lg:block bg-[#16a3a4] w-[700px] h-[700px] top-[-30%] left-[-20%] opacity-20 mix-blend-multiply"></div>
      <div className="glow-blob hidden lg:block bg-blue-600 w-[600px] h-[600px] bottom-[-20%] right-[-10%] opacity-15 mix-blend-multiply"></div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-transparent z-10">

        {/* Top Header */}
        <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-6 lg:px-8 flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'pending' && 'Pending Approvals'}
              {activeTab === 'active' && 'Client Workspaces'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Manage your client relationships and portal access.</p>
          </div>
          <button 
            onClick={fetchClients}
            className="p-2.5 bg-white hover:bg-slate-50 text-[#16a3a4] rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow flex items-center gap-2"
            title="Refresh Data"
          >
            <RefreshCw size={16} /> <span className="text-xs font-bold hidden sm:inline">Refresh</span>
          </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
