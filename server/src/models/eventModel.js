import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Concert', 'Conference', 'Exhibition', 'Sports', 'Theater', 'Workshop', 'Other'],
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      default: '',
    },
    capacity: {
      type: Number,
      required: true,
      default: 100,
    },
    bookedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add a virtual field for remaining spots
eventSchema.virtual('spotsLeft').get(function () {
  return this.capacity - this.bookedCount;
});

// Make virtuals available when we convert to JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;