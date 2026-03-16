import mongoose from 'mongoose';
import Destination from './models/Destination.js';
import dotenv from 'dotenv';
dotenv.config();

const destinations = [
  {
    title: 'Kashmir',
    description: 'Known as Paradise on Earth, with breathtaking landscapes and vibrant culture.',
    imgSrc: 'kashmir.jpg',
    isPopular: true,
    location: 'Jammu & Kashmir',
    bestTimeToVisit: 'April to October',
    activities: ['Boating', 'Skiing', 'Photography'],
    tips: 'Carry warm clothes even in summers.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹5000/day', high: '₹10000/day' },
    itinerary: ['Day 1: Srinagar sightseeing', 'Day 2: Gulmarg skiing', 'Day 3: Pahalgam trek']
  },
  {
    title: 'Varanasi',
    description: 'A spiritual city on the banks of the Ganges River, famous for rituals and temples.',
    imgSrc: 'varanasi.jpg',
    isPopular: true,
    location: 'Uttar Pradesh',
    bestTimeToVisit: 'October to March',
    activities: ['Ganga Aarti', 'Temple Visits', 'Boat Ride'],
    tips: 'Respect local customs and traditions.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹8000/day' },
    itinerary: ['Day 1: Boat ride & Aarti', 'Day 2: Kashi Vishwanath & markets', 'Day 3: Sarnath trip']
  },
  {
    title: 'Manali',
    description: 'A beautiful hill station with scenic valleys and adventure activities.',
    imgSrc: 'manali.jpg',
    isPopular: true,
    location: 'Himachal Pradesh',
    bestTimeToVisit: 'March to June',
    activities: ['Trekking', 'Skiing', 'Paragliding'],
    tips: 'Book hotels in advance during peak season.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹5000/day', high: '₹10000/day' },
    itinerary: ['Day 1: Solang Valley', 'Day 2: Rohtang Pass', 'Day 3: Old Manali']
  },
  {
    title: 'Vrindavan',
    description: 'A holy city associated with Lord Krishna, with colorful temples.',
    imgSrc: 'mero_vrindavan.jpg',
    isPopular: true,
    location: 'Uttar Pradesh',
    bestTimeToVisit: 'October to March',
    activities: ['Temple Visits', 'Cultural Walks', 'Festivals'],
    tips: 'Visit during festivals for vibrant experience.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1000/day', medium: '₹3000/day', high: '₹6000/day' },
    itinerary: ['Day 1: Banke Bihari temple', 'Day 2: ISKCON temple & local markets', 'Day 3: Cultural walk']
  },
  {
    title: 'Jaipur',
    description: 'The Pink City, rich in history and culture with palaces and forts.',
    imgSrc: 'jaipur.jpg',
    isPopular: true,
    location: 'Rajasthan',
    bestTimeToVisit: 'October to March',
    activities: ['Palace Tours', 'Shopping', 'Elephant Rides'],
    tips: 'Hire a guide for historical insights.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: City Palace & Jantar Mantar', 'Day 2: Amber Fort & elephant ride', 'Day 3: Local bazaars']
  },
  {
    title: 'Goa',
    description: 'Famous for beaches, nightlife, and Portuguese heritage.',
    imgSrc: 'goa.jpg',
    isPopular: true,
    location: 'Goa',
    bestTimeToVisit: 'November to February',
    activities: ['Beach Hopping', 'Water Sports', 'Night Markets'],
    tips: 'Rent a scooter to explore the coast.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹5000/day', high: '₹12000/day' },
    itinerary: ['Day 1: North Goa beaches', 'Day 2: South Goa relax & culture', 'Day 3: Water sports & night market']
  },
  {
    title: 'Rishikesh',
    description: 'Yoga capital of the world and adventure hub by the Ganges.',
    imgSrc: 'rishikesh.jpg',
    isPopular: true,
    location: 'Uttarakhand',
    bestTimeToVisit: 'September to November',
    activities: ['River Rafting', 'Yoga Retreats', 'Camping'],
    tips: 'Morning Ganga Aarti is a must-see.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1200/day', medium: '₹3500/day', high: '₹8000/day' },
    itinerary: ['Day 1: Rafting & Laxman Jhula', 'Day 2: Yoga retreat', 'Day 3: Trek & meditation']
  },
  {
    title: 'Udaipur',
    description: 'City of Lakes, known for palaces, lakes, and serene beauty.',
    imgSrc: 'udaipur.jpg',
    isPopular: true,
    location: 'Rajasthan',
    bestTimeToVisit: 'September to March',
    activities: ['Lake Pichola Boating', 'Palace Visit', 'Photography'],
    tips: 'Evening boat rides are magical.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1800/day', medium: '₹4500/day', high: '₹10000/day' },
    itinerary: ['Day 1: City Palace & Lake Pichola', 'Day 2: Jag Mandir & gardens', 'Day 3: Local markets & temples']
  },
  {
    title: 'Mysore',
    description: 'City of Palaces and rich cultural heritage.',
    imgSrc: 'mysore.jpg',
    isPopular: false,
    location: 'Karnataka',
    bestTimeToVisit: 'October to March',
    activities: ['Palace Tour', 'Zoo Visit', 'Local Markets'],
    tips: 'Visit during Dasara festival for grand celebrations.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Mysore Palace', 'Day 2: Zoo & local markets', 'Day 3: Chamundi Hill']
  },
  {
    title: 'Darjeeling',
    description: 'Famous for tea gardens and scenic views.',
    imgSrc: 'darjeeling.jpg',
    isPopular: false,
    location: 'West Bengal',
    bestTimeToVisit: 'March to May, October to December',
    activities: ['Tea Garden Tour', 'Toy Train', 'Hiking'],
    tips: 'Try local tea and momos.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹4500/day', high: '₹10000/day' },
    itinerary: ['Day 1: Tiger Hill & sunrise', 'Day 2: Tea garden & Darjeeling town', 'Day 3: Trekking nearby']
  },
  {
    title: 'Andaman Islands',
    description: 'Tropical paradise with pristine beaches, coral reefs, and clear waters.',
    imgSrc: 'AndamanIslands.jpg',
    isPopular: true,
    location: 'Andaman & Nicobar Islands',
    bestTimeToVisit: 'October to May',
    activities: ['Scuba Diving', 'Snorkeling', 'Beach Hopping', 'Water Sports'],
    tips: 'Book ferry tickets in advance.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹3000/day', medium: '₹7000/day', high: '₹15000/day' },
    itinerary: ['Day 1: Havelock Island', 'Day 2: Radhanagar Beach', 'Day 3: Scuba & snorkeling']
  },
  {
    title: 'Hampi',
    description: 'Ruins of Vijayanagara Empire with unique boulder landscapes.',
    imgSrc: 'hampi.jpg',
    isPopular: false,
    location: 'Karnataka',
    bestTimeToVisit: 'October to March',
    activities: ['Temple Tours', 'Boulder Climbing', 'Photography'],
    tips: 'Carry good walking shoes.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1200/day', medium: '₹3500/day', high: '₹8000/day' },
    itinerary: ['Day 1: Virupaksha & local ruins', 'Day 2: Vittala Temple & Stone chariot', 'Day 3: Hampi Bazaar & river coracle']
  },
  {
    title: 'Shimla',
    description: 'Famous hill station with colonial charm.',
    imgSrc: 'shimla.jpg',
    isPopular: false,
    location: 'Himachal Pradesh',
    bestTimeToVisit: 'March to June',
    activities: ['Mall Road Walk', 'Toy Train Ride', 'Hiking'],
    tips: 'Book hotels early in summer.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1800/day', medium: '₹4500/day', high: '₹10000/day' },
    itinerary: ['Day 1: Mall Road & Ridge', 'Day 2: Kufri & local adventure', 'Day 3: Jakhu Temple & walk']
  },
  {
    title: 'Leh-Ladakh',
    description: 'Adventure paradise with mountains, lakes, and unique culture.',
    imgSrc: 'leh.jpg',
    isPopular: true,
    location: 'Ladakh',
    bestTimeToVisit: 'June to September',
    activities: ['Trekking', 'Biking', 'Photography'],
    tips: 'Acclimatize properly to high altitude.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2500/day', medium: '₹6000/day', high: '₹12000/day' },
    itinerary: ['Day 1: Leh local sightseeing', 'Day 2: Pangong Lake', 'Day 3: Nubra Valley']
  },
  {
    title: 'Kerala',
    description: 'God\'s Own Country, with backwaters, beaches, and lush greenery.',
    imgSrc: 'kerala.jpg',
    isPopular: true,
    location: 'Kerala',
    bestTimeToVisit: 'October to March',
    activities: ['Backwater Cruise', 'Ayurvedic Spa', 'Hill Station Visit'],
    tips: 'Try local cuisine like Kerala Sadya.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹5000/day', high: '₹10000/day' },
    itinerary: ['Day 1: Alleppey backwaters', 'Day 2: Munnar hills', 'Day 3: Kochi sightseeing']
  },
  {
    title: 'Shillong',
    description: 'City of waterfalls and greenery in Northeast India.',
    imgSrc: 'shillong.jpg',
    isPopular: false,
    location: 'Meghalaya',
    bestTimeToVisit: 'October to June',
    activities: ['Waterfalls', 'Local Markets', 'Hiking'],
    tips: 'Carry rain gear; it rains often.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Elephant Falls & Shillong Peak', 'Day 2: Mawlynnong village', 'Day 3: Local markets & cafes']
  },
  {
    title: 'Pondicherry',
    description: 'Charming coastal town with French colonial architecture, beaches, and cafes.',
    imgSrc: 'pondicherry.jpg',
    isPopular: false,
    location: 'Puducherry',
    bestTimeToVisit: 'October to March',
    activities: ['Beach Walks', 'Cafe Hopping', 'Explore Auroville'],
    tips: 'Rent a bicycle or scooter to explore the town easily.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Promenade & French Quarter', 'Day 2: Auroville & beaches', 'Day 3: Local cafes & culture']
  },
  {
    title: 'Coorg',
    description: 'Known as the Scotland of India, famous for coffee plantations and hills.',
    imgSrc: 'coorg.jpg',
    isPopular: false,
    location: 'Karnataka',
    bestTimeToVisit: 'October to March',
    activities: ['Trekking', 'Coffee Plantation Tour', 'Waterfalls'],
    tips: 'Stay in homestays for authentic experience.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹5000/day', high: '₹10000/day' },
    itinerary: ['Day 1: Abbey & Iruppu waterfalls', 'Day 2: Coffee plantation tour', 'Day 3: Local trekking & relaxation']
  },
  {
    title: 'Agra',
    description: 'Home of the iconic Taj Mahal and rich Mughal history.',
    imgSrc: 'agra.jpg',
    isPopular: true,
    location: 'Uttar Pradesh',
    bestTimeToVisit: 'October to March',
    activities: ['Taj Mahal Tour', 'Fort Visit', 'Local Food'],
    tips: 'Visit early morning to avoid crowds.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1200/day', medium: '₹3500/day', high: '₹8000/day' },
    itinerary: ['Day 1: Taj Mahal sunrise', 'Day 2: Agra Fort & local bazaar', 'Day 3: Fatehpur Sikri day trip']
  },
  {
    title: 'Cherrapunji',
    description: 'Known for living root bridges, waterfalls, and extreme rainfall.',
    imgSrc: 'cherrapunji.jpg',
    isPopular: false,
    location: 'Meghalaya',
    bestTimeToVisit: 'October to May',
    activities: ['Living Root Bridge Trek', 'Waterfall Visits', 'Cave Exploration'],
    tips: 'Carry rain gear as rainfall is frequent.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Nohkalikai Falls & trek', 'Day 2: Living Root Bridge', 'Day 3: Mawsmai Caves & local village']
  },
  {
    title: 'Daman & Diu',
    description: 'Serene coastal destination with Portuguese heritage, beaches, and forts.',
    imgSrc: 'daman.jpg',
    isPopular: false,
    location: 'Daman and Diu',
    bestTimeToVisit: 'October to March',
    activities: ['Beach Walks', 'Fort Exploration', 'Water Sports'],
    tips: 'Try the local seafood and explore both Daman and Diu sides.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Daman beaches & forts', 'Day 2: Diu sightseeing', 'Day 3: Relax & water sports']
  },
  {
    title: 'Ziro Valley',
    description: 'Picturesque valley in Arunachal Pradesh, known for rice fields, pine hills, and tribal culture.',
    imgSrc: 'ziro.jpg',
    isPopular: false,
    location: 'Arunachal Pradesh',
    bestTimeToVisit: 'March to October',
    activities: ['Trekking', 'Tribal Culture Experience', 'Ziro Music Festival'],
    tips: 'Plan visit during the Ziro Music Festival for unique experience.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹4500/day', high: '₹10000/day' },
    itinerary: ['Day 1: Ziro town & tribal villages', 'Day 2: Music festival & trekking', 'Day 3: Explore rice fields & local markets']
  },
  {
    title: 'Spiti Valley',
    description: 'Cold desert mountain valley, monasteries, rugged landscapes, and adventure trekking.',
    imgSrc: 'spiti.jpg',
    isPopular: false,
    location: 'Himachal Pradesh',
    bestTimeToVisit: 'May to October',
    activities: ['Monastery Visits', 'Trekking', 'Camping', 'Photography'],
    tips: 'Carry warm clothes; roads can be tough.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹2000/day', medium: '₹5000/day', high: '₹12000/day' },
    itinerary: ['Day 1: Kaza town & Key Monastery', 'Day 2: Tabo Monastery & trekking', 'Day 3: Chandratal Lake camping']
  },
  {
    title: 'Landour',
    description: 'Quiet hill station near Mussoorie with colonial charm and scenic views.',
    imgSrc: 'landour.jpg',
    isPopular: false,
    location: 'Uttarakhand',
    bestTimeToVisit: 'March to June and September to November',
    activities: ['Nature Walks', 'Café Hopping', 'Sightseeing'],
    tips: 'Carry comfortable walking shoes and light woolens.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹3500/day', high: '₹8000/day' },
    itinerary: ['Day 1: Landour walks & Café hopping', 'Day 2: Mussoorie hill sightseeing', 'Day 3: Local nature trails']
  },
  {
    title: 'Mussoorie',
    description: 'The Queen of Hills, with waterfalls, viewpoints, and colonial-era charm.',
    imgSrc: 'mussoorie.jpg',
    isPopular: false,
    location: 'Uttarakhand',
    bestTimeToVisit: 'March to June and September to November',
    activities: ['Cable Car Ride', 'Kempty Falls Visit', 'Mall Road Stroll'],
    tips: 'Avoid peak tourist season for a peaceful trip.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1800/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Mall Road & viewpoints', 'Day 2: Kempty Falls & cable car', 'Day 3: Trekking & relax']
  },
  {
    title: 'Chopta',
    description: 'Serene hill station in Uttarakhand, also called "Mini Switzerland of India".',
    imgSrc: 'chopta.jpg',
    isPopular: false,
    location: 'Uttarakhand',
    bestTimeToVisit: 'March to May and September to November',
    activities: ['Tungnath Trek', 'Camping', 'Bird Watching'],
    tips: 'Carry warm clothes as temperatures can drop suddenly.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹3500/day', high: '₹8000/day' },
    itinerary: ['Day 1: Tungnath trek', 'Day 2: Camping & bird watching', 'Day 3: Chopta local exploration']
  },
  {
    title: 'Nainital',
    description: 'Picturesque hill station with lakes and pleasant weather.',
    imgSrc: 'nainital.jpg',
    isPopular: false,
    location: 'Uttarakhand',
    bestTimeToVisit: 'March to June and September to November',
    activities: ['Boating in Naini Lake', 'Cable Car Ride', 'Shopping at Mall Road'],
    tips: 'Book accommodations early during peak seasons.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1800/day', medium: '₹4000/day', high: '₹9000/day' },
    itinerary: ['Day 1: Naini Lake boating', 'Day 2: Snow View & cable car', 'Day 3: Local shopping & trek']
  },
  {
    title: 'Ranikhet',
    description: 'Peaceful hill station known for scenic beauty, orchards, and Himalayan views.',
    imgSrc: 'ranikhet.jpg',
    isPopular: false,
    location: 'Uttarakhand',
    bestTimeToVisit: 'March to June and September to November',
    activities: ['Nature Walks', 'Golfing', 'Visit to Jhula Devi Temple'],
    tips: 'Ideal for travelers seeking peace and less-crowded hill stations.',
    mapLink: 'https://goo.gl/maps/...',
    budgetPlan: { low: '₹1500/day', medium: '₹3500/day', high: '₹8000/day' },
    itinerary: ['Day 1: Ranikhet walk & nature', 'Day 2: Golfing & local temple', 'Day 3: Scenic photography & relax']
  },
];

const seedDB = async () => {
  try {

    const count = await Destination.countDocuments();

    if (count === 0) {
      await Destination.insertMany(destinations);
      console.log("✅ Destinations seeded successfully!");
    } else {
      console.log("⚠️ Database already has data. Seeding skipped.");
    }

  } catch (err) {
    console.error("❌ Error seeding destinations:", err);
  } finally {
    mongoose.connection.close();
  }
};

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    seedDB();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));