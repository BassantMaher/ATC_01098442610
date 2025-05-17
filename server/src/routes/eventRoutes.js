import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin routes
router.post('/', protect, admin, createEvent);
router.put('/:id', protect, admin, updateEvent);
router.delete('/:id', protect, admin, deleteEvent);

// Image upload route
router.post('/upload', protect, admin, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
    });
  } else {
    res.status(400);
    throw new Error('Please upload a file');
  }
});

export default router;