const Event = require('../models/Event');
const path = require('path');
const fs = require('fs');

// Helper to delete image file
const deleteImage = (imageName) => {
  if (imageName !== 'no-image.jpg') {
    const imagePath = path.join(__dirname, '../public/uploads', imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'name email')
      .sort({ date: 1 }); // Sort by date ascending
    
    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name email');
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    // Add creator to req.body
    req.body.creator = req.user.id;
    
    // Handle image upload
    let image = 'no-image.jpg';
    if (req.file) {
      image = req.file.filename;
    }
    req.body.image = image;
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    
    // Delete uploaded image if event creation failed
    if (req.file) {
      deleteImage(req.file.filename);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    // Check if user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this event' 
      });
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image if it's not the default
      if (event.image !== 'no-image.jpg') {
        deleteImage(event.image);
      }
      req.body.image = req.file.filename;
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    
    // Delete new image if update failed
    if (req.file) {
      deleteImage(req.file.filename);
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    // Check if user is event creator
    if (event.creator.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this event' 
      });
    }
    
    // Delete image if it's not the default
    if (event.image !== 'no-image.jpg') {
      deleteImage(event.image);
    }
    
    await event.deleteOne();
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
};