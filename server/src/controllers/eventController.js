import asyncHandler from 'express-async-handler';
import Event from '../models/eventModel.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Build query
  const query = {};
  
  // Add category filter if provided
  if (req.query.category && req.query.category !== '') {
    query.category = req.query.category;
  }
  
  // Add search filter if provided
  if (req.query.search && req.query.search !== '') {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
      { venue: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const events = await Event.find(query)
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Event.countDocuments(query);
  
  res.json({
    events,
    page,
    pages: Math.ceil(total / limit),
    total,
    hasMore: skip + events.length < total,
  });
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, venue, category, price, capacity, image } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    venue,
    category,
    price,
    capacity,
    image: image || '',
    bookedCount: 0,
  });

  if (event) {
    res.status(201).json(event);
  } else {
    res.status(400);
    throw new Error('Invalid event data');
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, venue, category, price, capacity, image } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.venue = venue || event.venue;
    event.category = category || event.category;
    event.price = price !== undefined ? price : event.price;
    event.capacity = capacity || event.capacity;
    event.image = image !== undefined ? image : event.image;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

export { getEvents, getEventById, createEvent, updateEvent, deleteEvent };