import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    name: {
      type: String,
      required: [true, 'Exercise name is required'],
      minlength: [1, 'Exercise name must be at least 1 character'],
      trim: true,
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight cannot be negative'],
    },
    sets: {
      type: Number,
      required: [true, 'Sets count is required'],
      min: [1, 'Sets must be at least 1'],
    },
    reps: {
      type: Number,
      required: [true, 'Reps count is required'],
      min: [1, 'Reps must be at least 1'],
    },
    feeling: {
      type: String,
      required: [true, 'Feeling is required'],
      enum: ['Bad', 'Normal', 'Good', 'Great'],
      default: 'Normal',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Workout', workoutSchema);
