import mongoose from 'mongoose';
import Destination from './models/Destination.js';
import dotenv from 'dotenv';
dotenv.config();

const destinations = [
  {
    "budgetPlan": { "low": "₹1200/day", "medium": "₹3000/day", "high": "₹6000/day" },
    "title": "Tirthan Valley",
    "description": "A शांत and untouched valley known for crystal-clear rivers, trout fishing, and proximity to the Great Himalayan National Park.",
    "imgSrc": "tirthan.jpg",
    "isPopular": true,
    "location": "Himachal Pradesh",
    "price": 15000, 
    "bestTimeToVisit": "March to June, September to November",
    "activities": ["Trekking", "Fishing", "Camping", "Nature Walks"],
    "tips": "Carry cash, limited ATMs available.",
    "mapLink": "https://www.google.com/maps?q=Tirthan+Valley&output=embed",
    "itinerary": ["Day 1: River walk", "Day 2: GHNP trek", "Day 3: Jalori Pass"]
  },
  {
    "budgetPlan": { "low": "₹1000/day", "medium": "₹2500/day", "high": "₹5000/day" },
    "title": "Gokarna",
    "description": "A peaceful beach town with scenic coastal treks and less crowd compared to Goa.",
    "imgSrc": "gokarna.jpg",
    "isPopular": true,
    "location": "Karnataka",
    "price": 12000,
    "bestTimeToVisit": "October to March",
    "activities": ["Ganga Aarti", "Temple Visits", "Boat Ride"],
    "tips": "Try beach trekking early morning.",
    "mapLink": "https://www.google.com/maps?q=Gokarna&output=embed",
    "itinerary": ["Day 1: Om Beach", "Day 2: Kudle Beach trek", "Day 3: Half Moon Beach"]
  },
  {
    "budgetPlan": { "low": "₹3000/day", "medium": "₹6000/day", "high": "₹12000/day" },
    "title": "Agatti Island",
    "description": "A pristine island with crystal-clear water and coral reefs, far less crowded than Andaman.",
    "imgSrc": "agatti.jpg",
    "isPopular": true,
    "location": "Lakshadweep",
    "price": 35000,
    "bestTimeToVisit": "October to March",
    "activities": ["Snorkeling", "Swimming", "Beach relax"],
    "tips": "Permit required before visiting.",
    "mapLink": "https://www.google.com/maps?q=Agatti+Island&output=embed",
    "itinerary": ["Day 1: Arrival", "Day 2: Water activities", "Day 3: Explore island"]
  },
  {
    "budgetPlan": { "low": "₹800/day", "medium": "₹2000/day", "high": "₹4000/day" },
    "title": "Gandikota",
    "description": "Known as the Grand Canyon of India, with dramatic cliffs and river views.",
    "imgSrc": "gandikota.jpg",
    "isPopular": true,
    "location": "Andhra Pradesh",
    "price": 8500,
    "bestTimeToVisit": "September to February",
    "activities": ["Camping", "Trekking", "Photography"],
    "tips": "Carry food, limited options available.",
    "mapLink": "https://www.google.com/maps?q=Gandikota&output=embed",
    "itinerary": ["Day 1: Fort + canyon view", "Day 2: Sunrise + explore"]
  },
  {
    "budgetPlan": { "low": "₹900/day", "medium": "₹2200/day", "high": "₹4500/day" },
    "title": "Chaukori",
    "description": "A peaceful hill station known for tea gardens and panoramic Himalayan views.",
    "imgSrc": "chaukori.jpg",
    "isPopular": true,
    "location": "Uttarakhand",
    "price": 10000,
    "bestTimeToVisit": "March to June, September to November",
    "activities": ["Nature walks", "Sunrise views", "Relaxation"],
    "tips": "Ideal for slow travel, not party trips.",
    "mapLink": "https://www.google.com/maps?q=Chaukori&output=embed",
    "itinerary": ["Day 1: Arrival + sunset", "Day 2: Explore tea gardens", "Day 3: Sunrise + relax"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹5000/day", "high": "₹12000/day" },
    "title": "Goa",
    "description": "Famous for beaches, nightlife, and Portuguese heritage.",
    "imgSrc": "goa.jpg",
    "isPopular": true,
    "location": "Goa",
    "price": 18000,
    "bestTimeToVisit": "November to February",
    "activities": ["Beach Hopping", "Water Sports", "Night Markets"],
    "tips": "Rent a scooter to explore the coast.",
    "mapLink": "https://www.google.com/maps?q=Goa&output=embed",
    "itinerary": ["Day 1: North Goa beaches", "Day 2: South Goa relax & culture", "Day 3: Water sports & night market"]
  },
  {
    "budgetPlan": { "low": "₹1200/day", "medium": "₹3500/day", "high": "₹8000/day" },
    "title": "Rishikesh",
    "description": "Yoga capital of the world and adventure hub by the Ganges.",
    "imgSrc": "rishikesh.jpg",
    "isPopular": true,
    "location": "Uttarakhand",
    "price": 14000,
    "bestTimeToVisit": "September to November",
    "activities": ["River Rafting", "Yoga Retreats", "Camping"],
    "tips": "Morning Ganga Aarti is a must-see.",
    "mapLink": "https://www.google.com/maps?q=Rishikesh&output=embed",
    "itinerary": ["Day 1: Rafting & Laxman Jhula", "Day 2: Yoga retreat", "Day 3: Trek & meditation"]
  },
  {
    "budgetPlan": { "low": "₹1800/day", "medium": "₹4500/day", "high": "₹10000/day" },
    "title": "Udaipur",
    "description": "City of Lakes, known for palaces, lakes, and serene beauty.",
    "imgSrc": "udaipur.jpg",
    "isPopular": true,
    "location": "Rajasthan",
    "price": 16000,
    "bestTimeToVisit": "September to March",
    "activities": ["Lake Pichola Boating", "Palace Visit", "Photography"],
    "tips": "Evening boat rides are magical.",
    "mapLink": "https://www.google.com/maps?q=Udaipur&output=embed",
    "itinerary": ["Day 1: City Palace & Lake Pichola", "Day 2: Jag Mandir & gardens", "Day 3: Local markets & temples"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Mysore",
    "description": "City of Palaces and rich cultural heritage.",
    "imgSrc": "mysore.jpg",
    "isPopular": false,
    "location": "Karnataka",
    "price": 13000,
    "bestTimeToVisit": "October to March",
    "activities": ["Palace Tour", "Zoo Visit", "Local Markets"],
    "tips": "Visit during Dasara festival for grand celebrations.",
    "mapLink": "https://www.google.com/maps?q=Mysore&output=embed",
    "itinerary": ["Day 1: Mysore Palace", "Day 2: Zoo & local markets", "Day 3: Chamundi Hill"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹4500/day", "high": "₹10000/day" },
    "title": "Darjeeling",
    "description": "Famous for tea gardens and scenic views.",
    "imgSrc": "darjeeling.jpg",
    "isPopular": false,
    "location": "West Bengal",
    "price": 17500,
    "bestTimeToVisit": "March to May, October to December",
    "activities": ["Tea Garden Tour", "Toy Train", "Hiking"],
    "tips": "Try local tea and momos.",
    "mapLink": "https://www.google.com/maps?q=Darjeeling&output=embed",
    "itinerary": ["Day 1: Tiger Hill & sunrise", "Day 2: Tea garden & Darjeeling town", "Day 3: Trekking nearby"]
  },
  {
    "budgetPlan": { "low": "₹3000/day", "medium": "₹7000/day", "high": "₹15000/day" },
    "title": "Andaman Islands",
    "description": "Tropical paradise with pristine beaches, coral reefs, and clear waters.",
    "imgSrc": "AndamanIslands.jpg",
    "isPopular": true,
    "location": "Andaman & Nicobar Islands",
    "price": 32000,
    "bestTimeToVisit": "October to May",
    "activities": ["Scuba Diving", "Snorkeling", "Beach Hopping", "Water Sports"],
    "tips": "Book ferry tickets in advance.",
    "mapLink": "https://www.google.com/maps?q=Andaman&output=embed",
    "itinerary": ["Day 1: Havelock Island", "Day 2: Radhanagar Beach", "Day 3: Scuba & snorkeling"]
  },
  {
    "budgetPlan": { "low": "₹1200/day", "medium": "₹3500/day", "high": "₹8000/day" },
    "title": "Hampi",
    "description": "Ruins of Vijayanagara Empire with unique boulder landscapes.",
    "imgSrc": "hampi.jpg",
    "isPopular": false,
    "location": "Karnataka",
    "price": 12500,
    "bestTimeToVisit": "October to March",
    "activities": ["Temple Tours", "Boulder Climbing", "Photography"],
    "tips": "Carry good walking shoes.",
    "mapLink": "https://www.google.com/maps?q=Hampi&output=embed",
    "itinerary": ["Day 1: Virupaksha & local ruins", "Day 2: Vittala Temple & Stone chariot", "Day 3: Hampi Bazaar & river coracle"]
  },
  {
    "budgetPlan": { "low": "₹1800/day", "medium": "₹4500/day", "high": "₹10000/day" },
    "title": "Shimla",
    "description": "Famous hill station with colonial charm.",
    "imgSrc": "shimla.jpg",
    "isPopular": false,
    "location": "Himachal Pradesh",
    "price": 16500,
    "bestTimeToVisit": "March to June",
    "activities": ["Mall Road Walk", "Toy Train Ride", "Hiking"],
    "tips": "Book hotels early in summer.",
    "mapLink": "https://www.google.com/maps?q=Shimla&output=embed",
    "itinerary": ["Day 1: Mall Road & Ridge", "Day 2: Kufri & local adventure", "Day 3: Jakhu Temple & walk"]
  },
  {
    "budgetPlan": { "low": "₹2500/day", "medium": "₹6000/day", "high": "₹12000/day" },
    "title": "Leh-Ladakh",
    "description": "Adventure paradise with mountains, lakes, and unique culture.",
    "imgSrc": "leh.jpg",
    "isPopular": true,
    "location": "Ladakh",
    "price": 28000,
    "bestTimeToVisit": "June to September",
    "activities": ["Trekking", "Biking", "Photography"],
    "tips": "Acclimatize properly to high altitude.",
    "mapLink": "https://www.google.com/maps?q=LehLadakh&output=embed",
    "itinerary": ["Day 1: Leh local sightseeing", "Day 2: Pangong Lake", "Day 3: Nubra Valley"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹5000/day", "high": "₹10000/day" },
    "title": "Kerala",
    "description": "God's Own Country, with backwaters, beaches, and lush greenery.",
    "imgSrc": "kerala.jpg",
    "isPopular": true,
    "location": "Kerala",
    "price": 22000,
    "bestTimeToVisit": "October to March",
    "activities": ["Backwater Cruise", "Ayurvedic Spa", "Hill Station Visit"],
    "tips": "Try local cuisine like Kerala Sadya.",
    "mapLink": "https://www.google.com/maps?q=Kerala&output=embed",
    "itinerary": ["Day 1: Alleppey backwaters", "Day 2: Munnar hills", "Day 3: Kochi sightseeing"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Shillong",
    "description": "City of waterfalls and greenery in Northeast India.",
    "imgSrc": "shillong.jpg",
    "isPopular": false,
    "location": "Meghalaya",
    "price": 18500,
    "bestTimeToVisit": "October to June",
    "activities": ["Waterfalls", "Local Markets", "Hiking"],
    "tips": "Carry rain gear; it rains often.",
    "mapLink": "https://www.google.com/maps?q=Shillong&output=embed",
    "itinerary": ["Day 1: Elephant Falls & Shillong Peak", "Day 2: Mawlynnong village", "Day 3: Local markets & cafes"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Pondicherry",
    "description": "Charming coastal town with French colonial architecture, beaches, and cafes.",
    "imgSrc": "pondicherry.jpg",
    "isPopular": false,
    "location": "Puducherry",
    "price": 14500,
    "bestTimeToVisit": "October to March",
    "activities": ["Beach Walks", "Cafe Hopping", "Explore Auroville"],
    "tips": "Rent a bicycle or scooter to explore the town easily.",
    "mapLink": "https://www.google.com/maps?q=Pondicherry&output=embed",
    "itinerary": ["Day 1: Promenade & French Quarter", "Day 2: Auroville & beaches", "Day 3: Local cafes & culture"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹5000/day", "high": "₹10000/day" },
    "title": "Coorg",
    "description": "Known as the Scotland of India, famous for coffee plantations and hills.",
    "imgSrc": "coorg.jpg",
    "isPopular": false,
    "location": "Karnataka",
    "price": 16000,
    "bestTimeToVisit": "October to March",
    "activities": ["Trekking", "Coffee Plantation Tour", "Waterfalls"],
    "tips": "Stay in homestays for authentic experience.",
    "mapLink": "https://www.google.com/maps?q=Coorg&output=embed",
    "itinerary": ["Day 1: Abbey & Iruppu waterfalls", "Day 2: Coffee plantation tour", "Day 3: Local trekking & relaxation"]
  },
  {
    "budgetPlan": { "low": "₹1200/day", "medium": "₹3500/day", "high": "₹8000/day" },
    "title": "Agra",
    "description": "Home of the iconic Taj Mahal and rich Mughal history.",
    "imgSrc": "agra.jpg",
    "isPopular": true,
    "location": "Uttar Pradesh",
    "price": 9500,
    "bestTimeToVisit": "October to March",
    "activities": ["Taj Mahal Tour", "Fort Visit", "Local Food"],
    "tips": "Visit early morning to avoid crowds.",
    "mapLink": "https://www.google.com/maps?q=Agra&output=embed",
    "itinerary": ["Day 1: Taj Mahal sunrise", "Day 2: Agra Fort & local bazaar", "Day 3: Fatehpur Sikri day trip"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Cherrapunji",
    "description": "Known for living root bridges, waterfalls, and extreme rainfall.",
    "imgSrc": "cherrapunji.jpg",
    "isPopular": false,
    "location": "Meghalaya",
    "price": 17000,
    "bestTimeToVisit": "October to May",
    "activities": ["Living Root Bridge Trek", "Waterfall Visits", "Cave Exploration"],
    "tips": "Carry rain gear as rainfall is frequent.",
    "mapLink": "https://www.google.com/maps?q=Cherrapunji&output=embed",
    "itinerary": ["Day 1: Nohkalikai Falls & trek", "Day 2: Living Root Bridge", "Day 3: Mawsmai Caves & local village"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Daman & Diu",
    "description": "Serene coastal destination with Portuguese heritage, beaches, and forts.",
    "imgSrc": "daman.jpg",
    "isPopular": false,
    "location": "Daman and Diu",
    "price": 13500,
    "bestTimeToVisit": "October to March",
    "activities": ["Beach Walks", "Fort Exploration", "Water Sports"],
    "tips": "Try the local seafood and explore both Daman and Diu sides.",
    "mapLink": "https://www.google.com/maps?q=DamanDiu&output=embed",
    "itinerary": ["Day 1: Daman beaches & forts", "Day 2: Diu sightseeing", "Day 3: Relax & water sports"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹4500/day", "high": "₹10000/day" },
    "title": "Ziro Valley",
    "description": "Picturesque valley in Arunachal Pradesh, known for rice fields, pine hills, and tribal culture.",
    "imgSrc": "ziro.jpg",
    "isPopular": false,
    "location": "Arunachal Pradesh",
    "price": 21000,
    "bestTimeToVisit": "March to October",
    "activities": ["Trekking", "Tribal Culture Experience", "Ziro Music Festival"],
    "tips": "Plan visit during the Ziro Music Festival for unique experience.",
    "mapLink": "https://www.google.com/maps?q=ZeroValley&output=embed",
    "itinerary": ["Day 1: Ziro town & tribal villages", "Day 2: Music festival & trekking", "Day 3: Explore rice fields & local markets"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹5000/day", "high": "₹12000/day" },
    "title": "Spiti Valley",
    "description": "Cold desert mountain valley, monasteries, rugged landscapes, and adventure trekking.",
    "imgSrc": "spiti.jpg",
    "isPopular": false,
    "location": "Himachal Pradesh",
    "price": 26000,
    "bestTimeToVisit": "May to October",
    "activities": ["Monastery Visits", "Trekking", "Camping", "Photography"],
    "tips": "Carry warm clothes; roads can be tough.",
    "mapLink": "https://www.google.com/maps?q=SpitiValley&output=embed",
    "itinerary": ["Day 1: Kaza town & Key Monastery", "Day 2: Tabo Monastery & trekking", "Day 3: Chandratal Lake camping"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹3500/day", "high": "₹8000/day" },
    "title": "Landour",
    "description": "Quiet hill station near Mussoorie with colonial charm and scenic views.",
    "imgSrc": "landour.jpg",
    "isPopular": false,
    "location": "Uttarakhand",
    "price": 14000,
    "bestTimeToVisit": "March to June and September to November",
    "activities": ["Nature Walks", "Café Hopping", "Sightseeing"],
    "tips": "Carry comfortable walking shoes and light woolens.",
    "mapLink": "https://www.google.com/maps?q=Landour&output=embed",
    "itinerary": ["Day 1: Landour walks & Café hopping", "Day 2: Mussoorie hill sightseeing", "Day 3: Local nature trails"]
  },
  {
    "budgetPlan": { "low": "₹1800/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Mussoorie",
    "description": "The Queen of Hills, with waterfalls, viewpoints, and colonial-era charm.",
    "imgSrc": "mussoorie.jpg",
    "isPopular": false,
    "location": "Uttarakhand",
    "price": 15500,
    "bestTimeToVisit": "March to June and September to November",
    "activities": ["Cable Car Ride", "Kempty Falls Visit", "Mall Road Stroll"],
    "tips": "Avoid peak tourist season for a peaceful trip.",
    "mapLink": "https://www.google.com/maps?q=Mussoorie&output=embed",
    "itinerary": ["Day 1: Mall Road & viewpoints", "Day 2: Kempty Falls & cable car", "Day 3: Trekking & relax"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹3500/day", "high": "₹8000/day" },
    "title": "Chopta",
    "description": "Serene hill station in Uttarakhand, also called 'Mini Switzerland of India'.",
    "imgSrc": "chopta.jpg",
    "isPopular": false,
    "location": "Uttarakhand",
    "price": 12500,
    "bestTimeToVisit": "March to May and September to November",
    "activities": ["Tungnath Trek", "Camping", "Bird Watching"],
    "tips": "Carry warm clothes as temperatures can drop suddenly.",
    "mapLink": "https://www.google.com/maps?q=Chopta&output=embed",
    "itinerary": ["Day 1: Tungnath trek", "Day 2: Camping & bird watching", "Day 3: Chopta local exploration"]
  },
  {
    "budgetPlan": { "low": "₹1800/day", "medium": "₹4000/day", "high": "₹9000/day" },
    "title": "Nainital",
    "description": "Picturesque hill station with lakes and pleasant weather.",
    "imgSrc": "nainital.jpg",
    "isPopular": false,
    "location": "Uttarakhand",
    "price": 16000,
    "bestTimeToVisit": "March to June and September to November",
    "activities": ["Boating in Naini Lake", "Cable Car Ride", "Shopping at Mall Road"],
    "tips": "Book accommodations early during peak seasons.",
    "mapLink": "https://www.google.com/maps?q=Nainital&output=embed",
    "itinerary": ["Day 1: Naini Lake boating", "Day 2: Snow View & cable car", "Day 3: Local shopping & trek"]
  },
  {
    "budgetPlan": { "low": "₹1500/day", "medium": "₹3500/day", "high": "₹8000/day" },
    "title": "Ranikhet",
    "description": "Peaceful hill station known for scenic beauty, orchards, and Himalayan views.",
    "imgSrc": "ranikhet.jpg",
    "isPopular": false,
    "location": "Uttarakhand",
    "price": 13000,
    "bestTimeToVisit": "March to June and September to November",
    "activities": ["Nature Walks", "Golfing", "Visit to Jhula Devi Temple"],
    "tips": "Ideal for travelers seeking peace and less-crowded hill stations.",
    "mapLink": "https://www.google.com/maps?q=Ranikhet&output=embed",
    "itinerary": ["Day 1: Ranikhet walk & nature", "Day 2: Golfing & local temple", "Day 3: Scenic photography & relax"]
  },
  {
    "budgetPlan": { "low": "₹1200–₹2000/day", "medium": "₹3000–₹6000/day", "high": "₹8000–₹15000/day" },
    "title": "Rameshwaram",
    "description": "Rameshwaram is a sacred island town in Tamil Nadu known for its temples, beautiful beaches, and historical significance in Hindu mythology. ",
    "imgSrc": "Rameshwaram.jpg",
    "location": "Tamil Nadu",
    "price": 11000,
    "bestTimeToVisit": "October to April",
    "activities": ["Temple visit", "Beach walk", "Photography", "Boat ride"],
    "tips": "Carry light cotton clothes, visit temples early morning, stay hydrated, respect temple dress code",
    "mapLink": "https://www.google.com/maps?q=Rameswaram&output=embed",
    "itinerary": ["Day 1: Ramanathaswamy Temple", "Day 2: Dhanushkodi beach", "Day 3: Pamban bridge"]
  },
  {
    "budgetPlan": { "low": "₹2000/day", "medium": "₹5000/day", "high": "₹10000/day" },
    "title": "Tawang",
    "description": "A stunning hill town in Arunachal Pradesh known for monasteries, snow-capped mountains, and peaceful landscapes.",
    "imgSrc": "tawang.jpg",
    "location": "Arunachal Pradesh",
    "price": 24000,
    "bestTimeToVisit": "March to June, September to October",
    "activities": ["Monastery Visit", "Snow Trekking", "Photography", "Local Culture Exploration"],
    "tips": "Carry warm clothes and permits are required to enter Arunachal Pradesh.",
    "mapLink": "https://www.google.com/maps?q=Tawang&output=embed",
    "itinerary": ["Day 1: Tawang Monastery & local market", "Day 2: Sela Pass & Madhuri Lake", "Day 3: Bum La Pass & local sightseeing"]
  },
  {
    "budgetPlan": { "low": "₹900/day", "medium": "₹2000/day", "high": "₹3500/day" },
    "title": "Dhanushkodi",
    "description": "A ghost town where two seas meet, offering surreal landscapes and history.",
    "imgSrc": "dhanushkodi.jpg",
    "location": "Tamil Nadu",
    "price": 8000,
    "bestTimeToVisit": "October to March",
    "activities": ["Sightseeing", "Photography", "Beach Walk"],
    "tips": "Visit early morning for best views.",
    "mapLink": "https://www.google.com/maps?q=Dhanushkodi&output=embed",
    "itinerary": ["Day 1: Rameswaram temple", "Day 2: Dhanushkodi visit"]
  },
  {
    "budgetPlan": { "low": "₹800/day", "medium": "₹2000/day", "high": "₹4000/day" },
    "title": "St. Mary’s Island",
    "description": "Famous for its hexagonal basalt rock formations and clear blue waters.",
    "imgSrc": "stmary.jpg",
    "location": "Karnataka ",
    "price": 9000,
    "bestTimeToVisit": "October to January",
    "activities": ["Photography", "Beach walk", "Boating"],
    "tips": "Visit early, ferries stop by evening.",
    "mapLink": "https://www.google.com/maps?q=St+Mary's+Island&output=embed",
    "itinerary": ["Day 1: Ferry ride + island exploration"]
  },
  {
    "budgetPlan": { "low": "₹1800/day", "medium": "₹4000/day", "high": "₹7500/day" },
    "title": "Mechuka",
    "description": "A remote valley near the Indo-China border with untouched beauty and tribal culture.",
    "imgSrc": "mechuka.jpg",
    "location": "Arunachal Pradesh",
    "price": 19500,
    "bestTimeToVisit": "October to April",
    "activities": ["Sightseeing", "Cultural exploration", "Photography"],
    "tips": "Limited network connectivity, plan offline.",
    "mapLink": "https://www.google.com/maps?q=Mechuka&output=embed",
    "itinerary": ["Day 1: Explore valley", "Day 2: Monastery visit", "Day 3: Local villages"]
  },
  {
    "budgetPlan": { "low": "₹700/day", "medium": "₹1500/day", "high": "₹3000/day" },
    "title": "Lonar Lake",
    "description": "A rare meteor impact crater lake surrounded by forests and ancient temples.",
    "imgSrc": "lonar.jpg",
    "location": "Maharashtra",
    "price": 7500,
    "bestTimeToVisit": "November to February",
    "activities": ["Trekking", "Bird watching", "Photography"],
    "tips": "Carry water and essentials, limited facilities.",
    "mapLink": "https://www.google.com/maps?q=Lonar+Lake&output=embed",
    "itinerary": ["Day 1: Crater trek", "Day 2: Temple exploration"]
  },
  {
    "budgetPlan": { "low": "₹1000/day", "medium": "₹2500/day", "high": "₹5000/day" },
    "title": "Majuli",
    "description": "The largest river island in the world, rich in Assamese culture and monasteries.",
    "imgSrc": "majuli.jpg",
    "location": "Assam",
    "price": 11500,
    "bestTimeToVisit": "October to March",
    "activities": ["Cultural tours", "Cycling", "Photography"],
    "tips": "Check ferry timings in advance.",
    "mapLink": "https://www.google.com/maps?q=Majuli&output=embed",
    "itinerary": ["Day 1: Ferry + village visit", "Day 2: Satras", "Day 3: Explore island"]
  },
  {
    "budgetPlan": { "low": "₹1200/day", "medium": "₹3000/day", "high": "₹6000/day" },
    "title": "Sandakphu",
    "description": "Highest point in West Bengal offering views of Everest, Kanchenjunga, and other peaks.",
    "imgSrc": "sandakphu.jpg",
    "location": "West Bengal",
    "price": 14000,
    "bestTimeToVisit": "April to May, October to December",
    "activities": ["Trekking", "Sunrise view", "Photography"],
    "tips": "Prepare for long treks or rough jeep rides.",
    "mapLink": "https://www.google.com/maps?q=Sandakphu&output=embed",
    "itinerary": ["Day 1: Reach base", "Day 2: Trek", "Day 3: Summit + return"]
  },
  {
    "budgetPlan": { "low": "₹1200/day", "medium": "₹3000/day", "high": "₹6000/day" },
    "title": "Varkala",
    "description": "A cliff-side beach destination with cafes, yoga spots, and peaceful vibes.",
    "imgSrc": "varkala.jpg",
    "location": "Kerala",
    "price": 13500,
    "bestTimeToVisit": "October to March",
    "activities": ["Swimming", "Yoga", "Cafe hopping"],
    "tips": "Stay near cliff for best experience.",
    "mapLink": "https://www.google.com/maps?q=Varkala&output=embed",
    "itinerary": ["Day 1: Beach relax", "Day 2: Cliff cafes", "Day 3: Temple visit"]
  },
  {
    "budgetPlan": { "low": "₹1000/day", "medium": "₹2500/day", "high": "₹5000/day" },
    "title": "Kalpa",
    "description": "A quiet Himalayan village known for apple orchards and views of Kinner Kailash.",
    "imgSrc": "kalpa.jpg",
    "location": "Himachal Pradesh",
    "price": 12000,
    "bestTimeToVisit": "April to June, September to November",
    "activities": ["Sightseeing", "Photography", "Village walks"],
    "tips": "Roads can be rough, travel carefully",
    "mapLink": "https://www.google.com/maps?q=Kalpa&output=embed",
    "itinerary": ["Day 1: Arrival", "Day 2: Explore village", "Day 3: Nearby spots"]
  },
  {
    "budgetPlan": { "low": "", "medium": "", "high": "" },
    "title": "Maravanthe Beach",
    "location": "Karnataka",
    "image": "maravanthe.jpg",
    "price": 10000,
    "mapLink": "https://www.google.com/maps?q=Maravanthe+Beach&output=embed",
    "description": "A unique beach where the highway runs between the sea and a river.",
    "bestTime": ["October", "November", "December", "January", "February", "March"],
    "activities": ["Photography", "Scenic drive", "Beach walk"],
    "itinerary": ["Day 1: Drive + explore beach"],
    "budget": { "low": 800, "medium": 2000, "high": 4000 },
    "imgSrc": "maravanthe.jpg"
  },
  {
    "budgetPlan": { "low": "", "medium": "", "high": "" },
    "title": "Yusmarg",
    "location": "Jammu & Kashmir",
    "image": "yusmarg.jpg",
    "price": 14500,
    "mapLink": "https://www.google.com/maps?q=Yusmarg&output=embed",
    "description": "A quiet meadow in Kashmir with rivers, forests, and almost no crowd.",
    "bestTime": ["April", "May", "June", "July", "August", "September", "October"],
    "activities": ["Trekking", "Horse riding", "Photography"],
    "itinerary": ["Day 1: Meadow explore", "Day 2: Trek nearby areas"],
    "budget": { "low": 1000, "medium": 2500, "high": 5000 },
    "imgSrc": "yusmarg.jpg"
  }
];


const seedDB = async () => {
  try {

        const count = await Destination.countDocuments();

    if (count === 0) {
      // It will only insert if the database is 100% empty!
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