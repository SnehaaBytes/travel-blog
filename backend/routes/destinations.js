import express from "express";
import Destination from "../models/Destination.js"; // adjust path if needed

const router = express.Router();

// GET all destinations
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let destinations;
    if (type === "popular") {
      destinations = await Destination.find({ isPopular: true });
    } else {
      destinations = await Destination.find();
    }
    res.json(destinations);
  } catch (err) {
    console.error("Error fetching destinations:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET single destination by ID
router.get("/:id", async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destination not found" });
    res.json(destination);
  } catch (err) {
    console.error("Error fetching destination:", err);
    res.status(500).json({ message: "Failed to fetch destination" });
  }
});

export default router;

