const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/event.controller');
const { protect } = require('../middleware/auth.middleware');

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images Only!'));
  }
}

// Initialize upload
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB
  fileFilter: checkFileType
});

// Public routes
router.get('/', getEvents);
router.get('/:id', getEvent);

// Protected routes
router.post('/', protect, upload.single('image'), createEvent);
router.put('/:id', protect, upload.single('image'), updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;