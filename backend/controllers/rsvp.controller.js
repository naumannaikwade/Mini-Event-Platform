const Rsvp = require('../models/Rsvp');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    RSVP to an event (with concurrency handling)
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpToEvent = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const eventId = req.params.id;
    const userId = req.user.id;
    
    // 1. Check if event exists
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // 2. Check if user already RSVP'd
    const existingRsvp = await Rsvp.findOne({
      user: userId,
      event: eventId
    }).session(session);
    
    if (existingRsvp) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'You have already RSVP\'d to this event'
      });
    }
    
    // 3. Check capacity (CRITICAL - prevents overbooking)
    if (event.currentAttendees >= event.capacity) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Event is at full capacity'
      });
    }
    
    // 4. Create RSVP and increment attendees atomically
    const [rsvp] = await Promise.all([
      Rsvp.create([{
        user: userId,
        event: eventId
      }], { session }),
      
      // Atomically increment currentAttendees
      Event.findByIdAndUpdate(
        eventId,
        { $inc: { currentAttendees: 1 } },
        { session, new: true }
      )
    ]);
    
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: 'Successfully RSVP\'d to event',
      data: rsvp[0]
    });
    
  } catch (error) {
    await session.abortTransaction();
    
    console.error('RSVP Error:', error);
    
    // Handle duplicate key error (race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already RSVP\'d to this event'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Cancel RSVP
// @route   DELETE /api/events/:id/rsvp
// @access  Private
const cancelRsvp = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    const eventId = req.params.id;
    const userId = req.user.id;
    
    // 1. Find and delete RSVP
    const rsvp = await Rsvp.findOneAndDelete({
      user: userId,
      event: eventId
    }).session(session);
    
    if (!rsvp) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'RSVP not found'
      });
    }
    
    // 2. Atomically decrement currentAttendees
    await Event.findByIdAndUpdate(
      eventId,
      { $inc: { currentAttendees: -1 } },
      { session }
    );
    
    await session.commitTransaction();
    
    res.json({
      success: true,
      message: 'RSVP cancelled successfully'
    });
    
  } catch (error) {
    await session.abortTransaction();
    console.error('Cancel RSVP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  } finally {
    session.endSession();
  }
};

// @desc    Get user's RSVPs
// @route   GET /api/rsvps
// @access  Private
const getUserRsvps = async (req, res) => {
  try {
    const rsvps = await Rsvp.find({ user: req.user.id })
      .populate({
        path: 'event',
        populate: { path: 'creator', select: 'name email' }
      });
    
    res.json({
      success: true,
      count: rsvps.length,
      data: rsvps
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
  rsvpToEvent,
  cancelRsvp,
  getUserRsvps
};