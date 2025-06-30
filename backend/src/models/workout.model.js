// // models/Exercise.js
// import mongoose from 'mongoose';

// const exerciseSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full-body']
//   },
//   targetMuscles: [{
//     type: String,
//     required: true
//   }],
//   equipment: [{
//     type: String,
//     required: true
//   }],
//   difficulty: {
//     type: String,
//     enum: ['beginner', 'intermediate', 'advanced'],
//     default: 'beginner'
//   },
//   instructions: [String],
//   videoUrl: String,
//   imageUrl: String
// }, {
//   timestamps: true
// });

// export const Exercise = mongoose.model('Exercise', exerciseSchema);

// // models/WorkoutPlan.js
// const workoutPlanSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   difficulty: {
//     type: String,
//     enum: ['beginner', 'intermediate', 'advanced'],
//     required: true
//   },
//   duration: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 52 // weeks
//   },
//   targetMuscles: [{
//     type: String,
//     required: true
//   }],
//   equipment: [{
//     type: String,
//     required: true
//   }],
//   schedule: [{
//     day: {
//       type: String,
//       required: true,
//       enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
//     },
//     exercises: [{
//       exerciseId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Exercise',
//         required: true
//       },
//       sets: {
//         type: Number,
//         required: true,
//         min: 1
//       },
//       reps: {
//         type: String,
//         required: true // "8-12" or "10"
//       },
//       weight: {
//         type: String,
//         default: 'progressive' // "progressive" or specific weight like "50kg"
//       },
//       restTime: {
//         type: Number,
//         default: 60 // seconds
//       },
//       notes: {
//         type: String,
//         default: ''
//       }
//     }]
//   }],
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true
// });

// export const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);

// // models/WorkoutSession.js
// const workoutSessionSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   workoutPlanId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'WorkoutPlan',
//     required: true
//   },
//   day: {
//     type: String,
//     required: true
//   },
//   startTime: {
//     type: Date,
//     required: true
//   },
//   endTime: {
//     type: Date
//   },
//   status: {
//     type: String,
//     enum: ['in-progress', 'completed', 'skipped'],
//     default: 'in-progress'
//   },
//   exercises: [{
//     exerciseId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Exercise',
//       required: true
//     },
//     sets: [{
//       setNumber: {
//         type: Number,
//         required: true
//       },
//       reps: {
//         type: Number,
//         required: true
//       },
//       weight: {
//         type: Number // actual weight used
//       },
//       restTime: {
//         type: Number // actual rest time taken
//       },
//       completed: {
//         type: Boolean,
//         default: false
//       }
//     }]
//   }],
//   totalDuration: {
//     type: Number // in minutes
//   },
//   notes: {
//     type: String
//   }
// }, {
//   timestamps: true
// });

// export const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

import mongoose from 'mongoose';

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['strength', 'cardio', 'flexibility', 'balance', 'sports']
  },
  targetMuscles: [{
    type: String,
    enum: [
      'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms',
      'core', 'abs', 'obliques', 'quadriceps', 'hamstrings', 'glutes',
      'calves', 'full-body', 'cardio-system'
    ]
  }],
  equipment: [{
    type: String,
    enum: [
      'bodyweight', 'dumbbells', 'barbell', 'kettlebell', 'resistance-bands',
      'pull-up-bar', 'bench', 'machine', 'cable', 'medicine-ball',
      'foam-roller', 'yoga-mat', 'none'
    ]
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: [{
    type: String,
    required: true
  }],
  tips: [String],
  caloriesPerMinute: {
    type: Number,
    min: 0,
    default: 5
  },
  imageUrl: String,
  videoUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Workout Plan Schema
const workoutPlanExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    min: 1
  },
  duration: {
    type: Number, // in seconds, for time-based exercises
    min: 1
  },
  weight: {
    type: Number,
    min: 0
  },
  restTime: {
    type: Number, // in seconds
    default: 60
  },
  notes: String
}, { _id: false });

const workoutDaySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  exercises: [workoutPlanExerciseSchema],
  estimatedDuration: {
    type: Number, // in minutes
    default: 0
  }
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: Number, // weeks
    required: true,
    min: 1,
    max: 52
  },
  schedule: [workoutDaySchema],
  goals: [{
    type: String,
    enum: ['weight-loss', 'muscle-gain', 'strength', 'endurance', 'flexibility', 'general-fitness']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Workout Session Schema
const workoutSessionSetSchema = new mongoose.Schema({
  setNumber: {
    type: Number,
    required: true,
    min: 1
  },
  reps: {
    type: Number,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  duration: {
    type: Number, // seconds
    min: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  notes: String
}, { _id: false });

const workoutSessionExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  sets: [workoutSessionSetSchema],
  totalWeight: {
    type: Number,
    default: 0
  },
  totalReps: {
    type: Number,
    default: 0
  },
  totalDuration: {
    type: Number, // seconds
    default: 0
  }
}, { _id: false });

const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  workoutPlanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan',
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: Date,
  totalDuration: {
    type: Number, // minutes
    default: 0
  },
  exercises: [workoutSessionExerciseSchema],
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'cancelled'],
    default: 'in-progress'
  },
  caloriesBurned: {
    type: Number,
    min: 0,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
// exerciseSchema.index({ name: 1 });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ targetMuscles: 1 });
exerciseSchema.index({ difficulty: 1 });

workoutPlanSchema.index({ userId: 1, isActive: 1 });
workoutPlanSchema.index({ userId: 1, createdAt: -1 });

workoutSessionSchema.index({ userId: 1, startTime: -1 });
workoutSessionSchema.index({ workoutPlanId: 1 });
workoutSessionSchema.index({ status: 1 });

// Create models
const Exercise = mongoose.model('Exercise', exerciseSchema);
const WorkoutPlan = mongoose.model('WorkoutPlan', workoutPlanSchema);
const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

export { Exercise, WorkoutPlan, WorkoutSession };