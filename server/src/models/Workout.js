import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      minlength: [2, 'Title must be at least 2 characters'],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Workout', workoutSchema);

