import mongoose from 'mongoose';
import Destination from './Destination.js'; // make sure the path is correct

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Detailed destination data
const destinations = [
  {
    title: "Goa",
    description: "Famous for beaches, nightlife, and Portuguese heritage.",
    imgSrc: "https://images.unsplash.com/photo-1579900197800-1a9e9d364eae",
    isPopular: true,
    location: "Goa",
    bestTimeToVisit: "November to February",
    activities: ["Beach Hopping", "Water Sports", "Night Markets"],
    tips: "Rent a scooter to explore the coast.",
    mapLink: "https://goo.gl/maps/...",
    budgetPlan: { low: "₹2000/day", medium: "₹5000/day", high: "₹12000/day" },
    itinerary: ["Day 1: North Goa beaches", "Day 2: South Goa relax & culture", "Day 3: Water sports & night market"]
  },
  {
    title: "Manali",
    description: "Hill station in Himachal Pradesh surrounded by snow-capped mountains.",
    imgSrc: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
    isPopular: true,
    location: "Himachal Pradesh",
    bestTimeToVisit: "March to June",
    activities: ["Trekking", "Skiing", "Paragliding"],
    tips: "Book hotels in advance during peak season.",
    mapLink: "https://goo.gl/maps/...",
    budgetPlan: { low: "₹2000/day", medium: "₹5000/day", high: "₹10000/day" },
    itinerary: ["Day 1: Solang Valley", "Day 2: Rohtang Pass", "Day 3: Old Manali"]
  },
  {
    title: "Kashmir",
    description: "Known as 'Paradise on Earth', located in northern India.",
    imgSrc: "https://images.unsplash.com/photo-1598121054206-3b5db1e1f9f1",
    isPopular: true,
    location: "Jammu & Kashmir",
    bestTimeToVisit: "April to October",
    activities: ["Boating", "Skiing", "Photography"],
    tips: "Carry warm clothes even in summers.",
    mapLink: "https://goo.gl/maps/...",
    budgetPlan: { low: "₹2000/day", medium: "₹5000/day", high: "₹10000/day" },
    itinerary: ["Day 1: Srinagar sightseeing", "Day 2: Gulmarg skiing", "Day 3: Pahalgam trek"]
  }
  // Add the rest of your destinations here in the same format
];

// Seed function
const seedDB = async () => {
  try {
    await Destination.deleteMany({});
    await Destination.insertMany(destinations);
    console.log('Destinations seeded successfully!');
  } catch (err) {
    console.error('Error seeding destinations:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
