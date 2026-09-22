import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Mail, ShieldCheck, CheckCircle2, LogOut, CreditCard, ChevronRight, Paperclip, Trash2, Smile, Edit2, Check, X, Users, ExternalLink, Search, Eye, Info, Video, Link2, MessageSquare } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, getDocs } from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// V2 Components
import ClientDashboard from '../components/portal/ClientDashboard';
import ProjectKanban from '../components/portal/ProjectKanban';
import DocumentCenter from '../components/portal/DocumentCenter';
import SupportTickets from '../components/portal/SupportTickets';
import ActivityFeed from '../components/portal/ActivityFeed';
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

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

export default function ClientPortal() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('info'); // info, success, error
  const [clientMessage, setClientMessage] = useState('');
  const [activeMeeting, setActiveMeeting] = useState(null);

  // Forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ msg: '', type: '' });
  const [forgotLoading, setForgotLoading] = useState(false);

  // Client workspace tabs
  const [activeTab, setActiveTab] = useState('overview');

  // Admin view in client portal
  const [adminClients, setAdminClients] = useState([]);
  const [adminClientsLoading, setAdminClientsLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const ADMIN_EMAIL = 'kniteinfotech@gmail.com';

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch approval status from Firestore
        const userDocRef = doc(db, "users", currentUser.email.toLowerCase());
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDbUser(userData);
          if (userData.status === 'rejected') {
            setStatusMessage('This account has been disabled or rejected. Please contact support.');
            setStatusType('error');
            // Log out user since they are rejected
            signOut(auth);
            setUser(null);
            setDbUser(null);
          }
        } else {
          // If auth exists but no Firestore doc, default it to pending
          const pendingData = { email: currentUser.email.toLowerCase(), status: 'pending' };
          setDbUser(pendingData);
        }
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Knite Meet is managed on a dedicated standalone page (/meet)

  // 2. Handle Login / Registration request
  const handleAuthRequest = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setStatusMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const userDocRef = doc(db, "users", cleanEmail);

    try {
      if (isRegistering) {
        // REGISTER FLOW

        // 1. Create user in Firebase Auth
        await createUserWithEmailAndPassword(auth, cleanEmail, password);

        // 2. Create pending user doc in Firestore
        await setDoc(userDocRef, {
          email: cleanEmail,
          status: 'pending',
          createdAt: serverTimestamp()
        });

        // 3. Notify Admin via FormSubmit
        await fetch("https://formsubmit.co/ajax/kniteinfotech@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name: "Portal System",
            email: cleanEmail,
            message: `A new client has registered and is requesting access to the Billing Portal. 
Email: ${cleanEmail}

Please approve this registration on your Admin Dashboard under Awaiting Approval.`,
            _subject: `New Client Portal Registration: ${cleanEmail}`,
            _captcha: "false"
          })
        }).catch(err => console.warn("Admin notification bypassed: ", err));

        setStatusMessage('Registration request submitted! Please wait for admin approval.');
        setStatusType('success');
        setLoading(false);
      } else {
        // LOGIN FLOW
        // Authenticate user
        await signInWithEmailAndPassword(auth, cleanEmail, password);
        
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          await signOut(auth);
          setStatusMessage('No client profile found. Please register first.');
          setStatusType('error');
          setLoading(false);
          return;
        }

        const userData = userDoc.data();
        if (userData.status === 'rejected') {
          await signOut(auth);
          setStatusMessage('This account has been disabled or rejected. Please contact support.');
          setStatusType('error');
          setLoading(false);
          return;
        }

        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        setStatusMessage('Invalid email address or password.');
      } else if (error.code === 'auth/email-already-in-use') {
        setStatusMessage('This email is already registered.');
      } else if (error.code === 'auth/weak-password') {
        setStatusMessage('Password should be at least 6 characters.');
      } else {
        setStatusMessage(`An error occurred: ${error.message || 'Please try again.'}`);
      }
      setStatusType('error');
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setForgotStatus({ msg: '', type: '' });
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim().toLowerCase());
      setForgotStatus({ msg: 'Password reset email sent! Check your inbox.', type: 'success' });
      setForgotEmail('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setForgotStatus({ msg: 'No account found with this email.', type: 'error' });
      } else {
        setForgotStatus({ msg: 'Failed to send reset email. Try again.', type: 'error' });
      }
    }
    setForgotLoading(false);
  };

  // Fetch all clients when admin is logged in to portal
  useEffect(() => {
    if (!user || user.email.toLowerCase() !== ADMIN_EMAIL) return;
    setAdminClientsLoading(true);
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const clientsList = [];
        querySnapshot.forEach((doc) => {
          if (doc.id.toLowerCase() !== ADMIN_EMAIL) {
            clientsList.push({ id: doc.id, ...doc.data() });
          }
        });
        setAdminClients(clientsList);
      } catch (err) {
        console.error("Error fetching clients for admin view:", err);
      }
      setAdminClientsLoading(false);
    };
    fetchClients();
  }, [user]);

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

  // 3. Send Client Support Message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!clientMessage.trim() || !user) return;
    try {
      const userDocRef = doc(db, "users", user.email.toLowerCase());
      const msg = {
        id: Date.now().toString(),
        sender: 'client',
        content: clientMessage.trim(),
        timestamp: Date.now()
      };
      const updatedMessages = [...(dbUser.messages || []), msg];
      await setDoc(userDocRef, { messages: updatedMessages }, { merge: true });
      setDbUser(prev => ({ ...prev, messages: updatedMessages }));
      setClientMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileRef = ref(storage, `chats/${user.email.toLowerCase()}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const userDocRef = doc(db, "users", user.email.toLowerCase());
      const msg = {
        id: Date.now().toString(),
        sender: 'client',
        content: file.name,
        fileUrl: downloadUrl,
        fileName: file.name,
        fileType: file.type,
        timestamp: Date.now()
      };

      const updatedMessages = [...(dbUser.messages || []), msg];
      await setDoc(userDocRef, { messages: updatedMessages }, { merge: true });
      setDbUser(prev => ({ ...prev, messages: updatedMessages }));
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
      const userDocRef = doc(db, "users", user.email.toLowerCase());
      const updatedMessages = (dbUser.messages || []).filter(m => m.id !== msgId && m.timestamp !== msgId);
      await setDoc(userDocRef, { messages: updatedMessages }, { merge: true });
      setDbUser(prev => ({ ...prev, messages: updatedMessages }));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message.");
    }
  };

  const editChatMessage = async (msgId, newContent) => {
    if (!newContent.trim()) return;
    try {
      const userDocRef = doc(db, "users", user.email.toLowerCase());
      const updatedMessages = (dbUser.messages || []).map(m => {
        if ((m.id === msgId || m.timestamp === msgId) && m.sender === 'client') {
          return { ...m, content: newContent.trim(), edited: true };
        }
        return m;
      });
      await setDoc(userDocRef, { messages: updatedMessages }, { merge: true });
      setDbUser(prev => ({ ...prev, messages: updatedMessages }));
      setEditingMessageId(null);
      setEditingText('');
    } catch (error) {
      console.error("Error editing message:", error);
      alert("Failed to edit message.");
    }
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontZoom}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [fontZoom]);


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayCheckout = async (inv) => {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      alert("Razorpay SDK failed to load. Please disable any adblockers (like Brave Shields or uBlock) and check your internet connection.");
      return;
    }

    const numericAmount = parseFloat(inv.amount.replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount)) {
      alert("Invalid invoice amount.");
      return;
    }

    const options = {
      key: 'rzp_live_TBMKGUSBeUHSVG', // Your actual public key ID
      amount: numericAmount * 100,
      currency: 'INR',
      name: 'Knite Infotech',
      description: inv.title,
      handler: async function (response) {
        try {
          const userRef = doc(db, 'users', user.email.toLowerCase());
          const updatedInvoices = dbUser.invoices.map(i => 
            i.id === inv.id ? { ...i, status: 'paid', paymentId: response.razorpay_payment_id, paidAt: new Date().toISOString() } : i
          );
          await updateDoc(userRef, { invoices: updatedInvoices });
          // Update local state to show UI change immediately
          setDbUser({ ...dbUser, invoices: updatedInvoices });
          alert("Payment Successful! Your invoice has been marked as paid.\nPayment ID: " + response.razorpay_payment_id);
        } catch (error) {
          console.error("Error updating invoice status", error);
          alert("Payment successful but failed to update invoice status. Please contact admin.");
        }
      },
      prefill: {
        email: user.email,
        contact: dbUser?.phone || ''
      },
      theme: {
        color: '#16a3a4'
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error initializing Razorpay. Please refresh the page and try again.");
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setDbUser(null);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden relative flex flex-col justify-between selection:bg-[#16a3a4]/20 selection:text-[#16a3a4]">
      <Helmet>
        <title>Client Portal - KNITE INFOTECH</title>
        <meta name="description" content="Secure portal for our clients to track project progress, manage invoices, and collaborate with our engineering team." />
        <link rel="canonical" href="https://kniteinfotech.in/portal" />
      </Helmet>
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(22,163,164,0.05),transparent_60%)] pointer-events-none"></div>

      {/* Header */}
      <header className={`max-w-7xl mx-auto px-6 w-full relative z-10 flex justify-between items-center ${user && dbUser?.status === 'approved' ? 'py-4 border-b border-slate-100 bg-white' : 'pt-10'}`}>
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-950 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm tracking-wider uppercase">Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="KNITE Logo" className="w-8 h-8 object-contain opacity-80" />
          <span className="font-bold tracking-widest text-xs text-slate-500 uppercase">Billing Portal</span>
        </div>
      </header>

      {/* Main Body */}
      <main className={`w-full relative z-10 flex-grow flex ${user && dbUser?.status === 'approved' ? '' : 'max-w-6xl mx-auto px-6 py-20 items-center justify-center'}`}>
        <div className={`w-full ${user && dbUser?.status === 'approved' ? 'bg-white min-h-[calc(100vh-80px)] flex flex-col' : 'max-w-md bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-100 relative overflow-hidden transition-all duration-300'}`}>
          {(!user || dbUser?.status !== 'approved') && <div className="absolute top-0 right-0 w-64 h-64 bg-[#16a3a4]/5 blur-3xl rounded-full pointer-events-none"></div>}

          {loading || (user && !dbUser) ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-t-[#16a3a4] border-slate-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 text-sm">Processing verification...</p>
            </div>
          ) : !user ? (
            /* Login & Request Card */
            <div>
              <div className="flex border-b border-slate-150 mb-6">
                <button
                  onClick={() => { setIsRegistering(false); setStatusMessage(''); }}
                  className={`flex-1 pb-3 text-center text-sm font-bold transition-colors ${!isRegistering ? 'text-[#16a3a4] border-b-2 border-[#16a3a4]' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsRegistering(true); setStatusMessage(''); }}
                  className={`flex-1 pb-3 text-center text-sm font-bold transition-colors ${isRegistering ? 'text-[#16a3a4] border-b-2 border-[#16a3a4]' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  Register
                </button>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight mb-2 text-slate-900">
                {isRegistering ? 'Create Client Profile' : 'Client Portal'}
              </h2>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                {isRegistering
                  ? 'Request access by creating a client profile. Once approved, you can log in to manage your payments.'
                  : 'Enter your credentials to access your billing portal dashboard.'}
              </p>

              {statusMessage && (
                <div className={`p-4 rounded-xl text-sm mb-6 ${statusType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                    statusType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                      'bg-cyan-50 text-cyan-700 border border-cyan-200'
                  }`}>
                  {statusMessage}
                </div>
              )}

              <form onSubmit={handleAuthRequest} className="space-y-4">
                <div>
                  <label className="block text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#16a3a4] focus:bg-white transition-colors text-sm"
                  />
                </div>
                {!isRegistering && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(!showForgotPassword);
                        setForgotStatus({ msg: '', type: '' });
                      }}
                      className="text-xs text-[#16a3a4] hover:underline font-semibold"
                    >
                      {showForgotPassword ? 'Back to Sign In' : 'Forgot Password?'}
                    </button>
                  </div>
                )}

                {showForgotPassword && !isRegistering ? (
                  <div className="p-5 border rounded-2xl bg-slate-50 mt-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Reset Password</h5>
                    <p className="text-[11px] text-slate-500 leading-normal">Enter your email address and we'll send you a secure link to reset your password.</p>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:outline-none focus:border-[#16a3a4] text-xs transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={forgotLoading}
                      className="w-full bg-[#16a3a4] hover:bg-[#16a3a4]/80 text-white font-bold py-2.5 rounded-xl transition-all text-xs flex justify-center items-center gap-2"
                    >
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    {forgotStatus.msg && (
                      <p className={`text-[10px] font-bold ${forgotStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                        {forgotStatus.msg}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-slate-500 text-xs font-bold tracking-wider uppercase mb-2">Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#16a3a4] focus:bg-white transition-colors text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-[#16a3a4] hover:bg-[#16a3a4]/80 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 text-sm shadow-lg shadow-[#16a3a4]/10"
                    >
                      {isRegistering ? 'Submit Registration Request' : 'Sign In to Portal'} <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </form>
            </div>
          ) : (
            /* Dashboard Card */
            <div>
              {dbUser?.status === 'pending' ? (
                /* Pending Approval Panel */
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-yellow-500/10 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pending Approval</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8">
                    Hello <span className="text-slate-900 font-semibold">{user.email}</span>. Your portal access request has been sent for approval. You will receive an email once the administrators activate your client profile.
                  </p>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold text-sm"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              ) : (
                /* Approved Client Relationship Dashboard */
                <div className="flex flex-col md:flex-row flex-grow bg-slate-50/50 border-t border-slate-150 overflow-hidden">
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
                        { id: 'projects', icon: <Sparkles size={16} />, label: 'Projects' },
                        { id: 'invoices', icon: <CreditCard size={16} />, label: 'Invoices' },
                        { id: 'meetings', icon: <Video size={16} />, label: 'Knite Meet' },
                        { id: 'resources', icon: <Link2 size={16} />, label: 'Resources & Docs' },
                        { id: 'support', icon: <MessageSquare size={16} />, label: 'Support & Chat' },
                        { id: 'activity', icon: <Info size={16} />, label: 'Activity Feed' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                              ? 'bg-[#16a3a4] text-white shadow-md shadow-[#16a3a4]/20'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
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
                  <div className="flex-1 px-6 md:px-10 py-8 flex flex-col flex-grow overflow-y-auto hide-scrollbar relative">
                    {/* Header for Mobile */}
                    <div className="flex justify-between items-center mb-6 md:hidden">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-bold tracking-wider uppercase">
                        <CheckCircle2 size={12} /> Approved
                      </div>
                      <button onClick={handleLogout} className="text-slate-500 p-2"><LogOut size={16}/></button>
                    </div>

                    {/* Content Switcher */}
                    {activeTab === 'overview' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ClientDashboard client={dbUser} />
                      </div>
                    )}
                    
                    {activeTab === 'projects' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-6">
                          <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Project Board</h4>
                          <p className="text-sm text-slate-500">Track progress of your ongoing projects.</p>
                        </div>
                        <ProjectKanban tasks={dbUser?.tasks || []} />
                      </div>
                    )}

                    {activeTab === 'activity' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-6">
                          <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Activity Feed</h4>
                          <p className="text-sm text-slate-500">Recent updates from your workspace.</p>
                        </div>
                        <ActivityFeed activities={dbUser?.activityFeed || []} />
                      </div>
                    )}

                    {activeTab === 'support' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-6">
                          <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Support Center</h4>
                          <p className="text-sm text-slate-500">Manage your tickets and messages.</p>
                        </div>
                        <SupportTickets tickets={dbUser?.tickets || []} />
                      </div>
                    )}

                    {activeTab === 'resources' && (
                      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-6">
                          <h4 className="text-2xl font-extrabold text-slate-900 mb-1">Document Center</h4>
                          <p className="text-sm text-slate-500">Securely access your files and resources.</p>
                        </div>
                        <DocumentCenter documents={dbUser?.documents || []} />
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
                                  <span className={`inline-block mt-3 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {inv.status}
                                  </span>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto gap-4 sm:gap-3">
                                  <span className="font-extrabold text-2xl text-slate-900">{inv.amount}</span>
                                  {inv.status === 'unpaid' && (
                                    <button
                                      onClick={() => handleRazorpayCheckout(inv)}
                                      className="px-6 py-3 bg-[#16a3a4] hover:bg-[#16a3a4]/85 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-[#16a3a4]/20"
                                    >
                                      Pay Now <ChevronRight size={16} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                          <span className="text-slate-500 font-semibold">Need to manage cards or recurring payments?</span>
                          {dbUser.razorpayUrl ? (
                            <a
                              href={dbUser.razorpayUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm"
                            > Razorpay Portal <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">Portal link not configured</span>
                          )}
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
                                  onClick={() => navigate(`/meet?room=${meet.link.split('/').pop()}&name=${encodeURIComponent(dbUser?.name || dbUser?.email || 'Knite Client')}&role=client`)}
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
      </main>

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
