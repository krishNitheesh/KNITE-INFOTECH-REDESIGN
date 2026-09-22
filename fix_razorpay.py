import re

with open('src/pages/ClientPortal.jsx', 'r') as f:
    content = f.read()

replacement = """  const loadRazorpay = () => {
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
    }"""

content = re.sub(r'  const handleRazorpayCheckout = \(inv\) => \{\n    const numericAmount = parseFloat\(inv.amount.replace\(/\[\^0-9\.\]/g, \'\'\)\);\n    if \(isNaN\(numericAmount\)\) \{\n      alert\("Invalid invoice amount."\);\n      return;\n    \}', replacement, content)

# Also update the fallback check later in the function to be safe
content = content.replace("""    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert("Razorpay SDK failed to load. Please check your internet connection.");
    }""", """    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error initializing Razorpay. Please refresh the page and try again.");
    }""")

with open('src/pages/ClientPortal.jsx', 'w') as f:
    f.write(content)

