import asyncHandler from 'express-async-handler';
import Booking from '../models/bookingModel.js';
import Event from '../models/eventModel.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  // Check if event exists
  const event = await Event.findById(eventId);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  // Check if there are spots available
  if (event.bookedCount >= event.capacity) {
    res.status(400);
    throw new Error('Event is fully booked');
  }

  // Check if user has already booked this event
  const existingBooking = await Booking.findOne({ user: userId, event: eventId });
  if (existingBooking) {
    res.status(400);
    throw new Error('You have already booked this event');
  }

  // Create booking
  const booking = await Booking.create({
    user: userId,
    event: eventId,
  });

  // Increment bookedCount for the event
  event.bookedCount += 1;
  await event.save();

  // Emit socket event for real-time updates
  req.io.to(`event:${eventId}`).emit('bookingUpdate', {
    eventId,
    bookedCount: event.bookedCount,
    capacity: event.capacity,
  });

  // Populate booking with event and user details
  const populatedBooking = await Booking.findById(booking._id)
    .populate('event')
    .populate('user', 'name email');

  res.status(201).json(populatedBooking);
});

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('event')
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json({ bookings });
});

// @desc    Get user's bookings
// @route   GET /api/bookings/me
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event')
    .populate('user', 'name email')
    .sort('-createdAt');

  res.json({ bookings });
});

// @desc    Check if user has booked an event
// @route   GET /api/bookings/check/:eventId
// @access  Private
const checkBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    user: req.user._id,
    event: req.params.eventId,
  });

  res.json({ isBooked: !!booking });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('event')
    .populate('user', 'name email');

  // Check if booking exists
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if booking belongs to user or user is admin
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(booking);
});

// @desc    Delete a booking (admin only)
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Decrement bookedCount for the event
  const event = await Event.findById(booking.event);
  if (event) {
    event.bookedCount = Math.max(0, event.bookedCount - 1);
    await event.save();

    // Emit socket event for real-time updates
    req.io.to(`event:${event._id}`).emit('bookingUpdate', {
      eventId: event._id,
      bookedCount: event.bookedCount,
      capacity: event.capacity,
    });
  }

  await booking.deleteOne();
  res.json({ message: 'Booking removed' });
});

// @desc    Get booking analytics
// @route   GET /api/bookings/analytics
// @access  Private/Admin
const getBookingAnalytics = asyncHandler(async (req, res) => {
  // Most booked events
  const mostBookedEvents = await Event.find()
    .sort('-bookedCount')
    .limit(5)
    .select('title bookedCount capacity');

  // Booking trends (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const bookingTrends = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // User activity heatmap (bookings by hour and day of week)
  const activityHeatmap = await Booking.aggregate([
    {
      $group: {
        _id: {
          hour: { $hour: "$createdAt" },
          dayOfWeek: { $dayOfWeek: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    mostBookedEvents,
    bookingTrends,
    activityHeatmap
  });
});

export {
  createBooking,
  getBookings,
  getUserBookings,
  checkBookingStatus,
  getBookingById,
  deleteBooking,
  getBookingAnalytics,
};

// export { createBooking, getBookings, getUserBookings, checkBookingStatus, getBookingById, deleteBooking }