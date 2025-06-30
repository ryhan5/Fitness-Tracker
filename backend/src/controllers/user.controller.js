import User  from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = 'uploads/profiles';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to get user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Helper function to validate health metrics
const validateHealthMetrics = (metrics) => {
  const errors = [];
  
  if (metrics.weight && (metrics.weight < 1 || metrics.weight > 1000)) {
    errors.push('Weight must be between 1 and 1000 kg');
  }
  
  if (metrics.height && (metrics.height < 50 || metrics.height > 300)) {
    errors.push('Height must be between 50 and 300 cm');
  }
  
  if (metrics.bodyFat && (metrics.bodyFat < 0 || metrics.bodyFat > 100)) {
    errors.push('Body fat percentage must be between 0 and 100');
  }
  
  return errors;
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: {
        profile: user.profile,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessLevel,
      goals,
      gymMembership
    } = req.body;

    // Validation
    const errors = [];
    
    if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
      errors.push('Date of birth cannot be in the future');
    }
    
    if (height && (height < 50 || height > 300)) {
      errors.push('Height must be between 50 and 300 cm');
    }
    
    if (weight && (weight < 1 || weight > 1000)) {
      errors.push('Weight must be between 1 and 1000 kg');
    }
    
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      errors.push('Gender must be male, female, or other');
    }
    
    if (fitnessLevel && !['beginner', 'intermediate', 'advanced'].includes(fitnessLevel)) {
      errors.push('Fitness level must be beginner, intermediate, or advanced');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const user = await getUserById(req.user.id);
    
    // Update profile fields
    const updateFields = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      height,
      weight,
      fitnessLevel,
      goals,
      gymMembership
    };

    // Remove undefined fields
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        user.profile[key] = updateFields[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user.profile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Upload profile picture
export const uploadProfilePicture = [
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const user = await getUserById(req.user.id);
      
      // Delete old profile picture if exists
      if (user.profile.profilePicture) {
        try {
          await fs.unlink(user.profile.profilePicture);
        } catch (error) {
          console.warn('Could not delete old profile picture:', error.message);
        }
      }

      // Update user profile with new picture path
      user.profile.profilePicture = req.file.path;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: {
          profilePicture: req.file.path,
          filename: req.file.filename
        }
      });
    } catch (error) {
      // Clean up uploaded file if there was an error
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.warn('Could not delete uploaded file:', unlinkError.message);
        }
      }

      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];


// Get health metrics
export const getHealthMetrics = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    const healthMetrics = {
      height: user.profile.height,
      weight: user.profile.weight,
      bmi: null,
      lastUpdated: user.updatedAt
    };

    // Calculate BMI if both height and weight are available
    if (user.profile.height && user.profile.weight) {
      const heightInMeters = user.profile.height / 100;
      healthMetrics.bmi = parseFloat((user.profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }

    res.status(200).json({
      success: true,
      data: healthMetrics
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update health metrics
export const updateHealthMetrics = async (req, res) => {
  try {
    const { height, weight } = req.body;

    // Validation
    const errors = validateHealthMetrics({ height, weight });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const user = await getUserById(req.user.id);
    
    // Update health metrics
    if (height !== undefined) user.profile.height = height;
    if (weight !== undefined) user.profile.weight = weight;

    await user.save();

    // Calculate BMI
    let bmi = null;
    if (user.profile.height && user.profile.weight) {
      const heightInMeters = user.profile.height / 100;
      bmi = parseFloat((user.profile.weight / (heightInMeters * heightInMeters)).toFixed(1));
    }

    res.status(200).json({
      success: true,
      message: 'Health metrics updated successfully',
      data: {
        height: user.profile.height,
        weight: user.profile.weight,
        bmi,
        lastUpdated: user.updatedAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get user preferences
export const getUserPreferences = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user.profile.preferences || {
        units: 'metric',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
  try {
    const { units, language, timezone, notifications } = req.body;

    // Validation
    const errors = [];
    
    if (units && !['metric', 'imperial'].includes(units)) {
      errors.push('Units must be either metric or imperial');
    }
    
    if (timezone && typeof timezone !== 'string') {
      errors.push('Timezone must be a string');
    }
    
    if (notifications) {
      if (typeof notifications !== 'object') {
        errors.push('Notifications must be an object');
      } else {
        const { email, sms, push } = notifications;
        if (email !== undefined && typeof email !== 'boolean') {
          errors.push('Email notification setting must be a boolean');
        }
        if (sms !== undefined && typeof sms !== 'boolean') {
          errors.push('SMS notification setting must be a boolean');
        }
        if (push !== undefined && typeof push !== 'boolean') {
          errors.push('Push notification setting must be a boolean');
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    const user = await getUserById(req.user.id);
    
    // Initialize preferences if they don't exist
    if (!user.profile.preferences) {
      user.profile.preferences = {
        units: 'metric',
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      };
    }

    // Update preferences
    if (units !== undefined) user.profile.preferences.units = units;
    if (language !== undefined) user.profile.preferences.language = language;
    if (timezone !== undefined) user.profile.preferences.timezone = timezone;
    
    if (notifications) {
      if (notifications.email !== undefined) {
        user.profile.preferences.notifications.email = notifications.email;
      }
      if (notifications.sms !== undefined) {
        user.profile.preferences.notifications.sms = notifications.sms;
      }
      if (notifications.push !== undefined) {
        user.profile.preferences.notifications.push = notifications.push;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.profile.preferences
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const { password, confirmDelete } = req.body;

    // Require confirmation
    if (!confirmDelete || confirmDelete !== 'DELETE') {
      return res.status(400).json({
        success: false,
        message: 'Account deletion requires confirmation. Send confirmDelete: "DELETE"'
      });
    }

    const user = await getUserById(req.user.id);

    // Verify password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Delete profile picture if exists
    if (user.profile.profilePicture) {
      try {
        await fs.unlink(user.profile.profilePicture);
      } catch (error) {
        console.warn('Could not delete profile picture:', error.message);
      }
    }

    // Delete user account
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Export multer upload middleware for use in routes if needed
export { upload };