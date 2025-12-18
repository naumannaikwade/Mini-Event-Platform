const express = require('express');
const router = express.Router();
const { 
  rsvpToEvent, 
  cancelRsvp, 
  getUserRsvps 
} = require('../controllers/rsvp.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

// Event-specific RSVP routes
router.post('/events/:id/rsvp', rsvpToEvent);
router.delete('/events/:id/rsvp', cancelRsvp);

// Get user's RSVPs
router.get('/rsvps', getUserRsvps);

module.exports = router;