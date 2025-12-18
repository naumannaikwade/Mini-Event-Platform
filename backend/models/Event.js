const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date and time']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['Tech', 'Business', 'Social', 'Educational', 'Sports', 'Other'],
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// REMOVE or FIX the pre-save middleware - it's causing the error
// eventSchema.pre('save', function(next) {
//   if (this.currentAttendees > this.capacity) {
//     next(new Error('Current attendees cannot exceed capacity'));
//   }
//   next();
// });

module.exports = mongoose.model('Event', eventSchema);