const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add getFunctions import
if (!content.includes('getFunctions')) {
  content = content.replace(
    'import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, getDocs } from "firebase/firestore";',
    'import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc, collection, getDocs } from "firebase/firestore";\nimport { getFunctions, httpsCallable } from "firebase/functions";'
  );
}

// Initialize functions
if (!content.includes('const functions = getFunctions(app);')) {
  content = content.replace(
    'const db = getFirestore(app);',
    'const db = getFirestore(app);\nconst functions = getFunctions(app);'
  );
}

const oldHandlerRegex = /const handleRazorpayCheckout = \(inv\) => \{[\s\S]*?if \(window\.Razorpay\) \{[\s\S]*?rzp\.open\(\);\s*\} else \{[\s\S]*?alert\("Razorpay SDK failed to load. Please check your internet connection."\);\s*\}\s*\};/;

const newHandler = `const handleRazorpayCheckout = async (inv) => {
    const numericAmount = parseFloat(inv.amount.replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount)) {
      alert("Invalid invoice amount.");
      return;
    }

    try {
      const createOrder = httpsCallable(functions, 'createRazorpayOrder');
      const orderRes = await createOrder({ 
        amount: numericAmount * 100,
        receipt: \`rcpt_\${inv.id}\`
      });
      const orderData = orderRes.data;

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual public key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Knite Infotech',
        description: inv.title,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyPayment = httpsCallable(functions, 'verifyPayment');
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: inv.id
            });

            if (verifyRes.data.success) {
              // Note: the backend already updated Firestore, but we can force a local refresh or trust the onSnapshot to catch it.
              // We'll update local dbUser state explicitly just in case to show immediate UI feedback.
              const updatedInvoices = dbUser.invoices.map(i => 
                i.id === inv.id ? { ...i, status: 'paid', paymentId: response.razorpay_payment_id } : i
              );
              setDbUser({ ...dbUser, invoices: updatedInvoices });
              alert("Payment Successful! Your invoice has been marked as paid.\\nPayment ID: " + response.razorpay_payment_id);
            }
          } catch (error) {
            console.error("Signature verification failed", error);
            alert("Payment completed but verification failed. Please contact admin.");
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

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
      }
    } catch (error) {
      console.error("Order creation failed", error);
      alert("Failed to initiate secure checkout. Please try again later.");
    }
  };`;

content = content.replace(oldHandlerRegex, newHandler);

fs.writeFileSync(filePath, content, 'utf8');

const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Setup `functions` directory and package.json.', '- `[x]` Setup `functions` directory and package.json.');
taskContent = taskContent.replace('- `[ ]` Write Node.js backend logic in `functions/index.js` (Razorpay Order & Verification).', '- `[x]` Write Node.js backend logic in `functions/index.js` (Razorpay Order & Verification).');
taskContent = taskContent.replace('- `[ ]` Update `firebase.json` configuration.', '- `[x]` Update `firebase.json` configuration.');
taskContent = taskContent.replace('- `[ ]` Update `ClientPortal.jsx` to call Firebase cloud functions.', '- `[x]` Update `ClientPortal.jsx` to call Firebase cloud functions.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');

console.log("Client Portal updated for backend calls");
