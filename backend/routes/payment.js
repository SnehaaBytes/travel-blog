import 'dotenv/config';
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/create-order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: "Amount and bookingId are required" });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise (₹1 = 100 paise)
      currency,
      receipt: `receipt_${bookingId}`.slice(0, 40),
      notes: { bookingId },
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Failed to create payment order" });
  }
});

// POST /api/payment/verify
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, error: "Invalid payment signature" });
    }

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("Payment verification failed:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;