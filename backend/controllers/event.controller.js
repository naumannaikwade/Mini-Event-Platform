const Event = require('../models/Event');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'name email')
      .sort({ date: 1 });
    
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
    let imageData = {
      url: 'https://res.cloudinary.com/dycctxdij/image/upload/v1700000000/default-event.jpg',
      public_id: null
    };
    
    if (req.file && req.file.path) {
      imageData = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }
    req.body.image = imageData;
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    
    // If event creation fails, delete uploaded image
    if (req.file && req.file.filename) {
      await deleteFromCloudinary(req.file.filename);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
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
    if (req.file && req.file.path) {
      // Delete old image from Cloudinary if it exists
      if (event.image.public_id) {
        await deleteFromCloudinary(event.image.public_id);
      }
      
      req.body.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
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
    console.error('Update event error:', error);
    
    // If update fails, delete new uploaded image
    if (req.file && req.file.filename) {
      await deleteFromCloudinary(req.file.filename);
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
    
    // Delete image from Cloudinary if it exists
    if (event.image.public_id) {
      await deleteFromCloudinary(event.image.public_id);
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