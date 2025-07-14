import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema({
  units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
  language: { type: String, default: 'en' },
  timezone: { type: String, default: 'UTC' },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  }
}, { _id: false });

const profileSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: Number, // in cm
  weight: Number, // in kg
  profilePicture: String,
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  goals: [String], // consider enum validation if goals are fixed
  gymMembership: Boolean,
  bmi: Number, 
  preferences: preferencesSchema
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  profile: profileSchema,

  // Authentication fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  
  // Password reset fields
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // JWT refresh token
  refreshToken: String,
  
  // User role (optional for admin features)
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Login tracking
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date

}, {
  timestamps: true // adds createdAt and updatedAt
});

// Index for better query performance
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Virtual for account lockout
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Methods
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;