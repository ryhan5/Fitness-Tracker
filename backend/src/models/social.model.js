import mongoose from 'mongoose';

// Challenge Schema
const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    required: true,
    enum: ['individual', 'group'],
    default: 'individual'
  },
  category: {
    type: String,
    required: true,
    enum: ['steps', 'workout', 'diet', 'water', 'sleep', 'meditation', 'running', 'cycling', 'strength'],
    index: true
  },
  target: {
    metric: {
      type: String,
      required: true,
      enum: ['steps', 'calories', 'workouts', 'distance', 'duration', 'weight', 'count']
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      enum: ['steps', 'calories', 'km', 'miles', 'minutes', 'hours', 'kg', 'lbs', 'count', 'liters']
    }
  },
  duration: {
    start: {
      type: Date,
      required: true,
      default: Date.now
    },
    end: {
      type: Date,
      required: true,
      validate: {
        validator: function(v) {
          return v > this.duration.start;
        },
        message: 'End date must be after start date'
      }
    }
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0
    },
    completed: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  rewards: [{
    type: {
      type: String,
      enum: ['badge', 'points', 'trophy'],
      required: true
    },
    value: {
      type: String,
      required: true
    },
    criteria: {
      type: String,
      required: true,
      enum: ['completion', 'top_3', 'winner', 'participation']
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Indexes for better performance
challengeSchema.index({ category: 1, isActive: 1 });
challengeSchema.index({ 'duration.start': 1, 'duration.end': 1 });
challengeSchema.index({ 'participants.userId': 1 });

// Virtual for days remaining
challengeSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = this.duration.end;
  if (end <= now) return 0;
  return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
});

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['badge', 'milestone', 'trophy', 'streak'],
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
    required: true,
    maxlength: 300
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['fitness', 'nutrition', 'consistency', 'social', 'challenge', 'milestone'],
    index: true
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: {
      type: Number,
      default: 0,
      min: 0
    },
    target: {
      type: Number,
      required: true,
      min: 1
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    default: null
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Compound indexes
achievementSchema.index({ userId: 1, category: 1 });
achievementSchema.index({ userId: 1, earnedAt: -1 });

// Pre-save middleware to calculate percentage
achievementSchema.pre('save', function(next) {
  if (this.progress.target > 0) {
    this.progress.percentage = Math.min(
      Math.round((this.progress.current / this.progress.target) * 100),
      100
    );
  }
  next();
});

// Friend Schema for social features
const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending',
    index: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  acceptedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Compound index for friendship queries
friendSchema.index({ userId: 1, friendId: 1 }, { unique: true });
friendSchema.index({ userId: 1, status: 1 });

// Static methods for Challenge model
challengeSchema.statics.getActivechallenges = function(category = null) {
  const query = { isActive: true };
  if (category) query.category = category;
  return this.find(query).populate('createdBy', 'name avatar').sort({ createdAt: -1 });
};

challengeSchema.statics.getUserChallenges = function(userId) {
  return this.find({ 
    'participants.userId': userId,
    isActive: true 
  }).populate('createdBy', 'name avatar');
};

// Instance method to check if user can join
challengeSchema.methods.canUserJoin = function(userId) {
  const now = new Date();
  const alreadyJoined = this.participants.some(p => p.userId.toString() === userId.toString());
  const hasStarted = now >= this.duration.start;
  const hasEnded = now >= this.duration.end;
  const isFull = this.maxParticipants && this.participants.length >= this.maxParticipants;
  
  return !alreadyJoined && !hasEnded && this.isActive && !isFull;
};

// Static method for Friend model
friendSchema.statics.getFriendsList = function(userId) {
  return this.find({
    $or: [
      { userId: userId, status: 'accepted' },
      { friendId: userId, status: 'accepted' }
    ]
  }).populate('userId friendId', 'name avatar email');
};

export const Challenge = mongoose.model('Challenge', challengeSchema);
export const Achievement = mongoose.model('Achievement', achievementSchema);
export const Friend = mongoose.model('Friend', friendSchema);