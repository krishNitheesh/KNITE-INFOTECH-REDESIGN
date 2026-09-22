const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove getFunctions import
content = content.replace('import { getFunctions, httpsCallable } from "firebase/functions";', '');

// Remove functions init
content = content.replace('const functions = getFunctions(app);\n', '');
content = content.replace('const functions = getFunctions(app);', '');

// Replace newHandler with the old frontend-only handler
const backendHandlerRegex = /const handleRazorpayCheckout = async \(inv\) => \{[\s\S]*?if \(window\.Razorpay\) \{[\s\S]*?rzp\.open\(\);\s*\} else \{[\s\S]*?alert\("Razorpay SDK failed to load. Please check your internet connection."\);\s*\}\s*\} catch \(error\) \{[\s\S]*?\}\s*\};/;

const frontendHandler = `const handleRazorpayCheckout = (inv) => {
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
            i.id === inv.id ? { ...i, status: 'paid', paymentId: response.razorpay_payment_id } : i
          );
          await updateDoc(userRef, { invoices: updatedInvoices });
          // Update local state to show UI change immediately
          setDbUser({ ...dbUser, invoices: updatedInvoices });
          alert("Payment Successful! Your invoice has been marked as paid.\\nPayment ID: " + response.razorpay_payment_id);
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

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
    }
  };`;

content = content.replace(backendHandlerRegex, frontendHandler);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Client Portal reverted");
