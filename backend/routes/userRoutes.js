const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { verifyToken } = require('../middleware/authMiddleware');

// Get User Dashboard Data (SHOW ALL VERSION)
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id; 
    
    // Fetch the user to get their favorites
    const userDoc = await User.findById(userId).populate('favorites');
    
    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 👉 Review.find({}) fetches EVERY review in the entire database!
    const [bookings, reviews] = await Promise.all([
      Booking.find({ user: userId }).populate('destination'),
      Review.find({}) 
    ]);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        reviews, // Sends all reviews to the frontend!
        favorites: userDoc.favorites || []
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Create the Protected Route
router.get('/dashboard', verifyToken, getDashboardData);

module.exports = router;
