import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Trash2, CheckCircle2, XCircle, Plus,
  Info, Video, CreditCard, Link2, MessageSquare, Calendar, DollarSign, Clock, ShieldCheck,
  Paperclip, Smile, Edit2, Check, X
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import InvoiceModal from '../components/InvoiceModal';

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
const storage = getStorage(app);

const AdminClientWorkspace = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const getNext30Days = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const val = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      days.push({ val, label });
    }
    return days;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min of ['00', '30']) {
        const h12 = hour % 12 === 0 ? 12 : hour % 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        const label = `${h12.toString().padStart(2, '0')}:${min} ${ampm}`;
        const val = `${hour.toString().padStart(2, '0')}:${min}`;
        slots.push({ val, label });
      }
    }
    return slots;
  };

  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [fontZoom, setFontZoom] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const commonEmojis = [
    // Smileys & Emotion
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🫢', '🤫', '🫠', '🤥', '😶', '😐', '😑', '😬', '🫨', '🙄', '😯', '😦', '😧', '😮', '😲', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕',
    // Hands & Body
    '👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫵', '👉', '👈', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '👂', '🦻', '👃', '🧠', '🦷', '🦴', '👀', '👁️',
    // People & Gestures
    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱', '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️', '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔‍♀️', '🧔', '🧔‍♂️', '👵', '🧓', '👴', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️', '👰‍♀️', '👰', '👰‍♂️', '🤵‍♀️', '🤵', '🤵‍♂️', '👸', '🤴', '🥷', '🦸‍♀️', '🦸', '🦸‍♂️', '🦹‍♀️', '🦹', '🦹‍♂️', '🤶', '🧑‍🎄', '🎅', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️', '🧝', '🧝‍♂️', '🧛‍♀️', '🧛', '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️', '🧚‍♀️', '🧚', '🧚‍♂️', '👼',
    // Hearts & Symbols
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '💘', '💝', '✨', '⭐', '🌟', '💫', '🔥', '💥', '💢', '💨', '💦', '💤', '🌀',
    // Animals & Nature
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🐙', '🦑', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦡', '🦫', '🦦', '🦥', '🐿️', '🦔', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🍃', '🍂', '🍁', '🍄', '🐚', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐', '🌟', '✨', '⚡', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '☂️', '🌊', '🌫️',
    // Food & Drink
    '🍏', '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', 'Corn', '🌽', '🥕', '🫒', '🧄', ' onion', '🧅', '🥔', '🍠', '🥐', '🥯', 'Bread', '🥖', 'Pretzel', '🧀', '🥚', '🍳', 'Pancake', 'Waffle', '🥓', '🥩', 'Chicken', 'Meat', 'Hotdog', 'Hamburger', 'Fries', 'Pizza', 'Sandwich', 'Taco', 'Burrito', 'Salad', 'Soup', 'Popcorn', 'Butter', 'Salt', 'Canned', 'Bento', 'Sushi', 'Tempura', 'Icecream', 'Donut', 'Cookie', 'Cake', 'Cupcake', 'Pie', 'Chocolate', 'Candy', 'Lollipop', 'Pudding', 'Honey', 'Milk', 'Coffee', 'Tea', 'Juice', 'Soda', 'Beer', 'Beer', 'Wine', 'Whiskey', 'Cocktail', 'Champagne', 'Ice',
    // Activities & Objects
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🎱', '⛳', '🎣', '🥊', '🛹', '🏆', '🥇', '🥈', '🥉', '🏅', '🎫', '🎟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', 'Violin', '🎲', '🧩', '🎯', '♟️', '🎮', 'Slot', '🚗', '🚕', '🚙', 'Bus', 'Police', 'Ambulance', 'Fire', 'Truck', 'Tractor', 'Motorcycle', 'Scooter', 'Bike', '🚨', '🚥', '🚦', '🚀', '🛸', 'Helicopter', 'Airplane', 'Seat', 'Anchor', 'Sailboat', 'Speedboat', 'Ship', 'Map', 'Compass', 'Mountain', 'Volcano', 'Fuji', 'Camping', 'Beach', 'Desert', 'Island', 'Stadium', 'House', 'Office', 'Hospital', 'Bank', 'Hotel', 'School', 'Castle', 'Church', 'Mosque', 'Temple', 'Synagogue', 'Bed', 'Sofa', 'Door', 'Window', 'Mirror', 'Broom', 'Basket', 'Paper', 'Soap', 'Plunger', 'Sponge', 'Lotion', 'Bucket', 'Key', 'Hammer', 'Axe', 'Wrench', 'Sword', 'Shield', 'Gear', 'Balance', 'Link', 'Chain', 'Hook', 'Clip', 'Ruler', 'Pin', 'Needle', 'Thread', 'Knot', 'Trash', 'Box', 'Envelope', 'Mail', 'Label', 'File', 'Folder', 'Book', 'Books', 'Bookmark', 'Microscope', 'Telescope', 'Satellite', 'Briefcase', 'Bag', 'Purse', 'Backpack', 'Luggage', 'Sunglasses', 'Glasses', 'Goggles', 'Coat', 'Tie', 'Shirt', 'Jeans', 'Scarf', 'Gloves', 'Dress', 'Kimono', 'Sari', 'Swimsuit', 'Shorts', 'Socks', 'Shoe', 'Highheel', 'Boot', 'Sneaker', 'Crown', 'Hat', 'Helmet', 'Ring', 'Gem'
  ];

  // Form states
  const [clientNote, setClientNote] = useState('');
  const [razorpayUrl, setRazorpayUrl] = useState('');
  const [newMeetTopic, setNewMeetTopic] = useState('');
  const [newMeetTime, setNewMeetTime] = useState('');
  const [newMeetDuration, setNewMeetDuration] = useState(30);

  const [newInvTitle, setNewInvTitle] = useState('');
  const [newInvAmount, setNewInvAmount] = useState('');
  const [newInvDueDate, setNewInvDueDate] = useState('');
  

  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState('figma');

  // 1. Verify Authentication & Admin Status
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate('/admin');
      }
    });
    return () => unsubscribeAuth();
  }, [navigate]);

  // 2. Fetch Client document in real-time
  useEffect(() => {
    if (!clientId) return;

    const unsubscribeDoc = onSnapshot(doc(db, "users", clientId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setClient({ id: docSnap.id, ...data });
        setClientNote(data.notes || '');
        setRazorpayUrl(data.razorpayUrl || '');
      } else {
        alert("Client profile not found.");
        navigate('/admin');
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching client snapshot:", error);
      setLoading(false);
    });

    return () => unsubscribeDoc();
  }, [clientId, navigate]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontZoom}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontZoom]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-slate-800">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Loading workspace...</p>
      </div>
    );
  }

  if (!client) return null;

  // Helper function to update Firestore fields
  const saveClientFields = async (updatedFields) => {
    try {
      const clientRef = doc(db, "users", client.id);
      await updateDoc(clientRef, updatedFields);
    } catch (error) {
      console.error("Error saving client fields:", error);
      alert("Failed to update workspace data.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    await saveClientFields({ status: newStatus });
  };

  const saveNotes = async () => {
    await saveClientFields({ notes: clientNote });
    alert("Internal notes updated successfully.");
  };

  const saveRazorpayUrl = async () => {
    await saveClientFields({ razorpayUrl });
    alert("Razorpay URL updated.");
  };

  // Knite Meet functions
  const addMeeting = async (e) => {
    e.preventDefault();
    if (!newMeetTopic || !newMeetTime) return;
    const cleanId = client.id.replace(/[^a-zA-Z0-9]/g, '');
    const finalLink = `https://meet.jit.si/KniteMeet-${cleanId}-${Date.now()}`;
    const meeting = {
      id: Date.now().toString(),
      topic: newMeetTopic,
      time: newMeetTime,
      duration: parseInt(newMeetDuration) || 30,
      link: finalLink
    };
    const updatedMeetings = [...(client.meetings || []), meeting];
    await saveClientFields({ meetings: updatedMeetings });
    setNewMeetTopic('');
    setNewMeetTime('');
    setNewMeetDuration(30);
  };

  const deleteMeeting = async (meetId) => {
    if (!window.confirm("Are you sure you want to delete this meeting?")) return;
    const updatedMeetings = (client.meetings || []).filter(m => m.id !== meetId);
    await saveClientFields({ meetings: updatedMeetings });
  };

  // Invoice functions
  const addInvoice = async (e) => {
    e.preventDefault();
    if (!newInvTitle || !newInvAmount) return;
    const invoice = {
      id: Date.now().toString(),
      title: newInvTitle,
      amount: newInvAmount,
      dueDate: newInvDueDate || 'On Receipt',
      status: 'unpaid',
      payUrl: ''
    };
    const updatedInvoices = [...(client.invoices || []), invoice];
    await saveClientFields({ invoices: updatedInvoices });
    setNewInvTitle('');
    setNewInvAmount('');
    setNewInvDueDate('');
    
  };

  const toggleInvoiceStatus = async (invId) => {
    const updatedInvoices = (client.invoices || []).map(inv => {
      if (inv.id === invId) {
        const isCurrentlyPaid = inv.status === 'paid';
        return { 
          ...inv, 
          status: isCurrentlyPaid ? 'unpaid' : 'paid',
          paidAt: isCurrentlyPaid ? null : new Date().toISOString(),
          paymentId: isCurrentlyPaid ? null : (inv.paymentId || 'manual_override')
        };
      }
      return inv;
    });
    await saveClientFields({ invoices: updatedInvoices });
  };

  const deleteInvoice = async (invId) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    const updatedInvoices = (client.invoices || []).filter(inv => inv.id !== invId);
    await saveClientFields({ invoices: updatedInvoices });
  };

  // Resource functions
  const addResource = async (e) => {
    e.preventDefault();
    if (!newResTitle || !newResUrl) return;
    const resource = {
      id: Date.now().toString(),
      title: newResTitle,
      url: newResUrl,
      type: newResType
    };
    const updatedResources = [...(client.resources || []), resource];
    await saveClientFields({ resources: updatedResources });
    setNewResTitle('');
    setNewResUrl('');
    setNewResType('figma');
  };

  const deleteResource = async (resId) => {
    if (!window.confirm("Are you sure you want to delete this resource link?")) return;
    const updatedResources = (client.resources || []).filter(r => r.id !== resId);
    await saveClientFields({ resources: updatedResources });
  };

  // Chat reply function
  const sendAdminReply = async (e) => {
    e.preventDefault();
    if (!adminReply.trim()) return;
    const msg = {
      id: Date.now().toString(),
      sender: 'admin',
      content: adminReply.trim(),
      timestamp: Date.now()
    };
    const updatedMessages = [...(client.messages || []), msg];
    await saveClientFields({ messages: updatedMessages });
    setAdminReply('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !client) return;
    setUploading(true);
    try {
      const fileRef = ref(storage, `chats/${client.id.toLowerCase()}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const msg = {
        id: Date.now().toString(),
        sender: 'admin',
        content: file.name,
        fileUrl: downloadUrl,
        fileName: file.name,
        fileType: file.type,
        timestamp: Date.now()
      };

      const updatedMessages = [...(client.messages || []), msg];
      await saveClientFields({ messages: updatedMessages });
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const deleteChatMessage = async (msgId, fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      if (fileUrl) {
        try {
          const fileRef = ref(storage, fileUrl);
          await deleteObject(fileRef);
        } catch (storageError) {
          console.error("Storage delete failed, proceeding to remove message:", storageError);
        }
      }
      const updatedMessages = (client.messages || []).filter(m => m.id !== msgId && m.timestamp !== msgId);
      await saveClientFields({ messages: updatedMessages });
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  const editChatMessage = async (msgId, newContent) => {
    if (!newContent.trim()) return;
    try {
      const updatedMessages = (client.messages || []).map(m => {
        if ((m.id === msgId || m.timestamp === msgId) && m.sender === 'admin') {
          return { ...m, content: newContent.trim(), edited: true };
        }
        return m;
      });
      await saveClientFields({ messages: updatedMessages });
      setEditingMessageId(null);
      setEditingText('');
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Failed to edit message.");
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans overflow-hidden">
      {viewingInvoice && (
        <InvoiceModal 
          invoice={viewingInvoice} 
          clientEmail={client.email} 
          onClose={() => setViewingInvoice(null)} 
        />
      )}

      {/* Full-height Left Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between flex-shrink-0 h-screen sticky top-0">
        <div className="p-6 flex flex-col gap-6">

          {/* Back to Dashboard Navigation */}
          <div>
            <button
              onClick={() => navigate('/admin')}
              className="w-full px-3.5 py-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 font-bold text-xs border border-slate-200 shadow-sm"
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
          </div>

          {/* Client Workspace Info */}
          <div className="border-b border-slate-100 pb-5">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Client Workspace</h2>
            <p className="text-sm font-extrabold text-slate-900 truncate" title={client.email}>{client.email}</p>

            <div className="mt-2.5 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${client.status === 'approved' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span className="text-xs font-bold text-slate-700 capitalize">{client.status}</span>
            </div>
          </div>

          {/* Sidebar Tab Options */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${activeTab === 'overview' ? 'bg-teal-50/70 text-[#16a3a4]' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <Info size={16} /> Overview
              </span>
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${activeTab === 'invoices' ? 'bg-teal-50/70 text-[#16a3a4]' : 'hover:bg-slate-50 text-slate-500 hover:text-slate-800'
                }`}
            >
              <span className="flex items-center gap-2.5">
                <CreditCard size={16} /> Invoices
              </span>
              {client.invoices?.length > 0 && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded-full">{client.invoices.length}</span>
              )}
            </button>
          </nav>
        </div>

        {/* System Settings Block inside Sidebar */}
        <div className="border-t border-slate-100 pt-5 mt-auto">
          <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-3 px-6">System Settings</h4>

          {/* Font Zoom Control */}
          <div className="mb-4 px-6 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Font Size</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFontZoom(prev => Math.max(80, prev - 10))}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold shadow-sm"
              >
                A-
              </button>
              <span className="text-[10px] font-semibold text-slate-700 w-8 text-center">{fontZoom}%</span>
              <button
                type="button"
                onClick={() => setFontZoom(prev => Math.min(150, prev + 10))}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[10px] font-bold shadow-sm"
              >
                A+
              </button>
            </div>
          </div>

          {/* Dark Theme Toggle for Chat */}
          <div className="px-6 pb-4">
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full py-2 px-3 border rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>
        </div>

        {/* Sidebar Bottom Controls */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          {client.status !== 'approved' ? (
            <button
              onClick={() => handleStatusChange('approved')}
              className="w-full bg-green-600 hover:bg-green-750 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 size={13} /> Approve Client
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('suspended')}
              className="w-full bg-white hover:bg-red-50 text-red-605 border border-slate-200 hover:border-red-200 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle size={13} /> Suspend Client
            </button>
          )}
        </div>
      </aside>

      {/* Right Side Scrollable Main Content */}
      <div className="flex-grow flex flex-col h-screen overflow-y-auto bg-[#f8fafc]">
        <main className="p-8 md:p-12 w-full max-w-5xl mx-auto flex flex-col flex-grow">

          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col flex-grow min-h-[500px]">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 flex flex-col flex-grow">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-extrabold text-slate-900">Overview</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Basic profile logs and internal admin notes</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
                  <div className="p-6 bg-[#f8fafc] border border-slate-200/60 rounded-2xl h-fit">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-teal-600" /> Client Profile Status
                    </h4>
                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between border-b border-slate-100 pb-3">
                        <span className="text-slate-400 font-semibold">Email Address</span>
                        <span className="font-semibold text-slate-900 font-mono">{client.email}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-3">
                        <span className="text-slate-400 font-semibold">Registration Status</span>
                        <span className={`font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[9px] ${client.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                          {client.status}
                        </span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-slate-400 font-semibold">Account Created</span>
                        <span className="font-semibold text-slate-900">
                          {client.createdAt ? new Date(client.createdAt.seconds * 1000).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Unknown'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-[#f8fafc] border border-slate-200/60 rounded-2xl flex flex-col justify-between h-full">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MessageSquare size={16} className="text-teal-600" /> Internal Admin Notes
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium mb-3">Save comments and private follow-up details on this profile.</p>
                      <textarea
                        value={clientNote}
                        onChange={(e) => setClientNote(e.target.value)}
                        placeholder="Type private notes only visible to administrators..."
                        className="w-full h-36 p-3 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-800 resize-none shadow-sm transition-all"
                      />
                    </div>
                    <button
                      onClick={saveNotes}
                      className="mt-4 w-full bg-[#16a3a4] hover:bg-[#16a3a4]/90 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md shadow-teal-600/10"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* INVOICES TAB */}
            {activeTab === 'invoices' && (
              <div className="space-y-8 flex flex-col flex-grow">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financials & Invoicing</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Manage billing, issue new invoices, and track payment history</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign size={18} className="text-teal-600" /> Invoice History
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        {client.invoices?.length || 0} Total
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {(!client.invoices || client.invoices.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-3xl bg-slate-50/80">
                          <CreditCard size={40} className="text-slate-300 mb-4" />
                          <p className="text-slate-500 text-sm font-bold">No invoices issued yet</p>
                          <p className="text-slate-400 text-xs mt-1 text-center px-6">Create your first invoice to the right to start billing this client.</p>
                        </div>
                      ) : (
                        client.invoices.map(inv => (
                          <div key={inv.id} className="p-5 bg-white border border-slate-200 hover:border-teal-600/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-1.5">
                                <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors">{inv.title}</h5>
                                <span className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest ${
                                  inv.status === 'paid' 
                                    ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200/50' 
                                    : 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200/50'
                                  }`}>
                                  {inv.status}
                                </span>
                              </div>

                              <div className="flex flex-col gap-1.5 mt-3">
                                <p className="text-xs text-slate-600 font-medium flex items-center gap-2">
                                  <span className="w-5 flex justify-center opacity-60">💰</span>
                                  <span className="font-bold text-slate-900">{inv.amount}</span> 
                                  <span className="text-slate-300 mx-1">|</span> 
                                  <span>Due: {inv.dueDate}</span>
                                </p>
                                
                                {inv.status === 'paid' && inv.paidAt && (
                                  <p className="text-[11px] text-green-600 font-medium flex items-center gap-2">
                                    <span className="w-5 flex justify-center opacity-60">✅</span>
                                    Paid on {new Date(inv.paidAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                  </p>
                                )}
                                
                                {inv.status === 'paid' && inv.paymentId && (
                                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2 font-mono">
                                    <span className="w-5 flex justify-center">#</span>
                                    {inv.paymentId}
                                  </p>
                                )}

                                {inv.payUrl && inv.status !== 'paid' && (
                                  <a href={inv.payUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#16a3a4] hover:text-teal-700 font-bold flex items-center gap-1.5 w-fit mt-1">
                                    <Link2 size={12} /> View External Payment Link
                                  </a>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex sm:flex-col gap-2 items-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 mt-2 sm:mt-0">
                              <div className="flex flex-col gap-2 w-full sm:w-auto">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setViewingInvoice(inv)}
                                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all text-center"
                                >
                                  View Invoice
                                </button>
                                <a
                                  href={`mailto:${client.email}?subject=Invoice%20from%20Knite%20Infotech%20-%20${inv.title}&body=Hello,%0A%0AAn%20invoice%20for%20${inv.amount}%20has%20been%20issued%20for%20${inv.title}.%0A%0APlease%20log%20into%20your%20Knite%20Infotech%20client%20portal%20to%20view%20and%20pay%20this%20invoice.%0A%0AThank%20you!`}
                                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all text-center flex items-center justify-center gap-1"
                                >
                                  <MessageSquare size={12} /> Email Client
                                </a>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleInvoiceStatus(inv.id)}
                                  className={`flex-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center ${
                                    inv.status === 'paid' 
                                    ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' 
                                    : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                                  }`}
                                >
                                  Mark {inv.status === 'paid' ? 'Unpaid' : 'Paid'}
                                </button>
                                <button 
                                  onClick={() => deleteInvoice(inv.id)} 
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                  title="Delete Invoice"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="p-8 bg-white border border-slate-200 rounded-3xl sticky top-0 shadow-sm shadow-slate-200/50">
                      <div className="mb-6">
                        <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 border border-teal-100">
                          <Plus size={24} className="text-teal-600" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900">Issue New Invoice</h4>
                        <p className="text-xs text-slate-500 mt-1">Bill this client for project phases, setup fees, or retainers.</p>
                      </div>

                      <form onSubmit={addInvoice} className="space-y-5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Item / Description</label>
                          <input
                            type="text"
                            required
                            value={newInvTitle}
                            onChange={(e) => setNewInvTitle(e.target.value)}
                            placeholder="e.g. Design System Phase 1"
                            className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Amount</label>
                            <input
                              type="text"
                              required
                              value={newInvAmount}
                              onChange={(e) => setNewInvAmount(e.target.value)}
                              placeholder="e.g. ₹5000"
                              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                            <input
                              type="text"
                              value={newInvDueDate}
                              onChange={(e) => setNewInvDueDate(e.target.value)}
                              placeholder="e.g. July 5, 2026"
                              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
                            />
                          </div>
                        </div>
                        
                        <button
                          type="submit"
                          className="w-full bg-[#16a3a4] hover:bg-teal-700 text-white text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 mt-2"
                        >
                          <Plus size={16} /> Issue Invoice
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminClientWorkspace;
