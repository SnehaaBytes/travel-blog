import mongoose from 'mongoose';

const agencySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    logoUrl: { type: String, default: "https://via.placeholder.com/150" },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model('Agency', agencySchema);
