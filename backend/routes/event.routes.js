const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', protect, uploadToCloudinary, createEvent);
router.put('/:id', protect, uploadToCloudinary, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;