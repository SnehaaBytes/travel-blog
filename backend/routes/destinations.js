import express from "express";
import Destination from "../models/Destination.js";

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

  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: "Server error while fetching destinations" });
  }
});


// GET single destination
router.get("/:id", async (req, res) => {
  try {

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json(destination);

  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({ message: "Failed to fetch destination" });
  }
});


// ADD destination
router.post("/", async (req, res) => {
  try {

    const newDestination = new Destination(req.body);

    const savedDestination = await newDestination.save();

    res.status(201).json(savedDestination);

  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ message: "Failed to create destination" });
  }
});


// UPDATE destination
router.put("/:id", async (req, res) => {
  try {

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json(updatedDestination);

  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Failed to update destination" });
  }
});


// DELETE destination
router.delete("/:id", async (req, res) => {
  try {

    const deletedDestination = await Destination.findByIdAndDelete(req.params.id);

    if (!deletedDestination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    res.json({ message: "Destination deleted successfully" });

  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ message: "Failed to delete destination" });
  }
});


export default router;