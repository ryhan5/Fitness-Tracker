import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sets: {
    type: Number,
    min: 1
  },
  reps: {
    type: Number,
    min: 1
  },
  weight: {
    type: Number,
    min: 0
  },
  restTime: {
    type: Number, // seconds
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, { _id: false });

const heartRateSchema = new mongoose.Schema({
  average: {
    type: Number,
    min: 30,
    max: 220
  },
  max: {
    type: Number,
    min: 30,
    max: 220
  },
  zones: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, { _id: false });

const gpsDataSchema = new mongoose.Schema({
  coordinates: {
    type: [[Number]], // [longitude, latitude]
    validate: {
      validator: function(coords) {
        return coords.every(coord => 
          Array.isArray(coord) && 
          coord.length === 2 && 
          coord.every(num => typeof num === 'number')
        );
      },
      message: 'Coordinates must be arrays of [longitude, latitude] pairs'
    }
  },
  startLocation: {
    type: String,
    trim: true
  },
  endLocation: {
    type: String,
    trim: true
  },
  elevation: {
    type: Number // meters
  }
}, { _id: false });

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['workout', 'walk', 'run', 'cycle', 'swim', 'yoga', 'hiking', 'other'],
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  duration: {
    type: Number, // minutes
    required: true,
    min: 1
  },
  caloriesBurned: {
    type: Number,
    min: 0,
    default: 0
  },
  distance: {
    type: Number, // km
    min: 0,
    default: 0
  },
  steps: {
    type: Number,
    min: 0,
    default: 0
  },
  heartRate: heartRateSchema,
  gpsData: gpsDataSchema,
  exercises: [exerciseSchema],
  completedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

// Indexes for better query performance
activitySchema.index({ userId: 1, completedAt: -1 });
activitySchema.index({ userId: 1, type: 1 });
activitySchema.index({ completedAt: -1 });

// Virtual for calculating pace (min/km) if distance > 0
activitySchema.virtual('pace').get(function() {
  if (this.distance > 0) {
    return this.duration / this.distance;
  }
  return 0;
});

// Virtual for activity intensity based on heart rate
activitySchema.virtual('intensity').get(function() {
  if (!this.heartRate?.average) return 'unknown';
  
  const avgHR = this.heartRate.average;
  if (avgHR < 100) return 'light';
  if (avgHR < 140) return 'moderate';
  if (avgHR < 170) return 'vigorous';
  return 'maximum';
});

// Pre-save middleware to validate data consistency
activitySchema.pre('save', function(next) {
  // Ensure completedAt is not in the future
  if (this.completedAt > new Date()) {
    this.completedAt = new Date();
  }
  
  // Validate heart rate zones if provided
  if (this.heartRate?.max && this.heartRate?.average) {
    if (this.heartRate.average > this.heartRate.max) {
      const error = new Error('Average heart rate cannot be higher than max heart rate');
      return next(error);
    }
  }
  
  next();
});

// Static method to get activity types
activitySchema.statics.getActivityTypes = function() {
  return this.schema.paths.type.enumValues;
};

// Instance method to calculate total weight lifted (for workout type)
activitySchema.methods.getTotalWeightLifted = function() {
  if (this.type !== 'workout' || !this.exercises.length) return 0;
  
  return this.exercises.reduce((total, exercise) => {
    if (exercise.weight && exercise.sets && exercise.reps) {
      return total + (exercise.weight * exercise.sets * exercise.reps);
    }
    return total;
  }, 0);
};

// Transform output to include virtuals
activitySchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;