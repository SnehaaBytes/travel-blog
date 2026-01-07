import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  title: String,
  description: String,
  imgSrc: String,
  isPopular: Boolean,
  location: String,
  bestTimeToVisit: String,
  activities: [String],
  tips: String,
  mapLink: String,
  budgetPlan: {
    low: String,
    medium: String,
    high: String,
  },
  itinerary: [String],
});

export default mongoose.model("Destination", destinationSchema);

