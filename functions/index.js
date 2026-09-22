const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Configure Nodemailer transporter (Use environment variables in production)
// E.g., setting up a Gmail App Password for kniteinfotech@gmail.com
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email?.user || "kniteinfotech@gmail.com",
    pass: functions.config().email?.pass || "your-app-password-here",
  },
});

// IMPORTANT: Before deploying, replace these placeholders with your actual Razorpay keys.
// In a production environment, you should use Firebase Environment config instead of hardcoding.
const RAZORPAY_KEY_ID = "rzp_live_TBMKGUSBeUHSVG ";
const RAZORPAY_KEY_SECRET = "2xYYQ3SBbdvStoBv4zx5uRBe";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated via Firebase Auth
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to create an order.');
  }

  const { amount, receipt } = data;

  if (!amount) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount is required');
  }

  try {
    const options = {
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    };
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new functions.https.HttpsError('internal', 'Unable to create order with Razorpay');
  }
});

exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to verify payment.');
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !invoiceId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing verification parameters.');
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is verified. Update the database securely from the backend.
    try {
      const userEmail = context.auth.token.email.toLowerCase();
      const userRef = db.collection('users').doc(userEmail);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User not found in database');
      }

      const userData = userDoc.data();
      const invoices = userData.invoices || [];
      
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoiceId ? { ...inv, status: 'paid', paymentId: razorpay_payment_id } : inv
      );

      await userRef.update({ invoices: updatedInvoices });

      // Send Invoice Payment Confirmation Email securely from backend
      try {
        const mailOptions = {
          from: '"KNITE INFOTECH" <kniteinfotech@gmail.com>',
          to: userEmail,
          subject: 'Payment Received - Invoice Paid',
          html: `<p>Hello,</p><p>We have successfully received your payment for Invoice <b>${invoiceId}</b>. Your portal and analytics have been unlocked.</p><p>Thank you for choosing KNITE INFOTECH.</p>`
        };
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Failed to send payment email:", emailError);
      }

      return { success: true, message: "Payment verified and invoice updated successfully" };
    } catch (error) {
      console.error("Database update failed:", error);
      throw new functions.https.HttpsError('internal', 'Payment verified but database update failed.');
    }
  } else {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid signature. Payment verification failed.');
  }
});

exports.onUserUpdated = functions.firestore
  .document('users/{emailId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    const emailId = context.params.emailId;

    // Check if status changed to approved
    if (previousValue.status !== 'approved' && newValue.status === 'approved') {
      try {
        const mailOptions = {
          from: '"KNITE INFOTECH" <kniteinfotech@gmail.com>',
          to: emailId,
          subject: 'Your Client Portal Access is Approved!',
          html: `<p>Hello!</p><p>Your request to access the KNITE INFOTECH Client Portal has been approved.</p><p>You can now log in using your registered email at <a href="https://kniteinfotech.in/portal">kniteinfotech.in/portal</a>.</p><p>Welcome aboard!</p>`
        };
        await transporter.sendMail(mailOptions);
        console.log(`Approval email sent to ${emailId}`);
      } catch (error) {
        console.error("Failed to send approval email:", error);
      }
    }
  });
