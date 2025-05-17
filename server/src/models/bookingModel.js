import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Event',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only book an event once
bookingSchema.index({ user: 1, event: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;