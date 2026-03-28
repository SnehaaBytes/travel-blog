// Add at the top with your other imports:
import aiRouter from "./routes/ai.js";

// Add after your app.use(express.json()) line:
app.use("/api/ai", aiRouter);

// server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Load env variables
dotenv.config();

// Models
import User from './models/User.js';
import Destination from './models/Destination.js';
import Message from './models/Message.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());

// Root route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Travel Blog API" });
});

// ========================
// MongoDB Connection
// ========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    initializeDestinations();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });


// ========================
// Seed Destinations
// ========================
async function initializeDestinations() {
  try {
    const count = await Destination.countDocuments();
    if (count === 0) {

      const destinations = [
        { title: 'Kashmir', description: 'Experience the Himalayas...', imgSrc: 'images/kashmir.jpg', isPopular: true },
        { title: 'Varanasi', description: 'Explore Kashi...', imgSrc: 'images/varanasi.jpg', isPopular: false },
        { title: 'Manali', description: 'Explore this trending destination...', imgSrc: 'images/manali.jpg', isPopular: false },
        { title: 'Vrindavan', description: 'Divine love...', imgSrc: 'images/mero_vrindavan.jpg', isPopular: false },
        { title: 'Spiti Valley', description: 'High-altitude desert in Himachal Pradesh', imgSrc: 'images/spiti.jpg', isPopular: false },
        { title: 'Landour', description: 'A serene hill station near Mussoorie', imgSrc: 'images/landour.jpg', isPopular: false },
        { title: 'Mussoorie', description: 'Queen of Hills with Himalayan views', imgSrc: 'images/mussoorie.jpg', isPopular: true },
        { title: 'Chopta', description: 'Mini Switzerland of India', imgSrc: 'images/chopta.jpg', isPopular: true },
        { title: 'Nainital', description: 'Lake town surrounded by hills', imgSrc: 'images/nainital.jpg', isPopular: true },
        { title: 'Ranikhet', description: 'Peaceful hill station with pine forests', imgSrc: 'images/ranikhet.jpg', isPopular: false },
        { title: 'Udaipur', description: 'City of lakes and palaces', imgSrc: 'images/udaipur.jpg', isPopular: true },
        { title: 'Mysore', description: 'Famous for its palace and culture', imgSrc: 'images/mysore.jpg', isPopular: false },
        { title: 'Darjeeling', description: 'Tea gardens and mountain views', imgSrc: 'images/darjeeling.jpg', isPopular: true },
        { title: 'Jaipur', description: 'The Pink City of Rajasthan', imgSrc: 'images/jaipur.jpg', isPopular: true },
        { title: 'Goa', description: 'Beaches and nightlife', imgSrc: 'images/goa.jpg', isPopular: true },
        { title: 'Rishikesh', description: 'Yoga and adventure capital', imgSrc: 'images/rishikesh.jpg', isPopular: false },
        { title: 'Andaman Islands', description: 'Tropical paradise with beaches', imgSrc: 'images/AndamanIslands.jpg', isPopular: true },
        { title: 'Hampi', description: 'UNESCO heritage ruins', imgSrc: 'images/hampi.jpg', isPopular: false },
        { title: 'Shimla', description: 'Colonial hill station', imgSrc: 'images/shimla.jpg', isPopular: true },
        { title: 'Leh-Ladakh', description: 'Adventure mountains destination', imgSrc: 'images/leh.jpg', isPopular: true },
        { title: 'Kerala Backwaters', description: 'Houseboats and lagoons', imgSrc: 'images/kerala.jpg', isPopular: true },
        { title: 'Shillong', description: 'Scotland of the East', imgSrc: 'images/shillong.jpg', isPopular: false },
        { title: 'Ranthambore', description: 'Tiger safari national park', imgSrc: 'images/ranthambore.jpg', isPopular: true },
        { title: 'Pondicherry', description: 'French colonial town', imgSrc: 'images/pondicherry.jpg', isPopular: false },
        { title: 'Coorg', description: 'Coffee hills and waterfalls', imgSrc: 'images/coorg.jpg', isPopular: true },
        { title: 'Agra', description: 'Home of the Taj Mahal', imgSrc: 'images/agra.jpg', isPopular: true },
        { title: 'Cherrapunji', description: 'Wettest place on Earth', imgSrc: 'images/cherrapunji.jpg', isPopular: false },
        { title: 'Daman and Diu', description: 'Portuguese coastal territory', imgSrc: 'images/daman.jpg', isPopular: false },
        { title: 'Ziro Valley', description: 'Arunachal scenic valley', imgSrc: 'images/ziro.jpg', isPopular: false },
      ];

      await Destination.insertMany(destinations);
      console.log('🌱 Destinations seeded successfully');
    }

  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
}


// ========================
// DESTINATION ROUTES
// ========================

// GET all destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const filter = req.query.type === 'popular' ? { isPopular: true } : {};
    const destinations = await Destination.find(filter);
    res.json(destinations);
  } catch {
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// GET single destination
app.get('/api/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ error: 'Not found' });
    res.json(destination);
  } catch {
    res.status(500).json({ error: 'Failed to fetch destination' });
  }
});

// CREATE destination
app.post('/api/destinations', async (req, res) => {
  try {
    const destination = new Destination(req.body);
    const saved = await destination.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Failed to create destination' });
  }
});

// UPDATE destination
app.put('/api/destinations/:id', async (req, res) => {
  try {

    const updated = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Destination not found" });

    res.json(updated);

  } catch {
    res.status(500).json({ error: "Failed to update destination" });
  }
});

// DELETE destination
app.delete('/api/destinations/:id', async (req, res) => {
  try {

    const deleted = await Destination.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: "Destination not found" });

    res.json({ message: "Destination deleted successfully" });

  } catch {
    res.status(500).json({ error: "Failed to delete destination" });
  }
});

// ========================
// BOOKINGS ROUTES
// ========================

// Booking Schema
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
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// CREATE booking
app.post('/api/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE booking (status etc.)
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// ========================
// AUTH ROUTES
// ========================

// REGISTER
app.post('/api/register', async (req, res) => {
  try {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Registered successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// LOGIN

app.post('/api/login', async (req, res) => {
  try {
    // 👉 We now expect `loginType` from the frontend
    const { username, password, loginType } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 👉 ADD ROLE VERIFICATION
    if (loginType === 'admin' && !user.isAdmin) {
      return res.status(403).json({ 
        message: 'Access denied. You are not an administrator.' 
      });
    }

    // Pass the role info back to the frontend
    res.json({ 
      message: 'Login successful', 
      username: user.username,
      isAdmin: user.isAdmin 
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ========================
// MESSAGES
// ========================
app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.status(201).json(message);
});

app.delete('/api/messages/:id', async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});


// ========================
// SERVER
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});