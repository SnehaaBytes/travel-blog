import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// 1. Submit a new review from the Home Page (Status defaults to Pending)
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error saving review", error: error.message });
  }
});

// 2. ONLY fetch APPROVED reviews for the public Reviews Community Page
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
});

// --- ADMIN PANEL ROUTES ---

// 3. Admin gets ALL reviews (Pending, Approved, Rejected)
router.get('/admin', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

// 4. Admin updates the status (Approve or Reject)
router.put('/:id/status', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
        req.params.id, 
        { status: req.body.status }, 
        { new: true }
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
});

// 5. Admin completely Deletes the review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: "Error deleting", error: error.message });
  }
});

export default router;
