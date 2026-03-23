import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Schema (quick inline version)
const bookingSchema = new mongoose.Schema({
  name: String,
  destination: String,
  date: String,
  people: Number,
  status: {
    type: String,
    default: "pending"
  }
});

const Booking = mongoose.model("Booking", bookingSchema);

// GET all bookings
router.get("/", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

// POST create booking
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.json(newBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;