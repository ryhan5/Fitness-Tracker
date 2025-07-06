import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Get all users with pagination and filtering
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', isActive, role } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: 'i' } },
        { 'profile.firstName': { $regex: search, $options: 'i' } },
        { 'profile.lastName': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (role) {
      filter.role = role;
    }
    
    const users = await User.find(filter)
      .select('-password -refreshToken -emailVerificationToken -passwordResetToken')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalUsers = await User.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: skip + users.length < totalUsers,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const user = await User.findById(userId)
      .select('-password -refreshToken -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean value'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password -refreshToken -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({ isEmailVerified: false });
    
    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get users by fitness level
    const fitnessLevelStats = await User.aggregate([
      { $match: { 'profile.fitnessLevel': { $exists: true } } },
      { $group: { _id: '$profile.fitnessLevel', count: { $sum: 1 } } }
    ]);
    
    // Get users by gender
    const genderStats = await User.aggregate([
      { $match: { 'profile.gender': { $exists: true } } },
      { $group: { _id: '$profile.gender', count: { $sum: 1 } } }
    ]);
    
    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.find({
      createdAt: { $gte: sevenDaysAgo }
    }).select('email createdAt profile.firstName profile.lastName').sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        userStats: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          verified: verifiedUsers,
          unverified: unverifiedUsers,
          recentRegistrations: recentUsers
        },
        demographics: {
          fitnessLevel: fitnessLevelStats,
          gender: genderStats
        },
        recentActivity: {
          newRegistrations: recentRegistrations
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either "user" or "admin"'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password -refreshToken -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
};

// Verify user email (admin action)
export const verifyUserEmail = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isEmailVerified: true,
        emailVerificationToken: undefined 
      },
      { new: true }
    ).select('-password -refreshToken -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User email verified successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying user email',
      error: error.message
    });
  }
};

// Reset user password (admin action)
export const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }
    
    // Hash the new password
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        password: hashedPassword,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        loginAttempts: 0,
        lockUntil: undefined
      },
      { new: true }
    ).select('-password -refreshToken -emailVerificationToken -passwordResetToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User password reset successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting user password',
      error: error.message
    });
  }
};

// Bulk user operations
export const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, action, value } = req.body;
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'userIds must be a non-empty array'
      });
    }
    
    // Validate all user IDs
    const invalidIds = userIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid user IDs: ${invalidIds.join(', ')}`
      });
    }
    
    let updateOperation = {};
    
    switch (action) {
      case 'activate':
        updateOperation = { isActive: true };
        break;
      case 'deactivate':
        updateOperation = { isActive: false };
        break;
      case 'verify':
        updateOperation = { isEmailVerified: true, emailVerificationToken: undefined };
        break;
      case 'changeRole':
        if (!['user', 'admin'].includes(value)) {
          return res.status(400).json({
            success: false,
            message: 'Role must be either "user" or "admin"'
          });
        }
        updateOperation = { role: value };
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: activate, deactivate, verify, changeRole'
        });
    }
    
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateOperation
    );
    
    res.status(200).json({
      success: true,
      message: `Bulk operation completed successfully`,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error performing bulk operation',
      error: error.message
    });
  }
};