const fs = require('fs');
const filePath = '/Users/nnitheesh/Documents/KNITE INFOTECH/knite website/src/pages/ClientPortal.jsx';
let content = fs.readFileSync(filePath, 'utf8');

const rzpHandler = `
  const handleRazorpayCheckout = (inv) => {
    const numericAmount = parseFloat(inv.amount.replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount)) {
      alert("Invalid invoice amount.");
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual public key ID
      amount: numericAmount * 100,
      currency: 'INR',
      name: 'Knite Infotech',
      description: inv.title,
      handler: async function (response) {
        try {
          const userRef = doc(db, 'users', user.email.toLowerCase());
          const updatedInvoices = dbUser.invoices.map(i => 
            i.id === inv.id ? { ...i, status: 'paid' } : i
          );
          await updateDoc(userRef, { invoices: updatedInvoices });
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
  };

  const handleLogout = () => {`;

content = content.replace("  const handleLogout = () => {", rzpHandler);

const oldButton = `{inv.status === 'unpaid' && inv.payUrl && (
                                    <a
                                      href={inv.payUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-6 py-3 bg-[#16a3a4] hover:bg-[#16a3a4]/85 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-[#16a3a4]/20"
                                    >
                                      Pay Now <ChevronRight size={16} />
                                    </a>
                                  )}`;
                                  
// It's possible payUrl check might break if we remove it, let's just make it show when unpaid.
const newButton = `{inv.status === 'unpaid' && (
                                    <button
                                      onClick={() => handleRazorpayCheckout(inv)}
                                      className="px-6 py-3 bg-[#16a3a4] hover:bg-[#16a3a4]/85 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-md shadow-[#16a3a4]/20"
                                    >
                                      Pay Now <ChevronRight size={16} />
                                    </button>
                                  )}`;

content = content.replace(oldButton, newButton);

fs.writeFileSync(filePath, content, 'utf8');

const taskFilePath = '/Users/nnitheesh/.gemini/antigravity-ide/brain/c7dea808-f667-4bfc-8502-fa7936535c75/task.md';
let taskContent = fs.readFileSync(taskFilePath, 'utf8');
taskContent = taskContent.replace('- `[ ]` Implement `handleRazorpayCheckout` function in `ClientPortal.jsx`.', '- `[x]` Implement `handleRazorpayCheckout` function in `ClientPortal.jsx`.');
taskContent = taskContent.replace('- `[ ]` Update "Pay Now" button in `ClientPortal.jsx` to trigger checkout.', '- `[x]` Update "Pay Now" button in `ClientPortal.jsx` to trigger checkout.');
taskContent = taskContent.replace('- `[ ]` Auto-update invoice status to "paid" upon successful checkout.', '- `[x]` Auto-update invoice status to "paid" upon successful checkout.');
fs.writeFileSync(taskFilePath, taskContent, 'utf8');

console.log("Client Portal updated");
