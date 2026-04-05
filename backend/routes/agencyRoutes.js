import express from 'express';
import Agency from '../models/Agency.js'; // Adjust the path if your models folder is somewhere else

const router = express.Router();

// 1. GET all travel agencies
router.get('/', async (req, res) => {
  try {
    const agencies = await Agency.find();
    res.status(200).json({ success: true, data: agencies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch agencies' });
  }
});

// 2. POST create a new travel agency (Used by the Admin)
router.post('/', async (req, res) => {
  try {
    const newAgency = new Agency(req.body);
    const savedAgency = await newAgency.save();
    
    res.status(201).json({ success: true, data: savedAgency });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create agency. Check your data.' });
  }
});

// 3. DELETE an agency (Used by the Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Agency.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Successfully deleted agency' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete agency' });
  }
});

export default router;
