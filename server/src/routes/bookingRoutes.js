import express from 'express';
import {
  createBooking,
  getBookings,
  getUserBookings,
  checkBookingStatus,
  getBookingById,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createBooking);
router.get('/me', protect, getUserBookings);
router.get('/check/:eventId', protect, checkBookingStatus);
router.get('/:id', protect, getBookingById);

// Admin routes
router.get('/', protect, admin, getBookings);
router.delete('/:id', protect, admin, deleteBooking);

export default router;