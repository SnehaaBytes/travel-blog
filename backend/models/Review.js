import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  blogUrl: { type: String, default: "" },
  // Important: By default, reviews will be 'pending' so they won't show up until you approve them
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Review', reviewSchema);
